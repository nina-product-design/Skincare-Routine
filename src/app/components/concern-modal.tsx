// ─── Concern Detail Modal ─────────────────────────────────
// Popup that appears when a user taps a targeted concern pill.

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

// ─── Concern Data ─────────────────────────────────────────

export interface BasedOnFactor {
  label: string;
  icon: "heat" | "sun" | "calendar" | "stressed" | "head" | "drop";
  value: string;
}

export interface ConcernDetail {
  label: string;
  severityDots: number; // 1–5, filled dots out of 5
  severityLabel: string;
  percent: number;
  color: string;
  description: string;
  basedOn: BasedOnFactor[];
}

export const concernDataMap: Record<string, ConcernDetail> = {
  "Dryness": {
    label: "Dryness",
    severityDots: 3,
    severityLabel: "Very High",
    percent: 100,
    color: "#f69371",
    description:
      "Your skin is losing moisture quickly. Your formula will deeply hydrate and strengthen your moisture barrier for lasting comfort.",
    basedOn: [
      { label: "Sun exposure", icon: "sun", value: "High" },
      { label: "Skin type", icon: "drop", value: "Dry/Combo" },
      { label: "Climate", icon: "heat", value: "Arid" },
    ],
  },
  "Skin Maturity": {
    label: "Skin Maturity",
    severityDots: 3,
    severityLabel: "High",
    percent: 90,
    color: "#f69371",
    description:
      "Signs of aging are becoming visible. Your formula will target fine lines and support collagen production for firmer, more resilient skin.",
    basedOn: [
      { label: "Age range", icon: "calendar", value: "30-39" },
      { label: "Sun exposure", icon: "sun", value: "High" },
      { label: "Skincare history", icon: "head", value: "Minimal" },
    ],
  },
  "Oiliness": {
    label: "Oiliness",
    severityDots: 2,
    severityLabel: "Moderate",
    percent: 60,
    color: "#EABF6F",
    description:
      "Your T-zone shows excess oil production. Your formula will balance sebum without stripping, keeping skin matte where it matters.",
    basedOn: [
      { label: "Skin type", icon: "drop", value: "Oily T-zone" },
      { label: "Climate", icon: "heat", value: "Humid" },
      { label: "Washing", icon: "calendar", value: "2x daily" },
    ],
  },
  "Skin Barrier": {
    label: "Skin Barrier",
    severityDots: 2,
    severityLabel: "Moderate",
    percent: 60,
    color: "#EABF6F",
    description:
      "Your skin barrier shows signs of compromise. Your formula will include ceramides and nourishing actives to restore and protect.",
    basedOn: [
      { label: "Exfoliation", icon: "heat", value: "Frequent" },
      { label: "Sensitivity", icon: "head", value: "Occasional" },
      { label: "Products used", icon: "calendar", value: "Many" },
    ],
  },
  "Hyperpigmentation": {
    label: "Hyperpigmentation",
    severityDots: 1,
    severityLabel: "Low",
    percent: 40,
    color: "#B9C2A6",
    description:
      "You have mild uneven tone. Your formula will include brightening actives to gently even out discoloration over time.",
    basedOn: [
      { label: "Sun exposure", icon: "sun", value: "Moderate" },
      { label: "Skin tone", icon: "drop", value: "Medium" },
      { label: "Breakout history", icon: "stressed", value: "Occasional" },
    ],
  },
};

// ─── Component ────────────────────────────────────────────

interface ConcernModalProps {
  concern: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ConcernModal({
  concern,
  isOpen,
  onClose,
}: ConcernModalProps) {
  const data = concern ? concernDataMap[concern] : null;

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && data && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-[24px]"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="bg-white flex flex-col gap-[4px] items-start overflow-clip px-[12px] py-[16px] relative rounded-[10px] w-full max-w-[327px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: pill + close */}
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col items-start px-[12px] py-[4px] relative rounded-[20px]">
                <div
                  aria-hidden="true"
                  className="absolute border border-[#e2d9c2] border-solid inset-0 pointer-events-none rounded-[20px]"
                />
                <p className="font-['Simplon Norm',sans-serif] leading-[1.5] text-[#323429] text-[12px] tracking-[0.24px] whitespace-nowrap">
                  {data.label}
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex items-center justify-center size-[32px] relative cursor-pointer"
                aria-label="Close"
              >
                {/* Circle bg */}
                <svg
                  className="absolute inset-0 size-full"
                  fill="none"
                  viewBox="0 0 32 32"
                >
                  <circle cx="16" cy="16" r="16" fill="white" opacity="0.5" />
                </svg>
                {/* X icon */}
                <svg
                  className="relative size-[12px]"
                  fill="none"
                  viewBox="0 0 12 12"
                >
                  <line
                    x1="0.63"
                    y1="0.63"
                    x2="11.37"
                    y2="11.37"
                    stroke="#323429"
                    strokeWidth="0.9"
                    strokeLinecap="square"
                  />
                  <line
                    x1="11.37"
                    y1="0.63"
                    x2="0.63"
                    y2="11.37"
                    stroke="#323429"
                    strokeWidth="0.9"
                    strokeLinecap="square"
                  />
                </svg>
              </button>
            </div>

            {/* Severity dots + label */}
            <div className="flex gap-[8px] items-center py-[4px] w-full">
              <div className="flex gap-[4px]">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className={`size-[9px] rounded-full ${
                      i < data.severityDots
                        ? "bg-[#f69371]"
                        : "bg-[#e8e4db]"
                    }`}
                  />
                ))}
              </div>
              <p className="font-['Simplon Norm',sans-serif] text-[#323429] text-[12px] tracking-[0.24px] leading-[1.5]">
                {data.severityLabel}
              </p>
            </div>

            {/* Body */}
            <div className="pb-[8px] w-full">
              <p className="font-['Simplon Norm',sans-serif] text-[14px] text-black tracking-[0.28px] leading-[1.5]">
                {data.description}
              </p>
            </div>

            {/* Based on */}
            <div className="flex flex-col gap-[4px] items-start pt-[8px] w-full border-t border-[#f1ece0]">
              <p className="font-['Simplon Mono',monospace] text-[#4d523c] text-[10px] tracking-[0.8px] uppercase leading-[1.2]">
                Based on:
              </p>
              <ul className="font-['Simplon Norm',sans-serif] text-[#161716] text-[12px] tracking-[0.24px] leading-[1.5]">
                {data.basedOn.map((reason) => (
                  <li key={reason} className="list-disc ms-[18px]">
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
