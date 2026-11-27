# Vi's sheet 27/11 (src/vi_1127/bookshop.jpg): the old bookshop at the end of the alley (route 6, Ông Khải).
# bookshop_bg = the shelves wall (a painted rectangle), bookshop_desk = desk + green lamp + books, khai_read / khai_smile.
import sys
import cv2, numpy as np
G = sys.argv[1] if len(sys.argv) > 1 else '.'
A = f'{G}/assets'
im = cv2.imread(f'{G}/src/vi_1127/bookshop.jpg')
g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY); hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
FG = ((g < 228) | (hsv[..., 1] > 30)).astype(np.uint8) * 255


def save(name, box, close=7):
    x0, y0, x1, y1 = box
    m = cv2.morphologyEx(FG[y0:y1, x0:x1], cv2.MORPH_CLOSE, np.ones((close, close), np.uint8))
    cnts, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    big = max(cv2.contourArea(c) for c in cnts)
    keep = np.zeros_like(m); cv2.drawContours(keep, [c for c in cnts if cv2.contourArea(c) > big * 0.03], -1, 255, -1)
    m = cv2.GaussianBlur(keep, (3, 3), 0)
    out = cv2.cvtColor(im[y0:y1, x0:x1], cv2.COLOR_BGR2BGRA); out[..., 3] = m
    ys, xs = np.where(m > 20); out = out[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    cv2.imwrite(f'{A}/{name}.png', out); print(name, out.shape[1], out.shape[0])


# the wall is a full rectangle: plain crop inside its ink border
cv2.imwrite(f'{G}/src/bookshop_bg.jpg', im[38:802, 34:508], [cv2.IMWRITE_JPEG_QUALITY, 94]); print('bookshop_bg', 474, 764)
save('bookshop_desk', (20, 815, 525, 1160))
save('khai_read', (525, 75, 880, 590))
save('khai_smile', (525, 630, 880, 1160))
