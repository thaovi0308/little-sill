// ================================================================ Đêm Cả Hẻm Sáng Đèn (Vi 28/11: src/vi_1128/alley_all_lit.jpg)
// The shared ending once all 7 neighbours' stories are complete (every JOURNAL chapter done, after the 4-route finale):
// that night every window in the alley lights up, lanterns strung across, and the neighbours each say one line.
// Afterwards the night stays in the keepsake box (k_alllit) and can be switched on again from the sound panel. ?sang to try.
const LIT_TEST = /[?&]sang\b/.test(location.search);
const todayKey = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
function allSeven() { return LIT_TEST || JOURNAL.every(L => L.ch.every(c => c.ok(S.story || {}))); }
function litOn() { return S.weather === 'night' && (S.allLitDay === todayKey() || !!S.allLitForce); }
const LIT = {
  b: ['Tối nay vừa mở cửa sổ, bạn thấy con hẻm sáng lên từng ô cửa một, như có ai khẽ đếm: một, hai, ba…',
    'Tiệm đồng hồ của bác bật đèn trước tiên. Rồi tầng trên của cậu họa sĩ, ô cửa nhà cô Hạnh có tiếng đàn, tiệm hoa của chị Thảo, và tận cuối hẻm là tấm biển “Old Bookstore” của ông Khải.',
    'Dưới hẻm, bé Na với tụi nhỏ giăng một dây lồng đèn giấy ngang qua đầu ngõ. Bà chủ nhà đứng dưới chân cầu thang, ngước lên nhìn căn gác của bạn và mỉm cười.'],
  lines: [['Bác sửa đồng hồ', 'Đồng hồ cả tiệm bác chỉnh cho chạy cùng một nhịp rồi. Tối nay cả hẻm cùng một giờ với cháu.'],
    ['Cậu họa sĩ tầng trên', 'Mình đang vẽ con hẻm này, lần này ô cửa nào cũng sáng. Ô của bạn mình tô sáng nhất.'],
    ['Bé Na & Bánh Quy', 'Tụi em hẹn nhau bật đèn cùng lúc đó! Anh chị nhìn thấy dây lồng đèn tụi em treo không?'],
    ['Chị bán hoa đầu hẻm', 'Chị để đèn tiệm sáng tới khuya, chậu nào em từng tưới chị cũng đặt ra ngoài hiên hết.'],
    ['Minh ở phương xa', 'Bà gửi ảnh con hẻm cho mình rồi. Đi xa mấy, nhìn ảnh này mình cũng biết đường về.'],
    ['Ông Khải tiệm sách', 'Ông kẹp một bông giấy hồng vào cuốn sổ ép hoa, trang của đêm nay.'],
    ['Cô Hạnh bên kia hẻm', 'Bài đầu tiên cô đàn tối nay là bài cháu hay ngân theo đó.'],
    ['Bà chủ nhà tầng dưới', 'Bao nhiêu năm rồi bà mới lại thấy cả hẻm sáng đèn như ngày xưa. Bà chụp lại một tấm, cháu giữ lấy nhé.']],
};
function litLetter(again) {
  const pic = `<img class="paper-img" src="${ITEM_IMG.k_alllit}" alt="Con hẻm đêm, mọi ô cửa cùng sáng đèn" style="max-height:11em;width:auto;border-radius:6px">`;
  const lines = LIT.lines.map(([who, t]) => `<p style="margin:.4em 0"><b>${who}:</b> “${t}”</p>`).join('');
  const end = `${lines}<small>${again ? 'Tấm ảnh đêm cả hẻm sáng đèn' : 'Bà gửi kèm tấm ảnh đêm nay, đã cất vào Hộp kỷ vật'} 🏮</small>`;
  return pic + staged(LIT.b, end);
}
function startAllLit() {
  S.allLit = Date.now(); S.allLitDay = todayKey(); S.keep.k_alllit = 1; save();
  if (S.weather !== 'night') setWeather('night'); else applyLook();
  SFX.sparkle(); setTimeout(() => SFX.chime(0.4), 900); if (typeof farTune === 'function') setTimeout(() => farTune(PHRASES[6], 0.55, 0.045), 1800);
  showPaper(litLetter(false), () => { playMusicBox(); petals(24); toast('Đêm nay cả hẻm sáng đèn 🏮 bật lại lúc nào cũng được trong bảng Âm thanh', 4600); }, true);
  stageReveal(true);
}
setInterval(() => {
  if (!started || !S.welcomed || S.allLit || !S.keep.alley && !LIT_TEST || !allSeven()) return;
  if ($('#note-wrap').classList.contains('show') || outsideOpen()) return;
  if (!storyGate('allLit')) return;
  startAllLit();
}, 5000);
// the window: on that night (and whenever the player switches it back on) the all-lit alley replaces the everyday one
const _applyLookLit = applyLook;
applyLook = function () {
  _applyLookLit();
  window.litView = litOn();
  const img = document.querySelector('.scene[data-w="night"][data-tet="L"]');
  if (window.litView && img) {
    window.seaView = true;   // its own moon, stars and lit windows are painted in: the everyday overlays step aside
    document.querySelectorAll('.scene').forEach(el => el.classList.toggle('on', el === img));
    $('#backdrop').style.backgroundImage = `url(${img.src})`;
  }
  const hw = $('#hwin'); if (hw) hw.style.visibility = window.litView ? 'hidden' : '';
};
applyLook();
// keepsake: tap to read the night again / switch it on
const _useItemLit = useItem;
useItem = function (k, row) {
  if (k !== 'k_alllit') return _useItemLit(k, row);
  showPaper(litLetter(true) , null, true); stageReveal(true);
};
// sound panel switch, next to Đêm Trăng Rằm
const _openSoundLit = openSound;
openSound = function () {
  _openSoundLit();
  if (!S.allLit) return;
  const b = document.createElement('button'); b.className = 'reply'; b.id = 'v-lit';
  b.textContent = S.allLitForce ? '🏮 Đêm Cả Hẻm Sáng Đèn: đang bật' : '🏮 Đêm Cả Hẻm Sáng Đèn: đang tắt';
  $('#v-mute').before(b);
  b.addEventListener('click', e => { e.stopPropagation(); S.allLitForce = !S.allLitForce; if (S.allLitForce) S.allLitDay = null; save(); applyLook(); openSound();
    if (S.allLitForce) toast(S.weather === 'night' ? 'Cả hẻm lại sáng đèn 🏮' : 'Chuyển sang trời đêm để thấy cả hẻm sáng đèn 🏮', 3400); });
};
