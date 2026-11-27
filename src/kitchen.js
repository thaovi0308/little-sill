// ================================================================ Góc Bếp Nhỏ (the little charcoal stove in the attic)
// Script: Vi 27/11 (work/vi_scripts_kitchen.md). Opens once two kinds of plants have been grown and the flower shop visited:
// the landlady brings up a charcoal stove and a clay pot. One dish a day: pick a recipe, fan the coals three times, the pot
// bubbles, then eat it yourself (a kitchen question in the notebook) or send it to a neighbour, who answers with a small gift.
// Vi's drawings come later: every picture falls back to an emoji, and the corner only opens for players once the stove
// drawing (kit_stove) is in (?bep opens it anyway, for testing).
S.kit = Object.assign({ got: 0, day: '', dish: -1, done: '', cooked: {}, inSeason: {}, gifts: {}, reply: null, ateDay: '', eaten: 0 }, S.kit || {});
const KTEST = /[?&]bep\b/.test(location.search);
const kpic = (k, emoji, h = 6) => ITEM_IMG[k] ? `<img class="paper-img" src="${ITEM_IMG[k]}" alt="" style="max-height:${h}em">` : `<div style="font-size:${h * 0.55}em;text-align:center;line-height:1.2">${emoji}</div>`;
// seasons by month (VN): spring 2-4, summer 5-7, autumn 8-10, winter 11-1
const kSeason = () => { const m = new Date().getMonth() + 1; return m >= 2 && m <= 4 ? 'xuan' : m <= 7 && m >= 5 ? 'ha' : m >= 8 && m <= 10 ? 'thu' : 'dong'; };
const SEASON_NAME = { xuan: 'mùa Xuân', ha: 'mùa Hạ', thu: 'mùa Thu', dong: 'mùa Đông' };
const DISHES = [
  { k: 'kit_chedauxanh', e: '🥣', name: 'Chè đậu xanh', when: ['ha'], ing: 'Hạt đậu xanh (bà chủ nhà cho) + Lá dứa (tiệm hoa)',
    done: 'Chè đánh mịn, thơm dịu mùi lá dứa và nước cốt dừa béo ngậy, ăn vào mát rượi cả buổi trưa hè.' },
  { k: 'kit_flan', e: '🍮', name: 'Bánh flan', when: ['xuan', 'ha', 'thu', 'dong'], ing: 'Trứng gà + Sữa tươi + Chút cà phê/caramel',
    done: 'Mặt bánh mịn màng, lớp nước đường nâu hổ phách đắng nhẹ hòa cùng vị béo thơm lừng.' },
  { k: 'kit_banhbo', e: '🧁', name: 'Bánh bò', when: ['xuan'], ing: 'Bột gạo + Đường thốt nốt + Lá dứa',
    done: 'Chiếc bánh nở xốp như rễ tre, thoang thoảng mùi men ngọt dịu và lá dứa xanh tươi.' },
  { k: 'kit_troinuoc', e: '🍡', name: 'Chè trôi nước', when: ['dong'], ing: 'Bột nếp + Đậu xanh + Gừng tươi',
    done: 'Viên chè tròn đầy ngập trong nước đường gừng cay ấm, xua tan cái se lạnh ngoài khung cửa.' },
  { k: 'kit_xoigac', e: '🍚', name: 'Xôi gấc', when: ['xuan'], ing: 'Gạo nếp + Quả gấc đỏ + Dừa nạo',
    done: 'Hạt xôi dẻo thơm mang sắc đỏ cam ấm áp như mang theo chút may mắn đầu ngày.' },
  { k: 'kit_banhchuoi', e: '🍌', name: 'Bánh chuối nướng', when: ['thu'], ing: 'Chuối chín (tiệm hoa/bà cho) + Nước cốt dừa',
    done: 'Lớp vỏ nướng vàng xém cạnh, bên trong ngọt lịm vị chuối chín hồng hào và cốt dừa thơm phức.' },
];
const KIT_LADY = 'Bà thấy trên gác còn trống một góc nhỏ gần cửa sổ, nên mang lên cho cháu cái bếp than với chiếc nồi đất cũ. Chiều chiều nhóm chút lửa hồng nấu nồi chè, nướng ổ bánh cho căn gác thơm mùi bếp núc. Nấu dư thì chia cho hàng xóm mỗi người một chén cho vui cháu nhé!';
// neighbours, the way each one's letters travel, and what they send back (Vi: seeds, a dried flower, painting paper, a candy…)
const KIT_NB = [
  { id: 'old', who: 'Bác Sửa Đồng Hồ', by: 'Thư chim sẻ', e: '🐦', met: () => (S.story.old || 0) >= 1,
    say: 'Chú chim sẻ tha gói bánh nóng hổi sang tận bàn làm việc của bác. Ngon lắm cháu ạ, vị ngọt thanh vừa vặn với người già. Bác gửi lại cháu ít trà mạn mới pha, ăn bánh uống trà là đúng điệu.', gift: 'Gói trà mạn của bác' },
  { id: 'plane', who: 'Cậu Họa Sĩ Tầng Trên', by: 'Máy bay giấy', e: '✈️', met: () => (S.story.plane || 0) >= 1,
    say: 'Cứu tinh đây rồi! Mình đang cặm cụi vẽ quên cả giờ ăn chiều thì nhận được phần quà từ căn gác của bạn. Ngọt dịu mà ấm bụng vô cùng. Mình gửi lại bạn vài tờ giấy vẽ màu nước nhé.', gift: 'Mấy tờ giấy vẽ màu nước' },
  { id: 'na', who: 'Bé Na Tầng Dưới', by: 'Ruy băng cổ mèo', e: '🎀', met: () => (S.story.na || 0) >= 1,
    say: 'Oa, thơm nức mũi luôn bạn ơi! Em chia cho mẹ một nửa, phần của em ăn sạch sành sanh trong một nốt nhạc. Bánh Quy cũng chạy tới ngửi ngửi mà em không cho ăn đồ ngọt đâu nha!', gift: 'Một viên kẹo gói giấy bóng của bé Na' },
  { id: 'flower', who: 'Chị Bán Hoa Đầu Hẻm', by: 'Túi vải ròng rọc', e: '🧺', met: () => (S.story.flower || 0) >= 1,
    say: 'Chị kéo túi vải lên mà mùi thơm bay khắp cả góc tiệm hoa luôn em. Cảm ơn em lúc nào cũng nhớ tới chị nhé. Chị gửi xuống cho em một cành hoa cúc tươi mới cắt sáng nay nè.', gift: 'Một cành hoa cúc (đã cất để ép)', keep: 'daisy' },
  { id: 'minh', who: 'Minh, Người Bạn Phương Xa', by: 'Hòm thư chân cầu thang', e: '📮', met: () => (S.story.minh || 0) >= 1,
    say: 'Mở hòm thư ra thấy hộp bánh ấm tay của bạn mà tự nhiên thấy nhớ những buổi chiều ngồi hiên nhà hồi xưa quá. Ngon lắm bạn ơi, cảm ơn bạn đã giữ lại hương vị quen thuộc này.', gift: 'Một nhúm hạt giống Minh gom dọc đường' },
  { id: 'khai', who: 'Ông Khải, Tiệm Sách Cuối Hẻm', by: 'Thẻ mượn sách', e: '📚', met: () => (S.story.khai || 0) >= 1,
    say: 'Lâu lắm rồi tiệm sách của ông mới có mùi bánh chè nhà làm thơm thế này. Ông vừa nhâm nhi vừa đọc sách, thấy lòng nhẹ nhõm hẳn. Ông gửi cháu một chiếc kẹp sách giấy làm kỷ niệm nhé.', gift: 'Chiếc kẹp sách giấy của ông Khải' },
  { id: 'hanh', who: 'Cô Hạnh, Bên Kia Hẻm', by: 'Thư thuyền giấy', e: '⛵', met: () => (S.story.hanh || 0) >= 1,
    say: 'Cô nhận được quà của cháu rồi, ấm áp từ tay cầm tới tận trong lòng. Lát nữa tối cô sẽ đàn một bài thật vui để cảm ơn đầu bếp nhỏ trên căn gác nhé!', gift: 'Tối nay cô Hạnh đàn một bài thật vui' },
];
const KIT_Q = ['Món ăn giản dị nào ở nhà chỉ cần ngửi thấy mùi là bạn thấy lòng dịu lại?',
  'Nếu hôm nay được nấu một món ngon để tặng một người thương, bạn sẽ nấu món gì?',
  'Kỷ niệm ấm áp nhất của bạn bên căn bếp nhỏ của gia đình là gì?'];

const kitOpen = () => KTEST || (Object.keys(S.harvested || {}).length >= 2 && S.shop && S.shop.visited && ITEM_IMG.kit_stove);

// ---------------------------------------------------------------- the stove button (a corner button until Vi draws the stove)
const kst = document.createElement('style');
kst.textContent = `#kitbtn { position: absolute; left: 3.2%; top: calc(2.6% + 15.2%); width: 11%; aspect-ratio: 126 / 97; border-radius: 30%; z-index: 5; cursor: pointer;
    border: 0; background: rgba(253, 248, 238, .82); box-shadow: 0 2px 6px rgba(60, 40, 20, .25); font-size: 1.35em; padding: 0; }
  #kitbtn.ready::after { content: ''; position: absolute; right: 6%; top: 6%; width: 18%; aspect-ratio: 1; border-radius: 50%; background: #e8863a; }
  .kit-dish { display: flex; gap: .55em; align-items: center; width: 100%; text-align: left; }
  .kit-dish .e { font-size: 1.6em; } .kit-dish small { display: block; margin: 0; }
  .kit-pot { position: relative; text-align: center; font-size: 3.4em; line-height: 1.1; margin: .2em 0; }
  .kit-pot .ember { display: block; font-size: .5em; filter: saturate(.4) brightness(.8); transition: filter .4s; }
  .kit-pot.h1 .ember { filter: saturate(.8) } .kit-pot.h2 .ember { filter: saturate(1.2) brightness(1.1) } .kit-pot.h3 .ember { filter: saturate(1.6) brightness(1.25) }
  .kit-pot .steam { position: absolute; left: 50%; top: -.2em; font-size: .45em; opacity: 0; transform: translateX(-50%); }
  .kit-pot.boil .steam { animation: kitSteam 1.6s ease-out infinite; }
  @keyframes kitSteam { 0% { opacity: 0; transform: translate(-50%, .4em) } 40% { opacity: .8 } 100% { opacity: 0; transform: translate(-50%, -1.2em) } }
  .kit-pot.boil .pot { animation: kitBob .5s ease-in-out infinite alternate; display: inline-block; }
  .kit-pot .stove { filter: brightness(.88) saturate(.8); transition: filter .5s; }
  .kit-pot.h1 .stove { filter: brightness(.95) } .kit-pot.h2 .stove { filter: brightness(1.03) saturate(1.1) }
  .kit-pot.h3 .stove { filter: brightness(1.1) saturate(1.25) drop-shadow(0 0 10px rgba(255, 140, 50, .55)) }
  @keyframes kitBob { to { transform: translateY(-3px) rotate(1.5deg) } }`;
document.head.append(kst);
const kitBtn = document.createElement('button'); kitBtn.id = 'kitbtn'; kitBtn.setAttribute('aria-label', 'Góc bếp nhỏ'); kitBtn.textContent = '🍲'; kitBtn.style.display = 'none';
$('#decobtn').after(kitBtn);
function applyKitBtn() {
  kitBtn.style.display = S.welcomed && S.kit.got ? '' : 'none';
  kitBtn.classList.toggle('ready', S.kit.done !== dayKey());
  if (ITEM_IMG.kit_stove && !kitBtn.querySelector('img')) kitBtn.innerHTML = `<img src="${ITEM_IMG.kit_stove}" alt="" style="width:80%;height:80%;object-fit:contain">`;
}

// ---------------------------------------------------------------- sounds: a fan whoosh, the clay pot bubbling
function kFan() { if (!AC || S.muted) return; noiseBurst(AC.currentTime, 0.35, 500, 1400, 1.2, 0.14, master, 'brown' in NOISE ? 'brown' : 'white'); }
function kBubble(sec = 3) {
  if (!AC || S.muted) return; const t0 = AC.currentTime;
  for (let i = 0; i < sec * 7; i++) { const t = t0 + i / 7 + Math.random() * 0.1, o = tone(t, 180 + Math.random() * 160, 0.06, 0.05, 'sine'); o.frequency.exponentialRampToValueAtTime(420 + Math.random() * 200, t + 0.06); }
}

// ---------------------------------------------------------------- cooking
function openKitchen() {
  if (S.kit.done === dayKey() && S.kit.dish >= 0) { dishDone(S.kit.dish, true); return; }
  const sea = kSeason();
  const rows = DISHES.map((d, i) => `<button class="reply kit-dish" data-kd="${i}"><span class="e">${ITEM_IMG[d.k] ? `<img src="${ITEM_IMG[d.k]}" alt="" style="height:1.6em">` : d.e}</span><span><b>${d.name}</b>${S.kit.cooked[i] ? ' ✓' : ''}${d.when.includes(sea) && d.when.length < 4 ? ' · 🍃 hợp mùa' : ''}<small>${d.ing}</small></span></button>`).join('');
  showPaper(`${kpic('kit_stove', '🔥🍲', 5)}<p class="bub">Hôm nay nấu món gì nhỉ?</p>${rows}<small>Mỗi ngày nấu một món · đang là ${SEASON_NAME[sea]}</small>`, null, true);
}
let kFans = 0, kCooking = -1;
function cook(i) {
  const d = DISHES[i]; kFans = 0; kCooking = i;
  showPaper(`<p class="bub">${d.name}: cho nguyên liệu vào nồi đất, rồi quạt than nhẹ ba nhịp nhé.</p>
    <div class="kit-pot" id="kit-pot"><span class="steam">♨️</span>${ITEM_IMG.kit_stove ? `<span class="pot"><img class="stove" src="${ITEM_IMG.kit_stove}" alt="" style="height:2.6em"></span>` : '<span class="pot">🍲</span><span class="ember">🔥🔥🔥</span>'}</div>
    <button class="reply" id="kit-fan" style="text-align:center">${ITEM_IMG.kit_fan ? `<img src="${ITEM_IMG.kit_fan}" alt="" style="height:1.4em;vertical-align:middle"> ` : '🪭 '}Quạt than (<span id="kit-n">0</span>/3)</button>`, null, true);
}
function fanOnce() {   // the paper may re-render while its text types out, so every lookup is fresh
  const i = kCooking; if (i < 0 || kFans >= 3) return;
  kFans++; kFan(); const n = $('#kit-n'), pot = $('#kit-pot'), fan = $('#kit-fan');
  if (n) n.textContent = kFans; if (pot) pot.className = 'kit-pot h' + kFans; if (fan) bump(fan);
  if (kFans === 3) {
      setTimeout(() => { const p = $('#kit-pot'), f = $('#kit-fan'); if (p) p.classList.add('boil'); kBubble(3); if (f) f.textContent = 'Nồi đất sôi lụp bụp…'; }, 500);
      setTimeout(() => {
        const k = S.kit, sea = kSeason();
        k.dish = i; k.done = dayKey(); k.cooked[i] = (k.cooked[i] || 0) + 1; k.used = 0;
        if (DISHES[i].when.includes(sea) && DISHES[i].when.length < 4) k.inSeason[i] = 1;
        kCooking = -1; save(); applyKitBtn(); SFX.sparkle(); dishDone(i);
      }, 3600);
  }
}
function dishDone(i, again) {
  const d = DISHES[i], sea = kSeason(), fit = d.when.includes(sea) && d.when.length < 4;
  const nbs = KIT_NB.filter(n => KTEST || n.met()), used = S.kit.used;
  const acts = used ? `<small>${used === 'eat' ? 'Bạn đã thưởng thức món hôm nay rồi. Mai mình nấu tiếp nhé.' : `Đã gửi tặng ${esc(KIT_NB.find(n => n.id === used).who)}.`}</small>`
    : `<button class="reply" id="kit-eat">🥄 Tự thưởng thức</button>` + (nbs.length ? `<button class="reply" id="kit-give">🎁 Gửi tặng hàng xóm</button>` : '');
  showPaper(`${kpic(d.k, d.e, 6)}<p class="bub"><b>${d.name}</b><br>${d.done}</p>${fit && !again ? `<small>🍃 Đúng ${SEASON_NAME[sea]}, món này ngon hơn hẳn.</small>` : ''}${acts}`, null, true);
}
function kitEat() {
  const d = DISHES[S.kit.dish]; if (S.kit.used) return;
  {
    S.kit.used = 'eat'; S.kit.ateDay = dayKey(); S.kit.eaten++; save(); hearts(); SFX.purr();
    showPaper(`${kpic(d.k, d.e, 5)}<p class="bub">Bạn ngồi bên bệ cửa, thổi nhẹ cho bớt nóng rồi ăn từng thìa. Căn gác thơm mùi bếp núc.</p><small>Sổ tay hôm nay có một câu hỏi mới về góc bếp 📓</small>`);
  }
}
function kitGive() {
  const d = DISHES[S.kit.dish], nbs = KIT_NB.filter(n => KTEST || n.met()); if (S.kit.used) return;
  {
    showPaper(`<p class="bub">Gửi ${d.name.toLowerCase()} cho ai đây?</p>${nbs.map(n => `<button class="reply" data-kn="${n.id}">${n.e} ${n.who} <small style="display:inline">· ${n.by}</small></button>`).join('')}`, null, true);
  }
}
function kitSend(id) {
  const n = KIT_NB.find(x => x.id === id), i = S.kit.dish, d = DISHES[i]; if (!n || S.kit.used) return;
  S.kit.used = n.id; S.kit.gifts[n.id] = (S.kit.gifts[n.id] || 0) + 1; S.kit.reply = { id: n.id, dish: i, at: Date.now() + (KTEST ? 3000 : 30 * 60e3) }; save();
  closeNote(); SFX.paper(); toast(`${n.e} ${d.name} đã theo ${n.by.toLowerCase()} đi rồi. Lát nữa sẽ có hồi âm.`, 3200);
}
// one delegated listener: buttons inside the paper survive its re-renders
document.addEventListener('click', e => {
  const t = e.target.closest && e.target.closest('#kit-fan, #kit-eat, #kit-give, [data-kd], [data-kn]'); if (!t) return;
  e.stopPropagation();
  if (t.id === 'kit-fan') fanOnce(); else if (t.id === 'kit-eat') kitEat(); else if (t.id === 'kit-give') kitGive();
  else if (t.dataset.kd !== undefined) { SFX.click(); cook(+t.dataset.kd); } else kitSend(t.dataset.kn);
}, true);
function kitReply() {
  const r = S.kit.reply, n = KIT_NB.find(x => x.id === r.id), d = DISHES[r.dish];
  S.kit.reply = null; if (n.keep) S.keep[n.keep] = (S.keep[n.keep] || 0) + 1; save();
  if (n.id === 'hanh' && typeof farTune === 'function') setTimeout(() => farTune(PHRASES[(S.hanh && S.hanh.song) || 0], 0.6, 0.05), 1500);
  SFX.paper();
  showPaper(`<small>${n.e} ${n.by} · cảm ơn món ${d.name.toLowerCase()}</small><p class="bub">${n.say}</p><small>— ${n.who} —</small><small>🎁 ${n.gift}</small>`);
}

// ---------------------------------------------------------------- the story tick: the landlady brings the stove, replies come back
setInterval(() => {
  if (!started || !S.welcomed) return; applyKitBtn();
  if ($('#note-wrap').classList.contains('show') || outsideOpen()) return;
  const k = S.kit;
  if (!k.got && kitOpen() && storyGate('kit0')) {
    k.got = 1; save(); applyKitBtn(); SFX.paper();
    showPaper(`${ITEM_IMG.landlady ? `<img class="paper-img" src="${ITEM_IMG.landlady}" alt="" style="max-height:7em">` : ''}${kpic('kit_stove', '🔥🍲', 5)}<p class="bub">${KIT_LADY}</p><small>— Bà chủ nhà tầng dưới —</small><small>Góc bếp nhỏ đã mở: chạm nút 🍲 ở góc trái để nấu</small>`);
  } else if (k.reply && Date.now() >= k.reply.at && storyGate('kitR' + k.reply.at)) kitReply();
}, 5000);
kitBtn.addEventListener('click', e => { e.stopPropagation(); SFX.click(); openKitchen(); });

// the notebook asks a kitchen question on days you ate your own dish
const _todayQK = todayQuestion;
todayQuestion = function () {
  if (S.kit.ateDay === dayKey()) return { theme: 'Góc Bếp Nhỏ', q: KIT_Q[(S.kit.eaten - 1) % KIT_Q.length] };
  return _todayQK();
};
