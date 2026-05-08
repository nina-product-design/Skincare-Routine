// ─── Product Catalog ──────────────────────────────────────
// Unified data for rendering products in both the upsell carousel
// and the routine cart (as RoutineProductCard or RoutineProductCardAccessory).

import type { Ingredient } from "../components/routine-product-card";
// Carousel images (reusing haircare placeholders for now)
import {
  CarouselCardShampoo,
  CarouselCardConditioner,
  CarouselCardScalpMask,
} from "./carousel-card-assets";
import { skincareIngredientMap } from "./ingredients";

// Skincare product images from Figma
import imgCleanserThumb from "../../assets/cleanser-thumb.png";
import imgMoisturizerThumb from "../../assets/moisturizer-thumb.png";
import imgSerumThumb from "../../assets/serum-thumb.png";
import imgMiniStack from "../../assets/skincare-mini-stack.png";

export { imgMiniStack };

// ─── Types ────────────────────────────────────────────

/** "full" = RoutineProductCard (concerns/ingredients/preferences) */
/** "simple" = RoutineProductCardAccessory (description-only) */
export type CardType = "full" | "simple";

export interface CatalogProduct {
  id: string;
  cardType: CardType;
  category: "skincare" | "skincare-trial";
  sizeVariant?: "full" | "trial";
  // Upsell carousel fields
  carouselName: string;
  carouselImage: string;
  upsellTag?: string;
  // Routine card fields
  routineName: string;
  routineImage: string;
  description: string | string[];
  size: string;
  badge: string;
  price: number;
  originalPrice: number;
  // Backend flag for "Recommended" tag
  isRecommended?: boolean;
  // Full-card-only fields (skincare)
  concerns?: string[];
  ingredients?: Ingredient[];
  preferences?: string;
  frequency?: string;
  discountLabel?: string;
}

// ─── Helpers ──────────────────────────────────────────────

function discountedPrice(original: number): number {
  return Math.round(original * 0.4 * 100) / 100;
}

// ─── Catalog ──────────────────────────────────────────────

export const productCatalog: Record<string, CatalogProduct> = {
  // ── Full-Size Skincare ─────────────────────────────────
  "custom-cleanser": {
    id: "custom-cleanser",
    cardType: "full",
    category: "skincare",
    sizeVariant: "full",
    carouselName: "Custom Cleanser",
    carouselImage: CarouselCardShampoo,
    upsellTag: "Recommended",
    routineName: "Maggie's Cleanser",
    routineImage: imgCleanserThumb,
    description:
      "A gentle, pH-balanced cleanser that removes impurities without stripping your skin's natural moisture barrier.",
    size: "8.5 fl oz / 250mL",
    badge: "Recommended",
    price: discountedPrice(32),
    originalPrice: 32,
    isRecommended: true,
    concerns: ["Dryness", "Skin Maturity", "Oiliness"],
    ingredients: skincareIngredientMap["custom-cleanser"],
    frequency: "Every 4 weeks (recommended)",
    discountLabel: "60% off first subscription order",
  },

  "custom-moisturizer": {
    id: "custom-moisturizer",
    cardType: "full",
    category: "skincare",
    sizeVariant: "full",
    carouselName: "Custom Moisturizer",
    carouselImage: CarouselCardConditioner,
    upsellTag: "Recommended",
    routineName: "Maggie's Moisturizer",
    routineImage: imgMoisturizerThumb,
    description:
      "A rich, fast-absorbing moisturizer that locks in hydration and strengthens your skin barrier all day long.",
    size: "1.7 fl oz / 50mL",
    badge: "Recommended",
    price: discountedPrice(38),
    originalPrice: 38,
    isRecommended: true,
    concerns: ["Dryness", "Skin Barrier", "Hyperpigmentation"],
    ingredients: skincareIngredientMap["custom-moisturizer"],
    frequency: "Every 8 weeks (recommended)",
    discountLabel: "60% off first subscription order",
  },

  "custom-serum": {
    id: "custom-serum",
    cardType: "full",
    category: "skincare",
    sizeVariant: "full",
    carouselName: "Custom Serum",
    carouselImage: CarouselCardScalpMask,
    upsellTag: "Recommended",
    routineName: "Maggie's Serum",
    routineImage: imgSerumThumb,
    description:
      "A potent, lightweight serum packed with active ingredients to target fine lines, uneven tone, and loss of firmness.",
    size: "1.0 fl oz / 30mL",
    badge: "Recommended",
    price: discountedPrice(48),
    originalPrice: 48,
    isRecommended: true,
    concerns: ["Skin Maturity", "Hyperpigmentation", "Skin Barrier"],
    ingredients: skincareIngredientMap["custom-serum"],
    frequency: "Every 8 weeks (recommended)",
    discountLabel: "60% off first subscription order",
  },

  // ── Trial-Size Skincare ────────────────────────────────
  "trial-cleanser": {
    id: "trial-cleanser",
    cardType: "full",
    category: "skincare-trial",
    sizeVariant: "trial",
    carouselName: "",
    carouselImage: "",
    routineName: "Maggie's Cleanser",
    routineImage: imgCleanserThumb,
    description: "A gentle yet effective cream cleanser for protecting the skin barrier.",
    size: "Trial size — 1.7 fl oz",
    badge: "Cleanser",
    price: 0,
    originalPrice: 0,
    isRecommended: false,
    concerns: ["Dryness", "Skin Maturity", "Oiliness"],
    ingredients: skincareIngredientMap["custom-cleanser"],
    preferences: "Fragrance free.",
  },

  "trial-moisturizer": {
    id: "trial-moisturizer",
    cardType: "full",
    category: "skincare-trial",
    sizeVariant: "trial",
    carouselName: "",
    carouselImage: "",
    routineName: "Maggie's Moisturizer",
    routineImage: imgMoisturizerThumb,
    description: "A gentle yet effective cream moisturizer for protecting the skin barrier.",
    size: "Trial size — 1.7 fl oz",
    badge: "Moisturizer",
    price: 0,
    originalPrice: 0,
    isRecommended: false,
    concerns: ["Dryness", "Skin Barrier", "Hyperpigmentation"],
    ingredients: skincareIngredientMap["custom-moisturizer"],
    preferences: "Fragrance free.",
  },

  "trial-serum": {
    id: "trial-serum",
    cardType: "full",
    category: "skincare-trial",
    sizeVariant: "trial",
    carouselName: "",
    carouselImage: "",
    routineName: "Maggie's Serum",
    routineImage: imgSerumThumb,
    description: "A potent, lightweight serum packed with active ingredients to target fine lines and uneven tone.",
    size: "Trial size — 1.7 fl oz",
    badge: "Serum",
    price: 0,
    originalPrice: 0,
    isRecommended: false,
    concerns: ["Skin Maturity", "Hyperpigmentation", "Skin Barrier"],
    ingredients: skincareIngredientMap["custom-serum"],
    preferences: "Fragrance free.",
  },
};

// ─── Initial State ────────────────────────────────────────

/** Full-size products that start in the routine cart */
export const initialFullSizeIds: string[] = [
  "custom-cleanser",
  "custom-moisturizer",
  "custom-serum",
];

/** Trial-size products */
export const initialTrialIds: string[] = [
  "trial-cleanser",
  "trial-moisturizer",
  "trial-serum",
];

/** Products that start in the upsell carousel (none for skincare) */
export const initialUpsellIds: string[] = [];

/** Trial set bundle */
export const trialSetBundle = {
  name: "Skincare Starter Set",
  description: "Your unique formulas, in trial size.",
  products: ["trial-cleanser", "trial-moisturizer", "trial-serum"],
  price: 0,
  shippingCost: 6.95,
  tagline: "Complimentary — just $6.95 shipping",
};
