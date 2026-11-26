# Cut Vi's sheet src/vi_1126/items4.jpg (26/11, bookmark materials) into assets/: white paper -> transparent.
import cv2, numpy as np, sys
G = sys.argv[1] if len(sys.argv) > 1 else '.'
im = cv2.imread(f'{G}/src/vi_1126/items4.jpg')
BOX = {'pf_daisy': (40, 160, 220, 335), 'pf_lavender': (240, 90, 315, 400), 'pf_fern': (335, 85, 535, 395), 'pf_maple': (535, 140, 710, 350),
       'pf_clover': (720, 145, 860, 350), 'st_paw': (50, 485, 295, 730), 'st_moon': (330, 485, 575, 730), 'st_watch': (605, 485, 850, 730),
       'rb_twine': (65, 855, 440, 1115), 'rb_blue': (490, 855, 830, 1110)}
OPEN = {'pf_lavender', 'pf_fern', 'pf_maple', 'pf_clover', 'rb_twine', 'st_paw', 'st_moon'}   # rb_blue + st_watch keep their solid fill
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
