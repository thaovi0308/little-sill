# Vi 27/11 (src/vi_1127/kitchen_items.jpg): charcoal stove + clay pot, and the 6 dishes of Góc Bếp Nhỏ.
import sys
import cv2, numpy as np
G = sys.argv[1] if len(sys.argv) > 1 else '.'
im = cv2.imread(f'{G}/src/vi_1127/kitchen_items.jpg')
g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY); hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
def save(name, box, frac=0.03):
    x0, y0, x1, y1 = box
    fg = ((g[y0:y1, x0:x1] < 236) | (hsv[y0:y1, x0:x1, 1] > 20)).astype(np.uint8) * 255
    m = cv2.morphologyEx(fg, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    cnts, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    big = max(cv2.contourArea(c) for c in cnts)
    keep = np.zeros_like(m); cv2.drawContours(keep, [c for c in cnts if cv2.contourArea(c) > big * frac], -1, 255, -1)
    m = cv2.GaussianBlur(keep, (3, 3), 0)
    out = cv2.cvtColor(im[y0:y1, x0:x1], cv2.COLOR_BGR2BGRA); out[..., 3] = m
    ys, xs = np.where(m > 20); out = out[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    cv2.imwrite(f'{G}/assets/{name}.png', out); print(name, out.shape[1], out.shape[0])
save('kit_stove', (60, 110, 420, 615))
save('kit_chedauxanh', (535, 30, 815, 245))
save('kit_flan', (905, 80, 1200, 228))
save('kit_banhbo', (465, 255, 840, 430))
save('kit_troinuoc', (920, 250, 1185, 435))
save('kit_xoigac', (465, 455, 840, 640))
save('kit_banhchuoi', (885, 445, 1225, 625))
