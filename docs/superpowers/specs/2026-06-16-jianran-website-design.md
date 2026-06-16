# JianRan Building Materials — Website Design Spec

**Date:** 2026-06-16
**Status:** Approved for implementation

## Purpose

A bilingual (EN / 中文) marketing website for **JianRan (建然)**, a Shanghai-based
sourcing partner for building materials and furniture. Primary goal: **showcase the
portfolio and build credibility** with overseas **contractors and developers**, and
communicate that **any building material or piece of furniture can be sourced from
China through JianRan**.

JianRan has only recently begun exporting and advertising, so the site builds trust
through **the real work** (10 genuine project photos) and **sourcing capability** —
**not** fabricated stats (no "20 years / 500 projects" claims).

## Audience

Overseas contractors & property developers buying materials in bulk. They value
reliability, scale, consistent quality, and an easy way to get in touch. Tone:
substantial, professional, warm — not boutique, not cheap.

## Visual direction — "Warm Showroom"

- **Palette:** walnut `#6b4f3a`, deep walnut/ink `#3a3027` / `#2a221b`, tan/bronze
  `#b98e5e`, cream `#efe6d8`, light cream `#fbf6ee`, WhatsApp green `#25D366`
  (action accent kept tasteful).
- **Type:** soft serif display (**Fraunces**) for headings; humanist sans (**Inter**)
  for body. Loaded via Google Fonts with system fallbacks.
- **Feel:** rich, tactile, premium but approachable. Rounded CTAs, generous spacing,
  full-bleed photography.

## Structure — single scrolling page

Sticky header with anchor nav + **EN/中文 toggle** + WhatsApp button. Sections:

1. **Hero** — headline, sourcing subline, WhatsApp CTA + "View projects", full-bleed photo.
2. **Positioning strip** — Shanghai-based · Direct factory sourcing · Worldwide shipping.
3. **What We Source** — two category groups (Building Materials / Furniture & Joinery) as chips, reinforcing the "anything" message.
4. **Featured Projects** — the 10 real photos in a responsive grid, **click-to-enlarge lightbox**.
5. **How Sourcing Works** — 4 steps.
6. **Why JianRan** — 4 trust points.
7. **About** — short, honest blurb.
8. **Contact** — **WhatsApp** (`+86 137 2734 7201`, active) and **WeChat** (clearly-marked placeholder — QR + ID to be added later). Footer.

Deliberately excluded for now: testimonials, quote-request form.

## Build approach

Lightweight **static site**, no build step (matches the user's LuckyWeb pattern):

```
jianran/
  index.html        # markup + bilingual content via data-en/data-zh attributes
  styles.css        # Warm Showroom theme, responsive
  script.js         # language toggle (localStorage), lightbox, mobile nav
  assets/projects/  # project-01.jpg … project-10.jpg (the 10 real photos)
  assets/           # favicon, future WeChat QR
```

- **Bilingual:** every translatable node carries `data-en` / `data-zh`; `script.js`
  swaps `textContent` and `<html lang>` on toggle, persists choice in `localStorage`,
  defaults to EN.
- **Lightbox:** vanilla JS, click a project photo → full-screen overlay, arrow/esc keys, click-out to close.
- **WhatsApp link:** `https://wa.me/8613727347201`.
- **Responsive:** mobile-first; header collapses to a hamburger; grids reflow.
- **Imagery:** the 10 photos are the core. Higgsfield optional later for a polished
  hero background, category thumbnails, or a wordmark/logo — not required to launch.

## Bilingual copy (source of truth)

| Key | EN | 中文 |
|---|---|---|
| Nav | Projects / What We Source / Process / About / Contact | 项目 / 采购范围 / 流程 / 关于 / 联系 |
| Hero H1 | Beautiful materials, brought to you. | 优质建材，直送全球。 |
| Hero sub | Any building material or piece of furniture — sourced, made, and shipped from China. | 任何建筑材料与家具——从中国采购、生产、发往全球。 |
| Hero CTA / alt | Message us on WhatsApp → / View projects | WhatsApp 联系我们 → / 查看项目 |
| Strip | Shanghai-based · Direct factory sourcing · Worldwide shipping | 立足上海 · 工厂直采 · 全球发货 |
| Source H | Source anything — one partner | 一站采购，应有尽有 |
| Source sub | From a single tile to a full fit-out. If it goes into a building, we can source it. | 从一块瓷砖到整屋精装——只要用于建筑，我们都能采购。 |
| Group 1 | Building materials | 建筑材料 |
| — chips | Stone & sintered stone / Flooring / Tile / Doors & windows / Wall panels / Lighting | 岩板与石材 / 地板 / 瓷砖 / 门窗 / 墙板 / 灯具 |
| Group 2 | Furniture & custom joinery | 家具与定制木作 |
| — chips | Wardrobes / Kitchen cabinetry / Display & storage / Custom furniture / TV & feature walls / + more on request | 衣柜 / 橱柜 / 储物展示柜 / 定制家具 / 电视背景墙 / 更多可定制 |
| Projects H | Recent work | 近期项目 |
| Projects sub | Real fit-outs we've delivered — click any image to enlarge. | 我们已交付的真实案例——点击图片查看大图。 |
| Process H | Simple, end-to-end | 全流程，省心省力 |
| Process sub | You tell us what you need; we handle China. | 您提出需求，中国这端交给我们。 |
| Steps | 01 Send your list, drawings, or a photo / 02 We source & quote from vetted factories / 03 Production & quality check / 04 Export & ship to your site | 01 发来清单、图纸或一张照片 / 02 从优选工厂采购并报价 / 03 生产并质检 / 04 出口并发往您的工地 |
| Why H | Why contractors work with us | 为什么承包商选择我们 |
| Why points | One partner for every material & finish / Direct factory pricing — no middlemen / Custom joinery & made-to-spec / Quality controlled before it ships | 一个伙伴，搞定所有材料与饰面 / 工厂直供价——没有中间商 / 定制木作，按图施作 / 发货前严格质检 |
| About H | About JianRan | 关于建然 |
| About body | JianRan is a Shanghai-based sourcing partner for building materials and furniture. We help contractors and developers source, manufacture, and ship everything a project needs — direct from China. We've recently begun serving clients worldwide, and we'd love to source your next project. | 建然是一家立足上海的建材与家具采购伙伴。我们帮助承包商与开发商从中国直接采购、生产并运送项目所需的一切。我们近期开始服务全球客户，期待为您的下一个项目供货。 |
| Contact H | Tell us what you need to source. | 告诉我们您需要采购什么。 |
| Contact sub | Fastest reply on WhatsApp · +86 137 2734 7201 | WhatsApp 回复最快 · +86 137 2734 7201 |
| WeChat | WeChat — coming soon | 微信 — 即将开放 |
| Footer | 建然 JianRan · Shanghai, China · Building materials & furniture sourcing · © 2026 | 建然 JianRan · 中国·上海 · 建材与家具采购 · © 2026 |

## Success criteria

- Opens in any browser with no build step.
- EN/中文 toggle swaps all copy and persists across reloads.
- Project gallery lightbox opens/closes (click, esc, arrows) and is keyboard-accessible.
- WhatsApp button links to `wa.me/8613727347201`.
- Layout is responsive (mobile, tablet, desktop); nav collapses on mobile.
- No fabricated credibility claims anywhere.
