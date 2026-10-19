---
title: "What Is a QR Code and How Does It Work?"
description: "A QR code is a square pattern that a phone camera reads as text or a link. Learn how it is built, how much it can hold and why it still scans when damaged."
tools: [qr]
---
A QR code is a square pattern of black and white modules that stores a small piece of text, most often a web address. A phone camera reads the pattern and turns it back into that text, so nobody has to type anything. The name is short for "quick response". This guide explains how the code is built and why it behaves the way it does.

## A short history

The QR code was created in 1994 by Denso Wave, a Japanese company that supplied parts to car makers. Factories needed to track components faster than a standard barcode allowed, because an ordinary barcode holds only a short number and has to be scanned from one direction. The new code held far more data and could be read quickly from any angle. Denso Wave chose not to enforce its patent on the basic code, which is a large part of why it spread. "QR Code" is still a registered trademark of Denso Wave.

## What is inside the pattern

If you look closely at a QR code you will see a few repeating parts:

- **Three large squares** in three corners. These are position markers. They let a scanner find the code, work out which way up it is and correct for tilt.
- **A smaller square** near the fourth corner in bigger codes. It helps the scanner correct for a code printed on a curved or crumpled surface.
- **Lines of alternating modules** that act like a ruler, helping the scanner judge the grid size.
- **Format information** next to the position markers, which tells the scanner what error correction level is in use.
- **The data itself**, spread across the remaining area together with extra repair data.

## From text to squares

The generator takes your text, converts it into bytes and splits it into blocks. It adds repair data, arranges everything into a grid and applies a mask pattern that avoids large blocks of one colour, which are hard to read. A larger grid is used when there is more to store. These sizes are called versions, from version 1 (21 by 21 modules) to version 40 (177 by 177 modules).

## How much can one code hold?

The limit depends on the version and the error correction level. At the most generous settings a code can hold a little under 3,000 bytes of text, but the longer the text, the denser the grid and the harder it is to scan. For a web address, shorter is better. A short link keeps the code simple, which is why we suggest [shortening a long address first](/).

## Why it still works when damaged

Part of every code is repair data, built with a method called Reed–Solomon error correction. It lets a scanner rebuild missing information. There are four levels:

| Level | About how much can be lost |
|---|---|
| L (low) | 7% |
| M (medium) | 15% |
| Q (quartile) | 25% |
| H (high) | 30% |

A higher level survives more scuffs and stains, but needs more modules, so each square is smaller. That is the trade-off. Our guide to [QR code size and contrast](/blog/qr-code-size-and-contrast-guide/) shows how to balance it for printing.

## The quiet zone

A QR code needs an empty border around it, called the quiet zone. The standard asks for four modules of space. Without it the scanner cannot tell where the code starts, because it may confuse the pattern with whatever sits beside it. This is why a code cropped tight against a photo or a coloured box so often fails.

## What a phone does when it scans

The camera finds the position markers, straightens the image, reads the modules, runs the repair step and then decodes the bytes into text. If the text looks like a web address, the phone shows a link to open. All of this happens on the phone, in a moment. Opening the link is a separate step, and you should treat it as you would any link from a stranger.

## Is a QR code safe?

The code itself only holds text. The risk is in where the text sends you. A code on a sticker in a public place can be covered by a different one, so check the address your phone shows before you open it, especially if the page then asks for a password or payment details.

## Make your own

You can create a code for any link or text with the [QR code generator](/qr-code-generator/). It is drawn in your browser, nothing you type is sent to us and you can download the result as PNG or SVG.
