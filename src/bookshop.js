// ================================================================ Route 6 · Tiệm Sách Cuối Hẻm (ông Khải, ông–cháu). Script approved by Vi 27/11.
// Loop: sort one shelf by spine colour (daily, cannot fail) -> borrow one book -> read one page a day at home (3 pages) -> return it, the card gets a stamp.
// Chapters: 1 first shelf (borrow card) · 2 the daisy in book 1 · 3 read a page aloud (book 2) · 4 slip your own pressed flower (book 3) · 5 grandma's album (book 4)
S.story.khai = S.story.khai || 0;
S.bk = Object.assign({ visited: 0, sortDay: '', sortN: 0, loan: null, loans: 0, stamps: 0, quote: '', name: '', chat: 0, lampOff: 0 }, S.bk || {});
const forceBk = /[?&]sach\b/.test(location.search);            // testing: ?sach opens the shop and skips the one-page-a-day wait
function bkOpen() { return forceBk || !!S.shop.visited; }
function bkNews() {
  if (!bkOpen()) return false;
  const L = S.bk.loan;
  return !S.bk.visited || S.bk.sortDay !== dayKey() || !!(L && L.pages >= 3);
}

const KHAI = {
  ch1: ['Ồ, khách hiếm đây. Cháu là người ở căn gác có cây trên bệ cửa phải không? Ông nghe bà chủ nhà kể rồi.',
    'Mắt ông dạo này kém, mấy ngăn sách lộn xộn hết cả. Cháu phụ ông xếp lại một ngăn nhé, xếp theo màu thôi, cho nhìn vui mắt.'],
  card: 'Ở tiệm ông, ai phụ một ngăn sách được mượn một cuốn. Luật của bà nhà ông đặt ra từ hồi xưa đấy.',
  ch2: ['Chữ của bà nhà ông đấy. Bà có thói quen ép hoa vào sách, cuốn nào đọc xong cũng để lại một bông.',
    'Ông cứ tưởng mình cất hết rồi, hóa ra vẫn còn sót lại trên kệ. Cháu giữ giúp ông bông cúc này thêm vài hôm nhé, ông vẫn chưa đủ can đảm để nhìn lâu.'],
  ch3ask: 'Cháu đọc to cho ông nghe một trang được không? Không cần đọc hay, đọc chậm thôi. Lâu rồi tiệm này không có tiếng người đọc sách.',
  ch3ok: 'Bà nhà ông cũng thích câu đó. Hai người có duyên với nhau thật.',
  ch4ask: 'Trước khi cất sách lên kệ, cháu có muốn kẹp gì vào trong không?',
  ch4: 'Cháu cũng ép hoa à? Cái thói quen dễ thương ấy ông cứ tưởng mất theo bà rồi. Ông nghĩ ra rồi: ông sẽ để riêng một ngăn “Sách có hoa”, ai mượn cũng được kẹp lại một bông. Cho tiệm có thêm chút mùa xuân.',
  ch4none: 'Cháu chưa có bông hoa ép nào à? Không sao, lúc nào cây trên gác cho hoa, cháu ép một bông rồi mang xuống cũng được. Ông giữ cuốn này ở quầy chờ cháu.',
  ch5: 'Cuốn này ông cất trong ngăn kéo đã lâu. Là sổ ép hoa của bà nhà ông, vẫn còn trống mấy trang ở cuối. Ông nghĩ cháu sẽ điền tiếp những trang còn lại đẹp hơn ông. Thẻ mượn sách của cháu cũng đóng đủ dấu rồi, từ nay ông đổi cho cháu thẻ vàng, mượn bao lâu tuỳ thích.',
  needSort: 'Luật của bà nhà ông: phụ một ngăn sách thì mượn được một cuốn. Hôm nay cháu xếp giúp ông một ngăn đã nhé.',
  sorted: ['Ngăn này nhìn vui mắt hẳn. Cảm ơn cháu, mắt ông nhờ cháu mà sáng thêm được một ngăn.',
    'Đỏ, cam, vàng, xanh… cứ như cầu vồng nằm ngủ trên kệ. Bà nhà ông mà thấy chắc khen cháu khéo tay lắm.',
    'Xếp xong rồi à? Nhanh hơn ông ngày xưa nhiều. Hồi trẻ ông xếp theo tên tác giả, bà lại thích xếp theo màu, hai ông bà cãi nhau suốt.'],
  sortedToday: 'Hôm nay ngăn sách gọn gàng rồi. Mai cháu ghé phụ ông ngăn khác nhé, bụi ở tiệm này không bao giờ hết đâu.',
  borrow: 'Cuốn này ông để dành cho cháu. Mỗi ngày đọc một trang thôi nhé, sách cũ cũng như người già, không thích bị vội.',
  reading: 'Cuốn sách cháu mượn đọc tới đâu rồi? Cứ thong thả, đọc xong trang cuối rồi hẵng đem trả.',
  thanks: ['Trả đúng hẹn, lại còn giữ sách phẳng phiu. Cháu là độc giả ông quý nhất tiệm đấy.',
    'Cuốn này đọc thấy thế nào? Lần sau kể ông nghe với nhé, ông thích nghe người trẻ kể chuyện sách.'],
  chat: ['Tiệm này mở từ hồi hai vợ chồng ông còn trẻ. Ngày ấy hẻm chưa có giàn hoa giấy, chỉ có mỗi cây đèn đường vàng vọt.',
    'Cái kính lão này ông đeo mười năm rồi, giờ thì nó với ông cùng mờ như nhau, ha ha.',
    'Đừng sợ làm quăn sách cháu ạ. Sách được đọc nhiều mới có nếp, như mặt người được cười nhiều mới có nếp nhăn.',
    'Trời mưa là tiệm vắng, nhưng ông lại thích. Nghe mưa gõ mái tôn, đọc một chương, thế là đủ một buổi chiều.'],
  gold: 'Thẻ vàng rồi, cháu cứ chọn cuốn nào mình thích. Đọc xong nhớ kể ông nghe với nhé.',
};
const LADY_BK = 'Cuối hẻm có tiệm sách của ông Khải, dạo này ông ấy cần người phụ một tay. Cháu rảnh thì ghé qua, ông vui lắm đấy.';
// books to borrow: 3 pages each, one page a day (texts by em, Vi may rewrite)
const BOOKS = [
  { t: 'Mùa Mưa Ở Phố Cũ', c: 'green', p: [
    'Mùa mưa năm ấy, phố cũ có một tiệm trà nhỏ nằm nép dưới mái hiên. Người ta ghé vào trú mưa, rồi ở lại lâu hơn mình định.',
    'Cô chủ tiệm không bao giờ hỏi khách muốn uống gì. Cô nhìn ai đó một lúc, rồi rót cho họ đúng loại trà họ cần.',
    'Đến cuối mùa, cô chỉ nói: “Mưa nào rồi cũng tạnh. Mình chỉ cần một chỗ ấm để chờ thôi.”'] },
  { t: 'Những Lá Thư Không Gửi', c: 'blue', p: [
    'Có những lá thư người ta viết xong rồi cất trong ngăn kéo. Không phải vì không muốn gửi, mà vì viết ra đã là đủ.',
    'Ông lão bưu tá về hưu vẫn giữ thói quen đi bộ qua từng con hẻm cũ, chào từng hộp thư như chào người quen.',
    'Ông bảo: “Thư đến chậm một chút cũng không sao. Miễn là người nhận vẫn còn ngóng.”'] },
  { t: 'Khu Vườn Trên Mái', c: 'amber', p: [
    'Trên mái một khu tập thể cũ có người trồng cả một khu vườn trong những chiếc thùng sơn. Cà chua, rau thơm, vài khóm cúc.',
    'Hàng xóm mỗi người góp một ít: người cho hạt, người cho đất, người chỉ ghé lên tưới giùm lúc chủ vườn đi vắng.',
    'Đến mùa hoa, cả khu leo lên mái ngắm hoàng hôn. Chẳng ai nhớ ra khu vườn ấy bắt đầu từ ai nữa.'] },
  { t: 'Người Giữ Đèn', c: 'red', p: [
    'Ở một thị trấn ven biển có người giữ đèn già, mỗi tối lên ngọn tháp lau kính rồi thắp đèn.',
    'Có năm tàu thuyền chẳng còn đi qua nữa, ông vẫn thắp. Ông bảo đèn không chỉ để dẫn đường, đèn còn để ai đó biết mình không ở một mình.',
    'Khi ông không leo nổi cầu thang nữa, bọn trẻ trong thị trấn thay nhau lên thắp. Ngọn đèn chưa tắt đêm nào.'] },
  { t: 'Chiếc Ô Màu Vàng', c: 'yellow', p: [
    'Cô bé có một chiếc ô màu vàng, ngày nắng cũng mang theo.',
    'Ai hỏi, cô bảo: “Để lỡ ai đó quên ô thì mình che chung.”',
    'Lớn lên cô mới hiểu, chiếc ô ấy che cho cô nhiều hơn là cô che cho người khác.'] },
  { t: 'Bản Đồ Những Điều Nhỏ', c: 'sage', p: [
    'Cậu thanh niên vẽ một tấm bản đồ không có đường đi, chỉ có những điều nhỏ: chỗ bán bánh mì thơm nhất, bậc thềm có nắng sớm, gốc cây có mèo ngủ.',
    'Mỗi lần buồn, cậu mở bản đồ ra và đi lại đúng một điểm.',
    'Cậu bảo tấm bản đồ ấy không giúp cậu đi xa hơn, mà giúp cậu nhớ ra mình đang ở đâu.'] },
];
const READ_ALOUD = ['Buổi sáng hôm ấy, bà mở cửa tiệm sớm hơn mọi ngày.', 'Nắng chưa lên hẳn, chỉ có mùi giấy cũ và tiếng chim sẻ ríu rít ngoài hiên.',
  'Bà đặt một bông cúc vào giữa trang sách, khép lại thật khẽ, như sợ làm bông hoa giật mình.'];
const QUOTE_PICK = ['Có những điều chỉ cần được giữ lại, không cần được nói ra.', 'Hoa ép không còn tươi, nhưng mùa xuân thì vẫn còn ở trong đó.',
  'Một trang sách đọc chậm đáng giá hơn mười trang đọc vội.'];
const BK_ORDER = ['red', 'orange', 'amber', 'yellow', 'green', 'sage', 'blue', 'brown'];
const BK_BOOK_H = { red: 266, orange: 236, amber: 272, yellow: 247, green: 224, sage: 242, blue: 268, brown: 233 };

// ---------- sounds: a soft book thump, the stamp, the shop's quiet air
function bkThump(v = 1) { if (!AC) return; const t = AC.currentTime; noiseBurst(t, 0.09, 420, 140, 0.9, 0.3 * v, master, 'brown'); tone(t, 110, 0.12, 0.05 * v, 'sine'); }
function bkStampSnd() { if (!AC) return; const t = AC.currentTime; noiseBurst(t, 0.05, 900, 300, 1, 0.35, master, 'brown'); tone(t + 0.01, 180, 0.1, 0.08, 'triangle'); }
const bkTone = (f, d, a, type) => { if (AC) tone(AC.currentTime, f, d, a, type); };
function bkPage() { playS('sfx_page', 0.55); }
function bkBell() { if (!AC) return; const t = AC.currentTime; [1568, 2093].forEach((f, i) => tone(t + i * 0.12, f, 1.4, 0.03, 'sine')); }
let bkAir = null;
function bkAudio(on) {
  if (!AC) return;
  const now = AC.currentTime;
  radioVol.gain.cancelScheduledValues(now); radioVol.gain.setTargetAtTime(on ? 0 : S.volRadio, now, 0.27);
  if (bgmBus) { bgmBus.gain.cancelScheduledValues(now); bgmBus.gain.setTargetAtTime(on ? 0 : (S.volMusic ?? 0.7), now, 0.27); }
  clearInterval(bkAir); bkAir = null;
  if (on) bkAir = setInterval(() => { const r = Math.random(); if (r < 0.4) playS('sfx_page', 0.18); else if (r < 0.6) bkTone(2200, 0.02, 0.006); }, 7000);
}

// ---------- the shop scene
let bkQ = [], bkSayT = 0;
function bkSay(text, more) {
  const b = $('#bks-say'); clearTimeout(bkSayT);
  b.innerHTML = esc(text) + (more ? '<small class="more">Chạm để nghe tiếp…</small>' : ''); b.classList.remove('show'); void b.offsetWidth; b.classList.add('show');
  bkSayT = setTimeout(() => b.classList.remove('show'), Math.max(5600, text.length * 75));
  bkPose('smile');
}
function bkNext() { if (bkQ.length) { const t = bkQ.shift(); bkSay(t, bkQ.length > 0); } }
$('#bks-say').addEventListener('click', e => { e.stopPropagation(); SFX.click(); if (bkQ.length) bkNext(); else $('#bks-say').classList.remove('show'); });
let bkPoseT = 0;
function bkPose(p) {
  const el = $('#bk-khai'); clearTimeout(bkPoseT);
  el.src = ITEM_IMG[p === 'smile' ? 'khai_smile' : 'khai_read']; place(el, ...(p === 'smile' ? [318, 632, 340, 439] : [314, 612, 344, 494]));
  if (p === 'smile') bkPoseT = setTimeout(() => bkPose('read'), 9000);
}
function applyBk() {
  const sh = $('#bks'), L = S.bk.loan, today = S.bk.sortDay === dayKey();
  sh.dataset.w = S.weather; sh.classList.toggle('lamp-off', !!S.bk.lampOff);
  sh.querySelector('.bk-dust').classList.toggle('on', !today);
  const acts = [];
  if (!today) acts.push(['sort', '📚 Xếp ngăn sách']);
  if (L && L.pages >= 3) acts.push(['return', '↩️ Trả sách']);
  else if (!L && S.story.khai >= 1 && !S.bk.wantFlower) acts.push(['borrow', '📖 Mượn sách']);
  if (S.bk.wantFlower) acts.push(['flower', '🌼 Kẹp hoa ép vào sách']);
  $('#bks-acts').innerHTML = acts.map(([k, t]) => `<button data-k="${k}">${t}</button>`).join('');
  $('#bk-open').style.opacity = S.story.khai === 2 && L && L.pages >= 3 ? 1 : 0;
}
function enterBk() {
  djStop();
  const fade = $('#fade'); fade.classList.add('on'); footsteps(); setTimeout(bkBell, 520);
  setTimeout(() => {
    closeMailbox(); $('#amap').classList.remove('show'); $('#shop').classList.remove('show'); duck(1);
    bkPose('read'); applyBk(); $('#bks').classList.add('show'); bkAudio(true); fade.classList.remove('on');
    const L = S.bk.loan;
    if (S.story.khai === 0) bkQ = KHAI.ch1.slice();
    else if (L && L.pages >= 3) bkQ = ['Ồ, cháu mang sách xuống trả đấy à? Đưa ông đóng dấu vào thẻ nào.'];
    else if (L) bkQ = [KHAI.reading];
    else if (S.bk.wantFlower) bkQ = ['Cuốn sách cháu trả ông vẫn để ở quầy đây. Có bông hoa ép nào thì kẹp vào giúp ông nhé.'];
    else if (S.bk.sortDay !== dayKey()) bkQ = [S.story.khai >= 5 ? 'Cháu đến rồi đấy à. Ngăn sách hôm nay lại bụi rồi, cháu phụ ông một tay nhé.' : KHAI.needSort];
    else bkQ = [KHAI.chat[S.bk.chat++ % KHAI.chat.length]];
    S.bk.visited = 1; save(); applyMapBtn();
    setTimeout(bkNext, 700);
  }, 420);
}
function leaveBk() {
  const fade = $('#fade'); fade.classList.add('on'); footsteps();
  setTimeout(() => { $('#bks').classList.remove('show'); $('#bks-say').classList.remove('show'); bkAudio(false); fade.classList.remove('on'); applyMapBtn(); applyBkBook();
    if (S.radio && S.weather === 'night') djNext(true); }, 420);
}
$('#bks').addEventListener('click', e => {
  e.stopPropagation();
  const t = e.target.closest('[data-k]'); if (!t) return;
  const k = t.dataset.k;
  if (k === 'home') { SFX.click(); leaveBk(); }
  else if (k === 'map') { SFX.click(); leaveBk(); setTimeout(openMap, 500); }
  else if (k === 'khai') { bump($('#bk-khai'), 'wig'); SFX.paper(); if (bkQ.length) bkNext(); else bkSay(KHAI.chat[S.bk.chat++ % KHAI.chat.length]); }
  else if (k === 'sort' || k === 'shelf') { if (S.bk.sortDay === dayKey()) { bkThump(0.5); bkSay(KHAI.sortedToday); } else openSort(); }
  else if (k === 'borrow' || k === 'stack') bkBorrow();
  else if (k === 'return') bkReturn();
  else if (k === 'flower') bkFlowerPick();
  else if (k === 'lamp') { S.bk.lampOff = S.bk.lampOff ? 0 : 1; save(); applyBk(); SFX.click(); bkTone(880, 0.05, 0.02); }
  else if (k === 'cat') { bump($('#bk-cat'), 'hop'); SFX.purr(); toast('Con mèo mướp của tiệm sách ngủ khì trong thùng sách cũ, chỉ hé một mắt nhìn bạn 🐈', 3200); }
  else if (k === 'glass') { bump($('#bk-glass'), 'wig'); SFX.click(); toast('Chiếc kính lúp cán gỗ ông Khải dùng để đọc chữ nhỏ trên gáy sách 🔍', 3000); }
  else if (k === 'plant') { bump($('#bk-plant'), 'wig'); if (AC) noiseBurst(AC.currentTime, 0.25, 2600, 1200, 0.8, 0.08, master); toast('Kệ trầu bà trên nóc tủ sách, lá rủ xuống mấy gáy sách cũ 🌿', 3000); }
  else if (k === 'sign') { bump($('#bk-sign'), 'wig'); if (AC) noiseBurst(AC.currentTime, 0.18, 3200, 2400, 2, 0.06, master); toast(bkSignText(), 3600); }
});
function bkSignText() {
  if (S.bk.sortDay !== dayKey()) return 'Bảng phấn: “Hôm nay cần người phụ xếp một ngăn sách. Trả công: được mượn một cuốn.”';
  return ['Bảng phấn: “Sách cũ, chuyện mới.”', 'Bảng phấn: “Đọc chậm thôi, tiệm không đóng cửa sớm đâu.”', 'Bảng phấn: “Ngăn Sách có hoa: mượn một cuốn, kẹp lại một bông.”'][S.story.khai >= 4 ? 2 : (dayN() | 0) % 2];
}
(function buildBk() {
  const sh = $('#bks');
  sh.style.backgroundImage = `url(${ITEM_IMG.bookshop_bg})`;
  const add = (id, img, box, before) => { const el = document.createElement('img'); el.id = id; el.alt = ''; el.src = ITEM_IMG[img]; place(el, ...box); sh.insertBefore(el, before || sh.querySelector('.bks-glow')); return el; };
  add('bk-plant', 'bk_pothos', [548, 168, 128, 195]);
  add('bk-cat', 'bk_catcrate', [36, 190, 196, 120]);
  add('bk-sign', 'bk_sign', [16, 520, 164, 183]);
  add('bk-khai', 'khai_read', [314, 612, 344, 494]);
  add('bk-desk', 'bookshop_desk', [22, 772, 670, 450]);
  add('bk-glass', 'bk_magnifier', [214, 868, 86, 68]);
  add('bk-open', 'bk_openbook', [292, 848, 160, 114]).style.opacity = 0;
  const dust = document.createElement('div'); dust.className = 'bk-dust'; place(dust, 60, 380, 230, 110); sh.insertBefore(dust, sh.querySelector('.bks-glow'));
  const hit = (k, box, label) => { const b = document.createElement('button'); b.className = 'hit'; b.dataset.k = k; b.setAttribute('aria-label', label); place(b, ...box); sh.appendChild(b); };
  hit('khai', [360, 640, 250, 260], 'Ông Khải');
  hit('shelf', [50, 360, 250, 140], 'Ngăn sách bụi');
  hit('stack', [580, 860, 110, 90], 'Chồng sách cho mượn');
  hit('lamp', [60, 772, 130, 140], 'Đèn bàn xanh');
  hit('cat', [40, 196, 190, 110], 'Mèo ngủ trong thùng sách');
  hit('glass', [210, 862, 92, 76], 'Kính lúp');
  hit('plant', [556, 170, 116, 190], 'Kệ trầu bà');
  hit('sign', [20, 524, 156, 176], 'Bảng phấn');
})();

// ---------- daily shelf: drag (or tap two) books into spine-colour order; it cannot go wrong, it only has to end sorted
let bsOrder = [], bsSel = -1, bsDrag = null, bsDone = false;
function openSort() {
  if (!AC) initAudio();
  const pick = BK_ORDER.slice().sort(() => Math.random() - 0.5).slice(0, 6);
  do pick.sort(() => Math.random() - 0.5); while (bsSorted(pick));
  bsOrder = pick; bsSel = -1; bsDone = false; bsRender();
  $('#bksort').classList.add('show'); bkThump(0.6);
}
function bsSorted(a) { return a.every((c, i) => !i || BK_ORDER.indexOf(a[i - 1]) < BK_ORDER.indexOf(c)); }
function bsRender() {
  $('#bs-row').innerHTML = bsOrder.map((c, i) => `<img class="bs-b${i === bsSel ? ' sel' : ''}" data-i="${i}" src="${ITEM_IMG['book_' + c]}" alt="Sách gáy ${c}" draggable="false" style="height:${(BK_BOOK_H[c] / 272 * 100).toFixed(1)}%">`).join('');
}
const bsRow = $('#bs-row');
bsRow.addEventListener('pointerdown', e => {
  const b = e.target.closest('.bs-b'); if (!b || bsDone) return;
  e.preventDefault(); bsDrag = { b, i: +b.dataset.i, x0: e.clientX, moved: false };
  try { b.setPointerCapture(e.pointerId); } catch (_) {}
  b.classList.add('lift'); bkThump(0.35);
});
bsRow.addEventListener('pointermove', e => {
  if (!bsDrag) return; const dx = e.clientX - bsDrag.x0;
  if (Math.abs(dx) > 6) bsDrag.moved = true;
  bsDrag.b.style.transform = `translate(${dx}px, -10px) rotate(${Math.max(-8, Math.min(8, dx / 12))}deg)`;
});
function bsDrop(e) {
  if (!bsDrag) return; const { b, i, moved } = bsDrag; bsDrag = null;
  if (!moved) {
    if (bsSel < 0) { bsSel = i; bsRender(); return; }
    if (bsSel !== i) { [bsOrder[bsSel], bsOrder[i]] = [bsOrder[i], bsOrder[bsSel]]; bkThump(0.7); }
    bsSel = -1; bsRender(); bsCheck(); return;
  }
  const r = b.getBoundingClientRect(), cx = r.left + r.width / 2;
  const others = [...bsRow.querySelectorAll('.bs-b')].filter(x => x !== b);
  let to = others.filter(x => { const q = x.getBoundingClientRect(); return q.left + q.width / 2 < cx; }).length;
  const c = bsOrder.splice(i, 1)[0]; bsOrder.splice(to, 0, c);
  bsSel = -1; bkThump(0.7); bsRender(); bsCheck();
}
bsRow.addEventListener('pointerup', bsDrop);
bsRow.addEventListener('pointercancel', bsDrop);
function bsCheck() {
  if (!bsSorted(bsOrder)) return;
  bsDone = true; SFX.sparkle();
  bsRow.querySelectorAll('.bs-b').forEach((b, k) => setTimeout(() => { bump(b, 'hop'); bkTone(520 + k * 90, 0.18, 0.025, 'triangle'); }, k * 110));
  setTimeout(() => { $('#bksort').classList.remove('show'); sortDone(); }, 1500);
}
$('#bksort').addEventListener('click', e => {
  e.stopPropagation();
  if (e.target.id === 'bksort' || e.target.closest('#bs-x')) { $('#bksort').classList.remove('show'); SFX.click(); }
});
function sortDone() {
  S.bk.sortDay = dayKey(); S.bk.sortN++;
  if (S.story.khai === 0) {   // chapter 1: the borrow card with your name
    S.story.khai = 1; S.keep.bk_card = 1; save(); applyBk();
    showPaper(`<img class="paper-img" src="${ITEM_IMG.khai_smile}" alt="" style="max-height:9em">${staged([KHAI.sorted[0], KHAI.card],
      `<img class="paper-img" src="${ITEM_IMG.bk_card}" alt="" style="max-height:8em"><p>Ông Khải lấy bút mực ra, nheo mắt sau cặp kính: “Cháu tên gì để ông ghi lên thẻ?”</p>
       <input id="bk-name" maxlength="24" placeholder="Tên của bạn (không bắt buộc)" style="width:100%;font:inherit;padding:.4em .6em;border:1.5px solid #C9A982;border-radius:10px;background:#fffdf7">
       <button class="reply" id="bk-name-ok">Nhận thẻ mượn sách 📇</button>`)}`, null, true);
    stageReveal(true);
    const ok = $('#bk-name-ok');
    ok.addEventListener('click', e => {
      e.stopPropagation(); S.bk.name = ($('#bk-name').value || '').trim().slice(0, 24); save(); bkStampSnd(); SFX.sparkle(); closeNote();
      setTimeout(() => toast('Thẻ mượn sách đã cất vào hộp kỷ vật 📇 Giờ có thể mượn một cuốn mang về gác', 4200), 500);
    });
    $('#bk-name').addEventListener('click', e => e.stopPropagation());
    return;
  }
  save(); applyBk(); applyMapBtn();
  bkSay(KHAI.sorted[S.bk.sortN % KHAI.sorted.length]);
}

// ---------- borrow / read at home / return
function bkBorrow() {
  if (S.story.khai < 1) { bkSay(KHAI.ch1[1]); return; }
  if (S.bk.loan) { bkSay(KHAI.reading); return; }
  if (S.bk.wantFlower) { bkFlowerPick(); return; }
  if (S.bk.sortDay !== dayKey() && S.story.khai < 5) { bkSay(KHAI.needSort); return; }
  const n = S.bk.loans % BOOKS.length;
  S.bk.loan = { n, pages: 0, readDay: '' }; S.bk.loans++; save(); applyBk(); applyBkBook(); applyMapBtn();
  bkThump(1); bkPage();
  bkSay(S.story.khai >= 5 ? KHAI.gold : KHAI.borrow);
  setTimeout(() => toast(`Mượn cuốn “${BOOKS[n].t}” 📖 Ông Khải đã đặt sẵn trên bàn ở gác, mỗi ngày đọc một trang nhé`, 4400), 1800);
}
function bkReadTap() {
  const L = S.bk.loan; if (!L) return;
  const B = BOOKS[L.n]; bump($('#p-bkbook'), 'wig');
  if (L.pages >= 3) { bkThump(0.5); toast(`Đọc xong “${B.t}” rồi 📚 Ra bản đồ, mang sách xuống trả ông Khải nhé`, 3600); return; }
  if (L.readDay === dayKey() && !forceBk) { bkPage(); toast('Hôm nay đọc một trang thôi, sách cũ không thích bị vội 📖 (ông Khải dặn)', 3400); return; }
  L.pages++; L.readDay = dayKey(); save(); bkPage(); applyMapBtn();
  const daisy = L.n === 0 && L.pages === 3 && S.story.khai === 1;
  showPaper(`<h3 style="margin:.1em 0 .2em">${B.t}</h3><small>Trang ${L.pages}/3</small><p class="bub">${B.p[L.pages - 1]}</p>` +
    (daisy ? '<small class="more">Chạm để đọc tiếp…</small><div class="after" hidden><p class="bub">Lật sang trang cuối, một bông cúc ép khô rơi ra, kẹp cùng mẩu giấy nhỏ viết tay: “Gửi anh, mùa hoa đầu tiên.”</p>' +
      `<img class="paper-img" src="${ITEM_IMG.bk_daisy}" alt="" style="max-height:5em"> <img class="paper-img" src="${ITEM_IMG.bk_note}" alt="" style="max-height:5em"><small>Đã cất vào hộp kỷ vật. Mang sách xuống trả ông Khải nhé.</small></div>`
      : L.pages >= 3 ? '<small>Đọc xong rồi. Ra bản đồ, mang sách xuống trả ông Khải nhé 📚</small>' : '<small>Mai đọc tiếp trang sau nhé.</small>'), null, daisy);
  if (daisy) { S.keep.bk_daisy = 1; save(); stageReveal(false); setTimeout(() => SFX.sparkle(), 300); }
}
function bkReturn() {
  const L = S.bk.loan; if (!L || L.pages < 3) { bkSay(KHAI.reading); return; }
  S.bk.loan = null; S.bk.stamps++; save(); applyBkBook(); bkStampSnd(); bkThump(0.8);
  setTimeout(() => toast(`Cộp! Thẻ mượn sách được đóng thêm một dấu (${S.bk.stamps}) 📇`, 2600), 300);
  const k = S.story.khai;
  if (k === 1 && L.n === 0) { S.story.khai = 2; save(); applyBk(); bkQ = KHAI.ch2.slice(); setTimeout(bkNext, 1200); return; }
  if (k === 2) { applyBk(); setTimeout(bkReadAloud, 900); return; }
  if (k === 3) { S.bk.wantFlower = 1; save(); applyBk(); setTimeout(bkFlowerPick, 900); return; }
  if (k === 4) { setTimeout(bkAlbumGift, 900); applyBk(); return; }
  applyBk(); bkSay(KHAI.thanks[S.bk.stamps % KHAI.thanks.length]);
}
function bkReadAloud() {   // chapter 3: the words appear slowly, like the tea breathing; then pick a line for the notebook
  $('#bk-open').style.opacity = 1;
  showPaper(`<img class="paper-img" src="${ITEM_IMG.khai_read}" alt="" style="max-height:8em">` + staged([KHAI.ch3ask, ...READ_ALOUD],
    `<p>Đọc xong, bạn muốn chép câu nào vào sổ tay?</p>${QUOTE_PICK.map((q, i) => `<button class="reply" data-quote="${i}">“${q}”</button>`).join('')}`), null, true);
  stageReveal(true);
  document.querySelectorAll('#note [data-quote]').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation(); S.bk.quote = QUOTE_PICK[+b.dataset.quote]; S.story.khai = 3; save(); SFX.paper(); closeNote(); applyBk();
    $('#bk-open').style.opacity = 0; bkSay(KHAI.ch3ok);
    setTimeout(() => toast('Câu tâm đắc đã chép vào Sổ tay (xem ở Trang cũ) ✍️', 3600), 2400);
  }));
}
function bkFlowers() { return Object.keys(BM_FLOWER).filter(k => S.keep[k] > 0); }
function bkFlowerPick() {
  const have = bkFlowers();
  if (!have.length) { S.bk.wantFlower = 1; save(); applyBk(); bkSay(KHAI.ch4none); return; }
  openPanel(`<h3>Kẹp một bông hoa ép vào sách</h3><p>${KHAI.ch4ask}</p><div class="bm-pick">${have.map(k => `<button class="reply" data-flower="${k}"><img src="${ITEM_IMG[BM_FLOWER[k][1]]}" alt="" style="height:2.2em;vertical-align:middle;margin-right:.5em">${BM_FLOWER[k][0]} · ${BM_FLOWER[k][2]}</button>`).join('')}</div><small>Chạm ra ngoài để để sau</small>`);
  document.querySelectorAll('#note [data-flower]').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation(); const k = b.dataset.flower;
    if (S.keep[k] > 1) S.keep[k]--;   // the last one of a kind stays in the box (a petal is enough)
    S.bk.wantFlower = 0; S.bk.flower = k; S.story.khai = 4; save(); closeNote(); applyBk(); bkPage(); SFX.sparkle();
    bkSay(KHAI.ch4);
    setTimeout(() => toast(`Bông ${BM_FLOWER[k][0].toLowerCase()} ép đã nằm trong ngăn “Sách có hoa” của tiệm 🌼`, 3600), 3000);
  }));
}
function bkAlbumGift() {   // chapter 5: grandma's pressed-flower album, the gold card, the open-book stamp, the painting
  S.story.khai = 5; S.keep.bk_album = 1; S.keep.bk_card_gold = 1; S.keep.st_book = 1; S.keep.painting_bookshop = 1; delete S.keep.bk_card; save(); applyBk();
  showPaper(`<img class="paper-img" src="${ITEM_IMG.khai_smile}" alt="" style="max-height:9em">` + staged([KHAI.ch5],
    `<img class="paper-img" src="${ITEM_IMG.bk_album}" alt="" style="max-height:7em"> <img class="paper-img" src="${ITEM_IMG.bk_card_gold}" alt="" style="max-height:6em"><small>— Ông Khải, Tiệm Sách Cuối Hẻm —</small>
     <small>Nhận: Sổ ép hoa của bà · Thẻ mượn sách vàng · con dấu Quyển Sách Mở 📖 · tranh “Tiệm Sách Cuối Hẻm” (treo lên tường trong Hộp kỷ vật)</small>`), null, true);
  stageReveal(false); SFX.sparkle(); setTimeout(() => SFX.chime(0.4), 600);
}
function bkAlbum() {
  const got = Object.keys(BM_FLOWER).filter(k => S.keep[k] > 0 || (S.harvested && S.harvested[k]));
  openPanel(`<h3>Sổ ép hoa của bà</h3><p style="margin:.2em 0 .6em">Những trang đầu là hoa của bà, những trang cuối là hoa của bạn: ${got.length}/${Object.keys(BM_FLOWER).length}</p>
    <div class="bk-alb">${Object.entries(BM_FLOWER).map(([k, [name, img, mean]]) => got.includes(k)
      ? `<div><img src="${ITEM_IMG[img]}" alt=""><b>${name}</b><small>${mean}</small></div>` : `<div class="empty"><span>?</span><b>…</b><small>trang còn trống</small></div>`).join('')}</div>
    ${S.bk.flower ? `<small>Bông ${BM_FLOWER[S.bk.flower][0].toLowerCase()} bạn kẹp vẫn nằm ở ngăn “Sách có hoa” dưới tiệm.</small>` : ''}<small>Chạm ra ngoài để đóng</small>`);
  bkPage();
}
function bkCard() {
  const gold = !!S.keep.bk_card_gold;
  showPaper(`<div style="position:relative;display:inline-block"><img class="paper-img" src="${ITEM_IMG[gold ? 'bk_card_gold' : 'bk_card']}" alt="" style="max-height:11em">
    <b style="position:absolute;left:0;right:0;top:4%;font:1.05em 'Patrick Hand',cursive;color:#3c4a7a;transform:rotate(-3deg)">${esc(S.bk.name || 'Cháu ở căn gác')}</b></div>
    <p>${gold ? 'Thẻ mượn sách vàng: mượn bao lâu tuỳ thích.' : 'Thẻ mượn sách của Tiệm Sách Cuối Hẻm.'} Đã đóng ${S.bk.stamps} dấu.</p>`, null);
  bkStampSnd();
}

// ---------- the borrowed book lies on the attic desk
function applyBkBook() {
  const L = S.bk.loan, el = $('#p-bkbook'), on = !!L;
  el.style.opacity = on ? 1 : 0; HITS.bkbook.el.style.display = on ? '' : 'none';
  if (on) { const c = BOOKS[L.n].c, h = 118, w = h * { red: 53 / 266, orange: 51 / 236, amber: 53 / 272, yellow: 55 / 247, green: 58 / 224, sage: 48 / 242, blue: 55 / 268, brown: 94 / 233 }[c];
    el.src = ITEM_IMG['book_' + c]; place(el, BKB[0] + BKB[2] / 2 - w / 2, BKB[1] + BKB[3] / 2 - h / 2, w, h); }
  el.classList.toggle('done', !!(L && L.pages >= 3));
}

// ---------- hook into the map, the landlady and the rest of the game
(function () {
  const spot = $('#amap [data-go="books"]');
  const base = openMap;
  openMap = function () { spot.style.display = bkOpen() ? '' : 'none'; spot.classList.toggle('news', bkNews()); base(); };
  $('#amap').addEventListener('click', e => { const b = e.target.closest('[data-go="books"]'); if (!b) return; e.stopPropagation(); enterBk(); }, true);
  const baseMB = applyMapBtn;
  applyMapBtn = function () { baseMB(); if (mapOpen()) mapBtn.classList.toggle('news', mapBtn.classList.contains('news') || bkNews()); };
  const baseOut = outsideOpen;
  outsideOpen = function () { return baseOut() || $('#bks').classList.contains('show') || $('#bksort').classList.contains('show'); };
  const baseLady = openMailbox;   // after the flower shop, the landlady tells you about ông Khải once
  openMailbox = function () {
    baseLady();
    if (S.shop.visited && !S.bkIntro && S.weather !== 'night') {
      S.bkIntro = 1; save(); ladyHere = true; applyMailbox();
      ladyQ = []; mboxSay(LADY_BK);
    }
  };
})();
JOURNAL.push({ who: 'Ông Khải Tiệm Sách', by: 'Thẻ mượn sách', img: 'bk_front', ch: [
  { t: 'Ngăn Sách Bụi', ok: st => (st.khai || 0) >= 1, x: 'Cuối hẻm có tiệm sách cũ của ông Khải. Mắt ông kém dần, mấy ngăn sách lộn xộn hết cả. Bạn phụ ông xếp lại một ngăn theo màu gáy, ông viết tên bạn lên một tấm thẻ mượn sách: “Luật của bà nhà ông đặt ra từ hồi xưa đấy.”' },
  { t: 'Bông Cúc Trong Trang Sách', ok: st => (st.khai || 0) >= 2, x: 'Cuốn sách đầu tiên mượn về, đọc tới trang cuối thì rơi ra một bông cúc ép và dòng chữ nhỏ “Gửi anh, mùa hoa đầu tiên.” Là chữ của bà nhà ông Khải. Ông nhờ bạn giữ giúp bông cúc thêm vài hôm, ông chưa đủ can đảm để nhìn lâu.' },
  { t: 'Đọc To Một Trang', ok: st => (st.khai || 0) >= 3, x: 'Ông Khải nhờ bạn đọc to một trang sách: lâu rồi tiệm không có tiếng người đọc. Bạn chép một câu tâm đắc vào sổ tay, ông bảo bà nhà ông cũng thích câu ấy.' },
  { t: 'Bông Hoa Của Cháu', ok: st => (st.khai || 0) >= 4, x: 'Bạn kẹp một bông hoa ép của mình vào cuốn sách trả lại. Ông Khải mở riêng một ngăn “Sách có hoa”: ai mượn cũng được kẹp lại một bông, cho tiệm có thêm chút mùa xuân.' },
  { t: 'Cuốn Sổ Ép Hoa', ok: st => (st.khai || 0) >= 5, x: 'Ông Khải trao cho bạn cuốn sổ ép hoa của bà, còn trống mấy trang cuối để bạn điền tiếp, cùng tấm thẻ mượn sách vàng và bức tranh “Tiệm Sách Cuối Hẻm”.' }] });
applyBkBook();
