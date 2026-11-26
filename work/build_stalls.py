"""Florist stall stages (Vi 26/11): wilted (empty stall + drooping sunflower), mid (empty stall + a few fresh pots from Vi's plant
drawings), full (Vi's stall_full), lit (stall_full + warm evening glow + Vi's lantern hanging under the roof)."""
import sys
from PIL import Image, ImageFilter, ImageChops
G = sys.argv[1] if len(sys.argv) > 1 else '.'
A = lambda n: Image.open(f'{G}/assets/{n}.png').convert('RGBA')
def put(base, im, h, cx, bottom):
    im = im.resize((round(im.width * h / im.height), h), Image.LANCZOS)
    base.alpha_composite(im, (round(cx - im.width / 2), round(bottom - h)))
COUNTER = 197          # top of the counter in stall_empty (asset px)
# wilted: the sunflower leaning on the empty counter
e = A('stall_empty'); put(e, A('wilted'), 120, 120, COUNTER + 6); e.save(f'{G}/assets/stall_wilt.png')
# mid: three fresh pots on the counter
e = A('stall_empty')
for n, h, cx in [('pothos2', 88, 95), ('daisy2', 96, 172), ('lavender2', 104, 245)]: put(e, A(n), h, cx, COUNTER + 8)
e.save(f'{G}/assets/stall_mid.png')
# lit: warm glow on the full stall + lantern under the roof
f = A('stall_full'); W, H = f.size
glow = Image.new('RGBA', f.size, (0, 0, 0, 0)); g = Image.new('L', f.size, 0)
from PIL import ImageDraw
ImageDraw.Draw(g).ellipse([W * .12, H * .18, W * .88, H * .95], fill=150); g = g.filter(ImageFilter.GaussianBlur(45))
warm = Image.new('RGB', f.size, (255, 196, 110))
orig = f.convert('RGB')
dark = ImageChops.multiply(orig, Image.new('RGB', f.size, (120, 118, 160)))        # evening
warmlit = ImageChops.multiply(orig, Image.new('RGB', f.size, (255, 232, 190)))      # under the lamp
lit = Image.composite(warmlit, dark, g.point(lambda v: min(255, v * 1.7)))
halo = Image.new('L', f.size, 0); ImageDraw.Draw(halo).ellipse([212 - 70, 92 - 30, 212 + 70, 92 + 110], fill=110); halo = halo.filter(ImageFilter.GaussianBlur(30))
lit = ImageChops.add(lit, Image.composite(Image.new('RGB', f.size, (120, 80, 20)), Image.new('RGB', f.size, (0, 0, 0)), halo))
out = Image.merge('RGBA', (*lit.split(), f.getchannel('A')))
lan = A('lantern_on'); lw = 92; lan = lan.resize((lw, round(lan.height * lw / lan.width)), Image.LANCZOS)
ImageDraw.Draw(out).line([(212, 78), (212, 92)], fill=(70, 50, 40, 255), width=2)
out.alpha_composite(lan, (212 - lw // 2, 92)); out.save(f'{G}/assets/stall_lit.png')
print('ok')
