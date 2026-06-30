# JianRan Catalog — Product Detail View (Phase B)

**Status:** design / approved direction. Implementation recommended in a fresh session (this one is long/costly).

**Goal:** Improve catalog browsing *flow* (LEBK-inspired product pages): clicking a catalog photo opens a linkable **detail view** showing the image large with its caption, category, and region — instead of only the lightbox.

**Decisions (locked by owner):**
- Detail content = **image, caption (as title), category, region**. No description, specs, or colour swatches.
- **Keep the lightbox** for quick zoom (reachable from the detail image).

**Scope:** Front-end only — `index.html` (one new section), `script.js` (routing + render), `styles.css` (detail layout). **No data-model change** (reuses existing `{ slug, category, src, caption, region? }`). **No admin change.**

---

## Architecture

**Markup (`index.html`, inside `#catalog`):** add a hidden `#catDetail` section as a sibling of `#catCards` and `#catGallery`:
- a back link (`&larr; Back to <category>`),
- a large image,
- a title (the caption),
- a meta line (category label · region, region shown only when present).

**Routing (`script.js` `route()`):** add an `#item=<slug>` route. Precedence:
1. `#item=<slug>` → detail view (look the item up across `catalogItems()` by slug; if not found, fall back to cards).
2. `#cat=<id>` → gallery (unchanged).
3. else → cards (unchanged).
The hash regex for item slugs must allow the hyphen (slugs like `window-01`, and category-derived slugs) → `^#item=([a-z0-9-]+)`.

**Gallery tiles → detail:** gallery `.ph` figures become links to `#item=<slug>` (anchor or click handler setting the hash). A tile click now navigates to the detail view.

**Lightbox kept:** the detail view's large image is rendered as a `.ph` figure, so the existing global lightbox click-handler still opens it as a zoom overlay. (Consequence: lightbox prev/next cycles just the current image rather than the whole gallery — acceptable for "keep it simple"; the gallery-wide stepping is replaced by the detail flow.)

**Detail render:** `renderDetail(slug)` finds the item, sets the back link's href to `#cat=<category>` and text to the category label, fills the image (`src`, `alt=caption`), the title (caption or a fallback), and the meta (category label, and ` · <region>` when the item has one). Shows `#catDetail`, hides `#catCards` and `#catGallery` (using plain `[hidden]` hiding; note `#catCards` already needs the `.cat-grid[hidden]` rule, which exists).

## Styling (`styles.css`)

`.cat-detail` — image and info column side-by-side on desktop, stacked on mobile; generous whitespace; existing linen/walnut palette with a restrained natural accent (eyebrow labels for category/region). No faux spec tables. Reuse `.gallery-back`, `.eyebrow`/`heading` patterns.

## Verification (Playwright + node)

- `node --check script.js`.
- Tile click navigates to `#item=<slug>`; detail shows the right image + caption + category (+ region when present).
- Back link returns to the category gallery.
- Clicking the detail image opens the lightbox.
- Mobile (390px) stacks image over info.
- Existing card/gallery/empty-state behaviour unchanged.

## Deploy

Mirror changed files to `LuckyWeb/JianRan/`; owner pushes `jrbm`/`origin`.

## Out of scope

- Descriptions, specs, colour swatches; any data-model or admin change.
- Photos for Decking / Wall Cladding (separate effort — they remain "Coming soon").
- Region sub-group rendering in the gallery (deferred until region-tagged photos exist).
