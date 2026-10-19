// urlshort.tr link service: runs free on Cloudflare Workers, stores links in Workers KV.
//   POST /api/shorten   body: {"url":"https://...","alias":"optional"}  ->  {"shorturl":"https://urlshort.tr/abc123"}
//   GET  /abc123        -> 302 redirect to the saved address (never indexed by search engines)
//   GET  /abc123+       -> preview page that shows where the link goes
// Settings (Worker -> Settings -> Variables and Secrets):
//   ALLOWED_ORIGINS  https://urlshort.tr,https://www.urlshort.tr
//   PUBLIC_BASE      https://urlshort.tr
//   PASSTHROUGH      1            (all other pages are fetched from the website)
//   BLOCKED_DOMAINS  (optional) comma list of domains you want to refuse, e.g. badsite.com,spam.example
//   GSB_KEY          (optional, secret) Google Safe Browsing API key: refuses links Google lists as dangerous
// KV namespace binding name: LINKS
// Click counter (optional): a D1 database bound under the name DB with one table:
//   CREATE TABLE IF NOT EXISTS clicks (code TEXT PRIMARY KEY, n INTEGER NOT NULL DEFAULT 0);
//   GET /api/stats?code=abc123  -> {"code":"abc123","clicks":12}   (only a number is stored, never IP addresses)
// Without the DB binding everything else keeps working and the counter simply shows nothing.

const ALPHA = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const RESERVED = new Set(['api', 'admin', 'blog', 'css', 'js', 'about', 'contact', 'privacy', 'terms', 'disclaimer',
  'editorial', 'robots', 'sitemap', 'favicon', 'ads', 'index', 'static', 'assets', 'login', 'signup', 'settings', 'report', 'check', 'stats', 'link-click-counter']);
const SHORTENERS = ['bit.ly', 'bitly.com', 'tinyurl.com', 'is.gd', 'v.gd', 't.co', 'goo.gl', 'ow.ly', 'cutt.ly', 'rb.gy', 'shorturl.at',
  'tiny.cc', 'adf.ly', 'shorte.st', 'buff.ly', 'lnkd.in', 'rebrand.ly', 'urlshort.tr', 'workers.dev', 'pages.dev', 'github.io'];
// words that make a short ending look like phishing
const BAD_ALIAS = /(paypal|google|gmail|apple|icloud|amazon|microsoft|office365|netflix|facebook|instagram|whatsapp|binance|coinbase|metamask|wallet|bank|secure|verify|account|password|signin|login|support|refund|prize|giveaway|airdrop|crypto)/i;
const RATE_PER_HOUR = 30;
const RATE_PER_MINUTE = 6;
// link-preview and search robots are not real visitors, so they are not counted as clicks
const BOT = /(bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|discord|skype|curl|wget|python|java\/|go-http|okhttp|headless)/i;

async function countClick(env, code) {
  if (!env.DB) return;
  try { await env.DB.prepare('INSERT INTO clicks (code, n) VALUES (?, 1) ON CONFLICT(code) DO UPDATE SET n = n + 1').bind(code).run(); } catch (e) {}
}
async function readClicks(env, code) {
  if (!env.DB) return null;
  try { const r = await env.DB.prepare('SELECT n FROM clicks WHERE code = ?').bind(code).first(); return r ? r.n : 0; } catch (e) { return null; }
}
async function stats(req, env, url, cors) {
  const ip = req.headers.get('CF-Connecting-IP') || 'x';
  if ((await bump('s:' + ip + ':' + Math.floor(Date.now() / 60000), 60)) > 30) return fail(3, 'Too many requests. Try again in a minute.', 429, cors);
  const code = String(url.searchParams.get('code') || '').trim();
  if (!/^[A-Za-z0-9_]{5,30}$/.test(code)) return fail(1, 'That is not a short link ending.', 400, cors);
  if (!(await env.LINKS.get('l:' + code))) return fail(5, 'No short link with that ending was found.', 404, cors);
  const n = await readClicks(env, code);
  if (n === null) return fail(6, 'The click counter is not switched on yet.', 503, cors);
  return json({ code, clicks: n }, 200, cors);
}

function json(body, status, extra) {
  return new Response(JSON.stringify(body), { status: status || 200, headers: Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }, extra || {}) });
}
const fail = (code, msg, status, h) => json({ errorcode: code, errormessage: msg }, status || 400, h);

function allowedOrigins(env) { return String(env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean); }
function corsFor(req, env) {
  const origin = req.headers.get('Origin') || '';
  return allowedOrigins(env).includes(origin) ? { 'Access-Control-Allow-Origin': origin, 'Vary': 'Origin', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } : {};
}

function blockedDomain(h, env) {
  const list = String(env.BLOCKED_DOMAINS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  return list.some(d => h === d || h.endsWith('.' + d));
}

function checkTarget(raw, selfHost, env) {
  let u;
  try { u = new URL(String(raw || '').trim()); } catch (e) { return 'That does not look like a web address.'; }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return 'Only http and https links can be shortened.';
  if (u.href.length > 2048) return 'That address is too long.';
  if (u.username || u.password) return 'Addresses that contain a user name or password are not accepted.';
  const h = u.hostname.toLowerCase();
  if (h.indexOf('.') < 1 || /^[0-9.]+$/.test(h) || h.includes(':') || h === 'localhost' || h.endsWith('.local') || h.endsWith('.internal')) return 'That web address is not accepted.';
  if (h.split('.').some(p => p.startsWith('xn--'))) return 'Addresses with look-alike international characters are not accepted.';
  if (h === selfHost || SHORTENERS.some(s => h === s || h.endsWith('.' + s))) return 'Links to other short-link services are not accepted.';
  if (blockedDomain(h, env)) return 'That web address is not accepted.';
  return '';
}

// Google Safe Browsing (optional). Fails open: if the check itself fails, the link is still allowed.
async function unsafeByGoogle(url, env) {
  if (!env.GSB_KEY) return false;
  try {
    const r = await fetch('https://safebrowsing.googleapis.com/v4/threatMatches:find?key=' + encodeURIComponent(env.GSB_KEY), {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client: { clientId: 'urlshort-tr', clientVersion: '1.0' }, threatInfo: {
        threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
        platformTypes: ['ANY_PLATFORM'], threatEntryTypes: ['URL'], threatEntries: [{ url }] } })
    });
    const d = await r.json();
    return !!(d && d.matches && d.matches.length);
  } catch (e) { return false; }
}

// Rate limiting without KV writes (KV's free plan allows only 1000 writes a day, so counters must not use it).
// Uses the data-centre cache: not perfectly global, but enough to stop floods.
async function bump(key, ttl) {
  const cache = caches.default, req = new Request('https://rate.invalid/' + key);
  const hit = await cache.match(req);
  const n = hit ? parseInt(await hit.text(), 10) || 0 : 0;
  await cache.put(req, new Response(String(n + 1), { headers: { 'Cache-Control': 'max-age=' + ttl } }));
  return n + 1;
}
async function limited(req) {
  const ip = req.headers.get('CF-Connecting-IP') || 'x';
  const hour = await bump('h:' + ip + ':' + Math.floor(Date.now() / 3600000), 3600);
  if (hour > RATE_PER_HOUR) return true;
  const min = await bump('m:' + ip + ':' + Math.floor(Date.now() / 60000), 60);
  return min > RATE_PER_MINUTE;
}

function randomCode(len) {
  const b = new Uint8Array(len); crypto.getRandomValues(b);
  return Array.from(b, x => ALPHA[x % ALPHA.length]).join('');
}

async function shorten(req, env, base, selfHost, cors) {
  const origin = req.headers.get('Origin') || '';
  if (!allowedOrigins(env).includes(origin)) return fail(1, 'This request is not allowed.', 403, cors);
  const ct = (req.headers.get('Content-Type') || '').toLowerCase();
  if (!ct.startsWith('text/plain') && !ct.startsWith('application/json')) return fail(1, 'This request is not allowed.', 415, cors);
  let text = await req.text();
  if (text.length > 4000) return fail(1, 'That request is too large.', 413, cors);
  let data;
  try { data = JSON.parse(text); } catch (e) { return fail(1, 'Send the address as JSON.', 400, cors); }
  const bad = checkTarget(data && data.url, selfHost, env);
  if (bad) return fail(1, bad, 400, cors);
  if (await limited(req)) return fail(3, 'Too many links from this connection. Try again in an hour.', 429, cors);
  const target = new URL(String(data.url).trim()).href;
  if (await unsafeByGoogle(target, env)) return fail(1, 'That link was not accepted because it is reported as unsafe.', 400, cors);
  const alias = String((data && data.alias) || '').trim();
  let code;
  if (alias) {
    if (!/^[A-Za-z0-9_]{5,30}$/.test(alias) || RESERVED.has(alias.toLowerCase()) || BAD_ALIAS.test(alias)) return fail(2, 'That custom ending is not allowed.', 400, cors);
    if (await env.LINKS.get('l:' + alias)) return fail(2, 'That custom ending is already taken.', 409, cors);
    code = alias;
  } else {
    for (let i = 0; i < 6 && !code; i++) { const c = randomCode(6); if (!(await env.LINKS.get('l:' + c))) code = c; }
    if (!code) return fail(4, 'Busy, try again.', 503, cors);
  }
  await env.LINKS.put('l:' + code, target);
  return json({ shorturl: base + '/' + code }, 200, cors);
}

// extra protection headers for the pages of the website itself
function harden(res) {
  const h = new Headers(res.headers);
  h.set('X-Content-Type-Options', 'nosniff');
  h.set('X-Frame-Options', 'SAMEORIGIN');
  h.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  h.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
  h.set('Strict-Transport-Security', 'max-age=15552000');
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
}

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    const base = String(env.PUBLIC_BASE || url.origin).replace(/\/+$/, '');
    const selfHost = new URL(base).hostname;
    const cors = corsFor(req, env);
    const pass = env.PASSTHROUGH === '1';

    if (url.pathname === '/api/shorten') {
      if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
      if (req.method !== 'POST') return fail(4, 'Use POST.', 405, cors);
      return shorten(req, env, base, selfHost, cors);
    }
    if (url.pathname === '/api/stats') {
      if (req.method !== 'GET') return fail(4, 'Use GET.', 405, cors);
      return stats(req, env, url, cors);
    }
    const m = /^\/([A-Za-z0-9_]{5,30})\/?$/.exec(url.pathname);
    if (m && (req.method === 'GET' || req.method === 'HEAD') && !RESERVED.has(m[1].toLowerCase())) {
      const target = await env.LINKS.get('l:' + m[1]);
      if (target) {
        if (req.method === 'GET' && !BOT.test(req.headers.get('User-Agent') || '')) ctx.waitUntil(countClick(env, m[1]));
        return new Response(null, { status: 302, headers: { Location: target, 'Cache-Control': 'private, max-age=0', 'Referrer-Policy': 'no-referrer', 'X-Robots-Tag': 'noindex, nofollow' } });
      }
    }
const pv = /^\/([A-Za-z0-9_]{5,30})\+$/.exec(url.pathname);
    if (pv && req.method === 'GET') {
      const target = await env.LINKS.get('l:' + pv[1]);
      if (target) {
        const clicks = await readClicks(env, pv[1]);
        const esc = target.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        const page = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Where this link goes</title>' +
          '<style>body{font:18px/1.5 system-ui,sans-serif;max-width:40rem;margin:12vh auto;padding:0 20px;color:#14183a}code{display:block;word-break:break-all;background:#f1f3ff;padding:14px;border-radius:10px;margin:14px 0}a{color:#2a44f5;font-weight:700}</style></head><body>' +
          '<h1>Where this link goes</h1><p>The short link <b>' + base.replace(/^https?:\/\//, '') + '/' + pv[1] + '</b> sends you to:</p><code>' + esc + '</code>' + (clicks === null ? '' : '<p>Clicks so far: <b>' + clicks + '</b></p>') +
          '<p>Only continue if you trust this address.</p><p><a href="' + esc + '" rel="noopener noreferrer nofollow">Continue to the site</a></p></body></html>';
        return new Response(page, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex', 'Referrer-Policy': 'no-referrer' } });
      }
    }
    if (pass) return harden(await fetch(req));
    return new Response(url.pathname === '/' ? 'urlshort.tr link service is running.' : 'Short link not found.', { status: url.pathname === '/' ? 200 : 404, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Robots-Tag': 'noindex' } });
  }
};
