# JianRan — Name Fix, Furniture Messaging, Hero + Designs Catalog

**Date:** 2026-06-18
**Type:** Enhancement to the existing live site (https://lancelot74.github.io/LuckyWebTemplate/)
**Predecessor spec:** `2026-06-16-jianran-website-design.md` (source of truth for style, palette, structure)

## Background

The JianRan site is built and live. The owner supplied two supplier catalog PDFs of
high-end kitchen cabinetry renders and asked to (1) correct the company's Chinese name,
(2) make the "furniture + the materials to build it" offer explicit, and (3) showcase the
cabinet designs — with the supplier's branding removed.

Source PDFs (in `/mnt/c/Users/garhy/Downloads/`):
- `厨柜（适合北美市场）.pdf` — 14 pages, classic/transitional/shaker cabinetry for the **North American** market.
- `厨柜（适合东南+澳洲市场）.pdf` — 24 pages, contemporary/handleless/modern cabinetry for the **SE Asia + Australia** market.

Both are branded **"Musk Casa"** (muskcasa.com, +86 15766073365): a red "M" logo + "MUSK CASA VI DESIGN"
in the top margin of every page, a tagline in the bottom margin, and a contact block on the cover.

## Goals

1. Correct the Chinese company name to **简然建材** everywhere.
2. Make the dual offer explicit: **finished furniture AND the materials to build it**.
3. Replace the hero with a cropped cabinet render.
4. Add a market-labeled **Designs / 设计选款** catalog section sourced from the PDFs, with all supplier branding removed.

Non-goals (unchanged): WeChat stays a placeholder; no new stats/testimonials; contact stays WhatsApp; no build step.

## 1. Brand-name correction

The current files use **建然** (wrong). Correct to:

| Context | Value |
|---|---|
| Compact header & footer wordmark | **简然** JianRan |
| `<title>`, meta description, About first mention, footer full name | **简然建材** ("JianRan Building Materials") |
| Favicon glyph | **简** (was 建) |
| English "JianRan" | unchanged |

Implementation note: replace the standalone token `建然` → `简然`. The existing word `建材`
("building materials," 4 occurrences) must NOT be touched — a literal `建然`→`简然` replace is safe
because `建材` does not contain `建然`. Where the formal full name is wanted (title/footer/about),
extend to `简然建材`.

## 2. Furniture + build-materials messaging

Sharpen the positioning strip line and the **What We Source** list so the site states both halves
of the offer plainly:
- **Finished furniture** (cabinetry, wardrobes, islands, storage).
- **The materials to build it** — e.g. boards & panels, cabinet hardware, stone/quartz surfaces, fittings.

Keep copy honest and non-inflated (no fabricated scale/stats). All new copy bilingual via `data-en`/`data-zh`.

## 3. New hero

- Replace `hero-bg` image with the **copper-and-black modern kitchen render** (SE Asia PDF, page 2),
  cropped to remove the Musk Casa top/bottom margins.
- Keep the existing headline, sub-headline, WhatsApp CTA, and the dark `linear-gradient` scrim for legibility.
- Saved as `assets/hero-kitchen.jpg`.
- Warm classic alternates if a swap is wanted later: NA p2 (living-room + kitchen wide) or NA p6 (dark kitchen, big windows).

## 4. Designs / 设计选款 section

Placement: a new section **after** "Featured Projects / Recent Work" (real completed jobs stay first
for credibility) and before "How Sourcing Works". New nav link **Designs / 设计**.

Two market-labeled subgroups, ~6 curated designs each (final count may trim to whatever passes the
watermark/quality check):

- **Styled for North American homes / 适合北美** — classic / transitional / shaker.
  Candidate pages (NA PDF): p3, p5, p7 (olive), p9, p11, p12, p13, p14. Curate ~6.
- **Styled for SE Asia & Australia / 适合东南亚及澳洲** — contemporary / handleless / modern.
  Candidate pages (SEA PDF): p3, p4, p5 (green), p6, p10, p12, p18 (arched larder), p19 (wardrobe), p21. Curate ~6.

Each design: responsive grid tile, click-to-enlarge via the **existing lightbox**, bilingual caption.
Files: `assets/designs/design-na-01.jpg …` and `assets/designs/design-sea-01.jpg …`.

The lightbox in `script.js` currently binds to `#gallery .ph`. The Designs tiles must be wired into
the same lightbox (either reuse the `.ph` class/markup so existing JS picks them up, or extend the
figures selector to include the designs grid). Captions follow the existing `data-caption-en` /
`data-caption-zh` pattern.

Framing: labeled as **designs you can source / order** — never as completed projects.

## 5. Watermark removal (crop-based)

Render each chosen page at full resolution (ghostscript, e.g. `-r150`) and **crop**, not clone-stamp:
- Full-bleed room renders → crop the top and bottom margins to drop the logo and tagline.
- Centered product renders on white → crop to the central band (logo top-left and tagline bottom-right sit in the white margins).
- **Drop** all cover and "THANKS" pages entirely.
- **Skip** any render with a faint baked-in *center* watermark too visible to ignore (a couple have one).
- Crop offsets are per-page (product position varies); tune individually.

## Success criteria

- [ ] No "Musk Casa", phone number, or URL visible on any shipped image (visually verify each cropped file).
- [ ] Name reads **简然建材 / 简然** consistently; favicon glyph is **简**; no stray `建然` remains (`grep -c 建然 index.html` → 0).
- [ ] What We Source names both **finished furniture** and **build materials**.
- [ ] Designs section renders two market-labeled groups; lightbox opens/navigates on mobile + desktop.
- [ ] Hero shows the cropped copper render with legible headline.
- [ ] EN/中文 toggle covers all new copy and captions.
- [ ] `node --check script.js` passes.
- [ ] Responsive: designs grid collapses cleanly at the existing breakpoints (1000 / 900 / 760 / 460px).

## Deployment

Same as before: update `/home/yurin/projects/jianran`, mirror into the LuckyWeb repo's `JianRan/`
folder and the standalone `LuckyWebTemplate` repo, then hand the `git push` to the user (push is
blocked in this environment). GitHub Pages redeploys on push.
