# Minimal JS lexer: yields (start, end, quote) for every string piece in JS code: '...', "...", and each text segment of a
# template literal (between ` / } and ${ / `), with correct nesting of ${ `...` } . Comments and regex literals are skipped.
import re
VI = re.compile(r'[ăâđêôơưạảấầẩẫậắằẳẵặẹẻẽếềểễệịỉĩọỏốồổỗộớờởỡợụủứừửữựỵỷỹĂÂĐÊÔƠƯẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼẾỀỂỄỆỊỈĨỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỴỶỸ]')
def pieces(c):
    out = []; i = 0; n = len(c); stack = []   # stack of brace depths for open ${ ... }
    depth = 0; prev = ''                      # last significant char (regex detection)
    def tmpl(i):                              # i just after a backtick or the closing } of ${; returns index after segment
        s = i
        while i < n:
            ch = c[i]
            if ch == '\\': i += 2; continue
            if ch == '`': out.append((s, i, '`')); return i + 1, False
            if ch == '$' and i + 1 < n and c[i + 1] == '{': out.append((s, i, '`')); return i + 2, True
            i += 1
        raise ValueError('unterminated template')
    while i < n:
        ch = c[i]
        if ch in ' \t\r\n': i += 1; continue
        if c.startswith('//', i): j = c.find('\n', i); i = n if j < 0 else j; continue
        if c.startswith('/*', i): j = c.find('*/', i + 2); i = n if j < 0 else j + 2; continue
        if ch in '\'"':
            j = i + 1
            while c[j] != ch:
                if c[j] == '\\': j += 1
                if c[j] == '\n': raise ValueError('newline in string at %d' % i)
                j += 1
            out.append((i + 1, j, ch)); i = j + 1; prev = 'a'; continue
        if ch == '`':
            i, opened = tmpl(i + 1)
            if opened: stack.append(depth); depth = 0; prev = '('
            else: prev = 'a'
            continue
        if ch == '/' and (prev in '' or prev in '(,=:[!&|?{};+-*%<>~^' or re.search(r'(?:return|typeof|case|in|of)\s*$', c[max(0, i - 8):i])):
            j = i + 1; cls = False
            while True:
                if c[j] == '\\': j += 2; continue
                if c[j] == '[': cls = True
                elif c[j] == ']': cls = False
                elif c[j] == '/' and not cls: break
                elif c[j] == '\n': raise ValueError('bad regex at %d' % i)
                j += 1
            i = j + 1
            while i < n and c[i].isalpha(): i += 1
            prev = 'a'; continue
        if ch == '{': depth += 1
        elif ch == '}':
            if depth == 0 and stack:
                depth = stack.pop(); i, opened = tmpl(i + 1)
                if opened: stack.append(depth); depth = 0; prev = '('
                else: prev = 'a'
                continue
            depth -= 1
        prev = ch if not (ch.isalnum() or ch in '_$') else 'a'
        i += 1
    return out
def scripts(html):   # (start, end) of inline <script> bodies
    return [(m.start(1), m.end(1)) for m in re.finditer(r'<script[^>]*>(.*?)</script>', html, re.S)]
