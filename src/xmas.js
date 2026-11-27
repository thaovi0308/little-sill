// ================================================================ Giáng Sinh trong hẻm (Vi duyệt 27/11, work/vi_scripts_xmas_books_draft.html)
// 18-26/12 every year the alley strings its lights; after one finished route the "Không Khí Giáng Sinh" switch (sound panel)
// brings it any day. ?xmas forces it for testing. Tết wins if both are on.
// Flow: the landlady brings a little pot pine -> one ornament a day from the neighbours (bell, star, candy cane + wool hat,
// red bow, string lights) -> the lit tree -> on the night of the 24th a drizzle, far church bells and the landlady's note.
// Art: Vi 27/11 (src/vi_1127/xmas_items.jpg, work/cut_xmas.py; scenes work/build_xmas_scenes.py).
function xmasSeason() {
  if (/[?&]xmas\b/.test(location.search)) return 'test';
  const d = new Date(); return d.getMonth() === 11 && d.getDate() >= 18 && d.getDate() <= 26 ? String(d.getFullYear()) : null;
}
function xmasOn() { return !(typeof tetOn === 'function' && tetOn()) && (!!xmasSeason() || (!!S.xmasForce && routeDone())); }
function xmasState() {
  const id = xmasSeason() || 'free';
  if (!S.xmas || S.xmas.id !== id) S.xmas = { id, start: 0, got: 0, hat: null, eve: 0 };
  return S.xmas;
}
const XMAS = {
  lady: ['Cháu ơi, bà vừa mua được chậu thông nhỏ ở chợ hoa, để dưới nhà thì tối quá, cho cháu đặt trên bệ cửa nhé.',
    'Năm nào con hẻm mình cũng treo đèn từ giữa tháng Chạp Tây, nhà nào góp một món treo cây thì nhà ấy may mắn cả năm đấy.'],
  eve: 'Đêm nay mưa phùn lất phất. Ở cuối hẻm, chuông nhà thờ ngân lên từng tiếng xa. Cây thông nhỏ trên bệ cửa sáng lên đủ năm món quà của năm người hàng xóm. Bánh Quy ngồi ngắm, chiếc mũ len lệch sang một bên.',
  eveLady: 'Cả hẻm ai cũng thấy cây thông nhà cháu sáng từ dưới đường đấy. Giáng Sinh vui vẻ nhé, cháu của bà.',
  tree: ['Cây thông nhỏ toả mùi nhựa thông thơm mát.', 'Chạm nhẹ vào cành thông, mấy chiếc lá kim khẽ rung rinh.'],
  treeLit: ['Dây đèn nhấp nháy như những đốm sao nhỏ đậu trên cành thông ✨', 'Năm món quà của năm người hàng xóm, treo chung một cây.'],
};
// [who, picture, ornament, note, how it came, keepsake given with it]
const XGIFTS = [
  ['Bác sửa đồng hồ', 'old_window', 'orn_bell', 'Bác tháo được chiếc chuông nhỏ từ một chiếc đồng hồ báo thức cũ. Treo lên cây, mỗi lần gió lùa qua nó lại ngân lên một tiếng, như nhắc mình nghỉ tay một chút.', 'Chú chim sẻ đưa thư vừa thả xuống bệ cửa một gói nhỏ', 'st_xmas_bell'],
  ['Cậu họa sĩ tầng trên', 'painting', 'orn_star', 'Ngôi sao này mình cắt từ bìa cứng rồi tự tay tô màu vàng ấm đấy. Đỉnh cây là chỗ của nó nhé!', 'Một chiếc máy bay giấy chở theo món quà nhỏ', null],
  ['Bé Na & Bánh Quy', 'na_cat', 'orn_cane', 'Em cắt cây kẹo gậy bằng giấy học thủ công, sọc hơi méo một chút. Còn cái mũ len là mẹ em đan cho Bánh Quy, bạn đội cho nó giùm em nha!', 'Sợi ruy băng mèo buộc một gói quà nhỏ', 'hat'],
  ['Chị bán hoa đầu hẻm', 'florist', 'orn_bow', 'Chị xin một đoạn ruy băng đỏ ở sạp gói hoa, thắt thành chiếc nơ cho cây thông của em. Treo lên nhìn cây có hồn hẳn em ạ.', 'Túi vải ròng rọc thả xuống một món quà', null],
  ['Minh ở phương xa', 'pc_station', 'lights', 'Dây đèn này mình mua ở chợ phiên một thị trấn miền núi, cất trong ba lô mãi. Giờ thì nó có chỗ để sáng rồi.', 'Hòm thư cầu thang có một gói nhỏ gửi bạn', null],
];
const XLADY_LIGHTS = ['Bà chủ nhà tầng dưới', 'landlady', 'lights', 'Bà tìm thấy dây đèn nhỏ cất trong tủ từ mấy năm trước. Cháu quấn lên cây cho ấm nhé, đủ năm món là cây sáng rồi đấy.', 'Bà chủ nhà gõ cửa, đưa lên một cuộn dây đèn', null];
function xgift(i) { return i === 4 && (S.story.minh || 0) < 1 ? XLADY_LIGHTS : XGIFTS[i]; }
function xmasReady() {   // how many ornaments may have come by now: one a day, all of them by the 24th
  const x = S.xmas; if (!x || !x.start) return 0;
  const days = Math.floor((Date.now() - x.start) / (24 * HOUR));
  let late = 0; if (/^\d+$/.test(x.id)) { const d = new Date(); late = 5 - (24 - d.getDate()); }
  return Math.min(5, Math.max(days, late) + (x.id === 'test' ? 9 : 0));
}
// ---- room pieces (made here, the tree stands at the right corner of the sill where the mai stands at Tết)
const TREE = { plain: [610, 680, 106, 226], lit: [608, 672, 108, 234] };
// ornaments on the plain tree, in the drawing's pixels (282 x 571): [x centre, y centre, width]
const ORN_AT = { orn_ball: [86, 318, 40], orn_bell: [100, 232, 46], orn_star: [141, -6, 74], orn_cane: [196, 272, 34], orn_bow: [146, 150, 62] };
const mk = (tag, id, cls) => { const e = document.createElement(tag); if (id) e.id = id; e.className = cls; if (tag === 'img') e.alt = ''; e.style.display = 'none'; return e; };
const xTree = mk('img', 'p-xtree', 'prop'), xGift = mk('img', 'p-xgift', 'prop'), xHat = mk('img', 'p-xhat', 'prop');
const xOrn = {}; for (const k in ORN_AT) { xOrn[k] = mk('img', 'p-' + k, 'prop'); xOrn[k].src = ITEM_IMG[k]; }
xHat.src = ITEM_IMG.xmas_hat; xHat.style.transformOrigin = '50% 85%';
$('#p-tea2').after(xTree, ...Object.values(xOrn), xGift, xHat);
const xHit = { tree: mk('button', null, 'hit'), gift: mk('button', null, 'hit'), hat: mk('button', null, 'hit') };
xHit.tree.setAttribute('aria-label', 'Cây thông nhỏ'); xHit.gift.setAttribute('aria-label', 'Món quà treo cây'); xHit.hat.setAttribute('aria-label', 'Mũ len đỏ');
hitsEl.append(xHit.tree, xHit.gift, xHit.hat);
place(xHit.tree, 646, 680, 68, 226);
const GIFT_BOX = [596, 884, 40, 46]; place(xHit.gift, 588, 872, 58, 64);
// the hat on Bánh Quy: per pose [x, y, w, rotation] in scene units (only the poses where the head is easy to find)
const HAT_ON = { sleep: [496, 798, 82, 22], sit: [471, 712, 84, -6], wet: null };
const HAT_OFF = [262, 858, 62, -14];   // on the sill by the plate
function placeHat() {
  const x = S.xmas, on = xmasOn() && x && x.hat;
  let spot = null;
  if (on === 'on') spot = HAT_ON[catPose] || null; else if (on === 'off') spot = HAT_OFF;
  if (on === 'on' && !spot) spot = HAT_OFF;   // a pose without a head spot: the hat waits on the sill
  xHat.style.display = spot ? '' : 'none'; xHit.hat.style.display = spot ? '' : 'none';
  if (!spot) return;
  const [cx, cy, w, rot] = spot, h = w * 166 / 209;
  place(xHat, cx - w / 2, cy - h * 0.85, w, h); xHat.style.transform = `rotate(${rot}deg)`;
  place(xHit.hat, cx - w / 2 - 6, cy - h * 0.85 - 6, w + 12, h + 12);
}
const _setCatPose = setCatPose;
setCatPose = function (p) { _setCatPose(p); placeHat(); };
function placeTree() {
  const x = S.xmas, lit = x.got >= 5, b = TREE[lit ? 'lit' : 'plain'];
  xTree.src = ITEM_IMG[lit ? 'xmas_tree_lit' : 'xmas_tree']; place(xTree, ...b);
  const night = S.weather !== 'sunset';
  xTree.style.filter = lit && night ? 'drop-shadow(0 0 7px rgba(255,214,130,.75)) brightness(1.06)' : '';
  const k = b[3] / 571, have = xmasHave();
  for (const [n, [ox, oy, w]] of Object.entries(ORN_AT)) {
    const e = xOrn[n], show = !lit && have.has(n);
    e.style.display = show ? '' : 'none'; if (!show) continue;
    const im = { orn_ball: [68, 109], orn_bell: [71, 81], orn_star: [80, 102], orn_cane: [58, 108], orn_bow: [96, 76] }[n];
    const ww = w * k, hh = ww * im[1] / im[0];
    place(e, b[0] + ox * k - ww / 2, b[1] + oy * k - hh / 2, ww, hh);
  }
}
function xmasHave() {   // the landlady's tree comes with one red bauble; the rest are the neighbours' gifts opened so far
  const s = new Set(['orn_ball']); for (let i = 0; i < (S.xmas.got || 0); i++) s.add(xgift(i)[2]); return s;
}
let xmasWas = null;
function applyXmas() {
  const on = xmasOn(); window.xmasView = on; S.xmasOn = on;
  const sc = document.querySelector('.scene.on');
  if (xmasWas !== on || (sc && (sc.dataset.tet === 'x') !== on && !(typeof tetOn === 'function' && tetOn()))) { xmasWas = on; applyLook(); applyTea(); }
  const x = on ? xmasState() : null, tree = !!(x && x.start);
  xTree.style.display = tree ? '' : 'none'; xHit.tree.style.display = tree ? '' : 'none';
  if (!tree) Object.values(xOrn).forEach(e => { e.style.display = 'none'; });
  else placeTree();
  if (tree && S.bouquetOut) { $('#p-bouquet').style.opacity = 0; HITS.bouquet.el.style.display = 'none'; }   // the tree stands where the dried bouquet sits
  else if (typeof applyBouquet === 'function') applyBouquet();
  const waiting = tree && x.got < xmasReady();
  xGift.style.display = waiting ? '' : 'none'; xHit.gift.style.display = waiting ? '' : 'none';
  if (waiting) { const n = xgift(x.got)[2]; xGift.src = ITEM_IMG[n === 'lights' ? 'orn_lights' : n]; place(xGift, ...GIFT_BOX); xGift.classList.add('xgift'); }
  placeHat();
  if (!x || !started || !S.welcomed) return;
  if (!x.start && storyGate('xmasTree' + x.id)) {
    const face = `<img class="paper-img" src="${ITEM_IMG.landlady}" alt="" style="max-height:9em">`;
    showPaper(face + staged(XMAS.lady, `<img class="paper-img" src="${ITEM_IMG.xmas_tree}" alt="" style="max-height:6.5em"><small>— Bà chủ nhà tầng dưới —</small>`), () => {
      x.start = Date.now(); save(); applyXmas(); bump(xTree, 'hop'); SFX.sparkle();
      toast('Chậu thông nhỏ đã đứng ở góc bệ cửa 🎄 mỗi ngày sẽ có một món quà treo cây', 4200);
    }); stageReveal(false);
  } else if (x.got >= 5 && !x.eve && (S.weather !== 'sunset') && (!/^\d+$/.test(x.id) || new Date().getDate() >= 24) && storyGate('xmasEve' + x.id)) {
    x.eve = 1; save(); churchBells();
    const face = `<img class="paper-img" src="${ITEM_IMG.xmas_tree_lit}" alt="" style="max-height:7em">`;
    showPaper(face + staged([XMAS.eve, XMAS.eveLady], `<img class="paper-img" src="${ITEM_IMG.st_xmas_snow}" alt="" style="max-height:4em"><small>Kèm theo lời chúc của bà là con dấu “Bông Tuyết” và một tờ giấy xanh thông cho Góc thủ công</small><small>— Bà chủ nhà tầng dưới —</small>`), () => {
      S.keep.st_xmas_snow = 1; S.keep.k_xmas = 1; save();
      if (S.weather === 'night') setWeather('rain');
      toast('Nhận con dấu Bông Tuyết ❄️ và giấy bookmark xanh thông', 3800);
    }); stageReveal(false);
  }
}
function churchBells() {   // far, low, slow bells from the end of the alley
  if (!AC || S.muted) return;
  const pan = AC.createStereoPanner(); pan.pan.value = 0.35; pan.connect(master); pan.connect(reverb);
  [0, 1.6, 3.2, 4.8].forEach((d, i) => { const f = [392, 330, 392, 294][i], t = AC.currentTime + d;
    [[1, 0.07], [2.0, 0.03], [2.76, 0.02], [5.4, 0.008]].forEach(([r, a]) => tone(t, f * r, 4.5 / Math.sqrt(r), a, 'sine', pan, 0.004)); });
}
function openXGift() {
  const x = S.xmas; if (!x || x.got >= xmasReady()) return;
  const [who, pic, orn, note, how, extra] = xgift(x.got);
  SFX.paper();
  const face = ITEM_IMG[pic] ? `<img class="paper-img" src="${ITEM_IMG[pic]}" alt="" style="max-height:5.5em">` : '';
  const item = ITEM_IMG[orn === 'lights' ? 'orn_lights' : orn];
  const more = extra === 'hat' ? `<img class="paper-img" src="${ITEM_IMG.xmas_hat}" alt="" style="max-height:3.6em">` : extra ? `<img class="paper-img" src="${ITEM_IMG[extra]}" alt="" style="max-height:3.6em"><small>Kèm theo con dấu “Chuông Giáng Sinh”</small>` : '';
  showPaper(`<small>${esc(how)}</small>` + face + `<p class="bub">${esc(note)}</p><img class="paper-img" src="${item}" alt="" style="max-height:${orn === 'lights' ? 4.5 : 3.4}em">${more}<small>— ${esc(who)} —</small>`, () => {
    x.got++; if (extra === 'hat') x.hat = 'on'; else if (extra) S.keep[extra] = 1; save(); applyXmas();
    if (orn === 'lights') { bump(xTree, 'hop'); SFX.sparkle(); setTimeout(() => SFX.chime(0.5), 400); toast('Cây thông sáng đèn rồi! ✨ đủ năm món quà của năm người hàng xóm', 4400); }
    else { const e = xOrn[orn]; if (e) bump(e, 'hop'); SFX.chime(0.3); toast(extra === 'hat' ? 'Đã treo lên cây 🎄 Bánh Quy đội mũ len rồi, chạm vào mũ để cởi ra nhé' : 'Đã treo lên cây thông 🎄', 3200); }
  });
}
xHit.gift.addEventListener('click', e => { e.stopPropagation(); bump(xGift, 'hop'); openXGift(); });
xHit.tree.addEventListener('click', e => {
  e.stopPropagation(); bump(xTree, 'wig'); const lit = S.xmas && S.xmas.got >= 5, l = lit ? XMAS.treeLit : XMAS.tree;
  if (lit) SFX.chime(0.35); else playS(['sfx_page'], 0.25);
  if (S.xmas && xmasHave().has('orn_bell') && !lit) setTimeout(() => SFX.chime(0.15), 200);   // the little bell rings when the branches move
  toast(l[Math.floor(Math.random() * l.length)], 3200);
});
xHit.hat.addEventListener('click', e => {
  e.stopPropagation(); const x = S.xmas; if (!x || !x.hat) return;
  x.hat = x.hat === 'on' ? 'off' : 'on'; save(); placeHat(); bump(xHat, 'hop'); SFX.purr();
  if (x.hat === 'on') { catSit(5); hearts(); playS(['sfx_meow', 'sfx_meow2'], 0.25); toast('Bánh Quy đội mũ len đỏ, trông ấm áp hẳn 🎅', 2600); }
  else { SFX.click(); toast('Cất mũ len lên bệ cửa, chạm lần nữa để đội lại cho Bánh Quy', 2600); }
});
// postcard: a little garland in the corners during the season (see makePostcard)
async function xmasPostcard(ctx, W, PH) {
  const load = src => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; });
  const [bow, ball, bell, star] = await Promise.all(['orn_bow', 'orn_ball', 'orn_bell', 'orn_star'].map(k => load(ITEM_IMG[k])));
  ctx.save(); ctx.setLineDash([22, 14]); ctx.lineWidth = 8;
  ctx.strokeStyle = '#5d7b5f'; ctx.strokeRect(22, 22, W - 44, PH - 4); ctx.lineDashOffset = 18; ctx.strokeStyle = '#b9473f'; ctx.strokeRect(22, 22, W - 44, PH - 4); ctx.restore();
  const put = (im, x, y, w, r) => { if (!im) return; const h = w * im.height / im.width; ctx.save(); ctx.translate(x, y); ctx.rotate(r); ctx.drawImage(im, -w / 2, -h / 2, w, h); ctx.restore(); };
  put(bow, 70, 62, 120, -0.15); put(star, W - 72, 70, 96, 0.12); put(bell, 74, PH - 22, 76, 0.1); put(ball, W - 70, PH - 40, 62, -0.05);
}
setInterval(applyXmas, 2000);
applyXmas();
