import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "../context/cart-context";
import { trialSetBundle } from "../data/product-catalog";

interface RoutineFooterProps {
  cartItems: { id: string; name: string; image: string; price: number; originalPrice: number; frequency: string }[];
  onContinueToCart: () => void;
  onRemoveItem?: (id: string) => void;
}

export default function RoutineFooter({ cartItems, onContinueToCart, onRemoveItem }: RoutineFooterProps) {
  const [expanded, setExpanded] = useState(false);
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);
  const { sizeMode } = useCart();

  const totalItems = cartItems.length;
  const discountedTotal = cartItems.reduce((sum, p) => sum + p.price, 0);
  const originalTotal = cartItems.reduce((sum, p) => sum + p.originalPrice, 0);

  // Subscription items = items where price < originalPrice (i.e. 60% off applied)
  const subscriptionCount = cartItems.filter((p) => p.price < p.originalPrice).length;
  const hasDiscount = subscriptionCount >= 1;

  // Determine the discount message (no GWP for skincare)
  const discountMessage = hasDiscount
    ? "60% off + free shipping applied!"
    : null;

  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartY.current - touchEndY.current;
    const minSwipeDistance = 30; // minimum distance to trigger swipe

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swiped up - expand
        setExpanded(true);
      } else {
        // Swiped down - collapse
        setExpanded(false);
      }
    }

    // Reset
    touchStartY.current = 0;
    touchEndY.current = 0;
  };

  // Trial mode values
  const isTrial = sizeMode === "trial";
  const displayTotal = isTrial ? trialSetBundle.shippingCost : discountedTotal;
  const displayOriginalTotal = isTrial ? trialSetBundle.shippingCost : originalTotal;
  const displayHasDiscount = isTrial ? false : hasDiscount;
  const displayDiscountMessage = isTrial ? null : discountMessage;
  const displayItemCount = isTrial ? 1 : totalItems;

  return (
    <div
      className="bg-white flex flex-col gap-[12px] items-center justify-center pb-[24px] pt-[8px] rounded-t-[10px] shadow-[0px_-2px_4px_0px_rgba(0,0,0,0.1)] w-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Drag handle -- tap to expand/collapse */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center justify-center w-full pt-[2px] pb-[2px] cursor-pointer bg-transparent border-none"
        aria-label={expanded ? "Collapse cart" : "Expand cart"}
      >
        <div className="bg-[#eaeaea] h-[4px] rounded-[4px] w-[42px]" />
      </button>

      <div className="w-full px-[24px] flex flex-col gap-[16px]">
        {/* Expanded item list */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-x-visible overflow-y-clip"
              onClick={() => setExpanded(false)}
            >
              <div className="flex flex-col gap-[4px] pb-[16px]">
                {isTrial ? (
                  <>
                    {/* Trial mode: simple bundle summary */}
                    <p className="font-['Simplon_Mono',monospace] font-medium text-[12px] text-[#323429] tracking-[0.96px] uppercase pb-[8px]">
                      IN YOUR CART
                    </p>
                    <div className="flex items-center gap-[12px] py-[6px]">
                      <div className="flex flex-col flex-1 gap-[2px]">
                        <p className="font-['Simplon_Norm',sans-serif] text-[14px] text-[#323429]">
                          {trialSetBundle.name}
                        </p>
                        <p className="font-['Simplon_Norm',sans-serif] text-[10px] text-[#6c6c6c] tracking-[0.2px]">
                          FREE + ${trialSetBundle.shippingCost.toFixed(2)} shipping
                        </p>
                      </div>
                      <div className="bg-[#ecff92] px-[4px] py-[1px] rounded-[4px]">
                        <p className="font-['Simplon_Norm',sans-serif] font-medium text-[14px] text-[#161716]">
                          FREE
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Full-size mode: individual items */}
                    <p className="font-['Simplon_Mono',monospace] font-medium text-[12px] text-[#323429] tracking-[0.96px] uppercase pb-[8px]">
                      IN YOUR CART
                    </p>

                    {cartItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-[24px] gap-[8px]">
                        <p className="font-['Saol Text',serif] font-light italic text-[16px] text-[#6c6c6c] tracking-[-0.48px] leading-[1.2]">
                          Your cart is empty
                        </p>
                        <p className="font-['Simplon_Norm',sans-serif] text-[12px] text-[#6c6c6c] tracking-[0.24px] leading-[1.5]">
                          Add items from your routine to get started.
                        </p>
                      </div>
                    ) : (
                      <>
                        {cartItems.map((item) => {
                          const isDiscounted = item.price < item.originalPrice;
                          // Format frequency text
                          let frequencyText = "One-time purchase";
                          if (item.frequency !== "buy-once") {
                            const weeksMatch = item.frequency.match(/(\d+)/);
                            if (weeksMatch) {
                              frequencyText = `Auto-ships ${weeksMatch[1]} weeks`;
                            }
                          }
                          return (
                            <div key={item.id} className="flex items-start gap-[12px] py-[6px] group">
                              {/* Thumbnail */}
                              <div className="size-[40px] rounded-[6px] overflow-hidden shrink-0 bg-[#f1ece0]">
                                <img src={item.image} alt={item.name} className="size-full object-cover" />
                              </div>
                              {/* Name & Frequency */}
                              <div className="flex flex-col flex-1 gap-[2px]">
                                <p className="font-['Simplon_Norm',sans-serif] text-[14px] text-[#323429]">{item.name}</p>
                                <p className="font-['Simplon_Norm',sans-serif] text-[10px] text-[#6c6c6c] tracking-[0.2px]">{frequencyText}</p>
                              </div>
                              {/* Price & Remove Button */}
                              <div className="flex gap-[8px] items-start shrink-0">
                                <div className="flex flex-col items-end">
                                  {isDiscounted ? (
                                    <>
                                      <div className="bg-[#ecff92] px-[4px] py-[1px] rounded-[4px]">
                                        <p className="font-['Simplon_Norm',sans-serif] font-medium text-[14px] text-[#161716]">
                                          ${item.price.toFixed(2)}
                                        </p>
                                      </div>
                                      <p className="font-['Simplon_Norm',sans-serif] text-[12px] text-[#6c6c6c] line-through tracking-[0.24px]">
                                        ${item.originalPrice.toFixed(2)}
                                      </p>
                                    </>
                                  ) : (
                                    <p className="font-['Simplon_Norm',sans-serif] font-medium text-[14px] text-[#323429]">
                                      ${item.price.toFixed(2)}
                                    </p>
                                  )}
                                </div>
                                {/* X Button */}
                                {onRemoveItem && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onRemoveItem(item.id);
                                    }}
                                    className="cursor-pointer opacity-40 hover:opacity-100 transition-opacity p-[2px]"
                                    aria-label={`Remove ${item.name}`}
                                  >
                                    <svg className="size-[16px]" fill="none" viewBox="0 0 16 16">
                                      <path d="M12 4L4 12M4 4L12 12" stroke="#323429" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </>
                )}
              </div>
              {/* Divider */}
              <div className="h-px bg-[#e0ddd6] w-full mb-[16px]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order Summary */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between cursor-pointer"
            onClick={() => setExpanded((v) => !v)}
            onTouchEnd={(e) => {
              e.preventDefault();
              setExpanded((v) => !v);
            }}
          >
            <p className="font-['Simplon_Norm',sans-serif] text-[16px] text-[#323429]" style={{ fontWeight: 500 }}>Today's Total (pre-tax)</p>
            {displayHasDiscount ? (
              <div className="flex gap-[8px] items-center leading-[1.5] text-[16px] whitespace-nowrap">
                <p className="font-['Simplon_Norm',sans-serif] text-[16px] text-[#6c6c6c] line-through tracking-[0.32px]">${displayOriginalTotal.toFixed(2)}</p>
                <div className="bg-[#ecff92] p-[4px] rounded-[6px]">
                  <p className="font-['Simplon_Norm',sans-serif] font-medium text-[16px] text-[#161716]">${displayTotal.toFixed(2)}</p>
                </div>
              </div>
            ) : (
              <p className="font-['Simplon_Norm',sans-serif] font-medium text-[16px] text-[#323429]">${displayTotal.toFixed(2)}</p>
            )}
          </div>
          {displayDiscountMessage && (
            <p className="font-['Simplon_Norm',sans-serif] italic text-[10px] text-[#323429] tracking-[0.2px]">{displayDiscountMessage}</p>
          )}
        </div>

        {/* CTA */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onContinueToCart}
          className="bg-[#323429] w-full h-[42px] rounded-[60px] flex items-center justify-center cursor-pointer"
        >
          <p className="font-['Simplon_Mono',monospace] font-medium text-[12px] text-white text-center tracking-[0.96px] uppercase">
            CONTINUE TO CART ({displayItemCount} {displayItemCount === 1 ? "ITEM" : "ITEMS"})
          </p>
        </motion.button>
      </div>
    </div>
  );
}
