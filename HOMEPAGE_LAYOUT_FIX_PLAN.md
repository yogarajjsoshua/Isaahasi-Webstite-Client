# Homepage Layout Fix Plan — "Stretched Width" Bug

**Status:** Plan only — no code changed yet. Awaiting review/approval before implementation.
**Figma source of truth:** [isaahasi-concepts, node 149:181 "Homepage image only"](https://www.figma.com/design/exRf39ztJxPOv0hdonNz9j/isaahasi-concepts?node-id=149-181) — frame width **1440px**.
**Scope:** `src/pages/HomePage.tsx` + `src/pages/HomePage.css` only.
**Explicitly out of scope (will not be touched):** `Header.tsx`, `Header.css`, `Layout.tsx`, `Footer.tsx`/`Footer.css`, nav bar. These already match Figma and the user confirmed they work correctly.

---

## 1. Root cause

The Figma design is authored at a fixed **1440px** canvas width. Every section's internal
measurements (padding, card widths, image compositions) were sized assuming a 1440px-wide
parent.

`HomePage.css` never caps the page at that width. The top-level wrapper is:

```css
.homepage {
  width: 100%;   /* stretches to the full real browser viewport, e.g. 1920/2560/3440px */
}
```

Because nothing below `.homepage` is capped either, several sections size themselves relative
to the *actual* (often much wider than 1440px) viewport instead of the Figma-authored 1440px
canvas:

| Section | Current CSS | Problem |
|---|---|---|
| `.hero-carousel` / `.carousel-slide img` | `width: 100%`, fixed `height: 760px`, `object-fit: cover` | Figma's carousel images are each pre-cropped to exactly 1440×760. Stretched to a wider viewport at a locked height, `cover` crops away more of the image than intended. |
| `.mission-image img` | `width: 100%`, fixed `height: 770px`, `object-fit: cover` | The Figma "Frame 17" image is a **single** composite photo (three women, arms linked) sized 1442×770, mostly white background with the figures near the bottom. Stretched wide + `cover`, the crop spreads the three figures apart with large gaps of visible background — this is exactly the "3 separate stretched images" artifact in the current screenshot. |
| `.testimonial-section` | `max-width: calc(100% - 288px)` | Relative to the *viewport*, not the 1440px canvas. Figma's teal rounded card is a fixed **1152px** (144px margin each side of 1440). On a 1920px screen this currently renders at 1632px — ~40% too wide. |
| `.newsletter-content` | no `max-width` at all | Figma's newsletter card is a fixed **953px**. Currently it stretches to fill `.newsletter-section`'s available width (viewport − 436px padding), so on wide screens the email input/button row stretches disproportionately. |

Sections that already use a fixed pixel `max-width` (not a viewport-relative `calc()`/`%`) are
**already correct** and need no change: `.mission-content` (1149px), `.mission-text` (1143px),
`.quote-content` (1152px), `.her-story-content` (1238px), `.stats-grid` (1152px).

The header doesn't show this bug not because it's built differently in kind, but because it has
no images being force-cropped — it's flat background color + centered flex nav, so stretching
the outer wrapper doesn't visually distort anything.

Confirmed against Figma via `get_design_context`/`get_metadata`:
- Frame: 1440px wide.
- Hero carousel ("Carousel1", node `776:378`): each slide sized exactly 1440×760 (or 1457 for the wider background layers) — designed to fill exactly a 1440px-wide viewport, not an arbitrary one.
- Mission block ("Frame 17", node `1588:724`): 1442×1206 container; image 1442×770; heading 1149px wide; body text 1143px wide.
- Newsletter card (node `1595:543`): 953×241, not full-width.

## 2. Fix strategy

**Primary fix — cap the page at the Figma frame width, matching the existing (currently unused) `.container` utility in `globals.css`:**

```css
.homepage {
  max-width: 1440px;
  margin: 0 auto;
}
```

This is the single highest-leverage change. Effects:
- All viewport-relative measurements below `.homepage` (`width: 100%`, `calc(100% - 288px)`, etc.) now resolve against **1440px** instead of the real (often wider) viewport — matching Figma exactly.
- `.testimonial-section`'s `calc(100% - 288px)` becomes `calc(1440px - 288px) = 1152px` — exactly the Figma value — **with no per-rule edit needed**.
- `.hero-carousel` and `.mission-image` stop over-stretching past 1440px, so `object-fit: cover` crops the same way Figma intended.
- On screens **narrower** than 1440px (laptops, tablets, phones) this rule has zero effect — the existing `768/1024/1280` responsive breakpoints are untouched. Zero regression risk on smaller screens.
- Header/Nav/Footer live outside `.homepage` (in `Layout.tsx`, as siblings of `<Outlet />`) and are completely unaffected.

**Required follow-up fix (the cap alone doesn't cover this one):**

```css
.newsletter-content {
  max-width: 953px;   /* matches Figma's NEWSLETTER card width */
  margin: 0 auto;
}
```

`.newsletter-content` has no `max-width` today, so even inside a capped 1440px page it would
still stretch to fill `.newsletter-section`'s available width (1440 − 218×2 = 1004px), still
wider than Figma's 953px card. This needs its own explicit cap.

**No JSX changes required.** `HomePage.tsx`'s structure (single image per section, not multiple
cropped images) already matches Figma's intent — the bug is purely a CSS width-containment
issue, not a markup/structure issue.

### Design decision to flag (background color bands)

With the `.homepage` cap applied, section background colors (`.quote-section` beige,
`.testimonial-section` teal, `.stats-section` beige, etc.) will stop at 1440px and show the
page's white background outside that column on very wide monitors (>1440px), rather than
bleeding edge-to-edge. This is **pixel-accurate to Figma** (the canvas itself is only 1440px;
nothing exists beyond it) and directly addresses "too stretched." The alternative — keeping
color bands full-bleed and only capping inner content per-section — is more code (a wrapper
div per section) for a look Figma doesn't actually show. Recommendation: ship the simple
whole-page cap first; revisit full-bleed bands only if the user asks for that specific look
after seeing the fix.

## 3. Exact changes (file: line-level)

All changes are in `src/pages/HomePage.css`. No other file is touched.

1. `.homepage` (line 3): add `max-width: 1440px; margin: 0 auto;`
2. `.newsletter-content` (line 447): add `max-width: 953px; margin: 0 auto;`

That's it — two rules. Everything else self-corrects because it already references fixed px
values or percentages that will now resolve against the 1440px cap.

## 4. Testing / verification plan

Run `npm run dev` and check the homepage at each of these viewport widths (matches existing
breakpoints plus common wide desktop sizes), comparing against the Figma frame and the two
reference screenshots the user provided:

- **1440px** (exact Figma width) — should match Figma pixel-for-pixel.
- **1920px, 2560px, 3440px** (common wide/ultrawide monitors) — this is where the bug is most
  visible today; after the fix, content should stay capped at 1440px, centered, with no
  cropped/distorted hero or mission imagery.
- **1280px, 1024px, 768px, 375px** (existing responsive breakpoints) — confirm zero regression,
  since the cap only engages above 1440px.

Specifically verify:
- Hero carousel image is not over-cropped/distorted.
- Mission section shows the single three-women photo intact (no visible gaps/background
  between figures).
- Testimonial teal card is ~1152px wide, not stretched edge-to-edge on wide screens.
- Newsletter card is ~953px wide, centered, not stretched.
- Header, nav bar, and footer are pixel-identical to before (unchanged files).

## 5. Tools/permissions needed for implementation

- Permission to edit `src/pages/HomePage.css` (2 rule additions, per section 3 above).
- Permission to run `npm run dev` locally and view the result in a browser to visually verify
  before/after at the viewport widths listed above.
- No new dependencies, no Tailwind conversion, no asset changes required.
