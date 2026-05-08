# Skincare Routine Prototype

Interactive prototype for the Prose skincare routine builder — trial set and full-size subscription flows.

**Live:** https://nina-product-design.github.io/Skincare-Routine/
**Figma:** https://www.figma.com/design/J0csH9i9KAdCzJi6qHqHDi/Routine-Cart-Revamp-2026
**Repo:** https://github.com/nina-product-design/Skincare-Routine

---

## Getting Set Up

You need Node.js installed (v18+). If you don't have it, download from https://nodejs.org.

```bash
# 1. Clone the repo
git clone https://github.com/nina-product-design/Skincare-Routine.git
cd Skincare-Routine

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

This opens the prototype at `http://localhost:5173/Skincare-Routine/`. Changes you make to files will hot-reload in the browser instantly.

---

## How the Prototype Works

The prototype has **two modes** controlled by a toggle:

### Trial Mode (default landing)
- Shows a **Complimentary Skincare Starter Set** — one big card with a hero image, 3 trial-size products (Cleanser, Moisturizer, Serum), ingredients, and a subscription info box
- Price: **FREE** + $6.95 shipping
- "Skip the trial — go full size" link at the bottom switches to full-size mode

### Full-Size Mode
- 3 individual product cards with **frequency selectors** (every 4/8/12 weeks or one-time purchase)
- **60% off** first subscription order pricing
- Users can dismiss products — dismissed items appear in an "Add back to your routine" carousel
- "Wanna try us first?" link switches back to trial mode

### User Flow
Results page (skin analysis) → Routine page (trial or full-size) → Cart → Checkout

---

## Pages

| Route | Page | What it does |
|-------|------|-------------|
| `/` | Results | Animated skin analysis — 5 concerns with dot cloud, bar chart, detail carousel |
| `/routine` | Home | Routine builder — trial starter set or full-size individual cards |
| `/cart` | Cart | Shopping cart — adapts to trial ($6.95) vs full-size (subscription pricing) |
| `/checkout` | Checkout | Checkout form with order summary |

---

## Common Tasks

### Change product copy, names, or prices

Edit **`src/app/data/product-catalog.ts`**

Each product is an object with an ID. Find it and change what you need:

```typescript
"custom-cleanser": {
  routineName: "Maggie's Cleanser",          // Display name
  description: "A gentle, pH-balanced...",    // Card description
  size: "8.5 fl oz / 250mL",                 // Size label
  originalPrice: 32,                          // Full retail price
  price: discountedPrice(32),                 // Auto-calculates 60% off
  frequency: "Every 4 weeks (recommended)",   // Default frequency label
  ...
}
```

The trial products (`trial-cleanser`, `trial-moisturizer`, `trial-serum`) are in the same file below the full-size ones.

### Change ingredient names or descriptions

Edit **`src/app/data/ingredients.ts`**

The `skincareIngredientMap` at the bottom maps each product to its 3 ingredients:

```typescript
export const skincareIngredientMap: Record<string, Ingredient[]> = {
  "custom-cleanser": [niacinamide, salicylicAcid, alphaHydroxyAcids],
  "custom-moisturizer": [hyaluronicAcid, ceramides, squalane],
  "custom-serum": [vitaminC, retinol, peptides],
};
```

Each ingredient has `name`, `benefit`, `description`, `extendedDescription`, and `image`. The `{concern}` placeholder in `extendedDescription` becomes a clickable concern link.

### Change skin concern scores or descriptions

Edit **`src/app/components/concern-modal.tsx`**

The `concernDataMap` object has 5 concerns. Change the scores, labels, or descriptions:

```typescript
"Dryness": {
  severityDots: 3,           // 1-3 dots filled
  severityLabel: "Very High",
  percent: 100,              // Score out of 100
  color: "#f69371",          // Bar/dot color
  description: "Your skin is losing moisture quickly...",
  basedOn: [...]             // "Based on" factors shown in modal
}
```

### Change results page scores

Edit **`src/app/pages/results.tsx`**

Find the `analysisMetrics` array near the top. Each metric has a `value` (0.0 to 1.0), `color`, and descriptive text.

### Swap product images

Replace the PNG files in **`src/assets/`**:

| File | Used for |
|------|----------|
| `skincare-mini-stack.png` | Hero image on the starter set card |
| `cleanser-thumb.png` | Cleanser product thumbnail |
| `moisturizer-thumb.png` | Moisturizer product thumbnail |
| `serum-thumb.png` | Serum product thumbnail |
| `ingredient-*.png` | Ingredient circle images |

Keep the same filenames. If you rename them, update the imports in `src/app/data/product-catalog.ts`.

### Change the starter set card layout

Edit **`src/app/components/starter-set-card.tsx`**

This is the big trial mode card with the hero image, "Maggie's Custom Skincare Starter Set" title, and all 3 product sub-cards with ingredient accordions.

### Change the trial/full-size toggle behavior

Edit **`src/app/context/cart-context.tsx`**

The `switchToFullSize()` and `switchToTrial()` functions control what happens when users toggle between modes.

### Change the "How your trial works" or "How membership works" sections

These are in **`src/app/pages/home.tsx`** — search for `HowTrialWorks` or `HowItWorks`.

---

## File Map

```
src/
├── app/
│   ├── components/
│   │   ├── starter-set-card.tsx    ← Trial mode starter set card
│   │   ├── routine-product-card.tsx ← Full-size product cards (with ingredients, frequency)
│   │   ├── concern-modal.tsx        ← Skin concern popup + data
│   │   ├── scoring-modal.tsx        ← Concern scoring breakdown
│   │   ├── frequency-selector.tsx   ← Frequency dropdown on product cards
│   │   ├── frequency-dropdown.tsx   ← Frequency options (4/8/12 weeks, one-time)
│   │   ├── cart-card.tsx            ← Individual cart line items
│   │   ├── cart-drawer.tsx          ← Slide-out cart drawer
│   │   ├── cart-footer.tsx          ← Cart sticky footer with CTA
│   │   ├── cart-order-summary.tsx   ← Order totals breakdown
│   │   ├── routine-footer.tsx       ← Routine page sticky footer
│   │   ├── routine-toast.tsx        ← Add/remove notification toasts
│   │   ├── subscription-info.tsx    ← Subscription perks section
│   │   ├── upsell.tsx               ← "Add back to your routine" carousel
│   │   └── review-card.tsx          ← Customer review cards
│   ├── context/
│   │   └── cart-context.tsx         ← All state: trial/full-size mode, cart, frequencies
│   ├── data/
│   │   ├── product-catalog.ts       ← All product data (6 products: 3 full + 3 trial)
│   │   ├── ingredients.ts           ← Ingredient definitions + product mappings
│   │   ├── carousel-card-assets.ts  ← Carousel image imports
│   │   └── cart-card-assets.ts      ← Cart thumbnail image imports
│   ├── pages/
│   │   ├── home.tsx                 ← Routine builder (trial + full-size modes)
│   │   ├── results.tsx              ← Skin analysis results
│   │   ├── cart.tsx                 ← Cart page
│   │   └── checkout.tsx             ← Checkout page
│   └── routes.ts                    ← URL routing config
├── assets/                          ← All product + ingredient images
├── fonts/                           ← Saol Text font files
└── styles/                          ← CSS (fonts, Tailwind, theme)
```

---

## Deploying Changes

Just push to `main` — GitHub Actions will auto-build and deploy to GitHub Pages.

```bash
git add -A
git commit -m "Description of what you changed"
git push
```

The live site updates in ~2 minutes. Check the deploy status at:
https://github.com/nina-product-design/Skincare-Routine/actions

---

## Design System Reference

This prototype uses the Prose design system:

- **Headings:** Saol Text (serif, light weight, negative letter-spacing)
- **Body text:** Simplon Norm (sans-serif, regular/medium weight)
- **Labels:** Simplon Mono (monospace, always uppercase)
- **Colors:** Warm neutrals (cream #F9F7F2, olive #4D523C / #323429), accent coral (#F69371), highlight lime (#ECFF92)
- **Spacing:** 4px grid (4, 8, 12, 16, 24, 32, 48, 64, 80)
- **Border radius:** 4px (tags), 10px (cards/buttons), 60px (pills)

The full design system spec is in the haircare repo at `~/.claude/commands/designsystem.md`.

---

## Troubleshooting

**Dev server won't start:** Run `npm install` again. Make sure you have Node 18+.

**Images not showing:** Check that the image files exist in `src/assets/`. The imports in `product-catalog.ts` must match the filenames.

**Changes not deploying:** Check https://github.com/nina-product-design/Skincare-Routine/actions for build errors. Make sure GitHub Pages is enabled in repo Settings → Pages → Source: GitHub Actions.

**Need help?** This prototype was built with Claude Code. You can open it in the repo and ask Claude to make changes — it has full context of the codebase.
