---
title: "QR Code Size and Contrast: A Guide for Printing Codes That Scan"
description: "Practical advice on how big a printed QR code should be, what colours work, why the white border matters and how to test before you print."
tools: [qr]
---
Most QR codes that fail to scan fail for a few simple reasons: they are too small, too crowded, too low in contrast or missing their border. Each one is easy to avoid.

## Size

A common rule of thumb is that the scanning distance should be about ten times the width of the code. A code 2 cm wide can be read from around 20 cm away. A poster read from 2 metres needs a code of around 20 cm. Treat this only as a starting point and always test with a real phone.

The amount of text matters as well. Longer text means more, smaller squares, and a small square is harder to read. A [short link](/) keeps the code simple.

## Contrast and colour

- Use a dark code on a light background. Black on white is the safest.
- Avoid pale colours for the code, and avoid a code lighter than its background. Some scanner apps cannot read inverted codes.
- If you use brand colours, check the contrast. The [generator](/qr-code-generator.html) warns you when it is too low.

## The quiet zone

Every QR code needs a blank border around it, at least four squares wide. The border lets a scanner find the edges. Do not crop it off, and do not place text or a picture inside it.

## Error correction

QR codes include extra data that lets them be read even when part is damaged. There are four levels, which can recover roughly 7%, 15%, 25% and 30% of the code. Higher levels cope with scuffs, but they also make the squares smaller for the same text. Medium suits most uses. Choose Quartile or High for codes on items that get worn.

## File format

Send a printer the SVG file. It stays sharp at any size. If you need a PNG, choose the large size.

## Test before you print

1. Print one proof at the real size.
2. Scan it with two or more phones, in normal light.
3. Check that the right page opens.
4. Only then send the job to print.

QR Code is a registered trademark of Denso Wave Incorporated.
