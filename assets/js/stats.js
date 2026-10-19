(function () {
  var f = document.getElementById('stats-form'); if (!f) return;
  var inp = document.getElementById('stats-input'), out = document.getElementById('stats-out');
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = inp.value.trim().replace(/[?#].*$/, '').replace(/\/+$/, '').replace(/\+$/, '');
    var code = v.split('/').pop();
    out.textContent = 'Checking...';
    fetch('/api/stats?code=' + encodeURIComponent(code)).then(function (r) { return r.json(); }).then(function (d) {
      if (d && typeof d.clicks === 'number') out.textContent = 'This short link has ' + d.clicks + ' click' + (d.clicks === 1 ? '' : 's') + ' so far.';
      else out.textContent = (d && d.errormessage) || 'Something went wrong. Please try again.';
    }).catch(function () { out.textContent = 'Could not reach the service. Please try again.'; });
  });
})();
