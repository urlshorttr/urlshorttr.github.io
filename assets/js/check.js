/* Open the preview page (short link + "+") for links that belong to this site. */
(function () {
  'use strict';
  var T = window.T || {}, f = document.getElementById('checkForm'); if (!f) return;
  var inp = document.getElementById('checkUrl'), st = document.getElementById('status');
  function say(m, k) { st.textContent = m; st.className = 'status' + (k ? ' ' + k : ''); }
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var s = inp.value.trim(); if (!s) { say(T.chk_paste, 'err'); return; }
    if (!/^https?:\/\//i.test(s)) s = 'https://' + s;
    var u; try { u = new URL(s); } catch (x) { say(T.chk_invalid, 'err'); return; }
    var h = u.hostname.replace(/^www\./, '');
    if (h !== 'urlshort.tr' && h !== location.hostname.replace(/^www\./, '')) { say(T.chk_only, 'err'); return; }
    var path = u.pathname.replace(/\+$/, '');
    if (path.length < 2) { say(T.chk_invalid, 'err'); return; }
    say(T.chk_opening, 'ok');
    window.open(u.origin + path + '+', '_blank', 'noopener');
  });
})();
