/* Home page: send the link to our own link service, then draw the QR code in the browser. */
(function () {
  'use strict';
  var T = window.T || {}, API = window.URLSHORT_API || '';
  var $ = function (id) { return document.getElementById(id); };
  var form = $('shortenForm'); if (!form) return;
  var input = $('longUrl'), alias = $('alias'), status = $('status'), btn = $('shortenBtn');
  var result = $('result'), shortLink = $('shortLink'), resLong = $('resLong'), canvas = $('qrCanvas');
  var copyBtn = $('copyBtn'), openLink = $('openLink');
  var recentBox = $('recent'), recentList = $('recentList'), clearRecent = $('clearRecent');
  var STORE = 'urlshort:v2', current = null;

  function say(msg, kind) { status.textContent = msg || ''; status.className = 'status' + (kind ? ' ' + kind : ''); }

  function normalise(raw) {
    var s = String(raw || '').trim();
    if (!s) return { error: T.paste_first };
    if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(s)) s = 'https://' + s;
    var u;
    try { u = new URL(s); } catch (e) { return { error: T.not_address }; }
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return { error: T.only_http };
    if (u.hostname.indexOf('.') < 1) return { error: T.incomplete };
    return { url: u.href };
  }
  function load() { try { return JSON.parse(localStorage.getItem(STORE)) || { cache: {}, recent: [] }; } catch (e) { return { cache: {}, recent: [] }; } }
  function save(d) { try { localStorage.setItem(STORE, JSON.stringify(d)); } catch (e) {} }

  function request(longUrl, custom) {
    if (!API) return Promise.reject({ code: 'setup' });
    var ctl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 10000);
    var body = JSON.stringify({ url: longUrl, alias: custom || '' });
    return fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, body: body, signal: ctl ? ctl.signal : undefined })
      .then(function (r) { return r.json(); })
      .then(function (d) { clearTimeout(timer); if (d && d.shorturl) return d.shorturl; throw { code: d && d.errorcode }; },
            function () { clearTimeout(timer); throw { code: 'net' }; });
  }
  function explain(e) {
    var c = e && e.code;
    if (c === 'setup') return T.setup;
    if (c === 1) return T.err1; if (c === 2) return T.err2; if (c === 3) return T.err3; if (c === 4) return T.err4;
    return T.net;
  }

  function drawQR(u) {
    try { QRTool.draw(canvas, u, { size: 480, level: 'M', fg: '#0e1320', bg: '#ffffff' }); canvas.style.visibility = 'visible'; }
    catch (e) { canvas.style.visibility = 'hidden'; }
  }
  function show(longUrl, shortUrl) {
    current = shortUrl;
    shortLink.textContent = shortUrl.replace(/^https?:\/\//, '');
    shortLink.href = shortUrl; openLink.href = shortUrl;
    resLong.textContent = longUrl; resLong.title = longUrl;
    drawQR(shortUrl); result.hidden = false; copyBtn.textContent = T.copy;
  }
  function renderRecent() {
    var r = load().recent; recentList.innerHTML = ''; recentBox.hidden = !r.length;
    r.forEach(function (it) {
      var li = document.createElement('li'), a = document.createElement('a'), sp = document.createElement('span'), b = document.createElement('button');
      a.href = it.short; a.target = '_blank'; a.rel = 'noopener'; a.textContent = it.short.replace(/^https?:\/\//, '');
      sp.textContent = it.long; sp.title = it.long; sp.dir = 'ltr';
      b.type = 'button'; b.textContent = T.show_qr;
      b.addEventListener('click', function () { show(it.long, it.short); result.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); });
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
    if (custom && !/^[A-Za-z0-9_]{5,30}$/.test(custom)) { say(T.alias_bad, 'err'); alias.focus(); return; }
    var hit = load().cache[n.url + '|' + custom];
    if (hit) { show(n.url, hit); say(T.seen_before, 'ok'); return; }
    btn.disabled = true; btn.textContent = T.shortening; say(T.contacting);
    request(n.url, custom).then(function (u) { show(n.url, u); remember(n.url, u, custom); say(T.done, 'ok'); },
      function (err) { say(explain(err), 'err'); })
      .then(function () { btn.disabled = false; btn.textContent = T.btn_shorten; });
  });

  copyBtn.addEventListener('click', function () {
    if (!current) return;
    function done() { copyBtn.textContent = T.copied; say(T.link_copied, 'ok'); }
    function fallback() {
      var t = document.createElement('textarea'); t.value = current; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select(); try { document.execCommand('copy'); done(); } catch (e) { say(T.press_copy + current); } document.body.removeChild(t);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(current).then(done, fallback); else fallback();
  });
  var dlo = { size: 1024, level: 'M', fg: '#000000', bg: '#ffffff' };
  $('dlPng').addEventListener('click', function () { if (current) QRTool.downloadPNG(current, dlo, 'urlshort-qr.png'); });
  $('dlSvg').addEventListener('click', function () { if (current) QRTool.downloadSVG(current, dlo, 'urlshort-qr.svg'); });
  if (clearRecent) clearRecent.addEventListener('click', function () { save({ cache: {}, recent: [] }); renderRecent(); });
  renderRecent();
})();
