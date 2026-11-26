"""Cut the 6 props of src/plants.jpg (white background) into transparent PNGs in assets/."""
import cv2, numpy as np, sys
from PIL import Image
G = sys.argv[1]
img = cv2.imread(f'{G}/src/plants.jpg')
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
names = [['daisy0', 'daisy1', 'daisy2'], ['lavender0', 'lavender1', 'lavender2'], ['cactus0', 'cactus1', 'cactus2']]
rgba = np.dstack([cv2.cvtColor(img, cv2.COLOR_BGR2RGB), alpha])
for r in range(3):
    for c in range(3):
        y0, y1 = r * h // 3, (r + 1) * h // 3
        x0, x1 = c * w // 3, (c + 1) * w // 3
        a = alpha[y0:y1, x0:x1]
        ys, xs = np.where(a > 20)
        cy0, cy1, cx0, cx1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
        crop = rgba[y0 + cy0:y0 + cy1, x0 + cx0:x0 + cx1]
        Image.fromarray(crop).save(f'{G}/assets/{names[r][c]}.png')
        print(names[r][c], crop.shape[1], 'x', crop.shape[0])
