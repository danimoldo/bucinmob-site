/* ============================================================
   BucinMob — i18n Engine + Page Init   v2
   Languages: ro · en · de · hu
   Priority: ?lang= URL > localStorage > navigator.language > 'ro'
   ============================================================ */

const BROWSER_LANG = (navigator.language || 'ro').substring(0, 2).toLowerCase();
const SUPPORTED    = ['ro', 'en', 'de', 'hu'];
const DEFAULT_LANG = 'ro';
const LANG_NAMES   = { ro: 'Română', en: 'English', de: 'Deutsch', hu: 'Magyar' };

function getLang() {
  return localStorage.getItem('bm_lang') ||
    (SUPPORTED.includes(BROWSER_LANG) ? BROWSER_LANG : DEFAULT_LANG);
}

function setLang(lang, save) {
  if (save === undefined) save = true;
  if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;
  var T = TRANSLATIONS[lang];
  if (!T) return;
  if (save) localStorage.setItem('bm_lang', lang);

  // Swap all [data-i18n] elements
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var v = T[el.getAttribute('data-i18n')];
    if (v !== undefined) el.innerHTML = v.replace(/\n/g, '<br>');
  });

  // Swap placeholders
  document.querySelectorAll('[data-i18n-ph]').forEach(function(el) {
    var v = T[el.getAttribute('data-i18n-ph')];
    if (v !== undefined) el.placeholder = v;
  });

  // Rebuild ticker
  var ticker = document.getElementById('ticker-track');
  if (ticker && T['ticker.items']) {
    var items = T['ticker.items'].split('|');
    var doubled = items.concat(items);
    ticker.innerHTML = doubled.map(function(s) { return '<span>' + s + '</span>'; }).join('');
  }

  // Update <html lang>
  document.documentElement.lang = lang;

  // Update switcher active state
  document.querySelectorAll('.lang-btn').forEach(function(btn) {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // hreflang SEO tags
  document.querySelectorAll('link[rel="alternate"]').forEach(function(l) { l.remove(); });
  SUPPORTED.forEach(function(l) {
    var link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = l;
    link.href = window.location.pathname + '?lang=' + l;
    document.head.appendChild(link);
  });
}

// Language suggestion banner
function showSuggestBanner(suggestedLang) {
  if (localStorage.getItem('bm_lang_dismissed')) return;
  var T = TRANSLATIONS[getLang()];
  if (!T) return;
  var suggest = T['lang.suggest'] || 'Also available in';
  var accept  = T['lang.accept']  || 'Switch';
  var name    = LANG_NAMES[suggestedLang] || suggestedLang;
  var banner  = document.createElement('div');
  banner.id   = 'lang-banner';
  banner.innerHTML =
    '<span>' + suggest + ' <strong>' + name + '</strong></span>' +
    '<button onclick="setLang(\'' + suggestedLang + '\');document.getElementById(\'lang-banner\').remove()">' + accept + '</button>' +
    '<button class="dismiss" onclick="localStorage.setItem(\'bm_lang_dismissed\',\'1\');document.getElementById(\'lang-banner\').remove()">&#x2715;</button>';
  document.body.prepend(banner);
}

// ── Init ─────────────────────────────────────────────────────────────────────
// ?lang= URL param override
var urlLang = new URLSearchParams(window.location.search).get('lang');
if (urlLang && SUPPORTED.includes(urlLang)) localStorage.setItem('bm_lang', urlLang);

document.addEventListener('DOMContentLoaded', function() {
  setLang(getLang(), false);

  // Sticky nav
  var nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function() {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  // Scroll-reveal
  if ('IntersectionObserver' in window) {
    document.body.classList.add('js-ready');
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(function(el) { io.observe(el); });
  }

  // Suggestion banner
  if (!localStorage.getItem('bm_lang') &&
      BROWSER_LANG !== DEFAULT_LANG &&
      SUPPORTED.includes(BROWSER_LANG)) {
    showSuggestBanner(BROWSER_LANG);
  }
});
