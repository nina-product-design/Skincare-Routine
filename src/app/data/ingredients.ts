// ─── Ingredient Image Assets ──────────────────────────────
import BambooCharcoal from "figma:asset/cc9000c0f2a0e94300f5e415c862552771eaf342.png";
import Grapefruit from "figma:asset/a044005a180c119aea6ed31fd4e24d0d5ceed41a.png";
import HyaluronicAcidImg from "figma:asset/b905eaf42599e5d39111874f5032eaedd5903802.png";
import JojobaBeads from "figma:asset/bca3ad5aa7a2f62625b080f7fbd9837d2658f8d5.png";
import Sandalwood from "figma:asset/6ac32400a5dfce61b9c1775858e0d709cf5a4dd2.png";
import PinkClay from "figma:asset/f04c796f56b0261b9d6053b7f380356e62c33a53.png";
import RosehipExtract from "figma:asset/8d45a73898437b5e383ecf789fc5af8a15daf0af.png";
import RedAlgae from "figma:asset/3921d518d397f4762086d21378c4fd3a9ff8cd7c.png";
import GreenTea from "figma:asset/b2af4fefac86866bda16ebdf0676ec5d4518fc12.png";

import type { Ingredient } from "../components/routine-product-card";

// ─── Ingredient Definitions ───────────────────────────────

export const ingredientNiacinamide: Ingredient = {
  name: "Niacinamide",
  benefit: "Brightening",
  description: "Brightens skin and reduces pore appearance.",
  extendedDescription: "Brightens skin and minimizes pores to help manage your {concern}.",
  image: GreenTea,
};

export const ingredientHyaluronicAcid: Ingredient = {
  name: "Hyaluronic Acid",
  benefit: "Deep Hydration",
  description: "Intense hydration that plumps and smooths.",
  extendedDescription: "Draws moisture deep into skin to plump and smooth, helping manage your {concern}.",
  image: HyaluronicAcidImg,
};

export const ingredientVitaminC: Ingredient = {
  name: "Vitamin C",
  benefit: "Radiance Boost",
  description: "Antioxidant protection and radiance boosting.",
  extendedDescription: "Powerful antioxidant that boosts radiance to help manage your {concern}.",
  image: Grapefruit,
};

export const ingredientRetinol: Ingredient = {
  name: "Retinol",
  benefit: "Cell Renewal",
  description: "Accelerates cell turnover for smoother texture.",
  extendedDescription: "Accelerates cell turnover for smoother, refined skin to help manage your {concern}.",
  image: Sandalwood,
};

export const ingredientCeramides: Ingredient = {
  name: "Ceramides",
  benefit: "Barrier Repair",
  description: "Restores and strengthens the skin barrier.",
  extendedDescription: "Restores and strengthens your skin barrier to help manage your {concern}.",
  image: PinkClay,
};

export const ingredientSalicylicAcid: Ingredient = {
  name: "Salicylic Acid",
  benefit: "Pore Clearing",
  description: "Clears pores and controls excess oil.",
  extendedDescription: "Penetrates pores to clear buildup and control oil, helping manage your {concern}.",
  image: BambooCharcoal,
};

export const ingredientPeptides: Ingredient = {
  name: "Peptides",
  benefit: "Firmness Support",
  description: "Supports collagen production for firmness.",
  extendedDescription: "Supports natural collagen production for firmer skin to help manage your {concern}.",
  image: RedAlgae,
};

export const ingredientSqualane: Ingredient = {
  name: "Squalane",
  benefit: "Lightweight Moisture",
  description: "Lightweight moisture that mimics skin's natural oils.",
  extendedDescription: "Mimics skin's natural oils for effortless hydration to help manage your {concern}.",
  image: RosehipExtract,
};

export const ingredientAHAs: Ingredient = {
  name: "Alpha Hydroxy Acids",
  benefit: "Gentle Exfoliation",
  description: "Gently exfoliates for a brighter complexion.",
  extendedDescription: "Gently dissolves dead skin cells for a brighter complexion to help manage your {concern}.",
  image: JojobaBeads,
};

// ─── All Ingredients ──────────────────────────────────────
export const allIngredients: Ingredient[] = [
  ingredientNiacinamide,
  ingredientHyaluronicAcid,
  ingredientVitaminC,
  ingredientRetinol,
  ingredientCeramides,
  ingredientSalicylicAcid,
  ingredientPeptides,
  ingredientSqualane,
  ingredientAHAs,
];

// ─── Ingredient Assignments per Skincare Product ──────────
// Each skincare product gets 3 unique ingredients, chosen
// based on product type and targeted skin concerns.

export const skincareIngredientMap: Record<string, Ingredient[]> = {
  // Cleanser: brightening, pore clearing, gentle exfoliation
  "custom-cleanser": [
    ingredientNiacinamide,
    ingredientSalicylicAcid,
    ingredientAHAs,
  ],
  // Moisturizer: hydration, barrier repair, lightweight moisture
  "custom-moisturizer": [
    ingredientHyaluronicAcid,
    ingredientCeramides,
    ingredientSqualane,
  ],
  // Serum: radiance, cell renewal, firmness
  "custom-serum": [
    ingredientVitaminC,
    ingredientRetinol,
    ingredientPeptides,
  ],
};
