---
title: "How to Make a WhatsApp Chat Link and QR Code (wa.me, Free)"
description: "Create a WhatsApp link that opens a chat with your number, add a ready-made message, shorten it and turn it into a QR code. Simple steps, examples and mistakes to avoid."
tools: [shortener, qr]
---
If you sell something, run a shop, teach a class or take bookings, people often want to message you on WhatsApp. Asking them to save your number and then search for it is too many steps. A WhatsApp chat link fixes this. One tap, or one scan of a QR code, opens a chat with you. This guide shows how to build the link, how to add a ready-made message, how to shorten it and how to turn it into a QR code, all for free.

## What a WhatsApp chat link is

A WhatsApp chat link is a normal web address that starts with `wa.me`. When someone opens it on a phone with WhatsApp installed, WhatsApp opens a chat with the number in the link. On a computer it opens WhatsApp Web or the desktop app. The person does not need to have your number saved, and you do not need to install anything extra.

## The basic format

The pattern is:

`https://wa.me/` followed by the full phone number

The number must be written in international format, and only digits are allowed:

- Start with the country code, for example `91` for India or `1` for the United States and Canada.
- Do not add a plus sign, a zero at the start, spaces, dashes or brackets.

| Your number | Wrong | Right |
|---|---|---|
| +1 555 123 4567 | `wa.me/+1 555-123-4567` | `wa.me/15551234567` |
| +91 98765 43210 | `wa.me/09876543210` | `wa.me/919876543210` |
| +44 7700 900123 | `wa.me/07700900123` | `wa.me/447700900123` |

The numbers above are examples. Replace them with your own, including your own country code.

## Add a ready-made message

You can put a first message inside the link. When the person opens it, the message is already typed in the box and they only press send. Add `?text=` and then your message after the number:

`https://wa.me/15551234567?text=Hello%2C%20I%20want%20to%20book%20a%20table`

Two rules make this work:

1. **Spaces become `%20`.** A link cannot contain spaces, so write `%20` where a space belongs.
2. **Some characters must be encoded too.** A comma is `%2C`, a question mark is `%3F`, an ampersand is `%26` and a new line is `%0A`. If this looks hard, type your message in a free "URL encoder" tool and paste the result after `?text=`.

Keep the message short and useful. A good pre-filled message tells you what the person wants, for example "Hi, I would like the price of the blue jacket." This saves a round of back-and-forth.

## Step by step

1. Write your number with the country code and no extra symbols, for example `919876543210`.
2. Put `https://wa.me/` in front of it.
3. Optional: add `?text=` and an encoded message.
4. Paste the link into your own browser or send it to a friend and test it. It should open a chat with the right number and the message in the box.
5. Shorten it with our [URL shortener](/) so it is neat in a bio, a poster or a printed card.
6. Make a QR code from the short link with our [QR code generator](/qr-code-generator/) and download it.

## Why shorten it

A WhatsApp link with a long pre-filled message can get very long and ugly. A short link such as `urlshort.tr/chat_now` is easier to read aloud, easier to type and easier to fit on a business card. A shorter address also makes a simpler, easier-to-scan QR code, because there is less data inside it. You can read more in our guide on [short URL vs long URL](/blog/short-url-vs-long-url/).

If you want a readable ending for your link, see [how to choose a custom short link ending](/blog/how-to-choose-a-custom-short-link-ending/). Short and clear works best, such as `order_here` or `book_now`.

## Make the QR code

A QR code is useful anywhere people cannot click: a shop window, a menu, a flyer, a business card or a shop counter. The person scans it with the phone camera and the chat opens.

1. Open the [QR code generator](/qr-code-generator/).
2. Paste your WhatsApp link, or better, your short link.
3. Download the code as PNG for documents and screens, or SVG for large prints.
4. Test it with two phones before you print.

Before you print, read our guides on [QR code size and contrast](/blog/qr-code-size-and-contrast-guide/) and [why a QR code does not scan](/blog/why-your-qr-code-is-not-scanning/). For a card, see [QR codes on business cards](/blog/qr-code-on-a-business-card/).

One more benefit of putting a short link inside the code: the link can be counted. You can see how many times it was opened on the [link click counter](/link-click-counter/). Our guide on [how to track link clicks for free](/blog/how-to-track-link-clicks-for-free/) explains this in detail.

## WhatsApp Business

If you use the WhatsApp Business app, it can also give you its own short link for your business profile, and it lets you set a greeting message. This is handy for a shop, because the link and the greeting are managed inside the app. A plain `wa.me` link works for any account, so use it if you do not have a business account.

## Keep your number safe

A WhatsApp link contains your phone number in plain sight. Anyone who sees the link or scans the code can see the number. Keep these points in mind:

- **Use a separate number for business** if you can, instead of your personal one.
- **Think before you post it publicly.** A link on a public page can be copied by spammers and bots.
- **Do not trust unknown WhatsApp links.** Scammers also use `wa.me` links. If someone sends you a short link, check where it goes first. Our guide on [how to tell if a short link is safe](/blog/are-short-links-safe/) shows how, and on urlshort.tr you can add a plus sign to the end of a short link to see the destination.
- **You can block and report** any unwanted sender inside WhatsApp.

## Common problems

- **The link says "phone number shared via url is invalid".** Check the number: it needs the country code, only digits, and no plus sign, zero at the start or spaces.
- **The chat opens but the message is empty.** The text after `?text=` is probably not encoded correctly, or it has a space. Replace spaces with `%20`.
- **It opens the wrong country number.** You probably forgot the country code or kept the leading zero of the local number.
- **The QR code is hard to scan.** Use the short link inside the code, print it larger and keep the white border.

## Quick checklist

- Number written as country code plus digits only.
- Link starts with `https://wa.me/`.
- Optional message added after `?text=` and encoded.
- Tested on a real phone.
- Short link made for printing and sharing.
- QR code tested on two phones before printing.
- You are happy for people to see the number.

## Make yours now

[Shorten your WhatsApp link](/) and then [make a QR code](/qr-code-generator/) from it. It is free, with no sign-up, and the code has no watermark.

*WhatsApp is a trademark of its owner. urlshort.tr is not connected to WhatsApp.*
