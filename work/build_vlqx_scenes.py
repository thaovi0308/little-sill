# Vu Lan + Thất Tịch window views -> work/out/scene_vulan_night.webp, scene_qx_<w>.webp (same exact swap as build_xmas_scenes.py)
# Vu Lan: the usual night alley with a full moon painted in BEHIND the wires (only on sky pixels).
# Thất Tịch: Vi's purple drizzle alley (src/view_thattich.jpg, work/cut_thattich_view.py) for all three weathers, a little darker at night.
import sys
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
G = sys.argv[1] if len(sys.argv) > 1 else '.'
OUT = f'{G}/work/out'; W, H = 714, 1280
x0, x1, bottom = 100, 656, 906
def place_view(img):
    v = img.resize((x1 - x0, round((x1 - x0) * img.height / img.width)), Image.LANCZOS)
    canvas = np.zeros((H, W, 3)); y0 = bottom - v.height
    canvas[max(0, y0):bottom, x0:x1] = np.array(v)[max(0, -y0):]
    return canvas
a = np.array(Image.open(f'{OUT}/sky_mask.png'))[..., 3].astype(np.float32)[..., None] / 255
def swap(base_w, img, name):
    scene = np.array(Image.open(f'{OUT}/scene_{base_w}.webp').convert('RGB')).astype(np.float32)
    old = place_view(Image.open(f'{G}/src/view_{base_w}.jpg').convert('RGB'))
    out = scene - old * a + place_view(img) * a
    Image.fromarray(out.clip(0, 255).astype(np.uint8)).save(f'{OUT}/scene_{name}.webp', quality=88, method=6)

# ---- full moon on the night view (work at 4x for a smooth edge)
night = Image.open(f'{G}/src/view_night.jpg').convert('RGB'); S = 4
big = night.resize((night.width * S, night.height * S), Image.LANCZOS); n = np.array(big).astype(np.float32)
cx, cy, r = 186 * S, 66 * S, 19 * S
yy, xx = np.mgrid[0:n.shape[0], 0:n.shape[1]]; d = np.hypot(xx - cx, yy - cy)
sky = ((n[..., 2] > n[..., 0] + 18) & (n.sum(2) > 170)).astype(np.float32)      # blue sky (and stars), not wires / poles / roofs
sky = np.array(Image.fromarray((sky * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))).astype(np.float32) / 255
rng = np.random.default_rng(7)
spots = np.array(Image.fromarray((rng.random((40, 40)) * 255).astype(np.uint8)).resize((r * 2, r * 2), Image.BICUBIC).filter(ImageFilter.GaussianBlur(S * 3))).astype(np.float32) / 255
tex = np.ones(n.shape[:2], np.float32); tex[cy - r:cy + r, cx - r:cx + r] = 0.9 + 0.12 * spots   # soft watercolour maria
disc = np.clip(r - d + 1.5, 0, 1)
moon = np.stack([252 * tex, 240 * tex, 205 * tex], -1)
halo = np.exp(-np.clip(d - r, 0, None) / (r * 0.9))[..., None] * 0.55
n = n + (np.array([255, 236, 190]) - n) * halo * sky[..., None] * (1 - disc[..., None])
n = n * (1 - (disc * sky)[..., None]) + moon * (disc * sky)[..., None]
vulan = Image.fromarray(n.clip(0, 255).astype(np.uint8)).resize(night.size, Image.LANCZOS)
vulan.save(f'{OUT}/view_vulan_night_check.png')
swap('night', vulan, 'vulan_night')

# ---- Thất Tịch
qx = Image.open(f'{G}/src/view_thattich.jpg').convert('RGB')
qn = ImageEnhance.Brightness(Image.blend(qx, Image.new('RGB', qx.size, (70, 66, 120)), 0.22)).enhance(0.86)
for w, img in {'sunset': qx, 'rain': qx, 'night': qn}.items(): swap(w, img, 'qx_' + w)
print('vulan/qx scenes ok')
