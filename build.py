#!/usr/bin/env python3
"""Builds the whole urlshort.tr website (plain HTML) into ./out . Run: python3 build.py"""
import json, os, re, shutil, html, datetime, sys
import yaml, markdown

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'out')
CFG = json.load(open(os.path.join(HERE, 'config.json'), encoding='utf-8'))
SITE = CFG['site_url'].rstrip('/')
TODAY = datetime.date.today().isoformat()
CODES = os.environ.get('LANGS', ','.join(CFG['languages'])).split(',')

I18N = {c: yaml.safe_load(open(os.path.join(HERE, 'i18n', c + '.yml'), encoding='utf-8')) for c in CODES}
EN = I18N['en']
OG_LOCALE = {'en': 'en_US', 'hi': 'hi_IN', 'es': 'es_ES', 'pt': 'pt_BR', 'tr': 'tr_TR', 'id': 'id_ID', 'ar': 'ar_AR', 'fr': 'fr_FR', 'de': 'de_DE'}

def esc(s): return html.escape(str(s), quote=True)
def rich(s): return s if '<' in s else html.escape(s, quote=False)
def strip(s): return re.sub(r'<[^>]+>', '', s)
def ld(o): return json.dumps(o, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
def prefix(c): return '' if c == 'en' else '/' + c
def url_of(c, key):
    p = {'home': '/', 'qr': '/qr-code-generator/', 'check': '/check-short-link/'}[key]
    return prefix(c) + p

# ---------- posts ----------
POSTS = []
for fn in sorted(os.listdir(os.path.join(HERE, 'posts')), reverse=True):
    if not fn.endswith('.md'): continue
    raw = open(os.path.join(HERE, 'posts', fn), encoding='utf-8').read()
    m = re.match(r'---\n(.*?)\n---\n(.*)', raw, re.S)
    fm, body = yaml.safe_load(m.group(1)), m.group(2)
    d = re.match(r'(\d{4}-\d{2}-\d{2})-(.*)\.md', fn)
    POSTS.append(dict(date=d.group(1), slug=d.group(2), url='/blog/%s/' % d.group(2), title=fm['title'],
                      description=fm['description'], tools=fm.get('tools', []),
                      html=markdown.markdown(body, extensions=['tables', 'fenced_code', 'sane_lists']), words=len(body.split())))
POST_URL = {p['slug']: p['url'] for p in POSTS}
SITEMAP = []   # (path, lastmod, alternates)

def fill(s, c):
    """replace [[key]] placeholders with urls for language c"""
    m = {'print_guide': POST_URL.get('qr-code-size-and-contrast-guide', '/blog/'), 'safe_guide': POST_URL.get('are-short-links-safe', '/blog/'),
         'qr_guide': POST_URL.get('qr-code-size-and-contrast-guide', '/blog/'), 'check': url_of(c, 'check'), 'report': '/report-link/',
         'home': url_of(c, 'home')}
    return re.sub(r'\[\[(\w+)\]\]', lambda x: m[x.group(1)], s)

ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%232a44f5'/%3E%3Cpath fill='%23fff' d='M6 6h8v8H6zM18 6h8v8h-8zM6 18h8v8H6zM18 18h3v3h-3zM23 23h3v3h-3zM18 23h3v3h-3zM23 18h3v3h-3z'/%3E%3C/svg%3E"

def header(c, page):
    t = I18N[c]['ui']
    def a(href, key, nav, english=False):
        cur = ' class="active" aria-current="page"' if page.get('nav') == nav else ''
        return '<a href="%s"%s%s>%s</a>' % (href, ' lang="en"' if english and c != 'en' else '', cur, esc(t[key]))
    return ('<header class="site-header"><div class="wrap header-in">'
        '<a class="logo" href="%s" aria-label="%s"><svg class="logo-mark" viewBox="0 0 32 32" width="28" height="28" aria-hidden="true"><path d="M3 3h11v11H3zM18 3h11v11H18zM3 18h11v11H3z" fill="none" stroke="currentColor" stroke-width="3"/><path d="M7 7h3v3H7zM22 7h3v3h-3zM7 22h3v3H7zM18 18h4v4h-4zM25 18h4v4h-4zM18 25h4v4h-4zM25 25h4v4h-4z" fill="currentColor"/></svg><span class="logo-text">urlshort<span class="logo-tld">.tr</span></span></a>'
        '<button class="menu-btn" type="button" aria-label="%s" aria-expanded="false" aria-controls="mainNav">%s</button>'
        '<nav class="main-nav" id="mainNav" aria-label="Main">%s%s%s%s</nav>%s</div></header>') % (
        url_of(c, 'home'), esc(t['logo_aria']), esc(t['menu']), esc(t['menu']),
        a(url_of(c, 'home'), 'nav_shorten', 'shorten'), a(url_of(c, 'qr'), 'nav_qr', 'qr'),
        a('/blog/', 'nav_guides', 'blog', True), a('/about/', 'nav_about', 'about', True), langmenu(c, page, 'menu'))

def alt_url(l, page):
    k = page.get('tkey')
    return url_of(l, k) if k else url_of(l, 'home')

def langmenu(c, page, mode):
    items = ''.join('<li><a href="%s" lang="%s" hreflang="%s" data-setlang="%s"%s>%s</a></li>' % (
        alt_url(l, page), l, l, l, ' aria-current="true"' if l == c else '', esc(I18N[l]['lang_name'])) for l in CODES)
    if mode == 'menu':
        return '<details class="langs"><summary aria-label="%s">%s</summary><ul>%s</ul></details>' % (esc(I18N[c]['ui']['foot_languages']), c.upper(), items)
    return '<ul class="foot-langs">%s</ul>' % items

def footer(c, page):
    t = I18N[c]['ui']
    en = ' lang="en"' if c != 'en' else ''
    latest = ''.join('<li><a href="%s" lang="en">%s</a></li>' % (p['url'], esc(p['title'])) for p in POSTS[:4])
    note = ('<p class="en-only">%s</p>' % esc(t['foot_note'])) if c != 'en' else ''
    return ('<footer class="site-footer"><div class="wrap"><div class="foot-grid">'
      '<div class="foot-about"><p class="foot-brand">urlshort<span class="logo-tld">.tr</span></p><p>%s</p></div>'
      '<div><h2 class="foot-h">%s</h2><ul><li><a href="%s">%s</a></li><li><a href="%s">%s</a></li><li><a href="%s">%s</a></li><li><a href="/report-link/"%s>%s</a></li></ul></div>'
      '<div><h2 class="foot-h">%s</h2><ul>%s<li><a href="/blog/"%s>%s</a></li></ul></div>'
      '<div><h2 class="foot-h">%s</h2><ul><li><a href="/about/"%s>%s</a></li><li><a href="/editorial-policy/"%s>%s</a></li><li><a href="/contact/"%s>%s</a></li><li><a href="/privacy/"%s>%s</a></li><li><a href="/terms/"%s>%s</a></li><li><a href="/disclaimer/"%s>%s</a></li></ul></div>'
      '</div><div class="foot-lang"><h2 class="foot-h">%s</h2>%s</div>%s'
      '<p class="copy">&copy; <span class="js-year">%s</span> urlshort.tr. %s</p></div></footer>') % (
      esc(t['foot_tag']), esc(t['foot_tools']),
      url_of(c, 'home'), esc(t['foot_shortener']), url_of(c, 'qr'), esc(t['foot_qr']), url_of(c, 'check'), esc(t['foot_check']), en, esc(t['foot_report']),
      esc(t['foot_latest']), latest, en, esc(t['foot_all_guides']),
      esc(t['foot_site']), en, esc(t['foot_about']), en, esc(t['foot_editorial']), en, esc(t['foot_contact']), en, esc(t['foot_privacy']), en, esc(t['foot_terms']), en, esc(t['foot_disclaimer']),
      esc(t['foot_languages']), langmenu(c, page, 'foot'), note, TODAY[:4], esc(t['copyright']))

def page_html(c, page, body, jsfiles=(), tstrings=None):
    """page: dict(title, description, path, tkey, nav, noindex, schema=[...], og_type)"""
    L = I18N[c]; d = L.get('dir', 'ltr')
    canon = SITE + page['path']
    title = page['title'] if len(page['title']) + 13 > 62 else '%s | urlshort.tr' % page['title']
    h = ['<!DOCTYPE html>', '<html lang="%s" dir="%s">' % (c, d), '<head>', '<meta charset="utf-8">',
         '<meta name="viewport" content="width=device-width, initial-scale=1">', '<meta name="theme-color" content="#2a44f5">',
         '<title>%s</title>' % esc(title), '<meta name="description" content="%s">' % esc(page['description'])]
    if page.get('noindex'): h.append('<meta name="robots" content="noindex, follow">')
    else:
        h.append('<meta name="robots" content="index, follow, max-image-preview:large">')
        h.append('<link rel="canonical" href="%s">' % canon)
    if page.get('tkey') and not page.get('noindex'):
        for l in CODES: h.append('<link rel="alternate" hreflang="%s" href="%s">' % (l, SITE + url_of(l, page['tkey'])))
        h.append('<link rel="alternate" hreflang="x-default" href="%s">' % (SITE + url_of('en', page['tkey'])))
    h += ['<meta property="og:site_name" content="urlshort.tr">', '<meta property="og:type" content="%s">' % page.get('og_type', 'website'),
          '<meta property="og:title" content="%s">' % esc(title), '<meta property="og:description" content="%s">' % esc(page['description']),
          '<meta property="og:url" content="%s">' % canon, '<meta property="og:locale" content="%s">' % OG_LOCALE[c],
          '<meta property="og:image" content="%s/og.png">' % SITE, '<meta property="og:image:width" content="1200">', '<meta property="og:image:height" content="630">',
          '<meta property="og:image:alt" content="urlshort.tr – URL shortener and QR code generator">',
          '<meta name="twitter:card" content="summary_large_image">', '<meta name="twitter:title" content="%s">' % esc(title),
          '<meta name="twitter:description" content="%s">' % esc(page['description']), '<meta name="twitter:image" content="%s/og.png">' % SITE]
    if CFG['google_verification']: h.append('<meta name="google-site-verification" content="%s">' % esc(CFG['google_verification']))
    if CFG['bing_verification']: h.append('<meta name="msvalidate.01" content="%s">' % esc(CFG['bing_verification']))
    for s in page.get('schema', []): h.append('<script type="application/ld+json">%s</script>' % ld(s))
    h += ['<link rel="icon" href="%s">' % ICON, '<link rel="preload" href="/css/fonts/display.woff2" as="font" type="font/woff2" crossorigin>',
          '<link rel="stylesheet" href="/css/style.css">']
    if CFG['adsense_client']:
        h.append('<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=%s" crossorigin="anonymous"></script>' % esc(CFG['adsense_client']))
    h += ['</head>', '<body>', '<a class="skip" href="#main">%s</a>' % esc(L['ui']['skip']), header(c, page),
          '<main id="main" class="wrap">', body, '</main>', footer(c, page)]
    langs = [dict(code=l, name=I18N[l]['lang_name'], url=alt_url(l, page), dir=I18N[l].get('dir', 'ltr'),
                  switch_label=I18N[l]['js']['sg_switch'], dismiss_label=I18N[l]['js']['sg_dismiss']) for l in CODES]
    ts = dict(L['js']); ts.update(tstrings or {})
    h.append('<script>window.T=%s;window.LANGS=%s;%s</script>' % (ld(ts), ld(langs), ('window.URLSHORT_API=%s;' % ld(CFG['api'])) if page.get('tool') == 'home' else ''))
    for j in list(jsfiles) + ['site.js']: h.append('<script src="/js/%s" defer></script>' % j)
    h += ['</body>', '</html>']
    return '\n'.join(h)

def write(path, text):
    f = os.path.join(OUT, path.lstrip('/'))
    if f.endswith('/'): f += 'index.html'
    os.makedirs(os.path.dirname(f), exist_ok=True)
    open(f, 'w', encoding='utf-8').write(text)

def faq_html(items, c):
    return ''.join('<details><summary>%s</summary><p>%s</p></details>' % (esc(i['q']), fill(rich(i['a']), c)) for i in items)
def faq_ld(items, c):
    return {'@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
        {'@type': 'Question', 'name': i['q'], 'acceptedAnswer': {'@type': 'Answer', 'text': strip(fill(i['a'], c))}} for i in items]}
def crumbs_ld(items):
    return {'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': [
        {'@type': 'ListItem', 'position': n + 1, 'name': nm, 'item': SITE + u} for n, (nm, u) in enumerate(items)]}
def app_ld(c, name, desc, path):
    return {'@context': 'https://schema.org', '@type': 'WebApplication', 'name': name, 'url': SITE + path, 'description': desc,
            'applicationCategory': 'UtilitiesApplication', 'operatingSystem': 'Any (web browser)', 'browserRequirements': 'Requires JavaScript',
            'isAccessibleForFree': True, 'inLanguage': c, 'offers': {'@type': 'Offer', 'price': '0', 'priceCurrency': 'USD'},
            'publisher': {'@type': 'Organization', 'name': 'urlshort.tr', 'url': SITE + '/'}}

def related(c):
    return ''

def guides_for(tool, c):
    ps = [p for p in POSTS if tool in p['tools']]
    if not ps: return ''
    t = I18N[c]['ui']
    note = ' <span class="en-only">%s</span>' % esc(t['related_note']) if c != 'en' else ''
    lis = ''.join('<li><a href="%s" lang="en"><span class="row-title">%s</span><span class="row-desc">%s</span></a></li>' % (p['url'], esc(p['title']), esc(p['description'])) for p in ps)
    return '<section class="more"><h2>%s%s</h2><ul class="rows">%s</ul></section>' % (esc(t['related_h']), note, lis)

# ---------- tool pages ----------
def build_home(c):
    L = I18N[c]; h = L['home']; m = L['meta']; path = url_of(c, 'home')
    steps = ''.join('<li><b>%s</b><span>%s</span></li>' % (esc(s['t']), rich(s['d'])) for s in h['steps'])
    when = ''.join('<dt>%s</dt><dd>%s</dd>' % (esc(s['t']), fill(rich(s['d']), c)) for s in h['when'])
    know = ''.join('<li>%s</li>' % fill(rich(k), c) for k in h['know'])
    body = f'''<section class="hero">
<h1>{esc(h['h1'])}</h1>
<p class="lead">{esc(h['lead'])}</p>
<form id="shortenForm" class="shorten" novalidate>
<label class="sr-only" for="longUrl">{esc(h['label_url'])}</label>
<div class="bar"><input id="longUrl" name="url" type="text" inputmode="url" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="{esc(h['placeholder'])}" dir="ltr"><button id="shortenBtn" class="btn" type="submit">{esc(h['btn_shorten'])}</button></div>
<details class="opt"><summary>{esc(h['opt_summary'])}</summary><div class="opt-body"><label for="alias">{esc(h['opt_label'])}</label><input id="alias" name="alias" type="text" maxlength="30" autocomplete="off" spellcheck="false" placeholder="{esc(h['opt_placeholder'])}" dir="ltr"><p class="hint">{esc(h['opt_hint'])}</p></div></details>
<p id="status" class="status" role="status" aria-live="polite"></p>
</form>
<div id="result" class="result" hidden>
<div class="res-main"><p id="resLong" class="res-long" dir="ltr"></p><a id="shortLink" class="short" href="#" target="_blank" rel="noopener" dir="ltr"></a>
<div class="res-actions"><button id="copyBtn" class="btn" type="button">{esc(h['copy'])}</button><a id="openLink" class="btn ghost" href="#" target="_blank" rel="noopener">{esc(h['open'])}</a></div></div>
<div class="res-qr"><canvas id="qrCanvas" width="240" height="240" role="img" aria-label="{esc(h['qr_aria'])}"></canvas>
<div class="dl"><button id="dlPng" class="btn" type="button">{esc(h['dl_png'])}</button><button id="dlSvg" class="btn ghost" type="button">{esc(h['dl_svg'])}</button></div></div>
</div>
<section id="recent" class="recent" hidden><h2>{esc(h['recent_h'])}</h2><ul id="recentList"></ul><p class="hint">{esc(h['recent_hint'])} <button id="clearRecent" type="button" class="linkish">{esc(h['recent_clear'])}</button></p></section>
</section>
<h2>{esc(h['how_h'])}</h2><ol class="steps">{steps}</ol>
<h2>{esc(h['when_h'])}</h2><dl class="defs">{when}</dl>
<h2>{esc(h['know_h'])}</h2><ul class="prose-list prose">{know}</ul>
<h2>{esc(h['faq_h'])}</h2>{faq_html(h['faq'], c)}
{guides_for('shortener', c)}'''
    page = dict(title=m['home_title'], raw_title=False, description=m['home_desc'], path=path, tkey='home', nav='shorten', tool='home',
                schema=[app_ld(c, m['home_title'], m['home_desc'], path), faq_ld(h['faq'], c),
                        {'@context': 'https://schema.org', '@type': 'WebSite', 'name': 'urlshort.tr', 'url': SITE + '/', 'inLanguage': c}])
    if c == 'en': page['title'] = m['home_title']
    write(path, page_html(c, page, body, ['qrcode.js', 'qrtool.js', 'shortener.js']))
    SITEMAP.append(('home', c))

def build_qr(c):
    L = I18N[c]; q = L['qr']; m = L['meta']; path = url_of(c, 'qr')
    tips = ''.join('<li>%s</li>' % fill(rich(k), c) for k in q['tips'])
    body = f'''<section class="hero">
<h1>{esc(q['h1'])}</h1>
<p class="lead">{esc(q['lead'])}</p>
<div class="qr-grid">
<div class="qr-form">
<label for="qrText">{esc(q['label_text'])}</label>
<textarea id="qrText" placeholder="{esc(q['placeholder'])}" dir="ltr" spellcheck="false"></textarea>
<div class="fields">
<div><label for="qrSize">{esc(q['size_label'])}</label><select id="qrSize"><option value="512">{esc(q['size_s'])}</option><option value="1024" selected>{esc(q['size_m'])}</option><option value="2048">{esc(q['size_l'])}</option></select></div>
<div><label for="qrLevel">{esc(q['level_label'])}</label><select id="qrLevel"><option value="L">{esc(q['level_l'])}</option><option value="M" selected>{esc(q['level_m'])}</option><option value="Q">{esc(q['level_q'])}</option><option value="H">{esc(q['level_h'])}</option></select></div>
<div><label for="qrFg">{esc(q['fg_label'])}</label><input id="qrFg" type="color" value="#000000"></div>
<div><label for="qrBg">{esc(q['bg_label'])}</label><input id="qrBg" type="color" value="#ffffff"></div>
</div>
<p id="qrMsg" class="hint" role="status" aria-live="polite"></p>
</div>
<div class="qr-out">
<p id="qrEmpty" class="qr-empty">{esc(q['empty'])}</p>
<canvas id="qrCanvas" width="480" height="480" role="img" aria-label="{esc(q['qr_aria'])}" hidden></canvas>
<div id="qrActions" class="dl" hidden><button id="dlPng" class="btn" type="button">{esc(EN_OR(c,'home','dl_png'))}</button><button id="dlSvg" class="btn ghost" type="button">{esc(EN_OR(c,'home','dl_svg'))}</button></div>
<p id="qrPx" class="px"></p>
</div>
</div></section>
<h2>{esc(q['which_h'])}</h2>
<dl class="defs"><dt>{esc(q['png_t'])}</dt><dd>{esc(q['png_d'])}</dd><dt>{esc(q['svg_t'])}</dt><dd>{esc(q['svg_d'])}</dd></dl>
<h2>{esc(q['tips_h'])}</h2><ul class="prose">{tips}</ul>
<h2>{esc(q['faq_h'])}</h2>{faq_html(q['faq'], c)}
{guides_for('qr', c)}'''
    page = dict(title=m['qr_title'], description=m['qr_desc'], path=path, tkey='qr', nav='qr', tool='qr',
                schema=[app_ld(c, m['qr_title'], m['qr_desc'], path), faq_ld(q['faq'], c),
                        crumbs_ld([(L['ui']['nav_shorten'], url_of(c, 'home')), (q['h1'], path)])])
    write(path, page_html(c, page, body, ['qrcode.js', 'qrtool.js', 'qrpage.js']))

def EN_OR(c, sec, key): return I18N[c][sec][key]

def build_check(c):
    L = I18N[c]; k = L['check']; m = L['meta']; path = url_of(c, 'check')
    other = ''.join('<li>%s</li>' % fill(rich(x), c) for x in k['other'])
    body = f'''<section class="hero">
<h1>{esc(k['h1'])}</h1>
<p class="lead">{esc(k['lead'])}</p>
<form id="checkForm" class="shorten" novalidate>
<label class="sr-only" for="checkUrl">{esc(k['label'])}</label>
<div class="bar"><input id="checkUrl" type="text" inputmode="url" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="{esc(k['placeholder'])}" dir="ltr"><button class="btn" type="submit">{esc(k['btn'])}</button></div>
<p id="status" class="status" role="status" aria-live="polite"></p>
</form></section>
<h2>{esc(k['other_h'])}</h2><ul class="prose">{other}</ul>
{guides_for('shortener', c)}'''
    page = dict(title=m['check_title'], description=m['check_desc'], path=path, tkey='check', nav='check',
                schema=[crumbs_ld([(L['ui']['nav_shorten'], url_of(c, 'home')), (k['h1'], path)])])
    write(path, page_html(c, page, body, ['check.js']))

# ---------- english-only pages ----------
def build_static():
    for name in ['about', 'contact', 'report-link', 'editorial-policy', 'disclaimer', 'terms', 'privacy']:
        raw = open(os.path.join(HERE, 'content', name + '.html'), encoding='utf-8').read()
        head, body = raw.split('\n---\n', 1)
        fm = dict(l.split(': ', 1) for l in head.strip().splitlines())
        path = '/%s/' % name
        b = '<article class="page"><nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <span>%s</span></nav><h1>%s</h1><div class="prose">%s</div></article>' % (esc(fm['title']), esc(fm['title']), body)
        page = dict(title=fm['title'], description=fm['description'], path=path, nav='about' if name == 'about' else '',
                    schema=[crumbs_ld([('Home', '/'), (fm['title'], path)])])
        write(path, page_html('en', page, b)); SITEMAP.append((path, 'en'))
    # blog index
    rows = ''.join('<li><a href="%s"><span class="row-date">%s</span><span class="row-title">%s</span><span class="row-desc">%s</span></a></li>' % (
        p['url'], datetime.date.fromisoformat(p['date']).strftime('%B %-d, %Y'), esc(p['title']), esc(p['description'])) for p in POSTS)
    b = '<article class="page"><nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <span>Guides</span></nav><h1>Guides</h1><p class="lead">Plain-English guides on short links and QR codes: how they work, how to make them well and how to stay safe.</p><ul class="rows" style="margin-top:2rem">%s</ul></article>' % rows
    page = dict(title='Guides on Short Links and QR Codes', description='Practical guides on short links and QR codes: how they work, how to print them so they scan, and how to check a link before you open it.',
                path='/blog/', nav='blog', schema=[crumbs_ld([('Home', '/'), ('Guides', '/blog/')])])
    write('/blog/', page_html('en', page, b)); SITEMAP.append(('/blog/', 'en'))
    for i, p in enumerate(POSTS):
        tools = p['tools']
        links = []
        if 'qr' in tools: links.append('<a href="/qr-code-generator/">Make a QR code</a>')
        if 'shortener' in tools: links.append('<a href="/">shorten a link</a>')
        try_ = ' or '.join(links) if links else '<a href="/">Shorten a link</a> or <a href="/qr-code-generator/">make a QR code</a>'
        others = [q for q in POSTS if q is not p][:3]
        more = ''.join('<li><a href="%s"><span class="row-title">%s</span><span class="row-desc">%s</span></a></li>' % (q['url'], esc(q['title']), esc(q['description'])) for q in others)
        mins = p['words'] // 200 + 1
        b = f'''<article class="post"><nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/blog/">Guides</a> / <span>{esc(p['title'])}</span></nav>
<h1>{esc(p['title'])}</h1><p class="post-meta"><time datetime="{p['date']}">{datetime.date.fromisoformat(p['date']).strftime('%B %-d, %Y')}</time> &middot; {mins} min read</p>
<div class="prose">{p['html']}</div>
<aside class="try"><h2>Try it yourself</h2><p>{try_}. Both are free and need no account.</p></aside></article>
<section class="more"><h2>More guides</h2><ul class="rows">{more}</ul></section>'''
        art = {'@context': 'https://schema.org', '@type': 'Article', 'headline': p['title'], 'description': p['description'], 'datePublished': p['date'], 'dateModified': p['date'],
               'inLanguage': 'en', 'mainEntityOfPage': SITE + p['url'], 'image': SITE + '/og.png',
               'author': {'@type': 'Organization', 'name': 'urlshort.tr', 'url': SITE + '/about/'},
               'publisher': {'@type': 'Organization', 'name': 'urlshort.tr', 'url': SITE + '/'}}
        page = dict(title=p['title'], description=p['description'], path=p['url'], nav='blog', og_type='article',
                    schema=[art, crumbs_ld([('Home', '/'), ('Guides', '/blog/'), (p['title'], p['url'])])])
        write(p['url'], page_html('en', page, b)); SITEMAP.append((p['url'], 'en', p['date']))
    # 404
    b = '<section class="hero"><h1>Page not found</h1><p class="lead">That address does not exist, or the page has moved. If you followed a short link, it may have been removed or typed wrongly.</p><p style="margin-top:1.5rem"><a class="btn" href="/">Shorten a link</a> <a class="btn ghost" href="/qr-code-generator/">Make a QR code</a> <a class="btn ghost" href="/blog/">Read the guides</a></p></section>'
    page = dict(title='Page not found', description='This page does not exist.', path='/404.html', noindex=True)
    write('/404.html', page_html('en', page, b))

def build_files():
    shutil.copytree(os.path.join(HERE, 'assets', 'css'), os.path.join(OUT, 'css'))
    shutil.copytree(os.path.join(HERE, 'assets', 'js'), os.path.join(OUT, 'js'))
    for f in ('og.png',):
        if os.path.exists(os.path.join(HERE, 'assets', f)): shutil.copy(os.path.join(HERE, 'assets', f), OUT)
    open(os.path.join(OUT, '.nojekyll'), 'w').write('')
    open(os.path.join(OUT, 'CNAME'), 'w').write('urlshort.tr\n')
    open(os.path.join(OUT, 'robots.txt'), 'w').write('User-agent: *\nAllow: /\n\nSitemap: %s/sitemap.xml\n' % SITE)
    if CFG['adsense_client']:
        open(os.path.join(OUT, 'ads.txt'), 'w').write('google.com, %s, DIRECT, f08c47fec0942fa0\n' % CFG['adsense_client'].replace('ca-pub', 'pub'))
    # sitemap
    x = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for e in SITEMAP:
        if e[0] in ('home', 'qr', 'check'):
            for l in CODES:
                x.append('<url><loc>%s</loc><lastmod>%s</lastmod>' % (SITE + url_of(l, e[0]), TODAY))
                for a in CODES: x.append('<xhtml:link rel="alternate" hreflang="%s" href="%s"/>' % (a, SITE + url_of(a, e[0])))
                x.append('<xhtml:link rel="alternate" hreflang="x-default" href="%s"/></url>' % (SITE + url_of('en', e[0])))
        else:
            x.append('<url><loc>%s</loc><lastmod>%s</lastmod></url>' % (SITE + e[0], e[2] if len(e) > 2 else TODAY))
    x.append('</urlset>')
    open(os.path.join(OUT, 'sitemap.xml'), 'w', encoding='utf-8').write('\n'.join(x))

if os.path.exists(OUT): shutil.rmtree(OUT)
os.makedirs(OUT)
for c in CODES:
    build_home(c); build_qr(c); build_check(c)
SITEMAP[:] = [('home',), ('qr',), ('check',)]
build_static()
build_files()
print('built', len([1 for r, d, f in os.walk(OUT) for x in f if x.endswith('.html')]), 'html pages ->', OUT)
