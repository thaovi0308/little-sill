# Vi's Tết sheet 27/11 (src/vi_1127/tet_items3.jpg): mai tree in bud, 4 spring stamps, the landlady in her Tết shirt with the tray
import sys
import cv2, numpy as np
G = sys.argv[1] if len(sys.argv) > 1 else '.'
A = f'{G}/assets'
im = cv2.imread(f'{G}/src/vi_1127/tet_items3.jpg')
g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY); hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
FG = ((g < 232) | (hsv[..., 1] > 25)).astype(np.uint8) * 255


def cut(name, box, pad=6):
    x0, y0, x1, y1 = box[0] - pad, box[1] - pad, box[0] + box[2] + pad, box[1] + box[3] + pad
    m = cv2.morphologyEx(FG[y0:y1, x0:x1], cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    cnts, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    big = max(cv2.contourArea(c) for c in cnts)
    keep = np.zeros_like(m); cv2.drawContours(keep, [c for c in cnts if cv2.contourArea(c) > big * 0.03], -1, 255, -1)
    keep = cv2.GaussianBlur(keep, (3, 3), 0)
    out = cv2.cvtColor(im[y0:y1, x0:x1], cv2.COLOR_BGR2BGRA); out[..., 3] = keep
    ys, xs = np.where(keep > 20); cv2.imwrite(f'{A}/{name}.png', out[ys.min():ys.max() + 1, xs.min():xs.max() + 1])


cut('mai_bud', (17, 54, 233, 457))
cut('st_tet_watch', (259, 95, 215, 213))
cut('st_tet_brush', (484, 85, 215, 224))
cut('st_tet_cat', (259, 330, 215, 214))
cut('st_tet_mai', (484, 330, 215, 215))
cut('landlady_tet', (199, 571, 371, 686))
print('tet3 ok')
