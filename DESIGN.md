---
name: Studiographic
description: Home of a one-person studio that makes small apps and games; black ground, white type, soft blue wisps drifting from one corner.
colors:
  ground: "#000000"
  ink: "#ffffff"
  quiet: "#8f8f8f"
  rule: "#262626"
  signal-blue: "#2f63c4"
  logo-blue: "#1a4fa3"
typography:
  display:
    fontFamily: "Alan Sans, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 1.2rem + 2vw, 2.75rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Alan Sans, system-ui, sans-serif"
    fontSize: "clamp(0.9375rem, 0.88rem + 0.25vw, 1.0625rem)"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  focus: "2px"
spacing:
  gutter: "clamp(20px, 5.5vw, 96px)"
  row-pad: "clamp(14px, 1.6vw, 22px)"
  row-gap: "clamp(16px, 2.4vw, 36px)"
  intro-gap: "clamp(48px, 7vh, 88px)"
components:
  project-row:
    textColor: "{colors.ink}"
    typography: "{typography.display}"
    padding: "clamp(14px, 1.6vw, 22px) 0"
  project-row-hover:
    textColor: "{colors.signal-blue}"
  project-note:
    textColor: "{colors.quiet}"
    typography: "{typography.body}"
  section-label:
    textColor: "{colors.quiet}"
    typography: "{typography.body}"
  contact-link:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
  wordmark:
    width: "clamp(220px, 30vw, 460px)"
---

# Design System: Studiographic

## Overview

**Creative North Star: "Blue Smoke"**

The page is black with one quiet event: soft blue wisps, like smoke in still air, drift out of the top-right corner and thin to nothing well above the type. Everything else is plain: pure black ground, white type, one grey for secondary text, one typeface in two voices. The wisps are the only image; type does the rest.

Density is low and the composition sits bottom-left, flush to the gutter: wordmark, one quiet line, then the project list, with contact opposite on desktop and below on phones. The whole page fits one desktop viewport. Motion is one slow idle: the wisps fade in from the corner, then drift so slowly you notice only if you watch.

The wordmark is `logo.svg`, a vector trace of the user's original PNG logo (half-white, half-blue o). The user explored alternative o treatments and chose to keep the original; do not redesign the o.

**Key Characteristics:**
- Pure black ground, white ink, one grey, blue reserved for the field, link state and the logo's half-disc.
- One family (Alan Sans, self-hosted), exactly two sizes.
- Hairline rules between list rows; no cards, no fills, no shadows.
- One generative image (the wisps) drawn live in a three.js shader, never a raster.
- One entrance motion, then stillness.

## Colors

A near-monochrome dark palette where blue is light emitted by a screen, not a paint applied to surfaces.

### Primary
- **Signal Blue** (`signal-blue`): the body colour of the wisps (between a deep navy #0a1a40 and rgb(47, 99, 196), with a pale #96b6f0 only on the brightest strands), project-name hover, focus outline, contact-link underline on hover, and text selection. It never fills a block, button or background.
- **Logo Blue** (`logo-blue`): lives only inside the wordmark's half-filled "o". It is part of the logo asset, not a UI color; do not use it for state or surfaces.

### Neutral
- **Pure Black** (`ground`): page and canvas ground, and the `theme-color`. The field fades into it with no edge.
- **White Ink** (`ink`): wordmark letters, project names, contact links.
- **Quiet Grey** (`quiet`): the tagline line, section labels, project notes, the arrow at rest. About 6.9:1 on black.
- **Hairline** (`rule`): 1px row dividers in the project list and the resting underline of contact links.

### Named Rules
**The Emitted Light Rule.** Blue appears as light (the field, a hover, a focus ring, a selection), never as a filled surface or tinted panel.

**The Two-Blue Rule.** Signal Blue is the system's blue; Logo Blue stays inside the logo. Don't swap them or introduce a third.

## Typography

**Display Font:** Alan Sans (variable 300 to 900, OFL, chosen by the user, self-hosted woff2, `font-display: swap`; fallback system-ui, sans-serif)
**Body Font:** Alan Sans, same file

**Character:** A sturdy, slightly editorial grotesk; tightened at display size it reads like product naming, loose at body size it reads like a caption.

### Hierarchy
- **Display** (600, `display` clamp, line-height 1, tracking -0.03em): project names only, one per row.
- **Body** (400, `body` clamp, line-height 1.5): everything else (tagline, section labels, project notes, contact links), differentiated by color (ink vs. quiet), never by size or weight.

### Named Rules
**The Two Voices Rule.** There are exactly two type sizes. A new element takes display or body; it does not get a third size, an uppercase label style, or letterspacing.

**The Mark Is Not Type Rule.** The wordmark is the logo image (`wordmark` width, `min(64vw, 300px)` under 760px), never set in the font.

## Layout

A full-height CSS grid inside a `gutter` padding (clamp(20px, 5.5vw, 96px)) on all sides, with the bottom padding respecting the safe-area inset. On desktop: two columns (`1fr auto`) and three rows (`1fr auto auto`); the empty first row pushes the intro and list to the bottom, the projects sit bottom-left and contact sits bottom-right, right-aligned, its first link aligned to the project name's baseline. The intro is separated from the list by `intro-gap`.

Project rows are a three-column grid (name, note, arrow) on a shared baseline, with `row-gap` between columns and `row-pad` above and below; rows are divided by hairline top borders, with a closing bottom border on the last row. A new project is one more row; the list must read well with one row or many.

Under 760px: single column; a `minmax(30svh, 1fr)` spacer keeps the field visible above the type; intro gap becomes 40px; each row stacks the note under the name with the arrow spanning both; contact moves below the list, left-aligned, 40px down, each link given 11px vertical padding for a comfortable tap target.

The field canvas is absolutely positioned top-right across the full width, 72svh tall on desktop and 46svh on phones, non-interactive, and its falloff is computed so no wisp reaches the canvas bottom edge.

## Elevation & Depth

Flat. There are no shadows, layers or surfaces. Depth comes only from the field: brightness stepping down across quantized levels reads as distance from the corner light source. Separation between content is done with hairlines and space.

### Named Rules
**The Flat Ground Rule.** Nothing sits on a card or panel. Content lies directly on black.

## Shapes

Soft. The only hard geometry is type and the 1px rules; the wisps have no edges at all. The only rounding is a 2px corner (`rounded.focus`) on links so the focus outline has a soft corner. The arrow icon is an inline SVG drawn in 1.6 strokes with round caps and joins.

## Components

### Wisp Field (signature)
A full-screen three.js fragment shader (`field.js`, three r160 vendored in `vendor/`). Four-octave value noise is domain-warped twice and stretched along a shallow diagonal so strands run long and smooth; the ridges of the warped noise (raised to the 8th power) become thin wisps over a faint haze. A smoothstep falloff from the top-right corner masks it (reach 0.75x width on desktop, 1.3x on phones) and a power curve keeps the bottom edge black. Interleaved gradient noise of ±0.5/255 hides banding. Rendered at 1x pixel ratio, since the wisps are soft. Without WebGL the canvas gets a still CSS radial glow in the same corner (`.field.static`).
- **Motion:** fades in from the corner over about 2.4s with an exponential ease-out, then drifts: the warp offsets move about 0.01 to 0.02 noise units a second, rendered at 30fps. Under `prefers-reduced-motion` it draws one still frame and never animates. Resize re-renders without replaying.

### Project Row
- **Default:** name in white display, note in quiet body, arrow in quiet stroke; hairline rules above and below.
- **Hover / Focus:** name turns Signal Blue; arrow stroke turns white and nudges 2px up-right. Transitions 240ms cubic-bezier(0.16, 1, 0.3, 1).
- **Focus ring:** 2px Signal Blue outline, 6px offset.

### Contact Link
- **Default:** white body text, 1px underline in Hairline, offset 0.3em.
- **Hover:** underline turns Signal Blue over 240ms with the same curve.

### Section Label
Plain heading ("Projects", "Contact") at body size in Quiet Grey, normal weight, sentence case. It names the section; it is not a kicker or eyebrow and gets no uppercase, tracking or accent color.

### Wordmark
The logo image in an `h1`, width from the `wordmark` token, line-height 0. Followed by one quiet body line.

## Do's and Don'ts

### Do:
- **Do** keep every element on pure black (#000000) with white or quiet-grey type.
- **Do** use exactly two type sizes: display (600, -0.03em) for project names, body for everything else.
- **Do** add projects as one more hairline-divided row with name, note and arrow.
- **Do** use Signal Blue only for the field and for state (hover, focus, selection, underline on hover).
- **Do** use the one transition curve (240ms, cubic-bezier(0.16, 1, 0.3, 1)) for state changes and let the field animate once only.
- **Do** honor `prefers-reduced-motion`: draw the field complete and drop transitions.

### Don't:
- **Don't** put content in cards, panels or tinted boxes, or add shadows.
- **Don't** add a third type size, uppercase labels, or a second family.
- **Don't** fill buttons or surfaces with blue, or use Logo Blue outside the logo.
- **Don't** add a second image, gradient or decorative graphic next to the field, or make the field loop, follow the cursor or react to scroll.
- **Don't** let wisps sit behind type; the field is black by the time it reaches the wordmark's column and height.
