# Vi's bookshop decor 27/11 (src/vi_1127/bookshop_items2.jpg): chalkboard sign, straw pouf + books, pothos shelf,
# cat asleep in a book crate, magnifier, tied scroll. For the Tiệm Sách scene (route 6, not coded yet).
import sys
import cv2, numpy as np
G = sys.argv[1] if len(sys.argv) > 1 else '.'
A = f'{G}/assets'
im = cv2.imread(f'{G}/src/vi_1127/bookshop_items2.jpg')
g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY); hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
def save(name, box, thr=228, sat=30, close=7, frac=0.03, drop=None):
    x0, y0, x1, y1 = box
    fg = ((g[y0:y1, x0:x1] < thr) | (hsv[y0:y1, x0:x1, 1] > sat)).astype(np.uint8) * 255
    if drop is not None:
        yy, xx = np.mgrid[y0:y1, x0:x1]; fg[drop(xx, yy)] = 0
    m = cv2.morphologyEx(fg, cv2.MORPH_CLOSE, np.ones((close, close), np.uint8))
    cnts, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    big = max(cv2.contourArea(c) for c in cnts)
    keep = np.zeros_like(m); cv2.drawContours(keep, [c for c in cnts if cv2.contourArea(c) > big * frac], -1, 255, -1)
    m = cv2.GaussianBlur(keep, (3, 3), 0)
    out = cv2.cvtColor(im[y0:y1, x0:x1], cv2.COLOR_BGR2BGRA); out[..., 3] = m
    ys, xs = np.where(m > 20); out = out[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    cv2.imwrite(f'{A}/{name}.png', out); print(name, out.shape[1], out.shape[0])
save('bk_front', (120, 80, 640, 610))
save('bk_openbook', (650, 40, 1065, 335))
save('bk_daisy', (1065, 55, 1215, 200))
save('bk_note', (1035, 205, 1220, 345))
save('painting_bookshop', (735, 375, 970, 640))
save('st_book', (1005, 400, 1240, 640), sat=25)
# the stamp: only the red ink, the paper inside the ring goes transparent (like the other stamps)
st = cv2.imread(f'{A}/st_book.png', cv2.IMREAD_UNCHANGED).astype(np.float32)
gg = cv2.cvtColor(st[..., :3].astype(np.uint8), cv2.COLOR_BGR2GRAY).astype(np.float32)
ss = cv2.cvtColor(st[..., :3].astype(np.uint8), cv2.COLOR_BGR2HSV)[..., 1].astype(np.float32)
st[..., 3] *= np.clip(np.maximum((242 - gg) * 6, (ss - 25) * 5) / 255, 0, 1)
cv2.imwrite(f'{A}/st_book.png', st.astype(np.uint8)); print('st_book ink only')
