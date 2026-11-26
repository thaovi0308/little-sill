"""Cut src/sheet_people.jpg (Vi 26/11): landlady, florist, white rabbit (mid-autumn visitor), late-night radio DJ (framed picture)."""
import cv2, numpy as np, sys
from PIL import Image
G = sys.argv[1]
img = cv2.imread(f'{G}/src/sheet_people.jpg')
bg = np.median(np.concatenate([img[:5].reshape(-1, 3), img[-5:].reshape(-1, 3)]), axis=0)
dist = np.linalg.norm(img.astype(float) - bg, axis=2)
near = (dist < 18).astype(np.uint8)
n, lab = cv2.connectedComponents(near, connectivity=4)
border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
fg = (~np.isin(lab, list(border))).astype(np.uint8)
fg = cv2.morphologyEx(fg, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
edge = cv2.dilate(fg, np.ones((5, 5), np.uint8)) - cv2.erode(fg, np.ones((5, 5), np.uint8))
alpha = np.where(edge > 0, fg * np.clip((dist - 6) / 30, 0, 1), fg)
grp = cv2.dilate((alpha > 0.1).astype(np.uint8), np.ones((15, 15), np.uint8))
n, lab, st, cent = cv2.connectedComponentsWithStats(grp)
comps = sorted([i for i in range(1, n) if st[i, cv2.CC_STAT_AREA] > 20000], key=lambda i: (cent[i][1] > img.shape[0] / 2, cent[i][0]))
print([(int(cent[i][0]), int(cent[i][1])) for i in comps]); assert len(comps) == 4
rgba = np.dstack([cv2.cvtColor(img, cv2.COLOR_BGR2RGB), (alpha * 255).astype(np.uint8)])
for name, i in zip(['landlady', 'florist', 'rabbit', 'dj'], comps):
    x, y, w, h = st[i, :4]
    a = rgba[y:y + h, x:x + w].copy(); a[:, :, 3] = a[:, :, 3] * (lab[y:y + h, x:x + w] == i)
    if name == 'dj':
        # framed picture: keep the inside only, and paint out the small sparkle mark in its bottom-right corner
        a = a[6:-6, 6:-6].copy(); a[:, :, 3] = 255
        hh, ww = a.shape[:2]; m = np.zeros((hh, ww), np.uint8); m[hh - 42:hh, ww - 42:ww] = 255
        a[:, :, :3] = cv2.inpaint(np.ascontiguousarray(a[:, :, :3]), m, 7, cv2.INPAINT_TELEA)
    ys, xs = np.where(a[:, :, 3] > 20); a = a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    Image.fromarray(a).save(f'{G}/assets/{name}.png'); print(name, a.shape[1], 'x', a.shape[0])
