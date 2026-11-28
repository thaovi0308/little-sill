# Vi 27/11 (src/vi_1127/album2.jpg): second year-end album -- green linen cover (stamp label, bougainvillea, ribbon tie) and
# an inner page with ONE photo slot (4 paper corners) and 4 writing lines. Outputs album_cover3, album_page3 (corners
# removed, slot left as paper-white) and album_corners3 (the 4 corners alone, drawn over the photo).
# Prints slot/lines rectangles in output-image pixels for src/album.js.
import sys
import cv2, numpy as np
G = sys.argv[1] if len(sys.argv) > 1 else '.'
im = cv2.imread(f'{G}/src/vi_1127/album2.jpg')
g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY); hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
FG = ((g < 238) | (hsv[..., 1] > 14)).astype(np.uint8) * 255
def cut(box):
    x0, y0, x1, y1 = box
    m = cv2.morphologyEx(FG[y0:y1, x0:x1], cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    cnts, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    big = max(cv2.contourArea(c) for c in cnts)
    keep = np.zeros_like(m); cv2.drawContours(keep, [c for c in cnts if cv2.contourArea(c) > big * 0.002], -1, 255, -1)
    m = cv2.GaussianBlur(keep, (3, 3), 0)
    out = cv2.cvtColor(im[y0:y1, x0:x1], cv2.COLOR_BGR2BGRA); out[..., 3] = m
    ys, xs = np.where(m > 20)
    return out[ys.min():ys.max() + 1, xs.min():xs.max() + 1], x0 + xs.min(), y0 + ys.min()
cover, _, _ = cut((40, 20, 660, 690)); cv2.imwrite(f'{G}/assets/album_cover3.png', cover); print('cover', cover.shape[1], cover.shape[0])
page, ox, oy = cut((660, 20, 1240, 690))
# photo slot: the white area inside the corners (searched in a window of the source picture around it)
sub = (g[90:470, 830:1130] > 246).astype(np.uint8) * 255
n, lab, st, _ = cv2.connectedComponentsWithStats(sub); i = 1 + np.argmax(st[1:, 4])
x, y, w, h = st[i][0] + 830 - ox, st[i][1] + 90 - oy, st[i][2], st[i][3]; print('origin', ox, oy, 'slot', x, y, w, h)
# the corners: brown/tan, saturated, around the slot
hs = hsv[oy:oy + page.shape[0], ox:ox + page.shape[1]]
brown = ((hs[..., 1] > 55) & (hs[..., 0] > 5) & (hs[..., 0] < 30)).astype(np.uint8)
zone = np.zeros_like(brown); zone[max(0, y - 30):y + h + 30, max(0, x - 30):x + w + 30] = 1
cm = cv2.dilate(brown * zone, np.ones((5, 5), np.uint8)); cm = cv2.morphologyEx(cm, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))
n, lab, st, _ = cv2.connectedComponentsWithStats(cm); cm = np.isin(lab, [j for j in range(1, n) if st[j, 4] > 800]).astype(np.uint8)   # drop thin border lines
corners = page.copy(); corners[..., 3] = np.where(cm > 0, page[..., 3], 0)
cv2.imwrite(f'{G}/assets/album_corners3.png', corners)
cv2.imwrite(f'{G}/assets/album_page3.png', page); print('page', page.shape[1], page.shape[0])
# the writing lines: rows below the slot that are darker over most of the line width
gp = g[oy:oy + page.shape[0], ox:ox + page.shape[1]].astype(int)
rows = [r for r in range(y + h + 20, page.shape[0] - 10) if (gp[r, x - 30:x + w + 30] < 215).mean() > 0.5]
print('lines', rows)
