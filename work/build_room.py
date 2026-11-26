"""New window: src/frame.jpg (Vi's frame, white opening) + src/view_<weather>.jpg seen through it.
Writes work/out/scene_<w>.webp, sky_mask.png (=what is outside), stars_mask.png (sky only), room_mask.png."""
import cv2, numpy as np, sys, os
from PIL import Image
G = sys.argv[1]; OUT = f'{G}/work/out'
base = cv2.cvtColor(cv2.imread(f'{OUT}/base_clean.png'), cv2.COLOR_BGR2RGB).astype(float)
old_sky = np.load(f'{OUT}/old_sky.npy')
frame = np.array(Image.open(f'{G}/src/frame.jpg').convert('RGB')).astype(float)
H, W = base.shape[:2]
r, g, b = frame[..., 0], frame[..., 1], frame[..., 2]
mn = frame.min(2); sat = frame.max(2) - mn
white = np.clip((mn - 205) / 30, 0, 1) * np.clip((40 - sat) / 25, 0, 1)        # 1 = paper white
wood = (r - b > 45) & (r > 120)
inside = np.zeros((H, W), bool); inside[140:868, 75:652] = True
# the chime painted on the frame: the game draws its own (animated) chime, so remove this one
# by filling each row from its left/right neighbours (wood stays wood, white stays white)
chime = np.zeros((H, W), bool); chime[150:440, 128:232] = True
cm = chime & ~wood & (white < 0.6)
cm = cv2.dilate(cm.astype(np.uint8), np.ones((5, 5), np.uint8)).astype(bool) & chime
PAPER = np.array([246, 243, 236.0])
for y, x in zip(*np.where(cm)):
    if y < 200: continue
    frame[y, x] = frame[445, x] if 148 <= x <= 172 else PAPER   # pane stile continues below the tag
for y in range(200):
    xs = np.where(cm[y])[0]
    if not len(xs): continue
    for rr in np.split(xs, np.where(np.diff(xs) > 1)[0] + 1):
        a_, b_ = rr[0] - 1, rr[-1] + 1
        for x in rr:
            t = (x - a_) / (b_ - a_); frame[y, x] = frame[y, a_] * (1 - t) + frame[y, b_] * t
# the string on the top bar
top = np.zeros((H, W), bool); top[140:195, 165:200] = True
mn = frame.min(2); sat = frame.max(2) - mn
s_ = top & (sat < 40)
for y, x in zip(*np.where(s_)):
    for dx in range(1, 25):
        if not s_[y, x + dx]: frame[y, x] = frame[y, x + dx]; break
r, g, b = frame[..., 0], frame[..., 1], frame[..., 2]
mn = frame.min(2); sat = frame.max(2) - mn
white = np.clip((mn - 205) / 30, 0, 1) * np.clip((40 - sat) / 25, 0, 1)
wood = (r - b > 45) & (r > 120)
# opening = white areas enclosed by the frame (the outer paper white touches the border)
n, lab = cv2.connectedComponents((white > 0.3).astype(np.uint8))
edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]])))
keep = [i for i in range(1, n) if i not in edge and (lab == i).sum() > 200]
enclosed = np.isin(lab, keep) & inside
view_a = np.where(enclosed, np.maximum(white, 0.0), 0.0)
view_a = np.where(cv2.dilate(enclosed.astype(np.uint8), np.ones((3, 3), np.uint8)) > 0, np.maximum(view_a, white), 0)
# the cat (old painting) stays: inside its box, what was not old sky
cat = np.zeros((H, W), bool); cat[755:868, 328:572] = True
cat &= ~old_sky
oldsc = np.array(Image.open(f'{G}/src/scene.jpg').convert('RGB')).astype(int)
blue = (oldsc[..., 2] > oldsc[..., 0] + 12) & cat
n2, lab2 = cv2.connectedComponents(blue.astype(np.uint8))
near = cv2.dilate(old_sky.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
for i in range(1, n2):
    comp = lab2 == i
    if (comp & near).any(): cat[comp] = False
cat = cv2.morphologyEx(cat.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8)) > 0
# the painted cat is replaced by the cat sprite (assets/cat_*.png): the new frame shows through
view_a = cv2.GaussianBlur(view_a.astype(np.float32), (3, 3), 0)
# room: frame wood above the sill, old painting elsewhere (wall, sill with plate, desk, buttons, cat)
room = base.copy()
use_frame = inside & (view_a < 0.5)
# the sill of the new frame under the old painted cat (the plate on the left stays from the old painting)
sill = np.zeros((H, W), bool); sill[860:950, 336:700] = True
sill &= white < 0.3
use_frame |= sill & (np.arange(W)[None] >= 350)
fe = sill & (np.arange(W)[None] < 350)                       # feather the seam with the old sill
wgt = ((np.arange(W) - 336) / 14.0).clip(0, 1)[None].repeat(H, 0)
room[fe] = room[fe] * (1 - wgt[fe, None]) + frame[fe] * wgt[fe, None]
room[use_frame] = frame[use_frame]

def load_view(w):
    p = f'{G}/src/view_{w}.jpg'
    return Image.open(p).convert('RGB') if os.path.exists(p) else None
x0, x1, bottom = 100, 656, 906
def place_view(img):
    v = img.resize((x1 - x0, round((x1 - x0) * img.height / img.width)), Image.LANCZOS)
    canvas = np.zeros((H, W, 3)); y0 = bottom - v.height
    canvas[max(0, y0):bottom, x0:x1] = np.array(v)[max(0, -y0):]
    return canvas
sunset = np.array(load_view('sunset')).astype(float)
def derive(kind):
    """Rain / night from the sunset view while Vi's own versions are missing."""
    Lm = (0.299 * sunset[..., 0] + 0.587 * sunset[..., 1] + 0.114 * sunset[..., 2]) / 255
    if kind == 'rain':
        tint = np.array([118, 134, 164.0]); out = tint * (0.45 + 0.75 * Lm[..., None])
        out = out * 0.85 + sunset.mean(2, keepdims=True) * 0.15 * np.array([0.8, 0.9, 1.05])
    else:
        tint = np.array([44, 58, 104.0]); out = tint * (0.35 + 0.9 * Lm[..., None] ** 1.3)
    return Image.fromarray(out.clip(0, 255).astype(np.uint8))
views = {}
for w in ['sunset', 'rain', 'night']:
    img = load_view(w) or derive(w)
    views[w] = place_view(img)
    print(w, 'own drawing' if load_view(w) else 'derived from sunset')
# sky only (for stars): in each column of the night view, the sky ends at the first strong edge
nv = place_view(load_view('night') or load_view('sunset')).astype(np.uint8)
edges = cv2.Canny(cv2.GaussianBlur(cv2.cvtColor(nv, cv2.COLOR_RGB2GRAY), (5, 5), 0), 30, 80)
skyonly = np.zeros((H, W), np.uint8)
for x in range(x0, x1):
    col = np.where(edges[200:, x] > 0)[0]
    end = 200 + (col[0] if len(col) else 0)
    skyonly[160:max(160, end - 8), x] = 1
skyonly = cv2.erode(skyonly, np.ones((1, 9), np.uint8)) * (view_a > 0.5)
# lit window of the neighbour at night (tall house, upper floor)
def lit(img):
    out = img.copy(); yy, xx = np.mgrid[0:H, 0:W]
    for cx, cy, rx, ry in [(476, 506, 15, 11)]:
        d = ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2
        glow = np.exp(-d * 0.35)[..., None] * 0.9
        out = out * (1 - glow) + np.array([255, 214, 140.0]) * glow
    return out
for w, v in views.items():
    if w == 'night' and not os.path.exists(f'{G}/src/view_night.jpg'): v = lit(v)
    a = view_a[..., None]
    out = room * (1 - a) + v * a
    Image.fromarray(out.clip(0, 255).astype(np.uint8)).save(f'{OUT}/scene_{w}.webp', quality=88, method=6)
def mask_png(m, path):
    m8 = (np.clip(m, 0, 1) * 255).astype(np.uint8)
    Image.fromarray(np.dstack([np.zeros_like(m8)] * 3 + [m8])).save(path, optimize=True)
mask_png(view_a, f'{OUT}/sky_mask.png'); mask_png(1 - view_a, f'{OUT}/room_mask.png')
mask_png(cv2.GaussianBlur(skyonly.astype(np.float32), (9, 9), 0), f'{OUT}/stars_mask.png')
print('sky-only px', int(skyonly.sum()))
