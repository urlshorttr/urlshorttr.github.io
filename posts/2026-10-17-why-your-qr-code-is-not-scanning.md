---
title: "Why Your QR Code Is Not Scanning (and How to Fix It)"
description: "If a QR code will not scan, the cause is usually size, contrast, missing border or too much text. Work through this checklist to find and fix the problem."
tools: [qr]
---
A QR code that will not scan is nearly always one of a few common problems. Work through the list in order. The first items fix most cases.

## 1. The code has no white border

The empty margin around a code, called the quiet zone, is part of the code. The standard asks for four modules of space on every side. If a designer crops it tight, places the code on a photo or puts a coloured frame close to the edge, scanners cannot find where the code begins. **Fix:** add a clear border of at least four modules in the background colour.

## 2. Low contrast

Scanners look for dark squares on a light background. Pale grey on white, yellow on white or a dark code on a dark photo is hard to read. **Fix:** use black or a very dark colour on white. Test colours with our [QR code generator](/qr-code-generator/), which warns you when contrast is too low.

## 3. An inverted code

Light squares on a dark background can look attractive, but many scanner apps cannot read them. Some phone cameras can, but you cannot rely on it. **Fix:** use dark on light unless you have tested the code on many devices.

## 4. Too much text in the code

A code with a long address has many tiny squares. On a small print, those squares may be smaller than the printer can reproduce or the camera can resolve. **Fix:** shorten the link first. A short link gives larger, simpler squares. You can do this on the [home page](/).

## 5. The code is too small for the distance

A rough rule is that a code should be about one tenth as wide as the distance it will be scanned from. A code 2 cm wide works from 20 cm away, but not from a metre. **Fix:** enlarge the code, or move the scanner closer.

## 6. Error correction level is too low for the use

At level L only about 7% of the code can be damaged. A code on a package that gets scuffed needs a higher level. **Fix:** use M or Q for ordinary print, and H for rough surfaces. Higher levels make each square smaller, so shorten the text as well.

## 7. The code was stretched or distorted

A code must be square, with square modules. Stretching it to fit a layout, or placing it on a curved surface such as a bottle, changes the shapes. **Fix:** scale it equally in both directions. On curved surfaces, make the code larger and test it.

## 8. Poor print quality

Blurry edges, ink bleeding on rough paper and low resolution images all blur the squares. **Fix:** download the SVG for printing, which stays sharp at any size, or the large PNG. Do not enlarge a small PNG, because the squares will blur.

## 9. Glare and shiny surfaces

Gloss lamination, glass and metal reflect light and hide squares. **Fix:** use a matte finish where possible, and test under the real lighting.

## 10. Logos and decoration in the middle

Some designs place a logo over the centre. That works only if the error correction is high and the logo is small. A large logo destroys too much data. **Fix:** remove the logo, or reduce it and use level H, then test.

## 11. The link is broken, not the code

Sometimes the code scans perfectly but the page does not open. **Fix:** type the address into a browser. If it fails there, the problem is the link, not the code.

## A quick testing routine

1. Scan the code on screen with your own phone.
2. Print one copy at the real size.
3. Scan it from the real distance, in the real light.
4. Try an older phone and a second scanner app.
5. Only then print the full run.

If you find a problem, change one thing at a time so you know what fixed it. Our [size and contrast guide](/blog/qr-code-size-and-contrast-guide/) explains the numbers in more detail.
