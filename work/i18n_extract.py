# Collect every Vietnamese string literal / HTML text in the game sources -> i18n/strings.json [{id, vi, file, line}]
# The English build replaces each literal's content by its translation (i18n/en.json {vi: en}).
import json, re, sys, os
G = sys.argv[1] if len(sys.argv) > 1 else '.'
VI = re.compile(r'[ăâđêôơưàáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵ]', re.I)
FILES = ['src/index.template.html'] + sorted('src/' + f for f in os.listdir(f'{G}/src') if f.endswith('.js'))
LIT = re.compile(r"'((?:[^'\\\n]|\\.)*)'|\"((?:[^\"\\\n]|\\.)*)\"|`((?:[^`\\]|\\.)*)`", re.S)
out, seen = [], set()
for fn in FILES:
    t = open(f'{G}/{fn}', encoding='utf-8').read()
    starts = [0]
    for l in t.split('\n'): starts.append(starts[-1] + len(l) + 1)
    import bisect
    def add(s, pos, kind):
        if not VI.search(s) or s in seen: return
        seen.add(s); out.append({'id': len(out), 'vi': s, 'file': fn, 'line': bisect.bisect_right(starts, pos), 'kind': kind})
    # skip // comments (but not inside strings: good enough, comments are English)
    code = re.sub(r'(?m)(^|[^:\'"`\\])//[^\n]*', lambda m: m.group(1) + ' ' * (len(m.group(0)) - len(m.group(1))), t)
    for m in LIT.finditer(code):
        s = m.group(1) if m.group(1) is not None else m.group(2) if m.group(2) is not None else m.group(3)
        add(s, m.start(), 'lit')
    if fn.endswith('.html'):   # visible text between tags in the static HTML
        for m in re.finditer(r'>([^<>{}`]*?)<', code):
            s = m.group(1).strip()
            if s: add(s, m.start(), 'html')
json.dump(out, open(f'{G}/i18n/strings.json', 'w'), ensure_ascii=False, indent=0)
print(len(out), 'strings', sum(len(x['vi']) for x in out), 'chars')
from collections import Counter; print(Counter(x['file'] for x in out))
