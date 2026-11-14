(function () {
  var f = document.getElementById('wa-form'); if (!f) return;
  var cc = document.getElementById('wa-cc'), num = document.getElementById('wa-num'), msg = document.getElementById('wa-msg');
  var out = document.getElementById('wa-out'), box = document.getElementById('wa-result'), err = document.getElementById('wa-err');
  var canvas = document.getElementById('wa-qr'), copyBtn = document.getElementById('wa-copy'), test = document.getElementById('wa-test');
  var current = '';
  function build() {
    var local = num.value.replace(/\D/g, '').replace(/^0+/, '');
    var code = cc.value.replace(/\D/g, '');
    var all = code + local;
    err.textContent = ''; box.hidden = true; current = '';
    if (!local) return;
    if (all.length < 8 || all.length > 15) { err.textContent = 'Check the number. With the country code it should have 8 to 15 digits.'; return; }
    var link = 'https://wa.me/' + all;
    var text = msg.value.trim();
    if (text) link += '?text=' + encodeURIComponent(text);
    current = link; out.textContent = link; test.href = link; box.hidden = false;
    try { QRTool.draw(canvas, link, { size: 480, level: 'M', fg: '#0e1320', bg: '#ffffff' }); canvas.style.visibility = 'visible'; }
    catch (e) { canvas.style.visibility = 'hidden'; }
  }
  ['input', 'change'].forEach(function (ev) { f.addEventListener(ev, build); });
  f.addEventListener('submit', function (e) {
    e.preventDefault(); build();
    if (!num.value.trim()) err.textContent = 'Type your phone number first.';
    else if (current) box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  copyBtn.addEventListener('click', function () {
    if (!current) return;
    function done() { copyBtn.textContent = 'Copied'; setTimeout(function () { copyBtn.textContent = 'Copy link'; }, 1800); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(current).then(done, function () {});
    else { var t = document.createElement('textarea'); t.value = current; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); done(); } catch (e) {} document.body.removeChild(t); }
  });
  var o = { size: 1024, level: 'M', fg: '#000000', bg: '#ffffff' };
  document.getElementById('wa-png').addEventListener('click', function () { if (current) QRTool.downloadPNG(current, o, 'whatsapp-qr.png'); });
  document.getElementById('wa-svg').addEventListener('click', function () { if (current) QRTool.downloadSVG(current, o, 'whatsapp-qr.svg'); });
})();
