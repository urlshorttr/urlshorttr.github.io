import yaml,sys,glob,os
D=os.path.dirname(os.path.abspath(__file__))+'/i18n/'
en=yaml.safe_load(open(D+'en.yml',encoding='utf-8'))
def keys(o,p=''):
    if isinstance(o,dict):
        for k,v in o.items(): yield from keys(v,p+k+'.')
    elif isinstance(o,list):
        yield p+'#%d'%len(o)
        for i,v in enumerate(o): yield from keys(v,p+'[]')
    else: yield p
E=set(keys(en))
import re
for f in sorted(glob.glob(D+'*.yml')):
    d=yaml.safe_load(open(f,encoding='utf-8')); K=set(keys(d)); n=os.path.basename(f)
    miss=E-K-{'dir'}; extra=K-E-{'dir'}
    ph=lambda o:sorted(re.findall(r'\[\[\w+\]\]|\{n\}',yaml.dump(o,allow_unicode=True)))
    print(n,'OK' if not miss and not extra and ph(d)==ph(en) else ('MISSING',sorted(miss)[:5],'EXTRA',sorted(extra)[:5],'PH',ph(d)==ph(en)))
