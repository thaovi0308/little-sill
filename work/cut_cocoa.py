# Vi's cocoa sheet 27/11 (src/vi_1127/cocoa2.jpg): plaid mug seen from the side (with steam) + the same mug from above (breathing card).
import sys
import cv2, numpy as np
G = sys.argv[1] if len(sys.argv) > 1 else '.'
A = f'{G}/assets'
im = cv2.imread(f'{G}/src/vi_1127/cocoa2.jpg')
g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY).astype(np.float32)
paper = np.median(im[5:40, 5:200].reshape(-1, 3), 0)          # cream paper colour


def save(name, box, inner=15, steam=False, handle=False):
    x0, y0, x1, y1 = box
    crop = im[y0:y1, x0:x1].astype(np.float32)
    d = np.linalg.norm(crop - paper, axis=2)                   # distance from the paper
    fg = (d > 14).astype(np.uint8) * 255
    m = cv2.morphologyEx(fg, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    cnts, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    big = max(cv2.contourArea(c) for c in cnts)
    keep = np.zeros_like(m); cv2.drawContours(keep, [c for c in cnts if cv2.contourArea(c) > big * 0.2], -1, 255, -1)
    core = cv2.GaussianBlur(cv2.erode(keep, np.ones((inner, inner), np.uint8)), (9, 9), 0).astype(np.float32) / 255
    a = np.maximum(np.clip((d - 6) / 26, 0, 1), core) * (cv2.GaussianBlur(keep, (5, 5), 0) / 255)
    holes = ((d < 12) & handle).astype(np.uint8)                          # paper showing through the handle: big paper patches inside the outline go clear
    n, lab, st, _ = cv2.connectedComponentsWithStats(holes)
    for k in range(1, n):
        if st[k, cv2.CC_STAT_AREA] > 5000 and st[k, cv2.CC_STAT_LEFT] > 0.68 * (x1 - x0) and st[k, cv2.CC_STAT_WIDTH] < 0.3 * (x1 - x0): a[cv2.GaussianBlur((lab == k).astype(np.float32), (7, 7), 0) > 0.5] = 0
    if steam:                                                    # white wisps above the rim: alpha from how much lighter than the paper
        gb = cv2.GaussianBlur(g[y0:y1, x0:x1], (9, 9), 0)
        light = np.clip((gb - paper.mean() - 5) / 12, 0, 1) * 0.85
        top = np.zeros_like(light); top[:int(0.42 * (y1 - y0))] = 1
        a = np.maximum(a, cv2.GaussianBlur(light * top, (5, 5), 0))
    out = cv2.cvtColor(im[y0:y1, x0:x1], cv2.COLOR_BGR2BGRA); out[..., 3] = (a * 255).astype(np.uint8)
    ys, xs = np.where(out[..., 3] > 20); out = out[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    cv2.imwrite(f'{A}/{name}.png', out); print(name, out.shape[1], out.shape[0])


save('cocoa', (140, 15, 615, 650), steam=True, handle=True)
save('cocoa_top', (670, 110, 1240, 590))
