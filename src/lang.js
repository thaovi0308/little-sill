// ---------- Language: Vietnamese (index.html) / English (en.html, built by work/build_en.py from i18n/en.json)
// The save is shared (same site), so switching keeps all progress. First visit: follow the phone's language.
const PAGE_LANG = document.documentElement.lang === 'en' ? 'en' : 'vi';
function goLang(l) {
  try { localStorage.setItem('ls_lang', l); } catch (e) {}
  location.replace((l === 'en' ? 'en.html' : 'index.html') + location.search + location.hash);
}
const _openSoundLang = openSound;
openSound = function () {
  _openSoundLang();
  const b = document.createElement('button'); b.className = 'reply'; b.id = 'v-lang';
  b.textContent = PAGE_LANG === 'en' ? '🌐 Tiếng Việt' : '🌐 English';
  $('#v-mute').before(b);
  b.addEventListener('click', e => { e.stopPropagation(); goLang(PAGE_LANG === 'en' ? 'vi' : 'en'); });
};
// Language pill on the opening screen (Vi 28/11: players pick the language they like), both labels always visible
(function () {
  const intro = $('#intro'); if (!intro) return;
  const st = document.createElement('style');
  st.textContent = `#lang-pill { margin-top: 1.4em; display: flex; gap: 0; border-radius: 99px; overflow: hidden;
    border: 1.5px solid rgba(253,248,238,.55); background: rgba(40,28,20,.35); }
  #lang-pill button { font: 600 clamp(12px, calc(1.8 * var(--vh, 1vh)), 15px) 'Quicksand', system-ui, sans-serif;
    color: #FDF8EE; background: none; border: 0; padding: .45em 1.1em; cursor: pointer; }
  #lang-pill button.on { background: #FDF8EE; color: #4A3525; }`;
  document.head.appendChild(st);
  const p = document.createElement('div'); p.id = 'lang-pill';
  p.innerHTML = '<button data-l="vi">🇻🇳 Tiếng Việt</button><button data-l="en">🇬🇧 English</button>';
  p.querySelector(`[data-l="${PAGE_LANG}"]`).classList.add('on');
  p.addEventListener('click', e => {
    e.stopPropagation();
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.l !== PAGE_LANG) goLang(b.dataset.l);
  });
  intro.appendChild(p);
})();
