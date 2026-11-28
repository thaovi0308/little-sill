# Vi 27/11 evening sheets (src/vi_1127/): summer/autumn gifts + stamps, 4 new plants (portulaca, butterfly pea, mimosa, jasmine:
# seed packet, sprout, mid, bloom, pressed), flower teas, and the remaining-holidays props (cut now, used when the script comes).
import sys
import cv2, numpy as np
G = sys.argv[1] if len(sys.argv) > 1 else '.'
A = f'{G}/assets'


def load(f):
    im = cv2.imread(f'{G}/src/vi_1127/{f}.jpg')
    g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY); hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
    return im, ((g < 236) | (hsv[..., 1] > 20)).astype(np.uint8) * 255


def save(im, FG, name, box, close=7, frac=0.04, fill=True):
    x0, y0, x1, y1 = box
    m = cv2.morphologyEx(FG[y0:y1, x0:x1].copy(), cv2.MORPH_CLOSE, np.ones((close, close), np.uint8))
    cnts, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    big = max(cv2.contourArea(c) for c in cnts)
    keep = np.zeros_like(m); cv2.drawContours(keep, [c for c in cnts if cv2.contourArea(c) > max(120, big * frac)], -1, 255, -1)
    if not fill: keep = cv2.bitwise_and(keep, m)
    a = cv2.GaussianBlur(keep, (3, 3), 0)
    out = cv2.cvtColor(im[y0:y1, x0:x1], cv2.COLOR_BGR2BGRA); out[..., 3] = a
    ys, xs = np.where(a > 20)
    cv2.imwrite(f'{A}/{name}.png', out[ys.min():ys.max() + 1, xs.min():xs.max() + 1])


SHEETS = {
    'season_items2': [('sea_fan', (45, 50, 440, 445)), ('sea_sam', (440, 245, 630, 640)), ('sea_leaf1', (670, 160, 805, 400)),
                      ('sea_leaf2', (805, 270, 1030, 505)), ('sea_leaf3', (712, 436, 856, 572)), ('st_paperfan', (922, 72, 1235, 288)),
                      ('st_autumn', (1020, 410, 1202, 626))],
    'holiday_items': [('hl_card', (55, 38, 296, 340)), ('hl_choco', (314, 50, 687, 350)), ('hl_bouquet', (725, 28, 1035, 386)),
                      ('hl_tag', (1039, 61, 1213, 315)), ('hl_carnation', (31, 357, 318, 669)), ('hl_pumpkin', (346, 424, 527, 648)),
                      ('hl_pumpkin_lit', (530, 424, 712, 648)), ('hl_candy', (730, 424, 895, 648)), ('hl_cat_sleep', (899, 384, 1100, 662)),
                      ('hl_cat_sit', (1100, 384, 1248, 662))],
    'plants4': [('portulaca2', (40, 43, 335, 365)), ('portulaca1', (350, 43, 641, 365)), ('mimosa2', (60, 387, 345, 669)),
                ('mimosa_fold', (350, 387, 641, 669)), ('bpea2', (666, 74, 946, 669)), ('jasmine2', (947, 212, 1244, 670))],
    'teas': [('tea_bpea', (74, 50, 457, 366)), ('tea_lime', (538, 127, 743, 278)), ('tea_jasmine', (841, 50, 1224, 366)),
             ('tea_honey', (115, 380, 380, 639)), ('tea_dry', (456, 348, 856, 656)), ('tea_bag', (924, 402, 1167, 630))],
    'pressed4': [('pf_portulaca', (44, 186, 327, 539)), ('pf_bpea', (348, 203, 612, 540)), ('pf_mimosa', (604, 184, 961, 535)),
                 ('pf_jasmine', (964, 243, 1235, 529))],
    'seeds4': [('seed_portulaca', (92, 50, 315, 323)), ('seed_bpea', (391, 50, 611, 325)), ('seed_mimosa', (693, 55, 901, 318)),
               ('seed_jasmine', (991, 55, 1198, 318)), ('portulaca0', (125, 404, 294, 669)), ('bpea0', (391, 365, 611, 670)),
               ('mimosa0', (653, 363, 963, 669)), ('jasmine0', (1008, 372, 1224, 670))],
}
FILL_OFF = {'mimosa_fold', 'portulaca2', 'portulaca1', 'sea_leaf1', 'sea_leaf2', 'sea_leaf3', 'st_paperfan', 'st_autumn', 'mimosa0', 'mimosa1', 'mimosa2', 'pf_mimosa', 'pf_bpea',
            'pf_portulaca', 'pf_jasmine', 'bpea0', 'bpea2', 'tea_bag'}
for f, items in SHEETS.items():
    im, FG = load(f)
    for name, box in items: save(im, FG, name, box, close=5 if name in FILL_OFF else 7, fill=name not in FILL_OFF)
# the middle (bud) stage of butterfly pea, mimosa and jasmine comes from Vi's 28/11 sheet: work/cut_buds3.py
print('ok')
# autumn gift picture: the three leaves together
from PIL import Image
L = [Image.open(f'{A}/sea_leaf{i}.png') for i in (1, 2, 3)]
for im in L: im.thumbnail((230, 230))
c = Image.new('RGBA', (520, 300), (0, 0, 0, 0))
c.alpha_composite(L[0].rotate(18, expand=True), (0, 20)); c.alpha_composite(L[2].rotate(-10, expand=True), (300, 120)); c.alpha_composite(L[1].rotate(-8, expand=True), (150, 0))
c.crop(c.getbbox()).save(f'{A}/sea_leaves.png')
