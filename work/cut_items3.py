# Cut Vi's sheet src/vi_1126/items3.jpg (26/11) into assets/: white paper -> transparent.
import cv2, numpy as np, sys
G = sys.argv[1] if len(sys.argv) > 1 else '.'
im = cv2.imread(f'{G}/src/vi_1126/items3.jpg')
BOX = {'banhchung': (30, 50, 350, 310), 'mooncake2': (455, 55, 690, 280), 'star_lantern': (20, 330, 290, 705),
       'mai_branch': (310, 285, 485, 625), 'rabbit_face': (495, 395, 680, 630),
       'badge_plane': (25, 730, 240, 945), 'badge_tag': (250, 695, 465, 945), 'badge_mailbox': (475, 730, 690, 945),
       'badge_shop': (120, 965, 345, 1180), 'badge_sleep': (370, 965, 595, 1180)}
OPEN = {'star_lantern', 'mai_branch'}
for n, (x0, y0, x1, y1) in BOX.items():
    c = im[y0:y1, x0:x1]
    g = cv2.cvtColor(c, cv2.COLOR_BGR2GRAY); hsv = cv2.cvtColor(c, cv2.COLOR_BGR2HSV)
    fg = ((g < 235) | (hsv[..., 1] > 22)).astype(np.uint8) * 255
    fg = cv2.morphologyEx(fg, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    cnts, _ = cv2.findContours(fg, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    m = np.zeros_like(fg); cv2.drawContours(m, [k for k in cnts if cv2.contourArea(k) > 300], -1, 255, -1)
    if n in OPEN: m = cv2.bitwise_and(m, cv2.dilate(fg, np.ones((3, 3), np.uint8)))   # open frames: keep the holes see-through
    m = cv2.GaussianBlur(m, (3, 3), 0)
    ys, xs = np.where(m > 20); out = cv2.cvtColor(c, cv2.COLOR_BGR2BGRA); out[..., 3] = m
    out = out[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    cv2.imwrite(f'{G}/assets/{n}.png', out); print(n, out.shape[1], out.shape[0])
