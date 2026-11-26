// ================================================================ "Ra ngoài hẻm" (Vi 26/11): alley map, mailbox under the stairs (route 5: Minh), the florist's shop, a 2nd pot
// state
S.born = S.born || Date.now();
S.story.minh = S.story.minh || 0;
S.seedsGot = S.seedsGot || {};
S.shop = Object.assign({ visited: 0, helpDay: '', helpN: 0, pots: null, potsDay: '', chat: 0 }, S.shop || {});
S.radioCh = S.radioCh || 'fm';
const dayN = () => (Date.now() - S.born) / (24 * HOUR);
const forceMap = /[?&]hem\b/.test(location.search);   // testing: ?hem opens the alley map at once
function mapOpen() { return forceMap || (S.story.flower || 0) >= 2 || dayN() >= 1 || S.story.minh > 0; }
function routeDone() { const st = S.story; return st.plane >= 5 || st.na >= 5 || (st.flower || 0) >= 5 || !!st.sparrowCh5; }

// ---------- audio: the map / mailbox keep the room sound a little lower; the shop has its own air
let duckLevel = 1;
function duck(v, t = 0.8) {
  duckLevel = v; if (!AC) return;
  master.gain.cancelScheduledValues(AC.currentTime);
  master.gain.setTargetAtTime(S.muted ? 0 : 0.42 * v, AC.currentTime, t / 3);
}
function footsteps() {   // soft footsteps on brick
  if (!AC) return; const t = AC.currentTime;
  for (let i = 0; i < 4; i++) noiseBurst(t + i * 0.32 + Math.random() * 0.04, 0.07, 160 + Math.random() * 80, 0, 1.2, 0.18, master, 'brown');
}
let shopAir = null;
function shopAudio(on) {
  if (!AC) return;
  const now = AC.currentTime;
  radioVol.gain.cancelScheduledValues(now); radioVol.gain.setTargetAtTime(on ? 0 : S.volRadio, now, 0.27);
  if (bgmBus) { bgmBus.gain.cancelScheduledValues(now); bgmBus.gain.setTargetAtTime(on ? 0 : (S.volMusic ?? 0.7), now, 0.27); }
  if (on) {
    setAmbience(S.weather === 'rain' ? 'rain' : 'sunset', 2.4);   // street air: sparrows (or the rain on the awning)
    clearInterval(shopAir); shopAir = setInterval(() => { if (Math.random() < 0.5) SFX.chime(0.12); else if (S.weather !== 'night') SFX.chirp(); }, 6500);
  } else { clearInterval(shopAir); shopAir = null; setAmbience(S.weather, 2.4); }
}

// ---------- the map button (top right) and the butterfly that says where to go
const mapBtn = $('#mapbtn');
function mailNews() { return minhReady() !== null; }
function shopNews() { return mapOpen() && (!S.shop.visited || shopPotsLeft() > 0); }
let mapShownOnce = !!S.mapSeen;
function applyMapBtn() {
  const open = mapOpen();
  mapBtn.style.display = open ? '' : 'none';
  if (open && !mapShownOnce && started) { mapShownOnce = true; S.mapSeen = 1; save(); bump(mapBtn); toast('Có lối xuống hẻm rồi 🗺️ Chạm nút bản đồ ở góc trên để ra ngoài dạo nhé', 4200); }
  mapBtn.classList.toggle('news', open && (mailNews() || shopNews()));
}
mapBtn.addEventListener('click', e => { e.stopPropagation(); openMap(); });

// ---------- alley map popup
function openMap() {
  if (!AC) initAudio();
  duck(0.7); SFX.paper();
  const m = $('#amap');
  m.querySelector('[data-go="mail"]').classList.toggle('news', mailNews());
  m.querySelector('[data-go="shop"]').classList.toggle('news', shopNews());
  m.classList.add('show');
}
function closeMap() { $('#amap').classList.remove('show'); duck(1); }
$('#amap').addEventListener('click', e => {
  const b = e.target.closest('[data-go]');
  if (!b) { if (e.target.id === 'amap') closeMap(); return; }
  e.stopPropagation();
  if (b.dataset.go === 'home') { closeMap(); SFX.click(); }
  if (b.dataset.go === 'mail') openMailbox();
  if (b.dataset.go === 'shop') enterShop();
});

// ---------- route 5: Minh, the friend far away (texts by Vi)
const MINH = [
  { t: 'Tấm Bưu Thiếp Từ Ga Tàu Ven Biển', pc: 'pc_station',
    lead: 'Chú bướm vàng khẽ bay lên khi nắp hộp thư mở ra. Bên trong là một tấm bưu thiếp mang mùi gió biển cùng gói hạt giống nhỏ...',
    back: 'Chào bạn hiền! Nghe tin bạn mới dọn về căn gác nhỏ trong Hẻm Hoa Giấy, mình mừng lắm. Mình đang đứng ở một ga tàu cũ sát biển, gió thổi mát rượi. Gửi bạn ít hạt giống Cỏ Bốn Lá mình tìm thấy trên đồi cỏ gần đây, gieo thử lên bệ cửa sổ nhé!',
    j: 'Tấm bưu thiếp đầu tiên từ Minh gửi về từ một ga tàu nhỏ nằm sát bờ biển miền Trung. Kèm theo đó là một gói giấy nhỏ đựng hạt giống Cỏ Bốn Lá nhặt được bên triền đồi gió lộng.',
    got: 'Túi hạt Cỏ Bốn Lá đã vào chỗ gieo hạt trên gác 🍀' },
  { t: 'Đêm Mưa Trên Đồi Thông', pc: 'pc_pine',
    lead: 'Trong hòm thư có một chiếc phong bì giấy kraft dày dặn, bên trong cất một cuộn băng cassette cũ...',
    back: 'Tuần này mình đang ở một thị trấn sương mù trên đồi thông. Trời mưa rả rích suốt chiều làm mình chợt nhớ những buổi ngồi nghe nhạc cùng bạn hồi xưa. Gửi bạn cuộn băng cassette “Gió Đồi Thông”, bỏ vào chiếc radio trên bàn nghe thử nha!',
    j: 'Minh gửi một tấm bưu thiếp vẽ rừng thông mờ sương trong mưa. Cậu kể về những tối cắm trại một mình giữa rừng, nghe tiếng mưa gõ trên mái lều và gửi tặng bạn một cuộn băng cassette thu âm tiếng rừng thông.',
    got: 'Cuộn băng “Gió Đồi Thông” đã vào hộp kỷ vật 📼 Chạm radio để đổi kênh' },
  { t: 'Lá Cỏ Bốn Lá Vượt Ngàn Dặm', pc: 'pc_clover',
    lead: 'Một chiếc hộp gỗ nhỏ xíu nằm gọn dưới đáy hòm thư, buộc bằng sợi dây dù màu xanh rêu...',
    back: 'Mình nhận được lá cỏ bốn lá bạn gửi rồi! Vừa mở phong thư ra là thấy ngay mùi nắng ấm của con hẻm nhà bạn. Tặng bạn chiếc la bàn đồng cũ này. Kim của nó hơi lệch nên chẳng chỉ đúng hướng Bắc đâu, nhưng nó nhắc rằng dù đi đâu mình vẫn luôn hướng về bạn.',
    j: 'Nhận được chiếc lá cỏ bốn lá ép khô từ bệ cửa sổ Hẻm Hoa Giấy gửi tới, Minh vô cùng xúc động. Cậu gửi lại một chiếc la bàn đồng nhỏ không chỉ hướng, với lời nhắn nhủ ấm áp về hành trình của cả hai.',
    got: 'La bàn đồng đã vào hộp kỷ vật 🧭' },
  { t: 'Ngọn Hải Đăng Đêm Đầy Sao', pc: 'pc_lighthouse',
    lead: 'Tấm bưu thiếp vẽ một ngọn hải đăng trắng giữa bầu trời đầy sao, kèm theo một món đồ thủ công bằng gỗ...',
    back: 'Đi nhiều nơi mới thấy ai cũng cần một ngọn đèn để nhớ đường về. Với mình, khung cửa sổ đầy hoa của bạn chính là một ngọn hải đăng như thế. Gửi tặng bạn mô hình hải đăng gỗ nhỏ xíu này đặt cạnh chậu cây nhé!',
    j: 'Bưu thiếp gửi từ một hòn đảo nhỏ có ngọn hải đăng trắng. Minh chia sẻ rằng những ngày đi xa đôi lúc cũng thấy chênh vênh, nhưng nghĩ tới khung cửa sổ luôn sáng đèn của bạn ở quê nhà lại thấy vững lòng.',
    got: 'Hải đăng gỗ mini đã vào hộp kỷ vật 🗼 Chạm để đặt lên kệ' },
  { t: 'Hẹn Ngày Trở Về Hẻm Hoa Giấy', pc: 'pc_alley',
    lead: 'Tấm bưu thiếp cuối cùng vẽ chính con hẻm hoa giấy lúc hoàng hôn, nét vẽ mộc mạc mà thân thương...',
    back: 'Chuyến đi dài của mình sắp khép lại rồi. Giữ giúp mình một chỗ ngồi cạnh khung cửa sổ nhé! Ngày gần nhất mình sẽ ghé qua, tụi mình sẽ cùng uống trà, nghe đài và ngắm mưa rơi thật lâu.',
    j: 'Tấm bưu thiếp cuối cùng mang hình vẽ chính con hẻm hoa giấy lúc hoàng hôn. Minh báo tin chuyến đi dài sắp kết thúc và hẹn một ngày gần nhất sẽ ghé thăm căn gác nhỏ của bạn.',
    got: 'Album Bưu Thiếp Phương Xa đã đủ 5 tấm 📖' },
];
const MINH_HOME = { t: 'Mình Về Rồi', pc: 'pc_alley',
  lead: 'Trong hòm thư là cuốn album bưu thiếp buộc dây gai, trang đầu có chữ ký nguệch ngoạc quen thuộc...',
  back: 'Mình về rồi nè! Tách trà thứ hai trên bàn là của mình đấy, cảm ơn bạn đã giữ chỗ. Cuốn album này mình dán đủ những tấm bưu thiếp đã gửi, ký tên từng trang. Lần sau đi xa, mình sẽ mang bạn theo trong từng lá thư.',
  got: 'Cuốn album có chữ ký của Minh đã vào hộp kỷ vật 📖' };
function minhReady() {
  if (!mapOpen()) return null;
  const st = S.story, m = st.minh, since = Date.now() - (st.minhAt || 0);
  if (m === 0) return routeDone() || dayN() >= 2 ? 0 : null;
  if (m === 1) return st.cloverPlanted && since >= 24 * HOUR ? 1 : null;
  if (m === 2) return st.cloverSent && Date.now() - st.cloverSent >= 24 * HOUR ? 2 : null;
  if (m === 3) return S.weather === 'night' && S.radio && S.radioCh === 'pine' ? 3 : null;
  if (m === 4) return S.lighthouseOut ? 4 : null;
  if (m === 5) return st.minhHome && !st.minhAlbum ? 5 : null;
  return null;
}
function pcFront(k) {
  if (k === 'pc_clover') return `<div class="pc-env"><img src="${ITEM_IMG.pf_clover}" alt=""><span class="pm">HẺM HOA GIẤY</span></div>`;
  return `<img src="${ITEM_IMG[k]}" alt="">`;
}
// postcard: front picture, tap to flip, back = Minh's handwriting
function showPostcard(N, buttons, onBtn) {
  const w = $('#pcw');
  w.innerHTML = `<div class="pc" tabindex="0"><div class="pc-in"><div class="pc-f">${pcFront(N.pc)}</div>
    <div class="pc-b"><img class="pc-stamp" src="${ITEM_IMG.badge_plane}" alt=""><span class="pm2">HẺM HOA GIẤY</span><p>${esc(N.back)}</p><i>— Minh</i></div></div></div>
    <small class="pc-hint">Chạm vào tấm bưu thiếp để lật mặt sau</small><div class="pc-btns">${buttons.map((b, i) => `<button class="reply" data-pcb="${i}">${b}</button>`).join('')}</div>`;
  w.classList.add('show'); SFX.paper(); playS('sfx_page', 0.5);
  const card = w.querySelector('.pc');
  card.addEventListener('click', e => { e.stopPropagation(); card.classList.toggle('flip'); w.querySelector('.pc-hint').style.opacity = 0; SFX.paper(); });
  w.querySelectorAll('[data-pcb]').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); onBtn(+b.dataset.pcb); }));
}
function closePostcard() { $('#pcw').classList.remove('show'); }
$('#pcw').addEventListener('click', e => { if (e.target.id === 'pcw') closePostcard(); });
function readMinh(ch) {
  const N = ch === 5 ? MINH_HOME : MINH[ch];
  mboxSay(N.lead);
  setTimeout(() => showPostcard(N, ['Lưu vào Album Bưu Thiếp 📖'], () => {
    const st = S.story;
    if (ch === 5) { st.minhAlbum = 1; S.keep.k_album = 1; }
    else {
      st.minh = ch + 1; st.minhAt = Date.now();
      if (ch === 0) S.seedsGot.clover = 1;
      if (ch === 1) S.keep.k_cassette = 1;
      if (ch === 2) S.keep.k_compass = 1;
      if (ch === 3) S.keep.k_lighthouse = 1;
    }
    save(); closePostcard(); SFX.sparkle(); toast(N.got, 3800); applyMailbox(); applyMapBtn(); checkLights();
  }), 900);
}
function sendClover() {   // [Gửi lại Cỏ Bốn Lá cho Minh ✉️]: an envelope gets a red postmark and goes
  S.keep.clover--; S.story.cloverSent = Date.now(); save();
  const w = $('#pcw');
  w.innerHTML = `<div class="pc"><div class="pc-in"><div class="pc-f">${pcFront('pc_clover')}</div></div><span class="postmark">BƯU ĐIỆN<br>HẺM HOA GIẤY</span></div>`;
  w.classList.add('show'); SFX.paper();
  setTimeout(() => { SFX.click(); w.querySelector('.postmark').classList.add('on'); }, 600);
  setTimeout(() => { w.querySelector('.pc').classList.add('fly'); SFX.flutter(); }, 1700);
  setTimeout(() => { closePostcard(); toast('Lá cỏ bốn lá đã lên đường tới chỗ Minh ✉️ Khoảng một ngày nữa sẽ có hồi âm', 4000); applyMailbox(); }, 2700);
}

// ---------- mailbox popup + the landlady at the stairs
const LADY = {
  intro: ['Ôi, cháu đi xuống cầu thang đấy à? Bà vừa quét xong mấy cánh hoa giấy rụng ngoài sân.',
    'Ở đầu hẻm có tiệm hoa của con bé Thảo dễ thương lắm, có đủ loại hạt giống lạ. Rảnh thì cháu bấm vào bản đồ ghé qua tiệm chơi cho khuây khỏa nhé!'],
  shopDone: 'Hôm nay con bé Thảo có khoe với bà là cháu phụ tưới cây giỏ lắm đấy.',
  mail: 'Sáng nay chú bưu tá mới bỏ vào hòm thư của cháu một tấm bưu thiếp có hình đẹp lắm đấy. Cháu mở ra xem bạn phương xa nhắn gì đi!',
  talk: ['Hôm nay cháu ăn uống đầy đủ chưa đấy? Trên gác tuy mát nhưng chiều tối gió lùa cũng hơi se lạnh, nhớ khoác thêm áo mỏng nha.',
    'Con mèo Bánh Quy sáng giờ cứ quấn quýt dưới chân cầu thang mãi, chắc nó đang ngóng cháu đặt đĩa bánh quy lên bệ cửa đấy.',
    'Sống ở hẻm này chẳng cần đi đâu vội vàng cả cháu ạ, cứ thong thả như giàn hoa giấy ngoài ngõ, ngày nào cũng nở một ít là vui rồi.'],
  gift: 'Bà mới mua được ít bánh quy gừng nướng giòn thơm lắm, bỏ sẵn vào giỏ đây. Cháu cầm lên gác nhâm nhi với trà nóng nha!',
};
let ladyHere = false, ladyQ = [], ladyTalk = 0;
function mboxSay(text, btns) {
  const t = $('#mb-text'); t.classList.remove('fade'); void t.offsetWidth; t.classList.add('fade');
  t.innerHTML = `<p>${esc(text)}</p>` + (btns || '');
}
function applyMailbox() {
  const ch = minhReady();
  $('#mbox').classList.toggle('mail', ch !== null);
  $('#mb-lady').style.display = ladyHere ? '' : 'none';
}
function mailIdle() {
  const st = S.story;
  if (st.minh === 2 && !st.cloverSent) {
    if (S.keep.clover > 0) return mboxSay('Lá cỏ bốn lá ép đã khô phẳng, kẹp vừa một phong thư nhỏ.', '<button class="reply" id="mb-send">Gửi lại Cỏ Bốn Lá cho Minh ✉️</button>');
    return mboxSay(st.cloverPlanted ? 'Hòm thư trống. Chờ chậu cỏ bốn lá trên gác ra lá, hái một lá ép gửi Minh nhé 🍀' : 'Hòm thư trống. Gieo hạt Cỏ Bốn Lá Minh gửi lên bệ cửa nhé 🍀');
  }
  mboxSay('Bên trong chiếc hộp thư gỗ chỉ có vài cánh hoa giấy khô theo gió bay vào. Có lẽ người bạn phương xa đang bận ghi chép ở một vùng đất mới, mình quay lại xem sau nhé.');
}
function openMailbox() {
  SFX.click(); footsteps();
  ladyHere = S.weather !== 'night' && (Math.random() < 0.4 || (!S.shop.visited && !S.ladyIntro) || forceMap && /lady/.test(location.search));
  ladyQ = []; ladyTalk = 0;
  if (ladyHere) {
    if (!S.shop.visited && !S.ladyIntro) { ladyQ = LADY.intro.slice(); S.ladyIntro = 1; save(); }
    else if (minhReady() !== null) ladyQ = [LADY.mail];
    else if (S.shop.helpN > 0 && Math.random() < 0.5) ladyQ = [LADY.shopDone];
  }
  applyMailbox(); $('#mbox').classList.add('show');
  if (ladyQ.length) mboxSay(ladyQ.shift(), ladyQ.length ? '<small class="more">Chạm vào bà để nghe tiếp…</small>' : '');
  else if (minhReady() !== null) mboxSay('Có gì đó lấp ló ở khe hộp thư… chú bướm vàng đang đậu trên nắp.');
  else mailIdle();
}
function closeMailbox() { $('#mbox').classList.remove('show'); closePostcard(); }
$('#mbox').addEventListener('click', e => {
  e.stopPropagation();
  if (e.target.id === 'mbox' || e.target.closest('#mb-x')) { closeMailbox(); SFX.click(); return; }
  if (e.target.closest('#mb-send')) { sendClover(); return; }
  if (e.target.closest('#mb-box')) {
    const ch = minhReady(); bump($('#mb-box'), 'wig'); playS('sfx_paper', 0.5);
    if (ch !== null) readMinh(ch); else mailIdle();
    return;
  }
  if (e.target.closest('#mb-lady')) {
    bump($('#mb-lady'), 'wig');
    if (ladyQ.length) { mboxSay(ladyQ.shift(), ladyQ.length ? '<small class="more">Chạm vào bà để nghe tiếp…</small>' : ''); return; }
    if (S.ladyGiftDay !== dayKey()) {
      S.ladyGiftDay = dayKey(); S.tea = 1; save(); applyTea(); SFX.sparkle();
      mboxSay(LADY.gift); setTimeout(() => toast('Bánh quy gừng của bà đã đặt cạnh tách trà nóng trên gác 🍪', 3200), 1200); return;
    }
    mboxSay(LADY.talk[ladyTalk++ % LADY.talk.length]);
  }
});

// ---------- the florist's shop (scene; texts by Vi, chị–em)
const SHOP = {
  greet: ['Ôi, em xuống chơi đấy à! Sạp hoa hôm nay vừa có thêm mấy chậu cúc mới, em cứ thong thả ngắm nghía nhé.',
    'Nắng chiều nay dịu quá, chị mới pha ấm trà thảo mộc ngoài hiên, em đứng chơi một lát cho mát rồi hãy lên gác.'],
  chat: ['Từ ngày khung cửa sổ trên gác của em sáng đèn và nở hoa, cả đầu hẻm này cũng thấy vui lây đấy.',
    'Chăm cây cũng giống như chăm sóc bản thân vậy em ạ, cứ tưới tắm từng chút một, không cần vội vàng đâu.',
    'Hồi bé Na còn nhỏ xíu, ngày nào cũng chạy ra đây xin một bông cúc kẹp tóc. Giờ lớn rồi mà vẫn giữ thói quen ấy đấy.',
    'Bác sửa đồng hồ bên kia đường sáng nào cũng ghé mua một cành hoa cắm bàn làm việc. Bác bảo có hoa thì kim đồng hồ chạy cũng hiền hơn.',
    'Chị đoán mai trời sẽ đổ mưa, mấy chậu dương xỉ trên kệ cứ vươn lá ra như đang chờ ấy.'],
  help: 'Mấy chậu hoa này cứ gặp đôi tay của em là lại tươi tỉnh hẳn ra. Chị tặng em nhành hoa khô này mang lên gác làm dấu trang (bookmark) nhé!',
  helpFert: 'Cảm ơn đôi tay khéo léo của em nhé! Chị gửi em túi phân bón hữu cơ, bón cho chậu cây trên gác là lần tới nó lớn nhanh hẳn đấy.',
  pot2: 'Cảm ơn em nhiều nha! Thấy em chăm cây khéo vậy, chị tặng em thêm một chậu đất nhỏ. Mang lên gác đặt cạnh cây nến, vậy là trồng được hai cây cùng lúc rồi!',
  tea: ['Trà thảo mộc thơm mùi sả với cúc khô, ấm từ đầu lưỡi xuống tận lòng.', 'Một ngụm trà nóng dưới mái hiên sọc xanh, nghe tiếng chuông gió đầu ngõ leng keng.'],
};
const SHOP_SEEDS = [
  { k: 'forget', name: 'Hoa Lưu Ly', icon: '💙', cost: { daisy: 1 }, need: 'Cần 1 cúc họa mi ép',
    d: 'Những hạt giống nhỏ xíu đựng trong gói giấy xanh nhạt. Loài hoa cánh mỏng màu xanh biếc mang ý nghĩa của những kỷ niệm dịu dàng không bao giờ quên.',
    care: 'Tưới nước 2 lần + nghe nhạc radio · nở sau 10 giờ',
    ok: 'Bông cúc em tự trồng trên gác đẹp quá trời! Chị gửi lại em túi hạt Hoa Lưu Ly này, mang về gieo thử xem sao nha.' },
  { k: 'hydrangea', name: 'Cẩm Tú Cầu Mini', icon: '🌸', cost: { fern: 1, lavender: 1 }, need: 'Cần 1 dương xỉ & 1 oải hương',
    d: 'Gói hạt giống buộc bằng sợi dây thừng gai nhỏ. Khi nở sẽ kết thành từng chùm hoa tròn xoe mềm mại, rất thích những ngày trời đổ mưa rào.',
    care: 'Tưới nước 2 lần + gặp mưa 1 lần · nở sau 14 giờ',
    ok: 'Hương oải hương dịu thật đấy. Đổi lại chị tặng em hạt Cẩm Tú Cầu Mini, cây này thích trời mưa lắm đấy!' },
  { k: 'clover', name: 'Cỏ Bốn Lá May Mắn', icon: '🍀', cost: { pothos: 1 }, need: 'Cần 1 lá trầu bà',
    d: 'Túi giấy kraft có đóng dấu hình chiếc lá nhỏ. Loài cây bé xinh ưa nắng chiều ấm áp, nghe nói ai trồng được sẽ thường xuyên gặp những niềm vui bất ngờ.',
    care: 'Tưới nước 1 lần + nắng chiều · nở sau 8 giờ',
    ok: 'Lá trầu bà xanh mướt luôn! Chị gửi em túi hạt Cỏ Bốn Lá, nghe nói trồng được cây này sẽ gặp nhiều điều dễ thương lắm.',
    hello: 'Nghe nói em có người bạn gửi cỏ bốn lá về hả? Chị cũng để dành một túi nè, trồng thêm chậu nữa cho may mắn nhân đôi.' },
];
const SEED_NO = ['Hình như trong hộp kỷ vật của em chưa có đủ nhành hoa này rồi. Em cứ thong thả lên gác chăm cây thêm chút nữa nhé, chị luôn để dành hạt giống ở đây chờ em mà!',
  'Không vội đâu em ơi, đợi khi nào cây trên bệ cửa nở hoa rồi mang xuống đổi với chị cũng được nha.'];
const SEED_ALL = 'Em đã sưu tầm đủ cả 3 loại hạt giống đặc biệt của tiệm hoa rồi! Chúc khu vườn nhỏ trên gác của em lúc nào cũng rực rỡ sắc màu nhé 🌸';
const COST_NAME = { daisy: 'cúc họa mi ép', fern: 'lá dương xỉ', lavender: 'túi thơm oải hương', pothos: 'lá trầu bà' };
// shelf pots drawn in Vi's shop picture (scene units); a few look thirsty each day until you water them
const SHOP_POTS = [[94, 388, 58, 82], [168, 420, 46, 50], [218, 392, 64, 90], [92, 505, 50, 72], [154, 525, 58, 50], [222, 520, 52, 58],
  [86, 600, 64, 78], [160, 630, 46, 48], [214, 596, 56, 82]];
function shopPotsToday() {
  if (S.shop.potsDay !== dayKey()) {
    const idx = SHOP_POTS.map((_, i) => i).sort(() => Math.random() - 0.5).slice(0, 3);
    S.shop.pots = idx; S.shop.potsDay = dayKey(); save();
  }
  return S.shop.pots || [];
}
function shopPotsLeft() { return S.shop.helpDay === dayKey() ? 0 : shopPotsToday().length; }
let shopSayT = 0, shopQ = [];
function shopSay(text, more) {
  const b = $('#shop-say'); clearTimeout(shopSayT);
  b.innerHTML = esc(text) + (more ? '<small class="more">Chạm để nghe tiếp…</small>' : ''); b.classList.remove('show'); void b.offsetWidth; b.classList.add('show');
  shopSayT = setTimeout(() => b.classList.remove('show'), Math.max(5200, text.length * 70));
}
function shopNext() { if (shopQ.length) shopSay(shopQ.shift(), shopQ.length > 0); }
$('#shop-say').addEventListener('click', e => { e.stopPropagation(); if (shopQ.length) shopNext(); else $('#shop-say').classList.remove('show'); });
function applyShop() {
  const sh = $('#shop'); sh.dataset.w = S.weather;
  const left = shopPotsLeft() ? shopPotsToday() : [];
  sh.querySelectorAll('.spot').forEach((el, i) => el.classList.toggle('dry', left.includes(i)));
  sh.querySelectorAll('.sw').forEach(b => b.classList.toggle('on', b.dataset.w === S.weather));
}
function outsideOpen() { return ['#amap', '#mbox', '#pcw'].some(q => $(q).classList.contains('show')) || $('#shop').classList.contains('show'); }
function enterShop() {
  djStop();
  const fade = $('#fade'); fade.classList.add('on'); footsteps(); setTimeout(() => SFX.chime(0.3), 500);
  setTimeout(() => {
    closeMailbox(); $('#amap').classList.remove('show'); duck(1);
    applyShop(); $('#shop').classList.add('show'); shopAudio(true); fade.classList.remove('on');
    shopQ = [];
    if (!S.shop.visited) shopQ = SHOP.greet.slice();
    else if (S.story.minh >= 1 && !S.seedsGot.clover && !S.shop.cloverHi) { S.shop.cloverHi = 1; shopQ = [SHOP_SEEDS[2].hello]; }
    else shopQ = [SHOP.greet[Math.floor(Math.random() * 2)]];
    S.shop.visited = 1; save(); applyMapBtn();
    setTimeout(shopNext, 700);
  }, 420);
}
function leaveShop() {
  const fade = $('#fade'); fade.classList.add('on'); footsteps();
  setTimeout(() => { $('#shop').classList.remove('show'); $('#shop-say').classList.remove('show'); shopAudio(false); fade.classList.remove('on'); applyMapBtn();
    if (S.radio && S.weather === 'night') djNext(true); }, 420);
}
function waterShopPot(i) {
  const left = shopPotsToday(); if (S.shop.helpDay === dayKey() || !left.includes(i)) { shopSay(SHOP.chat[S.shop.chat++ % SHOP.chat.length]); return; }
  const el = $('#shop').querySelectorAll('.spot')[i]; el.classList.remove('dry'); bump(el, 'wiggle'); SFX.water();
  S.shop.pots = left.filter(x => x !== i); save();
  if (S.shop.pots.length) { toast(`Tưới xong một chậu 💧 còn ${S.shop.pots.length} chậu đang khát`, 2200); return; }
  S.shop.helpDay = dayKey(); S.shop.helpN++;
  let line, got;
  if (S.garden2 === undefined) { S.garden2 = null; line = SHOP.pot2; got = 'Chậu nhỏ thứ hai đã đặt trên bàn, cạnh cây nến 🪴'; setTimeout(() => updatePlant(true, 1), 800); }
  else if (Math.random() < 0.35 && !S.fert) { S.fert = 1; line = SHOP.helpFert; got = 'Túi phân bón đã bón cho chậu trên gác, lần lớn tới sẽ nhanh hơn 🌱'; }
  else { const k = ['lavender', 'daisy', 'fern'][Math.floor(Math.random() * 3)]; S.keep[k] = (S.keep[k] || 0) + 1; line = SHOP.help; got = `Nhận một nhành ${COST_NAME[k]} khô, đã cất vào hộp kỷ vật 🌾`; }
  save(); SFX.sparkle(); shopQ = []; shopSay(line); setTimeout(() => toast(got, 3600), 2200); applyMapBtn();
}
function openSeedTrade() {
  const have = k => S.keep[k] || 0;
  const list = SHOP_SEEDS.filter(s => s.k !== 'clover' || S.story.minh >= 1 || S.seedsGot.clover);
  const all = SHOP_SEEDS.every(s => S.seedsGot[s.k]);
  const cards = list.map(s => {
    const got = S.seedsGot[s.k], can = Object.entries(s.cost).every(([k, n]) => have(k) >= n);
    const cost = Object.entries(s.cost).map(([k, n]) => `${n} ${COST_NAME[k]}`).join(' + ');
    return `<div class="trade"><img src="${ITEM_IMG['seed_' + s.k]}" alt=""><div><b>${s.name} ${s.icon}</b><span class="cost">Đổi: ${cost}</span>
      <p>${s.d}</p><span class="care">🌱 ${s.care}</span>
      <button class="reply" data-trade="${s.k}"${got ? ' disabled' : ''}${!got && !can ? ' data-no="1"' : ''}>${got ? 'Đã có túi hạt này ✓' : can ? 'Đổi lấy hạt giống' : s.need}</button></div></div>`;
  }).join('');
  openPanel(`<h3>Giỏ Hạt Giống Đầu Hẻm 🌱</h3><p class="flav">${all ? SEED_ALL : 'Ở tiệm không tính tiền đâu em nhé! Em cứ mang hoa hay lá tự trồng trên gác xuống chia sẻ với chị, rồi chọn một túi hạt giống mới mang về gieo cho vui cửa vui nhà.'}</p>${cards}<small>Chạm ra ngoài để đóng</small>`);
  document.querySelectorAll('[data-trade]').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation(); const s = SHOP_SEEDS.find(x => x.k === b.dataset.trade);
    if (b.dataset.no) { closeNote(); shopQ = []; shopSay(SEED_NO[Math.floor(Math.random() * 2)]); return; }
    Object.entries(s.cost).forEach(([k, n]) => { S.keep[k] -= n; });
    S.seedsGot[s.k] = 1; save(); SFX.sparkle(); closeNote();
    shopQ = SHOP_SEEDS.every(x => S.seedsGot[x.k]) ? [s.ok, SEED_ALL] : []; shopSay(s.ok, shopQ.length > 1); if (shopQ.length) shopQ.shift();
    setTimeout(() => toast(`Túi hạt ${s.name} đã vào chỗ gieo hạt trên gác 🌱`, 3400), 2400);
  }));
}
$('#shop').addEventListener('click', e => {
  e.stopPropagation();
  const t = e.target.closest('[data-s]'); if (!t) return;
  const k = t.dataset.s;
  if (k === 'home') { SFX.click(); leaveShop(); }
  else if (k === 'map') { SFX.click(); leaveShop(); setTimeout(openMap, 500); }
  else if (k === 'florist') { bump($('#shop-florist'), 'wig'); if (shopQ.length) shopNext(); else shopSay(SHOP.chat[S.shop.chat++ % SHOP.chat.length]); }
  else if (k === 'basket') { SFX.paper(); openSeedTrade(); }
  else if (k === 'tea') { SFX.water(); shopSay(SHOP.tea[Math.floor(Math.random() * 2)]); }
  else if (k.startsWith('pot')) waterShopPot(+k.slice(3));
  else if (k === 'w') { setWeather(t.dataset.w); applyShop(); }
});
(function buildShop() {
  const sh = $('#shop');
  sh.style.backgroundImage = `url(${ITEM_IMG.shop_bg})`;
  $('#shop-florist').src = ITEM_IMG.florist; $('#shop-front').src = ITEM_IMG.shop_front;
  place($('#shop-florist'), 361, 560, 217, 640);
  place($('#shop-front'), 0, 731, 714, 410);
  SHOP_POTS.forEach(([x, y, w, h], i) => {
    const d = document.createElement('div'); d.className = 'spot';
    d.style.backgroundImage = `url(${ITEM_IMG.shop_bg})`; d.style.backgroundPosition = `${x / (714 - w) * 100}% ${y / (1280 - h) * 100}%`;
    d.style.backgroundSize = `${714 / w * 100}% ${1280 / h * 100}%`;
    place(d, x, y, w, h); sh.insertBefore(d, $('#shop-florist'));
    const b = document.createElement('button'); b.className = 'hit'; b.dataset.s = 'pot' + i; b.setAttribute('aria-label', 'Chậu cây trên kệ');
    place(b, x - 6, y - 10, w + 12, h + 16); sh.appendChild(b);
  });
  const hit = (s, box, label) => { const b = document.createElement('button'); b.className = 'hit'; b.dataset.s = s; b.setAttribute('aria-label', label); place(b, ...box); sh.appendChild(b); };
  hit('florist', [372, 560, 200, 270], 'Chị chủ tiệm hoa');
  hit('basket', [331, 718, 152, 150], 'Giỏ hạt giống');
  hit('tea', [474, 750, 136, 114], 'Ấm trà thảo mộc');
})();

// ---------- lighthouse on the little wall shelf: at night its lamp sweeps a slow golden beam
$('#p-lighthouse').src = ITEM_IMG.lighthouse;
place($('#p-lighthouse'), 598, 911, 38, 72);
function applyLighthouse() {
  const on = !!S.lighthouseOut; $('#p-lighthouse').style.display = on ? '' : 'none';
  HITS.lighthouse.el.style.display = on ? '' : 'none';
  $('#beam').classList.toggle('on', on && S.weather !== 'sunset');
}
{ const b = $('#beam'); b.style.left = (616 / SW * 100) + '%'; b.style.top = (922 / SH * 100) + '%'; }

// ---------- Minh comes home: a second cup on the desk
place($('#p-tea2'), 488, 1060, 68, 53);
function applyMinhHome() {
  const st = S.story;
  if (st.minh === 5 && !st.minhHome && Date.now() - (st.minhAt || 0) >= 72 * HOUR && started && storyGate('minhHome')) {
    st.minhHome = 1; save(); SFX.sparkle();
    setTimeout(() => toast('Trên bàn có thêm một tách trà còn ấm và một mẩu giấy: “Mình về rồi nè, ra hòm thư xem quà nha!” 🎒', 5200), 600);
  }
  $('#p-tea2').style.opacity = st.minhHome ? 1 : 0;
}

// ---------- compass wishes
const COMPASS = ['Kim la bàn khẽ rung rồi dừng về phía cửa sổ: hôm nay cứ ở yên nơi mình thấy bình yên nhất nhé.',
  'Kim quay một vòng rồi chỉ về đầu hẻm: biết đâu sắp có một lá thư đang trên đường tới.',
  'Kim lệch hẳn sang hướng có nắng: một tin vui nhỏ đang chờ bạn quanh đây.',
  'Kim run run giữa hai hướng: không cần chọn ngay đâu, cứ thong thả uống hết tách trà đã.',
  'Kim dừng ở hướng chậu cây: tưới thêm chút nước, mọi thứ rồi sẽ nở đúng mùa.'];

document.querySelectorAll('[data-img]').forEach(im => { im.src = ITEM_IMG[im.dataset.img]; });

// ---------- radio channels: Tần Số Hẻm Hoa Giấy (94.2 FM, DJ at night) ↔ the cassette "Gió Đồi Thông" (rain on pines)
let pineSrc = null;
function pineBed(on) {
  if (!AC) return;
  if (pineSrc) { const old = pineSrc; pineSrc = null; old.g.gain.setTargetAtTime(0, AC.currentTime, 0.4); setTimeout(() => old.s.forEach(x => x.stop()), 2000); }
  if (!on) return;
  const g = gain(0); g.connect(radioBus); const s = [];
  for (const [n, v] of [['amb_rain', 0.9], ['amb_day', 0.5]]) if (BUF[n]) {
    const b = AC.createBufferSource(); b.buffer = BUF[n]; b.loop = true; chain(b, gain(v), g); b.start(0, Math.random() * BUF[n].duration); s.push(b);
  }
  g.gain.setTargetAtTime(1, AC.currentTime + 0.4, 0.6); pineSrc = { g, s };
}
function setChannel(ch, quiet) {
  S.radioCh = ch; save();
  if (AC) noiseBurst(AC.currentTime, 0.4, 900, 2600, 0.6, 0.1);
  pineBed(S.radio && ch === 'pine');
  if (ch === 'pine') { djStop(); if (!quiet) toast('📼 Băng cassette “Gió Đồi Thông”: mưa rơi trên rừng thông', 3200); }
  else if (S.radio) { if (S.weather === 'night') djNext(true); if (!quiet) toast('Tần Số Hẻm Hoa Giấy · 94.2 FM 📻', 2400); }
  setTimeout(() => applyMapBtn(), 300);
}
const _setRadioBase = setRadio;
setRadio = function (on) { _setRadioBase(on); pineBed(on && S.radioCh === 'pine'); };

// ---------- Minh's postcard album (journal route 5 + the album keepsake)
JOURNAL.push({ who: 'Người Bạn Phương Xa', by: 'Hòm thư chân cầu thang', img: 'pc_station',
  ch: MINH.map((c, k) => ({ t: c.t, ok: st => (st.minh || 0) > k, x: c.j })) });
function openAlbum() {
  const got = MINH.filter((_, k) => (S.story.minh || 0) > k);
  openPanel(`<h3>Album Bưu Thiếp Phương Xa</h3>${S.story.minhAlbum ? '<p class="flav">Trang đầu có chữ ký nguệch ngoạc: “Minh — gửi người giữ ngọn hải đăng của mình”</p>' : ''}
    <div class="album">${got.map((c, k) => `<button class="alb" data-pc="${k}"><span>${pcFront(c.pc)}</span><b>${k + 1}. ${c.t}</b></button>`).join('')}</div>
    <small>Chạm vào một tấm để đọc lại · chạm ra ngoài để đóng</small>`);
  document.querySelectorAll('#note [data-pc]').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation(); closeNote(); showPostcard(MINH[+b.dataset.pc], ['‹ Về album'], () => { closePostcard(); openAlbum(); });
  }));
}
