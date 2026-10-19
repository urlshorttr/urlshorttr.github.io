import os,re,sys,html,xml.etree.ElementTree as ET
O=sys.argv[1]; bad=0
pages={}
for r,d,f in os.walk(O):
    for x in f:
        if x.endswith('.html'): pages[os.path.join(r,x)]=open(os.path.join(r,x),encoding='utf-8').read()
def exists(u):
    u=u.split('#')[0].split('?')[0]
    if not u.startswith('/'): return True
    p=os.path.join(O,u.lstrip('/'))
    return os.path.isfile(p) or os.path.isfile(os.path.join(p,'index.html'))
for p,s in pages.items():
    rel=p[len(O):]
    for m in re.findall(r'(?:href|src)="([^"]+)"',s):
        if m.startswith(('http','mailto:','data:','#')): continue
        if not exists(m): print('BROKEN',rel,m); bad+=1
    if len(re.findall(r'<h1[ >]',s))!=1: print('H1',rel,len(re.findall(r'<h1[ >]',s))); bad+=1
    if '[[' in s or '{{' in s or '{%' in s: print('LEFTOVER',rel); bad+=1
    t=re.search(r'<title>(.*?)</title>',s).group(1)
    if len(html.unescape(t))>70: print('LONGTITLE',rel,len(t))
    d=re.search(r'name="description" content="(.*?)"',s).group(1)
    if len(html.unescape(d))>170: print('LONGDESC',rel,len(d))
    if 'noindex' not in s and 'rel="canonical"' not in s: print('NOCANON',rel); bad+=1
    for blk in re.findall(r'<script type="application/ld\+json">(.*?)</script>',s):
        import json; json.loads(blk)
# hreflang reciprocity
for p,s in pages.items():
    al=re.findall(r'hreflang="([^"]+)" href="([^"]+)"',s)
    if al:
        if len(al)!=10: print('HREFLANG count',p,len(al)); bad+=1
        for l,u in al:
            q=O+u.replace('https://urlshort.tr','')+('index.html' if u.endswith('/') else '')
            if not os.path.exists(q): print('HREFLANG dead',u); bad+=1
t=ET.parse(O+'/sitemap.xml'); ns='{http://www.sitemaps.org/schemas/sitemap/0.9}'
locs=[e.find(ns+'loc').text for e in t.getroot()]
print('sitemap urls',len(locs),'dupes',len(locs)-len(set(locs)))
for l in locs:
    if not exists(l.replace('https://urlshort.tr','')): print('SITEMAP dead',l); bad+=1
print('pages',len(pages),'problems',bad)
