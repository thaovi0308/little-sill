# Vi 28/11 (src/vi_1128/alley_all_lit.jpg, portrait 3:4, no frame): the alley at night with every window lit, lanterns
# strung across, the old bookstore at the end -- the shared ending once all 7 neighbours' stories are complete.
# -> src/view_alllit_night.jpg (window aspect 556:766, 810x1116, ✦ inpainted), work/out/scene_alllit_night.webp
# (same swap as build_season_scenes.py), assets/k_alllit.png (keepsake picture).
import sys
import cv2, numpy as np
from PIL import Image
G = sys.argv[1] if len(sys.argv) > 1 else '.'
OUT = f'{G}/work/out'; W, H = 714, 1280
im = cv2.imread(f'{G}/src/vi_1128/alley_all_lit.jpg'); h, w = im.shape[:2]
m = np.zeros((h, w), np.uint8); cv2.circle(m, (w - 66, h - 64), 24, 255, -1)
im = cv2.inpaint(im, m, 9, cv2.INPAINT_TELEA)
cw = round(h * 556 / 766); x0 = (w - cw) // 2
view = cv2.resize(im[:, x0:x0 + cw], (810, 1116), interpolation=cv2.INTER_CUBIC)
cv2.imwrite(f'{G}/src/view_alllit_night.jpg', view, [cv2.IMWRITE_JPEG_QUALITY, 92])
kp = cv2.resize(im, (480, round(480 * h / w)), interpolation=cv2.INTER_AREA)
cv2.imwrite(f'{G}/assets/k_alllit.png', kp)
vx0, vx1, bottom = 100, 656, 906
def place_view(img):
    v = img.resize((vx1 - vx0, round((vx1 - vx0) * img.height / img.width)), Image.LANCZOS)
    canvas = np.zeros((H, W, 3)); y0 = bottom - v.height
    canvas[max(0, y0):bottom, vx0:vx1] = np.array(v)[max(0, -y0):]
    return canvas
a = np.array(Image.open(f'{OUT}/sky_mask.png'))[..., 3].astype(np.float32)[..., None] / 255
scene = np.array(Image.open(f'{OUT}/scene_night.webp').convert('RGB')).astype(np.float32)
old = place_view(Image.open(f'{G}/src/view_night.jpg').convert('RGB'))
new = place_view(Image.open(f'{G}/src/view_alllit_night.jpg').convert('RGB'))
Image.fromarray((scene - old * a + new * a).clip(0, 255).astype(np.uint8)).save(f'{OUT}/scene_alllit_night.webp', quality=88, method=6)
print('alllit scene ok')
