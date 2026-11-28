# Vi's 4 hand-drawn side-button icons (src/vi_1128/icons4.jpg, 28/11): palette = Decorate, notebook = Small things for today,
# map = alley map, clay pot = little kitchen. Colour-to-alpha against the white paper (keeps the soft steam), split by empty columns.
import sys
import cv2, numpy as np
G = sys.argv[1] if len(sys.argv) > 1 else '.'
im = cv2.imread(f'{G}/src/vi_1128/icons4.jpg').astype(np.float32)
paper = np.percentile(im.reshape(-1, 3), 70, axis=0)
a = np.clip(((paper - im) / np.maximum(paper, 1)).max(axis=2) * 3.0 - .03, 0, 1)
cols = np.where((a > .12).sum(0) > 2)[0]
groups, start = [], cols[0]
for p, q in zip(cols, cols[1:]):
    if q - p > 25: groups.append((start, p)); start = q
groups.append((start, cols[-1]))
assert len(groups) == 4, groups
for name, (x0, x1) in zip(['ic_decor', 'ic_today', 'ic_map', 'ic_kitchen'], groups):
    sub = a[:, x0:x1 + 1]; rows = np.where((sub > .05).sum(1) > 0)[0]
    y0, y1 = rows[0], rows[-1]
    c = im[y0:y1 + 1, x0:x1 + 1]; aa = sub[y0:y1 + 1].copy()
    # the white pages of the notebook and the map must stay paper, not glass: fill everything inside the ink outline
    ink = (aa > .10).astype(np.uint8) * 255; ink = cv2.morphologyEx(ink, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))
    ink = cv2.copyMakeBorder(ink, 1, 1, 1, 1, cv2.BORDER_CONSTANT, value=0); ff = ink.copy()
    cv2.floodFill(ff, np.zeros((ff.shape[0] + 2, ff.shape[1] + 2), np.uint8), (0, 0), 255)
    inside = ((ink > 0) | (ff == 0))[1:-1, 1:-1].astype(np.float32)
    inside = cv2.erode(inside, np.ones((3, 3), np.uint8))
    aa = cv2.GaussianBlur(np.maximum(aa, inside), (3, 3), 0)
    col = np.clip((c - (1 - aa[..., None]) * paper) / np.maximum(aa[..., None], 1e-3), 0, 255)
    out = np.dstack([col, aa * 255]).astype(np.uint8)
    out = cv2.copyMakeBorder(out, 6, 6, 6, 6, cv2.BORDER_CONSTANT, value=(0, 0, 0, 0))
    cv2.imwrite(f'{G}/assets/{name}.png', out); print(name, out.shape[1], out.shape[0])
