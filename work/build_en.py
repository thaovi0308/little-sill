# English build: copy the sources with every Vietnamese literal replaced from i18n/done/part_*.json (+ i18n/fix.json overrides),
# run build_html.py on that copy, save as en.html next to index.html (same img/ and audio/, same save).
# Usage: build_en.py <game dir>   (run build_html.py for the Vietnamese page separately)
import json, re, os, sys, shutil, subprocess, glob
G = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else '.')
S = {s['id']: s for s in json.load(open(f'{G}/i18n/strings.json'))}
EN = {}
for f in sorted(glob.glob(f'{G}/i18n/done/part_*.json')):   # ids are those of i18n/todo (the text the translators saw)
    src = {str(x['id']): x['vi'] for x in json.load(open(f.replace('/done/', '/todo/')))}
    for k, v in json.load(open(f)).items(): EN[src[k]] = v
if os.path.exists(f'{G}/i18n/fix.json'): EN.update(json.load(open(f'{G}/i18n/fix.json')))
LIT = re.compile(r"'((?:[^'\\\n]|\\.)*)'|\"((?:[^\"\\\n]|\\.)*)\"|`((?:[^`\\]|\\.)*)`", re.S)
def esc(s, q):   # keep the literal valid whatever the translator typed
    if q == "'": return re.sub(r"(?<!\\)'", "’", s)
    if q == '"': return re.sub(r'(?<!\\)"', '”', s)
    return re.sub(r'(?<!\\)`', '’', s)
INNER = re.compile(r"'((?:[^'\\\n]|\\.)*)'")
def inner(s):   # Vietnamese literals nested inside ${ ... } of a translated template string
    return INNER.sub(lambda m: "'" + esc(EN[m.group(1)], "'") + "'" if m.group(1) in EN else m.group(0), s)
sys.path.insert(0, f'{G}/work'); import jsscan
RAW = json.load(open(f'{G}/i18n/fix_raw.json')) if os.path.exists(f'{G}/i18n/fix_raw.json') else {}
FIX2 = json.load(open(f'{G}/i18n/fix2.json')) if os.path.exists(f'{G}/i18n/fix2.json') else {}
T = f'{G}/work/out/en_build'; shutil.rmtree(T, ignore_errors=True); os.makedirs(f'{T}/src')
for d in ['assets', 'work', 'img', 'audio', 'i18n']: os.symlink(f'{G}/{d}', f'{T}/{d}')
missing = set(); used = 0
for fn in os.listdir(f'{G}/src'):
    p = f'{G}/src/{fn}'
    if os.path.isdir(p): continue
    if not (fn.endswith('.js') or fn.endswith('.html')): shutil.copy(p, f'{T}/src/{fn}'); continue
    t = open(p, encoding='utf-8').read()
    code = re.sub(r'(?m)(^|[^:\'"`\\])//[^\n]*', lambda m: m.group(1) + ' ' * (len(m.group(0)) - len(m.group(1))), t)
    spans = []
    for m in LIT.finditer(code):
        gi = 1 if m.group(1) is not None else 2 if m.group(2) is not None else 3
        s = m.group(gi)
        if s in EN: spans.append((m.start(gi), m.end(gi), esc(inner(EN[s]), m.group(0)[0])))
        elif re.search(r'[ăâđêôơưạảấầẩẫậắằẳẵặẹẻẽếềểễệịỉĩọỏốồổỗộớờởỡợụủứừửữựỵỷỹ]', s): missing.add(s[:60])
    if fn.endswith('.html'):
        taken = [(a, b) for a, b, _ in spans]
        for m in re.finditer(r'>([^<>{}`]*?)<', code):
            s = m.group(1).strip()
            if s in EN and not any(a <= m.start(1) < b for a, b in taken):
                i = m.start(1) + m.group(1).index(s); spans.append((i, i + len(s), EN[s]))
    for a, b, r in sorted(spans, reverse=True): t = t[:a] + r + t[b:]
    used += len(spans)
    t = t.replace("toLocaleDateString('vi-VN')", "toLocaleDateString('en-GB')")
    if fn == 'index.template.html':
        t = t.replace('<html lang="vi">', '<html lang="en">', 1)
        t = re.sub(r'<title>[^<]*</title>', '<title>Little Sill — By the Little Window</title>', t, 1)
    # pass 2: pieces the first extractor could not see (templates nested inside ${...}), from i18n/fix_raw.json + fix2.json
    for k, v in RAW.items():
        if k in t: t = t.replace(k, v); used += 1
    segs = [(0, len(t))] if fn.endswith('.js') else jsscan.scripts(t)
    rep = []
    for a0, b0 in segs:
        for s0, e0, q in jsscan.pieces(t[a0:b0]):
            x = t[a0 + s0:a0 + e0]
            if x in FIX2: rep.append((a0 + s0, a0 + e0, esc(FIX2[x], q)))
    for a0, b0, r0 in sorted(rep, reverse=True): t = t[:a0] + r0 + t[b0:]
    used += len(rep)
    open(f'{T}/src/{fn}', 'w', encoding='utf-8').write(t)
print('replaced', used, 'missing', len(missing))
for s in sorted(missing)[:40]: print('  MISSING', s)
r = subprocess.run([sys.executable, f'{G}/work/build_html.py', T], capture_output=True, text=True); print(r.stdout.strip(), r.stderr[-800:])
html = open(f'{T}/index.html', encoding='utf-8').read()
open(f'{G}/en.html', 'w', encoding='utf-8').write(html); print('en.html', len(html) // 1024, 'KB')
# syntax check of every inline script
js = re.findall(r'<script>(.*?)</script>', html, re.S)
open(f'{T}/check.js', 'w').write('\n;\n'.join(js))
VIre = re.compile(r'[ăâđêôơưạảấầẩẫậắằẳẵặẹẻẽếềểễệịỉĩọỏốồổỗộớờởỡợụủứừửữựỵỷỹ]')
left = sorted({m.group(0)[:90] for m in re.finditer(r"[^'\"`<>\n]{0,40}[ăâđêôơưạảấầẩẫậắằẳẵặẹẻẽếềểễệịỉĩọỏốồổỗộớờởỡợụủứừửữựỵỷỹ][^'\"`<>\n]{0,40}", html)})
open(f'{G}/i18n/leftover.txt', 'w').write('\n'.join(left)); print('leftover snippets', len(left))
c = subprocess.run(['node', '--check', f'{T}/check.js'], capture_output=True, text=True); print('node --check', 'OK' if c.returncode == 0 else c.stderr[:1500])
