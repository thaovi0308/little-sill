// ================================================================ Vu Lan · Đêm Rằm Tháng Bảy + Thất Tịch · Chiều Mưa Ngâu
// Texts: Vi 27/11 (work/vi_scripts_vulan_thattich.md). Art: Vi 27/11 (work/cut_vulan.py, cut_vulan2.py, cut_thattich.py,
// cut_thattich_view.py; scenes work/build_vlqx_scenes.py). Lunar dates: Vietnamese calendar (UTC+7, Hồ Ngọc Đức's algorithm).
// Vu Lan: 14-16 of the 7th lunar month; Thất Tịch: the 7th of the 7th lunar month. After one finished route the sound panel
// has "Không Khí Vu Lan" / "Không Khí Thất Tịch" switches; ?vulan / ?thattich force them for testing. Tết and Giáng Sinh win.
const VL_DAYS = { 2027: '2027-08-16', 2028: '2028-09-03', 2029: '2029-08-24', 2030: '2030-08-13', 2031: '2031-09-01' };   // rằm tháng 7
const QX_DAYS = { 2027: '2027-08-08', 2028: '2028-08-26', 2029: '2029-08-16', 2030: '2030-08-05', 2031: '2031-08-24' };   // mùng 7 tháng 7
function vlSeason() {
  if (/[?&]vulan\b/.test(location.search)) return 'test';
  const now = Date.now();
  for (const y in VL_DAYS) { const t = new Date(VL_DAYS[y] + 'T00:00:00').getTime(); if (now >= t - 864e5 && now < t + 2 * 864e5) return y; }
  return null;
}
function qxSeason() {
  if (/[?&]thattich\b/.test(location.search)) return 'test';
  const k = dayKey(); for (const y in QX_DAYS) if (QX_DAYS[y] === k) return y;
  return null;
}
function bigSeason() { return (typeof tetOn === 'function' && tetOn()) || (typeof xmasOn === 'function' && xmasOn()); }
function qxOn() { return !bigSeason() && (!!qxSeason() || (!!S.qxForce && routeDone())); }
function vlOn() { return !bigSeason() && !qxOn() && (!!vlSeason() || (!!S.vlForce && routeDone())); }
function vlState() { const id = vlSeason() || 'free'; if (!S.vl || S.vl.id !== id) S.vl = { id, step: 0, rose: null, lit: 0 }; return S.vl; }
function qxState() { const id = qxSeason() || 'free'; if (!S.qx || S.qx.id !== id) S.qx = { id, step: 0, rainDay: '', wish: 0, che: 0 }; return S.qx; }

const VL = {
  lady: ['Sáng nay đi chợ sớm, bà ghé cổng chùa xin về hai bông hồng cài áo, một đỏ một trắng. Tháng Bảy mưa ngâu dễ làm người ta chạnh lòng, nhưng còn nhớ về cha mẹ, còn thương nhau thì lòng vẫn ấm cháu ạ.',
    'Bà để hoa trên bàn cho cháu chọn. Tối nay rằm, dưới hiên nhà bà có chậu nước thả hoa đăng, cháu rảnh thì xuống thắp chung với bà một ngọn nến nhé.'],
  red: 'Một đóa hồng đỏ thắm cài lên ngực áo. Cảm ơn đời vì vẫn còn người để gọi một tiếng ‘mẹ cha’ mỗi khi trở về.',
  white: 'Một đóa hồng trắng tinh khôi, lặng lẽ nhưng ấm áp. Những người thương yêu chưa bao giờ rời đi, họ vẫn ở lại trong từng nếp nghĩ hiền lành của mình.',
  night: ['Ngọn nến nhỏ trong lòng hoa đăng khẽ rung lên trên mặt nước, soi bóng trăng rằm tháng Bảy tròn vành vạnh. Bánh Quy ngồi thu mình bên cạnh, ngoan ngoãn nhìn ánh lửa vàng nhảy múa.',
    'Bà chỉ cầu cho cháu một đời bình an, đi đâu làm gì cũng có một chốn nhỏ để quay về nghỉ chân.'],
  call: 'Trăng rằm tháng Bảy đã lên cao. Dưới hiên nhà bà chủ nhà, chậu nước gốm thả hoa đăng đang chờ một ngọn nến nhỏ.',
  calm: ['Hoa đăng trôi chầm chậm, ánh nến soi bóng trăng lung linh trên mặt nước.', 'Bà ngồi lặng yên trên chiếc ghế đẩu, mắt nhìn ánh nến, miệng khẽ mỉm cười.',
    'Một làn gió nhẹ lướt qua, ngọn nến nghiêng mình rồi lại đứng thẳng, bình an.'],
};
const VL_Q = ['Điều giản dị nào từ gia đình khiến bạn thấy biết ơn nhất?', 'Một món ăn ở nhà mà đi xa đến đâu bạn vẫn nhớ vị?',
  'Có lời hỏi thăm nào bạn muốn nhắn gửi về nhà tối nay không?', 'Lần gần nhất bạn thấy lòng mình thật sự bình yên là khi nào?'];
const QX = {
  open: 'Chiều nay trời đổ mưa ngâu. Hạt mưa không ào ạt mà cứ lất phất, giăng một màn sương tím nhạt ngang qua giàn hoa giấy. Người xưa bảo mưa tháng Bảy là nước mắt ngày gặp lại, còn ở con hẻm nhỏ này, mưa ngâu chỉ làm tiếng radio nghe trầm và ấm hơn.',
  minh: ['Hôm nay mùng Bảy tháng Bảy, chỗ mình trời cũng mưa lất phất từ sáng. Nhìn mưa lại nhớ cái hiên nhà đầy cây xanh và tách trà nóng trên căn gác của bạn.',
    'Người ta hay nhắc chuyện Ngưu Lang – Chức Nữ cách trở, nhưng mình nghĩ, chỉ cần hai người còn nhớ đến nhau, còn giữ một góc nhỏ cho nhau trong lòng thì khoảng cách bao xa cũng hóa gần.',
    'Mình gửi kèm một sợi chỉ đỏ nhỏ, bạn buộc lên cành cây bên cửa sổ cho vui nhé!'],
  florist: 'Mưa ngâu lạnh thế này, chị nấu một nồi chè đậu đỏ nhỏ, múc cho em một chén mang lên gác ăn cho ấm bụng nhé. Chúc em một mùa Thất Tịch thật dịu dàng, dù đang thương ai hay đang tự thương lấy chính mình.',
  wishAsk: 'Sợi chỉ đỏ buộc trên chuông gió khẽ đung đưa trong mưa. Bạn muốn gửi theo gió lời chúc gì cho người phương xa?',
  wishes: [['💞', 'Một mối duyên lành', 'Gió mang lời chúc duyên lành bay đi xa. Mong người phương xa gặp được người thương, và được thương lại thật nhiều.'],
    ['🕊️', 'Bình an mỗi ngày', 'Gió mang lời chúc bình an bay đi xa. Mong người phương xa đi đâu cũng có mưa dịu, nắng hiền và một mái hiên để trú.']],
  che: ['Chè đậu đỏ ngọt bùi, ấm từ đầu lưỡi xuống tận bụng ❤️', 'Hạt đậu đỏ nấu nhừ, thơm mùi lá dứa. Ngoài kia mưa ngâu vẫn lất phất.'],
};
const TT_Q = ['Nếu được gửi một lá thư tay cho một người ở xa lúc này, bạn sẽ viết câu đầu tiên là gì?', 'Một kỷ niệm đẹp dưới trời mưa mà bạn vẫn giữ mãi?',
  'Điều tử tế nào bạn mong sẽ tìm đến với mình trong những tháng cuối năm?', 'Giữa những ngày bận rộn, ai là người khiến bạn thấy lòng mình nhẹ nhõm mỗi khi nghĩ tới?'];
STAMPS.push(['🪷', 'Hoa Sen', 'st_lotus', 'st_lotus'], ['🐦', 'Chim Ô Thước', 'st_magpie', 'st_magpie']);
Object.assign(FLAVOR, {
  rose_red: [VL.red, 'Cánh hồng đỏ thắm vẫn còn giữ hương thơm buổi sáng ở cổng chùa.'],
  rose_white: [VL.white, 'Cánh hồng trắng mỏng như giấy, lặng lẽ mà ấm áp.'],
  red_thread: ['Sợi chỉ đỏ nhỏ của Minh. Người ta bảo những người có duyên được buộc với nhau bằng một sợi chỉ như thế này.', 'Sợi chỉ đỏ may mắn, mảnh mà bền, như những mối thương nhớ đường xa.'],
});

// ---------------------------------------------------------------- room pieces
const vmk = (tag, id, cls) => { const e = document.createElement(tag); if (id) e.id = id; e.className = cls; if (tag === 'img') e.alt = ''; e.style.display = 'none'; return e; };
const qEnv = vmk('img', 'p-qenv', 'prop'), qThread = vmk('img', 'p-qthread', 'prop'), qChe = vmk('img', 'p-qche', 'prop'), vRose = vmk('img', 'p-vrose', 'prop');
qEnv.src = ITEM_IMG.tt_envelope; qThread.src = ITEM_IMG.red_thread; qChe.src = ITEM_IMG.chedaudo;
qThread.style.transformOrigin = '50% 4%';
$('#p-tea2').after(qEnv, qChe, vRose);
$('#p-chime').after(qThread);
const vHit = { env: vmk('button', null, 'hit'), thread: vmk('button', null, 'hit'), che: vmk('button', null, 'hit'), rose: vmk('button', null, 'hit') };
vHit.env.setAttribute('aria-label', 'Phong thư dấu sáp đỏ'); vHit.thread.setAttribute('aria-label', 'Sợi chỉ đỏ'); vHit.che.setAttribute('aria-label', 'Chén chè đậu đỏ'); vHit.rose.setAttribute('aria-label', 'Bông hồng cài áo');
hitsEl.append(vHit.env, vHit.thread, vHit.che, vHit.rose);
const QENV = [424, 1046, 136, 65], QCHE = [230, 838, 78, 57], VROSE = [234, 832, 52, 61];
place(qEnv, ...QENV); qEnv.style.transform = 'rotate(-5deg)'; place(vHit.env, QENV[0] - 6, QENV[1] - 10, QENV[2] + 12, QENV[3] + 18);
place(qChe, ...QCHE); place(vHit.che, QCHE[0] - 6, QCHE[1] - 8, QCHE[2] + 12, QCHE[3] + 14);
place(vRose, ...VROSE); vRose.style.transform = 'rotate(-28deg)'; place(vHit.rose, VROSE[0] - 8, VROSE[1] - 8, VROSE[2] + 16, VROSE[3] + 16);
function placeThread() {   // tied near the top of whichever wind chime hangs in the window
  const c = CHIMES[S.chimeType] || CHIMES.glass, b = c.box, w = 46, h = w * 532 / 222;
  const x = b[0] + b[2] * 0.44 - w / 2, y = b[1] + b[3] * 0.4;   // a bow on the string under the bell, the tails hang by the paper strip
  place(qThread, x, y, w, h); place(vThreadHit, x - 14, y - 6, w + 28, h + 10);
}
const vThreadHit = vHit.thread;

// magpies: two birds fly in from both sides of the window and meet on the bridge of light (Thất Tịch evenings)
const qSky = document.createElement('div'); qSky.id = 'qsky';
const qBirds = [vmk('img', null, 'qbird'), vmk('img', null, 'qbird')]; qBirds[0].src = ITEM_IMG.magpie1; qBirds[1].src = ITEM_IMG.magpie2;
qSky.append(...qBirds); $('#p-chime').before(qSky);
place(qSky, 116, 196, 480, 420);
const vst = document.createElement('style');
vst.textContent = `#qsky { position: absolute; overflow: hidden; pointer-events: none; }
  #qsky .qbird { position: absolute; width: 18%; filter: drop-shadow(0 2px 2px rgba(30,20,50,.25)); }
  #p-qenv, #p-qche { filter: drop-shadow(0 3px 3px rgba(50,30,20,.3)); }
  #p-vrose { filter: drop-shadow(0 2px 2px rgba(50,30,20,.3)); }
  #p-qthread { filter: drop-shadow(0 1px 1px rgba(60,20,20,.3)); }
  #p-qenv.wait { animation: qwait 2.6s ease-in-out infinite; }
  @keyframes qwait { 0%,100% { filter: drop-shadow(0 3px 3px rgba(50,30,20,.3)); } 50% { filter: drop-shadow(0 0 8px rgba(255,214,150,.95)); } }
  .nb .nb-rose { position: absolute; right: 4%; top: -3%; width: 13%; transform: rotate(18deg); filter: drop-shadow(0 2px 2px rgba(60,30,20,.3)); pointer-events: none; }
  .nb { position: relative; }
  .vl-pick { display: flex; gap: .6em; justify-content: center; margin: .4em 0; }
  .vl-pick button { flex: 1; max-width: 9em; background: #fffaf0; border: 1.5px solid #d9c4a3; border-radius: 12px; padding: .5em .3em; font: inherit; color: #4A3525; cursor: pointer; }
  .vl-pick img { height: 4.2em; display: block; margin: 0 auto .3em; }
  #vlp { position: absolute; inset: 0; z-index: 12; display: flex; align-items: center; justify-content: center; background: rgba(20,18,36,.5); opacity: 0; pointer-events: none; transition: opacity .4s; }
  #vlp.show { opacity: 1; pointer-events: auto; }
  #vlp .vl-card { width: min(92%, 430px); background: #fdf8ee; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,.35); }
  #vlp .vl-head { padding: .5em .9em; font-weight: 700; color: #4A3525; letter-spacing: .04em; display: flex; justify-content: space-between; align-items: center; font-size: .92em; }
  #vlp .vl-head button { border: 0; background: none; font-size: 1.1em; cursor: pointer; color: #4A3525; }
  #vlp .vl-pic { position: relative; aspect-ratio: 3 / 3.2; background: #2b2d4a; overflow: hidden; }
  #vlp .vl-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: brightness(.5) saturate(.75) hue-rotate(-8deg); }
  #vlp .vl-moon { position: absolute; left: 8%; top: 6%; width: 15%; aspect-ratio: 1; border-radius: 50%; background: radial-gradient(circle at 45% 42%, #fffbe8, #f6e7b8 60%, #ead39a);
    box-shadow: 0 0 22px 10px rgba(255,236,180,.45); }
  #vlp img.p { position: absolute; }
  #vlp .vl-lady { right: 1%; bottom: 2%; height: 74%; }
  #vlp .vl-herb { left: 2%; bottom: 17%; height: 30%; filter: brightness(.85); }
  #vlp .vl-lady, #vlp .vl-basin { filter: brightness(.92); }
  #vlp .vl-basin { left: 22%; bottom: 3%; width: 50%; }
  #vlp .vl-hd { left: 3%; bottom: 2%; width: 18%; cursor: pointer; transition: left 1.6s ease-in-out, bottom 1.6s ease-in-out, width 1.6s; z-index: 2; }
  #vlp .vl-hd.float { left: 36%; bottom: 17.5%; width: 21%; animation: vlbob 3.2s ease-in-out 1.6s infinite; }
  #vlp .vl-hd.lit { filter: drop-shadow(0 0 10px rgba(255,210,120,.95)) drop-shadow(0 0 22px rgba(255,190,90,.6)); }
  #vlp .vl-glow { position: absolute; left: 30%; bottom: 12%; width: 34%; aspect-ratio: 1.6; border-radius: 50%; background: radial-gradient(ellipse, rgba(255,214,140,.55), rgba(255,200,120,0) 70%);
    opacity: 0; transition: opacity 1.2s; pointer-events: none; animation: vlflick 2.4s ease-in-out infinite; }
  #vlp.lit .vl-glow { opacity: 1; }
  @keyframes vlbob { 0%,100% { transform: translateY(0) rotate(-1.5deg); } 50% { transform: translateY(-3%) rotate(1.5deg); } }
  @keyframes vlflick { 0%,100% { transform: scale(1); } 45% { transform: scale(1.06); } 70% { transform: scale(.97); } }
  #vlp .vl-text { padding: .8em 1em 1em; color: #4A3525; line-height: 1.5; min-height: 3.4em; }`;
document.head.append(vst);

// ---------------------------------------------------------------- the porch on the night of the full moon (Vu Lan)
const vlp = document.createElement('div'); vlp.id = 'vlp'; vlp.setAttribute('role', 'dialog'); vlp.setAttribute('aria-label', 'Hiên nhà bà chủ nhà');
vlp.innerHTML = `<div class="vl-card"><div class="vl-head">🪷 HIÊN NHÀ BÀ · ĐÊM RẰM <button id="vl-x" aria-label="Đóng">✕</button></div>
  <div class="vl-pic"><img class="vl-bg" src="${ITEM_IMG.stairs_scene || ITEM_IMG.stairs_bg || ''}" alt=""><i class="vl-moon"></i>
  <img class="p vl-herb" src="${ITEM_IMG.vl_herb}" alt=""><img class="p vl-basin" src="${ITEM_IMG.vl_basin_empty}" alt=""><i class="vl-glow"></i>
  <img class="p vl-hd" id="vl-hd" src="${ITEM_IMG.hoadang_off}" alt="Hoa đăng"><img class="p vl-lady" src="${ITEM_IMG.landlady_sit}" alt="Bà chủ nhà"></div>
  <div class="vl-text" id="vl-text"></div></div>`;
$('#stage').append(vlp);
function vlSay(t) { const e = $('#vl-text'); e.innerHTML = t; bump(e, 'fade'); }
function openPorch() {
  const v = vlState(); if (!AC) initAudio(); footsteps(); duck(0.75);
  const hd = $('#vl-hd'); hd.classList.toggle('float', v.lit >= 1); hd.classList.toggle('lit', v.lit >= 2); hd.src = ITEM_IMG[v.lit >= 2 ? 'hoadang_on' : 'hoadang_off'];
  vlp.classList.toggle('lit', v.lit >= 2); vlp.classList.add('show');
  vlSay(v.lit >= 2 ? VL.calm[Math.floor(Math.random() * VL.calm.length)] : v.lit === 1 ? 'Hoa đăng đã nổi trên mặt nước. Chạm vào ngọn nến để thắp.' : 'Bà đặt sẵn một chiếc hoa đăng sen hồng cạnh chậu nước. Chạm vào hoa đăng để thả xuống nước.');
}
function closePorch() { vlp.classList.remove('show'); duck(1); }
vlp.addEventListener('click', e => {
  e.stopPropagation();
  if (e.target === vlp || e.target.closest('#vl-x')) { closePorch(); SFX.click(); return; }
  const v = S.vl; if (!v) return;
  if (e.target.closest('#vl-hd')) {
    const hd = $('#vl-hd');
    if (!v.lit) { v.lit = 1; save(); hd.classList.add('float'); SFX.water(); vlSay('Hoa đăng chòng chành rồi nổi lên giữa chậu nước. Chạm vào ngọn nến để thắp.'); return; }
    if (v.lit === 1) {
      v.lit = 2; save(); SFX.match(); setTimeout(() => { hd.src = ITEM_IMG.hoadang_on; hd.classList.add('lit'); vlp.classList.add('lit'); SFX.chime(0.25); }, 500);
      vlSay('Ngọn nến nhỏ bừng lên trong lòng hoa sen…');
      setTimeout(() => {
        if (!vlp.classList.contains('show')) return;
        closePorch();
        showPaper(`<img class="paper-img" src="${ITEM_IMG.landlady_sit}" alt="" style="max-height:8em">` + staged(VL.night,
          `<img class="paper-img" src="${ITEM_IMG.st_lotus}" alt="" style="max-height:4em"><small>Kèm theo lời chúc của bà là con dấu “Hoa Sen” cho sổ tay</small><small>— Bà chủ nhà tầng dưới —</small>`), () => {
          S.keep.st_lotus = 1; v.step = 3; save(); applyVlQx(); SFX.sparkle(); toast('Nhận con dấu Hoa Sen 🪷', 3200);
        }); stageReveal(false);
      }, 3600);
      return;
    }
    bump(hd, 'wig'); vlSay(VL.calm[Math.floor(Math.random() * VL.calm.length)]);
  }
});
const _outsideOpenVl = outsideOpen; outsideOpen = function () { return _outsideOpenVl() || vlp.classList.contains('show'); };

function vlPickRose() {
  showPaper(`<p class="bub">Hai bông hồng cài áo bà để trên bàn. Bạn chọn cài bông nào theo lòng mình?</p>
    <div class="vl-pick"><button id="vl-red"><img src="${ITEM_IMG.rose_red}" alt="">Hồng đỏ</button><button id="vl-white"><img src="${ITEM_IMG.rose_white}" alt="">Hồng trắng</button></div>`, null, true);
  const pick = c => e => {
    e.stopPropagation(); const v = S.vl; v.rose = c; v.step = 2; S.keep['rose_' + c] = 1; save(); SFX.paper(); applyVlQx();
    showPaper(`<img class="paper-img" src="${ITEM_IMG['rose_' + c]}" alt="" style="max-height:5em"><p class="bub">${c === 'red' ? VL.red : VL.white}</p><small>Bông hồng đã cài lên góc sổ tay 🌹</small>`, () => {
      setTimeout(() => toast(S.weather === 'night' ? 'Trăng rằm đã lên, xuống hiên nhà bà thả hoa đăng nhé 🪷' : 'Tối nay rằm, chuyển sang trời đêm để xuống hiên thả hoa đăng cùng bà 🌕', 4200), 800);
    });
  };
  $('#vl-red').addEventListener('click', pick('red')); $('#vl-white').addEventListener('click', pick('white'));
}

// ---------------------------------------------------------------- Thất Tịch: the wish on the red thread, the magpies
let birdsBusy = false;
function flyMagpies() {
  if (birdsBusy || reduceMotion) return; birdsBusy = true;
  const [a, b] = qBirds; a.style.display = b.style.display = '';
  const y = 18 + Math.random() * 14, dur = 6200;
  a.animate([{ left: '104%', top: y + 6 + '%', transform: 'rotate(-4deg)' }, { left: '50%', top: y + '%', transform: 'rotate(3deg)', offset: 0.62 }, { left: '44%', top: y - 26 + '%', transform: 'rotate(-10deg)', opacity: 1, offset: 0.85 }, { left: '40%', top: y - 40 + '%', opacity: 0 }], { duration: dur, easing: 'ease-in-out', fill: 'forwards' });
  b.animate([{ left: '-16%', top: y + 10 + '%', transform: 'rotate(4deg)' }, { left: '36%', top: y + 2 + '%', transform: 'rotate(-3deg)', offset: 0.62 }, { left: '42%', top: y - 24 + '%', transform: 'rotate(-12deg)', opacity: 1, offset: 0.85 }, { left: '46%', top: y - 40 + '%', opacity: 0 }], { duration: dur, easing: 'ease-in-out', fill: 'forwards' });
  [a, b].forEach(el => el.animate([{ scale: '1 1' }, { scale: '1 .82' }, { scale: '1 1' }], { duration: 520, iterations: Math.round(dur / 520) }));
  if (AC && !S.muted) setTimeout(() => { playS(['sfx_chirp', 'sfx_chirp2'], 0.2); }, dur * 0.55);
  setTimeout(() => { a.style.display = b.style.display = 'none'; birdsBusy = false; }, dur + 100);
}
function qxWish() {
  const q = S.qx;
  showPaper(`<img class="paper-img" src="${ITEM_IMG.red_thread}" alt="" style="max-height:5em"><p class="bub">${QX.wishAsk}</p>
    ${QX.wishes.map((w, i) => `<button class="reply" data-qwish="${i}">${w[0]} ${w[1]}</button>`).join('')}`, null, true);
  document.querySelectorAll('#note [data-qwish]').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation(); const w = QX.wishes[+b.dataset.qwish], first = !q.wish;
    q.wish = (q.wish || 0) + 1; if (first) S.keep.st_magpie = 1; save(); closeNote();
    bump(qThread, 'wig'); SFX.chime(0.5); setTimeout(flyMagpies, 900);
    toast(w[2], 5200); if (first) setTimeout(() => { SFX.sparkle(); toast('Nhận con dấu Chim Ô Thước 🐦', 3200); }, 5600);
  }));
}
function readQxLetter(again) {
  const known = (S.story.minh || 0) >= 1, sign = known ? '— Minh —' : '— Một người bạn cũ —';
  showPaper(`<small>Phong thư giấy kraft gắn dấu sáp đỏ in hình đôi chim ô thước</small>` + staged(QX.minh,
    `<img class="paper-img" src="${ITEM_IMG.red_thread}" alt="" style="max-height:4.6em"><small>${sign}</small>`), again ? null : () => {
    const q = S.qx; q.step = 2; S.keep.red_thread = 1; S.keep.tt_letter = 1; save(); applyVlQx(); bump(qThread, 'hop'); SFX.chime(0.4);
    toast('Sợi chỉ đỏ đã buộc lên chuông gió 🧵 chạm vào để gửi một lời chúc', 4200);
  }); stageReveal(false);
}

// ---------------------------------------------------------------- one tick
let vlqxWas = '';
function applyVlQx() {
  const vl = vlOn(), qx = qxOn(), mode = qx ? 'q' : vl ? 'v' : '';
  window.qxView = qx; window.vlView = vl;
  if (mode !== vlqxWas) { vlqxWas = mode; applyLook(); }
  const v = vl ? vlState() : null, q = qx ? qxState() : null;
  // Vu Lan: the chosen rose lies on the sill; Thất Tịch: the envelope, the thread on the chime, the bowl of chè
  const rose = !!(v && v.rose); vRose.style.display = vHit.rose.style.display = rose ? '' : 'none'; if (rose) vRose.src = ITEM_IMG['rose_' + v.rose];
  const env = !!(q && q.step === 1); qEnv.style.display = vHit.env.style.display = env ? '' : 'none'; qEnv.classList.toggle('wait', env);
  const thr = !!(q && q.step >= 2); qThread.style.display = vHit.thread.style.display = thr ? '' : 'none'; if (thr) placeThread();
  const che = !!(q && q.step >= 3 && q.che !== dayKey()); qChe.style.display = vHit.che.style.display = che ? '' : 'none';
  if (!started || !S.welcomed) return;
  if (v) {
    if (v.step === 0 && storyGate('vl' + v.id)) {
      v.step = 0.5;
      showPaper(`<img class="paper-img" src="${ITEM_IMG.landlady}" alt="" style="max-height:8em">` + staged(VL.lady,
        `<img class="paper-img" src="${ITEM_IMG.rose_red}" alt="" style="max-height:4em"> <img class="paper-img" src="${ITEM_IMG.rose_white}" alt="" style="max-height:4em"><small>— Bà chủ nhà tầng dưới —</small>`), () => {
        v.step = 1; save(); setTimeout(vlPickRose, 600);
      }); stageReveal(false);
    } else if (v.step === 2 && S.weather === 'night' && storyGate('vlNight' + v.id)) {
      v.step = 2.5; save();
      showPaper(`<p class="bub">${VL.call}</p><button class="reply" id="vl-go">🪷 Xuống hiên thắp nến cùng bà</button><button class="reply" id="vl-later">Để lát nữa</button>`, null, true);
      $('#vl-go').addEventListener('click', e => { e.stopPropagation(); closeNote(); openPorch(); });
      $('#vl-later').addEventListener('click', e => { e.stopPropagation(); closeNote(); toast('Chạm vào bông hồng trên bệ cửa khi muốn xuống hiên nhà bà nhé 🌹', 3600); });
    }
  }
  if (q) {
    if (q.rainDay !== dayKey() && !$('#note-wrap').classList.contains('show')) {   // mưa ngâu: the first look out of the window each Thất Tịch day
      q.rainDay = dayKey(); save(); if (S.weather === 'sunset') setWeather('rain');
      showPaper(`<p class="bub">${QX.open}</p><small>— Chiều mùng Bảy tháng Bảy —</small>`, () => { setTimeout(flyMagpies, 1200); });
      storyLast = Date.now();
    } else if (q.step === 0 && storyGate('qxMail' + q.id)) {
      q.step = 1; save(); applyVlQx(); bump(qEnv, 'hop'); SFX.paper();
      toast((S.story.minh || 0) >= 1 ? 'Có phong thư dấu sáp đỏ của Minh trên bệ cửa ✉️' : 'Có một phong thư dấu sáp đỏ lạ trên bệ cửa ✉️', 3800);
    } else if (q.step === 2 && storyGate('qxChe' + q.id)) {
      q.step = 2.5;
      showPaper(`<small>Túi vải ròng rọc của chị bán hoa thả xuống một chén chè nhỏ còn ấm</small><img class="paper-img" src="${ITEM_IMG.florist}" alt="" style="max-height:6em"><p class="bub">${QX.florist}</p>
        <img class="paper-img" src="${ITEM_IMG.chedaudo}" alt="" style="max-height:3.6em"><small>— Chị Bán Hoa Đầu Hẻm —</small>`, () => {
        q.step = 3; save(); applyVlQx(); bump(qChe, 'hop'); toast('Chén chè đậu đỏ đã đặt trên bệ cửa, chạm để ăn cho ấm bụng 🫘', 3600);
      });
    }
  }
}
vHit.env.addEventListener('click', e => { e.stopPropagation(); if (S.qx && S.qx.step === 1) { bump(qEnv, 'hop'); readQxLetter(false); } });
vHit.thread.addEventListener('click', e => { e.stopPropagation(); if (!S.qx) return; bump(qThread, 'wig'); pushChime(120); qxWish(); });
vHit.che.addEventListener('click', e => {
  e.stopPropagation(); const q = S.qx; if (!q) return;
  q.che = dayKey(); save(); SFX.purr(); hearts(); toast(QX.che[Math.floor(Math.random() * QX.che.length)], 3400);
  qChe.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateY(-6px)' }], { duration: 900, fill: 'forwards' }).onfinish = () => { qChe.getAnimations().forEach(a => a.cancel()); applyVlQx(); };
});
vHit.rose.addEventListener('click', e => {
  e.stopPropagation(); const v = S.vl; if (!v || !v.rose) return; bump(vRose, 'wig');
  if (S.weather === 'night' && v.step >= 2) { openPorch(); return; }
  SFX.paper(); toast(v.rose === 'red' ? VL.red : VL.white, 4200);
});
setInterval(() => { if (window.qxView && S.weather !== 'sunset' && started && !document.hidden && Math.random() < 0.35) flyMagpies(); }, 30000);
if (S.vl && S.vl.step === 0.5) S.vl.step = 0; if (S.vl && S.vl.step === 1) S.vl.step = 0.9; if (S.vl && S.vl.step === 2.5) S.vl.step = 2;
if (S.qx && S.qx.step === 2.5) S.qx.step = 2;
if (S.vl && S.vl.step === 0.9) setTimeout(() => { if (S.vl.step === 0.9) { S.vl.step = 1; vlPickRose(); } }, 2500);   // reloaded before picking a rose

// the notebook: the season's questions, and the chosen rose pinned at the corner
const _todayQ = todayQuestion;
todayQuestion = function () {
  const day = Math.floor((Date.now() - new Date().getTimezoneOffset() * 6e4) / 864e5);
  if (window.qxView) return { theme: 'Mùa Thất Tịch', q: TT_Q[day % TT_Q.length] };
  if (window.vlView) return { theme: 'Mùa Vu Lan', q: VL_Q[day % VL_Q.length] };
  return _todayQ();
};
const _showNoteVl = showNote;
showNote = function () {
  _showNoteVl.apply(this, arguments);
  const v = S.vl, nb = $('#note .nb');
  if (nb && window.vlView && v && v.rose) { const r = document.createElement('img'); r.className = 'nb-rose'; r.src = ITEM_IMG['rose_' + v.rose]; r.alt = ''; nb.append(r); }
};
const _useItemVl = useItem;
useItem = function (k, row) {
  if (k === 'tt_letter') { SFX.paper(); readQxLetter(true); return; }
  return _useItemVl(k, row);
};
window.vlqxReady = true;   // applyLook runs before this file loads; it asks for these seasons only from now on
setInterval(applyVlQx, 2500);
applyVlQx();
