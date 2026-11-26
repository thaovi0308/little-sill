"""App icon + cover of src/brand.jpg -> assets/icon.png (rounded, transparent corners), assets/cover.jpg,
and the store files in /home/tam/tgsam/out (icon 512, itch.io cover 630x500)."""
import cv2, numpy as np, sys
from PIL import Image
G = sys.argv[1]
im = Image.open(f'{G}/src/brand.jpg').convert('RGB'); a = np.array(im)
# icon: white around the rounded square -> transparent
x0, y0, x1, y1 = 66, 109, 451, 508
ic = a[y0:y1, x0:x1].astype(int)
near = (ic.min(2) > 228).astype(np.uint8)
n, lab = cv2.connectedComponents(near)
border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
alpha = (~np.isin(lab, list(border))).astype(np.float32)
alpha = cv2.GaussianBlur(alpha, (3, 3), 0)
ys, xs = np.where(alpha > 0.5); ic = ic[ys.min():ys.max() + 1, xs.min():xs.max() + 1]; alpha = alpha[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
icon = Image.fromarray(np.dstack([ic, alpha * 255]).astype(np.uint8))
s = max(icon.size); sq = Image.new('RGBA', (s, s)); sq.paste(icon, ((s - icon.width) // 2, (s - icon.height) // 2))
sq.save(f'{G}/assets/icon.png'); sq.resize((512, 512), Image.LANCZOS).save('/home/tam/tgsam/out/Little_Sill_icon_512.png')
print('icon', sq.size)
cov = im.crop((68, 563, 829, 1133)); cov.save(f'{G}/assets/cover.jpg', quality=92)
w, h = cov.size; tw = round(h * 630 / 500)            # itch.io cover 630x500: crop the sides
cx = w // 2 - 20
cov.crop((cx - tw // 2, 0, cx - tw // 2 + tw, h)).resize((630, 500), Image.LANCZOS).save('/home/tam/tgsam/out/Little_Sill_cover_630x500.png')
print('cover', cov.size)
