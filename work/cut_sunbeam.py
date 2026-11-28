# Vi's slanted sunbeam with floating dust (src/vi_1128/sunbeam.jpg) -> assets/sunbeam.png for sunny afternoons.
# The beam's core is as white as the paper, so: soft warm glow inside the beam band + Vi's gold dust/bokeh lifted by saturation.
import sys
import cv2, numpy as np
G = sys.argv[1] if len(sys.argv) > 1 else '.'
im = cv2.imread(f'{G}/src/vi_1128/sunbeam.jpg')
h, w = im.shape[:2]
m = np.zeros((h, w), np.uint8); cv2.circle(m, (w - 54, h - 52), 30, 255, -1)   # Vi's ✦ signature mark
im = cv2.inpaint(im, m, 9, cv2.INPAINT_TELEA)
hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV).astype(np.float32)
band = np.zeros((h, w), np.uint8)
cv2.fillPoly(band, [np.array([(40, 0), (400, 0), (1280, 470), (1280, 698), (650, 698)], np.int32)], 255)
band = cv2.GaussianBlur(band, (0, 0), 45).astype(np.float32) / 255
glow_a = band * 0.42
dust_a = np.clip((hsv[..., 1] - 38) / 45, 0, 1) * band ** .5            # gold specks, stars and bokeh rings
dust_a = np.maximum(dust_a, np.clip((228 - hsv[..., 2]) / 40, 0, 1) * band ** .5 * 0.9)   # their ink outlines
glow_c = np.array([200, 236, 255], np.float32)   # warm cream (BGR)
yy, xx = np.mgrid[0:h, 0:w]   # fade every edge of the sheet so the layer has no visible frame
edge = (np.minimum.reduce([xx / 220, (w - xx) / 220, yy / 160, (h - yy) / 160]).clip(0, 1)) ** 1.5
glow_a *= edge; dust_a *= edge
a = dust_a + glow_a * (1 - dust_a)
col = (im.astype(np.float32) * dust_a[..., None] + glow_c * (glow_a * (1 - dust_a))[..., None]) / np.maximum(a[..., None], 1e-3)
cv2.imwrite(f'{G}/assets/sunbeam.png', np.dstack([np.clip(col, 0, 255), a * 255]).astype(np.uint8)); print('sunbeam', w, h)
