# Vi 27/11 (src/vi_1127/season_items.jpg): season gifts and stamps: scarf on a chair (winter), ginger tea cup + its stamp,
# market seed packet (spring), swallow stamp.
import sys
import cv2, numpy as np
G = sys.argv[1] if len(sys.argv) > 1 else '.'
A = f'{G}/assets'
im = cv2.imread(f'{G}/src/vi_1127/season_items.jpg')
g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY); hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
FG = ((g < 232) | (hsv[..., 1] > 25)).astype(np.uint8) * 255


def save(name, mask, box, minarea=150, close=7):
    x0, y0, x1, y1 = box
    m = mask[y0:y1, x0:x1].copy()
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((close, close), np.uint8))
    cnts, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    big = max(cv2.contourArea(c) for c in cnts)
    keep = np.zeros_like(m); cv2.drawContours(keep, [c for c in cnts if cv2.contourArea(c) > max(minarea, big * 0.04)], -1, 255, -1)
    if close < 7: keep = cv2.bitwise_and(keep, m)          # thin pressed stems: do not fill the paper between them
    m = cv2.GaussianBlur(keep, (3, 3), 0)
    out = cv2.cvtColor(im[y0:y1, x0:x1], cv2.COLOR_BGR2BGRA); out[..., 3] = m
    ys, xs = np.where(m > 20)
    out = out[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    cv2.imwrite(f'{A}/{name}.png', out); return out


def cut(name, box): return save(name, FG, box)

save('sea_scarf', FG, (60, 80, 600, 670), close=5)   # no hole filling: keep the gap between the chair legs see-through
cut('sea_ginger', (680, 40, 905, 330))
cut('st_ginger', (990, 55, 1200, 288))
cut('sea_seeds', (655, 365, 925, 670))
cut('st_swallow', (965, 390, 1215, 620))
