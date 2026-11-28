# Vi 28/11 (src/vi_1128/buds3.jpg): the missing middle (bud) stage of butterfly pea (trellis, closed blue buds),
# mimosa (pink puff buds) and jasmine (white buds, enamel mug) -> assets/bpea1, mimosa1, jasmine1.
# Outline filled, then the paper showing through gaps (trellis rungs, mug handle, between leaves) is punched out again.
import sys
import cv2, numpy as np
G = sys.argv[1] if len(sys.argv) > 1 else '.'
im = cv2.imread(f'{G}/src/vi_1128/buds3.jpg')
g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY); hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
FG = ((g < 238) | (hsv[..., 1] > 18)).astype(np.uint8) * 255
PAPER = ((g > 246) & (hsv[..., 1] < 10)).astype(np.uint8)
def save(name, box, hole=150, keep_box=None):
    x0, y0, x1, y1 = box
    m = cv2.morphologyEx(FG[y0:y1, x0:x1], cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    cnts, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    big = max(cv2.contourArea(c) for c in cnts)
    keep = np.zeros_like(m); cv2.drawContours(keep, [c for c in cnts if cv2.contourArea(c) > max(120, big * 0.02)], -1, 255, -1)
    n, lab, st, _ = cv2.connectedComponentsWithStats(PAPER[y0:y1, x0:x1] * (keep > 0).astype(np.uint8))
    for j in range(1, n):
        if st[j, 4] <= hole: continue
        if keep_box:   # the white enamel mug is paper-white too: gaps inside its body stay
            kx0, ky0, kx1, ky1 = keep_box; x, y, w, h = st[j, :4]
            if x >= kx0 - x0 and y >= ky0 - y0 and x + w <= kx1 - x0 and y + h <= ky1 - y0: continue
        keep[lab == j] = 0
    a = cv2.GaussianBlur(keep, (3, 3), 0)
    out = cv2.cvtColor(im[y0:y1, x0:x1], cv2.COLOR_BGR2BGRA); out[..., 3] = a
    ys, xs = np.where(a > 20); out = out[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    cv2.imwrite(f'{G}/assets/{name}.png', out); print(name, out.shape[1], out.shape[0])
save('bpea1', (35, 50, 435, 672))
save('mimosa1', (465, 170, 845, 645))
save('jasmine1', (885, 115, 1230, 655), hole=300, keep_box=(940, 410, 1160, 650))

# jasmine2 (bloom, src/vi_1127/plants4.jpg): Vi drew a soft glow of scent dots around the flowers. The old cut kept it as a
# hard cream patch; here the plant and mug stay opaque and the glow fades with its own lightness.
im2 = cv2.imread(f'{G}/src/vi_1127/plants4.jpg')[212:670, 947:1244]
g2 = cv2.cvtColor(im2, cv2.COLOR_BGR2GRAY).astype(np.float32); hsv2 = cv2.cvtColor(im2, cv2.COLOR_BGR2HSV)
solid = ((g2 < 200) | (hsv2[..., 1] > 45)).astype(np.uint8) * 255
solid = cv2.morphologyEx(solid, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
cnts, _ = cv2.findContours(solid, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
big = max(cv2.contourArea(c) for c in cnts)
body = np.zeros_like(solid); cv2.drawContours(body, [c for c in cnts if cv2.contourArea(c) > big * 0.002], -1, 255, -1)
mug = np.zeros_like(body); mug[285:, :] = 255   # the mug (from its rim down) is white enamel: keep it whole, handle hole aside
cm, _ = cv2.findContours(((g2 < 238) | (hsv2[..., 1] > 18)).astype(np.uint8)[285:] * 255, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
mm = np.zeros_like(body[285:]); cv2.drawContours(mm, [max(cm, key=cv2.contourArea)], -1, 255, -1); mug[285:] = mm
hole = ((g2 > 246) & (hsv2[..., 1] < 10)).astype(np.uint8)[285:] * (mm > 0)
n, lab, st, _ = cv2.connectedComponentsWithStats(hole)
for j in range(1, n):
    if st[j, 4] > 150 and st[j, 0] > 200: mug[285:][lab == j] = 0   # inside the handle
glow = np.clip((252 - cv2.GaussianBlur(g2, (5, 5), 0)) * 12, 0, 190)
glow = cv2.GaussianBlur(cv2.morphologyEx(glow, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (17, 17))), (7, 7), 0)   # the dots' white centres are lit too   # the cream glow: a few percent darker than the paper
a = np.maximum(np.maximum(body, mug).astype(np.float32), glow)
a = cv2.GaussianBlur(a, (3, 3), 0).astype(np.uint8)
out = cv2.cvtColor(im2, cv2.COLOR_BGR2BGRA); out[..., 3] = a
solid_all = cv2.dilate(np.maximum(body, mug), np.ones((3, 3), np.uint8)) > 0
out[~solid_all, :3] = (200, 240, 255)   # the glow itself: one warm cream (BGR), its strength in alpha only
ys, xs = np.where(a > 20); out = out[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
cv2.imwrite(f'{G}/assets/jasmine2.png', out); print('jasmine2', out.shape[1], out.shape[0])
