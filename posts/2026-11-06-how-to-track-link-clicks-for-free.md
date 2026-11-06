---
title: "How to Track Link Clicks for Free (No Account Needed)"
description: "Three free ways to track link clicks: a short link counter, UTM tags and Google Analytics. Simple steps, examples and what each method can and cannot show."
tools: [shortener, qr]
---
You post a link in a bio, a message group, a flyer or an email. A week later you want to know one thing: did anyone open it? The good news is that you can find out for free, and for a basic answer you do not need an account or any special software. This guide shows three ways to track link clicks, what each one tells you, and how to pick the right one.

## The three ways at a glance

| Method | What it tells you | Needs your own website? | Effort |
|---|---|---|---|
| Short link click counter | How many times the short link was opened | No | Very low |
| UTM tags | Which post, channel or campaign sent the visitor | Yes, with analytics on it | Low |
| Google Analytics | What visitors did after they arrived | Yes | Medium |

You can use one method or combine them. Start with the simplest one that answers your question.

## Method 1: Use a short link with a click counter

This is the fastest way, and it works for any link, even one that points to a page you do not own.

1. Open the [URL shortener](/) and paste your long link.
2. Add a custom ending if you want one, such as `summer_menu`, so you can recognise the link later.
3. Press the button and copy your new short link.
4. Share that short link instead of the long one.
5. To see the number later, open the [link click counter](/link-click-counter/), paste the short link and press **Count clicks**. You can also add a plus sign to the end of the short link to open its preview page, which shows the click total.

**What you get:** one number, the total times the short link was opened.

**What you do not get:** where visitors live, what device they used, or what they did on the page. A simple counter does not collect that.

**Good to know:**
- Search engine robots and the small previews that chat apps build when you paste a link are not counted, so the number is closer to real people.
- Some browsers and privacy tools block or pre-load links, so treat the number as a close guide rather than an exact head count.
- If someone opens the link twice, that is two clicks. The counter shows opens, not unique people.

## Method 2: Add UTM tags to find out which post worked

A click counter tells you the total. If you shared the same link in five places, you may want to know which place brought the visitors. That is what UTM tags are for.

A UTM tag is a small piece of text added to the end of a web address. It does not change the page, but analytics tools read it and record where the visitor came from.

Here is a plain example:

`https://example.com/offer?utm_source=instagram&utm_medium=bio&utm_campaign=diwali_sale`

- `utm_source` is the place, such as `instagram`, `whatsapp` or `newsletter`.
- `utm_medium` is the type of place, such as `bio`, `story`, `email` or `qr`.
- `utm_campaign` is the name of your promotion, such as `diwali_sale`.

**How to use them:**
1. Write the tags at the end of your page address. Put a question mark before the first tag and an ampersand between the others.
2. Use lowercase and no spaces, so `Instagram` and `instagram` do not show up as two different sources.
3. Make a different version for each place you share. Change only the `utm_source` and `utm_medium`.
4. Shorten each version with a [short link](/), so the address looks tidy when people see it.

The short link passes visitors on to the full address, tags included, so your analytics still receive them. Read more about why short and long addresses behave differently in our guide to [short URL vs long URL](/blog/short-url-vs-long-url/).

**Important:** UTM tags only help if the page you link to has analytics installed. If you are linking to a page you do not control, UTM tags will not show you anything. Use Method 1 instead.

Also, never put personal information in a tag, such as a name, an email address or a phone number. Anyone who sees the link can read it.

## Method 3: Look at the full story in Google Analytics

If the link points to your own website, Google Analytics shows more than clicks. It can show how many people arrived, which pages they viewed and how long they stayed.

1. Make sure Google Analytics is installed on your website.
2. Share links that carry UTM tags (Method 2).
3. In Google Analytics, open the reports about traffic sources or acquisition. Visitors from your tagged links appear under the source and campaign names you chose.

Analytics counts people who arrived and were measured. It can show fewer visits than a click counter, because visitors who block analytics or leave before the page finishes loading are not recorded. That is normal. A click counter and analytics measure different things, so expect the two numbers to differ.

## Tracking QR code scans

A QR code does not track anything by itself. If the code holds a plain web address, a scan opens that page and nobody counts it. There is an easy fix.

1. Create a short link for your page first.
2. Put the short link inside the code with our [QR code generator](/qr-code-generator/).
3. Each time someone scans the code, the short link opens, and the click counter adds one.

This gives you a simple scan count without a paid service. If you print many codes in different places, make a separate short link for each place so you can compare them, for example `menu_table` and `menu_window`. Our guide on [static vs dynamic QR codes](/blog/static-vs-dynamic-qr-codes/) explains why this works and where its limits are.

## Which method should you use?

- **Just curious if anyone clicked:** use a short link counter.
- **Sharing in several places and want to compare:** use a short link for each place, or UTM tags if the page is yours.
- **Running a promotion on your own site:** use UTM tags plus Google Analytics.
- **Printing a QR code:** put a short link inside it and watch the counter.

## Keep tracking fair and private

People deserve to know when their visits are measured. If your website uses analytics, say so in your privacy policy. A click counter that stores only a number is gentler than tools that follow people around. Our guide on [short links and privacy](/blog/short-links-and-privacy/) explains what different services collect and what to look for.

## Quick checklist

- Use a different short link for each place you share.
- Name your links clearly, so you remember what each one is.
- Write UTM tags in lowercase with no spaces.
- Check the numbers after a few days, not after ten minutes.
- Remember that counts are a guide, not an exact head count.

## Try it now

[Shorten a link](/) and share it. Come back to the [click counter](/link-click-counter/) in a day or two and see how many people opened it. It is free and needs no sign-up.
