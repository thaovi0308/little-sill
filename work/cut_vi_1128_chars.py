# Vi's sheets 28/11 (src/vi_1128/): landlady's son (son_items), shipper Tín (tin_items), bánh mì grandma (banhmi_items), soft touch effects (fx_items).
import sys
import cv2, numpy as np
G = sys.argv[1] if len(sys.argv) > 1 else '.'
A = f'{G}/assets'
SHEETS = {
    'son_items': [('son_smile', (290, 20, 580, 360)), ('son_shy', (690, 30, 1040, 360)), ('oil_lamp', (130, 345, 320, 698)),
                  ('oil_lamp_on', (540, 345, 790, 698), 'soft'), ('st_train', (945, 390, 1210, 650), 'ink')],
    'tin_items': [('tin_sad', (40, 30, 385, 410)), ('tin_smile', (405, 30, 755, 410)), ('tin_bike', (835, 35, 1230, 405)),
                  ('tin_receipt', (80, 435, 315, 650)), ('tin_keychain', (360, 425, 645, 655)), ('painting_tin', (700, 420, 945, 665)),
                  ('st_wheel', (975, 445, 1245, 645), 'ink')],
    'banhmi_items': [('bm_lady_work', (60, 35, 375, 415)), ('bm_lady_smile', (425, 35, 745, 415)), ('bm_cart', (835, 35, 1195, 430)),
                     ('banhmi', (75, 420, 375, 680), 'soft'), ('bm_tongs', (415, 465, 675, 615), 'hull'), ('painting_banhmi', (700, 420, 945, 665)),
                     ('st_bread', (1000, 445, 1215, 655), 'ink')],
    'fx_items': [('fx_steam', (90, 130, 280, 530), 'soft'), ('fx_drop', (325, 245, 475, 435)), ('fx_heart', (535, 255, 735, 430)),
                 ('fx_sparkle', (770, 250, 950, 430), 'soft'), ('fx_petals', (985, 215, 1215, 455))],
}
for sheet, items in SHEETS.items():
    im = cv2.imread(f'{G}/src/vi_1128/{sheet}.jpg')
    g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY); hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
    FG = ((g < 232) | (hsv[..., 1] > 25)).astype(np.uint8) * 255
    SOFT = np.clip((249 - im.min(axis=2).astype(int)) * 5, 0, 255).astype(np.uint8)   # glow/steam: alpha from how far from paper white
    for it in items:
        name, (x0, y0, x1, y1) = it[0], it[1]
        m = FG[y0:y1, x0:x1].copy()
        m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))
        cnts, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        big = max(cv2.contourArea(c) for c in cnts)
        keep = np.zeros_like(m); cv2.drawContours(keep, [c for c in cnts if cv2.contourArea(c) > big * 0.03], -1, 255, -1)
        mode = it[2] if len(it) > 2 else ''
        if mode == 'hull':   # plate rim is faint: fill the convex hull of everything drawn
            cv2.ellipse(keep, (128, 92), (122, 54), -3, 0, 360, 255, -1)   # plate rim is faint: fill the plate oval, tongs keep their own shape
        if mode == 'ink':    # rubber stamp: only the ink, the paper inside the ring stays see-through
            ink = np.clip((235 - g[y0:y1, x0:x1].astype(int)) * 4, 0, 255).astype(np.uint8)
            ink = np.maximum(ink, np.clip((hsv[y0:y1, x0:x1, 1].astype(int) - 25) * 4, 0, 255).astype(np.uint8))
            keep = np.minimum(keep, ink)
        if mode == 'soft':   # soft: the solid object stays opaque, its halo fades with the paper
            core = cv2.erode(keep, np.ones((3, 3), np.uint8)) & (((g[y0:y1, x0:x1] < 215) | (hsv[y0:y1, x0:x1, 1] > 70)).astype(np.uint8) * 255)
            keep = np.maximum(cv2.GaussianBlur(SOFT[y0:y1, x0:x1], (5, 5), 0), core)
        else:
            keep = cv2.GaussianBlur(keep, (3, 3), 0)
        out = cv2.cvtColor(im[y0:y1, x0:x1], cv2.COLOR_BGR2BGRA); out[..., 3] = keep
        ys, xs = np.where(keep > 20)
        out = out[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
        cv2.imwrite(f'{A}/{name}.png', out); print(name, out.shape[1], out.shape[0])
