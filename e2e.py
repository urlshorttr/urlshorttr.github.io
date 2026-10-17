import json,threading,http.server,socketserver,os,functools,sys
from playwright.sync_api import sync_playwright
O='/home/claude/urlshort-src/out'
H=functools.partial(http.server.SimpleHTTPRequestHandler,directory=O)
class Q(H.func):
    def log_message(self,*a):pass
H=functools.partial(Q,directory=O)
srv=socketserver.TCPServer(('127.0.0.1',8791),H); srv.allow_reuse_address=True
threading.Thread(target=srv.serve_forever,daemon=True).start()
B='http://127.0.0.1:8791'; ok=True
def chk(c,m):
    global ok
    print(('PASS ' if c else 'FAIL ')+m); ok&=bool(c)
with sync_playwright() as p:
    b=p.chromium.launch()
    # 1 english shorten flow with mocked API
    ctx=b.new_context(accept_downloads=True,locale='en-US'); pg=ctx.new_page(); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    def api(route):
        body=json.loads(route.request.post_data)
        if 'bad' in body['url']: route.fulfill(status=200,content_type='application/json',headers={'access-control-allow-origin':'*'},body=json.dumps({'errorcode':1,'errormessage':'x'}))
        else: route.fulfill(status=200,content_type='application/json',headers={'access-control-allow-origin':'*'},body=json.dumps({'shorturl':'https://urlshort.tr/'+(body['alias'] or 'abc123')}))
    ctx.route('https://urlshort.tr/api/shorten',api)
    pg.goto(B+'/'); 
    chk(pg.title().startswith('Free URL Shortener'),'en title '+pg.title())
    pg.fill('#longUrl','example.com/some/very/long/path?x=1'); pg.click('#shortenBtn'); pg.wait_for_selector('#result:not([hidden])')
    chk(pg.inner_text('#shortLink')=='urlshort.tr/abc123','short link shown')
    with pg.expect_download() as d: pg.click('#dlPng')
    d.value.save_as('/tmp/qr.png'); 
    with pg.expect_download() as d: pg.click('#dlSvg')
    d.value.save_as('/tmp/qr.svg')
    pg.fill('#longUrl','http://bad.example.com'); pg.click('#shortenBtn'); pg.wait_for_timeout(300)
    chk('not accepted' in pg.inner_text('#status'),'error text en: '+pg.inner_text('#status'))
    pg.screenshot(path='/tmp/en.png',full_page=False)
    chk(not errs,'no js errors en '+str(errs))
    # 2 suggestion bar with Hindi browser
    for loc,code,expect in [('hi-IN','hi','हिन्दी'),('es-MX','es','español'),('ar-EG','ar','العربية'),('de-DE','de','Deutsch')]:
        c2=b.new_context(locale=loc); q=c2.new_page(); q.goto(B+'/'); q.wait_for_timeout(300)
        chk(q.locator('.sg').count()==1 and expect.lower() in q.inner_text('.sg').lower() or code!='x' and q.locator('.sg').count()==1,'suggestion bar for '+loc+': '+(q.inner_text('.sg') if q.locator('.sg').count() else 'none'))
        q.click('.sg a'); q.wait_for_load_state(); chk(q.url.endswith('/'+code+'/'),'switched to '+q.url)
        chk(q.evaluate('document.documentElement.lang')==code,'lang attr '+code)
        q.goto(B+'/'); q.wait_for_timeout(300); chk(q.locator('.sg').count()==0,'choice remembered, no bar again')
        c2.close()
    c3=b.new_context(locale='en-GB'); q=c3.new_page(); q.goto(B+'/'); q.wait_for_timeout(300); chk(q.locator('.sg').count()==0,'no bar for english visitor on en page')
    q.goto(B+'/hi/'); q.wait_for_timeout(300); chk(q.locator('.sg').count()==1,'english visitor on /hi/ gets bar: '+q.inner_text('.sg'))
    # 3 qr page, mobile ar rtl
    for code in ['hi','ar','tr']:
        c4=b.new_context(viewport={'width':390,'height':844},locale='en-US'); q=c4.new_page(); errs=[]
        q.on('pageerror',lambda e:errs.append(str(e)))
        q.goto(B+'/%s/qr-code-generator/'%code); q.fill('#qrText','https://urlshort.tr/abc123'); q.wait_for_timeout(400)
        chk(q.locator('#qrCanvas').is_visible(),code+' qr canvas visible')
        sw=q.evaluate('document.documentElement.scrollWidth'); chk(sw<=392,code+' no horizontal scroll (%d)'%sw)
        q.screenshot(path='/tmp/qr_%s.png'%code)
        q.goto(B+'/%s/'%code); q.screenshot(path='/tmp/home_%s.png'%code,full_page=True)
        sw=q.evaluate('document.documentElement.scrollWidth'); chk(sw<=392,code+' home no horizontal scroll (%d)'%sw)
        chk(not errs,code+' no js errors '+str(errs)); c4.close()
    # check page
    q=b.new_context().new_page(); q.goto(B+'/de/check-short-link/'); q.fill('#checkUrl','example.com/x'); q.click('button[type=submit]'); q.wait_for_timeout(200)
    chk('Website' in q.inner_text('#status') or 'Kurzlinks' in q.inner_text('#status'),'check page rejects foreign: '+q.inner_text('#status'))
    b.close()
print('ALL OK' if ok else 'SOME FAILED')
