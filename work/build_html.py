import base64, json, sys
import numpy as np
G = sys.argv[1]
def uri(path, mime):
    return f'data:{mime};base64,' + base64.b64encode(open(path, 'rb').read()).decode()
t = open(f'{G}/src/index.template.html', encoding='utf-8').read()
L = json.load(open(f'{G}/work/out/layout.json'))
# Vi's room (build_room3.py): the desk is 20 units higher than in the first painting
for k in ['lamp', 'radio', 'incense']: L['boxes'][k][1] -= 20
from PIL import Image
# visitors: centre x, bottom y, height in scene units
VIS = {'plane': (640, 914, 58), 'squirrel': (296, 899, 118), 'frog': (248, 904, 80), 'owl': (574, 166, 138), 'sparrow': (292, 1008, 74)}
vis = {}
for n, (cx, bottom, h) in VIS.items():
    iw, ih = Image.open(f'{G}/assets/{n}.png').size; w = h * iw / ih
    vis[n] = [round(cx - w / 2, 1), bottom - h, round(w, 1), h]
t = t.replace('{{LAYOUT}}', json.dumps({'W': L.get('W', 714), 'H': L.get('H', 1280), 'boxes': L['boxes'], 'visitors': vis}))
t = t.replace('{{SKY_MASK}}', uri(f'{G}/work/out/sky_mask.png', 'image/png'))
sm = np.array(Image.open(f'{G}/work/out/stars_mask.png'))[..., 3]
ys, xs = np.where(sm > 200); rng = np.random.default_rng(7); pick = rng.choice(len(xs), 110, replace=False)
t = t.replace('{{STAR_PTS}}', json.dumps([[int(xs[i]), int(ys[i])] for i in pick]))
t = t.replace('{{ROOM_MASK}}', uri(f'{G}/work/out/room_mask.png', 'image/png'))
for w in ['sunset', 'rain', 'night']:
    t = t.replace('{{SCENE_%s}}' % w, uri(f'{G}/work/out/scene_{w}.webp', 'image/webp'))
import io
def prop_uri(p, display_h):
    im = Image.open(f'{G}/assets/{p}.png')
    target = round(display_h * 1.6)          # ~1.6x the scene size is sharp on phones
    if im.height > target: im = im.resize((round(im.width * target / im.height), target), Image.LANCZOS)
    buf = io.BytesIO(); im.save(buf, 'WEBP', quality=88, method=6)
    return 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode()
heights = {k: v[3] for k, v in L['boxes'].items() if k != 'plant'}; heights.update({k: v[3] for k, v in vis.items()})
# growing plants: all 9 drawings at one scale, the pot centred where the painted pot was
PS, POT_CX, POT_BOTTOM = 0.73, 180, 898
plant_img = {}
PSK = {'fern': PS * 110 / 102}           # Vi's fern sheet has a smaller pot
for kind in ['daisy', 'lavender', 'cactus', 'fern']:
    PS = PSK.get(kind, 0.73)
    for st in range(3):
        n = f'{kind}{st}'; im = Image.open(f'{G}/assets/{n}.png'); a = np.array(im)[:, :, 3] > 40
        rows = np.where(a.any(1))[0]; band = a[rows[-1] - 40:rows[-1] - 10]
        xs = np.where(band.any(0))[0]; pcx = (xs.min() + xs.max()) / 2
        w, h = im.width * PS, im.height * PS
        box = [round(POT_CX - pcx * PS, 1), round(POT_BOTTOM - h, 1), round(w, 1), round(h, 1)]
        plant_img[n] = {'src': prop_uri(n, h), 'box': box}
ITEMS = {k: 60 for k in ['musicbox', 'watch', 'card', 'k_leaf', 'k_daisy', 'k_lavender', 'k_cactus', 'k_tube', 'k_marble', 'k_clip', 'fern2']}
ITEMS.update({'alley': 94, 'painting': 90, 'old_window': 170, 'na_cat': 160, 'na_friends': 160, 'na_window': 160})
t = t.replace('{{ITEM_IMG}}', json.dumps({k: prop_uri(k, h) for k, h in ITEMS.items()}))
t = t.replace('{{PLANT_IMG}}', json.dumps(plant_img)).replace('{{SPEED}}', '60')
heights.update({'cookies': 50, 'tea': 77.5, 'cat_sleep': 143, 'cat_sit': 210, 'cat_look': 172, 'plate': 54, 'cat_eat': 188, 'cat_play': 194, 'w_sunset': 68, 'w_rain': 68, 'w_night': 68, 'snd_on': 50, 'snd_off': 50, 'na_note': 40, 'painting': 90, 'candle_on': 100, 'candle_off': 80, 'chime_bamboo': 292, 'chime_shell': 292})
for p, h in heights.items():
    t = t.replace('{{PROP_%s}}' % p, prop_uri(p, h))
ic = Image.open(f'{G}/assets/icon.png').resize((192, 192), Image.LANCZOS); buf = io.BytesIO(); ic.save(buf, 'PNG', optimize=True)
t = t.replace('{{ICON}}', 'data:image/png;base64,' + base64.b64encode(buf.getvalue()).decode())
cv = Image.open(f'{G}/assets/cover.jpg'); buf = io.BytesIO(); cv.save(buf, 'WEBP', quality=86)
t = t.replace('{{COVER}}', 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode())
assert '{{' not in t, t[t.index('{{'):t.index('{{') + 40]
open(f'{G}/index.html', 'w', encoding='utf-8').write(t)
print('index.html', len(t) // 1024, 'KB')
