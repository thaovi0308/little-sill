"""Build the layers of the scene: base without the interactive props, 3 weather versions of the
window, the sky mask and the props placement (scene px). Writes work/out/*."""
import cv2, json, numpy as np, sys
from PIL import Image
from scipy.ndimage import median_filter
G = sys.argv[1]; OUT = f'{G}/work/out'
import os; os.makedirs(OUT, exist_ok=True)
scene = cv2.imread(f'{G}/src/scene.jpg'); H, W = scene.shape[:2]
# placement of the cut props: (name, anchor, ax, ay, size by 'h' or 'w')
PLACE = {
    'plant':   dict(cx=180, bottom=897, h=222),
    'chime':   dict(cx=180, top=140, h=292),
    'lamp':    dict(cx=117, bottom=1140, h=272),
    'radio':   dict(cx=306, bottom=1140, w=190),
    'jar':     dict(cx=609, bottom=900, h=97),
    'incense': dict(cx=600, bottom=1143, w=110),
}
boxes = {}
def placed_alpha(name):
    p = PLACE[name]; a = Image.open(f'{G}/assets/{name}.png'); aw, ah = a.size
    if 'h' in p: h = p['h']; w = h * aw / ah
    else: w = p['w']; h = w * ah / aw
    x = p['cx'] - w / 2; y = p['bottom'] - h if 'bottom' in p else p['top']
    boxes[name] = [round(x, 1), round(y, 1), round(w, 1), round(h, 1)]
    al = np.array(a.resize((max(1, round(w)), max(1, round(h))), Image.LANCZOS))[:, :, 3]
    m = np.zeros((H, W), np.uint8); xi, yi = round(x), round(y)
    sub = m[yi:yi + al.shape[0], xi:xi + al.shape[1]]
    sub[:] = (al[:sub.shape[0], :sub.shape[1]] > 30) * 255
    return cv2.dilate(m, np.ones((15, 15), np.uint8))
def rect(m, x0, y0, x1, y1): m[y0:y1, x0:x1] = 255; return m
def fill(img, m, axis):
    """Linear interpolation across the masked runs, row by row (axis=1) or column by column (axis=0)."""
    out = img.astype(float).copy()
    if axis == 0: out = out.transpose(1, 0, 2); m = m.T
    for i in range(m.shape[0]):
        row = m[i] > 0
        if not row.any(): continue
        idx = np.arange(row.size); good = ~row
        for c in range(3):
            out[i, row, c] = np.interp(idx[row], idx[good], out[i, good, c])
    if axis == 0: out = out.transpose(1, 0, 2)
    return out
base = scene.copy().astype(float)
masks = {}
for n in ['plant', 'jar', 'lamp', 'radio', 'incense', 'chime']: masks[n] = placed_alpha(n)
masks['lamp'] = rect(masks['lamp'], 28, 862, 206, 1146)
masks['plant'] = rect(masks['plant'], 190, 676, 214, 697)   # a petal left above the dilated alpha
masks['radio'] = rect(rect(masks['radio'], 240, 955, 372, 1022), 208, 990, 405, 1146)
masks['incense'] = rect(masks['incense'], 548, 912, 655, 1146)
masks['chime'][:200] = 0; masks['chime'] = rect(masks['chime'], 125, 200, 232, 436)
wm = np.zeros((H, W), np.uint8); cv2.circle(wm, (661, 1226), 26, 255, -1); masks['wm'] = wm
del masks['jar']   # the cut jar covers the painted one
mask = np.zeros((H, W), np.uint8)
chime_m = masks.pop('chime')
def fill_behind_plant(img, m):
    """Rebuild what the painted daisy pot hides: glass + sash board (vertical), roof, the
    house wall and its window (mirrored from the visible right half), then the sill."""
    out = img.copy(); sel = m > 0
    ys, xs = np.where(sel)
    for x in range(xs.min(), xs.max() + 1):
        col = sel[:, x]
        if not col.any(): continue
        top = np.argmax(col) - 1
        for y in np.where(col)[0]:
            if y >= 866: continue
            if x < 182 and y < 822: out[y, x] = img[top, x]
            elif x >= 182 and y < 694: out[y, x] = img[top, x]
    wall_px = img[700:860, 309:318][~sel[700:860, 309:318]]
    wall = np.median(wall_px.reshape(-1, 3), axis=0)
    rng = np.random.default_rng(5)
    for y in range(694, 866):
        for x in range(182, xs.max() + 1):
            if not sel[y, x]: continue
            src = 526 - x
            if 217 <= x and 0 <= src < W and not sel[y, src]: out[y, x] = img[y, src]
            else: out[y, x] = wall + rng.normal(0, 3, 3)
    # left of x 182 below the sash and everything under y 866: horizontal fill
    rest = np.zeros_like(m); rest[866:] = m[866:]
    rest[822:866, :182] = m[822:866, :182]
    f = fill(out, rest, 1); out[rest > 0] = f[rest > 0]
    sm = cv2.GaussianBlur(out, (0, 0), 0.8); out[sel] = sm[sel]
    return out
for n, m in masks.items():
    axis = 1
    if n == 'plant':
        base = fill_behind_plant(base, m); mask |= m; continue
    filled = fill(base, m, axis)
    sm = cv2.GaussianBlur(filled, (0, 0), 1.2)
    sel = m > 0
    base[sel] = sm[sel]
    mask |= m
base = cv2.inpaint(base.clip(0, 255).astype(np.uint8), chime_m, 5, cv2.INPAINT_TELEA).astype(float)
mask |= chime_m
# keep a little paper grain in the filled areas
rng = np.random.default_rng(3); grain = rng.normal(0, 2.2, (H, W, 1))
base[mask > 0] += grain[mask > 0]
base = base.clip(0, 255).astype(np.uint8)
cv2.imwrite(f'{OUT}/inpaint_mask.png', mask)
# sky / street seen through the window: blue pixels inside the opening
b, g, r = [base[:, :, i].astype(int) for i in range(3)]
win = np.zeros((H, W), bool); win[185:902, 104:652] = True
ob, og, orr = [scene[:, :, i].astype(int) for i in range(3)]
sky = win & ((b > r + 12) | ((chime_m > 0) & (ob > orr + 12)))
sky[760:845, 400:485] = False                     # bandana of the cat
sky = cv2.morphologyEx(sky.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8)).astype(bool)
L = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0
Lc = median_filter(L, size=(1, 7))               # removes the painted rain streaks
lo, hi = np.percentile(Lc[sky], [2, 98]); n = np.clip((Lc - lo) / (hi - lo), 0, 1)
yy = np.repeat(((np.arange(H) - 185) / (902 - 185)).clip(0, 1)[:, None], W, 1)
def grad(top, bottom):
    t = np.array(top, float); bt = np.array(bottom, float)
    return t[None, None] * (1 - yy[..., None]) + bt[None, None] * yy[..., None]
def variant(top, bottom, shade, gamma):
    col = grad(top, bottom) * (shade + (1 - shade) * n[..., None] ** gamma)
    out = base.copy().astype(float)
    sel = sky[..., None]
    out = np.where(sel, col[..., ::-1], out)      # BGR
    # soft transition at the mask border
    m = cv2.GaussianBlur(sky.astype(np.float32), (5, 5), 0)[..., None]
    out = base * (1 - m) + out * m
    return out.clip(0, 255).astype(np.uint8)
cleaned_rain = base.copy(); cleaned_rain[sky] = (base[sky] * 0.55 + np.dstack([Lc * 255] * 3)[sky] * 0 +
    cv2.cvtColor((np.dstack([median_filter(base[:, :, i], size=(1, 7)) for i in range(3)])), cv2.COLOR_BGR2RGB)[..., ::-1][sky] * 0.45)
variants = {
    'rain': cleaned_rain,
    'sunset': variant((255, 214, 150), (244, 140, 104), 0.38, 0.8),
    'night': variant((30, 42, 78), (52, 66, 110), 0.30, 1.4),
}
for k, v in variants.items():
    Image.fromarray(cv2.cvtColor(v, cv2.COLOR_BGR2RGB)).save(f'{OUT}/scene_{k}.webp', quality=88, method=6)
skyimg = (cv2.GaussianBlur(sky.astype(np.float32), (3, 3), 0) * 255).astype(np.uint8)
Image.fromarray(np.dstack([np.zeros_like(skyimg)] * 3 + [skyimg])).save(f'{OUT}/sky_mask.png', optimize=True)
json.dump(dict(W=W, H=H, boxes=boxes), open(f'{OUT}/layout.json', 'w'), indent=1)
print(json.dumps(boxes))
# for build_room.py: the prop-free room and the old outside mask
cv2.imwrite(f'{OUT}/base_clean.png', base)
np.save(f'{OUT}/old_sky.npy', sky)
