# Vi's sheet 27/11 (src/vi_1127/items5.jpg): bud stage of the 3 new plants, shop pots (fresh + wilted),
# fertiliser bag, pressed forget-me-not / hydrangea, Minh's backpack + headphones, the second teacup, round attic badge.
import sys
import cv2, numpy as np
G = sys.argv[1] if len(sys.argv) > 1 else '.'
A = f'{G}/assets'
im = cv2.imread(f'{G}/src/vi_1127/items5.jpg')
g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY); hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
FG = ((g < 232) | (hsv[..., 1] > 25)).astype(np.uint8) * 255


def save(name, mask, box, minarea=150, close=7):
    x0, y0, x1, y1 = box
    m = mask[y0:y1, x0:x1].copy()
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((close, close), np.uint8))
    cnts, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    big = max(cv2.contourArea(c) for c in cnts)
    keep = np.zeros_like(m); cv2.drawContours(keep, [c for c in cnts if cv2.contourArea(c) > max(minarea, big * 0.04)], -1, 255, -1)
    if close < 7: keep = cv2.bitwise_and(keep, m)          # thin pressed stems: do not fill the paper between them
    m = cv2.GaussianBlur(keep, (3, 3), 0)
    out = cv2.cvtColor(im[y0:y1, x0:x1], cv2.COLOR_BGR2BGRA); out[..., 3] = m
    ys, xs = np.where(m > 20)
    out = out[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    cv2.imwrite(f'{A}/{name}.png', out); return out


def cut(name, box): return save(name, FG, box)


cut('badge_home', (20, 36, 476, 526))
cut('hydrangea1', (684, 180, 858, 470))
cut('shop_leafy', (36, 540, 242, 830))
cut('shop_succ', (255, 600, 434, 830))
cut('shop_wilt1', (34, 848, 230, 1140))
cut('shop_wilt2', (246, 852, 440, 1140))
cut('fert_bag', (478, 584, 645, 845))
cut('minh_bag', (430, 852, 732, 1160))
cut('cup2', (738, 1026, 880, 1125))
# the two pressed-flower cards overlap: split along the second card's top-left edge
pf = FG.copy(); card2 = np.zeros_like(FG)
cv2.fillPoly(card2, [np.array([[741, 708], [879, 734], [864, 914], [706, 875]])], 255)
# pressed flowers: only the flower on the card (the bookmark corner lays them on its own paper)
card1 = np.zeros_like(FG); card1[566:800, 640:806] = FG[566:800, 640:806]; card1[card2 > 0] = 0
ink = (((hsv[..., 1] > 38) | (g < 150) | ((hsv[..., 0] > 95) & (hsv[..., 0] < 165) & (hsv[..., 1] > 10))) * 255).astype(np.uint8)
ink = cv2.morphologyEx(ink, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
for name, card, box in [('pf_forget', card1, (640, 566, 806, 800)), ('pf_hydrangea', card2, (700, 700, 884, 916))]:
    inner = cv2.erode(cv2.morphologyEx(card, cv2.MORPH_CLOSE, np.ones((25, 25), np.uint8)), np.ones((17, 17), np.uint8))
    save(name, cv2.bitwise_and(ink, inner), box, minarea=25, close=3)

# clover bud: the clover pot stands in front of the forget-me-not pot -> above the clover rim keep only leaves (+ outlines)
RIM = 398
green = ((hsv[..., 0] > 25) & (hsv[..., 0] < 95) & (hsv[..., 1] > 30)).astype(np.uint8) * 255
green = cv2.dilate(green, np.ones((5, 5), np.uint8))
cm = FG.copy(); cm[:RIM] = cv2.bitwise_and(FG[:RIM], green[:RIM])
save('clover1', cm, (500, 270, 700, 540))

# forget-me-not bud: foliage + pot rim above the clover, the hidden lower pot borrowed from the clover pot (same terracotta pot)
TOP_CLEAN = 278
fm = FG.copy(); fm[TOP_CLEAN:] = 0
top = im[74:TOP_CLEAN, 500:700]; tm = fm[74:TOP_CLEAN, 500:700]
def width(row_m):
    xs = np.where(row_m > 0)[0]; return (xs.min(), xs.max()) if len(xs) else None
w0 = width(tm[-1]); wf = w0[1] - w0[0]
# rows of the clover pot below its leaves, find the row with the same width
best = None
for y in range(470, 520):
    w = width(FG[y, 500:700])
    if w and abs((w[1] - w[0]) - wf) <= 2: best = y; break
best = best or 470
ys = np.where(FG[best:560, 500:700].any(1))[0]; yb = best + ys.max() + 1
w1 = width(FG[best, 500:700]); dx = w0[0] - w1[0]
bot = np.roll(im[best:yb, 500:700], dx, axis=1); bm = np.roll(FG[best:yb, 500:700], dx, axis=1)
comb = np.vstack([top, bot]); cmask = np.vstack([tm, bm])
H = comb.shape[0]
canvas = np.full((H + 20, 200, 3), 255, np.uint8); canvas[:H] = comb
mask = np.zeros((H + 20, 200), np.uint8); mask[:H] = cmask
im_bak = im; im = canvas; save('forget1', mask, (0, 0, 200, H + 20)); im = im_bak
print('forget seam width', wf, 'clover row', best)
print('items5 ok')
# a paper stain at the bottom-left corner of the forget-me-not card
pfm = cv2.imread(f'{A}/pf_forget.png', cv2.IMREAD_UNCHANGED); h, w = pfm.shape[:2]
pfm[int(h * 0.8):, :int(w * 0.14), 3] = 0; cv2.imwrite(f'{A}/pf_forget.png', pfm)
