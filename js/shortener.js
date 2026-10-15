/* Home page: shorten a link with our own link service, then draw a QR code for the short link in the browser. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var form = $('shortenForm'); if (!form) return;
  var input = $('longUrl'), alias = $('alias'), status = $('status'), btn = $('shortenBtn');
  var result = $('result'), shortLink = $('shortLink'), resLong = $('resLong'), canvas = $('qrCanvas');
  var copyBtn = $('copyBtn'), openLink = $('openLink');
  var recentBox = $('recent'), recentList = $('recentList'), clearRecent = $('clearRecent');
  var STORE = 'urlshort:v1';
  var current = null;

  function say(msg, kind) { status.textContent = msg || ''; status.className = 'status' + (kind ? ' ' + kind : ''); }

  // ---- input handling
  function normalise(raw) {
    var s = String(raw || '').trim();
    if (!s) return { error: 'Paste a link first.' };
    if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(s)) s = 'https://' + s;
    var u;
    try { u = new URL(s); } catch (e) { return { error: 'That does not look like a web address.' }; }
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return { error: 'Only http and https links can be shortened.' };
    if (u.hostname.indexOf('.') < 1) return { error: 'That web address looks incomplete. Add a domain such as example.com.' };
    return { url: u.href };
  }

  // ---- storage (a small history kept only in this browser)
  function load() { try { return JSON.parse(localStorage.getItem(STORE)) || { cache: {}, recent: [] }; } catch (e) { return { cache: {}, recent: [] }; } }
  function save(d) { try { localStorage.setItem(STORE, JSON.stringify(d)); } catch (e) { /* private mode: ignore */ } }

  // ---- our own link service (Cloudflare Worker, address set in _config.yml as shortener_api)
  var API = window.URLSHORT_API || '';
  function request(longUrl, custom) {
    if (!API) { var e0 = new Error('setup'); e0.setup = true; return Promise.reject(e0); }
    var ctl = ('AbortController' in window) ? new AbortController() : null;
    var t = setTimeout(function () { if (ctl) ctl.abort(); }, 10000);
    // text/plain keeps this a "simple" request, so the browser needs no extra preflight round trip
    return fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, body: JSON.stringify({ url: longUrl, alias: custom || '' }), signal: ctl ? ctl.signal : undefined })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        clearTimeout(t);
        if (d && d.shorturl) return d.shorturl;
        var e = new Error('api'); e.code = d && d.errorcode; e.api = d && d.errormessage; throw e;
      }, function (err) { clearTimeout(t); throw err; });
  }

  function explain(err) {
    if (err && err.setup) return 'The link service is not connected yet. Add its address to shortener_api in _config.yml.';
    if (err && err.code === 1) return (err.api || 'That link was not accepted.');
    if (err && err.code === 2) return (err.api || 'That custom ending is not available.') + ' Use 5 to 30 letters, numbers or underscores.';
    if (err && err.code === 3) return err.api || 'Too many requests. Try again later.';
    if (err && err.code === 4) return 'The service is busy. Try again in a moment.';
    return 'Could not reach the link service. Check your connection and try again.';
  }

  // ---- UI
  function drawQR(shortUrl) {
    try { QRTool.draw(canvas, shortUrl, { size: 480, level: 'M', fg: '#0e1320', bg: '#ffffff' }); canvas.style.visibility = 'visible'; }
    catch (e) { canvas.style.visibility = 'hidden'; }
  }
  function show(longUrl, shortUrl) {
    current = shortUrl;
    shortLink.textContent = shortUrl.replace(/^https?:\/\//, '');
    shortLink.href = shortUrl; openLink.href = shortUrl;
    resLong.textContent = longUrl; resLong.title = longUrl;
    drawQR(shortUrl);
    result.hidden = false;
    copyBtn.textContent = 'Copy link';
  }
  function renderRecent() {
    var r = load().recent;
    recentList.innerHTML = '';
    recentBox.hidden = !r.length;
    r.forEach(function (it) {
      var li = document.createElement('li'), a = document.createElement('a'), sp = document.createElement('span'), b = document.createElement('button');
      a.href = it.short; a.target = '_blank'; a.rel = 'noopener'; a.textContent = it.short.replace(/^https?:\/\//, '');
      sp.textContent = it.long; sp.title = it.long;
      b.type = 'button'; b.textContent = 'Show QR'; b.addEventListener('click', function () { show(it.long, it.short); result.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); });
      li.appendChild(a); li.appendChild(sp); li.appendChild(b); recentList.appendChild(li);
    });
  }
  function remember(longUrl, shortUrl, custom) {
    var d = load();
    d.cache[longUrl + '|' + (custom || '')] = shortUrl;
    d.recent = [{ long: longUrl, short: shortUrl }].concat(d.recent.filter(function (x) { return x.short !== shortUrl; })).slice(0, 5);
    var keys = Object.keys(d.cache); if (keys.length > 60) delete d.cache[keys[0]];
    save(d); renderRecent();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var n = normalise(input.value);
    if (n.error) { say(n.error, 'err'); input.focus(); return; }
    var custom = alias ? alias.value.trim() : '';
    if (custom && !/^[A-Za-z0-9_]{5,30}$/.test(custom)) { say('A custom ending needs 5 to 30 letters, numbers or underscores.', 'err'); alias.focus(); return; }
    var hit = load().cache[n.url + '|' + custom];      // the same link is not shortened twice
    if (hit) { show(n.url, hit); say('Here is the short link you made before.', 'ok'); return; }
    btn.disabled = true; btn.textContent = 'Shortening…'; say('Contacting the shortening service…');
    request(n.url, custom).then(function (shortUrl) {
      show(n.url, shortUrl); remember(n.url, shortUrl, custom); say('Done. Your short link is ready.', 'ok');
    }, function (err) { say(explain(err), 'err'); })
    .then(function () { btn.disabled = false; btn.textContent = 'Shorten link'; });
  });

  copyBtn.addEventListener('click', function () {
    if (!current) return;
    function done() { copyBtn.textContent = 'Copied'; say('Link copied.', 'ok'); }
    function fallback() {
      var t = document.createElement('textarea'); t.value = current; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select(); try { document.execCommand('copy'); done(); } catch (e) { say('Press Ctrl+C to copy: ' + current); } document.body.removeChild(t);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(current).then(done, fallback); else fallback();
  });
  $('dlPng').addEventListener('click', function () { if (current) QRTool.downloadPNG(current, { size: 1024, level: 'M', fg: '#000000', bg: '#ffffff' }, 'urlshort-qr.png'); });
  $('dlSvg').addEventListener('click', function () { if (current) QRTool.downloadSVG(current, { size: 1024, level: 'M', fg: '#000000', bg: '#ffffff' }, 'urlshort-qr.svg'); });
  if (clearRecent) clearRecent.addEventListener('click', function () { save({ cache: {}, recent: [] }); renderRecent(); });
  renderRecent();
})();
