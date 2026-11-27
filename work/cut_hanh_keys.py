# Vi 27/11 (src/vi_1127/hanh_keys.jpg): keyboard seen from above. The duet uses 8 white keys C..C: the first 8 keys of the
# top strip (separators at x 81..527, top edge y 62, bottom y 329). The C#5 black key straddling the right edge is inpainted
# away so the strip ends on a clean white key.
import sys
import cv2, numpy as np
G = sys.argv[1] if len(sys.argv) > 1 else '.'
im = cv2.imread(f'{G}/src/vi_1127/hanh_keys.jpg')
g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
fixed = im.copy()
# key 8 (C5) spans x 472..526; its left half has no black key, so mirror it over the right half where C#5 sits
L = fixed[62:330, 473:499].copy(); fixed[62:330, 500:526] = L[:, ::-1]
fixed[62:330, 499:500] = fixed[62:330, 498:499]
out = cv2.cvtColor(fixed[61:331, 79:528], cv2.COLOR_BGR2BGRA)
cv2.line(out, (out.shape[1] - 2, 0), (out.shape[1] - 2, out.shape[0]), (40, 50, 70, 255), 2)   # redraw the right outline
cv2.imwrite(f'{G}/assets/hanh_keys.png', out); print('hanh_keys', out.shape[1], out.shape[0])
