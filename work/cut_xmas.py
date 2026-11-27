# Vi's Christmas sheet 27/11 (src/vi_1127/xmas_items.jpg): 2 pot trees (plain / lit), 5 ornaments, wool hat, cocoa, 2 stamps.
import sys
import cv2, numpy as np
G = sys.argv[1] if len(sys.argv) > 1 else '.'
A = f'{G}/assets'
im = cv2.imread(f'{G}/src/vi_1127/xmas_items.jpg')
g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY); hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)


def save(name, box, thr=228, sat=30, close=7, frac=0.03, soft=0, inner=0):
    x0, y0, x1, y1 = box
    fg = ((g[y0:y1, x0:x1] < thr) | (hsv[y0:y1, x0:x1, 1] > sat)).astype(np.uint8) * 255
    m = cv2.morphologyEx(fg, cv2.MORPH_CLOSE, np.ones((close, close), np.uint8))
    cnts, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    big = max(cv2.contourArea(c) for c in cnts)
    keep = np.zeros_like(m); cv2.drawContours(keep, [c for c in cnts if cv2.contourArea(c) > big * frac], -1, 255, -1)
    m = cv2.GaussianBlur(keep, (3, 3), 0).astype(np.float32)
    if soft:   # paper showing between needles / around the glow: alpha from how far the pixel is from the paper
        gg = g[y0:y1, x0:x1].astype(np.float32); ss = hsv[y0:y1, x0:x1, 1].astype(np.float32)
        a = np.clip(np.maximum((242 - gg) * 6, (ss - soft) * 5) / 255, 0, 1)
        if inner:   # keep the inside solid (the lit tree's white bulbs), soften only a band along the outline
            core = cv2.GaussianBlur(cv2.erode(keep, np.ones((inner, inner), np.uint8)), (9, 9), 0).astype(np.float32) / 255
            a = np.maximum(a, core)
        m = m * a
    m = m.astype(np.uint8)
    out = cv2.cvtColor(im[y0:y1, x0:x1], cv2.COLOR_BGR2BGRA); out[..., 3] = m
    ys, xs = np.where(m > 20); out = out[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    cv2.imwrite(f'{A}/{name}.png', out); print(name, out.shape[1], out.shape[0])


save('xmas_tree', (30, 50, 330, 645), soft=20, inner=21)
save('xmas_tree_lit', (335, 40, 630, 645), frac=0.002, soft=40, inner=21)
save('orn_bow', (670, 120, 785, 215))
save('orn_ball', (800, 95, 890, 225))
save('orn_bell', (900, 120, 995, 225))
save('orn_cane', (750, 230, 830, 355))
save('orn_star', (845, 220, 950, 345))
save('xmas_hat', (1015, 130, 1245, 315))
save('cocoa', (670, 380, 870, 645), thr=236, sat=18, frac=0.01)
save('st_xmas_snow', (870, 440, 1065, 640), soft=25)
save('st_xmas_bell', (1060, 440, 1255, 640), soft=25)

# Minh's string lights (no separate drawing): a branch of the lit tree with its bulbs, in a soft oval
t = cv2.imread(f'{A}/xmas_tree_lit.png', cv2.IMREAD_UNCHANGED)
crop = t[262:352, 60:222].copy(); h, w = crop.shape[:2]
ov = np.zeros((h, w), np.uint8); cv2.ellipse(ov, (w // 2, h // 2), (w // 2 - 4, h // 2 - 4), 0, 0, 360, 255, -1)
ov = cv2.GaussianBlur(ov, (21, 21), 0); crop[..., 3] = (crop[..., 3].astype(np.float32) * ov / 255).astype(np.uint8)
cv2.imwrite(f'{A}/orn_lights.png', crop); print('orn_lights', w, h)
