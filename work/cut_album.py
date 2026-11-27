# Vi 27/11 (src/vi_1127/album_pages.jpg): year-end album -- fabric cover (portrait, cloud label, string tie) and an inner
# page with two photo slots (paper corners). Prints the slot/label rectangles in output-image pixels for src/album.js.
import sys
import cv2, numpy as np
G = sys.argv[1] if len(sys.argv) > 1 else '.'
im = cv2.imread(f'{G}/src/vi_1127/album_pages.jpg')
g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY); hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
FG = ((g < 240) | (hsv[..., 1] > 14)).astype(np.uint8) * 255
def save(name, box):
    x0, y0, x1, y1 = box
    m = cv2.morphologyEx(FG[y0:y1, x0:x1], cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    cnts, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    big = max(cv2.contourArea(c) for c in cnts)
    keep = np.zeros_like(m); cv2.drawContours(keep, [c for c in cnts if cv2.contourArea(c) > big * 0.002], -1, 255, -1)
    m = cv2.GaussianBlur(keep, (3, 3), 0)
    out = cv2.cvtColor(im[y0:y1, x0:x1], cv2.COLOR_BGR2BGRA); out[..., 3] = m
    ys, xs = np.where(m > 20); out = out[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    cv2.imwrite(f'{G}/assets/{name}.png', out); print(name, out.shape[1], out.shape[0], 'origin', x0 + xs.min(), y0 + ys.min())
save('album_cover2', (40, 180, 540, 870))
save('album_page', (538, 180, 990, 870))
