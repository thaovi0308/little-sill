# Vi's Thất Tịch sheet 27/11 (src/vi_1127/thattich_items.jpg): red thread bow, 2 magpies flying, envelope, red bean sweet soup + spoon, magpie stamp.
import sys
import cv2, numpy as np
G = sys.argv[1] if len(sys.argv) > 1 else '.'
A = f'{G}/assets'
im = cv2.imread(f'{G}/src/vi_1127/thattich_items.jpg')
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



save('red_thread', (60, 90, 300, 640), soft=25)
save('magpie1', (575, 60, 900, 370), soft=20, inner=7)
save('magpie2', (280, 240, 625, 590), soft=20, inner=7)
save('tt_letter', (925, 100, 1225, 320))
save('chedaudo', (670, 420, 970, 640), thr=234, sat=18, soft=14, inner=9)
save('st_magpie', (1005, 400, 1235, 640), soft=25)
