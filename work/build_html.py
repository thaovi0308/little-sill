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
import io
import os, hashlib, glob
# Big pictures only needed later (shop, map, Tết views, paper pictures) go to img/ as files: the page opens
# faster and the browser caches them (Vi's plan 27/11: lighter file). Name = content hash, so a new picture
# never hits an old cache. Small icons stay inline.
IMG = f'{G}/img'; os.makedirs(IMG, exist_ok=True); used = set()
SPLIT_KB = 40
def as_file(data_uri, name):
    head, b64 = data_uri.split(',', 1)
    if len(b64) < SPLIT_KB * 1024: return data_uri
    raw = base64.b64decode(b64); ext = 'webp' if 'webp' in head else 'png'
    fn = f'{name}.{hashlib.md5(raw).hexdigest()[:8]}.{ext}'; used.add(fn)
    if not os.path.exists(f'{IMG}/{fn}'): open(f'{IMG}/{fn}', 'wb').write(raw)
    return f'img/{fn}'
for w in ['sunset', 'rain', 'night', 'tet_sunset', 'tet_rain', 'tet_night', 'xmas_sunset', 'xmas_rain', 'xmas_night', 'vulan_night', 'qx_sunset', 'qx_rain', 'qx_night', 'spring_sunset', 'spring_rain', 'spring_night', 'winter_sunset', 'winter_rain', 'winter_night', 'autumn_sunset', 'autumn_rain', 'autumn_night', 'summer_sunset', 'summer_rain', 'summer_night', 'alllit_night']:
    u = uri(f'{G}/work/out/scene_{w}.webp', 'image/webp')
    t = t.replace('{{SCENE_%s}}' % w, as_file(u, 'scene_' + w) if w.startswith(('alllit', 'tet', 'xmas', 'vulan', 'qx', 'spring', 'winter', 'autumn', 'summer')) else u)
CACHE = f'{G}/work/out/uri_cache'; os.makedirs(CACHE, exist_ok=True)
def prop_uri(p, display_h, soft=False):
    st = os.stat(f'{G}/assets/{p}.png')
    key = hashlib.md5(f'{p}|{st.st_mtime_ns}|{st.st_size}|{display_h}|{soft}'.encode()).hexdigest()
    cf = f'{CACHE}/{key}.txt'
    if os.path.exists(cf): return open(cf).read()
    r = _prop_uri(p, display_h, soft); open(cf, 'w').write(r); return r
def _prop_uri(p, display_h, soft=False):
    im = Image.open(f'{G}/assets/{p}.png')
    if soft and im.mode == 'RGBA':           # hard cut-out edges look jagged when the paper shows them big: feather the alpha a little
        from PIL import ImageFilter
        al = im.getchannel('A').filter(ImageFilter.GaussianBlur(0.9)); im.putalpha(al)
    target = round(display_h * 1.6)          # ~1.6x the scene size is sharp on phones
    if im.height > target: im = im.resize((round(im.width * target / im.height), target), Image.LANCZOS)
    buf = io.BytesIO(); im.save(buf, 'WEBP', quality=88, method=6)
    return 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode()
heights = {k: v[3] for k, v in L['boxes'].items() if k != 'plant'}; heights.update({k: v[3] for k, v in vis.items()})
# growing plants: all 9 drawings at one scale, the pot centred where the painted pot was
PS, POT_CX, POT_BOTTOM = 0.73, 180, 898
plant_img = {}
PSK = {'fern': PS * 110 / 102, 'pothos': 0.62}           # Vi's fern sheet has a smaller pot
for kind in ['daisy', 'lavender', 'cactus', 'fern', 'pothos', 'forget', 'hydrangea', 'clover', 'portulaca', 'bpea', 'mimosa', 'jasmine', 'empty']:
    PS = PSK.get(kind, 0.73)
    for n in [f'{kind}{st}' for st in range(1 if kind == 'empty' else 3)] + (['mimosa_fold'] if kind == 'mimosa' else []):   # Vi's mimosa with folded leaves
        im = Image.open(f'{G}/assets/{n}.png'); a = np.array(im)[:, :, 3] > 40
        rows = np.where(a.any(1))[0]; band = a[rows[-1] - 40:rows[-1] - 10]
        xs = np.where(band.any(0))[0]; pcx = (xs.min() + xs.max()) / 2
        if kind in ('forget', 'hydrangea', 'clover', 'portulaca', 'bpea', 'mimosa', 'jasmine'): PS = 0.73 * 110 / (xs.max() - xs.min())   # Vi's 26/11 sheets: same pot size as the daisy
        w, h = im.width * PS, im.height * PS
        box = [round(POT_CX - pcx * PS, 1), round(POT_BOTTOM - h, 1), round(w, 1), round(h, 1)]
        plant_img[n] = {'src': prop_uri(n, h), 'box': box}
ITEMS = {k: 60 for k in ['musicbox', 'watch', 'card', 'k_leaf', 'k_daisy', 'k_lavender', 'k_cactus', 'k_tube', 'k_marble', 'k_clip', 'fern2', 'pothos2', 'k_spring', 'k_record', 'k_feather', 'k_button', 'k_shell', 'k_candy', 'bm_fern', 'bm_lavender', 'bm_pothos', 'seed_daisy', 'seed_lavender', 'seed_cactus', 'seed_pothos', 'pf_daisy', 'pf_lavender', 'pf_fern', 'pf_maple', 'pf_clover', 'st_paw', 'st_moon', 'st_watch', 'rb_twine', 'rb_blue', 'seed_forget', 'seed_hydrangea', 'seed_clover', 'cassette', 'compass', 'lighthouse', 'badge_plane', 'badge_mailbox', 'badge_shop', 'butterfly', 'mai_pot', 'tet_tray']}
ITEMS['mai_pot'] = 120; ITEMS['tet_tray'] = 140
ITEMS.update({'xmas_tree': 200, 'xmas_tree_lit': 206, 'orn_bow': 70, 'orn_ball': 70, 'orn_bell': 70, 'orn_cane': 70, 'orn_star': 70, 'orn_lights': 70, 'xmas_hat': 80, 'cocoa': 160, 'cocoa_top': 200, 'xmas_card': 1340, 'cat_sleep_hat': 205, 'cat_sit_hat': 237, 'rose_red': 150, 'rose_white': 150, 'vl_basin_empty': 300, 'vl_herb': 240, 'st_lotus': 70, 'landlady_sit': 520, 'hoadang_off': 140, 'hoadang_on': 140, 'red_thread': 200, 'magpie1': 130, 'magpie2': 130, 'tt_envelope': 90, 'tt_letter': 120, 'chedaudo': 120, 'st_magpie': 70, 'st_xmas_snow': 60, 'st_xmas_bell': 60})
ITEMS.update({'seedbag': 80, 'wilted': 100, 'scroll': 80, 'alley_lit': 260, 'stall_empty': 110, 'stall_full': 130, 'stall_wilt': 110, 'stall_mid': 110, 'stall_lit': 130, 'stamp_paw': 60, 'stamp_leaf': 60, 'stamp_moon': 60, 'can': 70, 'bouquet': 90, 'chime_flower': 292, 'mooncake': 90, 'basket': 120, 'keys': 90, 'bag': 90, 'landlady': 180, 'florist': 180, 'rabbit': 130, 'dj': 120, 'alley': 94, 'painting': 90, 'old_window': 170, 'na_cat': 160, 'na_friends': 160, 'na_window': 160, 'pc_station': 200, 'pc_pine': 200, 'pc_lighthouse': 200, 'pc_alley': 200, 'mailbox2': 200, 'shop_bg': 1280, 'shop_front': 410, 'stairs_scene': 600, 'alley_map': 1100, 'badge_home': 40, 'shop_wilt1': 90, 'shop_wilt2': 90, 'shop_leafy': 90, 'shop_succ': 90, 'fert_bag': 150, 'pf_forget': 80, 'pf_hydrangea': 80, 'minh_bag': 110, 'cup2': 49, 'mai_bud': 117, 'tet_couplet_l': 79, 'tet_couplet_r': 79, 'tet_couplet': 200, 'tet_lixi': 120, 'landlady_tet': 2000, 'st_tet_watch': 60, 'st_tet_brush': 60, 'st_tet_cat': 60, 'st_tet_mai': 60, 'firefly': 120, 'postman': 320, 'envelope_odd': 110, 'cu_linen_l': 640, 'cu_linen_r': 640, 'cu_lace_l': 640, 'cu_lace_r': 640, 'cu_floral_l': 640, 'cu_floral_r': 640, 'ga_bulbs': 120, 'ga_bulbs_on': 124, 'ga_bunting': 124, 'ga_cranes': 191, 'cat_sleep_bow': 135, 'cat_sit_bow': 239, 'cat_sleep_scarf': 134, 'cat_sit_scarf': 221, 'cat_sit_bell': 210, 'acc_bow': 70, 'acc_scarf': 70, 'acc_bell': 70, 'album_cover': 300, 'sea_fan': 160, 'sea_sam': 160, 'sea_leaves': 160, 'st_paperfan': 110, 'st_autumn': 110, 'seed_portulaca': 120, 'seed_bpea': 120, 'seed_mimosa': 120, 'seed_jasmine': 120, 'pf_portulaca': 120, 'pf_bpea': 120, 'pf_mimosa': 120, 'pf_jasmine': 120, 'tea_bpea': 140, 'tea_lime': 140, 'tea_jasmine': 140, 'tea_honey': 140, 'tea_dry': 140, 'tea_bag': 140, 'hl_card': 140, 'hl_choco': 140, 'hl_bouquet': 140, 'hl_tag': 140, 'hl_carnation': 140, 'hl_pumpkin': 140, 'hl_pumpkin_lit': 140, 'hl_candy': 140, 'hl_cat_sleep': 140, 'hl_cat_sit': 140, 'sea_scarf': 300, 'sea_ginger': 200, 'st_ginger': 180, 'sea_seeds': 220, 'st_swallow': 180, 'hanh_keys': 200, 'kit_fan': 120, 'cat_sleep_bell': 170, 'hanh_metronome': 160, 'hanh_boat': 120, 'hanh_env': 120, 'kit_stove': 240, 'kit_chedauxanh': 160, 'kit_flan': 160, 'kit_banhbo': 160, 'kit_troinuoc': 160, 'kit_xoigac': 160, 'kit_banhchuoi': 160, 'hanh_play': 300, 'hanh_smile': 300, 'hanh_badge': 160, 'hanh_room': 360, 'hanh_sheet': 160, 'hanh_clip': 140, 'hanh_musicbox': 160, 'painting_hanh': 90, 'st_treble': 70, 'hanh_metronome_crop': 160, 'album_cover2': 669, 'album_page': 668, 'album_corners': 668, 'album_cover3': 627, 'k_alllit': 300, 'tt_walk': 300, 'hanh_xmas': 300, 'son_frame': 200, 'album_page3': 629, 'album_corners3': 629, 'chime_bell': 330, 'chime_star': 330, 'chime_lantern': 330, 'fx_heart': 40, 'fx_drop': 30, 'fx_sparkle': 40, 'fx_petals': 56, 'fx_ripple1': 40, 'fx_ripple2': 50, 'fx_ripple3': 60, 'sunbeam': 640})
# images shown big inside the paper notes (characters, story pictures): keep the full drawing so phones do not upscale it (Vi 26/11: 'hình vỡ')
ITEMS.update({'bookshop_bg': 1151, 'bookshop_desk': 450, 'khai_read': 494, 'khai_smile': 439, 'bk_pothos': 195, 'bk_catcrate': 120, 'bk_sign': 183, 'bk_magnifier': 68,
    'bk_openbook': 114, 'bk_front': 260, 'bk_card': 120, 'bk_card_gold': 120, 'bk_daisy': 70, 'bk_note': 70, 'bk_album': 110, 'painting_bookshop': 92, 'st_book': 60,
    **{f'book_{c}': 160 for c in ['red', 'orange', 'amber', 'yellow', 'green', 'sage', 'blue', 'brown']}})
PAPER_BIG = ['landlady_sit', 'khai_read', 'khai_smile', 'bk_album', 'bk_card', 'bk_card_gold', 'xmas_tree', 'xmas_tree_lit', 'postman', 'landlady', 'landlady_tet', 'florist', 'rabbit', 'dj', 'wilted', 'stall_full', 'stall_empty', 'stall_wilt', 'stall_mid', 'stall_lit', 'seedbag', 'scroll', 'mooncake', 'bag', 'can', 'bouquet', 'alley_lit', 'basket', 'keys', 'na_cat', 'na_friends', 'na_window', 'old_window', 'pc_station', 'pc_pine', 'pc_lighthouse', 'pc_alley', 'mailbox2']
t = t.replace('/*{{OUTSIDE_JS}}*/', open(f'{G}/src/outside.js', encoding='utf-8').read() + '\n' + open(f'{G}/src/bookshop.js', encoding='utf-8').read() + '\n' + open(f'{G}/src/tet.js', encoding='utf-8').read() + '\n' + open(f'{G}/src/xmas.js', encoding='utf-8').read() + '\n' + open(f'{G}/src/vulan_qx.js', encoding='utf-8').read() + '\n' + open(f'{G}/src/decor.js', encoding='utf-8').read() + '\n' + open(f'{G}/src/extras.js', encoding='utf-8').read() + '\n' + open(f'{G}/src/hanh.js', encoding='utf-8').read() + '\n' + open(f'{G}/src/album.js', encoding='utf-8').read() + '\n' + open(f'{G}/src/kitchen.js', encoding='utf-8').read() + '\n' + open(f'{G}/src/seasons.js', encoding='utf-8').read() + '\n' + open(f'{G}/src/holidays.js', encoding='utf-8').read() + '\n' + open(f'{G}/src/alllit.js', encoding='utf-8').read())
t = t.replace('{{ITEM_IMG}}', json.dumps({k: as_file(prop_uri(k, 2000 if k in PAPER_BIG else h, soft=k in PAPER_BIG), k) for k, h in ITEMS.items()}))
t = t.replace('{{PLANT_IMG}}', json.dumps(plant_img)).replace('{{SPEED}}', '1')
heights.update({'cookies': 50, 'tea': 77.5, 'cat_sleep': 143, 'cat_sit': 210, 'cat_look': 172, 'plate': 54, 'cat_eat': 188, 'cat_play': 194, 'w_sunset': 68, 'w_rain': 68, 'w_night': 68, 'snd_on': 50, 'snd_off': 50, 'na_note': 40, 'painting': 90, 'candle_on': 100, 'candle_off': 80, 'chime_bamboo': 292, 'chime_shell': 292, 'cat_wet': 196, 'towel': 72, 'lantern_on': 64, 'lantern_off': 64, 'tea_top': 300, 'steam_a': 150, 'cat_back2': 200, 'seeds_plate': 59, 'shelf': 68, 'notebook': 380})
for p, h in heights.items():
    t = t.replace('{{PROP_%s}}' % p, prop_uri(p, h))
ic = Image.open(f'{G}/assets/icon.png').resize((192, 192), Image.LANCZOS); buf = io.BytesIO(); ic.save(buf, 'PNG', optimize=True)
t = t.replace('{{ICON}}', 'data:image/png;base64,' + base64.b64encode(buf.getvalue()).decode())
cv = Image.open(f'{G}/assets/cover.jpg'); buf = io.BytesIO(); cv.save(buf, 'WEBP', quality=86)
t = t.replace('{{COVER}}', 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode())
t = t.replace('{{BM_RED}}', prop_uri('bm_red', 160))   # Vi's red-gold paper (sheet 26/11)
for f in glob.glob(f'{IMG}/*'):
    if os.path.basename(f) not in used: os.remove(f)          # pictures of older builds
assert '{{' not in t, t[t.index('{{'):t.index('{{') + 40]
open(f'{G}/index.html', 'w', encoding='utf-8').write(t)
print('index.html', len(t) // 1024, 'KB')
