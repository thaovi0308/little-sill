# Vi's decoration pack 1 (27/11, src/vi_1127/decor_pack1.jpg): 3 curtains (linen, lace, floral; left + right panel),
# 3 wind chimes (blue bell, starfish, paper lantern) and 3 garlands (bulbs off/on, bunting, paper cranes).
# Curtains and chimes overlap in their boxes, so pieces are picked as connected components by seed points.
import sys
import cv2, numpy as np
G = sys.argv[1] if len(sys.argv) > 1 else '.'
A = f'{G}/assets'
im = cv2.imread(f'{G}/src/vi_1127/decor_pack1.jpg')
g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY); hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
FG = ((g < 238) | (hsv[..., 1] > 22)).astype(np.uint8) * 255
FGc = cv2.morphologyEx(FG, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
n, lab = cv2.connectedComponents(FGc)


def out(name, m):
    m = m.copy(); cnts, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cv2.drawContours(m, cnts, -1, 255, -1)                     # fill holes (white lace inside the outline)
    m = cv2.GaussianBlur(m, (3, 3), 0)
    ys, xs = np.where(m > 20); y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    o = cv2.cvtColor(im, cv2.COLOR_BGR2BGRA)[y0:y1, x0:x1]; o[..., 3] = m[y0:y1, x0:x1]
    cv2.imwrite(f'{A}/{name}.png', o); print(name, o.shape[1], o.shape[0])


def comp(name, box, seeds=None, minarea=40):
    x0, y0, x1, y1 = box; m = np.zeros_like(FG)
    ids = set(lab[y, x] for x, y in seeds) - {0} if seeds and seeds != 'big' else None
    sub = lab[y0:y1, x0:x1]
    for i in np.unique(sub):
        if i == 0: continue
        if ids is not None and i not in ids: continue
        part = (sub == i)
        if part.sum() >= minarea: m[y0:y1, x0:x1][part] = 255
    if seeds == 'big':   # curtains: keep the big pieces only (the chime hanging between the panels is smaller)
        k, l2, st, _ = cv2.connectedComponentsWithStats(m); big = st[1:, 4].max()
        m = np.isin(l2, [j for j in range(1, k) if st[j, 4] >= big * 0.15]).astype(np.uint8) * 255
    out(name, m)


comp('cu_linen_l', (30, 30, 232, 425), 'big'); comp('cu_linen_r', (225, 30, 420, 425), 'big')
comp('cu_lace_l', (450, 30, 640, 425), 'big'); comp('cu_lace_r', (640, 30, 840, 425), 'big')
comp('cu_floral_l', (870, 30, 1060, 425), 'big'); comp('cu_floral_r', (1060, 30, 1250, 425), 'big')
comp('chime_bell', (185, 180, 275, 445))
comp('chime_star', (580, 215, 705, 505))
comp('chime_lantern', (1010, 215, 1115, 480))
comp('ga_bulbs', (40, 448, 420, 551)); comp('ga_bulbs_on', (40, 552, 420, 665))
comp('ga_bunting', (435, 506, 870, 640)); comp('ga_cranes', (880, 478, 1250, 660))
