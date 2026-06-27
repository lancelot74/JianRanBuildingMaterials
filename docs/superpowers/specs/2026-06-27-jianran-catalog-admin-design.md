# JianRan — Category Catalog + Admin Image Uploader

**Date:** 2026-06-27
**Type:** Restructure of the live site (https://chinabuildingmaterials.store)
**Predecessor specs:** `2026-06-16-jianran-website-design.md` (style/palette), `2026-06-18-jianran-designs-catalog-update.md` (designs catalog)
**Reference pattern:** `/home/yurin/flooring-site/assets/js/jiadminjie123.js` (the proven GitHub-token admin on the JijieFlooring site)

## Background

The client wants the site to read as a **one-stop shop** for building materials (reference he
sent: `doublekone-stop-shop.cn` / "George Group — One-stop Solution", a grid of ~9 product
category cards each full of photos). His complaint about the current site: it lists category
**names** (in the Sourcing section) with **no photos inside them**, and the actual photos live in
disconnected "Designs" and "Windows" sections — "many categories, no content … looks like a mess."

His instructions: put the window photos under a Windows & Doors category, put the cabinet photos
under a Kitchen & Built-in category, and for categories we have no photos for yet, **make empty
placeholders we can upload into later**. He also wants an **admin tool to add / remove / replace
images** himself — reusing the pattern already built for the flooring site.

**Photo reality:** the only supplier source material is two kitchen-cabinet PDFs (厨柜, NA + SE
Asia). So real photos exist only for **Kitchen & Cabinetry** (18 renders already cropped, more
pages available) and **Windows & Doors** (9 photos). Tiles / Stone / Flooring / Lighting have no
images and will launch as empty, admin-fillable placeholders.

## Decisions (locked with the owner)

1. **Category set — leaner 6:** `kitchen` "Kitchen & Cabinetry" (filled), `windows` "Windows &
   Doors" (filled), `tiles` "Tiles", `stone` "Stone & Marble", `flooring` "Flooring",
   `lighting` "Lighting" (last four empty placeholders).
2. **Layout — cards → gallery:** a grid of 6 category cards; clicking one opens that category's
   gallery. Implemented as a **single page with hash routing** (`#cat=<id>`), not separate HTML
   files per category.
3. **Admin target repo:** `lancelot74/JianRanBuildingMaterials` (jrbm — the live Vercel source),
   which becomes the single source of truth. Pull jrbm before any manual edits.
4. **Passphrase:** reuse the flooring admin's SHA-256 hash so the existing passphrase unlocks this
   page too (changeable later).

Non-goals: no backend server; no real authentication (passphrase = obscurity, token = the actual
control); no per-image metadata beyond category + optional caption; WeChat stays a placeholder;
no build step.

## 1. Category model

A fixed list defined once in the public script and mirrored in the admin script:

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

## 2. Data model & files (mirrors flooring's seed + admin overlay)

- **`assets/js/catalog-seed.js`** → `window.__CATALOG_SEED = [ {slug, category, src, caption} … ]`.
  Pre-seeded with the existing 27 images, referencing their current paths (no re-upload):
  - 18 kitchen items: `assets/designs/design-na-01.jpg … design-na-06.jpg`,
    `assets/designs/design-sea-01.jpg … design-sea-12.jpg`, `category:'kitchen'`, captions copied
    from the current `data-caption` values.
  - 9 windows items: `assets/windows/window-01.jpg … window-09.jpg`, `category:'windows'`,
    captions copied from current `data-caption` values.
- **`assets/js/catalog-admin.js`** → `window.__CATALOG_ADMIN = { adds: [], hidden: [] }`.
  Admin-owned; header comment says "do NOT hand-edit." Same role as flooring's `products-admin.js`.
- **Display set** = `__CATALOG_SEED.concat(__CATALOG_ADMIN.adds)` filtered to exclude any item
  whose `slug` is in `__CATALOG_ADMIN.hidden`. Same formula as flooring (`genProducts()` + adds − hidden).
- **New uploads** stored at `assets/catalog/<category>/<slug>.jpg`. (Seed items keep their existing
  `assets/designs/…` / `assets/windows/…` paths; each item carries its own explicit `src`, so mixed
  locations are fine.)

Item shape: `{ slug: string, category: <one of the 6 ids>, src: string, caption?: string }`.

## 3. Public UI (`index.html` + `script.js`)

- **Catalog section** replaces the current Designs, Windows, and Sourcing-materials blocks. One
  nav link **Catalog** (anchors to the card grid) replaces the Designs/Windows links.
- **Card grid:** 6 category cards. A filled card shows a cover (the category's first visible
  item's `src`), the label, and a count ("18 photos"). An empty card shows a muted placeholder
  tile, the label, and "Coming soon" — still clickable.
- **Gallery view:** selecting a card sets `location.hash = '#cat=<id>'` and renders that category's
  heading + a photo grid (reuse the existing `.grid-designs` styling) wired into the existing
  lightbox. Empty category → "Photos coming soon." A "← All categories" control clears the hash
  back to the card grid; browser Back/Forward work because state lives in the hash.
- **Lightbox:** reuse the current component; extend the figures selector so gallery tiles
  (rendered dynamically) are included, or re-bind after each gallery render. Caption from item
  `caption`.
- **Responsive:** cards 3-col → 2 → 1 at the existing 1080/900/560 breakpoints; gallery reuses
  `.grid-designs` responsive rules.
- **Static-load behavior:** on first paint, read the hash — deep links like `…/#cat=tiles` open
  straight into that gallery.

## 4. Admin tool (`jradminjie123.html` + `assets/js/jradminjie123.js`)

Adapted near-verbatim from `jiadminjie123.js`, with these changes:

- **Strip the i18n layer** (`window.I18N`, `t()`, `L()`, bilingual strings) — this site is
  English-only. Replace with plain English strings.
- **Replace product metadata** (collection/family/species/code/size) with **category + caption**.
  The add form is: a **category `<select>`** (the 6 categories), a **photo file input**, and an
  optional **caption** text field.
- **Image processing:** one canvas resize — longest side ≤ 1500px, `toDataURL('image/jpeg', 0.82)`
  (drop flooring's separate 500×500 grid + 1000 detail; the catalog uses a single image per tile).
- **Slug:** `slugify(caption || category)` + uniqueness suffix against the current display set
  (same `uniqueSlug` approach).

Unchanged from flooring (kept verbatim where possible):
- Self-contained `sha256hex` passphrase gate; **same `PASS_HASH`** as flooring.
- GitHub PAT pasted once, stored in `localStorage` (`gh_token`), validated against the repo.
- Contents API helpers (`ghGet`/`ghPut`/`putFile`), `withAdmin` refresh→mutate→commit with
  409/422 conflict-retry.
- Add tab + Manage tab (search/filter, active list, reversible "Deleted entries" with Restore).

Admin config:
```
REPO = 'lancelot74/JianRanBuildingMaterials'
BRANCH = 'main'
ADMIN_PATH = 'assets/js/catalog-admin.js'
CATALOG_DIR = 'assets/catalog/'   // upload path = CATALOG_DIR + category + '/' + slug + '.jpg'
```

**Operations:**
- **Add:** resize photo → commit `assets/catalog/<cat>/<slug>.jpg` → `withAdmin` push the item into
  `adds` (and drop slug from `hidden` if present). Commit message `Add image <slug> (<category>)`.
- **Delete:** `withAdmin` push slug to `hidden` (reversible; image kept). Works for seed + added.
- **Restore:** remove slug from `hidden`.
- Manage list filterable; rows show thumb + caption + category badge + Delete/Restore.

**Token scope:** a GitHub PAT with contents read/write on `JianRanBuildingMaterials`. (The flooring
token won't work unless its scope includes this repo.)

## 5. Migration / removal

- Remove from `index.html`: the `#designs` section, the `#windows` section, and the Sourcing
  section's materials list (the catalog replaces all three). Remove their nav links; add **Catalog**.
- Keep: hero, the statement band (one-stop-shop / factory-direct / no-middleman), Process, Why,
  About, Contact, footer, and the lightbox markup.
- The 27 existing images are **not deleted** — they become seed items at their current paths. Hero
  and hero-thumb images are untouched.
- Load order in `index.html`: `catalog-seed.js`, then `catalog-admin.js`, then `script.js`.

## 6. Security / honesty

- Passphrase hash is **obscurity only**; the real control is the GitHub token, which is never
  committed and lives only in the admin's browser `localStorage`. Anyone holding a repo-scoped PAT
  can write — keep it private. The admin page is unlisted, not access-controlled.
- Empty categories are labeled "Coming soon" — no fabricated products or counts.

## Success criteria

- [ ] Public site shows a 6-card category grid; Kitchen (18) and Windows (9) cards show covers +
      counts; Tiles/Stone/Flooring/Lighting show "Coming soon."
- [ ] Clicking a filled card opens its gallery with all photos; lightbox opens/navigates; "← All
      categories" and browser Back return to the grid; `#cat=<id>` deep-links work.
- [ ] Empty category opens a gallery with "Photos coming soon."
- [ ] Old Designs/Windows/Sourcing-list sections and their nav links are gone; **Catalog** link present.
- [ ] `node --check script.js` and `node --check assets/js/jradminjie123.js` pass; seed/admin JS
      files are valid (`node --check`).
- [ ] Admin page: passphrase gate works (same passphrase as flooring); after a (dummy) token the
      tools render; category `<select>` lists all 6; add-form builds a correct Contents API payload
      (image path `assets/catalog/<cat>/<slug>.jpg`, updated `catalog-admin.js`) — verified by
      inspection without a live token.
- [ ] Responsive: grid + gallery collapse cleanly at 1080 / 900 / 560px.
- [ ] No regressions to hero, statement, Process, Why, About, Contact.

## Verification plan

- `node --check` on `script.js`, `catalog-seed.js`, `catalog-admin.js`, `jradminjie123.js`.
- Playwright (desktop 1440 + mobile 390) screenshots: card grid; kitchen gallery; windows gallery;
  an empty gallery (tiles); lightbox open; deep-link `#cat=windows`; Back-button returns to grid.
- Admin page loaded locally: gate accepts the passphrase, dropdown lists 6 categories, an image
  picked + previewed resizes; intercept/inspect the would-be commit payloads (no real PAT used).

## Deployment

Update `/home/yurin/projects/jianran` (remotes `jrbm` + `origin`) and the LuckyWeb mirror; commit;
hand `git push` to the user (push is blocked in this environment). `jrbm` → Vercel redeploys the
live site. From here on, **jrbm is the source of truth** for admin-managed content.
