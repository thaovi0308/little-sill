// ================================================================ Trang trí (Vi 27/11) + Ghé bệ cửa bạn bè (mã bệ cửa)
// Decoration packs are free for now; once the game is an app they become paid packs. Slots: wind chime (CHIMES), curtains,
// a garland along the top of the window, and an accessory for Bánh Quy. Art arrives from Vi pack by pack: each new piece is
// one entry in DECOR below (plus its height in work/build_html.py ITEMS). A slot with no entries is not shown.
const DECOR = {
  curtain: { label: '🪟 Rèm cửa', items: {} },    // key: { name, l: src, r: src, boxL: [x,y,w,h], boxR: [x,y,w,h] }
  garland: { label: '✨ Dây treo', items: {} },    // key: { name, src, srcNight?: src, box: [x,y,w,h] }
  cat: { label: '🐈 Phụ kiện cho Bánh Quy', items: {} },   // key: { name, src (icon), sleep?: {src, box}, sit?: {src, box} } -- a pose without a drawing stays as is
};
// pack 1 (Vi 27/11, work/cut_decor1.py)
const CUR = (name, k, boxL, boxR) => ({ name, l: ITEM_IMG['cu_' + k + '_l'], r: ITEM_IMG['cu_' + k + '_r'], boxL, boxR });
const CU_L = [38, 112, 214, 640], CU_R = [462, 112, 214, 640];
Object.assign(DECOR.curtain.items, { linen: CUR('Rèm vải lanh', 'linen', CU_L, CU_R), lace: CUR('Rèm ren trắng', 'lace', CU_L, CU_R), floral: CUR('Rèm hoa nhí', 'floral', CU_L, CU_R) });
Object.assign(DECOR.garland.items, {
  bulbs: { name: 'Dây bóng đèn', src: ITEM_IMG.ga_bulbs, srcNight: ITEM_IMG.ga_bulbs_on, box: [186, 150, 396, 124] },
  bunting: { name: 'Dây cờ vải', src: ITEM_IMG.ga_bunting, box: [176, 150, 410, 124] },
  cranes: { name: 'Dây hạc giấy', src: ITEM_IMG.ga_cranes, box: [200, 150, 380, 191] },
});
Object.assign(CHIMES, {
  bell: { name: 'Chuông gió sứ xanh', src: ITEM_IMG.chime_bell, box: [131, 140, 98, 330] },
  star: { name: 'Chuông gió sao biển', src: ITEM_IMG.chime_star, box: [114, 140, 132, 330] },
  lantern: { name: 'Chuông gió lồng đèn', src: ITEM_IMG.chime_lantern, box: [112, 140, 135, 330] },
});
// Bánh Quy's accessories (Vi 27/11, work/cut_cat_acc.py): drawn at the same scale as cat_sit, feet on the sill (y 898)
const catAt = (src, w, h, cx, flip = false) => ({ src: ITEM_IMG[src], box: [cx - w / 2, 898 - h, w, h], flip });   // Vi drew the sleepers facing left: flip to face the room like cat_sleep
Object.assign(DECOR.cat.items, {
  bow: { name: 'Nơ đỏ', src: ITEM_IMG.acc_bow, sleep: catAt('cat_sleep_bow', 234, 135, 460, true), sit: catAt('cat_sit_bow', 170, 239, 463) },
  scarf: { name: 'Khăn len caro', src: ITEM_IMG.acc_scarf, sleep: catAt('cat_sleep_scarf', 225, 134, 460, true), sit: catAt('cat_sit_scarf', 150, 221, 463) },
  bell: { name: 'Vòng cổ chuông', src: ITEM_IMG.acc_bell, sleep: catAt('cat_sleep_bell', 214, 150, 460, true), sit: catAt('cat_sit_bell', 148, 210, 463) },
});
const CAT_ORIG = { sleep: CAT0.sleep, sit: CAT0.sit };   // CAT0 (xmas.js) is what Bánh Quy wears when the Christmas hat is off
function applyCatAcc() {
  const a = DECOR.cat.items[S.decor.cat] || {};
  CAT0.sleep = a.sleep || CAT_ORIG.sleep; CAT0.sit = a.sit || CAT_ORIG.sit;
  if (!catHatNow) { CAT.sleep = CAT0.sleep; CAT.sit = CAT0.sit; }
  const p = catPose; catPose = null; setCatPose(p);
}
S.decor = S.decor || {};
if (['bell', 'star', 'lantern'].includes(S.chimeType)) applyChime();
const decoLayer = document.createElement('div'); decoLayer.id = 'decor';
$('#p-chime').before(decoLayer);   // behind every prop on the sill, in front of the window
function applyDecor() {
  decoLayer.innerHTML = '';
  const add = (src, box, lit) => { if (!src) return; const im = document.createElement('img'); im.className = 'prop'; im.alt = ''; im.src = src; if (lit) im.dataset.lit = 1; place(im, ...box); decoLayer.append(im); };
  const cu = DECOR.curtain.items[S.decor.curtain]; if (cu) { add(cu.l, cu.boxL); add(cu.r, cu.boxR); }
  const ga = DECOR.garland.items[S.decor.garland]; if (ga) { const on = S.weather !== 'sunset' && ga.srcNight; add(on || ga.src, ga.box, on); }
  const dim = { night: 'brightness(.84) saturate(.85)', rain: 'brightness(.93) saturate(.9)' }[S.weather] || '';
  decoLayer.querySelectorAll('img:not([data-lit])').forEach(im => im.style.filter = dim);   // lit bulbs keep their glow
}
const _setWeatherDeco = setWeather;
setWeather = function () { const r = _setWeatherDeco.apply(this, arguments); applyDecor(); return r; };

const dst = document.createElement('style');
dst.textContent = `#decobtn { position: absolute; left: 3.2%; top: calc(2.6% + 7.6%); width: 11%; aspect-ratio: 126 / 97; border-radius: 30%; z-index: 5; cursor: pointer;
    border: 1.5px solid var(--paper-line); background: var(--paper); box-shadow: 0 2px 6px rgba(60,35,20,.25); font-size: clamp(13px, calc(2.3 * var(--vh, 1vh)), 20px); padding: 0; }
  .deco-row { display: flex; flex-wrap: wrap; gap: .45em; margin: .2em 0 .5em; }
  .deco-pick { border: 0; background: rgba(255,255,255,.55); border-radius: 12px; padding: .35em .5em; cursor: pointer; font: inherit; font-size: .78em; color: var(--ink); min-width: 4.4em; }
  .deco-pick.on { box-shadow: 0 0 0 2px #d9a55a; }
  .deco-pick img { height: 3.6em; width: auto; display: block; margin: 0 auto .2em; }
  .fv-in { width: 100%; box-sizing: border-box; border-radius: 10px; border: 1.5px solid var(--paper-line); padding: .45em .6em; font: inherit; font-size: .85em; background: #fffdf7; color: var(--ink); margin: .15em 0 .4em; }
  .fv-msg { font-family: "Patrick Hand", cursive; font-size: 1.15em; line-height: 1.35; background: #fffaf0; border-radius: 10px; padding: .6em .8em; margin: .5em 0; box-shadow: inset 0 0 0 1px var(--paper-line); }
  .fv-list button { display: block; width: 100%; }`;
document.head.append(dst);
const decoBtn = document.createElement('button'); decoBtn.id = 'decobtn'; decoBtn.setAttribute('aria-label', 'Trang trí'); decoBtn.innerHTML = '<span>🎨</span>'; decoBtn.style.display = 'none';
$('#todaybtn').after(decoBtn);
function applyDecoBtn() { decoBtn.style.display = S.welcomed ? '' : 'none'; }

function openDecor() {
  const chimes = Object.entries(CHIMES).filter(([, c]) => !c.need || S.keep[c.need]);
  const sect = (slot, title, entries, cur, img) => `<h4>${title}</h4><div class="deco-row">` +
    (slot === 'chime' ? '' : `<button class="deco-pick${!cur ? ' on' : ''}" data-slot="${slot}" data-k="">Không</button>`) +
    entries.map(([k, it]) => `<button class="deco-pick${cur === k ? ' on' : ''}" data-slot="${slot}" data-k="${k}" aria-label="${esc(it.name)}"><img src="${img(it)}" alt="">${esc(it.name)}</button>`).join('') + '</div>';
  let html = `<h3>Trang trí</h3><small style="margin:0 0 .6em">Đổi đồ trang trí cho khung cửa sổ, đổi lúc nào cũng được 🌿</small>`;
  html += sect('chime', '🎐 Chuông gió', chimes, S.chimeType, c => c.src);
  for (const slot of ['curtain', 'garland', 'cat']) {
    const items = Object.entries(DECOR[slot].items);
    if (items.length) html += sect(slot, DECOR[slot].label, items, S.decor[slot], it => it.l || it.src);
  }
  html += `<button class="reply" id="fv-open" style="text-align:center">🪟 Ghé bệ cửa bạn bè</button><small>Chạm ra ngoài để đóng</small>`;
  openPanel(html);
  document.querySelectorAll('#note .deco-pick').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation(); const slot = b.dataset.slot, k = b.dataset.k;
    if (slot === 'chime') { S.chimeType = k; save(); applyChime(); pushChime(150); if (typeof placeThread === 'function' && S.qx) placeThread(); }
    else { S.decor[slot] = k || null; save(); applyDecor(); if (slot === 'cat') { applyCatAcc(); if (k) { SFX.purr(); hearts(); } } else SFX.paper(); }
    openDecor();
  }));
  $('#fv-open').addEventListener('click', e => { e.stopPropagation(); openFriends(); });
  $('#note').addEventListener('click', e => e.stopPropagation(), { once: true });
  SFX.paper();
}
decoBtn.addEventListener('click', e => { e.stopPropagation(); SFX.click(); openDecor(); });

// ---------------------------------------------------------------- mã bệ cửa: the window, its decorations, the plants and a note
// A friend's window travels as a short text code (gzip + base64url), or inside a link ?ghe=<code>. No server, no account.
const FV_PREFIX = 'BCN1.';
const b64u = buf => { let s = ''; for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000)); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
const unb64u = s => { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; const b = atob(s), u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; };
function myWindow() {
  const pk = g => g && g.type && PLANT_IMG[g.type + g.stage] ? g.type + g.stage : null;
  return { v: 1, n: (S.fvName || '').slice(0, 24), m: (S.fvMsg || '').slice(0, 160), w: S.weather, c: S.chimeType, cu: S.decor.curtain || null, g: S.decor.garland || null, k: S.decor.cat || null,
    p: [pk(S.garden), S.garden2 === undefined ? null : pk(S.garden2) || 'empty0'], d: Object.keys(S.daysPlayed || {}).length };
}
async function windowCode() {
  const bytes = new TextEncoder().encode(JSON.stringify(myWindow()));
  try { return FV_PREFIX + b64u(new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer())); }
  catch (e) { return 'BCN0.' + b64u(bytes); }
}
async function readWindow(code) {
  code = String(code).trim(); const m = code.match(/[?&]ghe=([\w.-]+)/); if (m) code = m[1];
  code = code.replace(/\s+/g, ''); let bytes;
  if (code.startsWith('BCN0.')) bytes = unb64u(code.slice(5));
  else if (code.startsWith(FV_PREFIX)) bytes = new Uint8Array(await new Response(new Blob([unb64u(code.slice(FV_PREFIX.length))]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
  else throw new Error('code');
  const d = JSON.parse(new TextDecoder().decode(bytes));
  if (!d || d.v !== 1) throw new Error('code');
  const str = (x, n) => typeof x === 'string' ? x.slice(0, n) : '';
  return { n: str(d.n, 24), m: str(d.m, 160), w: ['sunset', 'rain', 'night'].includes(d.w) ? d.w : 'sunset', c: CHIMES[d.c] ? d.c : 'glass',
    cu: DECOR.curtain.items[d.cu] ? d.cu : null, g: DECOR.garland.items[d.g] ? d.g : null, k: DECOR.cat.items[d.k] ? d.k : null,
    p: Array.isArray(d.p) ? d.p.slice(0, 2).map(k => typeof k === 'string' && PLANT_IMG[k] ? k : null) : [null, null], d: +d.d || 0 };
}
const loadImg = src => new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = src; });
async function windowCard(f) {
  const K = 1.5, c = document.createElement('canvas'); c.width = SW * K; c.height = SH * K; const ctx = c.getContext('2d'); ctx.scale(K, K);
  const draw = async (src, box, flip) => { const im = await loadImg(src); if (!im) return; ctx.save(); if (flip) { ctx.translate(box[0] * 2 + box[2], 0); ctx.scale(-1, 1); } ctx.drawImage(im, box[0], box[1], box[2], box[3]); ctx.restore(); };
  const scene = document.querySelector(`.scene[data-w="${f.w}"][data-tet="${f.t || '0'}"]`); if (scene) await draw(scene.src, [0, 0, SW, SH]);
  const cu = DECOR.curtain.items[f.cu]; if (cu) { await draw(cu.l, cu.boxL); await draw(cu.r, cu.boxR); }
  const ga = DECOR.garland.items[f.g]; if (ga) await draw(f.w === 'night' && ga.srcNight ? ga.srcNight : ga.src, ga.box);
  const ch = CHIMES[f.c]; await draw(ch.src, ch.box);
  for (const i of [0, 1]) {
    const k = f.p[i]; if (!k) continue; const P = PLANT_IMG[k]; let box = P.box;
    if (i) { const [cx, by, s] = POT2; box = [cx + (box[0] - 180) * s, by - box[3] * s, box[2] * s, box[3] * s]; }
    await draw(P.src, box);
  }
  const cs = (DECOR.cat.items[f.k] || {}).sleep || CAT_ORIG.sleep; await draw(cs.src, cs.box, cs.flip);
  if (f.w === 'night') { ctx.fillStyle = 'rgba(20,24,60,.12)'; ctx.fillRect(0, 0, SW, SH); }
  if (f.raw) return c;   // the album crops the whole scene itself
  // crop the window and the sill (the note is shown under the picture as text)
  const W = 1080, PH = 1060, H = PH + 40, out = document.createElement('canvas'); out.width = W; out.height = H; const o = out.getContext('2d');
  o.fillStyle = '#FDF8EE'; o.fillRect(0, 0, W, H);
  const sy = 120 * K, sh = ((PH - 40) / (W - 80)) * c.width;
  o.drawImage(c, 0, sy, c.width, sh, 40, 40, W - 80, PH - 40);
  o.strokeStyle = '#D4C5B0'; o.lineWidth = 3; o.strokeRect(40, 40, W - 80, PH - 40);
  return out;
}
function friendsList() { S.friends = Array.isArray(S.friends) ? S.friends : []; return S.friends; }
async function visitFriend(code, fromLink) {
  let f; try { f = await readWindow(code); } catch (e) { toast('Mã bệ cửa này không đọc được, bạn kiểm tra lại giúp nhé', 3200); return; }
  const list = friendsList(), key = code.replace(/^.*[?&]ghe=/, '').replace(/\s+/g, '');
  const old = list.findIndex(x => x.code === key || (f.n && x.n === f.n)); if (old >= 0) list.splice(old, 1);
  list.unshift({ n: f.n || 'Một người bạn', code: key, at: Date.now() }); list.length = Math.min(list.length, 12); save();
  toast('Đang ghé bệ cửa của bạn… 🚪', 1500); footsteps && footsteps();
  let url = ''; try { const cv = await windowCard(f); url = URL.createObjectURL(await new Promise(r => cv.toBlob(r, 'image/jpeg', 0.88))); } catch (e) {}
  openPanel(`<h3>${f.n ? `Bệ cửa của ${esc(f.n)}` : 'Bệ cửa của một người bạn'}</h3>
    ${url ? `<img src="${url}" alt="" style="width:100%;border-radius:10px;box-shadow:0 4px 12px rgba(60,35,20,.25)">` : ''}
    ${f.m ? `<div class="fv-msg">${esc(f.m)}</div>` : ''}
    ${f.d ? `<small>Bạn ấy đã ngồi bên khung cửa ${f.d} ngày</small>` : ''}
    <button class="reply" id="fv-back" style="text-align:center">🪟 Gửi lại mã bệ cửa của mình</button><small>Chạm ra ngoài để về căn gác</small>`);
  $('#fv-back').addEventListener('click', e => { e.stopPropagation(); openFriends(); });
  $('#note').addEventListener('click', e => e.stopPropagation(), { once: true });
  SFX.chime(0.35);
}
function openFriends() {
  const list = friendsList();
  openPanel(`<h3>Ghé bệ cửa bạn bè</h3><small style="margin:0 0 .6em">Mã bệ cửa chứa khung cửa sổ, chuông gió, cây trên bệ cửa và một lời nhắn của bạn. Gửi cho bạn bè, họ dán vào đây là ghé thăm được.</small>
    <h4>Bệ cửa của bạn</h4>
    <input class="fv-in" id="fv-name" maxlength="24" placeholder="Tên của bạn (không bắt buộc)" value="${esc(S.fvName || '')}">
    <textarea class="fv-in" id="fv-msg" maxlength="160" rows="3" placeholder="Một lời nhắn cho người ghé thăm…">${esc(S.fvMsg || '')}</textarea>
    <button class="reply" id="fv-link" style="text-align:center">🔗 Chép đường link ghé thăm</button>
    <button class="reply" id="fv-code" style="text-align:center">📋 Chép mã bệ cửa</button>
    <h4>Ghé thăm</h4>
    <textarea class="fv-in" id="fv-in" rows="2" placeholder="Dán mã bệ cửa hoặc đường link của bạn bè…"></textarea>
    <button class="reply" id="fv-go" style="text-align:center">🚪 Ghé thăm</button>
    ${list.length ? `<h4>Bạn đã ghé</h4><div class="fv-list">${list.map((x, i) => `<button class="reply" data-fv="${i}">🪟 ${esc(x.n)} <small style="display:inline">${new Date(x.at).toLocaleDateString('vi-VN')}</small></button>`).join('')}</div>` : ''}
    <small>Chạm ra ngoài để đóng</small>`);
  const keep = () => { S.fvName = $('#fv-name').value.trim().slice(0, 24); S.fvMsg = $('#fv-msg').value.trim().slice(0, 160); save(); };
  ['#fv-name', '#fv-msg', '#fv-in'].forEach(s => { $(s).addEventListener('click', e => e.stopPropagation()); });
  $('#fv-name').addEventListener('change', keep); $('#fv-msg').addEventListener('change', keep);
  const copy = async (text, ok) => {
    try { await navigator.clipboard.writeText(text); toast(ok, 3400); }
    catch (err) { $('#fv-in').value = text; $('#fv-in').select(); toast('Mã đã hiện ở ô Ghé thăm, bạn tự chép giúp nhé', 3200); }
  };
  $('#fv-link').addEventListener('click', async e => {
    e.stopPropagation(); keep(); const url = location.origin + location.pathname + '?ghe=' + (await windowCode());
    if (navigator.share) { try { await navigator.share({ title: 'Bên Khung Cửa Nhỏ', text: 'Ghé bệ cửa của mình nhé 🪟', url }); return; } catch (err) { if (err && err.name === 'AbortError') return; } }
    copy(url, 'Đã chép đường link. Gửi cho bạn bè để họ ghé bệ cửa của bạn nhé 🪟');
  });
  $('#fv-code').addEventListener('click', async e => { e.stopPropagation(); keep(); copy(await windowCode(), 'Đã chép mã bệ cửa 📋'); });
  $('#fv-go').addEventListener('click', e => { e.stopPropagation(); const v = $('#fv-in').value.trim(); if (!v) { toast('Dán mã bệ cửa của bạn bè trước nhé', 2400); return; } visitFriend(v); });
  document.querySelectorAll('#note [data-fv]').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); visitFriend(list[+b.dataset.fv].code); }));
  $('#note').addEventListener('click', e => e.stopPropagation(), { once: true });
  SFX.paper();
}
// opened from a link: wait until the player has opened the window (and met the landlady on a first visit)
const fvLink = (location.search.match(/[?&]ghe=([\w.-]+)/) || [])[1];
if (fvLink) {
  try { history.replaceState(null, '', location.pathname + location.search.replace(/[?&]ghe=[\w.-]+/, '').replace(/^&/, '?')); } catch (e) {}
  const t = setInterval(() => { if (started && S.welcomed && !$('#note-wrap').classList.contains('show')) { clearInterval(t); visitFriend(fvLink, true); } }, 1500);
}
applyDecor(); applyDecoBtn(); setInterval(applyDecoBtn, 3000);
if (S.decor.cat) applyCatAcc();
