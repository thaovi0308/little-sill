# Pressed sprigs for the bookmark corner (Vi 26/11): cut from Vi's grown-plant drawings, above the pot
import sys
from PIL import Image
G = sys.argv[1] if len(sys.argv) > 1 else '.'
CUTS = {'bm_fern': ('fern2', (0, 0, 262, 150)), 'bm_lavender': ('lavender2', (86, 0, 156, 222)), 'bm_pothos': ('pothos2', (0, 0, 259, 112))}
for out, (src, box) in CUTS.items():
    im = Image.open(f'{G}/assets/{src}.png').convert('RGBA').crop(box)
    import numpy as np
    a = np.array(im).astype(int); r, g, b = a[..., 0], a[..., 1], a[..., 2]
    a[(r > 140) & (r - b > 50) & (r > g + 25), 3] = 0          # drop the terracotta pot rim
    im = Image.fromarray(a.astype('uint8'), 'RGBA')
    im = im.crop(im.getchannel('A').point(lambda v: 255 if v > 30 else 0).getbbox())
    im.save(f'{G}/assets/{out}.png'); print(out, im.size)
