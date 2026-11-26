# "Ra ngoài hẻm" assets from Vi's drawings (26/11):
#  - shop_bg.png (src/shop_bg.jpg) + shop_front.png: the counter, seed basket and teapot cut out so the florist can stand behind them
#  - stairs_scene.png: the stair-foot picture for the mailbox popup (4:3 crop of src/stairs_bg.jpg + bench, snake plant, broom, geta)
#  - pc_station / pc_pine postcards, mai_pot / tet_tray from minh_tet_items2.jpg
#  - stage-1 plant pictures for the new seeds (copies of the sprout until Vi draws the bud stage)
import sys, shutil
import cv2, numpy as np
from PIL import Image
G = sys.argv[1] if len(sys.argv) > 1 else '.'
A = f'{G}/assets'


def cut(im, box):
    x0, y0, x1, y1 = box
    c = im[y0:y1, x0:x1]
    g = cv2.cvtColor(c, cv2.COLOR_BGR2GRAY); hsv = cv2.cvtColor(c, cv2.COLOR_BGR2HSV)
    fg = ((g < 235) | (hsv[..., 1] > 22)).astype(np.uint8) * 255
    fg = cv2.morphologyEx(fg, cv2.MORPH_CLOSE, np.ones((15, 15), np.uint8))
    cnts, _ = cv2.findContours(fg, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    m = np.zeros_like(fg); cv2.drawContours(m, [max(cnts, key=cv2.contourArea)], -1, 255, -1)
    m = cv2.GaussianBlur(m, (3, 3), 0)
    out = cv2.cvtColor(c, cv2.COLOR_BGR2BGRA); out[..., 3] = m
    ys, xs = np.where(m > 20)
    return out[ys.min():ys.max() + 1, xs.min():xs.max() + 1]


# ---- shop
shop = cv2.imread(f'{G}/src/shop_bg.jpg')
cv2.imwrite(f'{A}/shop_bg.png', shop)
H, W = shop.shape[:2]
front = np.zeros((H, W), np.uint8)
front[828:1140, 44:674] = 255                       # counter top + front boards
for (x0, y0, x1, y1) in [(343, 730, 472, 856), (486, 762, 597, 852), (418, 818, 492, 866)]:   # basket+roses, teapot, twine ball
    m = np.zeros((H, W), np.uint8); bg = np.zeros((1, 65), np.float64); fgm = np.zeros((1, 65), np.float64)
    cv2.grabCut(shop, m, (x0, y0, x1 - x0, y1 - y0), bg, fgm, 6, cv2.GC_INIT_WITH_RECT)
    obj = np.where((m == 1) | (m == 3), 255, 0).astype(np.uint8)
    obj = cv2.morphologyEx(obj, cv2.MORPH_CLOSE, np.ones((15, 15), np.uint8))
    front = np.maximum(front, obj)
front[:, :] = cv2.GaussianBlur(front, (3, 3), 0)
ys = np.where(front.any(1))[0]; top = ys.min()
fr = cv2.cvtColor(shop, cv2.COLOR_BGR2BGRA); fr[..., 3] = front
cv2.imwrite(f'{A}/shop_front.png', fr[top:1141])
print('shop_front top', top)

# ---- stair foot: 4:3 crop + Vi's props baked in
st = Image.open(f'{G}/src/stairs_bg.jpg').convert('RGBA')
Y0 = 400; sc = st.crop((0, Y0, 896, Y0 + 672))
def put(name, h, cx, bottom, flip=False):
    p = Image.open(f'{A}/{name}.png'); p = p.resize((round(p.width * h / p.height), h), Image.LANCZOS)
    if flip: p = p.transpose(Image.FLIP_LEFT_RIGHT)
    sh = Image.new('RGBA', p.size, (40, 25, 10, 0)); a = np.array(p)[..., 3]
    sh.putalpha(Image.fromarray((a * 0.25).astype(np.uint8)))          # soft contact shadow
    sc.alpha_composite(sh, (round(cx - p.width / 2) + 4, bottom - h + 5)); sc.alpha_composite(p, (round(cx - p.width / 2), bottom - h))
put('broom', 250, 640, 545)
put('bench', 128, 520, 560)
put('snake_plant', 160, 420, 600)
put('geta', 58, 250, 640)
sc.convert('RGB').save(f'{A}/stairs_scene.png')

# ---- postcards + Tết pieces from minh_tet_items2.jpg
sheet = cv2.imread(f'{G}/src/vi_1126/minh_tet_items2.jpg')
cv2.imwrite(f'{A}/pc_station.png', sheet[41:246, 649:933])
cv2.imwrite(f'{A}/pc_pine.png', sheet[41:246, 959:1243])
cv2.imwrite(f'{A}/mai_pot.png', cut(sheet, (540, 305, 805, 640)))
cv2.imwrite(f'{A}/tet_tray.png', cut(sheet, (35, 380, 475, 632)))

# ---- new plants: the bud stage is not drawn yet -> reuse the sprout
for k in ['forget', 'hydrangea', 'clover']:
    shutil.copy(f'{A}/{k}0.png', f'{A}/{k}1.png')
print('ok')

# ---- an empty pot (gift from the shop / after a harvest): Vi's daisy sprout pot with the sprout painted out
im = cv2.imread(f'{A}/daisy0.png', cv2.IMREAD_UNCHANGED)
hsv = cv2.cvtColor(im[..., :3], cv2.COLOR_BGR2HSV)
green = ((hsv[..., 0] > 22) & (hsv[..., 0] < 95) & (hsv[..., 1] > 35)).astype(np.uint8)
green[55:] = 0                                       # only the sprout, not the moss on the pot
green = cv2.dilate(green, np.ones((5, 5), np.uint8))
im[:15, :, 3] = 0                                    # above the rim: only leaf
for y in range(15, 60):                              # row-wise fill from the clean pixels left and right (rim bands, soil)
    xs = np.where(green[y] > 0)[0]
    if not len(xs): continue
    x0, x1 = xs.min() - 1, xs.max() + 1
    a, b = im[y, x0, :3].astype(float), im[y, x1, :3].astype(float)
    for x in range(x0 + 1, x1):
        t = (x - x0) / (x1 - x0); im[y, x, :3] = (a * (1 - t) + b * t).astype(np.uint8)
        im[y, x, 3] = max(im[y, x0, 3], im[y, x1, 3]) if y >= 16 else 0
cv2.imwrite(f'{A}/empty0.png', im)
print('empty pot ok')
