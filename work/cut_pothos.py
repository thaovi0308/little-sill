"""Cut src/sheet_pothos.jpg: pothos 3 stages, wet cat, towel, paper lantern off/on, tea from above, steam puffs."""
import cv2, numpy as np, sys
from PIL import Image
G = sys.argv[1]
img = cv2.imread(f'{G}/src/sheet_pothos.jpg')
h, w = img.shape[:2]
bg = np.median(np.concatenate([img[:5].reshape(-1,3), img[-5:].reshape(-1,3)]), axis=0)
dist = np.linalg.norm(img.astype(float) - bg, axis=2)
near = (dist < 18).astype(np.uint8)
# background = near-bg pixels connected to the border
n, lab = cv2.connectedComponents(near, connectivity=4)
border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
bgmask = np.isin(lab, list(border))
fg = (~bgmask).astype(np.uint8)
fg = cv2.morphologyEx(fg, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
# soft edge: alpha from distance to bg near the border of the mask
alpha = fg.astype(float)
edge = cv2.dilate(fg, np.ones((5, 5), np.uint8)) - cv2.erode(fg, np.ones((5, 5), np.uint8))
soft = np.clip((dist - 6) / 30, 0, 1)
alpha = np.where(edge > 0, np.maximum(alpha * soft, 0), alpha)
alpha = (alpha * 255).astype(np.uint8)
rgba = np.dstack([cv2.cvtColor(img, cv2.COLOR_BGR2RGB), alpha])
# items are not on an even grid: group by dilated connected components, then order row by row
grp = cv2.dilate((alpha > 20).astype(np.uint8), np.ones((9, 9), np.uint8))
n, lab, stats, cent = cv2.connectedComponentsWithStats(grp)
comps = [i for i in range(1, n) if stats[i, cv2.CC_STAT_AREA] > 1500]
comps.sort(key=lambda i: (int(cent[i][1] > 360) + int(cent[i][1] > 790), cent[i][0], cent[i][1]))
names = ['pothos0', 'pothos1', 'pothos2', 'cat_wet', 'towel', 'lantern_on', 'lantern_off', 'tea_top', 'steam_a', 'steam_b', 'steam_c']
print([(int(cent[i][0]), int(cent[i][1])) for i in comps]); assert len(comps) == 11, len(comps)
for name, i in zip(names, comps):
    x, y, w, h = stats[i, :4]
    a = alpha[y:y + h, x:x + w] * (lab[y:y + h, x:x + w] == i)
    ys, xs = np.where(a > 20)
    crop = rgba[y + ys.min():y + ys.max() + 1, x + xs.min():x + xs.max() + 1].copy()
    crop[:, :, 3] = a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    Image.fromarray(crop).save(f'{G}/assets/{name}.png')
    print(name, crop.shape[1], 'x', crop.shape[0])
# the lit lantern's glow: fade the pale halo into transparency instead of a hard rim
im = np.array(Image.open(f'{G}/assets/lantern_on.png')).astype(float)
d = np.linalg.norm(im[:, :, :3] - 255, axis=2)
im[:, :, 3] = np.minimum(im[:, :, 3], np.clip((d - 10) / 70, 0, 1) * 255)
Image.fromarray(im.astype(np.uint8)).save(f'{G}/assets/lantern_on.png'); print('lantern_on glow softened')
