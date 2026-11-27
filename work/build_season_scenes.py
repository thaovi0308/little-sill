# Season views in the window (Vi's spring alley day/night 27/11, work/cut_spring_view.py; drizzle made from the night one)
# -> work/out/scene_<season>_<w>.webp. Winter joins SEASONS once Vi's winter alley is in.
# Same exact swap as build_tet_scenes.py: scene - view*a + xmas*a.
import sys
import numpy as np
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
SEASONS = ['spring', 'winter']
for SEA in SEASONS:
  night = Image.open(f'{G}/src/view_{SEA}_night.jpg').convert('RGB')
  # drizzle: the night alley a little greyer and softer (no stars), the streaks are drawn live
  nm = np.array(night).astype(np.float32)
  sky = (nm[..., 2] > nm[..., 0] + 25) & (nm.sum(2) < 400)          # blue night sky: wash the stars out
  rain = Image.fromarray(nm.astype(np.uint8))
  rain = ImageEnhance.Color(rain).enhance(0.7); rain = ImageEnhance.Brightness(rain).enhance(1.05)
  rain = Image.blend(rain, Image.new('RGB', rain.size, (118, 126, 150)), 0.2)
  r = np.array(rain); blur = np.array(rain.resize((rain.width // 8, rain.height // 8)).resize(rain.size, Image.BILINEAR))
  r[sky] = blur[sky]
  # no moon behind the rain clouds: inpaint the bright crescent in the upper sky
  import cv2
  top = np.zeros(r.shape[:2], np.uint8); hh = r.shape[0] // 4
  top[:hh] = ((r[:hh].astype(int).sum(2) > 480) * 255).astype(np.uint8)
  top = cv2.dilate(top, np.ones((15, 15), np.uint8))
  r = cv2.inpaint(r, top, 15, cv2.INPAINT_TELEA); rain = Image.fromarray(r)
  sea = {'sunset': Image.open(f'{G}/src/view_{SEA}_sunset.jpg').convert('RGB'), 'night': night, 'rain': rain}
  for w, img in sea.items():
      scene = np.array(Image.open(f'{OUT}/scene_{w}.webp').convert('RGB')).astype(np.float32)
      old = place_view(Image.open(f'{G}/src/view_{w}.jpg').convert('RGB'))
      out = scene - old * a + place_view(img) * a
      Image.fromarray(out.clip(0, 255).astype(np.uint8)).save(f'{OUT}/scene_{SEA}_{w}.webp', quality=88, method=6)
print('season scenes ok')
