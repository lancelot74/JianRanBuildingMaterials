# JianRan Designs Catalog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct the Chinese company name to 简然建材, make the "furniture + the materials to build it" offer explicit, swap the hero to a cropped cabinet render, and add a market-labeled Designs catalog sourced from two supplier PDFs with all supplier branding removed.

**Architecture:** Static site, no build step. Edit `index.html` / `styles.css` / `script.js` in place. Extract cabinet renders from two PDFs via ghostscript, crop out the "Musk Casa" margins with ImageMagick, write cropped JPEGs into `assets/`. Reuse the existing lightbox by sharing the `.ph` class.

**Tech Stack:** HTML/CSS/vanilla JS; ghostscript (`gs`) + ImageMagick (`convert`) for the asset pipeline; `node --check` for JS lint.

**Verification model:** No test framework exists (static site). "Tests" are concrete verification commands: `grep` assertions, `node --check`, and visual confirmation by Reading each cropped image to confirm no supplier branding survives.

**Source PDFs:**
- NA = `/mnt/c/Users/garhy/Downloads/厨柜（适合北美市场）.pdf` (14 pp, classic/shaker)
- SEA = `/mnt/c/Users/garhy/Downloads/厨柜（适合东南+澳洲市场）.pdf` (24 pp, modern)

---

### Task 1: Brand-name correction (建然 → 简然 / 简然建材)

**Files:**
- Modify: `index.html` (L6, L7, L19, L154, L155, L179)
- Modify: `assets/favicon.svg` (L3)

- [ ] **Step 1: Baseline grep**

Run: `grep -c 建然 index.html`
Expected: `6` (6 lines, 8 occurrences).

- [ ] **Step 2: Replace all 建然 → 简然**

```bash
cd /home/yurin/projects/jianran
sed -i 's/建然/简然/g' index.html
```

- [ ] **Step 3: Upgrade the formal-name spots to 简然建材**

Use Edit (exact strings):
- Title: `JianRan 简然 · Building Materials` → `JianRan 简然建材 · Building Materials`
- Meta description: `JianRan (简然) is a Shanghai-based` → `JianRan (简然建材) is a Shanghai-based`
- Footer (replace_all, the line has the string 3×): `简然 JianRan` → `简然建材 JianRan`

Leave the header wordmark (`简然 <span class="brand-en">`), the About heading (`关于简然`), and the About body as plain **简然**.

- [ ] **Step 4: Favicon glyph**

Edit `assets/favicon.svg`: change the glyph in the `<text>` element from `建` to `简`.

- [ ] **Step 5: Verify**

```bash
grep -c 建然 index.html        # Expected: 0
grep -o 简然建材 index.html | wc -l   # Expected: >= 3 (title, meta, footer)
grep -c 简 assets/favicon.svg   # Expected: 1
```

- [ ] **Step 6: Commit**

```bash
git add index.html assets/favicon.svg
git commit -m "Correct Chinese name to 简然建材"
```

---

### Task 2: "Furniture + the materials to build it" messaging

**Files:**
- Modify: `index.html` — What We Source section (L74 sub, L88–L98 furniture group)

- [ ] **Step 1: Sharpen the section sub-headline (L74)**

Edit the `.section-sub` in `#source`:
- `data-en` → `Finished furniture — and the boards, hardware, and surfaces it's built from. From a single tile to a full fit-out, if it goes into a building we can source it.`
- `data-zh` → `成品家具，以及制作家具的板材、五金与饰面。从一块瓷砖到整屋精装，只要用于建筑，我们都能采购。`
- visible text → match the `data-en` string.

- [ ] **Step 2: Rename the furniture group label (L89)**

Edit `.cat-label` in the second `.cat-group`:
- `data-en="Furniture & custom joinery"` → `data-en="Furniture & the materials to build it"`
- `data-zh="家具与定制木作"` → `data-zh="家具与制作材料"`
- visible text → `Furniture & the materials to build it`

- [ ] **Step 3: Add three material chips before the "+ more" chip (L95–96)**

Insert these three `<span class="chip">` immediately before the existing `chip-more` span:

```html
        <span class="chip" data-en="Boards & panels" data-zh="板材">Boards &amp; panels</span>
        <span class="chip" data-en="Cabinet hardware" data-zh="柜体五金">Cabinet hardware</span>
        <span class="chip" data-en="Stone & quartz worktops" data-zh="石英石台面">Stone &amp; quartz worktops</span>
```

- [ ] **Step 4: Verify**

```bash
grep -c "the materials to build it" index.html   # Expected: 2 (data-en + visible text)
grep -c "Cabinet hardware" index.html            # Expected: 1
```

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Make furniture + build-materials offer explicit"
```

---

### Task 3: Asset pipeline — render + crop the hero and 12 designs

**Files:**
- Create: `assets/hero-kitchen.jpg`
- Create: `assets/designs/design-na-01.jpg` … `design-na-06.jpg`
- Create: `assets/designs/design-sea-01.jpg` … `design-sea-06.jpg`

**Curated pages** (alternates if a page has a baked-in center watermark or weak crop):
- Hero: SEA p2. Alt: NA p2, NA p6.
- NA (classic): p3, p5, p7, p9, p12, p13. Alts: p11, p14.
- SEA (modern): p3, p4, p6, p10, p18, p19. Alts: p12, p21.

**Crop method (per page, iterate):**
- Full-bleed room renders → logo is in the top margin, tagline in the bottom margin: chop top ~6% and bottom ~9%.
- Centered-on-white product renders → chop to the central band: top ~13%, bottom ~12% (add side chop if the logo/tagline reach inward).
- `-chop` removes a strip from the gravity edge; tune percentages per page.

- [ ] **Step 1: Render chosen pages at high resolution**

```bash
mkdir -p /tmp/jr_full /home/yurin/projects/jianran/assets/designs
NA="/mnt/c/Users/garhy/Downloads/厨柜（适合北美市场）.pdf"
SEA="/mnt/c/Users/garhy/Downloads/厨柜（适合东南+澳洲市场）.pdf"
render() { gs -q -dNOPAUSE -dBATCH -sDEVICE=jpeg -r150 -dFirstPage=$2 -dLastPage=$2 -sOutputFile=/tmp/jr_full/$1.jpg "$3"; }
render hero 2 "$SEA"
for p in 3 5 7 9 12 13; do render na_$p $p "$NA"; done
for p in 3 4 6 10 18 19; do render sea_$p $p "$SEA"; done
ls -la /tmp/jr_full/
```

Expected: 13 JPEGs.

- [ ] **Step 2: Crop the hero (full-bleed)**

```bash
convert /tmp/jr_full/hero.jpg -gravity North -chop 0x6% -gravity South -chop 0x9% \
  -resize 2000x -quality 84 /home/yurin/projects/jianran/assets/hero-kitchen.jpg
```

- [ ] **Step 3: Visually verify the hero crop**

Read `/home/yurin/projects/jianran/assets/hero-kitchen.jpg`. Confirm: NO red "M" logo, NO "MUSK CASA", NO phone/URL, NO bottom tagline. If any branding remains, increase the offending `-chop` percentage and re-run Step 2.

- [ ] **Step 4: Crop the 12 designs**

For each page decide full-bleed vs centered-on-white by Reading the source `/tmp/jr_full/<name>.jpg` once, then crop. Starting commands (tune per page in Step 5):

```bash
DST=/home/yurin/projects/jianran/assets/designs
crop_bleed()   { convert /tmp/jr_full/$1.jpg -gravity North -chop 0x6% -gravity South -chop 0x9%  -resize 1500x -quality 82 $DST/$2.jpg; }
crop_white()   { convert /tmp/jr_full/$1.jpg -gravity North -chop 0x13% -gravity South -chop 0x12% -resize 1500x -quality 82 $DST/$2.jpg; }
# NA (classic) -> design-na-01..06
crop_white na_3 design-na-01;  crop_white na_5 design-na-02;  crop_bleed na_7 design-na-03
crop_bleed na_9 design-na-04;  crop_bleed na_12 design-na-05; crop_white na_13 design-na-06
# SEA (modern) -> design-sea-01..06
crop_bleed sea_3 design-sea-01; crop_bleed sea_4 design-sea-02; crop_bleed sea_6 design-sea-03
crop_bleed sea_10 design-sea-04; crop_white sea_18 design-sea-05; crop_bleed sea_19 design-sea-06
ls -la $DST/
```

Expected: 12 JPEGs.

- [ ] **Step 5: Visually verify every cropped design**

Read each of the 12 files in `assets/designs/`. For any file still showing the red "M" logo, "MUSK CASA", a phone number, a URL, the bottom tagline, OR a clearly visible center watermark: either retune its `-chop` percentages and re-crop, or swap to an alternate page from the curated list and re-crop. Repeat until all 12 are clean.

- [ ] **Step 6: Commit**

```bash
cd /home/yurin/projects/jianran
git add assets/hero-kitchen.jpg assets/designs
git commit -m "Add cropped hero + cabinet design renders"
```

---

### Task 4: Designs section markup + hero swap + nav link

**Files:**
- Modify: `index.html` (hero L46, nav L22–26, new section after L121)

- [ ] **Step 1: Swap the hero image (L46)**

Edit: `src="assets/projects/project-02.jpg"` → `src="assets/hero-kitchen.jpg"`.

- [ ] **Step 2: Add the Designs nav link**

In `<nav id="nav">`, insert after the Projects link (L22):

```html
        <a href="#designs" data-en="Designs" data-zh="设计">Designs</a>
```

- [ ] **Step 3: Insert the Designs section after Featured Projects (after L121, before the Process section)**

```html
  <!-- ===== Designs / catalog ===== -->
  <section class="section" id="designs">
    <div class="container">
      <h2 class="section-title" data-en="Designs you can source" data-zh="可采购设计选款">Designs you can source</h2>
      <p class="section-sub" data-en="Cabinetry & furniture designs ready to order and tailor — click any to enlarge." data-zh="可直接下单并定制的橱柜与家具设计——点击查看大图。">Cabinetry &amp; furniture designs ready to order and tailor — click any to enlarge.</p>

      <div class="design-group">
        <h3 class="market-label" data-en="Styled for North American homes" data-zh="适合北美市场">Styled for North American homes</h3>
        <div class="gallery designs">
          <figure class="ph" data-caption-en="Grey shaker kitchen" data-caption-zh="灰色简约厨柜"><img src="assets/designs/design-na-01.jpg" alt="Grey shaker kitchen" loading="lazy"></figure>
          <figure class="ph" data-caption-en="Cream classic kitchen" data-caption-zh="奶油色经典厨柜"><img src="assets/designs/design-na-02.jpg" alt="Cream classic kitchen" loading="lazy"></figure>
          <figure class="ph" data-caption-en="Olive green kitchen" data-caption-zh="橄榄绿厨柜"><img src="assets/designs/design-na-03.jpg" alt="Olive green kitchen" loading="lazy"></figure>
          <figure class="ph" data-caption-en="Island with seating" data-caption-zh="中岛吧台厨柜"><img src="assets/designs/design-na-04.jpg" alt="Island with seating" loading="lazy"></figure>
          <figure class="ph" data-caption-en="Traditional wood kitchen" data-caption-zh="实木传统厨柜"><img src="assets/designs/design-na-05.jpg" alt="Traditional wood kitchen" loading="lazy"></figure>
          <figure class="ph" data-caption-en="Dark cabinets with marble" data-caption-zh="深色橱柜配大理石"><img src="assets/designs/design-na-06.jpg" alt="Dark cabinets with marble" loading="lazy"></figure>
        </div>
      </div>

      <div class="design-group">
        <h3 class="market-label" data-en="Styled for Southeast Asia & Australia" data-zh="适合东南亚及澳洲市场">Styled for Southeast Asia &amp; Australia</h3>
        <div class="gallery designs">
          <figure class="ph" data-caption-en="Matte black island kitchen" data-caption-zh="哑光黑中岛厨柜"><img src="assets/designs/design-sea-01.jpg" alt="Matte black island kitchen" loading="lazy"></figure>
          <figure class="ph" data-caption-en="Modern open shelving" data-caption-zh="现代开放层架厨柜"><img src="assets/designs/design-sea-02.jpg" alt="Modern open shelving" loading="lazy"></figure>
          <figure class="ph" data-caption-en="Angular wood kitchen" data-caption-zh="几何木纹厨柜"><img src="assets/designs/design-sea-03.jpg" alt="Angular wood kitchen" loading="lazy"></figure>
          <figure class="ph" data-caption-en="Dramatic dark island" data-caption-zh="深色中岛厨柜"><img src="assets/designs/design-sea-04.jpg" alt="Dramatic dark island" loading="lazy"></figure>
          <figure class="ph" data-caption-en="Arched larder cabinet" data-caption-zh="拱形储物柜"><img src="assets/designs/design-sea-05.jpg" alt="Arched larder cabinet" loading="lazy"></figure>
          <figure class="ph" data-caption-en="Fitted wardrobe" data-caption-zh="整体衣柜"><img src="assets/designs/design-sea-06.jpg" alt="Fitted wardrobe" loading="lazy"></figure>
        </div>
      </div>
    </div>
  </section>
```

> Note: if any design file was dropped/renamed in Task 3, update the matching `<figure>` here so every `src` resolves.

- [ ] **Step 4: Verify markup**

```bash
grep -c 'class="ph"' index.html        # Expected: 22 (10 projects + 12 designs)
grep -c 'id="designs"' index.html      # Expected: 1
grep -o 'assets/designs/design-[a-z]*-0[0-9].jpg' index.html | wc -l   # Expected: 12
for f in $(grep -o 'assets/designs/design-[a-z]*-0[0-9].jpg' index.html); do test -f "$f" || echo "MISSING $f"; done   # Expected: no output
```

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Add Designs catalog section, nav link, hero render"
```

---

### Task 5: Designs section CSS

**Files:**
- Modify: `styles.css` (append rules; add responsive overrides near the existing gallery breakpoints)

- [ ] **Step 1: Append the designs rules**

Add after the existing `.ph:hover::after` rule (≈ L134):

```css
/* ----- Designs catalog ----- */
.design-group { margin-top: 44px; }
.design-group + .design-group { margin-top: 52px; }
.market-label { font-family: var(--serif); font-size: 1.25rem; font-weight: 600; color: var(--walnut); margin-bottom: 18px; }
.gallery.designs { grid-template-columns: repeat(3, 1fr); margin-top: 0; }
.gallery.designs .ph { aspect-ratio: 3 / 2; }
```

- [ ] **Step 2: Add responsive overrides**

In the `max-width: 900px` block (near L198) add:

```css
  .gallery.designs { grid-template-columns: repeat(2, 1fr); }
```

In the `max-width: 460px` block (near L259) add:

```css
  .gallery.designs { grid-template-columns: repeat(2, 1fr); }
  .market-label { font-size: 1.12rem; }
```

- [ ] **Step 3: Verify**

```bash
grep -c "gallery.designs" styles.css   # Expected: >= 3
```

- [ ] **Step 4: Commit**

```bash
git add styles.css
git commit -m "Style Designs catalog section"
```

---

### Task 6: Wire designs into the lightbox + final verification

**Files:**
- Modify: `script.js` (L11 figures selector; L21 applyLang loop already iterates `figures`)

- [ ] **Step 1: Broaden the lightbox figure selector (L11)**

Edit:
```js
var figures = Array.prototype.slice.call(document.querySelectorAll('#gallery .ph'));
```
to:
```js
var figures = Array.prototype.slice.call(document.querySelectorAll('.ph'));
```

This makes both the projects gallery and the designs tiles open in the existing lightbox; the `applyLang` caption loop (which already iterates `figures`) then covers designs too. The hover-caption (`data-cap`) is set in that same loop, so designs get hover captions in the current language.

- [ ] **Step 2: Lint the JS**

Run: `node --check script.js`
Expected: no output (exit 0).

- [ ] **Step 3: Full success-criteria verification**

```bash
cd /home/yurin/projects/jianran
grep -c 建然 index.html                                   # 0
grep -o 简然建材 index.html | wc -l                        # >= 3
grep -c 'class="ph"' index.html                           # 22
grep -c "the materials to build it" index.html            # 2
node --check script.js && echo JS_OK
for f in $(grep -o 'assets/[a-z/–-]*\.jpg' index.html | sort -u); do test -f "$f" || echo "MISSING $f"; done   # no output
```

- [ ] **Step 4: Visual smoke test (manual)**

Open `index.html` in a browser (or rely on the deploy preview). Confirm: hero shows the cropped render with a legible headline; Designs section shows two labeled market groups; clicking a design opens the lightbox and prev/next cycles; EN/中文 toggle swaps all new copy and captions; layout holds at narrow widths.

- [ ] **Step 5: Commit**

```bash
git add script.js
git commit -m "Wire Designs tiles into lightbox"
```

---

### Task 7: Deploy — mirror to both repos, hand push to user

**Files:**
- Sync `index.html`, `styles.css`, `script.js`, `assets/` into the LuckyWeb repo's `JianRan/` folder and the standalone `LuckyWebTemplate` repo working tree.

- [ ] **Step 1: Mirror files into both repos** (use the paths established in the prior session; `rsync`/`cp` the four items, including the new `assets/designs/` and `assets/hero-kitchen.jpg`, and the removed reliance on `project-02` as hero).

- [ ] **Step 2: Commit in each repo** with a terse message (e.g. `Update JianRan: 简然建材 name, designs catalog`).

- [ ] **Step 3: Hand the push to the user.** Push is blocked in this environment — tell the user to run `! git -C <repo> push` for each repo (or provide a one-liner). GitHub Pages redeploys on push.

- [ ] **Step 4: After the user pushes,** re-verify the live site returns HTTP 200 and the designs images resolve under the Pages subpath.

---

## Self-Review

**Spec coverage:**
- Name → 简然建材 (Task 1) ✓
- Furniture + build-materials messaging (Task 2) ✓
- Hero render, cropped (Task 3 + Task 4 Step 1) ✓
- Designs section, two market groups, ~6 each, lightbox, nav, bilingual (Tasks 4–6) ✓
- Watermark removal by crop + visual verify + drop covers/skip center-watermark (Task 3 Steps 3,5) ✓
- Honesty framing: "Designs you can source", separate from Recent work (Task 4) ✓
- Success criteria grep/`node --check`/responsive (Task 6) ✓
- Deploy/hand-push (Task 7) ✓

**Placeholders:** none — every copy string and command is concrete. Crop percentages are explicit starting values with a defined visual-verify-and-retune loop (genuine iteration, not a placeholder).

**Type/name consistency:** `.ph` class shared so the broadened `document.querySelectorAll('.ph')` selector (Task 6) picks up both galleries; `.gallery.designs` used consistently in markup (Task 4) and CSS (Task 5); design filenames `design-na-0N` / `design-sea-0N` match between Task 3 (creation) and Task 4 (references); `grep -c 'class="ph"'` expectation of 22 = 10 + 12 is consistent across Tasks 4 and 6.
