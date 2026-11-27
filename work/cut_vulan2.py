# Vi's Vu Lan sheet 2 27/11 (src/vi_1127/vulan_items2.jpg): empty basin, lotus lantern unlit + lit (with glow).
import sys
import cv2, numpy as np
G = sys.argv[1] if len(sys.argv) > 1 else '.'
A = f'{G}/assets'
im = cv2.imread(f'{G}/src/vi_1127/vulan_items2.jpg')
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



save('vl_basin_empty', (40, 150, 595, 610), soft=30, inner=31)
save('hoadang_off', (595, 270, 885, 535), soft=25, inner=9)
save('hoadang_on', (890, 200, 1250, 590), thr=234, sat=250)   # glow left out: the game draws its own warm halo
