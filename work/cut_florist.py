"""Cut src/sheet_florist.jpg (Vi 26/11): pulley bag, watering can, dried bouquet, flower chime, 3 stamps, mooncake, flower basket, keys."""
import cv2, numpy as np, sys
from PIL import Image
G = sys.argv[1]
img = cv2.imread(f'{G}/src/sheet_florist.jpg')
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
comps = [i for i in range(1, n) if st[i, cv2.CC_STAT_AREA] > 3000]
comps.sort(key=lambda i: (int(cent[i][1] > 450) + int(cent[i][1] > 800), cent[i][0]))
print([(int(cent[i][0]), int(cent[i][1]), int(st[i, 4])) for i in comps])
rgba = np.dstack([cv2.cvtColor(img, cv2.COLOR_BGR2RGB), (alpha * 255).astype(np.uint8)])
NAMES = ['bag', 'can', 'bouquet', 'chime_flower', 'stamp_moon', 'stamp_paw', 'stamp_leaf', 'mooncake', 'basket', 'keys']
# the watering can and the dried bouquet touch: split that blob by hand (bouquet = right of x 432 or above y 240)
yy, xx = np.mgrid[0:img.shape[0], 0:img.shape[1]]
k = comps[1]; lab[(lab == k) & ((xx >= 432) | (yy < 240) | ((yy < 265) & (xx > 385)))] = n; comps.insert(2, n)
st = np.vstack([st, st[k]]); st[n] = st[k]
assert len(comps) == len(NAMES), len(comps)
for name, i in zip(NAMES, comps):
    x, y, w, h = st[i, :4]
    a = rgba[y:y + h, x:x + w].copy(); a[:, :, 3] = a[:, :, 3] * (lab[y:y + h, x:x + w] == i)
    if name in ('keys', 'can'):   # the key ring's inside shows the paper: clear enclosed paper-coloured holes
        hole = (near[y:y + h, x:x + w] > 0).astype(np.uint8); m, hl, hs, _ = cv2.connectedComponentsWithStats(hole, connectivity=4)
        for j in range(1, m):
            if hs[j, 4] > 400: a[:, :, 3][hl == j] = 0
    ys, xs = np.where(a[:, :, 3] > 20); a = a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    Image.fromarray(a).save(f'{G}/assets/{name}.png'); print(name, a.shape[1], 'x', a.shape[0])
