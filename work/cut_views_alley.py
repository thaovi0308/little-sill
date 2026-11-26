"""Window views = Vi's bougainvillea alley: rain/night panels of src/alley_rain_night.jpg,
sunset = the inside of the framed alley painting in src/decor.jpg. Each crop is cut to the
window opening's aspect (556 wide, 766 tall above y=906) so build_room3 fills it exactly."""
import sys
from PIL import Image
G = sys.argv[1]
def cut(src, x0, x1, y0, out):
    h = round((x1 - x0) * 766 / 556)
    Image.open(src).convert('RGB').crop((x0, y0, x1, y0 + h)).save(f'{G}/src/{out}', quality=95); print(out, x1 - x0, h)
cut(f'{G}/src/alley_rain_night.jpg', 38, 430, 300, 'view_rain.jpg')
cut(f'{G}/src/alley_rain_night.jpg', 468, 860, 300, 'view_night.jpg')
cut(f'{G}/src/decor.jpg', 268, 630, 640, 'view_sunset.jpg')
