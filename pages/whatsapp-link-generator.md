---
title: "WhatsApp Link Generator: Free wa.me Chat Link and QR Code"
description: "Make a WhatsApp chat link with your number and a ready-made message, then download it as a QR code. Free, no sign-up, and your number stays in your browser."
---
Type your number and an optional first message. You get a WhatsApp link that opens a chat with you in one tap, and a QR code you can print. Everything is built in your browser, so your number is not sent to our server.

<form id="wa-form" novalidate style="display:grid;gap:.9rem;margin:1.2rem 0;max-width:36rem">
<label style="display:grid;gap:.3rem;font-weight:600">Country code
<select id="wa-cc" style="padding:.8rem 1rem;border:1px solid #c9cdea;border-radius:10px;font-size:1rem">
<option value="91">India (+91)</option><option value="1">United States / Canada (+1)</option><option value="44">United Kingdom (+44)</option>
<option value="92">Pakistan (+92)</option><option value="880">Bangladesh (+880)</option><option value="94">Sri Lanka (+94)</option><option value="977">Nepal (+977)</option>
<option value="971">United Arab Emirates (+971)</option><option value="966">Saudi Arabia (+966)</option><option value="90">Turkey (+90)</option>
<option value="62">Indonesia (+62)</option><option value="60">Malaysia (+60)</option><option value="65">Singapore (+65)</option><option value="63">Philippines (+63)</option>
<option value="61">Australia (+61)</option><option value="49">Germany (+49)</option><option value="33">France (+33)</option><option value="34">Spain (+34)</option>
<option value="39">Italy (+39)</option><option value="351">Portugal (+351)</option><option value="55">Brazil (+55)</option><option value="52">Mexico (+52)</option>
<option value="54">Argentina (+54)</option><option value="234">Nigeria (+234)</option><option value="27">South Africa (+27)</option><option value="254">Kenya (+254)</option><option value="20">Egypt (+20)</option>
</select></label>
<label style="display:grid;gap:.3rem;font-weight:600">Phone number (without the country code)
<input id="wa-num" type="tel" inputmode="numeric" autocomplete="off" placeholder="98765 43210" style="padding:.8rem 1rem;border:1px solid #c9cdea;border-radius:10px;font-size:1rem"></label>
<label style="display:grid;gap:.3rem;font-weight:600">Ready-made message (optional)
<textarea id="wa-msg" rows="3" maxlength="500" placeholder="Hi, I would like to know the price." style="padding:.8rem 1rem;border:1px solid #c9cdea;border-radius:10px;font-size:1rem;font-family:inherit"></textarea></label>
<p id="wa-err" role="alert" style="margin:0;color:#b42318"></p>
</form>

<div id="wa-result" hidden style="max-width:36rem;margin:0 0 1.5rem">
<p style="margin:.2rem 0;font-weight:600">Your WhatsApp link</p>
<code id="wa-out" style="display:block;word-break:break-all;background:#f1f3ff;padding:14px;border-radius:10px"></code>
<p style="display:flex;gap:.6rem;flex-wrap:wrap;margin:.8rem 0">
<button id="wa-copy" class="btn" type="button">Copy link</button>
<a id="wa-test" class="btn" href="#" target="_blank" rel="noopener noreferrer">Test the chat</a>
</p>
<canvas id="wa-qr" width="480" height="480" style="width:220px;height:220px;max-width:100%;border:1px solid #e3e6f7;border-radius:10px;background:#fff" aria-label="QR code for the WhatsApp link"></canvas>
<p style="display:flex;gap:.6rem;flex-wrap:wrap;margin:.8rem 0">
<button id="wa-png" class="btn" type="button">Download PNG</button>
<button id="wa-svg" class="btn" type="button">Download SVG</button>
</p>
<p>Want a shorter, tidier address for a bio or a poster? <a href="/">Shorten this link</a> and put the short link in your QR code instead.</p>
</div>
<script src="/js/qrcode.js" defer></script>
<script src="/js/qrtool.js" defer></script>
<script src="/js/wa.js" defer></script>

## How the link works

A WhatsApp chat link starts with `https://wa.me/` followed by the full phone number in international format: the country code and the number, digits only, with no plus sign, no leading zero, no spaces and no dashes. When someone opens it on a phone with WhatsApp, a chat with that number opens. The person does not need to save your number first.

If you add a message, it is placed after `?text=` with spaces and special characters encoded, and it appears already typed in the chat box. The person only has to press send. This tool does the encoding for you.

## How to use this generator

1. Choose your country code.
2. Type your number without the country code. A leading zero is removed for you.
3. Optional: write the message you want people to send you first.
4. Copy the link, or download the QR code as a PNG or SVG.
5. Press **Test the chat** and check that it opens the right number.

## Where to use a WhatsApp link

- **Social media bios:** a short link in your profile, so people can message you at once.
- **Shops and stalls:** a QR code on the counter or the menu for orders and questions.
- **Business cards and flyers:** a printed QR code that opens a chat.
- **Websites and emails:** a "Chat with us" button.
- **Class and event groups:** one tap for parents or students to reach you.

## Make the link shorter

A link with a long pre-filled message is hard to read and makes a dense QR code. A [short link](/) is easier to say aloud, easier to type and easier to scan. You can pick a readable ending as well, as explained in our guide to [choosing a custom short link ending](/blog/how-to-choose-a-custom-short-link-ending/). Once you share the short link, the [link click counter](/link-click-counter/) shows how many times it was opened.

## Print the QR code so it scans

Use dark squares on a light background, keep the white border, print at least about 3 cm (1.2 in) wide and test the printed copy with two phones. More tips are in our guides on [QR code size and contrast](/blog/qr-code-size-and-contrast-guide/) and [why a QR code does not scan](/blog/why-your-qr-code-is-not-scanning/). For the full story, read [how to make a WhatsApp chat link and QR code](/blog/how-to-make-a-whatsapp-link-and-qr-code/).

## Is it private

Your number and message are used only in your browser to build the link and the QR code. They are not sent to or stored on our server. Remember, though, that the finished link and QR code contain your number. Anyone who sees them can read it. Use a separate business number if you prefer, and be careful with unknown WhatsApp links sent by others. See [how to tell if a short link is safe](/blog/are-short-links-safe/).

## Common problems

- **"Invalid phone number" in WhatsApp:** the country code is wrong, or the number has extra digits.
- **The message is empty in the chat:** keep the message in the box above and copy the link again after you change it.
- **It opens the wrong chat:** check the country code and remove any extra digits.

## Frequently asked questions

**Is this free?** Yes. There is no sign-up, no limit and no watermark.

**Does the other person need to save my number?** No. The link opens a chat directly.

**Can I use it for WhatsApp Business?** Yes. A `wa.me` link works with any WhatsApp number, including a Business account.

**Does the link expire?** No. It works as long as the number is active on WhatsApp.

*WhatsApp is a trademark of its owner. urlshort.tr is not connected to WhatsApp.*
