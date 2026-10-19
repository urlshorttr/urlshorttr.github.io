# Site kaise chalani hai (sab kuch GitHub par, koi zip nahi)

Har badlav ke baad **Commit changes** dabayein. 1-2 minute mein site apne aap update ho jati hai.

## 1. Naya POST (blog guide)
1. Repo mein `posts` folder kholein -> **Add file -> Create new file**.
2. Naam: `2026-11-02-my-post-title.md` (pehle date, phir address, phir .md).
   Post ka address ban jayega: urlshort.tr/blog/my-post-title/
3. `posts/TEMPLATE-copy-me.txt` ka text paste karein, title, description aur apna text badal dein.
4. Commit. Post blog list, footer aur sitemap mein apne aap aa jayegi.

## 2. Naya PAGE (jaise "Advertise", "FAQ", "Help")
1. `pages` folder -> Add file -> Create new file. Naam: `help.md` (address banega urlshort.tr/help/).
2. `pages/TEMPLATE-copy-me.txt` ka text paste karein, badlein, Commit.
3. Page ko menu ya footer mein dikhana ho to mujhe batao, wo link ek baar jodna padta hai.
   Nahi to post ya doosre page mein link likh sakte ho: `[Help page](/help/)`

## 3. Codes (AdSense, Analytics, Search Console, Bing, social links)
Sab ek hi file mein: `config.json`. File kholein, pencil (Edit) dabayein, quotes ke andar likhein:
- `"adsense_client": "ca-pub-1234567890123456"`   (ads.txt apne aap ban jati hai)
- `"analytics_id": "G-ABCDE12345"`
- `"google_verification": "..."`  (Search Console ka HTML tag wala code, sirf content="..." ke andar ka hissa)
- `"bing_verification": "..."`
- `"social"` ke andar: `"facebook": "https://facebook.com/yourpage"` waghairah. Jiska link bharoge uska icon footer mein dikhega.
Commas aur quotes jaise hain waise hi rehne dein.

## 4. Security (ek baar)
`SECURITY-SETUP.md` dekhein.
