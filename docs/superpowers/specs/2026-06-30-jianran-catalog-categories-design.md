# JianRan Catalog — New Categories, Region Sub-groups & PDF Photo Import (Phase A)

**Status:** design / approved-to-proceed (user said "loop until finished" with proposed defaults).

**Goal:** Add **Decking** and **Wall Cladding** categories, introduce optional **region/market sub-grouping** inside category galleries, and bulk-import curated photos from three source PDFs into the catalog.

**Scope:** Content + data-model + minimal render changes. The broader **UI/flow redesign inspired by the PDFs' design language is Phase B** — a separate spec, written after viewing the PDFs.

**Source PDFs** (`/mnt/c/Users/garhy/Downloads/`):
- `LEBK CATALOG-09.22.pdf` — product catalog (decking, wall cladding, likely more).
- `2025-各国家门窗系统安装方式介绍.pdf` — windows/doors **by country** (region source + photos).
- `2025-澳大利亚门窗跟国内门窗区别.pdf` — AU vs domestic windows/doors (photos + reference).
All three confirmed by the owner to contain photos to place.

---

## 1. Categories (8)

Extend the `CATEGORIES` array in **both** `script.js` (public cards + gallery) and `assets/js/jradminjie123.js` (admin Add dropdown) to, in order:

```js
{ id: 'kitchen',      label: 'Kitchen & Cabinetry' },
{ id: 'windows',      label: 'Windows & Doors' },
{ id: 'decking',      label: 'Decking' },
{ id: 'wall-cladding',label: 'Wall Cladding' },
{ id: 'tiles',        label: 'Tiles' },
{ id: 'stone',        label: 'Stone & Marble' },
{ id: 'flooring',     label: 'Flooring' },
{ id: 'lighting',     label: 'Lighting' }
```

Homepage then renders 8 cards; admin Add offers all 8. The hash route regex `^#cat=([a-z]+)` must be widened to allow the hyphen in `wall-cladding` → `^#cat=([a-z-]+)`.

## 2. Data model — optional `region`

Item shape becomes `{ slug, category, src, caption?, region? }`. `region` is an optional market label string (e.g. `"North America"`, `"SE Asia & Australia"`, or a country). Seed items and admin `adds` may both carry it. The existing 27 region-less items remain valid.

## 3. Gallery rendering — region sub-groups

In `script.js` `renderGallery(id)`: if any item in the category has a `region`, render the gallery as labelled sub-groups — an eyebrow-style heading per region followed by that region's `.ph` grid. Region-less items render in a single leading unlabelled grid. When no item in the category has a region, behaviour is unchanged (one flat grid). The lightbox already operates on all rendered `.ph` tiles, so it keeps working across sub-groups.

Initial region vocabulary: reuse `"North America"` and `"SE Asia & Australia"`; windows may add country labels. Assignment is best-effort by source-PDF / PDF section.

## 4. Photo import — extract-all, curate-later

**Tooling:** a local PDF image-extraction script using **PyMuPDF (`fitz`)** — no sudo, self-contained — run from `/tmp`, reading the three PDFs.

**Pipeline:**
1. Extract embedded raster images from all 3 PDFs (record source PDF + page).
2. **Auto-filter junk** before anything reaches the catalog: drop images smaller than a min dimension (~400px on the short side), near-duplicates (byte/perceptual hash), and extreme aspect ratios (banners/diagrams). This keeps the live site clean despite "extract all".
3. Resize longest side ≤ 1500px, re-encode JPEG q≈0.82 (match the admin's `makeImage`), save to `assets/catalog/<category>/<slug>.jpg`.
4. Append entries to `assets/js/catalog-seed.js` with best-effort `category` (by source PDF), `region` (by PDF section/country where detectable), generated `slug`, and a minimal `caption`.
5. **Curate:** owner hides remaining unwanted photos via the admin **Manage** tab.

**Known limitation:** the admin can only *hide* items, not re-edit caption/category. Keepers retain the metadata assigned at import; caption polishing is a `catalog-seed.js` edit, not an admin action.

## 5. Deploy

Stage + commit photos and data locally in `jianran`; mirror changed files to `LuckyWeb/JianRan/`; the owner pushes `jrbm`/`origin` (live). **Publishing to live is the human checkpoint** — review the imported set before pushing.

## 6. Verification

- `node --check script.js assets/js/jradminjie123.js`.
- Seed parses; `node` count of items per category.
- Playwright (desktop + mobile): 8 cards render; a category with regions shows labelled sub-groups; a `#cat=wall-cladding` route resolves; lightbox opens across sub-groups; counts match.

## Out of scope (this phase)

- Phase B: UI/flow redesign from the PDF design language.
- Admin metadata editing (only hide/restore exists).
