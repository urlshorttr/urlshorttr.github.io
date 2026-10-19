---
title: "Short Link Click Counter"
description: "Check how many times a urlshort.tr short link was clicked. Paste the short link and see the number of clicks, free and without an account."
---
Paste a short link made with urlshort.tr and see how many people have clicked it. No account and no sign-up.

<form id="stats-form" class="row" style="display:flex;gap:.6rem;flex-wrap:wrap;margin:1.2rem 0">
<input id="stats-input" type="text" required placeholder="https://urlshort.tr/abc123" aria-label="Short link" style="flex:1;min-width:14rem;padding:.8rem 1rem;border:1px solid #c9cdea;border-radius:10px;font-size:1rem">
<button class="btn" type="submit">Count clicks</button>
</form>
<p id="stats-out" role="status" aria-live="polite"><strong></strong></p>
<script src="/js/stats.js" defer></script>

## How the click counter works

Every time a person opens one of your short links, the number goes up by one. You can look the number up here at any time, or add a plus sign to the end of a short link, for example `urlshort.tr/abc123+`, to open a preview page that shows the destination and the click total.

## What is counted and what is not

Search engine robots and link preview tools, such as the ones that build the small card when you paste a link into a chat, are not counted. Only a plain number is stored for each link. We do not save the IP addresses or any personal details of the people who click.

## Why numbers can differ from other tools

Some browsers and privacy tools block or prefetch links, so a click count is a close guide and not an exact head count. If you need detailed reports, use the destination site's own analytics next to this counter.

Need a new link first? [Shorten a link](/) or [make a QR code](/qr-code-generator/) for it.
