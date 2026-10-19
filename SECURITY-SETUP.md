# Security setup (ek baar, Cloudflare mein)

## A. Naya link-service code (worker/worker.js)
1. Cloudflare -> Workers & Pages -> apna worker (urlshort) -> **Edit code**.
2. Purana code poora delete karein. Repo ki `worker/worker.js` file ka poora text paste karein.
3. **Deploy**. Settings -> Variables mein purane variables waise hi rehne dein (ALLOWED_ORIGINS, PUBLIC_BASE, PASSTHROUGH).
4. ALLOWED_ORIGINS mein dono hone chahiye: `https://urlshort.tr,https://www.urlshort.tr`

Isse: phishing jaise endings (paypal, bank, login...), dusre shorteners, look-alike addresses, IP addresses
aur Google Safe Browsing ki list ke links (agar key lagayi) refuse hote hain. Bina Origin wali bot requests band.
Short links ko Google index nahi karta (noindex). Site ke pages par security headers lagte hain.

## B. Cloudflare dashboard (urlshort.tr -> Security)
1. **WAF -> Rate limiting rules -> Create rule**: Naam "shorten limit", When: URI Path equals `/api/shorten`,
   Rate: 10 requests per 10 seconds, Action: Block for 10 minutes. Save.
2. **Bots -> Bot Fight Mode: ON**.
3. **SSL/TLS -> Edge Certificates -> Always Use HTTPS: ON**.

## C. Optional: Google Safe Browsing key (free)
Google Cloud Console mein "Safe Browsing API" enable karke API key banayein.
Worker -> Settings -> Variables and Secrets -> Add **Secret** `GSB_KEY` = key.

## D. Kisi link ko hatana
Cloudflare -> Workers & Pages -> KV -> LINKS namespace -> View -> `l:abc123` wali entry delete karein.
Spam domain block karna ho to Worker variable `BLOCKED_DOMAINS` mein domain likhein (comma se alag).

## E. Negative SEO (competitor spam backlinks)
Google zyadatar spam links ignore karta hai. Search Console -> Security issues aur Links report mahine mein ek baar dekhein.
Disavow sirf tab karein jab aapko sach mein bahut zyada ganda links dikhein ya manual action ka message aaye.
