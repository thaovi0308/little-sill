# Vi 27/11 (src/vi_1127/fan_cat_bell.jpg): bamboo hand fan for the kitchen corner, and Bánh Quy asleep with the bell collar.
import sys
import cv2, numpy as np
G = sys.argv[1] if len(sys.argv) > 1 else '.'
im = cv2.imread(f'{G}/src/vi_1127/fan_cat_bell.jpg')
g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY); hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
def save(name, box, frac=0.08, fade=True, fill=True):
    x0, y0, x1, y1 = box
    fg = ((g[y0:y1, x0:x1] < 232) | (hsv[y0:y1, x0:x1, 1] > 22)).astype(np.uint8) * 255
    m = cv2.morphologyEx(fg, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    cnts, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    big = max(cv2.contourArea(c) for c in cnts)
    keep = np.zeros_like(m); cv2.drawContours(keep, [c for c in cnts if cv2.contourArea(c) > big * frac], -1, 255, -1)
    if not fill: keep = cv2.bitwise_and(keep, cv2.morphologyEx(fg, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8)))   # ring: keep the hole
    if fade:
        gg = g[y0:y1, x0:x1].astype(np.float32)
        a = np.clip((246 - gg) * 8 / 255, 0, 1)   # whiskers / fur fluff fade into the paper
        core = cv2.GaussianBlur(cv2.erode(keep, np.ones((7, 7), np.uint8)), (7, 7), 0).astype(np.float32) / 255
        m = (cv2.GaussianBlur(keep, (3, 3), 0).astype(np.float32) * np.maximum(a, core)).astype(np.uint8)
    else: m = cv2.GaussianBlur(keep, (3, 3), 0)
    out = cv2.cvtColor(im[y0:y1, x0:x1], cv2.COLOR_BGR2BGRA); out[..., 3] = m
    ys, xs = np.where(m > 20); out = out[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    cv2.imwrite(f'{G}/assets/{name}.png', out); print(name, out.shape[1], out.shape[0])
save('kit_fan', (100, 60, 560, 645), fade=False)
# replaced by work/cut_cat_bell2.py
# save('cat_sleep_bell', (640, 140, 1205, 545))
