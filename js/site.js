(function () {
  'use strict';
  var T = window.T || {}, L = window.LANGS || [], cur = document.documentElement.lang;
  var btn = document.querySelector('.menu-btn'), nav = document.getElementById('mainNav');
  if (btn && nav) btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.textContent = open ? T.close : T.menu;
  });
  var y = document.querySelector('.js-year'); if (y) y.textContent = new Date().getFullYear();
  var f = document.getElementById('contactForm');
  if (f) f.addEventListener('submit', function (e) {
    e.preventDefault();
    var n = f.elements.name.value.trim(), m = f.elements.email.value.trim(), t = f.elements.message.value.trim();
    window.location.href = 'mailto:' + (f.getAttribute('data-to') || '') + '?subject=' + encodeURIComponent('Message from ' + (n || 'a visitor')) +
      '&body=' + encodeURIComponent(t + '\n\n' + n + (m ? ' <' + m + '>' : ''));
  });
  // remember a language the visitor picked on purpose
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-setlang]');
    if (a) try { localStorage.setItem('urlshort:lang', a.getAttribute('data-setlang')); } catch (x) {}
  });
  // gentle suggestion: never redirects by itself
  try {
    if (!L.length || localStorage.getItem('urlshort:lang') || localStorage.getItem('urlshort:sg-no')) return;
    var want = (navigator.languages || [navigator.language || '']).map(function (s) { return String(s).toLowerCase().split('-')[0]; });
    var hit = null; for (var i = 0; i < want.length && !hit; i++) for (var j = 0; j < L.length; j++) if (L[j].code === want[i]) { hit = L[j]; break; }
    if (!hit || hit.code === cur) return;
    var bar = document.createElement('div'); bar.className = 'sg'; bar.setAttribute('role', 'region'); bar.setAttribute('aria-label', 'Language');
    bar.lang = hit.code; bar.dir = hit.dir || 'ltr';
    var a = document.createElement('a'); a.className = 'btn'; a.href = hit.url; a.setAttribute('data-setlang', hit.code); a.textContent = hit.switch_label;
    var no = document.createElement('button'); no.type = 'button'; no.className = 'linkish'; no.textContent = hit.dismiss_label;
    no.addEventListener('click', function () { try { localStorage.setItem('urlshort:sg-no', '1'); } catch (x) {} bar.remove(); });
    bar.appendChild(a); bar.appendChild(no); document.body.insertBefore(bar, document.body.firstChild);
  } catch (x) {}
})();
