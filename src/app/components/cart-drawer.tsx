import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { productCatalog, trialSetBundle } from "../data/product-catalog";
import { cartImageDataMap } from "../data/cart-card-assets";
import { useCart } from "../context/cart-context";
import svgPaths from "../../imports/svg-2v3l6hopxe";
import imgProseProducts from "figma:asset/f065ce6884812a19ea915c647498674a16334e77.png";
import SubscriptionInfo from "./subscription-info";
import CartCard from "./cart-card";
import Upsell from "./upsell";
import CartOrderSummary from "./cart-order-summary";
import CartFooter from "./cart-footer";

// ─── Types ────────────────────────────────────────────────
interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout?: () => void;
}

// ─── Helper Functions ─────────────────────────────────────
function getFrequencyText(frequency: string, productId?: string): string {
  if (frequency === "buy-once") return "One-time purchase";
  const weeksMatch = frequency.match(/(\d+)/);
  if (weeksMatch) {
    const weeks = weeksMatch[1];
    let isRecommended = false;
    if (productId) {
      const product = productCatalog[productId];
      if (product?.frequency) {
        const catalogMatch = product.frequency.match(/(\d+)/);
        isRecommended = !!catalogMatch && catalogMatch[1] === weeks;
      }
    }
    return `Auto-ships every ${weeks} weeks${isRecommended ? " (recommended)" : ""}`;
  }
  return "One-time purchase";
}

// ─── Icon Components ──────────────────────────────────────
function CloseIcon() {
  return (
    <svg className="size-[24px]" fill="none" viewBox="0 0 23.15 23.15">
      <path d={svgPaths.p28ba7000} fill="black" />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────
export default function CartDrawer({
  isOpen,
  onClose,
  onCheckout,
}: CartDrawerProps) {
  const navigate = useNavigate();
  const {
    sizeMode,
    routineCartIds,
    upsellIds,
    productFrequencies,
    handleDismissFromRoutine,
    getCurrentPrice,
    switchToFullSize,
    switchToTrial,
  } = useCart();

  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(routineCartIds.map((id) => [id, 1]))
  );

  // Calculate totals
  const subtotal = routineCartIds.reduce((sum, id) => {
    const product = productCatalog[id];
    if (!product) return sum;
    const currentPrice = getCurrentPrice(id, product.originalPrice, product.price);
    const qty = quantities[id] || 1;
    return sum + currentPrice * qty;
  }, 0);

  const originalSubtotal = routineCartIds.reduce((sum, id) => {
    const product = productCatalog[id];
    if (!product) return sum;
    const qty = quantities[id] || 1;
    return sum + product.originalPrice * qty;
  }, 0);

  const savings = originalSubtotal - subtotal;
  const hasDiscount = savings > 0;

  const hasSubscription = routineCartIds.some(
    (id) => productFrequencies[id] && productFrequencies[id] !== "buy-once"
  );
  const shippingCost = hasSubscription ? 0 : 6.95;
  const todaysTotal = subtotal + shippingCost;

  const discountMessage = hasSubscription
    ? "60% off + free shipping applied!"
    : null;

  const handleIncrement = (id: string) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 1) + 1 }));
  };

  const handleDecrement = (id: string) => {
    const currentQty = quantities[id] || 1;
    if (currentQty <= 1) {
      handleRemove(id);
    } else {
      setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 1) - 1 }));
    }
  };

  const handleRemove = (id: string) => {
    handleDismissFromRoutine(id);
    setQuantities((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  // Trial product names for subtitle
  const trialProductNames = trialSetBundle.products
    .map((id) => productCatalog[id]?.routineName)
    .filter(Boolean);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - scoped to the 375px app container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onClick={onClose}
            className="fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-[375px] bg-black/40 z-[100]"
          />

          {/* Drawer clip container - constrains slide animation to 375px */}
          <div className="fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-[375px] z-[101] overflow-hidden pointer-events-none">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute top-0 bottom-0 left-0 w-[375px] bg-white overflow-y-auto overflow-x-hidden scrollbar-hide pointer-events-auto flex flex-col"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white z-10 border-b border-[#eaeaea] w-full">
                <div className="flex items-center justify-between px-[24px] py-[16px]">
                  <div className="flex gap-[8px] items-center">
                    <p className="font-['Simplon_Norm',sans-serif] font-medium text-[20px] text-black leading-[1.5]">Cart:</p>
                    <div className="flex gap-[4px] items-center">
                      <p className="font-['Simplon_Norm',sans-serif] font-medium text-[20px] text-black leading-[1.5]">
                        {sizeMode === "trial" ? "1" : routineCartIds.length}
                      </p>
                      <p className="font-['Simplon_Norm',sans-serif] font-medium text-[20px] text-black leading-[1.5]">
                        {sizeMode === "trial" ? "item" : "items"}
                      </p>
                    </div>
                  </div>
                  <button onClick={onClose} className="cursor-pointer">
                    <CloseIcon />
                  </button>
                </div>
              </div>

              {sizeMode === "trial" ? (
                <>
                  {/* Trial Mode Content */}
                  <div className="px-[24px] w-full">
                    <div className="flex items-center justify-between py-[16px] border-b border-[#eaeaea]">
                      <p className="font-['Simplon_Norm',sans-serif] text-[16px] text-[#161716] tracking-[0.32px] leading-[1.5]">Your Routine</p>
                    </div>

                    <div className="flex gap-[16px] items-start py-[16px] border-b border-[#eaeaea]">
                      <div className="w-[80px] h-[80px] shrink-0 rounded-[6px] overflow-hidden bg-[#f1ece0]">
                        <img src={imgProseProducts} alt={trialSetBundle.name} className="size-full object-cover" />
                      </div>
                      <div className="flex flex-col flex-1 gap-[4px]">
                        <p className="font-['Simplon_Norm',sans-serif] font-medium text-[16px] text-[#161716] leading-[1.5]">
                          {trialSetBundle.name}
                        </p>
                        <p className="font-['Simplon_Norm',sans-serif] text-[12px] text-[#6c6c6c] tracking-[0.24px] leading-[1.5]">
                          {trialProductNames.join(", ")}
                        </p>
                        <div className="bg-[#ecff92] rounded-[4px] px-[8px] py-[2px] self-start mt-[4px]">
                          <p className="font-['Simplon_Norm',sans-serif] font-medium text-[14px] text-[#161716]">FREE</p>
                        </div>
                      </div>
                    </div>

                    {/* Switch to full size */}
                    <div className="flex items-center justify-center py-[16px]">
                      <button onClick={switchToFullSize} className="cursor-pointer bg-transparent border-none">
                        <p className="font-['Simplon_Mono',monospace] font-medium text-[12px] text-[#161716] tracking-[0.96px] uppercase underline underline-offset-[8px]" style={{ textDecorationColor: '#C5765A' }}>
                          Switch to full size
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Sticky Checkout Footer */}
                  <div className="sticky bottom-0 w-full z-50 bg-white mt-auto">
                    <CartFooter
                      itemCount={1}
                      discountedTotal={6.95}
                      originalTotal={6.95}
                      hasDiscount={false}
                      discountMessage={null}
                      onCheckout={onCheckout}
                    />
                  </div>
                </>
              ) : routineCartIds.length === 0 ? (
                <>
                  {/* Empty State */}
                  <div className="flex flex-col items-center px-[24px] pt-[48px] pb-[32px] w-full border-b border-[#eaeaea]">
                    <h2 className="font-['Saol_Text',serif] font-light text-[32px] text-[#323429] text-center leading-[1.1] tracking-[-0.96px]">
                      Your custom blends<br />are missing
                    </h2>
                    <div className="h-px w-[60px] bg-[#C5765A] mt-[20px] mb-[20px]" />
                    <div className="bg-[#ecff92] px-[16px] py-[8px] rounded-[4px] mb-[16px]">
                      <p className="font-['Simplon_Mono',monospace] font-medium text-[12px] text-[#323429] tracking-[0.96px] uppercase">
                        60% off + free shipping
                      </p>
                    </div>
                    <p className="font-['Simplon_Norm',sans-serif] text-[14px] text-[#6c6c6c] text-center tracking-[0.28px] leading-[1.5]">
                      Made just for you.<br />
                      Get 60% off + free shipping when you subscribe.
                    </p>
                    <button
                      onClick={() => { onClose(); navigate('/routine'); }}
                      className="mt-[20px] cursor-pointer"
                    >
                      <p className="font-['Simplon_Mono',monospace] font-medium text-[12px] text-[#323429] tracking-[0.96px] uppercase border-b-[2px] border-[#C5765A] pb-[2px]">
                        Shop your routine
                      </p>
                    </button>
                  </div>

                  {/* Upsell Carousel */}
                  {upsellIds.length > 0 && <Upsell />}
                </>
              ) : (
                <>
                  {/* Promo Banner: Switch to trial */}
                  <div className="bg-[#f9f7f2] flex items-center justify-center h-[40px] w-full">
                    <button onClick={switchToTrial} className="cursor-pointer bg-transparent border-none">
                      <p className="font-['Simplon_Norm',sans-serif] font-normal text-[12px] text-[#161716] tracking-[0.24px] leading-[1.2] underline">
                        Switch to get a Complimentary Skincare Starter Set
                      </p>
                    </button>
                  </div>

                  {/* Your Routine Section */}
                  <div className="px-[24px] w-full">
                    {routineCartIds.length > 0 && (
                      <div className="flex items-center justify-between py-[16px] border-b border-[#eaeaea]">
                        <p className="font-['Simplon_Norm',sans-serif] text-[16px] text-[#161716] tracking-[0.32px] leading-[1.5]">Your Routine</p>
                        <p className="font-['Simplon_Norm',sans-serif] text-[14px] text-[#161716] tracking-[0.28px] leading-[1.5] cursor-pointer underline" onClick={onClose}>Edit</p>
                      </div>
                    )}

                    {/* Product List */}
                    <div className="flex flex-col">
                      {routineCartIds.map((id) => {
                        const product = productCatalog[id];
                        if (!product) return null;

                        const frequency = productFrequencies[id] || "4-weeks";
                        const currentPrice = getCurrentPrice(id, product.originalPrice, product.price);
                        const qty = quantities[id] || 1;
                        const isDiscounted = currentPrice < product.originalPrice;
                        const imageData = cartImageDataMap[id];

                        return (
                          <CartCard
                            key={id}
                            image={imageData?.src || product.routineImage}
                            imageStyle={imageData?.style}
                            name={product.routineName}
                            subtitle={product.size}
                            description={getFrequencyText(frequency, id)}
                            currentPrice={currentPrice}
                            originalPrice={product.originalPrice}
                            isDiscounted={isDiscounted}
                            quantity={qty}
                            onIncrement={() => handleIncrement(id)}
                            onDecrement={() => handleDecrement(id)}
                            onRemove={() => handleRemove(id)}
                          />
                        );
                      })}
                    </div>

                    {/* Perks Section */}
                    {routineCartIds.length > 0 && (
                      <SubscriptionInfo
                        variant={
                          routineCartIds.some(
                            (id) => productFrequencies[id] && productFrequencies[id] !== "buy-once"
                          )
                            ? "gettingPerks"
                            : "subscribeToday"
                        }
                      />
                    )}
                  </div>

                  {/* Upsell Carousel */}
                  {upsellIds.length > 0 && (
                    <div className="w-full">
                      <div className="px-[24px] pt-[16px]">
                        <p className="font-['Simplon_Mono',monospace] font-medium text-[14px] text-[#323429] tracking-[1.12px] uppercase">
                          ADD BACK TO YOUR ROUTINE
                        </p>
                      </div>
                      <Upsell />
                    </div>
                  )}

                  {/* Order Summary */}
                  <CartOrderSummary
                    itemCount={routineCartIds.length}
                    subtotal={subtotal}
                    savings={savings}
                    hasDiscount={hasDiscount}
                    total={subtotal}
                    hasSubscription={hasSubscription}
                  />

                  {/* Sticky Checkout Footer */}
                  <div className="sticky bottom-0 w-full z-50 bg-white">
                    <CartFooter
                      itemCount={routineCartIds.length}
                      discountedTotal={todaysTotal}
                      originalTotal={originalSubtotal + shippingCost}
                      hasDiscount={hasDiscount}
                      discountMessage={discountMessage}
                      onCheckout={onCheckout}
                    />
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
