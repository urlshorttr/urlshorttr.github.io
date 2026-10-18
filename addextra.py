import sys,json,re
def add(code,home,qr):
    p='i18n/%s.yml'%code; s=open(p,encoding='utf-8').read()
    if '\n  extra:' in s: print(code,'already'); return
    def blk(items): return '  extra:\n'+''.join('    - h: %s\n      d: %s\n'%(json.dumps(h,ensure_ascii=False),json.dumps(d,ensure_ascii=False)) for h,d in items)
    i=s.index('\n  faq_h:'); s=s[:i+1]+blk(home)+s[i+1:]
    j=s.index('\n  tips_h:'); s=s[:j+1]+blk(qr)+s[j+1:]
    open(p,'w',encoding='utf-8').write(s); print(code,'ok')
