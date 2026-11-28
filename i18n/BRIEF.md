# Little Sill — English translation brief (approved by Vi, 28/11/2026)

Game: "Bên Khung Cửa Nhỏ / Little Sill — By the Little Window", a cozy healing game. The player has moved into a small attic room
in an alley; they only sit by the window: water plants, make tea, feed the cat, light candles, play the radio, write a journal.
Neighbours, each carrying a quiet sadness, send letters; the player's small kindness heals the whole lane.

## Tone (Vi approved)
Warm, slow, gentle, natural English like Western cozy games (A Short Hike, Spiritfarer, Unpacking). Short sentences.
Translate the meaning, not word by word. Never stiff or literal. Not over-flowery either. Keep emojis exactly.

## Glossary (Vi approved — use consistently)
- Bên Khung Cửa Nhỏ → Little Sill (subtitle "By the Little Window")
- Hẻm Hoa Giấy / con hẻm hoa giấy → Bougainvillea Lane / the lane ; hoa giấy → bougainvillea
- căn gác → the attic (room)
- mèo Bánh Quy → Biscuit (the cat)
- Bà chủ nhà (tầng dưới) → Bà Lan, your landlady (first mention), then "Bà Lan". In her own lines she calls herself "I" / signs "— Bà Lan".
- Bác sửa đồng hồ (bên kia đường) → the old clockmaker (across the lane); signature "— The Clockmaker". He calls the player "dear".
- Cậu họa sĩ (tầng trên) → the young painter (upstairs)
- Bé Na → little Na (keep "Na")
- Chị (Thảo) bán hoa / chị chủ tiệm hoa đầu hẻm → Thảo, the florist at the corner / the florist
- Minh (người bạn phương xa) → Minh, the faraway friend
- Ông Khải (tiệm sách) → Mr. Khải (the old bookshop)
- Cô Hạnh → Ms. Hạnh (retired piano teacher)
- Chú đưa thư → the postman ; chim sẻ → the sparrow ; Ếch Cốm → Cốm the frog ; Cú Mèo → the owl ; sóc → the squirrel
- DJ "Tần Số Hẻm Hoa Giấy" → "Bougainvillea Lane Frequency"
- Kinship pronouns (cháu/bác/bà/chị–em/con): English has none — use "you", "dear", "little one", first names. Never "grandchild"/"nephew".
- Festivals: keep the Vietnamese name, explain on first mention in a letter:
  Tết (Lunar New Year) · Trung Thu (Mid-Autumn Festival) · Vu Lan (the Vu Lan festival of gratitude to parents) ·
  Thất Tịch (The Magpie Bridge) — NEVER write "Qixi" · Giáng Sinh → Christmas · lì xì → lì xì (red lucky envelope) ·
  mai vàng → yellow apricot blossom (mai) · câu đối → Tết couplets · đèn kéo quân → a spinning lantern · hoa đăng → floating lanterns
- Vietnamese foods: keep the name + short description the first time, e.g. "chè đậu xanh — sweet mung bean soup", "bánh mì", "xôi gấc — red sticky rice".
- Holidays 14/2 → Valentine's Day, 8/3 → International Women's Day, 20/10 → Vietnamese Women's Day, 20/11 → Teachers' Day (Vietnam).
- Seasons Xuân/Hạ/Thu/Đông → Spring/Summer/Autumn/Winter. Weather buttons: Chiều nắng → Sunny afternoon, Mưa → Rain, Đêm → Night.
- Sổ tay → journal ; Sổ Lời nhắn → Letters (book of letters) ; Hộp kỷ vật → Keepsake box ; con dấu → stamp ; hoa ép → pressed flower ;
  bookmark → bookmark ; Góc thủ công → Craft corner ; Góc bếp → Little kitchen ; Trang trí → Decorate ; Việc nhỏ hôm nay → Small things for today

## Approved sample (match this voice)
- "Hello there, young neighbour. Thank you for the music last night. This little music box has had a stuck gear since last winter. Would you keep it for me a few days, so it won't feel so lonely? Once I find a tiny spring, I'll send it over and finish the repair."
- "The tune from the music box drifting over reminded me of evenings long ago, when my wife and I sat knitting by the window. Thank you for waking up that old sound, dear. Here is an old record I just mended with my own hands. It's yours now!"
- "Last night the storm took the power and the whole lane went dark. But your window was still glowing, and my heart settled at once. I'm sending you my old pocket watch. Its hands always point to "the loveliest hour of the day.""
- UI: "Open the little window" · "Headphones recommended, for the rain 🎧" · "Tap things to interact ✨"

## HARD technical rules (the strings are JavaScript literals / HTML pasted back into code)
1. Keep every `${...}` placeholder EXACTLY as is (same text inside), in a sensible place in the English sentence.
2. Keep every HTML tag and attribute exactly (`<b>`, `<p class="x">`, `<img src="${...}">`, `<br>`, ids, classes). Translate only the human text,
   including text inside `alt=`/`title=`/`placeholder=`/`aria-label=` attributes if it is Vietnamese.
3. Use typographic apostrophes and quotes ONLY: ’ (not '), “ ” (not "). Never output a plain ' " or ` character that was not in the source.
4. Keep escapes like `\n`, `\'`, `\"` exactly as in the source; keep leading/trailing spaces and punctuation like " · ", "…", ": ".
5. Some strings are fragments joined in code (e.g. "Chương " + n, a name, a verb phrase). Translate the fragment so the joined result reads well;
   look at the source line (file + line given) when unsure. Short labels stay short (buttons must fit on a phone).
6. A string that is not really Vietnamese text (an id, a CSS value, a regex, a font name) → return it UNCHANGED.
7. Vietnamese words that are names/places/foods per the glossary stay Vietnamese with diacritics.

## Character voices (Vi, 28/11 — follow these)
- The young painter upstairs: casual, modern, relieved after pressure; short natural sentences like two young friends texting.
  e.g. "My deadline is tomorrow and my mind is completely blank. Everything I draw feels forced and suffocating..."
  / "This time, I drew the person who kept that little window peaceful. Thank you, my quiet friend."
- Little Na downstairs: clear, innocent, simple words like a primary-school kid's scribbled note. Biscuit is "he/him".
  e.g. "My name is Na. Biscuit likes to sneak up to the attic. If you see him, please feed him—don't chase him away, poor thing."
- Thảo, the florist at the corner: gentle, warm, caring, like the big sister of the neighbourhood.
  e.g. "Hello there, new neighbour! I run the flower shop at the corner of the lane. Business has been slow lately, and my potted flowers are drooping too..."
- The old clockmaker: slow, tender, old-fashioned warmth (see the approved sample above).
- Minh, the faraway friend: nostalgic, dreamy, like lines scribbled on the back of a travel postcard.
  e.g. "Hello, dear friend! I was so happy to hear you moved into the little attic on Bougainvillea Lane. I'm standing at an old seaside train station right now, with a cool breeze blowing in."
  / "The further I travel, the more I realize everyone needs a light to guide them home. To me, your flower-filled window is just like that lighthouse."
- Mr. Khải (used bookstore): calm, gently witty, cherishing old memories.
  e.g. "At my shop, anyone who helps tidy a shelf gets to borrow a book. My late wife made that rule years ago."
  / "I've kept this tucked in a drawer for a long time. It's my wife's pressed-flower album—there are still a few blank pages at the back. I think you'll fill them in far more beautifully than I ever could."
- Ms. Hạnh across the lane: unhurried, soft, poetic, with a retired teacher's humility.
  e.g. "I've recently retired, and my hearing has been fading. I was afraid of playing out of tempo and bothering the neighbours, so I stopped opening the piano lid. I never knew someone across the lane was waiting to listen."
  / "Thank you for being my very first listener."
