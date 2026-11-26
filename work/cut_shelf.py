"""Cut src/sheet_shelf.jpg (Vi 26/11): the wooden wall shelf, without the lantern drawn on it (the game keeps its own lantern on/off)."""
import cv2, numpy as np, sys
from PIL import Image
G = sys.argv[1]
img = cv2.imread(f'{G}/src/sheet_shelf.jpg')[:540]
# hide the lantern: refill its patch of the top board with the board texture just to its right, blank above the board
rep = img.copy()
paper = np.median(img[5:30].reshape(-1, 3), axis=0)
for x in range(160, 372):
    yb = int(round(260 - (x - 150) * 0.02))          # back edge of the top board at this column
    rep[40:yb, x] = paper
    src = img[yb - 3:291, x + 190].astype(float)    # same board, further right, past the lantern
    k = min(1, (x - 160) / 14, (371 - x) / 14)       # blend into the original at both seams
    rep[yb:294, x] = (src * k + img[yb:294, x].astype(float) * (1 - k)).astype(np.uint8)
img = rep
bg = np.median(np.concatenate([img[:5].reshape(-1, 3), img[-5:].reshape(-1, 3)]), axis=0)
dist = np.linalg.norm(img.astype(float) - bg, axis=2)
near = (dist < 18).astype(np.uint8)
n, lab = cv2.connectedComponents(near, connectivity=4)
border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
areas = np.bincount(lab.ravel()); border |= {j for j in range(1, len(areas)) if areas[j] > 5000}   # the open back of the shelf shows the wall
fg = (~np.isin(lab, list(border))).astype(np.uint8)
fg = cv2.morphologyEx(fg, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
n, lab, st, _ = cv2.connectedComponentsWithStats(fg)
i = 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA])); fg = (lab == i).astype(np.uint8)
edge = cv2.dilate(fg, np.ones((5, 5), np.uint8)) - cv2.erode(fg, np.ones((5, 5), np.uint8))
alpha = np.where(edge > 0, fg * np.clip((dist - 6) / 30, 0, 1), fg)
x, y, w, h = st[i, :4]
rgba = np.dstack([cv2.cvtColor(img, cv2.COLOR_BGR2RGB), (alpha * 255).astype(np.uint8)])[y:y + h, x:x + w]
Image.fromarray(rgba).save(f'{G}/assets/shelf.png'); print('shelf', w, 'x', h, 'top', y)
