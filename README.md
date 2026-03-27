# BucinMob — Website

> Producător de tâmplărie din lemn masiv triplustratificat și mobilier de grădină.  
> Reghin, Mureș, România · [bucinmob.com](https://bucinmob.com) · [bucinmob.ro](https://bucinmob.ro)

---

## 🚀 Quick Deploy

### Option A — GitHub Pages (recommended)

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Set source to `main` branch, root folder `/`
4. Your site goes live at `https://yourusername.github.io/bucinmob-website`

### Option B — Netlify Drop (fastest, 30 seconds)

1. Go to [netlify.com/drop](https://netlify.com/drop)
2. Drag the entire project folder onto the page
3. Get a live HTTPS URL instantly
4. Optionally connect to this GitHub repo for auto-deploy on push

### Option C — Netlify + GitHub (best for ongoing dev)

1. Push to GitHub
2. Go to [app.netlify.com](https://app.netlify.com) → New site → Import from Git
3. Select this repo — Netlify auto-deploys on every `git push`

---

## 📁 Project Structure

```
bucinmob-website/
│
├── index.html                      ← Homepage (brand landing page)
├── product-low-poly-table.html     ← LOW-POLY Table product page
├── product-low-poly-cupboard.html  ← LOW-POLY Cupboard product page
├── product-clear-surf.html         ← CLEAR SURF product page
│
├── assets/
│   ├── css/
│   │   └── main.css                ← All styles (shared + product pages)
│   ├── js/
│   │   ├── translations.js         ← All copy in RO / EN / DE
│   │   └── i18n.js                 ← Language engine + page init
│   └── images/
│       └── logo.webp               ← BucinMob logo
│
├── _config.yml                     ← GitHub Pages config
├── netlify.toml                    ← Netlify config (redirects + headers)
├── .gitignore
└── README.md
```

---

## 🌍 Multilingual System

The site supports **Romanian (ro)**, **English (en)** and **German (de)** out of the box.

### How it works

Every translatable element carries a `data-i18n` attribute:
```html
<h1 data-i18n="hero.title"></h1>
```

On load, `i18n.js` reads the user's preferred language and swaps all values from `translations.js`.

**Language detection priority:**
1. `?lang=de` URL param → instant switch, saved to localStorage (shareable links)
2. `localStorage` → remembers the user's choice across sessions
3. `navigator.language` → browser preference used for suggestion banner
4. Falls back to Romanian

**Suggestion banner** — if the browser reports EN or DE, a non-intrusive banner appears:  
*"We also have this page in English — Switch / ✕"*  
Dismissing it sets a flag so it never shows again.

### Adding a new language (e.g. Hungarian)

1. Open `assets/js/translations.js`
2. Copy the `"en": { ... }` block
3. Rename the key to `"hu"`
4. Translate each value
5. Add `"hu"` to the `SUPPORTED` array in `assets/js/i18n.js`
6. Add a button to the nav in each HTML file:
   ```html
   <button class="lang-btn" data-lang="hu" onclick="setLang('hu')">HU</button>
   ```

### Shareable language links
```
https://yoursite.com/index.html?lang=en  → opens in English
https://yoursite.com/index.html?lang=de  → opens in German
```

---

## 🎨 Brand

| Token | Hex | Usage |
|---|---|---|
| `--red` | `#e8401c` | Primary CTAs, accents, active states |
| `--navy` | `#1e2d3d` | Hero bg, headings, footer, nav |
| `--white` | `#ffffff` | Page background, card surfaces |
| `--off` | `#f6f4f1` | Section alternation |

**Fonts:** Montserrat (UI/navigation) + Lora (display headings) via Google Fonts

---

## 🛠 Development

No build step required — pure HTML/CSS/JS.

For local development with live reload:
```bash
# Option 1 — Python (built-in)
python3 -m http.server 8080
# then open http://localhost:8080

# Option 2 — Node live-server
npx live-server
```

> ⚠️ Open via a local server (not `file://`) so that `fetch` and relative paths work correctly.

---

## 📋 Roadmap / Next Steps

- [ ] Add Hungarian (HU) translation
- [ ] Connect to bucinmob.ro shop via product deep-links
- [ ] Add Google Analytics / Plausible tracking
- [ ] Add contact form backend (Netlify Forms / Formspree)
- [ ] Move product images to CDN (currently base64 embedded)
- [ ] Add remaining product categories (Ferestre, Uși, SKADI)
- [ ] SEO: add `sitemap.xml` and `robots.txt`
- [ ] Migrate to WordPress + WPML for CMS-driven content management

---

## 📞 Contact

**Bucin Mob SRL** · Reghin, Județul Mureș, România  
☎ 004 0265 534 214 · 004 0761 102 800  
🌐 [bucinmob.ro](https://bucinmob.ro) · [bucinmob.com](https://bucinmob.com)
