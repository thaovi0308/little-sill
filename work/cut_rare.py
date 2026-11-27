# Vi's sheet 27/11 (src/vi_1127/rare_visitors.jpg): the lost firefly, the postman with his bicycle, the envelope with odd stamps.
import sys
import cv2, numpy as np
G = sys.argv[1] if len(sys.argv) > 1 else '.'
A = f'{G}/assets'
im = cv2.imread(f'{G}/src/vi_1127/rare_visitors.jpg')
g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY); hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
FG = ((g < 232) | (hsv[..., 1] > 25)).astype(np.uint8) * 255


def save(name, mask, box, close=7, soft=None, holes=None):
    x0, y0, x1, y1 = box
    m = mask[y0:y1, x0:x1].copy()
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((close, close), np.uint8))
    cnts, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    big = max(cv2.contourArea(c) for c in cnts)
    keep = np.zeros_like(m); cv2.drawContours(keep, [c for c in cnts if cv2.contourArea(c) > big * 0.04], -1, 255, -1)
    if holes is not None:   # open areas (between bicycle spokes): keep only the drawn pixels there
        h = holes[y0:y1, x0:x1] > 0; keep[h] = cv2.bitwise_and(keep, cv2.dilate(m, np.ones((3, 3), np.uint8)))[h]
    m = cv2.GaussianBlur(keep, (3, 3), 0)
    if soft is not None: m = np.minimum(m, soft[y0:y1, x0:x1])
    out = cv2.cvtColor(im[y0:y1, x0:x1], cv2.COLOR_BGR2BGRA); out[..., 3] = m
    ys, xs = np.where(m > 20)
    out = out[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    cv2.imwrite(f'{A}/{name}.png', out); print(name, out.shape[1], out.shape[0])


# firefly: the yellow halo is drawn on the paper; keep the bug (dark ink, wings) + its lit tail, the game draws its own glow
bug = ((g < 205) | (hsv[..., 1] > 120)).astype(np.uint8) * 255
tail = np.zeros_like(g); cv2.ellipse(tail, (232, 312), (40, 36), -20, 0, 360, 255, -1)   # the lit belly: pale yellow, keep its shape only
bug[(tail > 0) & (g < 250) & (hsv[..., 1] > 60)] = 255
save('firefly', bug, (140, 100, 420, 360), close=5)
# postman + bicycle: his legs fade into the paper; fade the alpha the same way (lightness of the paper below y=640)
soft = np.full(g.shape, 255, np.uint8)
yy = np.arange(g.shape[0])[:, None]
soft = np.clip((735 - yy) * 255 / 95, 0, 255).astype(np.uint8) * np.ones_like(g)
pm = FG.copy(); pm[:385, :565] = 0                      # the firefly's halo reaches this corner
wheels = np.zeros_like(g); wheels[560:740, 320:575] = 255; wheels[560:740, 575:640] = 0
save('postman', pm, (320, 110, 860, 740), soft=soft, holes=wheels)
save('envelope_odd', FG, (80, 760, 510, 1130))
