# Cut Vi's sheet src/vi_1126/stairs_items.jpg (26/11, stair-foot props) into assets/: white paper -> transparent.
import cv2, numpy as np, sys
G = sys.argv[1] if len(sys.argv) > 1 else '.'
im = cv2.imread(f'{G}/src/vi_1126/stairs_items.jpg')
BOX = {'butterfly': (262, 38, 368, 126), 'mailbox2': (60, 85, 425, 630), 'geta': (440, 90, 800, 330), 'broom': (620, 150, 870, 830),
       'snake_plant': (400, 365, 630, 790), 'snake_plant2': (30, 665, 290, 1145), 'bench': (315, 840, 865, 1170)}
OPEN = set()   # all solid drawings: fill the outline
WHITE = {'mailbox2': [(268, 30, 370, 116)], 'butterfly': [(250, 108, 305, 140), (285, 118, 320, 140)]}
for n, (x0, y0, x1, y1) in BOX.items():
    src = im.copy()
    for (a0, b0, a1, b1) in WHITE.get(n, []): src[b0:b1, a0:a1] = 255
    c = src[y0:y1, x0:x1]
    g = cv2.cvtColor(c, cv2.COLOR_BGR2GRAY); hsv = cv2.cvtColor(c, cv2.COLOR_BGR2HSV)
    fg = ((g < 235) | (hsv[..., 1] > 22)).astype(np.uint8) * 255
    fg = cv2.morphologyEx(fg, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    cnts, _ = cv2.findContours(fg, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    big = max(cnts, key=cv2.contourArea)   # one object per box: drop bits of the neighbours
    m = np.zeros_like(fg); cv2.drawContours(m, [big], -1, 255, -1)
    paper = ((g > 238) & (hsv[..., 1] < 18)).astype(np.uint8)   # see-through gaps inside the outline (bench legs, broom)
    k, lab, st, _ = cv2.connectedComponentsWithStats(paper)
    for i in range(1, k):
        if st[i, 4] > 400: m[lab == i] = 0
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
