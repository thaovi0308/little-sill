"""Cut src/vi_1126/tet_items.jpg (Vi 26/11, Tết): kumquat pot, chrysanthemum pot, red lantern off/on, couplet pair, cat lì xì envelope."""
import cv2, numpy as np, sys
from PIL import Image
G = sys.argv[1]
img = cv2.imread(f'{G}/src/vi_1126/tet_items.jpg')
bg = np.median(np.concatenate([img[:5].reshape(-1, 3), img[-5:].reshape(-1, 3)]), axis=0)
img[545:628] = bg; img[1038:1200] = bg          # wipe the printed labels
dist = np.linalg.norm(img.astype(float) - bg, axis=2)
near = (dist < 18).astype(np.uint8)
n, lab = cv2.connectedComponents(near, connectivity=4)
border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
fg = (~np.isin(lab, list(border))).astype(np.uint8)
fg = cv2.morphologyEx(fg, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
edge = cv2.dilate(fg, np.ones((5, 5), np.uint8)) - cv2.erode(fg, np.ones((5, 5), np.uint8))
alpha = np.where(edge > 0, fg * np.clip((dist - 6) / 30, 0, 1), fg)
rgba = np.dstack([cv2.cvtColor(img, cv2.COLOR_BGR2RGB), (alpha * 255).astype(np.uint8)])
BOX = {'tet_kumquat': (30, 40, 340, 540), 'tet_mum': (340, 200, 640, 540), 'tet_lantern_off': (630, 40, 880, 520),
       'tet_lantern_on': (40, 610, 330, 1035), 'tet_couplet': (330, 680, 640, 1030), 'tet_lixi': (660, 680, 870, 1030)}
for name, (x0, y0, x1, y1) in BOX.items():
    a = rgba[y0:y1, x0:x1].copy()
    if name == 'tet_lantern_on':   # keep the soft glow: alpha from distance, not the hard cut
        d = dist[y0:y1, x0:x1]; a[:, :, 3] = np.clip(d * 4, 0, 255).astype(np.uint8)
    ys, xs = np.where(a[:, :, 3] > 20); a = a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    Image.fromarray(a).save(f'{G}/assets/{name}.png'); print(name, a.shape[1], 'x', a.shape[0])
