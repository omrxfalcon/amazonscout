---
version: 1.0
name: AmazonScout-design-system
description: >
  Warm, compact design system for the AmazonScout Chrome extension popup.
  Adapted from the Airbnb DESIGN.md (awesome-design-md collection).
  Scout Orange is the single brand accent; warm cream canvas; fully rounded
  corners everywhere; generous but compact spacing for a 380px popup viewport.

colors:
  primary: "#FF7235"
  primary-hover: "#E85E22"
  primary-disabled: "#FFD4C2"
  primary-error: "#C0392B"
  pro-badge: "#FF7235"
  ink: "#1C1917"
  body: "#44403C"
  muted: "#78716C"
  muted-soft: "#A8A29E"
  hairline: "#E7E5E4"
  hairline-soft: "#F5F4F3"
  border-focus: "#FF7235"
  canvas: "#FFFDF9"
  surface-soft: "#FFF5EB"
  surface-card: "#FFFFFF"
  surface-strong: "#F0EDE8"
  on-primary: "#FFFFFF"
  on-dark: "#FFFFFF"
  success: "#16A34A"
  warning: "#D97706"
  error: "#DC2626"

typography:
  display-xl:
    fontFamily: "'Inter', -apple-system, system-ui, Roboto, 'Helvetica Neue', sans-serif"
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: -0.3px
  display-md:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  title:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  body-md:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.46
    letterSpacing: 0
  caption:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.33
    letterSpacing: 0
  micro:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.27
    letterSpacing: 0.3px
    textTransform: uppercase
  button:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.29
    letterSpacing: 0
  metric:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.5px

rounded:
  none: 0px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  base: 16px
  lg: 20px
  xl: 24px
  xxl: 32px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.lg}"
    padding: 10px 20px
    height: 40px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.lg}"
  button-primary-disabled:
    backgroundColor: "{colors.primary-disabled}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.lg}"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.lg}"
    padding: 9px 19px
    border: "1.5px solid {colors.hairline}"
    height: 40px
  button-pill:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: 6px 14px
  tab-active:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.primary}"
    typography: "{typography.caption}"
    rounded: "{rounded.md}"
    padding: 6px 12px
  tab-inactive:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.md}"
    padding: 6px 12px
  metric-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: 12px 14px
    border: "1px solid {colors.hairline}"
  product-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 10px 12px
    border: "1px solid {colors.hairline-soft}"
  badge-pro:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.micro}"
    rounded: "{rounded.full}"
    padding: 3px 8px
  badge-free:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.muted}"
    typography: "{typography.micro}"
    rounded: "{rounded.full}"
    padding: 3px 8px
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 10px 12px
    border: "1.5px solid {colors.hairline}"
    height: 40px
  text-input-focus:
    border: "1.5px solid {colors.border-focus}"
  popup-header:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    padding: 12px 16px
    borderBottom: "1px solid {colors.hairline}"
  popup-footer:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.muted}"
    padding: 10px 16px
    borderTop: "1px solid {colors.hairline}"
---

## Overview

AmazonScout is a Chrome extension popup for Amazon product research. The design language is **warm, rounded, and friendly** — every element uses soft corners, Scout Orange as a single accent, and a cream-white canvas that feels approachable rather than corporate.

The popup viewport is fixed at **380px wide, up to 560px tall** (Chrome popup constraints). All layout decisions optimize for this compact space: dense-but-breathable metric cards, tab navigation rather than pages, and a sticky header + footer.

**Design Pillars:**
- **Warm warmth:** Scout Orange (`{colors.primary}` — #FF7235) is the only accent. Cream canvas (`{colors.canvas}` — #FFFDF9) instead of pure white gives the UI a friendly, non-clinical feel.
- **Round everything:** No hard corners. Minimum `{rounded.sm}` (8px) on inputs; `{rounded.lg}` (16px) on cards; `{rounded.full}` on badges and pill buttons.
- **Data-forward:** Three metric cards (BSR → sales estimate, FBA fees, Opportunity Score) sit at the top, always visible. Numbers use `{typography.metric}` — the largest type in the system — so the user reads them instantly.
- **Pro vs. Free:** Pro features show a Scout Orange `{component.badge-pro}` pill. Locked features show a grey `{component.badge-free}` pill with "Upgrade" copy. This avoids hiding features entirely — it sells the upgrade.

---

## Colors

### Brand
- **Scout Orange** (`{colors.primary}` — #FF7235): The single accent. Used for primary CTAs, the Pro badge, active tab underline, focus rings, and the logo mark. Never diluted — only one "orange moment" per screen.
- **Scout Orange Hover** (`{colors.primary-hover}` — #E85E22): Press / hover state. Slightly deeper for contrast.
- **Scout Orange Disabled** (`{colors.primary-disabled}` — #FFD4C2): Pale tint on disabled CTAs.

### Surfaces
- **Canvas** (`{colors.canvas}` — #FFFDF9): The popup background — a warm off-white that reduces eye strain. Never pure white.
- **Surface Soft** (`{colors.surface-soft}` — #FFF5EB): Warm cream tint. Used on the active tab background, the popup footer, hover states on rows.
- **Surface Card** (`{colors.surface-card}` — #FFFFFF): Pure white for metric cards and product rows — creates subtle lift against the warm canvas.
- **Surface Strong** (`{colors.surface-strong}` — #F0EDE8): Free-tier badge backgrounds and disabled field fills.

### Text
- **Ink** (`{colors.ink}` — #1C1917): Headlines, metric values, primary labels. Warm near-black.
- **Body** (`{colors.body}` — #44403C): Default body text in product rows.
- **Muted** (`{colors.muted}` — #78716C): Meta text, inactive tabs, help labels.
- **Muted Soft** (`{colors.muted-soft}` — #A8A29E): Placeholder text in inputs.

### Semantic
- **Success** (`{colors.success}` — #16A34A): Positive opportunity scores, subscription active state.
- **Warning** (`{colors.warning}` — #D97706): Medium opportunity scores, past-due subscription banners.
- **Error** (`{colors.error}` — #DC2626): Failed auth, Stripe errors, form validation.

---

## Typography

Inter is used throughout — it's widely available in Chrome extensions without a font load, and its metrics transfer cleanly to the compact popup viewport.

| Token | Size | Weight | Use |
|---|---|---|---|
| `{typography.metric}` | 22px / 700 | -0.5px | BSR rank, sales estimate, fee total — the numbers the user came for |
| `{typography.display-xl}` | 20px / 700 | -0.3px | Product title in Overview tab |
| `{typography.display-md}` | 16px / 600 | 0 | Section heads ("Financials", "Listing") |
| `{typography.title}` | 14px / 600 | 0 | Metric card labels, row titles |
| `{typography.body-md}` | 14px / 400 | 0 | Default body, product descriptions |
| `{typography.body-sm}` | 13px / 400 | 0 | Secondary meta, dates, small prices |
| `{typography.caption}` | 12px / 500 | 0 | Tab labels, field labels, help text |
| `{typography.micro}` | 11px / 600 | 0.3px uppercase | PRO / FREE badges |
| `{typography.button}` | 14px / 600 | 0 | All button labels |

---

## Layout

### Popup Shell
```
┌─────────────────────────────┐  ← popup-header (48px)
│  🔍 AmazonScout    [Pro ●]  │
├─────────────────────────────┤
│  [Overview] [Financials] [Listing]  │  ← tab bar (40px)
├─────────────────────────────┤
│                             │
│   Metric cards (3-up)       │  ← scrollable content zone
│   Product rows / data       │     (max 432px, scrollable)
│                             │
├─────────────────────────────┤
│  Logged in as user@...      │  ← popup-footer (40px)
└─────────────────────────────┘
```

### Spacing
- **Base unit:** 4px.
- **Card internal padding:** `{spacing.md}` (12px) vertical, `{spacing.base}` (16px) horizontal.
- **Between cards:** `{spacing.sm}` (8px) gap.
- **Section padding:** `{spacing.base}` (16px) top/bottom for each tab pane.
- **Popup horizontal gutter:** `{spacing.base}` (16px) on left and right.

### Metric Card Grid
Three cards in a row at 380px wide: each card is ~112px wide with `{spacing.sm}` gutters. Labels in `{typography.caption}` muted above the value in `{typography.metric}` ink.

---

## Elevation

Single shadow tier — same philosophy as Airbnb: either flat or one subtle lift. No nested shadows.

- **Flat:** Canvas, tab bar, rows — 95% of surfaces.
- **Card lift:** `box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)` — metric cards and the popup header. Gives them presence against the warm canvas without visual noise.
- **Focused input:** `box-shadow: 0 0 0 3px rgba(255, 114, 53, 0.2)` — a warm orange glow on focused `{component.text-input}`. No other focus ring style.

---

## Components

### Buttons
- **`button-primary`** — Scout Orange fill, white text, 16px radius, 40px height. Used for "Upgrade to Pro", "Save Product", "Sign In". Only one per screen.
- **`button-secondary`** — White fill, 1.5px hairline border, ink text, 16px radius. Used for "Cancel", "Back", secondary actions.
- **`button-pill`** — Full-radius pill in Scout Orange, 12px caption label. Used inline as "Upgrade" nudge next to locked features.

### Tabs
Three tabs: **Overview / Financials / Listing** — match the architecture's Popup UI panels.
- Active tab: `{component.tab-active}` — warm cream background, Scout Orange text.
- Inactive: `{component.tab-inactive}` — muted text, transparent background.
- Tab bar sits in a `{rounded.xl}` pill container on `{colors.surface-strong}`.

### Metric Cards
Three side-by-side cards showing BSR → Sales Est., FBA Fees, and Opportunity Score. Each card:
- `{component.metric-card}` surface with `{rounded.lg}` corners.
- `{typography.caption}` label in muted above `{typography.metric}` value in ink.
- Opportunity Score card: value color flips to `{colors.success}` (≥70), `{colors.warning}` (40–69), `{colors.error}` (<40).

### Product Rows (Saved Products — Pro)
`{component.product-row}` — warm canvas row, hairline border, `{rounded.md}` corners.
- Left: ASIN + product title in `{typography.title}` / `{typography.body-sm}`.
- Right: price in `{typography.body-sm}` and a delete icon button (circle, `{rounded.full}`).
- On hover: background flips to `{colors.surface-soft}`.

### Badges
- **`badge-pro`** — Scout Orange pill, white "PRO" uppercase micro text.
- **`badge-free`** — Stone grey pill, muted "FREE" uppercase micro text. Sits next to locked-feature labels.

### Forms
- **`text-input`** — Warm white fill, 1.5px hairline border, `{rounded.md}`, 40px height. On focus: border flips to Scout Orange + warm glow ring.
- Labels in `{typography.caption}` muted, stacked above the input.

---

## Do's and Don'ts

**Do:**
- Always use `{colors.canvas}` (#FFFDF9) as the popup background — never pure #ffffff for the root.
- Round every interactive element at minimum `{rounded.sm}` (8px).
- Keep Scout Orange for one primary action per screen — resist adding a second orange CTA.
- Show the metric cards even when a page visit hasn't been scraped yet — display `—` dashes in `{colors.muted}`, not empty space.
- Use `{typography.metric}` for BSR/fees/score values — they're the reason the user opened the popup.

**Don't:**
- Don't use color to differentiate Pro vs. Free feature sections — use the badge system instead.
- Don't add drop shadows to every card — only metric cards and the header get the lift shadow.
- Don't use pure black (#000000) or pure white (#ffffff) as text or background anywhere in the popup root.
- Don't compress the 16px horizontal gutter — the popup feels cramped at 380px; the gutter is the only breathing room.
- Don't add a dark mode — the warm canvas reads comfortably in all ambient conditions; a dark mode adds maintenance cost with little gain for a utility popup.

---

## Responsive Behavior

The popup has no breakpoints — it is a fixed 380px wide Chrome popup. All layout is designed for this single viewport.

- **Scrolling:** Content zone scrolls vertically. Header and footer are sticky (`position: sticky`).
- **Overflow text:** Product titles truncate at 2 lines with `text-overflow: ellipsis`. ASIN always shows in full.
- **Touch targets:** All buttons and tab targets are minimum 40×40px (above WCAG AA for small screens).

---

## Agent Prompt Guide

**Quick token reference:**
- Primary CTA background: `#FF7235`
- Canvas: `#FFFDF9`
- Surface soft (hover, footer): `#FFF5EB`
- Ink: `#1C1917`
- Muted text: `#78716C`
- Border: `#E7E5E4`
- Card radius: `16px`
- Input radius: `12px`
- Badge radius: `9999px`

**Prompt snippet:**
> "Build the AmazonScout popup UI. Use a warm #FFFDF9 canvas, Scout Orange (#FF7235) as the single accent for primary buttons and the Pro badge, Inter font throughout. Round all corners — cards at 16px radius, inputs at 12px, badges fully rounded. Show three metric cards side-by-side for BSR, FBA fees, and Opportunity Score with bold 22px numbers. Three tabs: Overview / Financials / Listing. Pro-locked rows show a grey FREE badge and an inline orange Upgrade pill button."
