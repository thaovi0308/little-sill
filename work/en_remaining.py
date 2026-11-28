# After build_en.py pass 1: list string pieces of work/out/en_build/src that still hold Vietnamese words outside the glossary.
import sys, os, json, re; sys.path.insert(0, os.path.dirname(__file__)); from jsscan import pieces, scripts, VI
G = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else '.')
OK = ['Bà Lan', 'Hạnh', 'Khải', 'Thảo', 'Tết', 'Thất Tịch', 'lì xì', 'bánh chưng', 'mứt Tết', 'mứt gừng', 'Cốm', 'nước sâm', 'Nước sâm', 'mía lau',
      'chè đậu đỏ', 'Chè đậu đỏ', 'Chè đậu xanh', 'Chè trôi nước', 'Xôi gấc', 'gấc', 'Bánh chuối nướng', 'Bánh bò', 'bánh mì', 'mưa ngâu', 'Bắc Kim Thang',
      'Lý Cây Đa', 'Con Cò Bé Bé', 'Kìa Con Bướm Vàng', 'Grandma Tư', 'Mười Giờ', 'Trinh Nữ', 'Hồ Ngọc Đức', 'Tiếng Việt', 'Trung Thu', 'chè', 'Thất', 'Tịch']
def remaining(T):
    rem = {}
    for fn in sorted(os.listdir(T)):
        if not (fn.endswith('.js') or fn.endswith('.html')): continue
        t = open(f'{T}/{fn}', encoding='utf-8').read()
        for a, b in ([(0, len(t))] if fn.endswith('.js') else scripts(t)):
            for s, e, q in pieces(t[a:b]):
                x = t[a + s:a + e]; y = x
                for w in sorted(OK, key=len, reverse=True): y = y.replace(w, '')
                if VI.search(y): rem.setdefault(x, fn)
    return rem
if __name__ == '__main__':
    r = remaining(f'{G}/work/out/en_build/src')
    json.dump([{'id': i, 'vi': k, 'file': f} for i, (k, f) in enumerate(r.items())], open(f'{G}/i18n/todo/rest.json', 'w'), ensure_ascii=False, indent=1)
    print(len(r)); [print(repr(k[:120]), f) for k, f in r.items()]
