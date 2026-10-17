/* QR code generator page. Nothing is sent anywhere: the code is drawn in your browser. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var text = $('qrText'); if (!text) return;
  var canvas = $('qrCanvas'), empty = $('qrEmpty'), msg = $('qrMsg'), px = $('qrPx'), actions = $('qrActions');
  var sizeSel = $('qrSize'), levelSel = $('qrLevel'), fg = $('qrFg'), bg = $('qrBg');
  var timer, T = window.T || {};

  function opts(size) { return { size: size || parseInt(sizeSel.value, 10), level: levelSel.value, fg: fg.value, bg: bg.value }; }

  function render() {
    var v = text.value;
    msg.textContent = ''; msg.className = 'hint';
    if (!v.trim()) { canvas.hidden = true; actions.hidden = true; empty.hidden = false; px.textContent = ''; return; }
    var c = QRTool.contrast(fg.value, bg.value);
    try {
      QRTool.draw(canvas, v, opts(480));
      canvas.hidden = false; actions.hidden = false; empty.hidden = true;
      px.textContent = T.qr_px.replace('{n}', sizeSel.value);
    } catch (e) {
      canvas.hidden = true; actions.hidden = true; empty.hidden = false;
      msg.textContent = T.qr_toolong; msg.className = 'hint err';
      return;
    }
    if (c < 4) { msg.textContent = T.qr_lowcontrast; msg.className = 'hint err'; }
    else if (fg.value.toLowerCase() > bg.value.toLowerCase()) { msg.textContent = T.qr_inverted; }
  }
  function later() { clearTimeout(timer); timer = setTimeout(render, 120); }
  [text, sizeSel, levelSel, fg, bg].forEach(function (el) { el.addEventListener('input', later); el.addEventListener('change', later); });

  $('dlPng').addEventListener('click', function () { if (text.value.trim()) QRTool.downloadPNG(text.value, opts(), 'qr-code.png'); });
  $('dlSvg').addEventListener('click', function () { if (text.value.trim()) QRTool.downloadSVG(text.value, opts(), 'qr-code.svg'); });
  render();
})();
