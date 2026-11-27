# Vi 27/11 (src/vi_1127/cat_acc.jpg): Bánh Quy accessories for the decor panel -- red bow (sleep + sit), plaid scarf
# (sit + sleep), bell collar (two sitting cats), the three accessories alone (picker icons) and the green album cover.
import sys
import cv2, numpy as np
G = sys.argv[1] if len(sys.argv) > 1 else '.'
im = cv2.imread(f'{G}/src/vi_1127/cat_acc.jpg')
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
save('cat_sleep_bow', (36, 55, 285, 200))
save('cat_sit_bow', (250, 75, 420, 325))
save('cat_sit_scarf', (500, 30, 655, 258))
save('cat_sleep_scarf', (600, 205, 840, 352))
save('cat_sit_bell', (895, 40, 1060, 258))
save('cat_sit_bell2', (1065, 60, 1235, 295))   # second sitting pose, not used yet
save('acc_bow', (575, 475, 745, 610), fade=False)
save('acc_scarf', (785, 425, 955, 625), fade=False)
save('acc_bell', (1005, 470, 1195, 615), fade=False, fill=False)
save('album_cover', (55, 370, 540, 670), fade=False)
