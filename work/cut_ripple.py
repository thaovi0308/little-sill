# Vi's water ripple, 3 sizes (src/vi_1128/fx_ripple.jpg): colour-to-alpha against the white paper so the thin rings and the wash stay see-through.
import sys
import cv2, numpy as np
G = sys.argv[1] if len(sys.argv) > 1 else '.'
im = cv2.imread(f'{G}/src/vi_1128/fx_ripple.jpg').astype(np.float32)
for name, (x0, y0, x1, y1) in [('fx_ripple1', (55, 260, 310, 435)), ('fx_ripple2', (350, 225, 715, 475)), ('fx_ripple3', (750, 185, 1225, 500))]:
    c = im[y0:y1, x0:x1]
    paper = np.percentile(c.reshape(-1, 3), 92, axis=0)                    # local white of the paper
    a = np.clip(((paper - c) / np.maximum(paper, 1)).max(axis=2) * 2.2, 0, 1)   # how much ink is on the paper
    h, w = a.shape; inner = np.zeros((h, w), np.uint8); cv2.ellipse(inner, (w // 2, h // 2), (int(w * .30), int(h * .30)), 0, 0, 360, 1, -1)
    a = np.where(inner > 0, np.maximum(a, .55), a)                           # the water in the middle stays a soft pane, highlights included
    a = cv2.GaussianBlur(a, (3, 3), 0)
    col = np.clip((c - (1 - a[..., None]) * paper) / np.maximum(a[..., None], 1e-3), 0, 255)
    out = np.dstack([col, a * 255]).astype(np.uint8)
    ys, xs = np.where(out[..., 3] > 12); out = out[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    cv2.imwrite(f'{G}/assets/{name}.png', out); print(name, out.shape[1], out.shape[0])
