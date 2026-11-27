// ================================================================ Tuyến 7 · Tiếng Đàn Bên Kia Hẻm (cô Hạnh)
// Script: Vi 27/11 (work/vi_scripts_hanh.md, full approved version work/vi_scripts_hanh_full.html). Cô Hạnh lives behind the big
// window of the house across the alley; her letters (paper boats / treble-clef envelopes) arrive in the mailbox under the stairs.
// Daily "Hòa tấu cùng cô": at night tap her lit window, 6 keys light up one by one, tap along (no timer, no fail).
// Art from Vi arrives later: every picture here falls back to an emoji while ITEM_IMG has no entry for it, and the route
// only starts for players once her drawing of cô Hạnh (hanh_play) is in (?hanh starts it anyway, for testing).
S.story.hanh = S.story.hanh || 0;
S.hanh = S.hanh || { d: 0, total: 0, duetDay: '', song: 0, mail: null, nextAt: 0, heard: 0, clipAt: 0 };
const HTEST = /[?&]hanh\b/.test(location.search);
// Vi's set 27/11 (work/cut_hanh.py): until the boat letter / envelope and a separate metronome are drawn, letters carry the
// round picture of her house and the metronome is a close crop of the one on her piano
ITEM_IMG.hanh_boat = ITEM_IMG.hanh_boat || ITEM_IMG.hanh_badge; ITEM_IMG.hanh_env = ITEM_IMG.hanh_env || ITEM_IMG.hanh_badge;
ITEM_IMG.hanh_metronome = ITEM_IMG.hanh_metronome || ITEM_IMG.hanh_metronome_crop;
const hpic = (k, emoji, h = 6) => ITEM_IMG[k] ? `<img class="paper-img" src="${ITEM_IMG[k]}" alt="" style="max-height:${h}em">` : `<div style="font-size:${h * 0.55}em;text-align:center;line-height:1.2">${emoji}</div>`;
const H = {
  heard: 'Vài nốt đàn ngập ngừng vọng sang từ ô cửa sổ bên kia hẻm, rồi im bặt.',
  ask: ['Cháu ở căn gác bên này. Tiếng đàn tối qua hay lắm, sao cô không đàn tiếp ạ?', 'Cô ơi, tối nào cháu cũng mong nghe thêm vài nốt đàn nữa.'],
  l1: ['Cảm ơn mẩu giấy của cháu. Cô là Hạnh, dạy đàn ở trường tiểu học gần bốn mươi năm.',
    'Cô mới về hưu, tai dạo này nghe kém đi nhiều, sợ mình đánh sai nhịp làm phiền hàng xóm nên không dám mở nắp đàn nữa.',
    'Không ngờ trong hẻm vẫn có người chờ nghe.'],
  cheer: ['Cô cứ đàn cho vui hẻm ạ. Sai nhịp thì mình đàn lại, ai nghe cũng thích.', 'Cô với cháu cùng chọn mấy bài êm êm, quen quen, đàn chậm thôi cô nhé.'],
  songs: ['Bắc Kim Thang', 'Lý Cây Đa', 'Ru Em'],
  l2: ['Tối qua cô mở nắp đàn, phủi bụi từng phím một. Cô đàn bài “{song}” cháu chọn, chậm thôi, có chỗ cô không nghe rõ tiếng mình.',
    'Vậy mà hóa ra cảm giác đầu ngón tay chạm lên phím đàn vẫn nhớ hết giai điệu cũ.',
    'Cô gửi cháu tờ nhạc này, cô chép từ hồi còn đi dạy. Từ nay tối nào thấy đèn nhà cô sáng, cháu chạm vào cửa sổ, cô cháu mình đàn chung một bài nhé.'],
  na1: 'Anh/chị ơi, tối qua em nghe có tiếng đàn hay ơi là hay. Em chạy sang đứng ngoài cửa sổ nghe lén, có một bà tóc búi đang đàn. Em đứng nghe hết ba bài luôn mà không dám gõ cửa.',
  l3: ['Tối qua cô thấy một cái đầu nhỏ nhấp nhô ngoài cửa sổ, nghe tới bài thứ ba thì vỗ tay rồi chạy mất. Cô vui lắm cháu ạ, bốn mươi năm đi dạy chưa có khán giả nào dễ thương vậy.',
    'Cháu chuyển giúp cô chiếc kẹp khóa Sol này cho bé nhé. Cháu nhắn bé chiều mai sang nhà cô, cô dạy bé bấm những nốt đầu tiên.'],
  na2: 'Em kẹp cái kẹp khóa Sol lên tóc rồi! Chiều mai em sang học đàn. Em hồi hộp quá nên tối nay chắc em tập bấm trên mặt bàn trước.',
  ch4: 'Chiều nay hẻm nhỏ rộn ràng hơn hẳn. Từ ô cửa bên kia hẻm vọng sang tiếng đàn ngọng nghịu của bé Na, xen lẫn tiếng cười hiền của cô Hạnh. Thỉnh thoảng có một nốt sai, rồi cả hai cùng cười.',
  l4: ['Bé Na học nhanh lắm, mới một buổi mà đã bấm được năm nốt. Cô gửi cháu chiếc máy đếm nhịp này, nó theo cô suốt những năm đi dạy.',
    'Nhờ có căn gác của cháu lắng nghe mà cây đàn cũ của cô mới có dịp thức dậy.',
    'Lúc nào thấy lòng mình vội quá, cháu bật nó lên, thở theo tiếng tích tắc nhé.'],
  l5: ['Cô quyết định rồi cháu ạ. Từ tuần này, sáng thứ Bảy và Chủ nhật cô mở một góc dạy đàn nhỏ trong nhà, miễn phí, đứa nhỏ nào trong hẻm thích thì sang. Bé Na xin làm “lớp trưởng”, đã đi rủ được ba bạn rồi.',
    'Cô gửi cháu bức ký họa cô vẽ cây đàn bên ô cửa sổ, ô cửa mà tối nào cô cũng nhìn sang thấy đèn nhà cháu. Cảm ơn cháu đã là người nghe đầu tiên.'],
  open: 'Bên kia hẻm, cô Hạnh đặt tay lên phím đàn, chờ cháu.',
  miss: 'Không sao, cô đàn lại nốt đó nhé.',
  done: ['Ô cửa bên kia hẻm nháy đèn hai cái. Cô Hạnh đang vẫy tay.', 'Tiếng đàn hai bên hòa vào nhau, như hai người nói chuyện mà không cần lời.',
    'Bánh Quy vểnh tai nghe hết bài rồi mới chịu nằm xuống.'],
  again: 'Hôm nay cô cháu mình đàn xong rồi. Mai mình đàn tiếp nhé.',
};
const HANH_Q = ['Có bài hát nào chỉ cần nghe vài nốt đầu là bạn nhớ cả một thời?', 'Bạn từng học được điều gì từ một người thầy, người cô mà đến giờ vẫn còn giữ?'];
Object.assign(FLAVOR, {
  hanh_sheet: ['Nét chữ nốt nhạc nghiêng nghiêng, góc giấy còn vết cà phê từ hồi cô còn đi dạy.'],
  hanh_metronome: ['Tích… tắc… tích… tắc… Hít vào bốn nhịp, thở ra bốn nhịp.'],
});
if (ITEM_IMG.st_treble) STAMPS.push(['🎼', 'Khóa Sol', 'st_treble', 'st_treble']);   // the stamp shows up once Vi's drawing is in
WALL.painting_hanh = [448, 946, 82, 90];
const naName = () => (S.story.na || 0) >= 1 ? '— Na —' : '— Một cô bé tầng dưới —';
const tomorrow6 = () => { if (HTEST) return Date.now(); const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(6, 0, 0, 0); return d.getTime(); };
const hView = () => !(window.tetView || window.xmasView || window.qxView);   // her window is in the everyday alley (and the Vu Lan night)
const hDark = () => S.weather === 'night' || S.weather === 'rain';

// ---------------------------------------------------------------- piano (synthesised; the far one goes through a low-pass)
const KEYS = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25];   // C4 … C5, 8 white keys
let farBus = null;
function piano(i, vol = 0.12, far = false, at = 0) {
  if (!AC || S.muted) return;
  const t = AC.currentTime + at, f = KEYS[i] || i;
  let dest = master;
  if (far) { if (!farBus) { farBus = filt('lowpass', 900, 0.7); farBus.connect(master); } dest = farBus; }
  tone(t, f, 1.6, vol, 'triangle', dest, 0.006); tone(t, f * 2, 0.7, vol * 0.25, 'sine', dest, 0.004); tone(t, f * 3, 0.35, vol * 0.08, 'sine', dest, 0.003);
}
const PHRASES = [[0, 2, 4, 4, 2, 0], [4, 5, 4, 2, 0, 2], [7, 4, 5, 4, 2, 4], [2, 4, 7, 5, 4, 2], [0, 0, 4, 5, 4, 2], [4, 2, 0, 2, 4, 4], [5, 4, 2, 4, 5, 7]];
function farTune(notes, gap = 0.55, vol = 0.05) { notes.forEach((n, k) => piano(n, vol, true, k * gap + Math.random() * 0.05)); }

// ---------------------------------------------------------------- her window across the alley
const HWIN = [200, 545, 62, 98];
const hWin = document.createElement('div'); hWin.id = 'hwin';
const hHit = document.createElement('button'); hHit.className = 'hit'; hHit.setAttribute('aria-label', 'Ô cửa sổ nhà cô Hạnh bên kia hẻm');
$('#p-chime').before(hWin); hitsEl.append(hHit);
place(hWin, ...HWIN); place(hHit, HWIN[0] - 14, HWIN[1] - 14, HWIN[2] + 28, HWIN[3] + 28);
const hst = document.createElement('style');
hst.textContent = `#hwin { position: absolute; pointer-events: none; border-radius: 3px; opacity: 0; transition: opacity 1.5s;
    background: radial-gradient(ellipse at 50% 55%, rgba(255,214,140,.7), rgba(255,196,110,.35) 55%, rgba(255,190,100,0) 80%); mix-blend-mode: screen; }
  #hwin.on { opacity: 1; animation: hwglow 3.4s ease-in-out infinite; }
  #hwin.blink { animation: hwblink .5s ease-in-out 4; }
  @keyframes hwglow { 0%,100% { filter: brightness(1); } 50% { filter: brightness(1.18); } }
  @keyframes hwblink { 0%,100% { opacity: 1; } 50% { opacity: .15; } }
  #hduet { position: absolute; inset: 0; z-index: 12; display: flex; align-items: center; justify-content: center; background: rgba(20,18,36,.5); opacity: 0; pointer-events: none; transition: opacity .4s; }
  #hduet.show { opacity: 1; pointer-events: auto; }
  #hduet .hd-card { width: min(92%, 430px); background: #fdf8ee; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,.35); }
  #hduet .hd-head { padding: .5em .9em; font-weight: 700; color: #4A3525; letter-spacing: .04em; display: flex; justify-content: space-between; align-items: center; font-size: .92em; }
  #hduet .hd-head button { border: 0; background: none; font-size: 1.1em; cursor: pointer; color: #4A3525; }
  #hduet .hd-who { text-align: center; padding: .2em 0 .4em; min-height: 3em; }
  #hduet .hd-who img { max-height: 9em; }
  #hduet .hd-keys { position: relative; display: flex; margin: 0 .8em; height: 9.5em; border-radius: 8px; overflow: hidden; background: #2b2320; padding: .5em .25em .3em; gap: 3px; touch-action: manipulation; }
  #hduet .hd-keys.img { background: none; padding: 0; gap: 0; }
  #hduet .hd-keys.img > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: fill; pointer-events: none; }
  #hduet .hk { flex: 1; border: 0; border-radius: 0 0 6px 6px; background: linear-gradient(#fffdf6, #efe6d4); box-shadow: inset 0 -4px 0 rgba(0,0,0,.08); cursor: pointer; position: relative; z-index: 1; transition: background .15s; }
  #hduet .hd-keys.img .hk { background: none; box-shadow: none; border-radius: 0; }
  #hduet .hk.cue { background: radial-gradient(circle at 50% 75%, rgba(255,205,110,.95), rgba(255,226,160,.55) 60%, rgba(255,240,200,.2)); }
  #hduet .hk.next { box-shadow: inset 0 0 0 3px rgba(240,180,70,.9); animation: hkpulse 1.2s ease-in-out infinite; }
  #hduet .hk.hit { background: radial-gradient(circle at 50% 75%, rgba(170,220,160,.95), rgba(220,240,200,.5) 60%, rgba(255,255,240,.2)); }
  @keyframes hkpulse { 0%,100% { box-shadow: inset 0 0 0 3px rgba(240,180,70,.9); } 50% { box-shadow: inset 0 0 0 3px rgba(240,180,70,.25); } }
  #hduet .hd-dots { text-align: center; letter-spacing: .35em; color: #c9a77a; margin: .5em 0 0; }
  #hduet .hd-text { padding: .5em 1em 1em; color: #4A3525; line-height: 1.5; min-height: 3em; text-align: center; }`;
document.head.append(hst);
const hduet = document.createElement('div'); hduet.id = 'hduet'; hduet.setAttribute('role', 'dialog'); hduet.setAttribute('aria-label', 'Hòa tấu cùng cô Hạnh');
$('#stage').append(hduet);
const _outsideOpenH = outsideOpen; outsideOpen = function () { return _outsideOpenH() || hduet.classList.contains('show'); };

let duet = null;   // { notes, i, turn: 'her'|'you', free }
function duetSay(t) { const e = $('#hd-text'); if (e) { e.textContent = t; bump(e, 'fade'); } }
function duetDots() { const e = $('#hd-dots'); if (e && duet && !duet.free) e.textContent = duet.notes.map((n, k) => k < duet.i ? '●' : '○').join(''); }
function openDuet() {
  if (!AC) initAudio(); duck(0.6);
  const free = S.hanh.duetDay === dayKey();
  const pick = PHRASES[(S.hanh.total + (new Date().getDate())) % PHRASES.length];
  duet = { notes: pick, i: 0, turn: 'her', free };
  const keys = ITEM_IMG.hanh_keys;
  hduet.innerHTML = `<div class="hd-card"><div class="hd-head">🎹 HÒA TẤU CÙNG CÔ <button id="hd-x" aria-label="Đóng">✕</button></div>
    <div class="hd-who">${hpic('hanh_play', '👵🏻🎹', 8)}</div>
    <div class="hd-keys${keys ? ' img' : ''}">${keys ? `<img src="${keys}" alt="">` : ''}${KEYS.map((_, k) => `<button class="hk" data-k="${k}" aria-label="Phím ${k + 1}"></button>`).join('')}</div>
    <div class="hd-dots" id="hd-dots"></div><div class="hd-text" id="hd-text"></div></div>`;
  hduet.classList.add('show');
  duetSay(free ? H.again : H.open); duetDots();
  if (!free) setTimeout(herTurn, 1100);
}
function closeDuet() { hduet.classList.remove('show'); duet = null; duck(1); }
function keyEl(k) { return hduet.querySelector(`.hk[data-k="${k}"]`); }
function herTurn() {
  if (!duet || duet.free || !hduet.classList.contains('show')) return;
  const k = duet.notes[duet.i], el = keyEl(k);
  piano(k, 0.07, true); el.classList.add('cue'); duet.turn = 'her';
  setTimeout(() => { el.classList.remove('cue'); if (!duet) return; el.classList.add('next'); duet.turn = 'you'; }, 650);
}
hduet.addEventListener('click', e => {
  e.stopPropagation();
  if (e.target === hduet || e.target.closest('#hd-x')) { closeDuet(); SFX.click(); return; }
  const b = e.target.closest('.hk'); if (!b || !duet) return;
  const k = +b.dataset.k; piano(k, 0.13);
  if (duet.free) { b.classList.add('hit'); setTimeout(() => b.classList.remove('hit'), 300); return; }
  if (duet.turn !== 'you') return;
  const want = duet.notes[duet.i];
  if (k !== want) { bump(b, 'wig'); duetSay(H.miss); keyEl(want).classList.remove('next'); duet.turn = 'her'; setTimeout(herTurn, 700); return; }
  b.classList.remove('next'); b.classList.add('hit'); setTimeout(() => b.classList.remove('hit'), 350);
  duet.i++; duetDots();
  if (duet.i < duet.notes.length) { duet.turn = 'her'; setTimeout(herTurn, 550); return; }
  // the whole phrase: both pianos play it together once, then the window blinks twice
  duet.turn = 'end'; S.hanh.duetDay = dayKey(); S.hanh.d++; S.hanh.total++; save();
  setTimeout(() => { duet && duet.notes.forEach((n, j) => { piano(n, 0.09, false, j * 0.42); piano(n, 0.05, true, j * 0.42 + 0.03); }); }, 500);
  setTimeout(() => { if (!duet) return; duetSay(H.done[Math.floor(Math.random() * H.done.length)]); hearts(); SFX.sparkle(); hWin.classList.add('blink'); setTimeout(() => hWin.classList.remove('blink'), 2200); duet.free = true; applyHanh(); }, 3300);
});

// ---------------------------------------------------------------- letters (mailbox under the stairs)
function hSend(id, line) {
  S.hanh.mail = { id, at: id === 4 ? (HTEST ? Date.now() : Date.now() + 30 * 60e3) : id === 5 ? Date.now() : tomorrow6() }; save();
  SFX.paper(); if (line !== ' ') toast(line || 'Mẩu giấy đã thả vào hòm thư dưới chân cầu thang ✉️', 3200);
}
function hMailReady() { const m = S.hanh.mail; return !!m && Date.now() >= m.at; }
function hLetter(id) {
  const boat = id % 2 ? hpic('hanh_boat', '⛵', 5) : hpic('hanh_env', '✉️🎼', 5);
  const sign = '<small>— Cô Hạnh —</small>';
  S.hanh.mail = null; save();
  if (id === 1) {
    showPaper(boat + staged(H.l1, '<small>— Cô Hạnh, bên kia hẻm —</small>'), () => { S.story.hanh = 1; S.hanh.nextAt = tomorrow6(); save(); applyHanh(); toast('Tối nay nếu đèn bên kia hẻm sáng, có khi cô sẽ đàn lại 🎹', 3400); });
  } else if (id === 2) {
    const song = H.songs[S.hanh.song || 0];
    showPaper(boat + staged(H.l2.map(t => t.replace('{song}', song)), hpic('hanh_sheet', '🎼📜', 5) + sign + '<small>Đã cất tờ giấy chép nhạc vào hộp kỷ vật</small>'), () => {
      S.story.hanh = 2; S.keep.hanh_sheet = 1; S.hanh.d = 0; save(); applyHanh(); SFX.sparkle();
      toast('Tối nào thấy đèn bên kia hẻm sáng, chạm vào ô cửa để hòa tấu cùng cô 🎹', 4200);
    });
  } else if (id === 3) {
    showPaper(boat + staged(H.l3, hpic('hanh_clip', '🎼📎', 4) + sign + '<button class="reply" id="h-clip">🎀 Kẹp khóa Sol vào ruy băng của Bánh Quy</button>'), null, true);
    const go = () => { const b = $('#h-clip'); if (!b) return setTimeout(go, 300); b.addEventListener('click', e => { e.stopPropagation(); S.hanh.clipAt = HTEST ? Date.now() - 1 : Date.now(); save(); closeNote(); bump($('#p-cat'), 'hop'); SFX.purr && SFX.purr(); toast('Bánh Quy chạy tót xuống cầu thang, chiếc kẹp khóa Sol lấp lánh trên ruy băng 🐈', 3800); }); };
    go();
  } else if (id === 4) {
    showPaper(boat + staged(H.l4, hpic('hanh_metronome', '⏱️', 5) + sign + '<small>Đã cất máy đếm nhịp vào hộp kỷ vật</small>'), () => {
      S.story.hanh = 4; S.keep.hanh_metronome = 1; S.hanh.d = 0; save(); applyHanh(); SFX.sparkle(); tick(4);
    });
  } else if (id === 5) {
    showPaper(boat + staged(H.l5, hpic('painting_hanh', '🖼️🎹', 6) + '<small>— Cô Hạnh, Lớp Đàn Nhỏ Bên Kia Hẻm —</small><small>Nhận tranh ký họa cây đàn bên ô cửa sổ và con dấu Khóa Sol 🎼</small>'), () => {
      S.story.hanh = 5; S.keep.painting_hanh = 1; S.keep.st_treble = 1; save(); applyHanh(); SFX.sparkle(); hearts();
      setTimeout(() => farTune([0, 2, 4, 5, 7, 5, 4, 2, 0], 0.5, 0.06), 900);
    });
  }
  stageReveal(id === 3);
}
function tick(n) { if (!AC || S.muted) return; for (let i = 0; i < n; i++) noiseBurst(AC.currentTime + i * 1.0, 0.025, i % 2 ? 2600 : 3400, 0, 12, 0.16); }
const _openMailboxH = openMailbox;
openMailbox = function () {
  _openMailboxH();
  if (hMailReady()) {
    const id = S.hanh.mail.id;
    mboxSay(id % 2 ? 'Có một chiếc thuyền giấy gấp từ giấy chép nhạc kẹp ở khe hòm thư.' : 'Có một phong thư nhỏ in hình khóa Sol nằm trong hòm thư.', '<button class="reply" id="mb-hanh">🎹 Mở thư của cô Hạnh</button>');
    $('#mb-hanh').addEventListener('click', e => { e.stopPropagation(); closeMailbox(); setTimeout(() => hLetter(id), 300); });
  }
};
const _mailNewsH = mailNews; mailNews = function () { return _mailNewsH() || hMailReady(); };

// ---------------------------------------------------------------- the story, one tick
function applyHanh() {
  const st = S.story, h = S.hanh, lit = hView() && hDark() && (h.heard || st.hanh >= 1);
  hWin.classList.toggle('on', lit); hHit.style.display = lit ? '' : 'none';
  if (!started || !S.welcomed || $('#note-wrap').classList.contains('show') || outsideOpen()) return;
  if (h.mail && hMailReady() && !mapOpen() && storyGate('hanhMail' + h.mail.id)) { hLetter(h.mail.id); return; }   // no map yet: the letter comes up the stairs
  if (h.mail) { if (hMailReady() && !h.mailToast) { h.mailToast = h.mail.id; save(); toast(h.mail.id % 2 ? 'Có thuyền giấy của cô Hạnh trong hòm thư dưới chân cầu thang ⛵' : 'Có thư khóa Sol của cô Hạnh trong hòm thư 🎼', 3600); } return; }
  h.mailToast = 0;
  if (st.hanh === 0 && !h.heard && (HTEST || (routeDone() && ITEM_IMG.hanh_play)) && S.weather === 'night' && hView() && storyGate('hanh0')) {
    h.heard = 1; save(); farTune([0, 2, 4, 2], 0.7, 0.06); applyHanh(); setTimeout(() => toast(H.heard, 4200), 2600);
  } else if (st.hanh === 1 && Date.now() >= h.nextAt && storyGate('hanh2')) {
    showPaper(`<p class="bub">Bạn muốn viết gì gửi cô Hạnh?</p>${H.cheer.map((t, i) => `<button class="reply" data-hc="${i}">✉️ “${t}”</button>`).join('')}`, null, true);
    document.querySelectorAll('#note [data-hc]').forEach(b => b.addEventListener('click', e => {
      e.stopPropagation();
      showPaper(`<p class="bub">Cùng cô chọn một bài êm dịu, tối nay cô sẽ đàn bài đó:</p>${H.songs.map((t, i) => `<button class="reply" data-hs="${i}">🎵 ${t}</button>`).join('')}`, null, true);
      document.querySelectorAll('#note [data-hs]').forEach(c => c.addEventListener('click', ev => {
        ev.stopPropagation(); S.hanh.song = +c.dataset.hs; closeNote(); hSend(2); S.hanh.playNight = dayKey(); save();
      }));
    }));
  } else if (st.hanh === 2 && h.d >= 2 && !h.clipAt && storyGate('hanhNa')) {
    showPaper(`<small>Mảnh giấy nhỏ kẹp trong ruy băng của Bánh Quy</small>${ITEM_IMG.na_cat ? '' : ''}<p class="bub">${H.na1}</p><small>${naName()}</small>`, () => hSend(3, 'Cô Hạnh chắc cũng đã thấy vị khán giả nhí rồi 🎹'));
    h.clipAt = -1; save();
  } else if (st.hanh === 2 && h.clipAt > 0 && Date.now() - h.clipAt > (HTEST ? 0 : 2 * HOUR) && storyGate('hanhNa2')) {
    showPaper(`<small>Mảnh giấy nhỏ kẹp trong ruy băng của Bánh Quy</small><p class="bub">${H.na2}</p><small>${naName()}</small>`, () => { S.story.hanh = 3; S.hanh.d = 0; save(); applyHanh(); });
  } else if (st.hanh === 3 && h.d >= 2 && S.weather === 'sunset' && storyGate('hanh4')) {
    farTune([0, 2, 2, 4, 3, 2, 0], 0.65, 0.06);
    showPaper(`${hpic('hanh_room', '🎹', 9)}<p class="bub">${H.ch4}</p>`, () => hSend(4, 'Lát nữa xuống hòm thư xem nhé, cô Hạnh có gửi gì đó 🎼'));
    S.hanh.d = -99; save();
  } else if (st.hanh === 4 && h.d >= 2 && S.weather === 'night' && hView() && storyGate('hanh5')) {
    hWin.classList.add('blink'); setTimeout(() => hWin.classList.remove('blink'), 2200);
    toast('Ô cửa bên kia hẻm sáng hơn mọi hôm. Có thư của cô Hạnh trong hòm thư 🎼', 4000); hSend(5, ' '); S.hanh.mailToast = 5;
  }
}
hHit.addEventListener('click', e => {
  e.stopPropagation(); const st = S.story;
  if (st.hanh === 0 && S.hanh.heard && !S.hanh.mail) {
    showPaper(`${hpic('hanh_badge', '🏠🎹', 6)}<p class="bub">${H.heard}</p><p class="bub">Bạn viết một mẩu giấy hỏi thăm, thả vào hòm thư dưới chân cầu thang:</p>${H.ask.map((t, i) => `<button class="reply" data-ha="${i}">✉️ “${t}”</button>`).join('')}`, null, true);
    document.querySelectorAll('#note [data-ha]').forEach(b => b.addEventListener('click', ev => { ev.stopPropagation(); closeNote(); hSend(1); }));
    return;
  }
  if (st.hanh >= 2) { SFX.click(); openDuet(); return; }
  bump(hWin, 'hop'); toast(st.hanh === 1 ? 'Ô cửa bên kia hẻm sáng đèn vàng. Cô Hạnh chưa mở nắp đàn.' : 'Ô cửa bên kia hẻm vẫn sáng đèn 🎹', 2800);
});
// the far piano on quiet nights (radio off), and the song the player picked on the night after choosing it
setInterval(() => {
  if (!started || document.hidden || !hView() || !hDark() || S.radio || duet || S.story.hanh < 2) return;
  if (Math.random() < 0.3) farTune(PHRASES[Math.floor(Math.random() * PHRASES.length)], 0.6, 0.035);
}, 45000);

// keepsakes, the wall sketch, the notebook
const _useItemH = useItem;
useItem = function (k, row) {
  if (k === 'hanh_sheet') { showFlavor(k, row); farTune(PHRASES[S.hanh.song || 0], 0.5, 0.06); return; }
  if (k === 'hanh_metronome') { showFlavor(k, row); tick(8); return; }
  if (k === 'painting_hanh') { S.wallArt = S.wallArt === k ? false : k; save(); applyWallArt(); openKeepsakes(); SFX.paper(); return; }
  return _useItemH(k, row);
};
const _todayQH = todayQuestion;
todayQuestion = function () {
  const day = Math.floor((Date.now() - new Date().getTimezoneOffset() * 6e4) / 864e5);
  if (!window.qxView && !window.vlView && !window.xmasView && !(typeof tetOn === 'function' && tetOn()) && S.story.hanh >= 2 && day % 7 === 3) return { theme: 'Tiếng đàn bên kia hẻm', q: HANH_Q[Math.floor(day / 7) % 2] };
  return _todayQH();
};
JOURNAL.push({ who: 'Cô Hạnh bên kia hẻm', by: 'Thư thuyền giấy', img: 'hanh_smile', ch: [
  { t: 'Tiếng Đàn Vọng Qua Hẻm', ok: st => (st.hanh || 0) >= 1, x: 'Tối muộn, vài nốt piano ngập ngừng vọng sang từ ô cửa sổ bên kia hẻm rồi tắt hẳn. Cô Hạnh, cô giáo dạy đàn mới về hưu, tai nghe kém dần nên không dám mở nắp đàn nữa.' },
  { t: 'Bản Nhạc Không Cần Nghe Bằng Tai', ok: st => (st.hanh || 0) >= 2, x: 'Bạn động viên cô cứ đàn cho vui hẻm và cùng cô chọn một bài êm dịu. Cô gửi tờ giấy chép nhạc ngả màu: đầu ngón tay cô vẫn nhớ hết giai điệu cũ.' },
  { t: 'Khán Giả Nhí Đầu Tiên', ok: st => (st.hanh || 0) >= 3, x: 'Bé Na đứng ngoài cửa sổ nghe lén tiếng đàn. Cô Hạnh nhờ bạn chuyển cho bé chiếc kẹp khóa Sol và rủ bé sang tập những nốt đầu tiên.' },
  { t: 'Buổi Học Đàn Chiều Thứ Bảy', ok: st => (st.hanh || 0) >= 4, x: 'Tiếng đàn ngọng nghịu của bé Na xen tiếng cười hiền của cô Hạnh. Cô tặng bạn chiếc máy đếm nhịp đã theo cô suốt những năm đi dạy.' },
  { t: 'Lớp Đàn Nhỏ Bên Kia Hẻm', ok: st => (st.hanh || 0) >= 5, x: 'Cô Hạnh mở góc dạy đàn miễn phí mỗi cuối tuần cho trẻ con trong hẻm, tặng bạn bức ký họa cây đàn bên ô cửa sổ và con dấu Khóa Sol.' },
] });
EPILOGUE.push([
  'Hôm nay bé Na đánh trọn được bài \'Con cò bé bé\' rồi cháu ạ. Con bé khoe sẽ về đàn lại cho mèo Bánh Quy nghe, không biết Bánh Quy có chịu ngồi yên không nữa.',
  'Cô mới lau lại toàn bộ phím đàn bằng khăn mềm, tiện tay cắm thêm một bình hoa cúc nhỏ chị bán hoa tặng trên nóc đàn. Góc phòng tự nhiên sáng bừng lên.',
  'Chiều nay trời đổ mưa, cô mở cửa sổ đàn một bản nhạc chậm. Nghe tiếng mưa gõ nhịp ngoài hiên, cô thấy tai mình chẳng cần nghe rõ hết mọi âm thanh vẫn thấy cuộc đời thật êm.',
]);
// a restored stage between two papers goes back one step
if (S.hanh.clipAt === -1 && !S.hanh.mail) S.hanh.mail = { id: 3, at: Date.now() };
if (S.hanh.d < 0 && S.story.hanh === 3 && !S.hanh.mail && !S.keep.hanh_metronome) S.hanh.mail = { id: 4, at: Date.now() };
setInterval(applyHanh, 2500);
applyHanh();
