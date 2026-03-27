/* ============================================================
   BucinMob — i18n Engine + Page Init
   Language priority:
     1. ?lang=xx URL param (shareable links)
     2. localStorage 'bm_lang' (user preference)
     3. navigator.language (browser setting)
     4. Default: 'ro'
   ============================================================ */

const BROWSER_LANG = (navigator.language || 'ro').substring(0, 2).toLowerCase();
const SUPPORTED    = ['ro', 'en', 'de'];
const DEFAULT_LANG = 'ro';
const LANG_NAMES   = { ro: 'Română', en: 'English', de: 'Deutsch' };

function getLang() {
  return localStorage.getItem('bm_lang') ||
    (SUPPORTED.includes(BROWSER_LANG) ? BROWSER_LANG : DEFAULT_LANG);
}

function setLang(lang, save = true) {
  if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;
  const T = TRANSLATIONS[lang];
  if (!T) return;
  if (save) localStorage.setItem('bm_lang', lang);

  // Swap all tagged elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const v = T[el.getAttribute('data-i18n')];
    if (v !== undefined) el.innerHTML = v.replace(/\n/g, '<br>');
  });

  // Swap placeholders
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const v = T[el.getAttribute('data-i18n-ph')];
    if (v !== undefined) el.placeholder = v;
  });

  // Rebuild ticker
  const ticker = document.getElementById('ticker-track');
  if (ticker && T['ticker.items']) {
    const items = T['ticker.items'].split('|');
    ticker.innerHTML = [...items, ...items].map(s => `<span>${s}</span>`).join('');
  }

  // Update <html lang=""> for accessibility + SEO
  document.documentElement.lang = lang;

  // Update nav switcher buttons
  document.querySelectorAll('.lang-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.lang === lang)
  );

  // Inject hreflang <link> tags for SEO
  document.querySelectorAll('link[rel="alternate"]').forEach(l => l.remove());
  SUPPORTED.forEach(l => {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = l;
    link.href = `${window.location.pathname}?lang=${l}`;
    document.head.appendChild(link);
  });
}

// Non-intrusive language suggestion banner
function showSuggestBanner(suggestedLang) {
  if (localStorage.getItem('bm_lang_dismissed')) return;
  const T = TRANSLATIONS[getLang()];
  if (!T) return;
  const banner = document.createElement('div');
  banner.id = 'lang-banner';
  banner.innerHTML = `
    <span>${${T["lang.suggest"]}} <strong>${${LANG_NAMES[suggestedLang]}}</strong></span>
    <button onclick="setLang('${suggestedLang}');document.getElementById('lang-banner').remove()">
      ${${T["lang.accept"]}}
    </button>
    <button class="dismiss" onclick="localStorage.setItem('bm_lang_dismissed','1');document.getElementById('lang-banner').remove()">✕</button>
  `;
  document.body.prepend(banner);
}

// ── Init ────────────────────────────────────────────────────────────────────
// 1. Check for ?lang= URL override
const urlLang = new URLSearchParams(window.location.search).get('lang');
if (urlLang && SUPPORTED.includes(urlLang)) localStorage.setItem('bm_lang', urlLang);

document.addEventListener('DOMContentLoaded', () => {
  // Apply language
  setLang(getLang(), false);

  // Sticky nav
  const nav = document.getElementById('nav');
  if (nav) window.addEventListener('scroll', () =>
    nav.classList.toggle('scrolled', window.scrollY > 60));

  // Scroll-reveal
  if ('IntersectionObserver' in window) {
    document.body.classList.add('js-ready');
    const io = new IntersectionObserver(entries =>
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      }), { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  // Language suggestion banner (only if no saved preference)
  if (!localStorage.getItem('bm_lang') &&
      BROWSER_LANG !== DEFAULT_LANG &&
      SUPPORTED.includes(BROWSER_LANG)) {
    showSuggestBanner(BROWSER_LANG);
  }
});
