// ---------------------------------------------------------------- Vi's plan 27/11 (after the 1.0 review)
// 1. backup / restore of the progress   2. first-day guide + "Việc nhỏ hôm nay"   3. postcard to share
// 4. letters after a story ends + collections. Inlined after outside.js / tet.js by build_html.py.

// ---------- daily small things: water a plant, drink a tea, write the notebook
const DAILY = [
  ['water', '💧', 'Tưới chậu cây trên bệ cửa'],
  ['tea', '🍵', 'Pha một tách trà rồi nhấp từng ngụm'],
  ['diary', '📔', 'Viết vài chữ vào sổ tay'],
];
function dailyState() {
  const k = dayKey();
  if (!S.daily || S.daily.day !== k) S.daily = { day: k, done: {} };
  return S.daily;
}
function dailyMark(what) {
  const d = dailyState(); if (d.done[what]) return;
  d.done[what] = 1; setTimeout(() => SFX.sparkle(), 900); S.daysPlayed = S.daysPlayed || {}; S.daysPlayed[d.day] = 1; save(); applyToday();
  const n = DAILY.filter(([k]) => d.done[k]).length;
  // first day: the landlady guides the first three things, then points to the radio (the sparrow's first letter)
  if (!S.firstDayDone && n === DAILY.length) {
    S.firstDayDone = 1; save();
    setTimeout(() => showPaper(`<img class="paper-img" src="${ITEM_IMG.landlady}" alt="" style="max-height:7em">Giỏi lắm cháu ơi! Cây được tưới, trà được pha, sổ tay có chữ rồi.
      Căn gác này bắt đầu có hơi người rồi đấy.<br><br>À, chú chim sẻ trong hẻm mê nhạc lắm. Cháu thử bật chiếc radio xem, biết đâu chú lại mang tin gì sang.<br><br>Còn điều này nữa: mọi kỷ niệm của căn gác đang được cất tạm trong trình duyệt này thôi. Thỉnh thoảng cháu nhớ vào nút 📝 cất một bản sao lưu, kẻo lỡ xoá lịch sử hay đổi máy lại mất hết nhé.
      <small>— Bà chủ nhà tầng dưới —</small>`, null), 1400);
  } else if (n < DAILY.length && !S.firstDayDone) {
    setTimeout(() => toast(`Việc nhỏ hôm nay: ${n}/${DAILY.length} ✓`, 2200), 2800);
  }
}
function applyToday() {
  const b = $('#todaybtn'); if (!b) return;
  b.style.display = S.welcomed ? '' : 'none';
  const d = dailyState(), n = DAILY.filter(([k]) => d.done[k]).length;
  b.querySelector('b').textContent = n < DAILY.length ? `${n}/${DAILY.length}` : '✓';
  b.classList.toggle('news', !S.firstDayDone && n < DAILY.length);
}
function openToday() {
  const d = dailyState();
  const tasks = DAILY.map(([k, ic, label]) => `<li class="${d.done[k] ? 'ok' : ''}"><span>${d.done[k] ? '✓' : ic}</span>${label}</li>`).join('');
  const waits = [];
  for (const i of [0, 1]) { const g = gardenAt(i); if (g && g.type && (i === 0 || S.garden2)) waits.push(plantStatus(i)); }
  if (mapOpen() && S.shop && S.shop.visited) { const t = shopPotsLeft(); if (t > 0) waits.push(`Tiệm hoa đầu hẻm có ${t} chậu đang khát 🪴`); }
  if (tetOn() && S.tet && S.tet.lixi < lixiReady()) waits.push('Có phong lì xì đang chờ trên bàn 🧧');
  if (S.incense && S.candleAt) { const left = 25 * 60e3 - (Date.now() - S.candleAt); if (left > 0) waits.push(`Nến thơm còn ${Math.ceil(left / 60e3)} phút 🕯️`); }
  openPanel(`<h3>Việc nhỏ hôm nay</h3><small style="margin:0 0 .6em">Không cần làm hết đâu, làm được việc nào hay việc ấy 🌿</small>
    <ul class="today">${tasks}</ul>
    ${waits.length ? `<h4>Đang chờ</h4><ul class="today wait">${waits.map(w => `<li>${w}</li>`).join('')}</ul>` : ''}
    ${collectionsHtml()}
    ${rareState().letters.length ? `<button class="reply" id="td-post" style="text-align:center">✉️ Thư lạc địa chỉ (${rareState().letters.length})</button>` : ''}
    <button class="reply" id="td-card" style="text-align:center">📮 Gửi một tấm bưu thiếp</button>
    <button class="reply" id="td-save" style="text-align:center">💾 Sao lưu / khôi phục</button>
    <small>Chạm ra ngoài để đóng</small>`);
  if ($('#td-post')) $('#td-post').addEventListener('click', e => { e.stopPropagation(); openPostLetters(); });
  $('#td-card').addEventListener('click', e => { e.stopPropagation(); openPostcard(); });
  $('#td-save').addEventListener('click', e => { e.stopPropagation(); openBackup(); });
  $('#note').addEventListener('click', e => e.stopPropagation(), { once: true });
  SFX.paper();
}

// ---------- collections: what the player has gathered so far (no reward needed, just the pleasure of a full page)
function collectionsHtml() {
  const planted = Object.keys(PLANTS).filter(k => (S.harvested && S.harvested[k]) || allGardens().some(g => g && g.type === k));
  const pressed = Object.keys(BM_FLOWER).filter(k => S.keep[k] > 0 || (S.harvested && S.harvested[k]));
  const stamps = STAMPS.filter((s, i) => stampOpen(i));
  const chimes = Object.keys(CHIMES).filter(k => !CHIMES[k].need || S.keep[CHIMES[k].need]);
  const rows = [['🌱 Cây đã trồng', planted.length, Object.keys(PLANTS).length], ['🌸 Hoa lá ép', pressed.length, Object.keys(BM_FLOWER).length],
    ['🖋️ Con dấu', stamps.length, STAMPS.length], ['🎐 Chuông gió', chimes.length, Object.keys(CHIMES).length],
    ['🌟 Khách hiếm', (rareState().ff ? 1 : 0) + (rareState().post ? 1 : 0), 2],
    ['📖 Chương truyện', JOURNAL.reduce((n, L) => n + L.ch.filter(c => c.ok(S.story)).length, 0), JOURNAL.length * 5]];
  return `<h4>Bộ sưu tập</h4><ul class="today coll">${rows.map(([t, a, b]) => `<li class="${a >= b ? 'ok' : ''}"><span>${a >= b ? '★' : ''}</span>${t}<b>${a}/${b}</b></li>`).join('')}</ul>`;
}
function stampOpen(i) {
  const s = STAMPS[i]; if (!s) return false;
  return !s[3] || !!S.keep[s[3]];
}

// ---------- backup / restore: the progress lives only in this browser
const BK_PREFIX = 'BKCN1:';
async function backupCode() {
  const json = JSON.stringify(S);
  try {
    const gz = new Blob([json]).stream().pipeThrough(new CompressionStream('gzip'));
    const buf = new Uint8Array(await new Response(gz).arrayBuffer());
    let bin = ''; for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
    return BK_PREFIX + btoa(bin);
  } catch (e) { return 'BKCN0:' + btoa(unescape(encodeURIComponent(json))); }
}
async function readBackup(code) {
  code = code.replace(/\s+/g, '');
  if (code.startsWith('BKCN0:')) return JSON.parse(decodeURIComponent(escape(atob(code.slice(6)))));
  if (!code.startsWith(BK_PREFIX)) throw new Error('code');
  const bin = atob(code.slice(BK_PREFIX.length)), buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  const text = await new Response(new Blob([buf]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
  return JSON.parse(text);
}
function openBackup() {
  openPanel(`<h3>Sổ lưu trữ</h3><small style="margin:0 0 .6em">Căn gác chỉ được cất trong trình duyệt này. Cất một bản sao để không lỡ mất khi đổi máy hay xoá lịch sử nhé.</small>
    <button class="reply" id="bk-copy" style="text-align:center">📋 Chép mã sao lưu</button>
    <button class="reply" id="bk-file" style="text-align:center">⬇️ Tải tệp sao lưu</button>
    <h4>Khôi phục</h4>
    <textarea id="bk-in" rows="3" placeholder="Dán mã sao lưu vào đây…" style="width:100%;box-sizing:border-box;border-radius:10px;border:1.5px solid var(--paper-line);padding:.5em;font:inherit;font-size:.8em"></textarea>
    <label class="reply" style="text-align:center;display:block;cursor:pointer">📂 Chọn tệp sao lưu<input id="bk-pick" type="file" accept=".txt,text/plain" hidden></label>
    <button class="reply" id="bk-restore" style="text-align:center">↺ Khôi phục căn gác</button>
    ${S.backupAt ? `<small>Lần sao lưu gần nhất: ${new Date(S.backupAt).toLocaleDateString('vi-VN')}</small>` : ''}
    <small>Chạm ra ngoài để đóng</small>`);
  const done = () => { S.backupAt = Date.now(); save(); };
  $('#bk-copy').addEventListener('click', async e => {
    e.stopPropagation(); const code = await backupCode();
    try { await navigator.clipboard.writeText(code); done(); toast('Đã chép mã. Dán vào ghi chú hay tin nhắn cho chính mình để cất nhé 📋', 3600); }
    catch (err) { $('#bk-in').value = code; $('#bk-in').select(); done(); toast('Mã đã hiện trong ô bên dưới, bạn tự chép giúp nhé', 3200); }
  });
  $('#bk-file').addEventListener('click', async e => {
    e.stopPropagation(); const code = await backupCode();
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([code], { type: 'text/plain' }));
    a.download = `ben-khung-cua-nho-${dayKey()}.txt`; document.body.appendChild(a); a.click(); a.remove(); done();
    toast('Đã tải tệp sao lưu 💾', 2400);
  });
  $('#bk-pick').addEventListener('change', async e => { const f = e.target.files[0]; if (f) $('#bk-in').value = (await f.text()).trim(); });
  $('#bk-in').addEventListener('click', e => e.stopPropagation());
  $('#bk-restore').addEventListener('click', async e => {
    e.stopPropagation(); const code = $('#bk-in').value.trim();
    if (!code) { toast('Dán mã hoặc chọn tệp sao lưu trước nhé', 2400); return; }
    let data; try { data = await readBackup(code); } catch (err) { toast('Mã này không đọc được, bạn kiểm tra lại giúp nhé', 3000); return; }
    if (!data || typeof data !== 'object' || !data.story) { toast('Mã này không phải căn gác của Bên Khung Cửa Nhỏ', 3000); return; }
    if (!confirm('Căn gác hiện tại sẽ được thay bằng bản sao lưu. Tiếp tục nhé?')) return;
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (err) { toast('Trình duyệt không cho lưu, thử lại sau nhé', 3000); return; }
    location.reload();
  });
  $('#note').addEventListener('click', e => e.stopPropagation(), { once: true });
}
// a gentle reminder once the attic holds a few days of memories
function backupNudge() {
  const days = Object.keys(S.daysPlayed || {}).length;
  if (days >= 4 && Date.now() - (S.backupAt || 0) > 14 * 24 * 3600e3 && Date.now() - (S.backupNudgeAt || 0) > 7 * 24 * 3600e3 && started && !$('#note-wrap').classList.contains('show')) {
    S.backupNudgeAt = Date.now(); save(); toast('Căn gác đã có nhiều kỷ niệm rồi. Cất một bản sao lưu trong 📝 Việc nhỏ hôm nay nhé 💾', 5000);
  }
}

// ---------- postcard: a picture of the window right now + a line from the notebook, to share
function sceneSnapshot() {
  const st = $('#stage'), r0 = st.getBoundingClientRect(), k = SW / r0.width;
  const c = document.createElement('canvas'); c.width = SW * 1.5; c.height = SH * 1.5;
  const ctx = c.getContext('2d'); ctx.scale(1.5 * k, 1.5 * k);
  const visible = el => { const cs = getComputedStyle(el); return cs.display !== 'none' && cs.visibility !== 'hidden' && parseFloat(cs.opacity) > 0.02 && el.offsetParent !== null; };
  const draw = (el, alpha = 1) => {
    const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return;
    ctx.globalAlpha = alpha * parseFloat(getComputedStyle(el).opacity || 1);
    try { ctx.drawImage(el, r.left - r0.left, r.top - r0.top, r.width, r.height); } catch (e) {}
  };
  for (const el of st.querySelectorAll('img.scene')) if (visible(el)) draw(el);
  // the sky canvas is masked to the window in CSS: apply the same mask here
  const sky = $('#sky'), m = (getComputedStyle(st).getPropertyValue('--sky').match(/url\(["']?(.*?)["']?\)$/) || [])[1];
  if (sky && m && SKY_MASK_IMG.complete) {
    const t = document.createElement('canvas'); t.width = sky.width; t.height = sky.height; const tc = t.getContext('2d');
    tc.drawImage(sky, 0, 0); tc.globalCompositeOperation = 'destination-in'; tc.drawImage(SKY_MASK_IMG, 0, 0, t.width, t.height);
    ctx.globalAlpha = 1; ctx.drawImage(t, 0, 0, r0.width, r0.height);
  }
  for (const el of st.querySelectorAll('img.prop, #p-bag img')) if (visible(el)) draw(el);
  ctx.globalAlpha = 1; const fx = $('#fx'); if (fx) ctx.drawImage(fx, 0, 0, r0.width, r0.height);
  return c;
}
const SKY_MASK_IMG = new Image();
SKY_MASK_IMG.src = ((getComputedStyle($('#stage')).getPropertyValue('--sky') || '').match(/url\(["']?(.*?)["']?\)\s*$/) || [])[1] || '';
function wrapText(ctx, text, maxW) {
  const words = text.split(/\s+/), lines = []; let line = '';
  for (const w of words) { const t = line ? line + ' ' + w : w; if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; }
  if (line) lines.push(line); return lines;
}
async function makePostcard() {
  try { await document.fonts.load('40px "Patrick Hand"'); await document.fonts.load('600 26px Quicksand'); } catch (e) {}
  const snap = sceneSnapshot(), W = 1080, H = 1350, PH = 1150;
  const c = document.createElement('canvas'); c.width = W; c.height = H; const ctx = c.getContext('2d');
  ctx.fillStyle = '#FDF8EE'; ctx.fillRect(0, 0, W, H);
  // the window and the sill: scene units 0..714 wide, 120..~1010 high
  const sy = 175 * 1.5, sh = (PH / W) * snap.width;
  ctx.drawImage(snap, 0, sy, snap.width, sh, 40, 40, W - 80, PH - 40);
  ctx.strokeStyle = '#D4C5B0'; ctx.lineWidth = 3; ctx.strokeRect(40, 40, W - 80, PH - 40);
  if (window.xmasView) { try { await xmasPostcard(ctx, W, PH); } catch (e) {} }   // Giáng Sinh frame
  const today = (S.diary || {})[dayKey()];
  const line = today ? `“${today.a}”` : `“${NOTES[Math.floor(Math.random() * NOTES.length)]}”`;
  ctx.fillStyle = '#4A3525'; ctx.font = '40px "Patrick Hand", cursive'; ctx.textBaseline = 'top';
  const lines = wrapText(ctx, line, W - 140).slice(0, 3);
  lines.forEach((l, i) => ctx.fillText(l, 70, PH + 28 + i * 46));
  ctx.font = '600 24px Quicksand, sans-serif'; ctx.fillStyle = '#8a7560';
  ctx.fillText('Bên Khung Cửa Nhỏ · thaovi0308.github.io/little-sill', 70, H - 52);
  return c;
}
async function openPostcard() {
  toast('Đang chụp khung cửa sổ… 📮', 1500);
  let canvas; try { canvas = await makePostcard(); } catch (e) { toast('Chưa chụp được, thử lại sau nhé', 2600); return; }
  let blob = null; try { blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.9)); } catch (e) {}
  if (!blob) { toast('Trình duyệt này chưa cho chụp ảnh, thử mở bằng Chrome hoặc Safari nhé', 3600); return; }
  const url = URL.createObjectURL(blob), file = new File([blob], `ben-khung-cua-nho-${dayKey()}.jpg`, { type: 'image/jpeg' });
  const canShare = !!(navigator.canShare && navigator.canShare({ files: [file] }));
  openPanel(`<h3>Bưu thiếp hôm nay</h3><img src="${url}" alt="" style="width:100%;border-radius:10px;box-shadow:0 4px 12px rgba(60,35,20,.25)">
    ${canShare ? '<button class="reply" id="pc-share" style="text-align:center">📮 Gửi đi</button>' : ''}
    <a class="reply" id="pc-dl" href="${url}" download="${file.name}" style="text-align:center;display:block;text-decoration:none;color:inherit">⬇️ Tải ảnh về máy</a>
    <small>Câu trên bưu thiếp lấy từ sổ tay hôm nay của bạn. Chạm ra ngoài để đóng</small>`);
  if (canShare) $('#pc-share').addEventListener('click', async e => {
    e.stopPropagation(); try { await navigator.share({ files: [file], title: 'Bên Khung Cửa Nhỏ', text: 'Một góc cửa sổ bình yên 🌿 thaovi0308.github.io/little-sill' }); } catch (err) {}
  });
  $('#pc-dl').addEventListener('click', e => e.stopPropagation());
  $('#note').addEventListener('click', e => e.stopPropagation(), { once: true });
}

// ---------- letters after a story: once a neighbour's 5 chapters are lived, they keep writing now and then (about a week apart)
const EPILOGUE = [
  // 0 bác sửa đồng hồ (thư chim sẻ)
  ['Sáng nay bác lau lại tủ kính, xếp mấy chiếc đồng hồ cũ ngay ngắn thành hàng. Có cậu bé ghé nhờ sửa giúp chiếc đồng hồ của ông nội. Bác tỉ mẩn làm chậm thôi, vậy mà trong lòng vui lắm.',
    'Chiều qua trời mưa rào, bác mở hộp nhạc nghe lại bản nhạc của cháu. Lạ thật đấy, vẫn một giai điệu ấy mà mỗi lần nghe lại thấy gợi về một chuyện khác.',
    'Bác cũng học được cách pha trà hoa cúc giống cháu rồi. Ngồi bên hiên cửa sổ, thong thả nhìn kim đồng hồ nhích từng nhịp, bác chẳng còn thấy mình phải vội nữa.'],
  // 1 cậu họa sĩ (máy bay giấy)
  ['Tuần này mình vẽ một bức chỉ để cho vui, chẳng vướng bận deadline nào cả. Hóa ra, mình vẫn còn thích vẽ đến thế.',
    'Mình treo bức “Góc Cửa Ngày Mưa” ngay trước bàn làm việc. Mỗi lần bí ý tưởng, mình lại ngước nhìn nó một chút rồi nhấp ngụm nước, tự nhiên thấy lòng dịu lại.',
    'Bé Na nhờ mình dạy vẽ mèo. Bánh Quy chịu ngồi làm mẫu được đúng hai phút rồi ngáp dài, quay lưng đi ngủ. Hai anh em nhìn nhau cười mãi.'],
  // 2 bé Na (ruy băng mèo)
  ['Hôm nay lớp em đi dã ngoại, em ngồi cạnh bạn Thảo suốt cả chặng đường. Em kể cho bạn ấy nghe bao nhiêu chuyện về Bánh Quy và khung cửa sổ nhỏ nhà bạn đó!',
    'Bánh Quy dạo này tròn quay rồi nha, chắc tại bạn cho ăn nhiều quá đó. Mẹ em bảo phải rủ nó chạy nhảy nhiều hơn mới được.',
    'Hôm nay em được điểm mười môn vẽ nè! Em vẽ con hẻm nhà mình có khung cửa sổ và chậu cây xanh của bạn. Cô giáo khen em tô màu ấm áp lắm.'],
  // 3 chị bán hoa (túi vải)
  ['Dạo này tiệm hoa đông khách hơn rồi em ạ. Có cô khách chiều nào cũng ghé mua một cành cúc nhỏ, bảo đặt trên bàn làm việc nhìn cho dễ thở.',
    'Chị mới về thêm mấy chậu sen đá nhỏ xíu, nhìn cưng lắm. Bữa nào rảnh ghé qua tiệm nhé, chị để dành sẵn cho em một chậu xinh nhất.',
    'Tối qua chị ngồi bó hoa dưới ánh đèn lồng vàng, nghe tiếng radio từ căn gác của em khe khẽ vọng xuống. Cảm ơn em vì đã mang thêm tiếng nhạc ấm về cho con hẻm.'],
  // 4 Minh (hòm thư)
  ['Về lại hẻm được mấy hôm, sáng nào mình cũng ghé xe đầu hẻm mua ổ bánh mì nóng. Đi xa bao nhiêu nơi rồi, cuối cùng vẫn thấy hương vị ở đây là ngon nhất.',
    'Mình đang tập gieo cỏ bốn lá trong chiếc hộp sữa cũ, mà mãi chưa thấy nhánh nào đủ bốn cánh cả. Chắc hôm nào phải sang xin bí quyết chăm cây của bạn thôi.',
    'Tối nay mình bật nghe lại cuộn băng Gió Đồi Thông. Nhắm mắt lại vẫn thấy tiếng gió rì rào qua rừng thông, còn khi mở mắt ra, mình biết mình đang ở nhà rồi.'],  // 5 ông Khải (thẻ mượn sách)
  ['Ngăn “Sách có hoa” giờ đã có mười hai bông rồi cháu ạ. Có cô sinh viên kẹp vào cả một chiếc lá bàng đỏ, ông thấy cũng tính là hoa.',
    'Hôm nay ông lau kính xong, đọc được trọn một chương sách mà không cần ai đọc giúp. Vui như hồi mới biết chữ.',
    'Tối qua ông mở sổ ép hoa ra xem, thấy trang cuối đã có thêm nét chữ của cháu. Bà nhà ông mà biết, chắc bà vui và cười hiền lắm.'],
];
const EPI_GAP = 7 * 24 * 3600e3;
function routeFinished(li) { return JOURNAL[li].ch.every(c => c.ok(S.story)); }
function epilogueTick() {
  S.epi = S.epi || {};
  for (let li = 0; li < JOURNAL.length; li++) {
    if (!routeFinished(li)) continue;
    const e = S.epi[li] = S.epi[li] || { n: 0, at: Date.now() };    // the week starts when the story ends
    if (e.n >= EPILOGUE[li].length || Date.now() - e.at < EPI_GAP) continue;
    if (S.epiDay === dayKey()) return;                              // at most one letter a day
    if (!storyGate('epi' + li + '-' + e.n)) return;
    const L = JOURNAL[li], text = EPILOGUE[li][e.n];
    e.n++; e.at = Date.now(); S.epiDay = dayKey(); save();
    showPaper(`<img class="paper-img" src="${ITEM_IMG[L.img] || ''}" alt="" style="max-height:6em">${text}<small>— ${L.who} · ${L.by} —</small>`, null);
    return;
  }
}
function epilogueRows(li) {
  const e = S.epi && S.epi[li]; if (!e || !e.n) return '';
  return EPILOGUE[li].slice(0, e.n).map((t, k) => `<details class="jc"><summary><b>Thư sau đó ${k + 1}</b></summary><p>${t}</p></details>`).join('');
}

// ---------- rare visitors (Vi's drawings 27/11): seen now and then, never on a schedule the player can count on
// the lost firefly: some nights it drifts in the window; tap it and it finds the jar
// the postman: some days his bicycle bell rings in the alley and a letter with no right address waits on the desk
const POST_LETTERS = [
  ['Gửi bà Tư nhà số 12', 'Con đỗ đại học rồi bà ơi! Tết này con về, bà nhớ để dành cho con nồi chè đậu nhé.', 'Hẻm mình làm gì có nhà số 12 hả cháu, chắc người gửi nhớ nhầm.'],
  ['Gửi người ở căn gác có chậu cây', 'Sáng nào đi làm ngang qua, tôi cũng ngước nhìn bệ cửa nhà bạn. Cảm ơn bạn đã cho con đường một chút màu xanh.', 'Lá này thì chú đoán là của cháu rồi, cả hẻm chỉ có bệ cửa nhà cháu là xanh thế.'],
  ['Gửi tôi của mười năm sau', 'Mong là bạn vẫn còn thích ngắm mưa, vẫn pha trà mỗi tối, và vẫn tha thứ cho mình dễ dàng như bây giờ.', 'Thư không có địa chỉ người nhận, chỉ có dòng chữ này. Chú nghĩ ai đọc được thì người ấy nhận.'],
  ['Gửi mẹ', 'Ở thành phố con ăn uống đầy đủ, mẹ đừng lo. Chỉ là thỉnh thoảng trời mưa, con lại nhớ nồi canh chua mẹ nấu.', 'Tem bị nhoè hết rồi, chú không đọc được tên xã. Cháu giữ giùm, chú còn hỏi bưu cục thêm.'],
  ['Gửi cậu bạn ngồi bàn cuối', 'Hồi đó tớ chưa kịp nói cảm ơn vì cậu cho tớ mượn chiếc ô hôm mưa to. Giờ thì nói được rồi: cảm ơn cậu nhiều lắm.', 'Thư này đi lòng vòng ba bưu cục rồi mới tới đây đấy cháu.'],
];
const FF_BOX = [290, 370, 84, 82];
const ffEl = document.createElement('img'); ffEl.id = 'p-firefly'; ffEl.className = 'prop'; ffEl.alt = ''; ffEl.src = ITEM_IMG.firefly; ffEl.style.display = 'none';
const ffHit = document.createElement('button'); ffHit.className = 'hit'; ffHit.setAttribute('aria-label', 'Chú đom đóm lạc'); ffHit.style.display = 'none';
const envEl = document.createElement('img'); envEl.id = 'p-envelope'; envEl.className = 'prop'; envEl.alt = ''; envEl.src = ITEM_IMG.envelope_odd; envEl.style.cssText = 'display:none;transform:rotate(-8deg)';
const envHit = document.createElement('button'); envHit.className = 'hit'; envHit.setAttribute('aria-label', 'Lá thư lạc địa chỉ'); envHit.style.display = 'none';
$('#p-tea2').after(ffEl, envEl); hitsEl.append(ffHit, envHit);
place(ffEl, ...FF_BOX); place(ffHit, FF_BOX[0] - 20, FF_BOX[1] - 20, FF_BOX[2] + 40, FF_BOX[3] + 40);
place(envEl, 418, 972, 84, 66); place(envHit, 412, 962, 96, 84);
let ffTimer = null;
function rareState() { S.rare = S.rare || { ff: 0, ffAt: 0, post: 0, postAt: 0, letters: [] }; return S.rare; }
const RARE_GAP = { ff: 3 * 24 * 3600e3, post: 4 * 24 * 3600e3 };
function rareFree() { return started && !$('#note-wrap').classList.contains('show') && !outsideOpen() && Object.keys(S.daysPlayed || {}).length >= 2; }
function fireflyCome() {
  const r = rareState(); r.ffAt = Date.now(); save();
  ffEl.style.display = ''; ffHit.style.display = ''; ffEl.classList.add('drift'); SFX.sparkle();
  setTimeout(() => { if (ffEl.style.display === '') toast('Có một đốm sáng nhỏ lạc vào khung cửa sổ… ✨', 3000); }, 1500);
  ffTimer = setTimeout(() => fireflyGo(false), 90000);
}
function fireflyGo(home) {
  clearTimeout(ffTimer); ffHit.style.display = 'none';
  const j = HITS.jar.box, dx = (j[0] + j[2] / 2 - FF_BOX[0] - FF_BOX[2] / 2) * scale, dy = (j[1] + j[3] / 3 - FF_BOX[1] - FF_BOX[3] / 2) * scale;
  ffEl.classList.remove('drift');
  const a = ffEl.animate(home ? [{ translate: '0 0', scale: 1, opacity: 1 }, { translate: `${dx * 0.5}px ${dy * 0.3 - 40}px`, scale: 0.8, offset: 0.5 }, { translate: `${dx}px ${dy}px`, scale: 0.3, opacity: 0 }]
    : [{ translate: '0 0', opacity: 1 }, { translate: '-60px -220px', opacity: 0 }], { duration: home ? 2600 : 2000, easing: 'ease-in-out' });
  a.onfinish = () => { ffEl.style.display = 'none'; };
  if (home) {
    const r = rareState(); r.ff++; save();
    setTimeout(() => { releaseFireflies(); SFX.chime(0.2); }, 2400);
    setTimeout(() => toast(r.ff === 1 ? 'Chú đom đóm lạc đã tìm thấy chiếc hũ thủy tinh. Cả hũ như sáng ấm hơn một chút 🌟' : 'Đom đóm lạc lại ghé, rồi chui vào hũ ngủ cùng các bạn 🌟', 4200), 2800);
  }
}
function postmanCome() {
  const r = rareState(); r.postAt = Date.now(); save();
  SFX.chime(0.5); setTimeout(() => SFX.chime(0.5), 260);
  toast('Kính coong! Có tiếng chuông xe đạp dưới hẻm 🚲', 3200);
  setTimeout(() => { envEl.style.display = ''; envHit.style.display = ''; bump(envEl, 'hop'); SFX.paper(); }, 2600);
}
function readPostLetter() {
  const r = rareState(); envEl.style.display = 'none'; envHit.style.display = 'none';
  const i = r.post % POST_LETTERS.length, [to, body, note] = POST_LETTERS[i];
  r.post++; if (!r.letters.includes(i)) r.letters.push(i); save();
  const intro = r.post === 1 ? 'Chào cháu, chú là người đưa thư của khu này, tuần nào cũng đạp xe ngang qua hẻm. ' : '';
  showPaper(`<img class="paper-img" src="${ITEM_IMG.postman}" alt="" style="max-height:9em">${intro}${note} Cháu giữ giùm chú nhé, thư lạc mà có người đọc thì cũng đỡ buồn.<small>— Chú đưa thư —</small>`,
    () => setTimeout(() => showPaper(`<img class="paper-img" src="${ITEM_IMG.envelope_odd}" alt="" style="max-height:5em"><b>${to}</b><br>${body}`, null), 400), true);
}
function openPostLetters() {
  const r = rareState();
  openPanel(`<h3>Thư lạc địa chỉ</h3><small style="margin:0 0 .8em">Chú đưa thư gửi cháu giữ giùm</small>` +
    r.letters.map(i => `<details class="jc"><summary><b>${POST_LETTERS[i][0]}</b></summary><p>${POST_LETTERS[i][1]}</p></details>`).join('') +
    `<button class="reply" id="pl-back" style="text-align:center">‹ Việc nhỏ hôm nay</button><small>Chạm ra ngoài để đóng</small>`);
  document.querySelectorAll('#note details').forEach(d => d.addEventListener('click', e => e.stopPropagation()));
  $('#pl-back').addEventListener('click', e => { e.stopPropagation(); openToday(); });
}
ffHit.addEventListener('click', e => { e.stopPropagation(); fireflyGo(true); });
envHit.addEventListener('click', e => { e.stopPropagation(); readPostLetter(); });
function rareTick() {
  if (!rareFree()) return;
  const r = rareState(), now = Date.now();
  if (ffEl.style.display === 'none' && S.weather === 'night' && now - r.ffAt > RARE_GAP.ff && Math.random() < 0.06) { fireflyCome(); return; }
  if (envEl.style.display === 'none' && S.weather !== 'night' && now - r.postAt > RARE_GAP.post && Math.random() < 0.04) postmanCome();
}

// ---------- the button, the timers
$('#todaybtn').addEventListener('click', e => { e.stopPropagation(); SFX.click(); openToday(); });
applyToday();
setInterval(() => { applyToday(); epilogueTick(); backupNudge(); rareTick(); }, 20000);
try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
// installable page (manifest + service worker), only on the real site
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
