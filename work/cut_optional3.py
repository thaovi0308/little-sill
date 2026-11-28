# Vi 28/11 (src/vi_1128/optional3.jpg): the 3 optional pictures from the holiday split --
# tt_walk (the alley kids' lantern walk, led by bé Na), hanh_xmas (Ms Hạnh playing at her open window on Christmas Eve,
# kids singing), son_frame (bà's son's photo frame + the old telephone).
import sys
import cv2, numpy as np
G = sys.argv[1] if len(sys.argv) > 1 else '.'
im = cv2.imread(f'{G}/src/vi_1128/optional3.jpg')
g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY); hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
def save(name, box, frac=0.02):
    x0, y0, x1, y1 = box
    fg = ((g[y0:y1, x0:x1] < 236) | (hsv[y0:y1, x0:x1, 1] > 18)).astype(np.uint8) * 255
    m = cv2.morphologyEx(fg, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    cnts, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    big = max(cv2.contourArea(c) for c in cnts)
    keep = np.zeros_like(m); cv2.drawContours(keep, [c for c in cnts if cv2.contourArea(c) > big * frac], -1, 255, -1)
    gg = g[y0:y1, x0:x1].astype(np.float32)
    a = np.clip((248 - gg) * 6 / 255, 0, 1)   # soft glow / shadow edges fade into the paper
    core = cv2.GaussianBlur(cv2.erode(keep, np.ones((7, 7), np.uint8)), (7, 7), 0).astype(np.float32) / 255
    m = (cv2.GaussianBlur(keep, (3, 3), 0).astype(np.float32) * np.maximum(a, core)).astype(np.uint8)
    out = cv2.cvtColor(im[y0:y1, x0:x1], cv2.COLOR_BGR2BGRA); out[..., 3] = m
    ys, xs = np.where(m > 20); out = out[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    cv2.imwrite(f'{G}/assets/{name}.png', out); print(name, out.shape[1], out.shape[0])
g[395:, 460:] = 255; hsv[395:, 460:, 1] = 0   # the photo frame's top edge sits below the walk: keep it out
save('tt_walk', (50, 25, 640, 490))
g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY); hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
save('hanh_xmas', (720, 25, 1245, 405))
save('son_frame', (460, 400, 950, 670))
