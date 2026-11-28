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
