// ================================================================ After-1.0 deepening (Vi 28/11, from the review she pasted)
// 1. Two-way replies on the clockmaker and Ms. Hạnh routes: the player writes back, the neighbour answers it.
// 2. "Chuyện cả hẻm": after every route (and the all-lit night) the epilogue letters grow into one arc for the whole lane:
//    stage 1 = each neighbour's own new rhythm (EPILOGUE, extras.js), stage 2 = neighbours helping each other,
//    stage 3 = the lane plants a bougainvillea arch at the corner together (the player picks what to bring).
// 3. Tết year 2: Bà Lan's son Hoàng keeps last year's promise and comes up to the attic (tet.js calls tetSon / tetFinal2).
// 4. Focus corner: the candle burns 15/25/45 minutes, with up to 3 small to-dos, and a sound mixer
//    (rain, night crickets, breeze, soft piano, Biscuit purring, radio) usable any time from the sound panel.
const LANE_TEST = /[?&]chuyenhem\b/.test(location.search);

// ---------------------------------------------------------------- 1a. the clockmaker: a reply after the blackout letter
const OLD_REPLY = [
  ['Đêm nào mất điện, cháu sẽ để đèn bên này sáng lâu hơn một chút, để bác nhìn sang cho đỡ tối.',
    'Bác nhận được thư rồi. Tối qua hẻm lại cúp điện, bác nhìn sang thấy ô cửa nhà cháu vẫn sáng, thế là bác ngồi lên dây cót cho cả tủ đồng hồ, chẳng thấy tối chút nào. Từ nay đèn bên này bác cũng để sáng, cho cháu biết bên kia đường vẫn có người thức cùng.'],
  ['Cháu cảm ơn bác. Giờ đẹp nhất trong ngày của cháu là lúc ngồi bên cửa sổ, nghe tiếng hộp nhạc của bác.',
    'Đọc thư cháu, bác cười mãi. Bác lấy chiếc đồng hồ đeo tay của bà nhà ra lau lại, lên dây cho nó chạy. Bao nhiêu năm rồi, tiệm bác mới lại có thêm một chiếc đồng hồ chạy đúng giờ đẹp nhất trong ngày.'],
];
function oldReplyTick() {
  const st = S.story;
  if ((st.old || 0) < 3 || st.oldReply != null) return;
  if (Date.now() - (st.oldAt || 0) < 4000 || $('#note-wrap').classList.contains('show') || outsideOpen()) return;
  showPaper(`<img class="paper-img" src="${ITEM_IMG.watch || ITEM_IMG.old_window}" alt="" style="max-height:4.5em"><p class="bub">Chiếc đồng hồ quả quýt của bác nằm yên trên bàn. Bạn viết vài dòng hồi âm, nhờ chú chim sẻ mang sang bên kia đường:</p>` +
    OLD_REPLY.map((r, k) => `<button class="reply" data-or="${k}">✉️ “${r[0]}”</button>`).join(''), null, true);
  document.querySelectorAll('#note [data-or]').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation(); st.oldReply = +b.dataset.or; st.oldReplyAt = Date.now(); st.oldAnswer = 0; save(); closeNote(); SFX.flutter();
    toast('Chú chim sẻ ngậm mẩu giấy bay sang bên kia đường 🐦', 3200);
  }));
}
function oldAnswerTick() {
  const st = S.story;
  if (st.oldReply == null || st.oldAnswer) return;
  if (Date.now() - st.oldReplyAt < (TESTMODE || LANE_TEST ? 5000 : 6 * HOUR) || !storyGate('oldAnswer')) return;
  st.oldAnswer = 1; save(); SFX.flutter();
  showPaper(`<img class="paper-img" src="${ITEM_IMG.old_window}" alt="">${staged([OLD_REPLY[st.oldReply][1]], '<small>— Bác sửa đồng hồ bên kia đường —</small>')}`, null); stageReveal(false);
}

// ---------------------------------------------------------------- 1b. Ms. Hạnh: the player requests the first piece of the weekend class
const HANH_REPLY = [
  ['Cô ơi, buổi học đầu tiên cô cho các bạn nhỏ đàn bài “Kìa Con Bướm Vàng” nhé. Sáng hôm đó cháu sẽ mở cửa sổ ngồi nghe.', 'Kìa Con Bướm Vàng'],
  ['Cô ơi, cháu xin đặt trước một bài: “Con Cò Bé Bé”. Bé Na tập được rồi, cô cho bé đàn đầu tiên nhé.', 'Con Cò Bé Bé'],
];
const H_L5 = H.l5.slice();
function hanhPS() {
  const r = S.hanh.reply; if (r == null) return;
  H.l5 = H_L5.concat(`P.S. Sáng thứ Bảy đầu tiên, cả lớp đã đàn bài “${HANH_REPLY[r][1]}” cháu đặt. Bé Na sai mất hai nốt mà cả hẻm vẫn vỗ tay. Cô thấy cửa sổ căn gác mở, cô biết cháu đang nghe.`);
}
hanhPS();
function hanhReplyTick() {
  if (S.story.hanh !== 4 || S.hanh.reply != null || S.hanh.mail || $('#note-wrap').classList.contains('show') || outsideOpen()) return;
  showPaper(`${hpic('hanh_metronome', '⏱️', 4)}<p class="bub">Chiếc máy đếm nhịp gõ tích tắc trên bàn. Bạn gấp một chiếc thuyền giấy, viết gửi cô Hạnh:</p>` +
    HANH_REPLY.map((r, k) => `<button class="reply" data-hr="${k}">🎵 “${r[0]}”</button>`).join(''), null, true);
  document.querySelectorAll('#note [data-hr]').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation(); S.hanh.reply = +b.dataset.hr; save(); hanhPS(); closeNote(); SFX.paper();
    toast('Chiếc thuyền giấy đã nằm trong hòm thư dưới chân cầu thang, chờ cô Hạnh ghé lấy ⛵', 3600);
  }));
}
// both replies stay readable in the book of letters, inside their chapter
function withReply(ch, more) { const base = ch.x; Object.defineProperty(ch, 'x', { get: () => base + more(), configurable: true }); }
withReply(JOURNAL[0].ch[3], () => S.story.oldReply == null ? '' : ` Bạn hồi âm: “${OLD_REPLY[S.story.oldReply][0]}”` + (S.story.oldAnswer ? ` Bác viết lại: “${OLD_REPLY[S.story.oldReply][1]}”` : ''));
const hanhJ = JOURNAL.find(L => L.img === 'hanh_smile');
if (hanhJ) withReply(hanhJ.ch[3], () => S.hanh.reply == null ? '' : ` Bạn gửi cô một chiếc thuyền giấy: “${HANH_REPLY[S.hanh.reply][0]}”`);

// ---------------------------------------------------------------- 2. Chuyện cả hẻm: one arc for the whole lane after every story
const LANE = [
  { st: 2, img: 'old_window', who: 'Bác sửa đồng hồ bên kia đường', t: 'Hai Ông Già, Một Ấm Trà',
    b: ['Hôm qua ông Khải ở tiệm sách mang sang chiếc đồng hồ treo tường của bà nhà ông, đứng kim đã mấy năm nay.',
      'Bác sửa cả buổi chiều, ông ngồi bên cạnh đọc sách cho bác nghe. Hai ông già, một cái bàn, một ấm trà, vậy mà vui như hội. Lúc kim đồng hồ nhích lại, ông Khải đứng lặng một lúc lâu rồi mới cười.'] },
  { st: 2, img: 'florist', who: 'Chị bán hoa đầu hẻm', t: 'Hoa Đổi Lấy Nhạc',
    b: ['Em ơi, cô Hạnh nhờ chị sáng thứ Bảy nào cũng mang sang một bó hoa nhỏ cắm trên nóc đàn cho lớp nhạc.',
      'Đổi lại, bé Na với tụi nhỏ ghé tiệm đàn cho chị nghe một bài bằng cây kèn đồ chơi. Khách đi ngang cứ đứng lại nghe, có người mua luôn bó hoa mang về. Chị bảo đây là “hoa đổi lấy nhạc”, tụi nhỏ khoái lắm.'] },
  { st: 2, img: 'pc_station', who: 'Minh', t: 'Tấm Biển Có Vết Sơn',
    b: ['Mình với cậu họa sĩ tầng trên vừa sơn lại tấm biển cho tiệm sách của ông Khải. Cậu ấy kẻ chữ, mình đứng giữ thang và… làm đổ mất nửa hộp sơn xanh.',
      'Tưởng bị mắng, ai ngờ ông Khải cười bảo cứ để vết sơn đó, sau này nhìn vào là nhớ ra hôm nay. Thì ra ở hẻm này, đến vết sơn đổ cũng thành kỷ niệm.'] },
  { st: 3, img: 'landlady', who: 'Bà chủ nhà tầng dưới', t: 'Đầu Ngõ Còn Trống', pick: 1,
    b: ['Cháu ơi, tối qua cả hẻm ngồi uống trà trước sân nhà bà. Ai cũng bảo đầu ngõ trống trơn, chỉ có cột điện với mấy sợi dây.',
      'Bà mới nảy ra ý: mình trồng một giàn hoa giấy ở đó, để ai đi làm về cũng thấy con hẻm đang đón mình. Bác sửa đồng hồ nhận đóng giàn, chị Thảo chọn cây, cậu họa sĩ vẽ tấm bảng tên.',
      'Cả hẻm ai cũng góp một tay. Còn cháu, cháu muốn góp gì nào?'] },
  { st: 3, img: 'na_cat', who: 'Na', t: 'Ngày Cả Hẻm Trồng Hoa',
    b: ['Hôm nay cả hẻm trồng hoa giấy đó! Bác đồng hồ đóng cái giàn gỗ, anh họa sĩ treo tấm bảng “Hẻm Hoa Giấy”, Minh với ông Khải đào đất, cô Hạnh dạy tụi em hát.',
      '{gift}', 'Còn Bánh Quy thì nằm lăn trên đống đất mới, không chịu đi đâu hết. Mẹ em phải tắm cho nó hai lần luôn.'] },
  { st: 3, img: 'landlady', who: 'Bà chủ nhà tầng dưới', t: 'Giàn Hoa Đầu Ngõ', end: 1,
    b: ['Mấy tuần rồi, giàn hoa giấy đầu ngõ đã trổ những chùm hồng đầu tiên. Chiều nào bà cũng mang ghế ra đó ngồi, nhìn từng người trong hẻm đi làm về.',
      'Hồi cháu mới dọn tới, căn gác chỉ có một khung cửa sổ phủ bụi, con hẻm thì nhà ai nấy đóng cửa. Giờ thì cả con hẻm như một khung cửa mở ra.',
      'Bà già rồi, chẳng biết nói gì hay. Chỉ muốn cảm ơn cháu, vì đã mở cánh cửa sổ ấy trước tiên.'] },
];
const LANE_GIFT = [
  ['🌱', 'Một chậu cây con từ bệ cửa', 'Anh chị gửi xuống một chậu cây con trên bệ cửa, chị Thảo trồng ngay dưới chân giàn, bảo là “cây của căn gác”.'],
  ['🍵', 'Một ấm trà cho cả hẻm', 'Anh chị pha một ấm trà to gửi xuống, cả hẻm làm xong là ngồi bệt xuống đất uống, ai cũng khen thơm.'],
  ['📻', 'Mang radio ra bệ cửa mở nhạc', 'Anh chị mở radio thật to trên bệ cửa, cả hẻm vừa trồng cây vừa hát theo. Cô Hạnh bảo bài nào cũng đúng nhịp hết.'],
];
const LANE_GAP = 7 * 24 * 3600e3;
function laneStart() {   // stage 1 (each neighbour's own letters) comes first: the arc begins a week after the all-lit night
  if (LANE_TEST) return true;
  if (!S.allLit || !allSeven()) return false;
  const firsts = JOURNAL.every((L, li) => S.epi && S.epi[li] && S.epi[li].n >= 1);
  return Date.now() - S.allLit >= (firsts ? LANE_GAP : 3 * LANE_GAP);
}
function laneText(i) { const L = LANE[i]; return L.b.map(t => t === '{gift}' ? (S.lane.gift != null ? LANE_GIFT[S.lane.gift][2] : '') : t).filter(Boolean); }
function laneTick() {
  S.lane = S.lane || { n: 0, at: 0, gift: null };
  const ln = S.lane; if (ln.n >= LANE.length || !laneStart()) return;
  if (!LANE_TEST && (Date.now() - ln.at < LANE_GAP || S.epiDay === dayKey())) return;
  if (!storyGate('lane' + ln.n)) return;
  const i = ln.n, L = LANE[i], pic = ITEM_IMG[L.img] ? `<img class="paper-img" src="${ITEM_IMG[L.img]}" alt="" style="max-height:6em">` : '';
  const stageName = L.st === 2 ? 'Chuyện cả hẻm · Hàng xóm giúp nhau' : 'Chuyện cả hẻm · Giàn hoa đầu ngõ';
  const head = `<small style="margin:0 0 .6em">${stageName}</small>`, sig = `<small>— ${L.who} —</small>`;
  const done = () => { ln.n = i + 1; ln.at = Date.now(); S.epiDay = dayKey(); save(); };
  if (L.pick) {
    showPaper(head + pic + staged(L.b, sig + LANE_GIFT.map((g, k) => `<button class="reply" data-lg="${k}">${g[0]} ${g[1]}</button>`).join('')), null, true); stageReveal(true);
    const go = () => { const bs = document.querySelectorAll('#note [data-lg]'); if (!bs.length) return setTimeout(go, 300);
      bs.forEach(b => b.addEventListener('click', e => { e.stopPropagation(); ln.gift = +b.dataset.lg; done(); closeNote(); SFX.paper(); hearts();
        toast('Bà ghi tên bạn vào danh sách góp tay rồi 🌸 Tuần sau cả hẻm trồng hoa', 3600); })); };
    go(); return;
  }
  showPaper(head + pic + staged(laneText(i), sig + (L.end ? '<small>Câu chuyện của cả con hẻm đã trọn vẹn 🌸 đọc lại trong Sổ Lời nhắn</small>' : '')), () => {
    done(); if (L.end) { petals(30); SFX.sparkle(); setTimeout(() => SFX.chime(0.5), 800); toast('Giàn hoa giấy đầu ngõ đã nở 🌸', 3600); }
  }); stageReveal(false);
}
// the book of letters: a "Chuyện cả hẻm" section (Hoàng's Tết visit + the lane arc) under the seven routes
function laneRows() {
  const rows = [];
  if (S.hoang) rows.push(`<details class="jc"><summary><b>Tết năm sau</b> · Anh Hoàng Về Nhà</summary><p>${HOANG.b1.join(' ')} ${HOANG.b2.join(' ')}${S.hoang.fin ? ' ' + HOANG.fin.join(' ') : ''}</p></details>`);
  const n = S.lane ? S.lane.n : 0;
  for (let i = 0; i < n; i++) rows.push(`<details class="jc"><summary><b>${LANE[i].st === 2 ? 'Hàng xóm giúp nhau' : 'Giàn hoa đầu ngõ'}</b> · ${LANE[i].t}</summary><p>${laneText(i).join(' ')}</p><small>— ${LANE[i].who} —</small></details>`);
  if (!rows.length) return '';
  return `<div class="jl"><div class="jh">${ITEM_IMG.landlady ? `<img src="${ITEM_IMG.landlady}" alt="">` : ''}<span><b>Chuyện Cả Hẻm</b><small>Những lá thư của cả con hẻm</small></span></div>${rows.join('')}</div>`;
}
const _openJournalLane = openJournal;
openJournal = function (open) {
  _openJournalLane(open);
  const extra = laneRows(); if (!extra) return;
  $('#j-back').insertAdjacentHTML('beforebegin', extra);
  document.querySelectorAll('#note details').forEach(d => d.addEventListener('click', e => e.stopPropagation()));
};

// ---------------------------------------------------------------- 3. Tết year 2: Hoàng comes home (art: Vi 28/11, son_shy / son_smile / oil_lamp / st_train)
const HOANG = {
  lady: ['Tết năm nay khác rồi cháu ơi! Thằng Hoàng nhà bà về thật rồi, về từ hôm hai mươi lăm, xách theo cả một ba lô quà.',
    'Nó cứ đòi lên gác chào cháu, mà ngại, đứng dưới chân cầu thang cả buổi. Bà mang lên trước đĩa bánh chưng với khay mứt gừng, lát nữa nó lên sau nhé.'],
  b1: ['Có tiếng gõ cửa khe khẽ. Một anh thanh niên đứng ở đầu cầu thang, tay cầm chiếc đèn dầu cũ, gãi đầu cười ngượng.',
    '“Chào em, anh là Hoàng, con trai bà Lan. Hồi nhỏ anh ở căn gác này, tối nào cũng ngồi học bài bên khung cửa sổ đó.”',
    '“Mẹ anh kể suốt về chậu cây, về con mèo, về ô cửa lúc nào cũng sáng đèn. Năm nào anh cũng hứa về rồi lại lỡ. Năm nay anh phải lên tận đây cảm ơn em một tiếng.”'],
  say: ['Anh vào ngồi uống tách trà đã. Anh về, bà vui lắm đó.', 'Căn gác vẫn giữ chỗ cho anh mà. Khung cửa này đẹp nhất lúc chiều đó anh.'],
  b2: ['Anh Hoàng ngồi bên bệ cửa, nhìn ra con hẻm rất lâu. Bánh Quy leo lên đùi anh nằm, như quen nhau từ trước.',
    '“Chiếc đèn dầu này anh thắp học bài suốt mấy năm cấp ba. Mẹ cất trong tủ, anh mang lên trả lại cho căn gác. Tối nào mất điện, em thắp nó lên nhé.”',
    '“Ở xa, anh hay mở ảnh mẹ gửi: ô cửa này sáng đèn. Tự nhiên thấy nhà mình gần lại. Cảm ơn em đã ở đây với mẹ.”'],
  fin: ['Mai thằng Hoàng lại khăn gói đi làm xa rồi cháu ạ. Năm nay nó ở nhà trọn mấy ngày Tết, sáng nào cũng dậy sớm quét sân, chiều thì sang đánh cờ với bác sửa đồng hồ.',
    'Tối qua nó lên gác ngồi với cháu với Bánh Quy tới khuya, xuống nhà cứ cười mãi. Nó bảo lâu lắm rồi mới thấy căn gác của mình ấm như vậy.',
    'Mâm cơm Tết năm nay nhà bà đủ người, bà chẳng mong gì hơn. Cảm ơn cháu đã giữ ô cửa ấy sáng đèn cho mẹ con bà.'],
};
if (ITEM_IMG.st_train) STAMPS.push(['🚂', 'Chuyến Tàu Về Nhà', 'st_train', 'st_train']);
function tetYear2() {
  if (/[?&]tet2\b/.test(location.search)) return true;
  const d = S.tetDone, t = S.tet; if (!d || !t) return false;
  return t.id !== d.id && t.id !== 'free' && t.id !== 'test' && Date.now() - d.at > 40 * 864e5;
}
const face = (k, h) => ITEM_IMG[k] ? `<img class="paper-img" src="${ITEM_IMG[k]}" alt="" style="max-height:${h}em">` : '';
function tetSon(t) {   // called from applyTet once the tray is on the desk
  if (!tetYear2() || t.son || Date.now() - storyLast < 60000 || !storyGate('tetSon' + t.id)) return;
  t.son = 1; save();
  showPaper(face('son_shy', 9) + staged(HOANG.b1, HOANG.say.map((s, k) => `<button class="reply" data-hg="${k}">💬 “${s}”</button>`).join('')), null, true); stageReveal(true);
  const go = () => { const bs = document.querySelectorAll('#note [data-hg]'); if (!bs.length) return setTimeout(go, 300);
    bs.forEach(b => b.addEventListener('click', e => {
      e.stopPropagation(); const k = +b.dataset.hg; SFX.paper();
      const lead = k === 0 ? 'Bạn rót cho anh một tách trà. Anh nâng tách bằng cả hai tay, như hồi nhỏ được mẹ dặn.' : 'Anh Hoàng bật cười: “Đúng rồi, hồi nhỏ chiều nào anh cũng ngồi đây chờ mẹ đi chợ về.”';
      showPaper(face('son_smile', 9) + staged([lead].concat(HOANG.b2), face('oil_lamp', 5) + face('st_train', 3.6) + '<small>Nhận chiếc đèn dầu cũ của anh Hoàng (đặt trên bàn) và con dấu “Chuyến Tàu Về Nhà” 🚂</small><small>— Anh Hoàng, con trai bà Lan —</small>'), () => {
        t.son = 2; S.keep.oil_lamp = 1; S.keep.st_train = 1; S.oilOut = 1; S.hoang = { say: k, at: Date.now() }; save(); applyOil(); hearts();
        toast('Chiếc đèn dầu đã đặt trên bàn, chạm để thắp 🪔', 3600);
      }); stageReveal(false);
    })); };
  go();
}
function tetFinal2(t) {   // year 2: instead of the couplet, Bà Lan's letter as Hoàng leaves again
  if (!tetYear2() || t.son !== 2 || t.fin || t.lixi < lixiList().length || !storyGate('tetFin' + t.id)) return;
  t.fin = 1; save();
  showPaper(face('landlady_tet', 9) + staged(HOANG.fin, face('son_frame', 5) + '<small>— Bà chủ nhà tầng dưới —</small>'), () => {
    if (S.hoang) S.hoang.fin = 1; save(); hearts(); SFX.chime(0.5);
  }); stageReveal(false);
}
// the oil lamp on the desk: tap to light / put it out (it glows at night)
const OIL = { off: [500, 1030, 64, 118], on: [486, 1030, 92, 118] };
const oilEl = document.createElement('img'); oilEl.className = 'prop'; oilEl.id = 'p-oil'; oilEl.alt = '';
const oilHit = document.createElement('button'); oilHit.className = 'hit'; oilHit.setAttribute('aria-label', 'Đèn dầu cũ của anh Hoàng');
$('#p-incense').after(oilEl); hitsEl.append(oilHit);
function applyOil() {
  const on = !!(S.oilOut && S.keep.oil_lamp && ITEM_IMG.oil_lamp);
  oilEl.style.display = oilHit.style.display = on ? '' : 'none'; if (!on) return;
  oilEl.src = ITEM_IMG[S.oilLit ? 'oil_lamp_on' : 'oil_lamp']; place(oilEl, ...OIL[S.oilLit ? 'on' : 'off']); place(oilHit, 488, 1024, 88, 130);
}
oilHit.addEventListener('click', e => {
  e.stopPropagation(); S.oilLit = !S.oilLit; save(); applyOil(); bump(oilEl);
  if (S.oilLit) { SFX.match(); sayAt(OIL.on, S.weather === 'sunset' ? 'Ngọn lửa nhỏ trong ống khói thủy tinh, sáng ngay cả giữa ban ngày.' : 'Ánh đèn dầu vàng vọt, ấm như những tối anh Hoàng ngồi học bài ở đây.', 4200); } else SFX.click();
});
const _useItemLane = useItem;
useItem = function (k, row) {
  if (k === 'oil_lamp') { S.oilOut = !S.oilOut; save(); applyOil(); closeNote(); SFX.paper(); if (S.oilOut) toast('Đặt chiếc đèn dầu lên bàn rồi, chạm để thắp 🪔', 3000); return; }
  return _useItemLane(k, row);
};
applyOil();

// ---------------------------------------------------------------- 4. focus corner: candle length, to-dos, sound mixer
const FOCUS_MIN = [15, 25, 45], FOCUS_REST = { 15: 3, 25: 5, 45: 10 };
function focusMs() { return (S.focusMin || 25) * 60e3; }
S.focus = S.focus || { min: 25, todo: [] };
const MIX = [['rain', '🌧️ Mưa rơi'], ['night', '🦗 Dế kêu đêm'], ['day', '🍃 Gió lá ban ngày'], ['piano', '🎹 Piano khe khẽ'], ['purr', '🐈 Bánh Quy gừ gừ']];
S.mix = Object.assign({ rain: 0, night: 0, day: 0, piano: 0, purr: 0 }, S.mix || {});
const mixG = {};
let mixBus = null;
function mixEnsure(k) {
  if (!AC) return null;
  if (!mixBus) { mixBus = gain(1); mixBus.connect(master); }
  if (mixG[k]) return mixG[k];
  const g = mixG[k] = gain(0); g.connect(mixBus);
  const bedOf = { rain: 'amb_rain', night: 'amb_night', day: 'amb_day' }[k];
  if (bedOf) {
    const startBed = () => { if (!BUF[bedOf]) return false; const b = AC.createBufferSource(); b.buffer = BUF[bedOf]; b.loop = true; chain(b, gain(k === 'rain' ? 1.1 : 0.6), g); b.start(0, Math.random() * BUF[bedOf].duration); return true; };
    if (!startBed()) {
      if (k === 'rain') loopNoise('pink', chain(filt('highpass', 450), filt('lowpass', 3200), gain(0.5), g));
      else { const iv = setInterval(() => { if (startBed()) clearInterval(iv); }, 1500); }
    }
  }
  if (k === 'purr') {   // a low rumble at ~26 Hz with slow breathing
    const am = gain(0.5), br = gain(0.6); const o = AC.createOscillator(); o.frequency.value = 26; const od = gain(0.5); o.connect(od); od.connect(am.gain); o.start();
    const l = AC.createOscillator(); l.frequency.value = 0.28; const ld = gain(0.4); l.connect(ld); ld.connect(br.gain); l.start();
    loopNoise('brown', chain(filt('lowpass', 260), am, br, gain(1.4), g));
  }
  if (k === 'piano') g.connect(reverb);
  return g;
}
function mixApply(k) { const g = mixEnsure(k); if (g) g.gain.setTargetAtTime(S.mix[k] * (k === 'piano' ? 0.9 : 0.8), AC.currentTime, 0.2); }
const PENTA = [196.0, 220.0, 261.63, 293.66, 329.63, 392.0, 440.0, 523.25];
setInterval(() => {   // soft piano: a few slow notes now and then, never a tune that competes with the radio
  if (!AC || !started || document.hidden || S.muted || !(S.mix.piano > 0) || !mixG.piano) return;
  const t = AC.currentTime, n = 1 + Math.floor(Math.random() * 3), base = Math.floor(Math.random() * 5);
  for (let i = 0; i < n; i++) { const f = PENTA[Math.min(PENTA.length - 1, base + Math.floor(Math.random() * 4))]; const at = t + i * (0.5 + Math.random() * 0.4);
    tone(at, f, 2.2, 0.06, 'triangle', mixG.piano, 0.01); tone(at, f * 2, 1.0, 0.012, 'sine', mixG.piano, 0.008); }
}, 2600);
function mixStartAll() { if (AC) MIX.forEach(([k]) => { if (S.mix[k] > 0) mixApply(k); }); }
document.getElementById('intro').addEventListener('click', () => setTimeout(mixStartAll, 600));
if (started) mixStartAll();
const msl = (id, label, v) => `<label class="vol"><span>${label}</span><input type="range" id="${id}" min="0" max="100" value="${Math.round(v * 100)}"></label>`;
function mixerHtml() {
  return MIX.map(([k, label]) => msl('mx-' + k, label, S.mix[k] || 0)).join('') + msl('mx-radio', '📻 Radio (khi đang bật)', S.volRadio);
}
function bindMixer() {
  MIX.forEach(([k]) => { const el = $('#mx-' + k); if (el) el.addEventListener('input', e => { S.mix[k] = e.target.value / 100; save(); if (!AC) initAudio(); mixApply(k); }); });
  const r = $('#mx-radio'); if (r) r.addEventListener('input', e => { S.volRadio = e.target.value / 100; save(); if (radioVol) radioVol.gain.setTargetAtTime(S.volRadio, AC.currentTime, 0.05); });
}
function openMixer(back) {
  openPanel(`<h3>Bảng trộn âm thanh</h3><small style="margin:0 0 .6em">Kéo để trộn tiếng mưa, dế, gió, piano và tiếng Bánh Quy gừ gừ, nghe được cả khi trời đang nắng</small>${mixerHtml()}
    <button class="reply" id="mx-back" style="text-align:center">${back === 'focus' ? '‹ Về Góc tập trung' : '‹ Về Âm thanh'}</button>`, true);
  bindMixer();
  $('#mx-back').addEventListener('click', e => { e.stopPropagation(); back === 'focus' ? openFocus() : openSound(); });
  $('#note').addEventListener('click', e => e.stopPropagation(), { once: true });
}
const _openSoundMix = openSound;
openSound = function () {
  _openSoundMix();
  const b = document.createElement('button'); b.className = 'reply'; b.id = 'v-mixer'; b.textContent = '🎚️ Bảng trộn âm thanh';
  const v = $('#v-music'); (v ? v.closest('label') : $('#v-mute')).after(b);
  b.addEventListener('click', e => { e.stopPropagation(); openMixer('sound'); });
};
function focusLeftText() { const left = S.candleAt + focusMs() - Date.now(); return `${Math.max(1, Math.ceil(left / 60e3))} phút`; }
function openFocus() {
  const f = S.focus, lit = S.incense && S.candleAt;
  const todo = lit
    ? (f.todo.length ? f.todo.map((x, i) => `<button class="reply fc-td${x.d ? ' on' : ''}" data-td="${i}">${x.d ? '☑️' : '⬜'} ${esc(x.t)}</button>`).join('') : '')
    : [0, 1, 2].map(i => `<input class="fc-in" data-ti="${i}" maxlength="60" placeholder="${['Việc thứ nhất…', 'Việc thứ hai…', 'Việc thứ ba…'][i]}" value="${esc((f.todo[i] && f.todo[i].t) || '')}">`).join('');
  openPanel(`<h3>🕯️ Góc tập trung</h3>${lit
      ? `<small style="margin:0 0 .6em">Nến còn cháy ${focusLeftText()}. Cứ thong thả làm từng việc một.</small>${todo ? '<b class="fc-h">Việc cần làm</b>' + todo : ''}`
      : `<small style="margin:0 0 .6em">Chọn thời gian cho ngọn nến, ghi vài việc nhỏ muốn làm xong (không bắt buộc)</small>
        <div class="fc-min">${FOCUS_MIN.map(m => `<button class="fc-m${m === (f.min || 25) ? ' on' : ''}" data-min="${m}">${m} phút</button>`).join('')}</div>
        <b class="fc-h">Việc cần làm</b>${todo}`}
    <details class="fc-mix"><summary>🎚️ Bảng trộn âm thanh</summary>${mixerHtml()}</details>
    ${lit ? '<button class="reply" id="fc-out" style="text-align:center">Thổi tắt nến</button>' : '<button class="reply" id="fc-go" style="text-align:center">🕯️ Thắp nến</button>'}
    <small>Chạm ra ngoài để đóng</small>`, true);
  bindMixer();
  const note = $('#note');
  note.querySelectorAll('.fc-m').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); f.min = +b.dataset.min; save(); SFX.click();
    note.querySelectorAll('.fc-m').forEach(x => x.classList.toggle('on', x === b)); }));
  note.querySelectorAll('.fc-td').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); const x = f.todo[+b.dataset.td]; x.d = !x.d; save();
    if (x.d) { SFX.sparkle(); hearts(); } else SFX.click(); openFocus(); }));
  const go = $('#fc-go'); if (go) go.addEventListener('click', e => {
    e.stopPropagation();
    f.todo = [...note.querySelectorAll('.fc-in')].map(i => i.value.trim()).filter(Boolean).map(t => ({ t, d: false })); save();
    closeNote(); lightCandle(f.min || 25);
  });
  const out = $('#fc-out'); if (out) out.addEventListener('click', e => {
    e.stopPropagation(); S.incense = false; S.candleAt = 0; save(); applyCandle(); closeNote(); SFX.click(); toast('Đã thổi tắt nến. Nghỉ một chút rồi thắp lại cũng được 🕯️', 3000);
  });
  note.querySelectorAll('details, input').forEach(d => d.addEventListener('click', e => e.stopPropagation()));
  note.addEventListener('click', e => e.stopPropagation(), { once: true });
}
function lightCandle(min) {
  S.focusMin = min; S.incense = true; S.litOnce = 1; S.candleAt = Date.now(); save(); applyCandle(); SFX.match();
  setTimeout(() => sayAt(HITS.incense.box, flavor('candle')), 2600);
  toast(`Nến cháy ${min} phút: cùng ngồi làm việc, học bài nhé 🕯️ Chạm vào nến để xem việc cần làm`, 3800);
  if (typeof scarfLine === 'function') scarfLine();
}
function focusDone() {   // extra lines for the "candle burnt out" letter (index.template.html candleTick)
  const f = S.focus, did = f.todo.filter(x => x.d);
  const list = did.length ? `<small style="margin-top:.8em">Việc đã xong: ${did.map(x => '✓ ' + esc(x.t)).join(' · ')}</small>` : '';
  f.todo = f.todo.filter(x => !x.d); save();
  return { rest: FOCUS_REST[S.focusMin || 25] || 5, list };
}
const fcst = document.createElement('style');
fcst.textContent = `.fc-min { display: flex; gap: .5em; margin: .2em 0 .8em; } .fc-m { flex: 1; padding: .55em 0; border-radius: 12px; border: 1.5px solid var(--paper-line); background: var(--paper); font: 600 1em Quicksand, sans-serif; color: var(--ink); cursor: pointer; }
  .fc-m.on { background: #f3d9a4; border-color: #d9a55a; }
  .fc-h { display: block; margin: .3em 0 .4em; font-size: .95em; }
  .fc-in { display: block; width: 100%; box-sizing: border-box; margin: 0 0 .45em; padding: .5em .7em; border-radius: 10px; border: 1.5px solid var(--paper-line); background: #fffdf7; font: 1em Quicksand, sans-serif; color: var(--ink); }
  .fc-td.on { opacity: .7; text-decoration: line-through; }
  .fc-mix { margin: .6em 0; } .fc-mix summary { cursor: pointer; font-weight: 600; padding: .3em 0; }`;
document.head.append(fcst);

// ---------------------------------------------------------------- one tick for everything above
setInterval(() => {
  if (!started || !S.welcomed) return;
  oldReplyTick(); hanhReplyTick(); oldAnswerTick(); laneTick();
}, 3000);
if (S.keep.k_couplet && !S.tetDone) { S.tetDone = { id: S.tet ? S.tet.id : 'free', at: S.tet ? S.tet.start : Date.now() }; save(); }
