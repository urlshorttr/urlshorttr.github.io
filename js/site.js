(function () {
  'use strict';
  var btn = document.querySelector('.menu-btn'), nav = document.getElementById('mainNav');
  if (btn && nav) btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.textContent = open ? 'Close' : 'Menu';
  });
  var y = document.querySelector('.js-year'); if (y) y.textContent = new Date().getFullYear();
  var f = document.getElementById('contactForm');
  if (f) f.addEventListener('submit', function (e) {
    e.preventDefault();
    var to = f.getAttribute('data-to') || '';
    var n = f.elements.name.value.trim(), m = f.elements.email.value.trim(), t = f.elements.message.value.trim();
    var body = t + '\n\n' + n + (m ? ' <' + m + '>' : '');
    window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent('Message from ' + (n || 'a visitor')) + '&body=' + encodeURIComponent(body);
  });
})();
