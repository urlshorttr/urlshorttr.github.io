/* QR code generator page. Nothing is sent anywhere: the code is drawn in your browser. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var text = $('qrText'); if (!text) return;
  var canvas = $('qrCanvas'), empty = $('qrEmpty'), msg = $('qrMsg'), px = $('qrPx'), actions = $('qrActions');
  var sizeSel = $('qrSize'), levelSel = $('qrLevel'), fg = $('qrFg'), bg = $('qrBg');
  var timer;

  function opts(size) { return { size: size || parseInt(sizeSel.value, 10), level: levelSel.value, fg: fg.value, bg: bg.value }; }

  function render() {
    var v = text.value;
    msg.textContent = ''; msg.className = 'hint';
    if (!v.trim()) { canvas.hidden = true; actions.hidden = true; empty.hidden = false; px.textContent = ''; return; }
    var c = QRTool.contrast(fg.value, bg.value);
    try {
      QRTool.draw(canvas, v, opts(480));
      canvas.hidden = false; actions.hidden = false; empty.hidden = true;
      px.textContent = 'Downloads at about ' + sizeSel.value + ' px.';
    } catch (e) {
      canvas.hidden = true; actions.hidden = true; empty.hidden = false;
      msg.textContent = 'That is too much text for one QR code. Shorten it, or use a lower error correction level.'; msg.className = 'hint err';
      return;
    }
    if (c < 4) { msg.textContent = 'Low contrast: this code may not scan. Use a dark colour on a light background.'; msg.className = 'hint err'; }
    else if (fg.value.toLowerCase() > bg.value.toLowerCase()) { msg.textContent = 'Light code on a dark background: some scanner apps cannot read this. Test it before you print.'; }
  }
  function later() { clearTimeout(timer); timer = setTimeout(render, 120); }
  [text, sizeSel, levelSel, fg, bg].forEach(function (el) { el.addEventListener('input', later); el.addEventListener('change', later); });

  $('dlPng').addEventListener('click', function () { if (text.value.trim()) QRTool.downloadPNG(text.value, opts(), 'qr-code.png'); });
  $('dlSvg').addEventListener('click', function () { if (text.value.trim()) QRTool.downloadSVG(text.value, opts(), 'qr-code.svg'); });
  render();
})();
