# Vi 27/11 (src/vi_1127/hanh_items.jpg): route 7 cô Hạnh -- playing / smiling, round badge (her house with the piano
# window), her room (piano + metronome by the window), music sheet, treble-clef clip, music box, wall sketch, Khóa Sol stamp.
import sys
import cv2, numpy as np
G = sys.argv[1] if len(sys.argv) > 1 else '.'
im = cv2.imread(f'{G}/src/vi_1127/hanh_items.jpg')
g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY); hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
def save(name, box, frac=0.03, fade=False):
    x0, y0, x1, y1 = box
    fg = ((g[y0:y1, x0:x1] < 236) | (hsv[y0:y1, x0:x1, 1] > 20)).astype(np.uint8) * 255
    m = cv2.morphologyEx(fg, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    cnts, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    big = max(cv2.contourArea(c) for c in cnts)
    keep = np.zeros_like(m); cv2.drawContours(keep, [c for c in cnts if cv2.contourArea(c) > big * frac], -1, 255, -1)
    m = cv2.GaussianBlur(keep, (3, 3), 0)
    out = cv2.cvtColor(im[y0:y1, x0:x1], cv2.COLOR_BGR2BGRA); out[..., 3] = m
    ys, xs = np.where(m > 20); out = out[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    cv2.imwrite(f'{G}/assets/{name}.png', out); print(name, out.shape[1], out.shape[0])
save('hanh_play', (50, 75, 380, 418))
save('hanh_smile', (392, 55, 672, 418))
save('hanh_badge', (672, 66, 925, 322), frac=0.01)
save('hanh_room', (942, 36, 1240, 478))
save('hanh_sheet', (48, 438, 265, 645))
save('hanh_clip', (296, 445, 392, 655))
save('hanh_musicbox', (448, 438, 660, 662))
save('painting_hanh', (706, 452, 918, 664))
save('st_treble', (1010, 500, 1180, 665))
# the metronome Vi drew sits on the piano in her room: a close crop stands in until a separate drawing comes
x0, y0, x1, y1 = 1020, 192, 1070, 290
crop = im[y0:y1, x0:x1]; crop = cv2.resize(crop, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
cv2.imwrite(f'{G}/assets/hanh_metronome_crop.png', cv2.cvtColor(crop, cv2.COLOR_BGR2BGRA))
