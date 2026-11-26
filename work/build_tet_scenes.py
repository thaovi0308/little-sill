# Tết views in the window (Vi's tet alley day/night, rain made from the night one) -> work/out/scene_tet_<w>.webp
# The room scene is room*(1-a) + view*a (build_room3.py), so swapping the view is exact: scene - view*a + tet*a.
# Also splits the couplet pair (tet_couplet) into two hanging scrolls for the walls beside the window.
import sys, os
import cv2, numpy as np
from PIL import Image, ImageEnhance
G = sys.argv[1] if len(sys.argv) > 1 else '.'
OUT = f'{G}/work/out'; W, H = 714, 1280
x0, x1, bottom = 100, 656, 906
def place_view(img):
    v = img.resize((x1 - x0, round((x1 - x0) * img.height / img.width)), Image.LANCZOS)
    canvas = np.zeros((H, W, 3)); y0 = bottom - v.height
    canvas[max(0, y0):bottom, x0:x1] = np.array(v)[max(0, -y0):]
    return canvas
a = np.array(Image.open(f'{OUT}/sky_mask.png'))[..., 3].astype(np.float32)[..., None] / 255
night = Image.open(f'{G}/src/view_tet_night.jpg').convert('RGB')
# rain: the night alley without the moon, greyer and a little lighter (the rain streaks are drawn live)
nm = np.array(night); g = cv2.cvtColor(nm, cv2.COLOR_RGB2GRAY)
circ = np.zeros(g.shape, np.uint8); cv2.circle(circ, (333, 108), 55, 1, -1)
moon = cv2.dilate(((g > 95) & (circ > 0)).astype(np.uint8) * 255, np.ones((9, 9), np.uint8))
rain = Image.fromarray(cv2.inpaint(nm, moon, 9, cv2.INPAINT_TELEA))
rain = ImageEnhance.Color(rain).enhance(0.6); rain = ImageEnhance.Brightness(rain).enhance(1.08)
rain = Image.blend(rain, Image.new('RGB', rain.size, (120, 130, 158)), 0.22)
tet = {'sunset': Image.open(f'{G}/src/view_tet_sunset.jpg').convert('RGB'), 'night': night, 'rain': rain}
for w, img in tet.items():
    scene = np.array(Image.open(f'{OUT}/scene_{w}.webp').convert('RGB')).astype(np.float32)
    old = place_view(Image.open(f'{G}/src/view_{w}.jpg').convert('RGB'))
    out = scene - old * a + place_view(img) * a
    Image.fromarray(out.clip(0, 255).astype(np.uint8)).save(f'{OUT}/scene_tet_{w}.webp', quality=88, method=6)
c = Image.open(f'{G}/assets/tet_couplet.png'); al = np.array(c)[..., 3] > 30
cols = np.where(al.any(0))[0]; gap = [x for x in range(cols.min(), cols.max()) if not al[:, x].any()]
mid = gap[len(gap) // 2] if gap else c.width // 2
for name, box in [('tet_couplet_l', (0, 0, mid, c.height)), ('tet_couplet_r', (mid, 0, c.width, c.height))]:
    p = c.crop(box); p.crop(p.getbbox()).save(f'{G}/assets/{name}.png')
print('tet scenes ok, couplet split at', mid)
