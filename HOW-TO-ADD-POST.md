# URLShort site: kya kahan badalna hai

## AdSense code
`_config.yml` kholo, `adsense_client: ""` me apna ID daalo, jaise `adsense_client: "ca-pub-1234567890123456"`.
Commit karo. Head me script apne aap lag jayegi aur `ads.txt` bhi ban jayegi. Koi ad slot page par nahi hai, Auto ads Google khud lagata hai.

## Search Console
`_config.yml` me `webmaster_verifications: google:` me sirf verification code (content value) daalo.

## Email
`_config.yml` me `email:` me wo mailbox rakho jo tum sach me dekhte ho (contact@urlshort.tr ke liye mailbox banana padega).

## Naya guide
`_posts` folder me nayi file banao, naam: `2026-11-01-guide-ka-naam.md`
```
---
title: "Guide ka title"
description: "Ek line ka description (150 character ke aas paas)"
tools: [shortener, qr]
---
Yahan content likho.
```

## Domain
Repo ka naam `USERNAME.github.io` ho. Settings -> Pages -> Custom domain me `urlshort.tr`, phir Enforce HTTPS on.
