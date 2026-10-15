/* QR helpers on top of qrcode.js (MIT, Kazuhiko Arase). Everything runs in the browser. */
(function (w) {
  'use strict';
  if (w.qrcode && w.qrcode.stringToBytesFuncs && w.qrcode.stringToBytesFuncs['UTF-8']) {
    w.qrcode.stringToBytes = w.qrcode.stringToBytesFuncs['UTF-8'];   // so non-English text scans correctly
  }
  var QUIET = 4;   // quiet zone, in modules (the QR standard asks for 4)

  function build(text, level) {
    var qr = w.qrcode(0, level || 'M');
    qr.addData(String(text), 'Byte');
    qr.make();
    return qr;
  }

  function size(count, wanted) {
    var cells = count + QUIET * 2;
    var cell = Math.max(1, Math.floor(wanted / cells));
    return { cells: cells, cell: cell, px: cells * cell };
  }

  // Draws onto a canvas. Returns the final pixel size. Throws if the text is too long for a QR code.
  function draw(canvas, text, o) {
    o = o || {};
    var qr = build(text, o.level);
    var n = qr.getModuleCount();
    var s = size(n, o.size || 512);
    canvas.width = canvas.height = s.px;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = o.bg || '#ffffff';
    ctx.fillRect(0, 0, s.px, s.px);
    ctx.fillStyle = o.fg || '#000000';
    for (var r = 0; r < n; r++) {
      for (var c = 0; c < n; c++) {
        if (qr.isDark(r, c)) ctx.fillRect((c + QUIET) * s.cell, (r + QUIET) * s.cell, s.cell, s.cell);
      }
    }
    return s.px;
  }

  function svg(text, o) {
    o = o || {};
    var qr = build(text, o.level);
    var n = qr.getModuleCount();
    var cells = n + QUIET * 2;
    var d = '';
    for (var r = 0; r < n; r++) {
      for (var c = 0; c < n; c++) {
        if (qr.isDark(r, c)) d += 'M' + (c + QUIET) + ' ' + (r + QUIET) + 'h1v1h-1z';
      }
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + cells + ' ' + cells +
      '" width="' + (o.size || 512) + '" height="' + (o.size || 512) + '" shape-rendering="crispEdges">' +
      '<rect width="' + cells + '" height="' + cells + '" fill="' + (o.bg || '#ffffff') + '"/>' +
      '<path fill="' + (o.fg || '#000000') + '" d="' + d + '"/></svg>';
  }

  function save(blob, name) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
  }

  function downloadPNG(text, o, name) {
    var c = document.createElement('canvas');
    draw(c, text, o);
    if (c.toBlob) { c.toBlob(function (b) { save(b, name || 'qr-code.png'); }, 'image/png'); }
    else { var a = document.createElement('a'); a.href = c.toDataURL('image/png'); a.download = name || 'qr-code.png'; a.click(); }
  }

  function downloadSVG(text, o, name) {
    save(new Blob([svg(text, o)], { type: 'image/svg+xml' }), name || 'qr-code.svg');
  }

  function lum(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(hex); if (!m) return 0;
    var v = parseInt(m[1], 16), ch = [(v >> 16) & 255, (v >> 8) & 255, v & 255].map(function (x) {
      x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  }
  // WCAG contrast ratio, 1 to 21. Codes with less than about 4 scan badly.
  function contrast(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }

  w.QRTool = { draw: draw, svg: svg, downloadPNG: downloadPNG, downloadSVG: downloadSVG, contrast: contrast };
})(window);
