# JianRan Category Catalog + Admin Uploader — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the public site into a 6-category catalog (cards → per-category gallery, seeded with the 27 existing photos) and add a secret admin page that lets the owner add/remove/replace images by committing to the live `JianRanBuildingMaterials` repo via the GitHub Contents API.

**Architecture:** Static site, no build step. Two new data files (`catalog-seed.js` = fixed seed of the 27 current images; `catalog-admin.js` = admin-managed `{adds, hidden}` overlay). `script.js` renders category cards and a hash-routed gallery (`#cat=<id>`) reusing the existing lightbox. A new `jradminjie123.html` + `jradminjie123.js` clones the proven `jiadminjie123.js` flooring-admin pattern (passphrase gate → GitHub PAT in localStorage → Contents API commits), swapping product metadata for `category + caption`.

**Tech Stack:** HTML, CSS, vanilla JS (ES5-style, no framework). Verification via `node --check`, `grep`, and Playwright (module at `/home/yurin/cq-scratch/node_modules/playwright`, desktop 1440 / mobile 390).

**Reference file (copy verbatim sections from here):** `/home/yurin/flooring-site/assets/js/jiadminjie123.js`.

**No test framework exists** (static site). "Tests" = `node --check` for JS validity, `grep` assertions for HTML/markup, and Playwright screenshots read back as images. Commit after each task.

---

## File structure

| File | Action | Responsibility |
|---|---|---|
| `assets/js/catalog-seed.js` | Create | Fixed seed array of the 27 existing images mapped to categories |
| `assets/js/catalog-admin.js` | Create | Admin overlay `{adds, hidden}` (starts empty; admin page rewrites it) |
| `styles.css` | Modify | Catalog card-grid + gallery styles (append) |
| `index.html` | Modify | Replace Sourcing/Designs/Windows with one `#catalog` section; nav; script includes |
| `script.js` | Rewrite | Catalog data + cards + hash-routed gallery + lightbox + existing nav/hero behaviour |
| `jradminjie123.html` | Create | Secret admin page markup (gate, token, add/manage tabs) |
| `assets/js/jradminjie123.js` | Create | Admin logic (adapted from `jiadminjie123.js`) |

Categories (used in both `script.js` and `jradminjie123.js`):
```js
var CATEGORIES = [
  { id: 'kitchen',  label: 'Kitchen & Cabinetry' },
  { id: 'windows',  label: 'Windows & Doors' },
  { id: 'tiles',    label: 'Tiles' },
  { id: 'stone',    label: 'Stone & Marble' },
  { id: 'flooring', label: 'Flooring' },
  { id: 'lighting', label: 'Lighting' }
];
```

---

# PHASE 1 — Public catalog (shippable on its own)

## Task 1: Seed data file

**Files:** Create `assets/js/catalog-seed.js`

- [ ] **Step 1: Create the file with all 27 items**

```js
/* Catalog seed — the existing photo set. Safe to hand-edit. The admin page
   (jradminjie123.html) does NOT touch this file; it writes catalog-admin.js. */
window.__CATALOG_SEED = [
  { slug: 'design-na-01', category: 'kitchen', src: 'assets/designs/design-na-01.jpg', caption: 'Grey shaker kitchen' },
  { slug: 'design-na-02', category: 'kitchen', src: 'assets/designs/design-na-02.jpg', caption: 'Dark wood island kitchen' },
  { slug: 'design-na-03', category: 'kitchen', src: 'assets/designs/design-na-03.jpg', caption: 'Olive green classic kitchen' },
  { slug: 'design-na-04', category: 'kitchen', src: 'assets/designs/design-na-04.jpg', caption: 'Grey kitchen with island' },
  { slug: 'design-na-05', category: 'kitchen', src: 'assets/designs/design-na-05.jpg', caption: 'Two-tone classic kitchen' },
  { slug: 'design-na-06', category: 'kitchen', src: 'assets/designs/design-na-06.jpg', caption: 'Cream glass-front kitchen' },
  { slug: 'design-sea-01', category: 'kitchen', src: 'assets/designs/design-sea-01.jpg', caption: 'Matte modern island kitchen' },
  { slug: 'design-sea-02', category: 'kitchen', src: 'assets/designs/design-sea-02.jpg', caption: 'Modern kitchen, open shelving' },
  { slug: 'design-sea-03', category: 'kitchen', src: 'assets/designs/design-sea-03.jpg', caption: 'Modular cabinet range' },
  { slug: 'design-sea-04', category: 'kitchen', src: 'assets/designs/design-sea-04.jpg', caption: 'Cream modern island kitchen' },
  { slug: 'design-sea-05', category: 'kitchen', src: 'assets/designs/design-sea-05.jpg', caption: 'Wood modern kitchen' },
  { slug: 'design-sea-06', category: 'kitchen', src: 'assets/designs/design-sea-06.jpg', caption: 'Dark modern kitchen' },
  { slug: 'design-sea-07', category: 'kitchen', src: 'assets/designs/design-sea-07.jpg', caption: 'Green island kitchen' },
  { slug: 'design-sea-08', category: 'kitchen', src: 'assets/designs/design-sea-08.jpg', caption: 'Marble island kitchen' },
  { slug: 'design-sea-09', category: 'kitchen', src: 'assets/designs/design-sea-09.jpg', caption: 'Dark kitchen with dining' },
  { slug: 'design-sea-10', category: 'kitchen', src: 'assets/designs/design-sea-10.jpg', caption: 'Island kitchen with ovens' },
  { slug: 'design-sea-11', category: 'kitchen', src: 'assets/designs/design-sea-11.jpg', caption: 'Wood & cream open kitchen' },
  { slug: 'design-sea-12', category: 'kitchen', src: 'assets/designs/design-sea-12.jpg', caption: 'Marble display & bar cabinet' },
  { slug: 'window-01', category: 'windows', src: 'assets/windows/window-01.jpg', caption: 'Aluminium sliding doors' },
  { slug: 'window-02', category: 'windows', src: 'assets/windows/window-02.jpg', caption: 'Bifold glass doors' },
  { slug: 'window-03', category: 'windows', src: 'assets/windows/window-03.jpg', caption: 'Corner picture window' },
  { slug: 'window-04', category: 'windows', src: 'assets/windows/window-04.jpg', caption: 'Aluminium entry door' },
  { slug: 'window-05', category: 'windows', src: 'assets/windows/window-05.jpg', caption: 'Bifold doors to kitchen' },
  { slug: 'window-06', category: 'windows', src: 'assets/windows/window-06.jpg', caption: 'Sliding stacker doors' },
  { slug: 'window-07', category: 'windows', src: 'assets/windows/window-07.jpg', caption: 'Bathroom window' },
  { slug: 'window-08', category: 'windows', src: 'assets/windows/window-08.jpg', caption: 'Facade glazing' },
  { slug: 'window-09', category: 'windows', src: 'assets/windows/window-09.jpg', caption: 'Awning window' }
];
```

- [ ] **Step 2: Verify it parses and has 27 items**

Run: `node -e "global.window={};require('./assets/js/catalog-seed.js');console.log(window.__CATALOG_SEED.length)"`
Expected: prints `27`, no errors.

- [ ] **Step 3: Verify every seed image exists on disk**

Run: `node -e "global.window={};require('./assets/js/catalog-seed.js');var fs=require('fs');window.__CATALOG_SEED.forEach(function(i){if(!fs.existsSync(i.src))throw new Error('missing '+i.src)});console.log('all present')"`
Expected: prints `all present`.

- [ ] **Step 4: Commit**

```bash
git add assets/js/catalog-seed.js
git commit -m "Add catalog seed data (27 existing images)"
```

## Task 2: Empty admin overlay file

**Files:** Create `assets/js/catalog-admin.js`

- [ ] **Step 1: Create the file**

```js
/* Catalog admin data — managed by jradminjie123.html. Do NOT hand-edit. */
window.__CATALOG_ADMIN = {"adds":[],"hidden":[]};
```

- [ ] **Step 2: Verify**

Run: `node -e "global.window={};require('./assets/js/catalog-admin.js');console.log(JSON.stringify(window.__CATALOG_ADMIN))"`
Expected: prints `{"adds":[],"hidden":[]}`.

- [ ] **Step 3: Commit**

```bash
git add assets/js/catalog-admin.js
git commit -m "Add empty catalog admin overlay"
```

## Task 3: Catalog CSS

**Files:** Modify `styles.css` (append at end of file)

- [ ] **Step 1: Append the catalog styles**

```css

/* ===== Catalog (category cards + gallery) ===== */
.cat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(16px, 2.4vw, 28px);
  margin-top: clamp(40px, 6vw, 68px);
}
.cat-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--line-soft);
  background: #fff;
  color: inherit;
  text-decoration: none;
}
.cat-cover {
  display: block;
  aspect-ratio: 3 / 2;
  overflow: hidden;
  background: #f0ece6;
}
.cat-cover img { width: 100%; height: 100%; object-fit: cover; display: block; }
.cat-card.is-empty .cat-cover { display: grid; place-items: center; }
.cat-name { font-size: 16px; font-weight: 500; padding: 16px 18px 2px; }
.cat-meta {
  font-size: 11px; letter-spacing: .08em; text-transform: uppercase;
  color: var(--slate); padding: 0 18px 16px;
}
.cat-card.is-empty .cat-meta { color: #9a948c; }
.gallery-back {
  display: inline-block; font-size: 12px; letter-spacing: .06em;
  text-transform: uppercase; color: var(--slate); text-decoration: none; margin-bottom: 18px;
}
.gallery-back:hover { color: var(--walnut); }
.gallery-empty {
  font-size: 16px; color: var(--slate); text-align: center;
  padding: clamp(48px, 9vw, 100px) 0; border: 1px solid var(--line-soft); margin-top: 24px;
}
@media (max-width: 900px) { .cat-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .cat-grid { grid-template-columns: 1fr; } }
```

- [ ] **Step 2: Verify the brace count is balanced**

Run: `node -e "var s=require('fs').readFileSync('styles.css','utf8');var o=(s.match(/{/g)||[]).length,c=(s.match(/}/g)||[]).length;console.log('open',o,'close',c);if(o!==c)process.exit(1)"`
Expected: `open` and `close` equal.

- [ ] **Step 3: Commit**

```bash
git add styles.css
git commit -m "Add catalog card + gallery styles"
```

## Task 4: Replace page sections in index.html

**Files:** Modify `index.html`

Before editing, Read `index.html` to get exact current bytes. After the statement band the page has: `<hr>`, `#source` (Sourcing — Building-materials list only), `<hr>`, `#designs` (NA + SEA figures), `<hr>`, `#windows` (9 figures), `<hr>`, then `#process`.

- [ ] **Step 1: Update the nav** — replace:
```html
      <nav class="nav" id="nav">
        <a href="#designs">Designs</a>
        <a href="#windows">Windows</a>
        <a href="#source">Sourcing</a>
        <a href="#process">Process</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>
```
with:
```html
      <nav class="nav" id="nav">
        <a href="#catalog">Catalog</a>
        <a href="#process">Process</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>
```

- [ ] **Step 2: Update the hero secondary CTA** — replace:
```html
        <a class="pill pill-ghost-light pill-lg" href="#designs">View the designs</a>
```
with:
```html
        <a class="pill pill-ghost-light pill-lg" href="#catalog">Browse the catalog</a>
```

- [ ] **Step 3: Remove the three sections and collapse dividers.** Delete everything from the `<hr class="rule">` immediately before `<!-- ===== Sourcing ===== -->` up to **and including** the `</section>` that closes `#windows` (the Sourcing + Designs + Windows sections and the `<hr>` dividers among them). Insert in their place exactly this (one `<hr>` before; the existing `<hr>` before `#process` stays), so the page reads statement → `<hr>` → catalog → `<hr>` → process:
```html
  <hr class="rule">

  <!-- ===== Catalog ===== -->
  <section class="band" id="catalog">
    <span class="eyebrow">What we source</span>
    <h2 class="heading heading-sm">Browse the catalog.</h2>
    <p class="lead">Factory-direct building materials and furniture, by category. Click a category to view designs.</p>

    <div id="catCards" class="cat-grid"></div>

    <div id="catGallery" hidden>
      <a class="gallery-back" href="#catalog">&larr; All categories</a>
      <h3 class="heading heading-sm" id="galleryHead"></h3>
      <div class="grid grid-designs" id="galleryGrid"></div>
    </div>
  </section>
```

- [ ] **Step 4: Add the data-file script includes** — replace:
```html
  <script src="script.js"></script>
```
with:
```html
  <script src="assets/js/catalog-seed.js"></script>
  <script src="assets/js/catalog-admin.js"></script>
  <script src="script.js"></script>
```

- [ ] **Step 5: Verify removals and additions**

Run:
```bash
grep -c 'id="source"\|id="designs"\|id="windows"' index.html; \
grep -c 'id="catalog"\|id="catCards"\|id="catGallery"' index.html; \
grep -c 'catalog-seed.js\|catalog-admin.js' index.html
```
Expected: `0`, then `3`, then `2`.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "Replace Sourcing/Designs/Windows with catalog section"
```

## Task 5: Rewrite script.js (catalog rendering + routing + lightbox)

**Files:** Modify `script.js` (replace the whole file)

- [ ] **Step 1: Replace the entire file contents with:**

```js
/* ===== China — catalog + interactions ===== */
(function () {
  'use strict';

  var CATEGORIES = [
    { id: 'kitchen',  label: 'Kitchen & Cabinetry' },
    { id: 'windows',  label: 'Windows & Doors' },
    { id: 'tiles',    label: 'Tiles' },
    { id: 'stone',    label: 'Stone & Marble' },
    { id: 'flooring', label: 'Flooring' },
    { id: 'lighting', label: 'Lighting' }
  ];

  function $(id) { return document.getElementById(id); }
  function escHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* ---------- Catalog data ---------- */
  function catalogItems() {
    var seed = window.__CATALOG_SEED || [];
    var admin = window.__CATALOG_ADMIN || { adds: [], hidden: [] };
    var hidden = admin.hidden || [];
    return seed.concat(admin.adds || []).filter(function (it) { return hidden.indexOf(it.slug) === -1; });
  }
  function itemsIn(id) { return catalogItems().filter(function (it) { return it.category === id; }); }

  var catCards = $('catCards');
  var catGallery = $('catGallery');
  var galleryHead = $('galleryHead');
  var galleryGrid = $('galleryGrid');

  function renderCards() {
    if (!catCards) return;
    catCards.innerHTML = CATEGORIES.map(function (cat) {
      var list = itemsIn(cat.id);
      var filled = list.length > 0;
      var meta = filled ? (list.length + (list.length === 1 ? ' photo' : ' photos')) : 'Coming soon';
      return '<a class="cat-card' + (filled ? '' : ' is-empty') + '" href="#cat=' + cat.id + '">' +
               '<span class="cat-cover">' + (filled ? '<img src="' + escHtml(list[0].src) + '" alt="" loading="lazy">' : '') + '</span>' +
               '<span class="cat-name">' + escHtml(cat.label) + '</span>' +
               '<span class="cat-meta">' + meta + '</span>' +
             '</a>';
    }).join('');
  }

  function renderGallery(id) {
    var cat = null, i;
    for (i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].id === id) cat = CATEGORIES[i];
    if (!cat) { showCards(); return; }
    var list = itemsIn(id);
    galleryHead.textContent = cat.label;
    if (list.length === 0) {
      galleryGrid.innerHTML = '<p class="gallery-empty">Photos coming soon.</p>';
    } else {
      galleryGrid.innerHTML = list.map(function (it) {
        return '<figure class="ph" data-caption="' + escHtml(it.caption || '') + '">' +
                 '<img src="' + escHtml(it.src) + '" alt="' + escHtml(it.caption || '') + '" loading="lazy">' +
               '</figure>';
      }).join('');
    }
    catCards.hidden = true;
    catGallery.hidden = false;
  }

  function showCards() {
    if (!catGallery || !catCards) return;
    catGallery.hidden = true;
    catCards.hidden = false;
  }

  function route() {
    var m = (location.hash || '').match(/^#cat=([a-z]+)/);
    if (m) renderGallery(m[1]);
    else showCards();
  }

  if (catCards && catGallery) {
    renderCards();
    window.addEventListener('hashchange', route);
    route();
  }

  /* ---------- Mobile nav ---------- */
  var hamburger = $('hamburger');
  var nav = $('nav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Hero thumbnail swap ---------- */
  var heroBg = $('heroBg');
  var heroThumbs = $('heroThumbs');
  if (heroBg && heroThumbs) {
    heroThumbs.querySelectorAll('.hthumb').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var src = btn.getAttribute('data-hero');
        if (!src) return;
        heroBg.src = src;
        heroThumbs.querySelectorAll('.hthumb').forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
        });
      });
    });
  }

  /* ---------- Lightbox (operates on the currently-rendered .ph tiles) ---------- */
  var lightbox = $('lightbox');
  var lbImg = $('lbImg');
  var lbCaption = $('lbCaption');
  var figs = [];
  var lbIndex = 0;

  function refreshFigs() { figs = Array.prototype.slice.call(document.querySelectorAll('.ph')); }
  function showSlide(i) {
    var n = figs.length; if (!n) return;
    lbIndex = (i + n) % n;
    var fig = figs[lbIndex];
    var img = fig.querySelector('img');
    lbImg.src = img.getAttribute('src');
    lbImg.alt = img.getAttribute('alt') || '';
    lbCaption.textContent = fig.getAttribute('data-caption') || '';
  }
  function openLightbox(i) {
    showSlide(i);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (lightbox) {
    document.addEventListener('click', function (e) {
      var fig = e.target.closest && e.target.closest('.ph');
      if (!fig) return;
      refreshFigs();
      openLightbox(figs.indexOf(fig));
    });
    $('lbClose').addEventListener('click', closeLightbox);
    $('lbPrev').addEventListener('click', function () { showSlide(lbIndex - 1); });
    $('lbNext').addEventListener('click', function () { showSlide(lbIndex + 1); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') showSlide(lbIndex - 1);
      else if (e.key === 'ArrowRight') showSlide(lbIndex + 1);
    });
  }
})();
```

- [ ] **Step 2: Verify JS validity** — Run: `node --check script.js` (expected: no output).

- [ ] **Step 3: Commit**

```bash
git add script.js
git commit -m "Rewrite script.js for catalog cards, gallery routing, lightbox"
```

## Task 6: Visual verification (Playwright)

**Files:** none (verification only)

- [ ] **Step 1: Create `/tmp/jr_cat.js`:**

```js
const { chromium } = require('/home/yurin/cq-scratch/node_modules/playwright');
const FILE = 'file:///home/yurin/projects/jianran/index.html';
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  await p.goto(FILE, { waitUntil: 'networkidle' });
  await p.locator('#catalog').scrollIntoViewIfNeeded();
  await p.waitForTimeout(300);
  await p.screenshot({ path: '/tmp/jr_cards.png' });
  const cardCount = await p.locator('#catCards .cat-card').count();
  await p.goto(FILE + '#cat=windows', { waitUntil: 'networkidle' });
  await p.locator('#catalog').scrollIntoViewIfNeeded();
  await p.waitForTimeout(300);
  await p.screenshot({ path: '/tmp/jr_gallery_windows.png' });
  const winTiles = await p.locator('#galleryGrid .ph').count();
  await p.goto(FILE + '#cat=tiles', { waitUntil: 'networkidle' });
  await p.locator('#catalog').scrollIntoViewIfNeeded();
  await p.waitForTimeout(200);
  await p.screenshot({ path: '/tmp/jr_gallery_tiles.png' });
  const emptyTxt = await p.locator('#galleryGrid .gallery-empty').count();
  await p.goto(FILE + '#cat=windows', { waitUntil: 'networkidle' });
  await p.locator('#galleryGrid .ph').first().click();
  await p.waitForTimeout(300);
  await p.screenshot({ path: '/tmp/jr_lightbox.png' });
  const lbOpen = await p.locator('#lightbox.open').count();
  await b.close();
  console.log(JSON.stringify({ cardCount, winTiles, emptyTxt, lbOpen }));
})();
```

- [ ] **Step 2: Run it** — Run: `node /tmp/jr_cat.js`
Expected: `{"cardCount":6,"winTiles":9,"emptyTxt":1,"lbOpen":1}`

- [ ] **Step 3: Read each screenshot** (`/tmp/jr_cards.png`, `/tmp/jr_gallery_windows.png`, `/tmp/jr_gallery_tiles.png`, `/tmp/jr_lightbox.png`) and confirm: 6 cards (Kitchen "18 photos" + Windows "9 photos" with covers; the other four "Coming soon"); windows gallery shows a grid of 9; tiles shows "Photos coming soon."; lightbox shows one enlarged image + caption.

- [ ] **Step 4: Mobile check** — change the viewport to `{ width: 390, height: 900 }` in `/tmp/jr_cat.js`, re-run, read `/tmp/jr_cards.png`, confirm cards collapse to one column. (Verification only; no commit.)

## Task 7: Phase-1 mirror + checkpoint

**Files:** none (sync only)

- [ ] **Step 1: Mirror the changed files into the LuckyWeb mirror**

```bash
cp index.html script.js styles.css /home/yurin/projects/luckyweb/LuckyWeb/JianRan/
mkdir -p /home/yurin/projects/luckyweb/LuckyWeb/JianRan/assets/js
cp assets/js/catalog-seed.js assets/js/catalog-admin.js /home/yurin/projects/luckyweb/LuckyWeb/JianRan/assets/js/
git -C /home/yurin/projects/luckyweb/LuckyWeb add JianRan
git -C /home/yurin/projects/luckyweb/LuckyWeb commit -q -m "Catalog restructure (phase 1)"
```

- [ ] **Step 2: STOP for review.** Phase 1 is shippable. Present the push commands (push is blocked here):
  - `git -C /home/yurin/projects/jianran push jrbm main` (live)
  - `git -C /home/yurin/projects/jianran push origin main`
  - `git -C /home/yurin/projects/luckyweb/LuckyWeb push origin main`

---

# PHASE 2 — Admin uploader

## Task 8: Admin page HTML

**Files:** Create `jradminjie123.html`

- [ ] **Step 1: Create the file**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex,nofollow">
  <title>Catalog admin</title>
  <style>
    :root { --line:#403a34; --soft:rgba(64,58,52,.2); --slate:#555; }
    * { box-sizing: border-box; }
    body { font-family: ui-sans-serif, system-ui, sans-serif; color:#222; margin:0; padding:24px; max-width:760px; }
    h1 { font-size:18px; } h2 { font-size:14px; text-transform:uppercase; letter-spacing:.08em; color:var(--slate); }
    input, select, button { font:inherit; padding:9px 11px; border:1px solid var(--soft); background:#fff; }
    button { cursor:pointer; }
    .status { margin:10px 0; min-height:1.2em; font-size:14px; }
    .status.err { color:#b3261e; } .status.ok { color:#1da851; }
    .row { display:flex; gap:10px; align-items:center; margin:10px 0; flex-wrap:wrap; }
    label { display:block; font-size:13px; margin:12px 0 4px; }
    [hidden] { display:none !important; }
    .tabs button { border-bottom:2px solid transparent; background:none; }
    .tabs button.on { border-bottom-color:var(--line); font-weight:600; }
    #preview canvas { max-width:200px; height:auto; border:1px solid var(--soft); margin-top:8px; }
    .prow { display:flex; gap:12px; align-items:center; padding:8px 0; border-bottom:1px solid var(--soft); }
    .prow.is-hidden { opacity:.5; }
    .pthumb { width:54px; height:54px; object-fit:cover; border:1px solid var(--soft); }
    .pmeta { flex:1; } .pn { font-size:14px; } .pc { font-size:12px; color:var(--slate); }
    .badge { font-size:11px; color:#b3261e; } .rowbtn { font-size:13px; }
  </style>
</head>
<body>
  <h1>Catalog admin</h1>

  <form id="gate-form">
    <div id="gate">
      <label for="pass">Passphrase</label>
      <div class="row"><input type="password" id="pass" autocomplete="off"><button type="submit">Unlock</button></div>
      <div class="status err" id="gate-err"></div>
    </div>
  </form>

  <div id="app" hidden>
    <div class="status ok" id="unlock-note" hidden>Unlocked.</div>

    <div id="token-setup" hidden>
      <h2>GitHub token</h2>
      <p style="font-size:13px;color:var(--slate)">Paste a token with contents read/write on <code>JianRanBuildingMaterials</code>. Stored only in this browser.</p>
      <form id="token-form">
        <div class="row"><input type="password" id="token-input" placeholder="ghp_…" autocomplete="off" style="flex:1"><button type="submit">Save</button></div>
      </form>
      <div class="status err" id="token-status"></div>
    </div>

    <div id="tools" hidden>
      <div class="status" id="token-badge"></div>
      <div class="tabs row">
        <button type="button" id="tab-btn-add" class="on">Add</button>
        <button type="button" id="tab-btn-manage">Manage</button>
      </div>

      <div id="tab-add">
        <form id="add-form">
          <label for="f-category">Category</label>
          <select id="f-category"></select>
          <label for="f-photo">Photo</label>
          <input type="file" id="f-photo" accept="image/*">
          <div id="preview"></div>
          <label for="f-caption">Caption (optional)</label>
          <input type="text" id="f-caption" placeholder="e.g. Matte black sliding door">
          <div class="row"><button type="submit" id="add-submit">Publish</button></div>
        </form>
        <div class="status" id="add-status"></div>
      </div>

      <div id="tab-manage" hidden>
        <div class="row"><input type="text" id="search" placeholder="Search caption, category…" style="flex:1"></div>
        <div class="status" id="list-count"></div>
        <div id="prod-list"></div>
        <div id="deleted-wrap" hidden>
          <h2>Deleted entries <span id="deleted-count"></span></h2>
          <div id="deleted-list"></div>
        </div>
        <div class="status" id="manage-status"></div>
      </div>
    </div>
  </div>

  <script src="assets/js/catalog-seed.js"></script>
  <script src="assets/js/catalog-admin.js"></script>
  <script src="assets/js/jradminjie123.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify required IDs are present**

Run: `for id in gate-form pass gate-err app token-setup token-form token-input token-status token-badge tools tab-btn-add tab-btn-manage tab-add tab-manage f-category f-photo preview f-caption add-form add-submit add-status search list-count prod-list deleted-wrap deleted-count deleted-list manage-status; do grep -q "id=\"$id\"" jradminjie123.html || echo "MISSING $id"; done; echo done`
Expected: prints only `done`.

- [ ] **Step 3: Commit**

```bash
git add jradminjie123.html
git commit -m "Add admin page markup"
```

## Task 9: Admin JS — scaffold copied verbatim from flooring

**Files:** Create `assets/js/jradminjie123.js`

- [ ] **Step 1: Copy these blocks VERBATIM from `/home/yurin/flooring-site/assets/js/jiadminjie123.js`, in order, inside one `(function(){ 'use strict'; … })();` IIFE:**
  - `sha256hex` (flooring ~lines 43–87) — exact.
  - `$`, `show`, `escHtml`, `utf8ToB64`, `b64ToUtf8` (~30–34).
  - `sanitize`, `slugify` (~89–90).
  - `authHeaders`, `ghGet`, `ghPut`, `putFile` (~106–131).
  - `withAdmin` (~165–178). (`refreshAdmin` is given in Task 10 Step 2 — use that version, not the flooring one.)
  - `fileToImage` (~181–188).
  - The gate UI `unlock` + the `gate-form` submit handler (~230–249), replacing any `t('…')` with the plain English literal and `errPrefix()` with `'Error: '`.
  - The token UI `renderTokenBadge`, `clearToken`, `enterTools`, `token-form` submit handler (~252–281), same i18n stripping; `enterTools` must call `fillSelects()` then `refreshAdmin().then(renderList)`.
  - The tab handlers + `switchTab` (~284–292).
  - `setStatus` (~390–393).
  - boot line: `if (sessionStorage.getItem('adm_ok') === '1') unlock();` (keep LAST, after all functions/handlers are defined).

  **Drop entirely:** the i18n block `L`/`t`/`errPrefix`/`COLL_EN` (~36–40); `applyPlaceholders`/`onLang`/`langchange` (~395–408); `COLLECTIONS`/`FAMILIES`/`SPECIES` (~19–21); `makeGrid`/`makeDetail`/`canvasToB64` (replaced in Task 10). Wherever a dropped `t('X')` wrapped a string, use `'X'`.

- [ ] **Step 2: Add config + state at the very top of the IIFE:**

```js
  var REPO = 'lancelot74/JianRanBuildingMaterials';
  var BRANCH = 'main';
  var REPO_URL = 'https://api.github.com/repos/' + REPO;
  var API = REPO_URL + '/contents/';
  var ADMIN_PATH = 'assets/js/catalog-admin.js';
  var CATALOG_DIR = 'assets/catalog/';
  var PASS_HASH = '6c0065fdeced3b414a690eb02aa035ae7e8dbc99e1b9867dd5d882a3817ba1a6';
  var CATEGORIES = [
    { id: 'kitchen',  label: 'Kitchen & Cabinetry' },
    { id: 'windows',  label: 'Windows & Doors' },
    { id: 'tiles',    label: 'Tiles' },
    { id: 'stone',    label: 'Stone & Marble' },
    { id: 'flooring', label: 'Flooring' },
    { id: 'lighting', label: 'Lighting' }
  ];

  var token = '';
  var adminData = { adds: [], hidden: [] };
  var adminSha = null;
  var uploadCanvas = null;
```

- [ ] **Step 3: Verify** — Run: `node --check assets/js/jradminjie123.js`. Expected: no output. (Fix copied blocks if it errors. `renderList`/`fillSelects` are referenced but defined in Task 10 — that's fine for `node --check`, which only checks syntax, not references.)

- [ ] **Step 4: Commit**

```bash
git add assets/js/jradminjie123.js
git commit -m "Add admin JS scaffold (gate, token, GitHub API)"
```

## Task 10: Admin JS — catalog-specific logic

**Files:** Modify `assets/js/jradminjie123.js`

- [ ] **Step 1: Add data + serialization helpers (after the GitHub API block):**

```js
  function seedItems() { return window.__CATALOG_SEED || []; }
  function displayItems() { return seedItems().concat(adminData.adds); }
  function isHidden(slug) { return adminData.hidden.indexOf(slug) !== -1; }
  function uniqueSlug(base) {
    var taken = {};
    displayItems().forEach(function (p) { taken[p.slug] = true; });
    if (!base) base = 'item';
    var s = base, i = 2;
    while (taken[s]) { s = base + '-' + i; i++; }
    return s;
  }
  function catLabel(id) {
    for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].id === id) return CATEGORIES[i].label;
    return id;
  }
  function serializeAdmin() {
    var json = JSON.stringify({ adds: adminData.adds, hidden: adminData.hidden });
    return [
      '/* Catalog admin data — managed by jradminjie123.html. Do NOT hand-edit. */',
      'window.__CATALOG_ADMIN = ' + json + ';',
      ''
    ].join('\n');
  }
  function parseAdmin(text) {
    var m = text.match(/__CATALOG_ADMIN\s*=\s*(\{[\s\S]*?\});/);
    if (!m) return { adds: [], hidden: [] };
    try { var d = JSON.parse(m[1]); return { adds: d.adds || [], hidden: d.hidden || [] }; }
    catch (e) { return { adds: [], hidden: [] }; }
  }
```

- [ ] **Step 2: Add `refreshAdmin` (this version, reading the `__CATALOG_ADMIN` fallback):**

```js
  function refreshAdmin() {
    return ghGet(ADMIN_PATH).then(function (cur) {
      if (cur) { adminSha = cur.sha; adminData = parseAdmin(b64ToUtf8(cur.content)); }
      else {
        adminSha = null;
        var d = window.__CATALOG_ADMIN || {};
        adminData = { adds: (d.adds || []).slice(), hidden: (d.hidden || []).slice() };
      }
    });
  }
```

- [ ] **Step 3: Add image resize + operations:**

```js
  function makeImage(img) { // longest side <= 1500
    var MAX = 1500, scale = Math.min(1, MAX / Math.max(img.width, img.height));
    var c = document.createElement('canvas');
    c.width = Math.round(img.width * scale);
    c.height = Math.round(img.height * scale);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    return c;
  }
  function doAdd(item, b64) {
    return putFile(CATALOG_DIR + item.category + '/' + item.slug + '.jpg', b64, 'Add image ' + item.slug + ' (' + item.category + ')')
      .then(function () {
        return withAdmin(function (d) {
          if (!d.adds.some(function (p) { return p.slug === item.slug; })) d.adds.push(item);
          var hi = d.hidden.indexOf(item.slug); if (hi > -1) d.hidden.splice(hi, 1);
        }, 'Add catalog item ' + item.slug);
      });
  }
  function doDelete(slug) { return withAdmin(function (d) { if (d.hidden.indexOf(slug) === -1) d.hidden.push(slug); }, 'Hide item ' + slug); }
  function doRestore(slug) { return withAdmin(function (d) { var i = d.hidden.indexOf(slug); if (i > -1) d.hidden.splice(i, 1); }, 'Restore item ' + slug); }
```

- [ ] **Step 4: Add the Add-tab UI:**

```js
  function fillSelects() {
    $('f-category').innerHTML = CATEGORIES.map(function (c) {
      return '<option value="' + c.id + '">' + escHtml(c.label) + '</option>';
    }).join('');
  }
  $('f-photo').addEventListener('change', function () {
    var file = this.files && this.files[0];
    if (!file) return;
    fileToImage(file).then(function (img) {
      uploadCanvas = makeImage(img);
      var pv = $('preview'); pv.innerHTML = ''; pv.appendChild(uploadCanvas);
      URL.revokeObjectURL(img.src);
      setStatus('add-status', '');
    }).catch(function () { setStatus('add-status', 'Could not read that image.', true); });
  });
  $('add-form').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!uploadCanvas) { setStatus('add-status', 'Choose a photo first.', true); return; }
    var category = $('f-category').value;
    var caption = sanitize($('f-caption').value);
    var slug = uniqueSlug(slugify(caption) || category);
    var item = { slug: slug, category: category, src: CATALOG_DIR + category + '/' + slug + '.jpg' };
    if (caption) item.caption = caption;
    setStatus('add-status', 'Publishing… this takes a few seconds.');
    $('add-submit').disabled = true;
    doAdd(item, uploadCanvas.toDataURL('image/jpeg', 0.82).split(',')[1]).then(function () {
      setStatus('add-status', '✓ Added to ' + catLabel(category) + ' (slug: ' + slug + '). Live in about a minute.', false, true);
      $('add-form').reset(); $('preview').innerHTML = ''; uploadCanvas = null;
    }).catch(function (err) {
      setStatus('add-status', 'Error: ' + err.message, true);
    }).then(function () { $('add-submit').disabled = false; });
  });
```

- [ ] **Step 5: Add the Manage-tab UI:**

```js
  $('search').addEventListener('input', renderList);
  function buildRow(p) {
    var hidden = isHidden(p.slug);
    var row = document.createElement('div');
    row.className = 'prow' + (hidden ? ' is-hidden' : '');
    row.innerHTML =
      '<img class="pthumb" loading="lazy" src="' + escHtml(p.src) + '" alt="" onerror="this.style.visibility=\'hidden\'">' +
      '<div class="pmeta"><div class="pn">' + escHtml(p.caption || '(no caption)') + '</div>' +
      '<div class="pc">' + escHtml(catLabel(p.category)) + '</div></div>' +
      (hidden ? '<span class="badge">hidden</span>' : '') +
      '<button class="rowbtn ' + (hidden ? 'restore' : 'del') + '" data-slug="' + escHtml(p.slug) + '">' + (hidden ? 'Restore' : 'Delete') + '</button>';
    return row;
  }
  function renderList() {
    var q = $('search').value.toLowerCase();
    var items = displayItems().filter(function (p) {
      if (!q) return true;
      return ((p.caption || '') + ' ' + p.category + ' ' + p.slug).toLowerCase().indexOf(q) > -1;
    });
    var active = items.filter(function (p) { return !isHidden(p.slug); });
    var deleted = items.filter(function (p) { return isHidden(p.slug); });
    $('list-count').textContent = active.length + (active.length === 1 ? ' image' : ' images');
    var wrap = $('prod-list'); wrap.innerHTML = '';
    active.forEach(function (p) { wrap.appendChild(buildRow(p)); });
    var dwrap = $('deleted-list'); dwrap.innerHTML = '';
    deleted.forEach(function (p) { dwrap.appendChild(buildRow(p)); });
    show($('deleted-wrap'), deleted.length > 0);
    $('deleted-count').textContent = deleted.length ? ('(' + deleted.length + ')') : '';
  }
  function onRowClick(e) {
    var b = e.target.closest('.rowbtn'); if (!b) return;
    var slug = b.dataset.slug, restore = b.classList.contains('restore');
    if (!restore && !confirm('Hide “' + slug + '” from the catalogue?')) return;
    b.disabled = true; b.textContent = '…';
    (restore ? doRestore(slug) : doDelete(slug)).then(function () {
      setStatus('manage-status', '✓ Saved. Live in about a minute.', false, true);
      renderList();
    }).catch(function (err) {
      setStatus('manage-status', 'Error: ' + err.message, true);
      b.disabled = false; b.textContent = restore ? 'Restore' : 'Delete';
    });
  }
  $('prod-list').addEventListener('click', onRowClick);
  $('deleted-list').addEventListener('click', onRowClick);
```

- [ ] **Step 6: Verify** — Run: `node --check assets/js/jradminjie123.js`. Expected: no output.

- [ ] **Step 7: Commit**

```bash
git add assets/js/jradminjie123.js
git commit -m "Add admin catalog logic (add/delete/restore by category)"
```

## Task 11: Admin verification (no live token)

**Files:** none (verification only)

- [ ] **Step 1: Create `/tmp/jr_admin.js`:**

```js
const { chromium } = require('/home/yurin/cq-scratch/node_modules/playwright');
const FILE = 'file:///home/yurin/projects/jianran/jradminjie123.html';
const PASS = process.env.ADMIN_PASS || '';
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext();
  await ctx.addInitScript(() => {
    localStorage.setItem('gh_token', 'stub');
    const real = window.fetch;
    window.fetch = (u, o) => {
      const s = String(u);
      if (s.includes('api.github.com/repos/lancelot74/JianRanBuildingMaterials') && !s.includes('/contents/'))
        return Promise.resolve(new Response('{}', { status: 200 }));
      if (s.includes('/contents/assets/js/catalog-admin.js'))
        return Promise.resolve(new Response('', { status: 404 }));
      return real(u, o);
    };
  });
  const p = await ctx.newPage({ viewport: { width: 760, height: 1000 } });
  await p.goto(FILE, { waitUntil: 'networkidle' });
  await p.screenshot({ path: '/tmp/jr_admin_gate.png' });
  if (PASS) {
    await p.fill('#pass', PASS);
    await p.click('#gate-form button[type=submit]');
    await p.waitForTimeout(600);
    await p.screenshot({ path: '/tmp/jr_admin_tools.png' });
  }
  const cats = await p.locator('#f-category option').count();
  const gateErr = (await p.locator('#gate-err').textContent()).trim();
  await b.close();
  console.log(JSON.stringify({ cats, gateErr, passTried: !!PASS }));
})();
```

- [ ] **Step 2: Run with the passphrase** (ask the user for the flooring passphrase; pass it inline so it is never written to disk):

Run: `ADMIN_PASS='<the-passphrase>' node /tmp/jr_admin.js`
Expected: `{"cats":6,"gateErr":"","passTried":true}`. If the passphrase is unavailable, run without it and confirm `/tmp/jr_admin_gate.png` shows the gate.

- [ ] **Step 3: Read `/tmp/jr_admin_gate.png` and `/tmp/jr_admin_tools.png`** — confirm the gate renders, and after unlock the Add tab shows Category (6 options) / Photo / Caption / Publish.

- [ ] **Step 4: Confirm the data file is tracked, not ignored** — Run: `git check-ignore -v assets/js/catalog-admin.js || echo "tracked (ok)"`. Expected: `tracked (ok)`.

## Task 12: Phase-2 mirror + checkpoint

**Files:** none (sync only)

- [ ] **Step 1: Mirror the new files into the LuckyWeb mirror**

```bash
cp jradminjie123.html /home/yurin/projects/luckyweb/LuckyWeb/JianRan/
cp assets/js/jradminjie123.js /home/yurin/projects/luckyweb/LuckyWeb/JianRan/assets/js/
git -C /home/yurin/projects/luckyweb/LuckyWeb add JianRan
git -C /home/yurin/projects/luckyweb/LuckyWeb commit -q -m "Add catalog admin page (phase 2)"
```

- [ ] **Step 2: STOP for review.** Present the three push commands (same remotes as Task 7). After the user pushes `jrbm` and Vercel redeploys, the owner opens `https://chinabuildingmaterials.store/jradminjie123.html`, enters the passphrase, pastes a repo-scoped GitHub PAT, and adds/removes images. First upload to an empty category (e.g. Tiles) flips that card from "Coming soon" to a cover + count within ~1 minute.

---

## Self-review notes

- **Spec coverage:** category model (Tasks 1,5,9,10) · seed of 27 images (Task 1) · admin overlay + display formula (Tasks 2,5,10) · card grid + gallery + hash routing + empty state (Tasks 4,5) · lightbox reuse (Task 5) · admin add/delete/restore by category, image resize, Contents API, same PASS_HASH, jrbm target (Tasks 8–10) · migration/removal of old sections + nav (Task 4) · responsive (Task 3) · verification (Tasks 6,11) · deployment/mirror (Tasks 7,12). No gaps found.
- **Type consistency:** item shape `{slug, category, src, caption?}` is identical across seed (Task 1), public render (Task 5), and admin add (Task 10). `__CATALOG_ADMIN = {adds, hidden}` matches between Task 2, the public reader (Task 5), and `serializeAdmin`/`parseAdmin` (Task 10). Category ids/labels identical in Tasks 5 and 9. `refreshAdmin` is defined once (Task 10 Step 2), not copied from flooring (Task 9 Step 1 note).
- **Open input for the executor:** the flooring passphrase plaintext (Task 11 Step 2) — ask the user; never hard-code it.
```
