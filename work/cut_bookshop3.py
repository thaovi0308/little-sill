# Vi 27/11 (src/vi_1127/bookshop_badge.jpg): two round views into the bookshop (lamp bright / softer).
# Round badges like badge_mailbox / badge_shop: the Tiệm Sách spot on the alley map (bright = something waits there).
import sys
import cv2, numpy as np
G = sys.argv[1] if len(sys.argv) > 1 else '.'
im = cv2.imread(f'{G}/src/vi_1127/bookshop_badge.jpg'); g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
for name, (x0, x1) in [('badge_bookshop', (0, 640)), ('badge_bookshop_dim', (640, 1280))]:
    fg = (g[:, x0:x1] < 225).astype(np.uint8) * 255
    fg = cv2.morphologyEx(fg, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    c = max(cv2.findContours(fg, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)[0], key=cv2.contourArea)
    (cx, cy), r = cv2.minEnclosingCircle(c)
    m = np.zeros(fg.shape, np.uint8); cv2.drawContours(m, [c], -1, 255, -1); m = cv2.GaussianBlur(m, (3, 3), 0)
    out = cv2.cvtColor(im[:, x0:x1], cv2.COLOR_BGR2BGRA); out[..., 3] = m
    ys, xs = np.where(m > 20); out = out[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    cv2.imwrite(f'{G}/assets/{name}.png', out); print(name, out.shape[1], out.shape[0], round(r))
