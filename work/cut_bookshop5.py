# Vi 27/11 (src/vi_1127/bookshop_items3.jpg): 8 books by spine colour (shelf sorting game), borrow card plain / gold,
# grandma's pressed-flower album. (Open book, daisy, note, painting, stamp: same as bookshop_items2.jpg, see cut_bookshop4.py.)
import sys
import cv2, numpy as np
G = sys.argv[1] if len(sys.argv) > 1 else '.'
A = f'{G}/assets'
im = cv2.imread(f'{G}/src/vi_1127/bookshop_items3.jpg')
g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY); hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
def save(name, box, thr=222, sat=40, close=7, frac=0.03, drop=None):
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
# the books stand side by side: one mask for the row, then a column slice per book
x0, y0, x1, y1 = 80, 55, 570, 330
fg = ((g[y0:y1, x0:x1] < 222) | (hsv[y0:y1, x0:x1, 1] > 40)).astype(np.uint8) * 255
fg = cv2.morphologyEx(fg, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
COLS = [('red', 86, 139), ('orange', 142, 193), ('amber', 195, 248), ('yellow', 249, 304), ('green', 306, 364), ('sage', 366, 414), ('blue', 414, 469), ('brown', 471, 565)]
for name, a, b in COLS:
    m = fg[:, a - x0:b - x0].copy()
    n, lab, st, _ = cv2.connectedComponentsWithStats(m); k = 1 + np.argmax(st[1:, cv2.CC_STAT_AREA]); m = np.where(lab == k, 255, 0).astype(np.uint8)
    if name != 'brown':   # the dark gap behind a taller neighbour shows above the shorter book: keep from its own top down
        rows = np.where((m > 0).sum(1) > 0.7 * m.shape[1])[0]; m[:max(0, rows[0] - 5)] = 0
    m = cv2.GaussianBlur(m, (3, 3), 0)
    out = cv2.cvtColor(im[y0:y1, a:b], cv2.COLOR_BGR2BGRA); out[..., 3] = m
    ys, xs = np.where(m > 20); out = out[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    cv2.imwrite(f'{A}/book_{name}.png', out); print('book_' + name, out.shape[1], out.shape[0])
save('bk_card', (55, 372, 238, 636))
save('bk_card_gold', (235, 375, 410, 640))
save('bk_album', (435, 365, 705, 670))
