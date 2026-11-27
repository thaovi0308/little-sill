// ================================================================ Album "Một năm bên khung cửa" (Vi 27/11: cover + inner page)
// From 25/12 to the end of January the year's album turns up (Bánh Quy drags it out from under the desk); afterwards it
// stays in the keepsake box. Every page is drawn on a canvas -- Vi's page with two photo slots, the photos tucked under
// her paper corners (assets/album_corners.png) -- so each page can be saved or shared as a picture. ?album to try.
const ALBUM_TEST = /[?&]album\b/.test(location.search);
ITEM_IMG.album_book = ITEM_IMG.album_cover2;
function albumSeason() { const d = new Date(), m = d.getMonth() + 1; return (m === 12 && d.getDate() >= 25) || m === 1; }
const albumYear = () => { const d = new Date(); return d.getMonth() === 0 ? d.getFullYear() - 1 : d.getFullYear(); };
const AP_W = 860, AP_H = 1336, SLOTS = [[158, 70, 592, 512], [158, 716, 592, 528]];
const INK = '#4A3525', INK2 = '#8a7360';
function wrapText(ctx, text, maxW) {
  const out = []; let line = '';
  for (const w of String(text).split(/\s+/)) { const t = line ? line + ' ' + w : w; if (ctx.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t; }
  if (line) out.push(line); return out;
}
function drawLines(ctx, text, cx, y, maxW, lh, maxLines, align = 'center') {
  let lines = wrapText(ctx, text, maxW);
  if (lines.length > maxLines) { lines = lines.slice(0, maxLines); lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S*$/, '') + '…'; }
  ctx.textAlign = align; lines.forEach((l, i) => ctx.fillText(l, cx, y + i * lh)); return lines.length;
}
function fitDraw(ctx, img, r, mode = 'cover', pad = 0) {
  const [x, y, w, h] = [r[0] + pad, r[1] + pad, r[2] - 2 * pad, r[3] - 2 * pad];
  const iw = img.width, ih = img.height, s = mode === 'cover' ? Math.max(w / iw, h / ih) : Math.min(w / iw, h / ih);
  const dw = iw * s, dh = ih * s;
  if (mode === 'cover') { ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh); ctx.restore(); }
  else ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}
async function windowPhoto(w, t, low) {   // the player's own window (decor, plants, cat) under a given weather / season scene
  const f = Object.assign(myWindow(), { w, t, raw: 1 });   // slot ratio 1.156: the full width of the scene, 618 units tall --
  const c = await windowCard(f), k = c.width / SW, y0 = low ? 290 : 130, h = SW / 1.156;   // the top (chime, garland, alley) or the sill (Bánh Quy)
  const out = document.createElement('canvas'); out.width = 1000; out.height = Math.round(1000 / 1.156);
  out.getContext('2d').drawImage(c, 0, y0 * k, SW * k, h * k, 0, 0, out.width, out.height); return out;
}
function albumData() {
  const Y = String(albumYear()), inY = k => String(k).startsWith(Y + '-');
  const days = Object.keys(S.daysPlayed || {}).filter(inY).length || Object.keys(S.daysPlayed || {}).length;
  const diary = Object.entries(S.diary || {}).filter(([k]) => inY(k)).map(([, v]) => v).filter(v => v && v.a && v.a.trim());
  const best = diary.slice().sort((a, b) => b.a.length - a.a.length).slice(0, 2);
  const routes = JOURNAL.map(L => ({ L, n: L.ch.filter(c => c.ok(S.story || {})).length })).filter(r => r.n > 0);
  const letters = routes.reduce((n, r) => n + r.n, 0);
  const flowers = Object.keys(BM_FLOWER).filter(k => S.keep[k] > 0 || (S.harvested && S.harvested[k])).map(k => BM_FLOWER[k]);
  const stamps = [...new Set(Object.entries(S.diary || {}).filter(([k]) => inY(k)).map(([, v]) => v && v.s).filter(s => s !== undefined && STAMPS[s]))];
  const seasons = [['1', S.tet && S.tet.step > 0, 'Tết đến bên khung cửa'], ['x', S.xmas && S.xmas.got > 0, 'Giáng Sinh bên khung cửa'],
    ['v', S.vl && S.vl.step > 0, 'Đêm rằm Vu Lan'], ['q', S.qx && S.qx.step > 0, 'Thất Tịch mưa ngâu']].filter(s => s[1]);
  return { Y, days, diary, best, routes, letters, flowers, stamps, seasons, plants: Object.keys(S.harvested || {}).length };
}
async function albumPages() {
  const A = albumData(), pages = [];
  const [cover, paper, corners] = await Promise.all([loadImg(ITEM_IMG.album_cover2), loadImg(ITEM_IMG.album_page), loadImg(ITEM_IMG.album_corners)]);
  const newPage = () => { const c = document.createElement('canvas'); c.width = AP_W; c.height = AP_H; const ctx = c.getContext('2d'); ctx.drawImage(paper, 0, 0, AP_W, AP_H); return [c, ctx]; };
  const caption = (ctx, i, text) => {   // the bottom caption shrinks to stay clear of Vi's paw print and vine (from x ~460)
    ctx.fillStyle = INK; let px = 32; ctx.font = `${px}px "Patrick Hand", cursive`;
    if (i) while (px > 23 && ctx.measureText(text).width > 290) ctx.font = `${--px}px "Patrick Hand", cursive`;
    drawLines(ctx, text, SLOTS[i][0] + 6, SLOTS[i][1] + SLOTS[i][3] + (i ? 44 : 52), i ? 292 : 590, 34, i ? 1 : 2, 'left');
  };
  const photoPage = async items => {   // items: [{ img, mode, text, bg }]
    const [c, ctx] = newPage();
    items.forEach((it, i) => {
      if (!it) return; const r = SLOTS[i];
      ctx.fillStyle = it.bg || '#fffaf0'; ctx.fillRect(r[0] + 10, r[1] + 10, r[2] - 20, r[3] - 20);
      if (it.img) fitDraw(ctx, it.img, r, it.mode || 'cover', it.mode === 'contain' ? 40 : 10);
      if (it.draw) it.draw(ctx, r);
      if (it.text) caption(ctx, i, it.text);
    });
    ctx.drawImage(corners, 0, 0, AP_W, AP_H); pages.push(c);
  };
  // 1 cover: title in Vi's cloud label
  { const c = document.createElement('canvas'); c.width = AP_W; c.height = Math.round(AP_W * cover.height / cover.width); const ctx = c.getContext('2d');
    ctx.fillStyle = '#FDF8EE'; ctx.fillRect(0, 0, c.width, c.height);   // JPEG has no alpha: paper behind the tie
    ctx.drawImage(cover, 0, 0, c.width, c.height); const k = c.width / cover.width, cx = 245 * k, cy = 215 * k;
    ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.font = '600 46px Lora, serif'; ctx.fillText('Một năm', cx, cy - 34); ctx.fillText('bên khung cửa', cx, cy + 22);
    ctx.font = '36px "Patrick Hand", cursive'; ctx.fillStyle = INK2; ctx.fillText(A.Y + (S.fvName ? ' · ' + S.fvName.slice(0, 18) : ''), cx, cy + 76); pages.push(c); }
  // 2 the window, a sunny evening and a quiet night
  await photoPage([{ img: await windowPhoto('sunset'), text: 'Khung cửa của mình, những buổi chiều nắng' }, { img: await windowPhoto('night', '0', 1), text: 'và những đêm yên bên bệ cửa' }]);
  // 3 festivals lived this year
  for (let i = 0; i < A.seasons.length; i += 2) {
    const two = A.seasons.slice(i, i + 2);
    await photoPage(await Promise.all(two.map(async ([t, , text]) => ({ img: await windowPhoto('night', t), text }))));
  }
  // 4 the neighbours whose letters came through the window
  for (let i = 0; i < A.routes.length; i += 2) {
    const two = A.routes.slice(i, i + 2);
    const items = await Promise.all(two.map(async ({ L, n }) => ({ img: await loadImg(ITEM_IMG[L.img]), mode: 'contain', text: `${L.who} · ${n === 5 ? 'trọn 5 chương' : n + '/5 chương'}` })));
    if (items.length === 1) items.push({ draw: (ctx, r) => { ctx.fillStyle = INK2; ctx.font = '38px "Patrick Hand", cursive'; drawLines(ctx, 'Còn những lá thư khác đang trên đường tới khung cửa…', r[0] + r[2] / 2, r[1] + r[3] / 2 - 20, r[2] - 120, 44, 3); } });
    await photoPage(items);
  }
  // 5 two pages of the notebook
  if (A.best.length) {
    const stampImgs = await Promise.all(A.best.map(b => STAMPS[b.s] ? loadImg(ITEM_IMG[STAMPS[b.s][2]]) : null));
    await photoPage(A.best.map((b, i) => ({ draw: (ctx, r) => {
      ctx.fillStyle = INK2; ctx.font = '600 26px Quicksand, sans-serif'; const n = drawLines(ctx, b.q, r[0] + r[2] / 2, r[1] + 70, r[2] - 90, 32, 3);
      ctx.fillStyle = INK; ctx.font = '40px "Patrick Hand", cursive'; drawLines(ctx, '“' + b.a.trim() + '”', r[0] + r[2] / 2, r[1] + 90 + n * 32 + 30, r[2] - 90, 46, 6);
      if (stampImgs[i]) { ctx.globalAlpha = 0.85; ctx.drawImage(stampImgs[i], r[0] + r[2] - 130, r[1] + r[3] - 130, 96, 96 * stampImgs[i].height / stampImgs[i].width); ctx.globalAlpha = 1; }
    }, text: i ? '' : 'Vài dòng trong sổ tay năm nay' })));
  }
  // 6 pressed flowers + stamps
  if (A.flowers.length || A.stamps.length) {
    const fl = await Promise.all(A.flowers.map(f => loadImg(ITEM_IMG[f[1]]))), st = await Promise.all(A.stamps.map(s => loadImg(ITEM_IMG[STAMPS[s][2]])));
    const grid = (imgs, cols, names) => (ctx, r) => {
      const rows = Math.ceil(imgs.length / cols) || 1, cw = (r[2] - 60) / cols, ch = (r[3] - 60) / rows;
      imgs.forEach((im, i) => { if (!im) return; const x = r[0] + 30 + (i % cols) * cw, y = r[1] + 30 + Math.floor(i / cols) * ch;
        fitDraw(ctx, im, [x, y, cw, ch - (names ? 34 : 0)], 'contain', 12);
        if (names) { ctx.fillStyle = INK2; ctx.font = '24px Quicksand, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(names[i], x + cw / 2, y + ch - 8); } });
    };
    await photoPage([A.flowers.length ? { draw: grid(fl, Math.min(4, Math.max(2, Math.ceil(Math.sqrt(fl.length)))), A.flowers.map(f => f[0])), text: 'Hoa lá ép trong năm' } : null,
      A.stamps.length ? { draw: grid(st, Math.min(5, Math.max(3, Math.ceil(Math.sqrt(st.length * 1.4))))), text: 'Những con dấu đã đóng trong sổ tay' } : null]);
  }
  // 7 the year in numbers + Bánh Quy
  const cat = await loadImg(CAT.sleep.src);
  await photoPage([{ draw: (ctx, r) => {
    const rows = [[A.days, 'ngày bên khung cửa'], [A.diary.length, 'trang sổ tay'], [A.letters, 'lá thư của hàng xóm'], [A.plants, 'loài cây đã trồng']];
    rows.forEach(([n, t], i) => { const y = r[1] + 110 + i * 105; ctx.textAlign = 'right'; ctx.fillStyle = INK; ctx.font = '600 64px Lora, serif'; ctx.fillText(String(n), r[0] + 220, y);
      ctx.textAlign = 'left'; ctx.font = '38px "Patrick Hand", cursive'; ctx.fillText(t, r[0] + 250, y - 6); });
  }, text: `Năm ${A.Y} của mình` }, { img: cat, mode: 'contain', text: 'Cảm ơn bạn đã ở đây. Hẹn năm sau nhé ♡' }]);
  return pages;
}

const album = document.createElement('div'); album.id = 'album'; album.setAttribute('role', 'dialog'); album.setAttribute('aria-label', 'Album Một năm bên khung cửa');
$('#stage').append(album);
const ast = document.createElement('style');
ast.textContent = `#album { position: absolute; inset: 0; z-index: 12; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .6em;
    background: rgba(30,24,20,.72); opacity: 0; pointer-events: none; transition: opacity .4s; perspective: 1400px; }
  #album.show { opacity: 1; pointer-events: auto; }
  #album .al-page { max-width: 88%; max-height: 72%; width: auto; height: auto; border-radius: 6px; box-shadow: 0 10px 28px rgba(0,0,0,.45); transform-origin: 0 50%; background: #fdf8ee; }
  #album .al-bar { display: flex; gap: .5em; align-items: center; color: #fdf8ee; font: 600 .95em Quicksand, sans-serif; }
  #album button, #album a { border: 0; border-radius: 999px; padding: .45em .95em; background: #fdf8ee; color: #4A3525; font: 600 .85em Quicksand, sans-serif; cursor: pointer; text-decoration: none; }
  #album button:disabled { opacity: .35; }
  #album .al-wait { color: #fdf8ee; font: 1.1em "Patrick Hand", cursive; }`;
document.head.append(ast);
const _outsideOpenA = outsideOpen; outsideOpen = function () { return _outsideOpenA() || album.classList.contains('show'); };
let alPages = null, alI = 0, alUrls = [];
let alBusy = false;
async function openYearAlbum() {
  if (alBusy) return; alBusy = true; window.alOpens = (window.alOpens || 0) + 1;
  try { await openAlbumNow(); } finally { alBusy = false; }
}
async function openAlbumNow() {
  closeNote(); album.innerHTML = '<div class="al-wait">Đang mở album… 📔</div>'; album.classList.add('show'); SFX.paper();
  try { alPages = await albumPages(); } catch (e) { album.classList.remove('show'); toast('Album chưa mở được, thử lại sau nhé', 2600); return; }
  alUrls.forEach(u => URL.revokeObjectURL(u)); alUrls = []; for (const k in alFiles) delete alFiles[k];
  alI = 0; S.keep.album_book = 1; save(); alShow(0);
}
async function alBlob(i) { return new Promise(res => alPages[i].toBlob(res, 'image/jpeg', 0.9)); }
let alSeq = 0;
const alFiles = {};   // page -> { url, file }, made in the background so flipping stays instant
async function alFile(i) {
  if (alFiles[i]) return alFiles[i];
  let blob = null; try { blob = await new Promise(res => alPages[i].toBlob(res, 'image/jpeg', 0.9)); } catch (e) {}
  if (!blob) return null;
  const url = URL.createObjectURL(blob); alUrls.push(url);
  return alFiles[i] = { url, file: new File([blob], `mot-nam-ben-khung-cua-${albumYear()}-${i + 1}.jpg`, { type: 'image/jpeg' }) };
}
function alShow(dir) {
  const seq = ++alSeq, n = alPages.length, i = alI;
  const canShare = !!(navigator.canShare && window.File && navigator.canShare({ files: [new File([''], 'x.jpg', { type: 'image/jpeg' })] }));
  album.innerHTML = `<div class="al-bar"><button id="al-prev" aria-label="Trang trước" ${i ? '' : 'disabled'}>‹</button><span>${i + 1} / ${n}</span><button id="al-next" aria-label="Trang sau" ${i < n - 1 ? '' : 'disabled'}>›</button></div>
    <div class="al-bar">${canShare ? '<button id="al-share">📮 Gửi trang này</button>' : ''}<button id="al-dl">⬇️ Lưu trang</button><button id="al-x">Đóng</button></div>`;
  const pg = alPages[i]; pg.className = 'al-page'; pg.setAttribute('role', 'img'); pg.setAttribute('aria-label', `Trang ${i + 1}`);
  album.prepend(pg);
  if (dir) pg.animate([{ transform: `rotateY(${dir > 0 ? -70 : 70}deg)`, opacity: 0.3 }, { transform: 'rotateY(0)', opacity: 1 }], { duration: 450, easing: 'ease-out' });
  $('#al-prev').onclick = e => { e.stopPropagation(); if (alI) { alI--; SFX.paper(); alShow(-1); } };
  $('#al-next').onclick = e => { e.stopPropagation(); if (alI < n - 1) { alI++; SFX.paper(); alShow(1); } };
  $('#al-x').onclick = e => { e.stopPropagation(); album.classList.remove('show'); SFX.click(); };
  $('#al-dl').onclick = async e => {
    e.stopPropagation(); const f = await alFile(i); if (!f) { toast('Trình duyệt này chưa cho lưu ảnh, thử Chrome hoặc Safari nhé', 3200); return; }
    const a = document.createElement('a'); a.href = f.url; a.download = f.file.name; document.body.append(a); a.click(); a.remove(); toast('Đã lưu trang album 📔', 2000);
  };
  if (canShare) $('#al-share').onclick = async e => {
    e.stopPropagation(); const f = alFiles[i] || await alFile(i); if (!f) return;
    try { await navigator.share({ files: [f.file], title: 'Một năm bên khung cửa', text: 'Album một năm bên khung cửa 🌿 thaovi0308.github.io/little-sill' }); } catch (err) {}
  };
  setTimeout(() => { if (seq === alSeq) alFile(i); }, 600);   // ready before the share tap (iOS wants share() right inside the tap)
}
album.addEventListener('click', e => { e.stopPropagation(); if (e.target === album) { album.classList.remove('show'); SFX.click(); } });
let alX = null;
album.addEventListener('touchstart', e => { alX = e.touches[0].clientX; }, { passive: true });
album.addEventListener('touchend', e => { if (alX === null || !alPages) return; const dx = e.changedTouches[0].clientX - alX; alX = null;
  if (Math.abs(dx) > 50) { const b = $(dx < 0 ? '#al-next' : '#al-prev'); if (b && !b.disabled) b.click(); } });

document.addEventListener('click', e => { if (e.target.closest && e.target.closest('#al-open')) { e.stopPropagation(); openYearAlbum(); } }, true);   // the paper may be re-rendered while typing
const _useItemA = useItem;
useItem = function (k, row) { if (k === 'album_book') { openYearAlbum(); return; } return _useItemA(k, row); };
// the album turns up once a year, from Christmas Day to the end of January
setInterval(() => {
  if (!(albumSeason() || ALBUM_TEST) || !started || !S.welcomed || S.albumYear === albumYear() || $('#note-wrap').classList.contains('show') || outsideOpen()) return;
  if (Object.keys(S.daysPlayed || {}).length < 2 && !ALBUM_TEST) return;
  if (!storyGate('album' + albumYear())) return;
  S.albumYear = albumYear(); S.keep.album_book = 1; save(); bump($('#p-cat'), 'hop'); SFX.purr();
  showPaper(`<img class="paper-img" src="${ITEM_IMG.album_cover2}" alt="" style="max-height:8em">` + staged(['Cuối năm rồi. Bánh Quy tha từ dưới gầm bàn ra một cuốn album bọc vải xanh, góc còn dính cánh hoa giấy.',
    'Lật trang đầu, trong đó là khung cửa sổ của bạn, những lá thư hàng xóm, hoa lá ép và vài dòng sổ tay của cả một năm.'],
    '<button class="reply" id="al-open">📔 Mở album “Một năm bên khung cửa”</button><small>Album được cất trong hộp kỷ vật, mở lại lúc nào cũng được</small>'), null, true);
  stageReveal(true);
}, 5000);
