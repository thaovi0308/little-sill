# Vi 27/11 (src/vi_1127/spring_alley.jpg, two panels day | night): spring alley views for the window, cut to the window
# aspect 556:766 around the alley and scaled to 810x1116 like the Tết / Christmas views. The ✦ mark (bottom right of the
# night panel) is inpainted away.
import sys
import cv2, numpy as np
G = sys.argv[1] if len(sys.argv) > 1 else '.'
im = cv2.imread(f'{G}/src/vi_1127/spring_alley.jpg')
m = np.zeros(im.shape[:2], np.uint8); cv2.circle(m, (1222, 663), 22, 255, -1)
im = cv2.inpaint(im, m, 9, cv2.INPAINT_TELEA)
y0, y1 = 27, 688; w = round((y1 - y0) * 556 / 766)
for name, cx in (('sunset', 382), ('night', 1004)):
    x0 = cx - w // 2; crop = im[y0:y1, x0:x0 + w]
    cv2.imwrite(f'{G}/src/view_spring_{name}.jpg', cv2.resize(crop, (810, 1116), interpolation=cv2.INTER_CUBIC), [cv2.IMWRITE_JPEG_QUALITY, 92])
    print(name, x0, x0 + w)
