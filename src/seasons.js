// ---------------------------------------------------------------- four seasons (Vi 27/11): one neighbour's letter per season,
// a small keepsake, a season stamp and 4 notebook questions. Calendar seasons (VN): spring 2-4, summer 5-7, autumn 8-10, winter 11-1.
// The alley picture only changes for seasons Vi has drawn (seasonView in the template); the letters come every season.
// Pictures are optional: a gift or stamp shows once Vi's drawing (ITEM_IMG key) is in.
const SEA = {
  xuan: { name: 'Mùa Xuân', who: 'Bà chủ nhà tầng dưới', face: 'landlady', how: 'Bà chủ nhà gõ cửa, đưa lên một gói giấy nhỏ',
    letter: 'Sáng nay mở cửa ra thấy giàn hoa giấy đầu hẻm nở bung hồng cả một góc trời, chim én cũng bay về chao nghiêng trên mái ngói rồi cháu ạ. Mùa xuân tới thật rồi! Bà gói sẵn cho cháu ít hạt giống mới chọn kỹ ngoài chợ phiên. Cháu gieo vào chậu bên bệ cửa đi nhé, đầu năm có mầm xanh nhú lên là cả năm hanh thông, bình an.',
    gifts: [['sea_seeds', 'Gói hạt giống chợ phiên', 'Quà mùa xuân của bà chủ nhà', '🌱']],
    stamp: ['🐦', 'Chim Én', 'st_swallow'],
    q: ['Đầu năm mới, điều nhỏ bé nào bạn mong sẽ nảy mầm trong cuộc sống của mình?',
      'Một mùi hương hoặc âm thanh nào làm bạn nhận ra mùa xuân đã về?',
      'Nếu được gửi một lời chúc bình an cho chính mình của 12 tháng tới, bạn sẽ viết gì?',
      'Có thói quen dịu dàng nào bạn muốn bắt đầu giữ từ mùa xuân này không?'] },
  ha: { name: 'Mùa Hạ', who: 'Chị bán hoa đầu hẻm', face: 'florist', how: 'Túi vải ròng rọc kéo lên tới bệ cửa, mát lạnh',
    letter: 'Mấy hôm nay nắng gắt quá em ha, trưa nằm trên gác chắc nghe tiếng ve kêu râm ran suốt. Chị mới nấu một nồi nước sâm mía lau giải nhiệt, rót sẵn một ly mát lạnh gửi ròng rọc lên cho em nè. Chị gửi kèm thêm chiếc quạt giấy nhỏ, chiều nào trời oi ả em phe phẩy cho mát, đợi cơn mưa rào ghé qua là hẻm mình lại dịu ngay ấy mà.',
    gifts: [['sea_sam', 'Ly nước sâm mía lau', 'Quà mùa hạ của chị bán hoa', '🥤'], ['sea_fan', 'Quạt giấy nhỏ', 'Chiều oi ả phe phẩy cho mát', '🪭']],
    stamp: ['🪭', 'Quạt Giấy', 'st_paperfan'],
    q: ['Giữa những ngày nắng gắt hay bận rộn, điều gì giúp bạn “giải nhiệt” tâm trí nhanh nhất?',
      'Một kỷ niệm mùa hè tuổi thơ nào mà mỗi lần nghe tiếng ve bạn lại nhớ về?',
      'Sau một cơn mưa rào buổi chiều, bạn thích cảm giác gì nhất?',
      'Hôm nay bạn đã uống đủ nước và cho mắt mình nghỉ ngơi một chút chưa?'] },
  thu: { name: 'Mùa Thu', who: 'Cậu họa sĩ tầng trên', face: 'artist', how: 'Một chiếc máy bay giấy lượn vào bệ cửa, chở theo mấy chiếc lá',
    letter: 'Sáng nay mở cửa sổ thấy gió đổi chiều rồi bạn ơi, mát rượi và nhẹ bẫng như gió heo may vậy. Mình vừa nhặt được mấy chiếc lá vàng rụng ngay trên bậc thềm, màu đẹp như tranh sơn dầu. Mình thả theo máy bay giấy gửi sang cho bạn vài chiếc nhé. Bạn đem ép vào cuốn sổ tay cho phẳng phiu, giữ làm kỷ niệm của một mùa thu thật êm.',
    gifts: [['sea_leaves', 'Ba chiếc lá vàng mùa thu', 'Ép phẳng trong sổ tay, quà của cậu họa sĩ', '🍂']],
    stamp: ['🍂', 'Chiếc Lá Thu', 'st_autumn'],
    q: ['Nếu ví tâm trạng của bạn hôm nay như một cơn gió, đó là cơn gió như thế nào?',
      'Có điều gì cũ kỹ bạn muốn nhẹ nhàng buông xuống như chiếc lá rời cành không?',
      'Một buổi chiều trời se lạnh khiến bạn muốn làm điều gì nhất?',
      'Kỷ niệm nào bạn muốn “ép khô” lại để cất giữ thật kỹ trong cuốn sổ năm nay?'] },
  dong: { name: 'Mùa Đông', who: 'Bác sửa đồng hồ bên kia đường', face: 'old', how: 'Chú chim sẻ tha sang một gói vải nhỏ còn ấm',
    letter: 'Sáng nay bác dậy sớm mở cửa tiệm mà thấy sương giăng mờ cả đầu hẻm, trời trở lạnh thật rồi cháu ạ. Ngồi bên hiên nhìn sang thấy cháu vẫn mở cửa sổ đón gió sớm, bác sợ cháu lạnh. Bác gửi sang cho cháu chiếc khăn len cũ còn ấm với mấy lát gừng tươi để pha trà. Trời lạnh thì cứ chậm rãi thôi cháu nhé, giữ ấm đôi tay là giữ ấm cả lòng mình.',
    gifts: [['sea_scarf', 'Khăn len cũ của bác', 'Quà mùa đông của bác sửa đồng hồ', '🧣'], ['sea_ginger', 'Mấy lát gừng tươi', 'Pha trà gừng cho ấm lòng', '🫚']],
    stamp: ['🫖', 'Ấm Trà Gừng', 'st_ginger'],
    q: ['Điều gì nhỏ bé trong ngày hôm nay mang lại cho bạn cảm giác ấm áp nhất?',
      'Những tháng cuối năm đang trôi qua, bạn muốn tự thưởng cho mình một khoảng nghỉ như thế nào?',
      'Một người mà bạn chỉ cần nghĩ đến thôi cũng thấy lòng ấm lại giữa ngày se lạnh?',
      'Nhìn lại một năm sắp khép lại bên khung cửa sổ này, bạn thấy mình đã trưởng thành hay dịu dàng hơn ở điểm nào?'] },
};
const SEA_TEST = (location.search.match(/[?&]mua=(xuan|ha|thu|dong)\b/) || [])[1] || (/[?&]xuan\b/.test(location.search) ? 'xuan' : /[?&]dong\b/.test(location.search) ? 'dong' : '');
function calSeason() {
  if (SEA_TEST) return SEA_TEST;
  const m = new Date().getMonth() + 1;
  return m >= 2 && m <= 4 ? 'xuan' : m >= 5 && m <= 7 ? 'ha' : m >= 8 && m <= 10 ? 'thu' : 'dong';
}
function seasonId(k) { const d = new Date(); return `${k}-${k === 'dong' && d.getMonth() === 0 ? d.getFullYear() - 1 : d.getFullYear()}`; }   // January belongs to last year's winter

// stamps: each season's stamp joins the notebook once its letter came (and Vi's drawing is in)
Object.values(SEA).forEach(s => { if (ITEM_IMG[s.stamp[2]]) STAMPS.push([s.stamp[0], s.stamp[1], s.stamp[2], s.stamp[2]]); });

// notebook: every other day in a season the page asks one of that season's 4 questions (Christmas week keeps its own)
const _todayQuestionSea = todayQuestion;
todayQuestion = function () {
  if (window.xmasView) return _todayQuestionSea();
  const day = Math.floor((Date.now() - new Date().getTimezoneOffset() * 6e4) / 864e5), s = SEA[calSeason()];
  if (S.sea && S.sea[seasonId(calSeason())] && day % 2 === 0) return { theme: s.name, q: s.q[Math.floor(day / 2) % 4] };
  return _todayQuestionSea();
};

const SEA_FACE = { landlady: 'landlady', florist: 'florist', artist: 'plane', old: 'old_window' };
function seaSplit(t) {   // two taps: the letter opens in two halves like the other neighbours' letters
  const parts = t.split(/(?<=[.!?])\s+/), half = Math.ceil(parts.length / 2);
  return [parts.slice(0, half).join(' '), parts.slice(half).join(' ')].filter(Boolean);
}
function seaLetter(k) {
  const s = SEA[k], face = ITEM_IMG[SEA_FACE[s.face]] ? `<img class="paper-img" src="${ITEM_IMG[SEA_FACE[s.face]]}" alt="" style="max-height:8em">` : '';
  const gifts = s.gifts.map(([g, name, , emo]) => ITEM_IMG[g] ? `<img class="paper-img" src="${ITEM_IMG[g]}" alt="${name}" style="max-height:4.2em;display:inline-block;margin:0 .3em">`
    : `<span style="font-size:2.2em;margin:0 .2em">${emo}</span>`).join('');
  const st = ITEM_IMG[s.stamp[2]] ? `<br><small>Từ nay sổ tay có thêm con dấu “${s.stamp[1]}” ${s.stamp[0]}</small>` : '';
  return `<small>${esc(s.how)}</small>` + face + staged(seaSplit(s.letter), `<div style="text-align:center">${gifts}</div><small>— ${esc(s.who)} —</small>${st}`);
}
function applySeasonLetter() {
  if (!started || !S.welcomed || TESTMODE && /[?&]noauto\b/.test(location.search)) return;
  const k = calSeason(), id = seasonId(k); S.sea = S.sea || {};
  if (S.sea[id] || !storyGate('sea' + id)) return;
  showPaper(seaLetter(k), () => {
    if (k === 'xuan') { S.seedsGot = S.seedsGot || {}; S.seedsGot.portulaca = 1; }   // bà's market seeds = Hoa Mười Giờ, ready to sow
    S.sea[id] = Date.now(); SEA[k].gifts.forEach(([g]) => { S.keep[g] = (S.keep[g] || 0) + 1; }); if (ITEM_IMG[SEA[k].stamp[2]]) S.keep[SEA[k].stamp[2]] = 1;
    save(); SFX.sparkle(); toast(`Quà ${SEA[k].name.toLowerCase()} đã cất vào Hộp kỷ vật 🎁`, 3600);
  }); stageReveal(false);
}
// the players' first days stay calm: the season letter waits until the welcome letter is read and a minute has passed
setTimeout(() => setInterval(applySeasonLetter, 5000), SEA_TEST ? 3000 : 60000);

// ---------------------------------------------------------------- season gifts in the room (Vi 28/11)
// Quạt giấy (summer): set on the desk under the painting; a tap fans it gently with a cool breeze and a
// short line to relax. Khăn len (winter): the scarf over a chair back by the desk; on rainy days or in winter, making tea or
// lighting the candle adds a small line: the scarf warms the attic. Both are put out / away from the keepsake box.
const FAN_BOX = [432, 1090, 96, 96], SCARF_BOX = [588, 1018, 122, 134];
const FAN_LINES = ['Phe phẩy vài cái, gió mát lùa qua tóc. Thả lỏng đôi vai một chút nhé 🌿', 'Hít vào thật chậm theo nhịp quạt… rồi thở ra. Trời oi mấy cũng qua thôi.',
  'Gió từ chiếc quạt nhỏ mang theo mùi giấy tre. Nghỉ tay uống ngụm nước đã nào 💧', 'Nhắm mắt lại vài giây, nghe gió quạt khẽ khàng như gió đầu hẻm chiều nay.',
  'Chậm lại một nhịp cũng được mà. Chiếc quạt vẫn ở đây, phe phẩy cùng bạn.'];
const fanEl = document.createElement('img'); fanEl.className = 'prop'; fanEl.id = 'p-seafan'; fanEl.alt = '';
const scarfEl = document.createElement('img'); scarfEl.className = 'prop'; scarfEl.id = 'p-seascarf'; scarfEl.alt = '';
$('#p-painting').before(fanEl); $('#p-lamp').after(scarfEl);
const fanHit = document.createElement('button'); fanHit.className = 'hit'; fanHit.setAttribute('aria-label', 'Quạt giấy trên tường');
hitsEl.append(fanHit);
const sfst = document.createElement('style');
sfst.textContent = `#p-seafan { transform-origin: 68% 74%; transition: opacity .6s; }
  #p-seafan.wave { animation: seafan 1.6s ease-in-out; }
  @keyframes seafan { 0%,100% { transform: rotate(0); } 20% { transform: rotate(-9deg); } 45% { transform: rotate(6deg); } 70% { transform: rotate(-6deg); } 88% { transform: rotate(3deg); } }`;
document.head.append(sfst);
function applySeaRoom() {
  const fan = !!(S.fanOut && S.keep.sea_fan && ITEM_IMG.sea_fan), sc = !!(S.scarfOut && S.keep.sea_scarf && ITEM_IMG.sea_scarf);
  fanEl.style.display = fan ? '' : 'none'; fanHit.style.display = fan ? '' : 'none'; scarfEl.style.display = sc ? '' : 'none';
  if (fan) { fanEl.src = ITEM_IMG.sea_fan; place(fanEl, ...FAN_BOX); place(fanHit, FAN_BOX[0] - 8, FAN_BOX[1] - 8, FAN_BOX[2] + 16, FAN_BOX[3] + 16); }
  if (sc) { scarfEl.src = ITEM_IMG.sea_scarf; place(scarfEl, ...SCARF_BOX); }
}
let fanTurn = -1;
fanHit.addEventListener('click', e => {
  e.stopPropagation(); bump(fanEl, 'wave');
  if (AC) { const t = AC.currentTime; [0, 0.42, 0.84].forEach((d, i) => noiseBurst(t + d, 0.38, 1400, 500, 0.6, 0.07 - i * 0.012, master, 'white')); }
  fanTurn = (fanTurn + 1) % FAN_LINES.length; setTimeout(() => sayAt(FAN_BOX, FAN_LINES[fanTurn], 4600), 500);
});
// the scarf: rain or winter + tea / candle
const scarfWarm = () => S.scarfOut && S.keep.sea_scarf && (S.weather === 'rain' || calSeason() === 'dong');
function scarfLine() { if (scarfWarm()) setTimeout(() => toast('Chiếc khăn len làm căn gác ấm hẳn lên 🧣', 3400), 1800); }
const _drinkTeaSea = drinkTea; drinkTea = function () { const r = _drinkTeaSea.apply(this, arguments); scarfLine(); return r; };
const _actSea = act; act = function (id) { const r = _actSea.apply(this, arguments); if (id === 'incense' && S.incense) scarfLine(); return r; };
const _useItemSea = useItem;
useItem = function (k, row) {
  if (k === 'sea_fan') { S.fanOut = !S.fanOut; save(); applySeaRoom(); closeNote(); SFX.paper(); if (S.fanOut) { bump(fanEl, 'wave'); toast('Treo chiếc quạt giấy lên tường rồi, chạm vào để phe phẩy nhé 🪭', 3200); } return; }
  if (k === 'sea_scarf') { S.scarfOut = !S.scarfOut; save(); applySeaRoom(); closeNote(); SFX.paper(); if (S.scarfOut) toast('Khăn len của bác đã vắt lên thành ghế 🧣', 3000); return; }
  return _useItemSea(k, row);
};
applySeaRoom();
