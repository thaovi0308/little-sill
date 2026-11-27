# Vi's Christmas postcard frame 27/11 (src/vi_1127/xmas_card.jpg, 928x1152): green-screen window -> transparent,
# the size notes (80px / 70px / 260px / "Logo") painted over with paper. Output assets/xmas_card.png + the hole box (printed).
import sys
import cv2, numpy as np
G = sys.argv[1] if len(sys.argv) > 1 else '.'
im = cv2.imread(f'{G}/src/vi_1127/xmas_card.jpg')
b, g, r = [im[..., i].astype(np.int16) for i in range(3)]
key = (g - np.maximum(r, b)).clip(0, 255)
alpha = 255 - np.clip((key - 40) * 4, 0, 255)                 # strong green -> clear, soft along the edge
ys, xs = np.where(key > 120); print('hole', xs.min(), ys.min(), xs.max(), ys.max())
# the round postmark is printed half over the green: inside its circle, ink = how far a pixel is from the plain green
gref = np.median(im[400:700, 200:600].reshape(-1, 3), 0)
yy, xx = np.mgrid[:im.shape[0], :im.shape[1]]
circ = ((xx - 668) ** 2 + (yy - 265) ** 2 < 102 ** 2) & (key > 12)
dist = np.linalg.norm(im.astype(np.float32) - gref, axis=2)
alpha[circ] = np.clip((dist[circ] - 30) * 2.2, 0, 235)
im[circ] = (60, 70, 128)                                         # the postmark's brown-red ink (BGR)
key[circ] = 0
# despill: green-tinted edge pixels back to the dark green line colour
spill = (key > 25) & (alpha > 0)
im[spill] = (np.array([60, 90, 55]) * 1).astype(np.uint8)
# erase the annotations (text on plain paper) by inpainting
mask = np.zeros(im.shape[:2], np.uint8)
for x0, y0, x1, y1 in [(420, 52, 505, 90), (20, 485, 95, 525), (830, 485, 910, 525), (420, 1090, 512, 1130), (780, 1035, 868, 1132)]:
    sub = cv2.cvtColor(im[y0:y1, x0:x1], cv2.COLOR_BGR2GRAY)
    mask[y0:y1, x0:x1] = (sub < 225).astype(np.uint8) * 255
mask = cv2.dilate(mask, np.ones((5, 5), np.uint8))
im = cv2.inpaint(im, mask, 5, cv2.INPAINT_TELEA)
out = cv2.cvtColor(im, cv2.COLOR_BGR2BGRA); out[..., 3] = alpha.astype(np.uint8)
cv2.imwrite(f'{G}/assets/xmas_card.png', out)
