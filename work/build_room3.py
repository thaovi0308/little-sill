"""Room drawn by Vi (src/room.jpg, 896x1200, green screen in the window) -> the 714x1280 scene.
Upper band (window + sill) is scaled 1.168 so the frame lands where the old one was (sill props keep
their places); the desk + buttons band is scaled to the full width. Also cuts the weather pill and the
plate from the old painting (they are not in the new room).
Writes work/out/scene_<w>.webp, sky_mask.png, room_mask.png, stars_mask.png, assets/pill.png, plate.png."""
import cv2, numpy as np, sys, os
from PIL import Image
G = sys.argv[1]; OUT = f'{G}/work/out'; W, H = 714, 1280
src = np.array(Image.open(f'{G}/src/room.jpg').convert('RGB')).astype(np.float32)
SH_, SW_ = src.shape[:2]
# ---- key out the green (opening + pane glass)
r, g, b = src[..., 0], src[..., 1], src[..., 2]
key = np.clip((g - np.maximum(r, b) - 40) / 60, 0, 1)            # 1 = green screen
# despill: pull green fringe back to the wood
spill = np.clip(g - np.maximum(r, b), 0, None)
near = cv2.dilate((key > 0.05).astype(np.uint8), np.ones((7, 7), np.uint8)) > 0
src_d = src.copy(); src_d[..., 1] = np.where(near, np.minimum(g, (r + b) / 2 + 8), g)
# ---- piecewise mapping: dest y -> source (x scale, y)
SU = 1.168; OY = 182 * SU - 140                                     # frame top 182 -> 140
LOW0 = 930; SL = W / SW_                                            # lower band from source row 930
low_top = H - (SH_ - LOW0) * SL                                     # dest row where the lower band starts
dst = np.zeros((H, W, 3), np.float32); va = np.zeros((H, W), np.float32)
def remap(img, mx, my):
    return cv2.remap(img, mx.astype(np.float32), my.astype(np.float32), cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
sill_bot_d = 866 * SU - OY                                          # ~939
# upper: y <= sill bottom at SU; between sill bottom and low_top stretch the plain wall rows 866..LOW0
sy = np.where(yy <= sill_bot_d, (yy + OY) / SU, 866 + (yy - sill_bot_d) / (low_top - sill_bot_d) * (LOW0 - 866))
sx = (xx + 165.0) / SU
upper = remap(src_d, sx, sy); upper_k = remap(key, sx, sy)
ly = LOW0 + (yy - low_top) / SL; lx = xx / SL
lower = remap(src_d, lx, ly); lower_k = remap(key, lx, ly)
m = (yy >= low_top)[..., None]
dst = np.where(m, lower, upper); va = np.where(m[..., 0], lower_k, upper_k)
# small blend over 6 rows at the seam
s0 = int(low_top)
for i in range(-3, 4):
    y = s0 + i; t = (i + 3) / 6
    dst[y] = upper[y] * (1 - t) + lower[y] * t
# the Gemini star in the lower right corner of Vi's drawing: copy the cabinet from the left
dst[1195:1280, 640:714] = dst[1195:1280, 0:74][:, ::-1]
room = dst
print('lower band starts at', round(low_top), 'sill bottom', round(sill_bot_d))

# ---- views (same placement as before)
def load_view(w):
    p = f'{G}/src/view_{w}.jpg'
    return Image.open(p).convert('RGB') if os.path.exists(p) else None
x0, x1, bottom = 100, 656, 906
def place_view(img):
    v = img.resize((x1 - x0, round((x1 - x0) * img.height / img.width)), Image.LANCZOS)
    canvas = np.zeros((H, W, 3)); y0 = bottom - v.height
    canvas[max(0, y0):bottom, x0:x1] = np.array(v)[max(0, -y0):]
    return canvas
view_a = cv2.GaussianBlur(va, (3, 3), 0)
for w in ['sunset', 'rain', 'night']:
    v = place_view(load_view(w)); a = view_a[..., None]
    out = room * (1 - a) + v * a
    Image.fromarray(out.clip(0, 255).astype(np.uint8)).save(f'{OUT}/scene_{w}.webp', quality=88, method=6)
def mask_png(mm, path):
    m8 = (np.clip(mm, 0, 1) * 255).astype(np.uint8)
    Image.fromarray(np.dstack([np.zeros_like(m8)] * 3 + [m8])).save(path, optimize=True)
mask_png(view_a, f'{OUT}/sky_mask.png'); mask_png(1 - view_a, f'{OUT}/room_mask.png')
nv = place_view(load_view('night')).astype(np.uint8)
edges = cv2.Canny(cv2.GaussianBlur(cv2.cvtColor(nv, cv2.COLOR_RGB2GRAY), (5, 5), 0), 30, 80)
skyonly = np.zeros((H, W), np.uint8)
for x in range(x0, x1):
    col = np.where(edges[200:, x] > 0)[0]
    skyonly[160:max(160, 200 + (col[0] if len(col) else 0) - 8), x] = 1
skyonly = cv2.erode(skyonly, np.ones((1, 9), np.uint8)) * (view_a > 0.5)
mask_png(cv2.GaussianBlur(skyonly.astype(np.float32), (9, 9), 0), f'{OUT}/stars_mask.png')

# ---- weather pill and plate cut from the old painting
old = np.array(Image.open(f'{G}/src/scene.jpg').convert('RGB'))
def cut(box, alpha, name):
    x0_, y0_, x1_, y1_ = box
    rgba = np.dstack([old[y0_:y1_, x0_:x1_], (alpha * 255).astype(np.uint8)])
    Image.fromarray(rgba).save(f'{G}/assets/{name}.png')
reg = old[20:130, 185:530].astype(float).mean(2)
pm = (reg > np.percentile(reg, 55)).astype(np.uint8)
n, lab, st, _ = cv2.connectedComponentsWithStats(pm)
k = 1 + np.argmax(st[1:, cv2.CC_STAT_AREA]); x, y, w_, h_ = st[k, :4]
pill = np.zeros((h_ + 8, w_ + 8), np.float32)
cv2.rectangle(pill, (4 + h_ // 2, 4), (4 + w_ - h_ // 2, 4 + h_), 1, -1)
cv2.circle(pill, (4 + h_ // 2, 4 + h_ // 2), h_ // 2, 1, -1); cv2.circle(pill, (4 + w_ - h_ // 2, 4 + h_ // 2), h_ // 2, 1, -1)
pill = cv2.GaussianBlur(pill, (5, 5), 0)
px, py = 185 + x - 4, 20 + y - 4
cut((px, py, px + w_ + 8, py + h_ + 8), pill, 'pill'); print('pill box', px, py, w_ + 8, h_ + 8)
pl = np.zeros((44, 104), np.float32); cv2.ellipse(pl, (52, 21), (49, 18), 0, 0, 360, 1, -1)
pl = cv2.GaussianBlur(pl, (5, 5), 0)
# the plate now comes from Vi's sheet (work/cut_ui.py)
