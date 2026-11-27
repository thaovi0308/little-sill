# Vi's Thất Tịch alley 27/11 (src/vi_1127/thattich_view.jpg, 896x1200, drawn WITH a window frame + shutters):
# keep only the alley between her shutters -> src/view_thattich.jpg 810x1116 (same frame as the other views).
# The game window shows ~86% of the view width in its opening; the outer strips (her shutters) only peek through the game's shutter panes.
import sys
from PIL import Image
G = sys.argv[1] if len(sys.argv) > 1 else '.'
im = Image.open(f'{G}/src/vi_1127/thattich_view.jpg').convert('RGB')
x0, x1 = 208, 749; h = round((x1 - x0) * 1116 / 810); y1 = 950
im.crop((x0, y1 - h, x1, y1)).resize((810, 1116), Image.LANCZOS).save(f'{G}/src/view_thattich.jpg', quality=92)
print('view_thattich', x0, y1 - h, x1, y1)

# the wax-sealed envelope on her sill -> assets/tt_envelope.png (light paper on dark wood: keep the bright, low-saturation part)
import cv2, numpy as np
src = cv2.imread(f'{G}/src/vi_1127/thattich_view.jpg')[1060:1185, 520:760]
hsv = cv2.cvtColor(src, cv2.COLOR_BGR2HSV); g = cv2.cvtColor(src, cv2.COLOR_BGR2GRAY)
red = (hsv[..., 1] > 110) & (hsv[..., 2] > 90)   # the wax seal
keep = np.zeros(g.shape, np.uint8)   # the envelope is a plain quadrilateral: its 4 corners, measured on her sheet
cv2.fillPoly(keep, [np.array([(14, 66), (69, 15), (219, 54), (190, 112)], np.int32)], 255)
keep = cv2.GaussianBlur(keep, (3, 3), 0)
out = cv2.cvtColor(src, cv2.COLOR_BGR2BGRA); out[..., 3] = keep
ys, xs = np.where(keep > 20); out = out[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
cv2.imwrite(f'{G}/assets/tt_envelope.png', out); print('tt_envelope', out.shape[1], out.shape[0])
