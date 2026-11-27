// ================================================================ small holidays (review 27/11, texts by em for Vi to edit)
// Vi's drawings (work/cut_vi_1127_batch.py): hl_card, hl_choco, hl_bouquet, hl_tag, hl_carnation, hl_pumpkin(_lit), hl_candy, hl_cat_sit/sleep.
// 14/2 "Ngày Của Những Lá Thư" (a heart card for anyone you hold dear), 8/3 + 20/10 (a bouquet for a woman you love),
// 20/11 (bé Na's carnation pot), 31/10 "Đêm Hóa Trang Của Bánh Quy" (witch hat, a pumpkin on the sill, candy for the alley kids).
// One letter per holiday per year; ?le=thu|phunu|nhagiao|hoatrang to try.
const HL_TEST = (location.search.match(/[?&]le=(thu|phunu|nhagiao|hoatrang)\b/) || [])[1] || '';
const HL_DATES = { thu: [[2, 12], [2, 15]], phunu: [[3, 7], [3, 9], [10, 19], [10, 21]], nhagiao: [[11, 18], [11, 21]], hoatrang: [[10, 29], [11, 1]] };
function hlToday() {
  if (HL_TEST) return HL_TEST;
  const d = new Date(), v = (d.getMonth() + 1) * 100 + d.getDate();
  for (const [k, r] of Object.entries(HL_DATES))
    for (let i = 0; i < r.length; i += 2) if (v >= r[i][0] * 100 + r[i][1] && v <= r[i + 1][0] * 100 + r[i + 1][1]) return k;
  return null;
}
const hlId = k => `${k}-${new Date().getFullYear()}${k === 'phunu' && new Date().getMonth() > 5 ? 'b' : ''}`;
S.hl = S.hl || {};
const HL = {
  thu: { name: 'Ngày Của Những Lá Thư', face: 'landlady', who: 'Bà chủ nhà tầng dưới', how: 'Bà chủ nhà gõ cửa, đưa lên một phong bì hồng nhỏ',
    b: ['Hôm nay hẻm mình có một lệ nhỏ: ai cũng viết một tấm thiệp cho người mình quý. Không cần là người yêu đâu cháu, chỉ cần là người làm mình thấy ấm lòng.',
      'Bà để sẵn cho cháu một tấm thiệp trái tim với hộp sô-cô-la nhỏ. Cháu muốn gửi tấm thiệp cho ai?'],
    gifts: ['hl_card', 'hl_choco'], ask: 'Gửi tấm thiệp trái tim cho…',
    to: [['old', 'Bác sửa đồng hồ', st => st.old >= 1, 'Bác đọc thiệp mà cứ cười mãi. Mấy chục năm rồi mới có người gửi thiệp cho ông già này. Bác kẹp nó vào nắp hộp nhạc rồi, cháu ạ.'],
      ['plane', 'Cậu họa sĩ tầng trên', st => st.plane >= 1, 'Mình dán tấm thiệp lên giá vẽ rồi! Hôm nào bí ý tưởng, nhìn lên là thấy có người tin mình.'],
      ['na', 'Bé Na và Bánh Quy', st => st.na >= 1, 'Thiệp đẹp quá! Em khoe cả lớp luôn. Bánh Quy cứ đòi gặm góc thiệp, em phải giấu lên nóc tủ.'],
      ['flo', 'Chị bán hoa đầu hẻm', st => (st.flower || 0) >= 1, 'Chị cắm tấm thiệp giữa bó hồng ở quầy rồi em. Khách nào hỏi, chị bảo của đứa em trên gác gửi.'],
      ['minh', 'Minh ở phương xa', st => (st.minh || 0) >= 1, 'Thiệp của bạn tới đúng hôm mình nhớ nhà nhất. Mình cất trong ngăn ba lô, cạnh tấm vé tàu đầu tiên.'],
      ['khai', 'Ông Khải tiệm sách', st => (st.khai || 0) >= 1, 'Ông kẹp tấm thiệp vào cuốn sách bà nhà ông thích nhất. Bà mà còn, chắc bà cũng vui lắm.'],
      ['hanh', 'Cô Hạnh bên kia hẻm', st => (st.hanh || 0) >= 1, 'Cô đặt tấm thiệp trên nắp đàn. Tối nay cô đàn bài “Ru Em” tặng cháu nhé.'],
      ['lady', 'Bà chủ nhà', () => true, 'Bà cầm tấm thiệp lên đọc tới hai lần rồi mới cất vào túi áo. Cảm ơn cháu nhé, lâu lắm rồi mới có người viết thiệp cho bà.'],
      ['me', 'Chính mình', () => true, 'Bạn viết vài chữ cho chính mình rồi kẹp tấm thiệp vào sổ tay. Có những ngày, người cần được thương nhất lại là mình.']],
    q: 'Hôm nay bạn muốn gửi lời cảm ơn tới ai, người đã làm bạn thấy mình được thương?' },
  phunu: { name: 'Ngày Của Phụ Nữ', face: 'florist', who: 'Chị bán hoa đầu hẻm', how: 'Túi vải ròng rọc kéo lên một bó hoa thơm dịu',
    b: ['Hôm nay là ngày của phụ nữ đó em. Chị gói sẵn một bó hoa với tấm thẻ trống, em viết tặng một người phụ nữ em thương nha.',
      'Còn nếu chưa biết tặng ai thì tặng chính em đi. Chị thấy dạo này em chăm cây, chăm mình giỏi lắm.'],
    gifts: ['hl_bouquet', 'hl_tag'], ask: 'Tặng bó hoa cho…',
    to: [['lady', 'Bà chủ nhà', () => true, 'Bà cắm bó hoa lên bàn thờ ông nhà, còn tấm thẻ thì bà giữ trong túi áo. Con trai bà ở xa chưa kịp gọi về, may mà có cháu.'],
      ['flo', 'Chị bán hoa', () => true, 'Ơ, hoa của chị mà em tặng lại chị à! Thôi chị nhận nha. Lần đầu có người tặng hoa cho người bán hoa đó em.'],
      ['hanh', 'Cô Hạnh', st => (st.hanh || 0) >= 1, 'Ngày xưa học trò tặng cô nhiều hoa lắm, lâu rồi mới được nhận lại. Cô vui như hồi còn đứng lớp.'],
      ['na', 'Mẹ của bé Na', st => st.na >= 2, 'Mẹ em đi làm về thấy bó hoa thì ngồi im một lúc, rồi ôm em thật chặt. Cảm ơn anh chị nha! (Na)'],
      ['me', 'Chính mình', () => true, 'Bạn cắm bó hoa vào chiếc lọ bên bệ cửa. Hôm nay bạn tặng hoa cho chính mình, vì đã chăm sóc mình thật dịu dàng.']],
    q: 'Người phụ nữ nào đã dạy bạn cách dịu dàng với cuộc sống?' },
  nhagiao: { name: 'Ngày Nhà Giáo', face: 'na_cat', who: 'Bé Na tầng dưới', how: 'Ruy băng cổ Bánh Quy buộc một tấm thiệp nhỏ',
    b: st => (st.hanh || 0) >= 3
      ? ['Hôm nay ngày Nhà giáo! Lớp đàn của cô Hạnh tụi em góp tiền mua chậu cẩm chướng tặng cô. Cô cười mà mắt đỏ hoe luôn.',
        'Em để dành một chậu nhỏ tặng anh chị, vì anh chị là người nghe cô đàn đầu tiên. Không có anh chị thì tụi em đâu có lớp đàn!']
      : ['Hôm nay ngày Nhà giáo! Cả lớp em tặng cô chủ nhiệm một chậu cẩm chướng, cô khen tụi em ngoan.',
        'Em để dành một chậu nhỏ tặng anh chị, vì anh chị dạy em không ngồi một mình nữa. Anh chị cũng là cô giáo của em đó!'],
    gifts: ['hl_carnation'], q: 'Người thầy cô nào bạn vẫn nhớ tới tận bây giờ? Nếu gặp lại, bạn muốn nói với họ điều gì?' },
  hoatrang: { name: 'Đêm Hóa Trang Của Bánh Quy', face: 'na_cat', who: 'Bé Na tầng dưới', how: 'Bé Na gõ cửa cầu thang, đội một chiếc mũ phù thủy bằng giấy',
    b: ['Tối nay hẻm mình có Đêm Hóa Trang! Tụi nhỏ đội mũ giấy đi từng nhà xin kẹo, nhà nào cho kẹo thì được tụi em hát tặng một bài.',
      'Em may cho Bánh Quy một cái mũ phù thủy nè. Anh chị đội cho nó giùm em, rồi để trái bí ngô lên bệ cửa cho tụi em biết nhà anh chị có kẹo nha!'],
    gifts: ['hl_pumpkin', 'hl_candy', 'hl_cat'], q: 'Nếu được hóa trang thành bất kỳ ai trong một đêm, bạn muốn làm ai? Vì sao?' },
};
ITEM_IMG.hl_cat = ITEM_IMG.hl_cat_sit;   // the witch hat, kept with its picture of Bánh Quy wearing it

function hlLetter(k) {
  const h = HL[k], face = ITEM_IMG[h.face] ? `<img class="paper-img" src="${ITEM_IMG[h.face]}" alt="" style="max-height:7em">` : '';
  const b = typeof h.b === 'function' ? h.b(S.story) : h.b;
  const gifts = h.gifts.filter(g => g !== 'hl_cat' && ITEM_IMG[g]).map(g => `<img class="paper-img" src="${ITEM_IMG[g]}" alt="" style="max-height:4.4em;display:inline-block;margin:0 .3em">`).join('');
  const to = h.to ? `<p class="bub" style="margin-top:.6em">${h.ask}</p>` + h.to.filter(t => t[2](S.story)).map(t => `<button class="reply" data-hlto="${k}:${t[0]}">✉️ ${t[1]}</button>`).join('') : '';
  return `<small>${esc(h.how)}</small>${face}<p style="text-align:center;margin:.2em 0"><b>${h.name}</b></p>` + staged(b, `<div style="text-align:center">${gifts}</div><small>— ${esc(h.who)} —</small>${to}`);
}
function hlGive(k) {
  const id = hlId(k); S.hl[id] = S.hl[id] || { at: Date.now() };
  HL[k].gifts.forEach(g => { S.keep[g] = (S.keep[g] || 0) + 1; });
  if (k === 'hoatrang') S.hlCostume = 1;
  save(); SFX.sparkle(); applyCatAcc(); hlRoom();
}
function applyHoliday() {
  if (!started || !S.welcomed || TESTMODE && /[?&]noauto\b/.test(location.search)) return;
  const k = hlToday(); if (!k) return;
  const id = hlId(k); if (S.hl[id] || !storyGate('hl' + id)) return;
  if (HL[k].to) { showPaper(hlLetter(k), null, true); stageReveal(false); return; }   // the choice closes it
  showPaper(hlLetter(k), () => { hlGive(k); toast(`Quà ${HL[k].name} đã cất vào Hộp kỷ vật 🎁`, 3400); }); stageReveal(false);
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-hlto]'); if (!b) return;
  e.stopPropagation();
  const [k, who] = b.dataset.hlto.split(':'), t = HL[k].to.find(x => x[0] === who);
  hlGive(k); S.hl[hlId(k)].to = who; save();
  closeNote();
  setTimeout(() => showPaper(`<small>${who === 'me' ? 'Bên khung cửa nhỏ' : 'Một lúc sau, có lời hồi âm'}</small><p class="bub">${esc(t[3])}</p><small>${who === 'me' ? '' : '— ' + esc(t[1]) + ' —'}</small>`,
    () => toast(`Quà ${HL[k].name} đã cất vào Hộp kỷ vật 🎁`, 3400)), 900);
}, true);
setTimeout(() => setInterval(applyHoliday, 5000), HL_TEST ? 3000 : 60000);

// notebook: the player's own thread (review 27/11): on the 3rd, 7th, 14th and 30th day the page looks back at the day they moved in
const SELF_Q = { 3: 'Ba ngày ở căn gác mới rồi. Điều gì ở đây làm bạn thấy dễ thở hơn một chút?',
  7: 'Một tuần trước bạn dọn tới đây, mệt và còn lạ lẫm. Hôm nay bạn thấy mình khác đi ở điểm nào?',
  14: 'Trong những người hàng xóm, có ai làm bạn nhớ tới chính mình không? Vì sao?',
  30: 'Một tháng bên khung cửa nhỏ. Nếu gặp lại bạn của ngày đầu dọn tới, bạn muốn nói gì với người ấy?' };
const _todayQuestionSelf = todayQuestion;
todayQuestion = function () {
  const dp = S.daysPlayed || {}, n = Object.keys(dp).length + (dp[dayKey()] ? 0 : 1);
  return SELF_Q[n] && !window.xmasView ? { theme: 'Căn gác nhỏ', q: SELF_Q[n] } : _todayQuestionSelf();
};
// notebook: the holiday's question on its days
const _todayQuestionHl = todayQuestion;
todayQuestion = function () { const k = hlToday(); return k && S.hl[hlId(k)] ? { theme: HL[k].name, q: HL[k].q } : _todayQuestionHl(); };

// ---- Đêm Hóa Trang: the pumpkin on the sill (lit at night and in the rain), Bánh Quy's witch hat, candy for the alley kids
const hlPump = document.createElement('img'); hlPump.id = 'p-hlpump'; hlPump.className = 'prop'; hlPump.alt = ''; hlPump.style.display = 'none';
$('#p-tea2').after(hlPump);
const hlPumpHit = document.createElement('button'); hlPumpHit.className = 'hit'; hlPumpHit.setAttribute('aria-label', 'Trái bí ngô'); hlPumpHit.style.display = 'none';
hitsEl.append(hlPumpHit);
function hoatrangNow() { return hlToday() === 'hoatrang' && !!S.hl[hlId('hoatrang')]; }
function hlRoom() {
  const on = hoatrangNow() && !(typeof xmasOn === 'function' && xmasOn()) && !(typeof tetOn === 'function' && tetOn());
  hlPump.style.display = hlPumpHit.style.display = on ? '' : 'none'; if (!on) return;
  const lit = S.weather === 'night' || S.weather === 'rain', src = ITEM_IMG[lit ? 'hl_pumpkin_lit' : 'hl_pumpkin'];
  if (hlPump.getAttribute('src') !== src) hlPump.src = src;
  place(hlPump, 618, 794, 104, 106); place(hlPumpHit, 610, 786, 120, 120);
  hlPump.style.filter = lit ? 'drop-shadow(0 0 14px rgba(255,170,60,.75))' : '';
}
hlPumpHit.addEventListener('click', e => {
  e.stopPropagation(); bump(hlPump, 'hop');
  const night = S.weather === 'night' || S.weather === 'rain', d = dayKey(), st = S.hl[hlId('hoatrang')] || {};
  if (night && st.candy !== d) {
    st.candy = d; save(); SFX.sparkle(); setTimeout(() => SFX.chirp(), 600);
    toast('Dưới hẻm tụi nhỏ hát “Bắc Kim Thang”. Bạn thả xuống mấy viên kẹo trong giỏ 🍬', 4200);
  } else toast(night ? 'Trái bí ngô sáng lung linh trên bệ cửa 🎃' : 'Tối nay thắp trái bí ngô lên, tụi nhỏ sẽ ghé xin kẹo 🎃', 3000);
});
setInterval(hlRoom, 1500);

// the witch hat: Vi drew Bánh Quy wearing it (sit + sleep); it wins over the decor accessory while it is on
const HL_CAT = { sit: { src: ITEM_IMG.hl_cat_sit, box: [389, 621, 149, 277], flip: false }, sleep: { src: ITEM_IMG.hl_cat_sleep, box: [369, 736, 184, 162], flip: false } };
const _applyCatAccHl = applyCatAcc;
applyCatAcc = function () {
  _applyCatAccHl();
  if (!S.hlCostume || !S.keep.hl_cat || !hlToday() && !S.hlCostumeKeep) return;
  CAT0.sleep = HL_CAT.sleep; CAT0.sit = HL_CAT.sit;
  if (!catHatNow) { CAT.sleep = CAT0.sleep; CAT.sit = CAT0.sit; const p = catPose; catPose = null; setCatPose(p); }
};
const _useItemHl = useItem;
useItem = function (k, row) {
  if (k === 'hl_cat') { S.hlCostume = S.hlCostume ? 0 : 1; S.hlCostumeKeep = 1; save(); applyCatAcc(); toast(S.hlCostume ? 'Bánh Quy đội mũ phù thủy rồi 🧙' : 'Bạn cởi mũ phù thủy cho Bánh Quy', 2600); return; }
  return _useItemHl(k, row);
};
if (S.hlCostume) applyCatAcc();
