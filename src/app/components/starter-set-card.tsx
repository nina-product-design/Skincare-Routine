import { useState } from "react";
import { productCatalog } from "../data/product-catalog";
import { skincareIngredientMap } from "../data/ingredients";
import type { Ingredient } from "./routine-product-card";

import skincareMiniStack from "../../assets/skincare-mini-stack.png";
import cleanserThumb from "../../assets/cleanser-thumb.png";
import moisturizerThumb from "../../assets/moisturizer-thumb.png";
import serumThumb from "../../assets/serum-thumb.png";

// ─── Product config for each sub-card ────────────────────
const subCards = [
  {
    trialId: "trial-cleanser",
    ingredientKey: "custom-cleanser",
    thumb: cleanserThumb,
  },
  {
    trialId: "trial-moisturizer",
    ingredientKey: "custom-moisturizer",
    thumb: moisturizerThumb,
  },
  {
    trialId: "trial-serum",
    ingredientKey: "custom-serum",
    thumb: serumThumb,
  },
] as const;

// ─── Ingredient Accordion ────────────────────────────────
function IngredientAccordion({
  ingredients,
  concerns,
  isOpen,
  onToggle,
}: {
  ingredients: Ingredient[];
  concerns: string[];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="w-[295px] border-b border-[#eaeaea]">
      {/* Header */}
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-[8px] cursor-pointer"
      >
        <div className="flex items-center gap-[8px]">
          <p className="font-['Simplon Mono',monospace] font-medium text-[12px] text-[#4d523c] tracking-[0.96px] uppercase leading-[1.2]">
            YOUR KEY INGREDIENTS
          </p>
        </div>
        {isOpen ? (
          <svg width="12" height="2" viewBox="0 0 12 2" fill="none" className="shrink-0">
            <path d="M0 1H12" stroke="#323429" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
            <path d="M6 0V12" stroke="#323429" strokeLinecap="round" />
            <path d="M0 6H12" stroke="#323429" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {/* Collapsed: ingredient circle thumbnails + names */}
      {!isOpen && (
        <div className="flex items-center gap-[8px] pb-[12px]">
          <div className="flex items-center">
            {ingredients.map((ing, i) => (
              <div
                key={ing.name}
                className="w-[49px] h-[49px] rounded-full overflow-hidden border-[2.77px] border-white shrink-0"
                style={{ marginLeft: i > 0 ? "-12px" : 0 }}
              >
                <img
                  alt={ing.name}
                  className="size-full object-cover"
                  src={ing.image}
                />
              </div>
            ))}
          </div>
          <p className="font-['Simplon Norm',sans-serif] text-[12px] text-[#6c6c6c] leading-[1.5]">
            {ingredients.map((ing) => ing.name).join(", ")}
          </p>
        </div>
      )}

      {/* Expanded: individual ingredient rows */}
      {isOpen && (
        <div className="flex flex-col pb-[8px]">
          {ingredients.map((ingredient, i) => {
            const linkedConcern = concerns[i % concerns.length];
            return (
              <div
                key={ingredient.name}
                className={`flex flex-col py-[8px] ${i < ingredients.length - 1 ? "border-b border-[#eaeaea]" : ""}`}
              >
                <div className="flex items-center gap-[8px]">
                  <div className="h-[40px] w-[32px] shrink-0">
                    <img
                      alt={ingredient.name}
                      className="size-full object-cover"
                      src={ingredient.image}
                    />
                  </div>
                  <p className="font-['Simplon Norm',sans-serif] font-medium text-[12px] text-[#4d523c] leading-[1.5]">
                    {ingredient.name}
                  </p>
                </div>
                {ingredient.extendedDescription && linkedConcern && (
                  <div className="pl-[40px] pr-[24px] pt-[2px]">
                    <p className="font-['Simplon Norm',sans-serif] text-[12px] text-[#4d523c] tracking-[0.24px] leading-[1.5]">
                      {ingredient.extendedDescription.replace(
                        "{concern}",
                        ""
                      )}
                      <span className="underline">
                        {linkedConcern.toLowerCase()}
                      </span>
                      .
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Product Sub-Card ────────────────────────────────────
function ProductSubCard({
  trialId,
  ingredientKey,
  thumb,
  isLast,
  ingredientOpen,
  onToggleIngredient,
}: {
  trialId: string;
  ingredientKey: string;
  thumb: string;
  isLast: boolean;
  ingredientOpen: boolean;
  onToggleIngredient: () => void;
}) {
  const product = productCatalog[trialId];
  const ingredients = skincareIngredientMap[ingredientKey] || [];
  const concerns = product?.concerns || [];

  if (!product) return null;

  return (
    <div className="bg-white w-[327px] flex flex-col items-center">
      {/* Header row: thumbnail + title */}
      <div className="w-full px-[16px] py-[8px]">
        <div className="flex items-start gap-[4px]">
          <div className="w-[67px] h-[93px] rounded-[6px] overflow-hidden shrink-0 bg-[#f1ece0]">
            <img
              alt={product.routineName}
              className="size-full object-cover"
              src={thumb}
            />
          </div>
          <p className="font-['Saol Text',serif] font-light text-[24px] text-[#323429] tracking-[-0.72px] leading-[1.1] pt-[4px]">
            {product.routineName}
          </p>
        </div>
      </div>

      {/* Content area */}
      <div className="w-full px-[16px] flex flex-col gap-[24px] items-center pb-[16px]">
        {/* Description */}
        <p className="font-['Simplon Norm',sans-serif] text-[14px] text-[#4d523c] tracking-[0.28px] leading-[1.5] w-full">
          {product.description as string}
        </p>

        {/* Size + link row */}
        <div className="flex items-center gap-[12px] w-full">
          <p className="font-['Simplon Norm',sans-serif] text-[12px] text-[#323429] leading-[1.5]">
            Trial size{"\u2014"}1.7 fl oz.
          </p>
          <button className="font-['Simplon Norm',sans-serif] text-[12px] text-[#4d523c] tracking-[0.24px] leading-[1.5] underline cursor-pointer shrink-0">
            See full details
          </button>
        </div>

        {/* Ingredient accordion */}
        <IngredientAccordion
          ingredients={ingredients}
          concerns={concerns}
          isOpen={ingredientOpen}
          onToggle={onToggleIngredient}
        />

        {/* Subscription Info Box — only on last card (serum) */}
        {isLast && (
          <div className="pt-[16px] relative w-full flex flex-col items-center">
            <div className="w-[295px] rounded-[10px] border border-[#e2d9c2] px-[12px] py-[16px] relative">
              {/* "Added to cart" floating label */}
              <div className="absolute top-[-8px] left-[8px] bg-white px-[4px] flex gap-[4px] items-center">
                <svg className="size-[11px] shrink-0" viewBox="0 0 11.28 11.28" fill="none">
                  <circle cx="5.64" cy="5.64" r="5.64" fill="#B9C2A6" />
                  <path
                    d="M2.82 6.58L4.91 9.09C5.6 7.69 7.42 4.49 9.09 2.82"
                    stroke="white"
                    strokeWidth="0.63"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="font-['Simplon Norm',sans-serif] text-[10px] text-[#161716] tracking-[0.2px] leading-[1.5] whitespace-nowrap">
                  Added to cart
                </p>
              </div>

              {/* Box content */}
              <p className="font-['Simplon Norm',sans-serif] text-[12px] text-[#323429] tracking-[0.24px] leading-[1.5]">
                Your subscription begins with a{" "}
                <span className="font-medium">FREE Skincare Starter Set</span>
                {" "}&mdash; made to order, just for you.
              </p>
            </div>

            {/* Subtitle below box */}
            <div className="px-[28px] pt-[8px]">
              <p className="font-['Simplon Norm',sans-serif] text-[10px] text-[#6c6c6c] tracking-[0.2px] leading-[1.5]">
                Your full-size products will ship every 8 weeks. Cancel or
                modify anytime.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── StarterSetCard (main export) ────────────────────────
export default function StarterSetCard() {
  const [openAccordions, setOpenAccordions] = useState<Record<number, boolean>>({
    0: false,
    1: false,
    2: false,
  });

  const toggleAccordion = (index: number) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="w-[327px] flex flex-col overflow-hidden">
      {/* 1. Hero Image Section */}
      <div className="w-[327px] h-[200px] relative rounded-t-[10px] overflow-hidden">
        <img
          alt="Skincare mini stack"
          className="absolute inset-0 w-full h-full object-cover"
          src={skincareMiniStack}
        />
        {/* Floating product name tags */}
        <div
          className="absolute bg-transparent px-[8px] py-[4px] rounded-t-[4px]"
          style={{ left: 52, top: 100 }}
        >
          <p className="font-['Simplon Norm',sans-serif] text-[12px] text-[#4d523c] tracking-[0.24px] leading-[1.5]">
            Cleanser
          </p>
        </div>
        <div
          className="absolute bg-transparent px-[8px] py-[4px] rounded-t-[4px]"
          style={{ left: 204, top: 74 }}
        >
          <p className="font-['Simplon Norm',sans-serif] text-[12px] text-[#4d523c] tracking-[0.24px] leading-[1.5]">
            Serum
          </p>
        </div>
        <div
          className="absolute bg-transparent px-[8px] py-[4px] rounded-t-[4px]"
          style={{ left: 223, top: 144 }}
        >
          <p className="font-['Simplon Norm',sans-serif] text-[12px] text-[#4d523c] tracking-[0.24px] leading-[1.5]">
            Moisturizer
          </p>
        </div>
      </div>

      {/* 2. Starter Set Info */}
      <div className="bg-white p-[24px] flex flex-col gap-[12px]">
        <p className="font-['Saol Text',serif] font-light text-[32px] text-[#323429] tracking-[-0.96px] leading-[1.1]">
          Maggie&rsquo;s Custom Skincare Starter Set
        </p>
        <p className="font-['Simplon Norm',sans-serif] text-[14px] text-[#6c6c6c] tracking-[0.28px] leading-[1.5]">
          Your unique formulas, in trial size &mdash; made with ingredients
          selected just for your skin.
        </p>
        <div className="flex flex-col gap-[8px]">
          <p className="font-['Simplon Mono',monospace] font-medium text-[12px] text-[#4d523c] tracking-[0.96px] uppercase leading-[1.2]">
            YOUR PREFERENCES
          </p>
          <p className="font-['Simplon Norm',sans-serif] text-[12px] text-[#4d523c] tracking-[0.24px] leading-[1.5]">
            Fragrance free.
          </p>
        </div>
      </div>

      {/* 3. Divider */}
      <div className="bg-white flex justify-center">
        <div className="h-px bg-[#e2d9c2] w-[288px]" />
      </div>

      {/* 4. Three Product Sub-Cards */}
      {subCards.map((card, index) => (
        <ProductSubCard
          key={card.trialId}
          trialId={card.trialId}
          ingredientKey={card.ingredientKey}
          thumb={card.thumb}
          isLast={index === subCards.length - 1}
          ingredientOpen={!!openAccordions[index]}
          onToggleIngredient={() => toggleAccordion(index)}
        />
      ))}
    </div>
  );
}
