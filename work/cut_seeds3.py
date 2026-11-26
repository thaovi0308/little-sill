# Cut Vi's sheet src/vi_1126/seeds3.jpg (26/11, seed packets + new plants) into assets/: white paper -> transparent.
import cv2, numpy as np, sys
G = sys.argv[1] if len(sys.argv) > 1 else '.'
im = cv2.imread(f'{G}/src/vi_1126/seeds3.jpg')
BOX = {'seed_forget': (30, 115, 215, 355), 'forget0': (240, 135, 410, 392), 'forget2': (410, 35, 700, 410),
       'seed_hydrangea': (30, 505, 215, 750), 'hydrangea0': (240, 530, 410, 795), 'hydrangea2': (415, 445, 700, 812),
       'seed_clover': (30, 930, 215, 1180), 'clover0': (240, 995, 405, 1225), 'clover2': (390, 845, 705, 1240)}
OPEN = set()   # all solid drawings: fill the outline
for n, (x0, y0, x1, y1) in BOX.items():
    c = im[y0:y1, x0:x1]
    g = cv2.cvtColor(c, cv2.COLOR_BGR2GRAY); hsv = cv2.cvtColor(c, cv2.COLOR_BGR2HSV)
    fg = ((g < 235) | (hsv[..., 1] > 22)).astype(np.uint8) * 255
    fg = cv2.morphologyEx(fg, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    cnts, _ = cv2.findContours(fg, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    m = np.zeros_like(fg); cv2.drawContours(m, [k for k in cnts if cv2.contourArea(k) > 300], -1, 255, -1)
    if n in OPEN: m = cv2.bitwise_and(m, cv2.dilate(fg, np.ones((3, 3), np.uint8)))   # open frames: keep the holes see-through
    m = cv2.GaussianBlur(m, (3, 3), 0)
    out = cv2.cvtColor(c, cv2.COLOR_BGR2BGRA); out[..., 3] = m
    if n in OPEN:   # un-blend the white paper: alpha from how far the darkest channel is from white, colour divided back
        a = np.clip((250 - c.min(2).astype(np.float32)) * 2.4, 0, 255) / 255 * (m / 255)
        col = (c.astype(np.float32) - (1 - a[..., None]) * 255) / np.maximum(a[..., None], 1e-3)
        out[..., :3] = np.clip(col, 0, 255).astype(np.uint8); out[..., 3] = (a * 255).astype(np.uint8)
    ys, xs = np.where(out[..., 3] > 20)
    out = out[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    cv2.imwrite(f'{G}/assets/{n}.png', out); print(n, out.shape[1], out.shape[0])
