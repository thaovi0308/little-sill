// ================================================================ Tết Trong Hẻm Hoa Giấy (Vi 26/11, texts in work/vi_scripts_pending.md)
// From 25 Chạp to mùng 5 the alley dresses for Tết by itself; after one finished route the "Không Khí Tết" switch (sound panel)
// brings it any day. ?tet forces it for testing.
// Flow: the florist sends a little mai tree (water 2x + an evening sun -> it blooms) -> the landlady brings a tray of bánh chưng
// -> one lì xì a day from the neighbours (one more when the mai blooms), each with a wish and a spring stamp -> the couplet pair.
function tetSeason() {
  if (/[?&]tet\b/.test(location.search)) return 'test';
  const D = { 2027: '2027-02-06', 2028: '2028-01-26', 2029: '2029-02-13', 2030: '2030-02-02', 2031: '2031-01-23' };   // mùng 1
  const now = Date.now();
  for (const y in D) { const t = new Date(D[y] + 'T00:00:00').getTime(); if (now >= t - 6 * 864e5 && now < t + 5 * 864e5) return y; }   // 25 Chạp .. end of mùng 5
  return null;
}
function tetUnlocked() { return routeDone() || (S.story.minh || 0) >= 5; }
function tetOn() { return !!tetSeason() || (!!S.tetForce && tetUnlocked()); }
function tetState() {
  const id = tetSeason() || 'free';
  if (!S.tet || S.tet.id !== id) S.tet = { id, start: Date.now(), step: 0, mai: null, lixi: 0 };
  return S.tet;
}
const TET = {
  florist: ['Sạp hoa đầu hẻm hôm nay rực rỡ nhất năm đấy! Chị gửi tặng em một chậu Mai Vàng nhỏ đặt trên bệ cửa.',
    'Nhớ tưới nước và cho em ấy tắm chút nắng chiều để em ấy nở đúng dịp Tết nha!'],
  lady: ['Tết tới đầu ngõ rồi cháu ơi! Bà vừa gói xong nồi bánh chưng, mang lên cho cháu một đĩa nhỏ với khay mứt gừng để ăn lấy thảo nè.',
    'Thằng con bà năm nay lại không về được, nó hẹn gọi điện chúc Tết. Bà quen rồi cháu ạ, mà năm nay có cháu ở căn gác nhỏ này, con hẻm nhà mình rộn ràng hẳn lên. Bà chúc cháu một năm mới cứ thong thả, bình an như những ngày ngồi bên ô cửa này nhé!'],
  tray: 'Một miếng mứt gừng cay ấm, một viên kẹo lạc giòn tan... Tết ở căn gác nhỏ tuy giản dị nhưng ngọt ngào đến lạ.',
  mai: 'Những cánh mai vàng mỏng manh rung rinh trong gió xuân, mang theo hương thơm dịu nhẹ báo hiệu một năm mới bình an.',
  couplet: 'Tấm giấy đỏ thắm thơm mùi mực tàu, lưu giữ lại hơi ấm của mùa Tết đầu tiên tại căn gác nhỏ Hẻm Hoa Giấy.',
  shop: 'Sạp hoa đầu hẻm hôm nay rực rỡ nhất năm đấy! Chậu mai chị gửi lên gác đã nhú nụ chưa em?',
};
// one lì xì a day; [who, picture, wish, stamp key in S.keep, stamp name]
const LIXI = [
  ['Bác sửa đồng hồ', 'old_window', 'Năm mới bác chúc cháu lúc nào cũng thong dong, chẳng bao giờ phải vội vàng chạy theo kim đồng hồ. Mong mọi khoảnh khắc của cháu đều là giờ đẹp nhất!', 'st_tet_watch', 'Đồng Hồ Mùa Xuân'],
  ['Cậu họa sĩ tầng trên', 'painting', 'Chúc bạn một năm mới rực rỡ như bảng màu mùa xuân, vẽ nên thật nhiều ngày vui và chẳng còn những buổi tối bí ý tưởng hay mệt mỏi nữa!', 'st_tet_brush', 'Cọ Vẽ Hoa Mai'],
  ['Bé Na & Bánh Quy', 'na_cat', 'Chúc anh chị năm mới ăn thật ngon, ngủ thật say và lúc nào cũng cười tươi như hoa cúc họa mi ạ! Bánh Quy cũng chúc meo meo nè!', 'st_tet_cat', 'Mèo Đeo Nơ Đỏ'],
  ['Chị bán hoa đầu hẻm', 'florist', 'Chúc em năm mới tâm hồn luôn xanh mướt như chậu trầu bà, bình yên như cúc họa mi và kiên cường như xương rồng trên bệ cửa nhé!', 'st_tet_mai', 'Cánh Mai Vàng'],
  ['Minh ở phương xa', 'pc_station', 'Dù đang ở phương xa nhưng lòng mình vẫn hướng về Hẻm Hoa Giấy. Chúc bạn một năm mới đi qua thật nhiều ngày nắng đẹp và sớm ngày tái ngộ!', null, null],
];
function lixiList() { return LIXI.filter(l => l[3] || (S.story.minh || 0) >= 1); }
function lixiReady() {   // how many envelopes may have arrived by now
  const t = S.tet; if (!t || t.step < 2) return 0;
  const days = Math.floor((Date.now() - t.start) / (24 * HOUR)) + 1 + (t.mai && t.mai.bloom ? 1 : 0) + (t.id === 'test' ? 9 : 0);
  return Math.min(lixiList().length, days);
}
// ---- room pieces
$('#p-mai').src = ITEM_IMG.mai_bud; $('#p-tray').src = ITEM_IMG.tet_tray; $('#p-lixi').src = ITEM_IMG.tet_lixi;
$('#p-cpl').src = ITEM_IMG.tet_couplet_l; $('#p-cpr').src = ITEM_IMG.tet_couplet_r;
place($('#p-tray'), 386, 1082, 116, 66); place($('#p-lixi'), 177, 1056, 33, 60);
place($('#p-cpl'), 3, 330, 40, 79); place($('#p-cpr'), 671, 330, 40, 79);
const MAI_BOX = { bud: [636, 790, 60, 117], bloom: [618, 802, 84, 106] };
function applyTet() {
  const on = tetOn(); S.tetOn = on; window.tetView = on;
  const t = on ? tetState() : null, mai = t && t.mai;
  $('#p-mai').style.display = mai ? '' : 'none'; HITS.mai.el.style.display = mai ? '' : 'none';
  if (mai) { $('#p-mai').src = ITEM_IMG[mai.bloom ? 'mai_pot' : 'mai_bud']; place($('#p-mai'), ...MAI_BOX[mai.bloom ? 'bloom' : 'bud']); }
  const tray = !!t && t.step >= 2; $('#p-tray').style.display = tray ? '' : 'none'; HITS.tray.el.style.display = tray ? '' : 'none';
  const lx = !!t && t.lixi < lixiReady(); $('#p-lixi').style.display = lx ? '' : 'none'; HITS.lixi.el.style.display = lx ? '' : 'none';
  const cp = !!S.coupletOut; $('#p-cpl').style.display = $('#p-cpr').style.display = cp ? '' : 'none';
  if (document.querySelector('.scene.on') && (document.querySelector('.scene.on').dataset.tet === '1') !== on) applyLook();
  if (!t || !started || !S.welcomed) return;
  if (mai && !mai.bloom && S.weather === 'sunset' && !mai.sun) { mai.sun = 1; save(); }
  if (t.step === 0 && storyGate('tetMai' + t.id)) {
    t.step = 0.5; const face = `<img class="paper-img" src="${ITEM_IMG.florist}" alt="" style="max-height:7em">`;
    showPaper(face + staged(TET.florist, `<img class="paper-img" src="${ITEM_IMG.mai_bud}" alt="" style="max-height:6em"><small>— Chị bán hoa đầu hẻm —</small>`), () => {
      t.step = 1; t.mai = { w: 0, sun: S.weather === 'sunset' ? 1 : 0, bloom: 0 }; save(); applyTet(); bump($('#p-mai'), 'hop');
      toast('Chậu mai nhỏ đã đặt ở góc bệ cửa 🌼 tưới 2 lần và chờ nắng chiều nhé', 4200);
    }); stageReveal(false);
  } else if (t.step === 1 && Date.now() - storyLast > 60000 && storyGate('tetLady' + t.id)) {
    t.step = 1.5; const face = `<img class="paper-img" src="${ITEM_IMG.landlady_tet}" alt="" style="max-height:9em">`;
    showPaper(face + staged(typeof tetYear2 === 'function' && tetYear2() ? HOANG.lady : TET.lady, `<img class="paper-img" src="${ITEM_IMG.tet_tray}" alt="" style="max-height:4.5em"><small>— Bà chủ nhà tầng dưới —</small>`), () => {
      t.step = 2; save(); applyTet(); toast('Khay bánh chưng, mứt gừng đặt trên bàn rồi 🧧', 3200);
    }); stageReveal(false);
  } else if (t.step >= 2 && typeof tetSon === 'function') { tetSon(t); tetFinal2(t); }   // year 2: Hoàng comes home (lane.js)
}
function tapMai() {
  const t = S.tet, m = t && t.mai; if (!m) return;
  bump($('#p-mai'), 'wig');
  if (m.bloom) { toast(TET.mai, 5200); SFX.chime(0.3); return; }
  if (m.w < 2) {
    m.w++; SFX.water(); save();
    const b = MAI_BOX.bud; for (let i = 0; i < 10; i++) spawn({ kind: 'drop', x: rnd(b[0] + 8, b[0] + b[2] - 8), y: b[1] - rnd(0, 20), vx: 0, vy: rnd(120, 170), life: 1.2, t: -i * 0.05, floor: rnd(b[1] + 60, b[1] + 70) });
  }
  if (m.w >= 2 && m.sun) {
    m.bloom = 1; save(); SFX.sparkle(); applyTet(); bump($('#p-mai'), 'hop');
    setTimeout(() => toast('Mai nở vàng rực rồi! 🌼 Có thêm một phong lì xì vừa tới', 4200), 500); return;
  }
  toast(m.w < 2 ? `Tưới mai (${m.w}/2) 💧` : 'Mai đủ nước rồi, chờ một buổi nắng chiều để nụ bung cánh ☀️', 3200);
}
function openLixi() {
  const t = S.tet; if (!t || t.lixi >= lixiReady()) return;
  const [who, pic, wish, st, stName] = lixiList()[t.lixi];
  const face = ITEM_IMG[pic] ? `<img class="paper-img" src="${ITEM_IMG[pic]}" alt="" style="max-height:5.5em">` : '';
  const stamp = st ? `<img class="paper-img" src="${ITEM_IMG[st]}" alt="" style="max-height:4.5em"><small>Bên trong phong lì xì có con dấu “${stName}”</small>` : '';
  showPaper(face + `<p class="bub">${esc(wish)}</p>${stamp}<small>— ${esc(who)} —</small>`, () => {
    t.lixi++; if (st) S.keep[st] = 1; save(); applyTet();
    if (st) toast(`Nhận con dấu ${stName} 🧧 dùng được trong sổ tay và Góc thủ công`, 3800);
    if (t.lixi >= lixiList().length && !S.keep.k_couplet) setTimeout(giveCouplet, 2500);
  });
}
function giveCouplet() {
  showPaper(`<img class="paper-img" src="${ITEM_IMG.tet_couplet}" alt="" style="max-height:8em"><p class="bub">Đủ lời chúc của cả con hẻm rồi! Bà treo giúp cháu đôi câu đối “Mừng Xuân – Như Ý” bên khung cửa nhé.</p>${ITEM_IMG.son_frame ? `<img class="paper-img" src="${ITEM_IMG.son_frame}" alt="Ảnh con trai bà bên chiếc điện thoại bàn" style="max-height:5.5em">` : ''}<p class="bub">Sáng mùng Một thằng con bà gọi về rồi cháu ạ. Bà kể cho nó nghe về căn gác của nó giờ có hoa, có mèo, có người ở. Nó bảo năm sau nhất định về, còn muốn lên gác chào cháu đấy.</p><p>${TET.couplet}</p><small>— Bà chủ nhà tầng dưới —</small>`, () => {
    S.keep.k_couplet = 1; S.coupletOut = 1; S.tetDone = { id: S.tet ? S.tet.id : 'free', at: Date.now() }; save(); applyTet(); toast('Đôi câu đối đỏ đã treo hai bên khung cửa 🧧', 3600);
  });
}
// far fireworks over the alley on Tết nights (drawn on the sky canvas, see stepSky)
const FW = [];
function stepFireworks(ctx, dt, level) {
  if (level > 0.3 && !reduceMotion && Math.random() < dt / 7) {
    const x = rnd(300, 470), y = rnd(175, 255), col = ['255,214,110', '255,140,120', '255,190,220', '255,240,200'][Math.floor(Math.random() * 4)];
    for (let i = 0; i < 26; i++) { const a = i / 26 * 6.283, v = rnd(14, 26); FW.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, t: 0, life: rnd(1.3, 1.9), col }); }
    if (AC && !S.muted) setTimeout(() => noiseBurst(AC.currentTime, 0.5, 260, 120, 1.2, 0.03, ambBus || master, 'brown'), 700);
  }
  for (let i = FW.length - 1; i >= 0; i--) {
    const p = FW[i]; p.t += dt; if (p.t > p.life) { FW.splice(i, 1); continue; }
    p.vy += 9 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
    ctx.fillStyle = `rgba(${p.col},${(1 - p.t / p.life) * level * 0.85})`; ctx.beginPath(); ctx.arc(p.x, p.y, 1.3, 0, 7); ctx.fill();
  }
}
setInterval(applyTet, 2000);
applyTet();
