import { useState } from "react";
import { useNavigate } from "react-router";
import { productCatalog, trialSetBundle } from "../data/product-catalog";
import svgPaths from "../../imports/svg-2v3l6hopxe";
import { useCart } from "../context/cart-context";
import { cartImageDataMap } from "../data/cart-card-assets";
import imgProseProducts from "figma:asset/f065ce6884812a19ea915c647498674a16334e77.png";
import SubscriptionInfo from "../components/subscription-info";
import CartCard from "../components/cart-card";
import Upsell from "../components/upsell";
import CartOrderSummary from "../components/cart-order-summary";
import CartFooter from "../components/cart-footer";

// ─── Helper Functions ─────────────────────────────────────
function getFrequencyText(frequency: string, productId?: string): string {
  if (frequency === "buy-once") return "One-time purchase";
  const weeksMatch = frequency.match(/(\d+)/);
  if (weeksMatch) {
    const weeks = weeksMatch[1];
    // Check if this frequency matches the product's catalog-recommended frequency
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
function CloseIcon({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="cursor-pointer">
      <svg className="size-[24px]" fill="none" viewBox="0 0 23.15 23.15">
        <path d={svgPaths.p28ba7000} fill="black" />
      </svg>
    </button>
  );
}

// ─── Main Cart Page ───────────────────────────────────────
export default function Cart() {
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

  // ─── Trial Mode ─────────────────────────────────────────
  if (sizeMode === "trial") {
    return (
      <div className="bg-white flex flex-col items-center h-screen w-[375px] mx-auto relative overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 border-b border-[#eaeaea] w-full">
          <div className="flex items-center justify-between px-[24px] py-[16px]">
            <div className="flex gap-[8px] items-center">
              <p className="font-['Simplon_Norm',sans-serif] font-medium text-[20px] text-black leading-[1.5]">Cart:</p>
              <div className="flex gap-[4px] items-center">
                <p className="font-['Simplon_Norm',sans-serif] font-medium text-[20px] text-black leading-[1.5]">1</p>
                <p className="font-['Simplon_Norm',sans-serif] font-medium text-[20px] text-black leading-[1.5]">item</p>
              </div>
            </div>
            <CloseIcon onClick={() => navigate("/routine")} />
          </div>
        </div>

        {/* Trial Set Item */}
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

        {/* Order Summary */}
        <div className="flex flex-col pt-[12px] px-[24px] w-full">
          {/* Subtotal */}
          <div className="flex items-center gap-[8px] pr-[4px] pt-[8px]">
            <p className="flex-1 font-['Simplon_Norm',sans-serif] text-[14px] text-[#161716] tracking-[0.28px] leading-[1.5]">
              Subtotal (1 item)
            </p>
            <p className="font-['Simplon_Norm',sans-serif] text-[14px] text-[#161716] leading-[1.5] text-right whitespace-nowrap">
              $0.00
            </p>
          </div>

          {/* Shipping */}
          <div className="flex items-center gap-[8px] pr-[4px] pt-[12px]">
            <p className="flex-1 font-['Simplon_Norm',sans-serif] text-[14px] text-[#161716] tracking-[0.28px] leading-[1.5]">
              Shipping
            </p>
            <p className="font-['Simplon_Norm',sans-serif] text-[14px] text-[#161716] leading-[1.5] text-right whitespace-nowrap">
              $6.95
            </p>
          </div>

          {/* Taxes */}
          <div className="flex items-center gap-[8px] pr-[4px] pt-[12px]">
            <p className="flex-1 font-['Simplon_Norm',sans-serif] text-[14px] text-[#161716] tracking-[0.28px] leading-[1.5]">
              Taxes
            </p>
            <p className="font-['Simplon_Norm',sans-serif] text-[14px] text-[#161716] leading-[1.5] text-right whitespace-nowrap italic">
              Calculated at checkout
            </p>
          </div>

          {/* Today's Total */}
          <div className="relative flex items-center gap-[8px] pt-[12px] pb-[8px] mt-[12px]">
            <div
              aria-hidden="true"
              className="absolute top-0 left-0 right-0 border-t border-[#6c6c6c]"
              style={{ borderTopWidth: "0.5px" }}
            />
            <p className="flex-1 font-['Simplon_Norm',sans-serif] font-medium text-[14px] text-[#161716] leading-[1.5]">
              Today's total (pre-tax)
            </p>
            <div className="bg-[#ecff92] rounded-[4px] px-[4px] flex items-center justify-center">
              <p className="font-['Simplon_Norm',sans-serif] font-medium text-[14px] text-[#161716] leading-[1.5] text-right whitespace-nowrap">
                $6.95
              </p>
            </div>
          </div>

          {/* Tagline */}
          <div className="flex items-center justify-center pt-[8px] pb-[48px]">
            <p className="font-['Simplon_Mono',monospace] text-[10px] text-[#6c6c6c] tracking-[0.8px] leading-[1.2] uppercase text-center whitespace-nowrap">
              {`LOVE YOUR FIRST ORDER (OR IT'S ON US)`}
            </p>
          </div>
        </div>

        {/* Sticky Checkout Footer */}
        <div className="sticky bottom-0 w-full z-50 bg-white">
          <CartFooter
            itemCount={1}
            discountedTotal={6.95}
            originalTotal={6.95}
            hasDiscount={false}
            discountMessage={null}
            onCheckout={() => navigate("/checkout")}
          />
        </div>
      </div>
    );
  }

  // ─── Full-Size Mode ─────────────────────────────────────
  return (
    <div className="bg-white flex flex-col items-center h-screen w-[375px] mx-auto relative overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 border-b border-[#eaeaea] w-full">
        <div className="flex items-center justify-between px-[24px] py-[16px]">
          <div className="flex gap-[8px] items-center">
            <p className="font-['Simplon_Norm',sans-serif] font-medium text-[20px] text-black leading-[1.5]">Cart:</p>
            <div className="flex gap-[4px] items-center">
              <p className="font-['Simplon_Norm',sans-serif] font-medium text-[20px] text-black leading-[1.5]">{routineCartIds.length}</p>
              <p className="font-['Simplon_Norm',sans-serif] font-medium text-[20px] text-black leading-[1.5]">items</p>
            </div>
          </div>
          <CloseIcon onClick={() => navigate("/routine")} />
        </div>
      </div>

      {routineCartIds.length === 0 ? (
        <>
          {/* Empty State */}
          <div className="flex flex-col items-center px-[24px] pt-[40px] pb-[24px] w-full">
            <p className="font-['Saol Text',serif] font-light text-[32px] text-[#161716] tracking-[-0.96px] leading-[1.1] text-center">
              Your custom blends<br />are missing
            </p>

            <div className="w-full h-[1px] bg-[#d9d9d9] mt-[24px] mb-[20px]" />

            <div className="bg-[#ecff92] rounded-[4px] px-[12px] py-[4px] flex items-center justify-center mb-[16px]">
              <p className="font-['Simplon_Mono',monospace] font-medium text-[12px] text-[#161716] tracking-[0.96px] uppercase leading-[1.2]">
                60% off + free shipping
              </p>
            </div>

            <p className="font-['Simplon_Norm',sans-serif] text-[14px] text-[#161716] tracking-[0.28px] leading-[1.5] text-center">Made just for you.</p>
            <p className="font-['Simplon_Norm',sans-serif] text-[14px] text-[#6c6c6c] tracking-[0.28px] leading-[1.5] text-center">
              Get 60% off + free shipping when you subscribe.
            </p>

            <button
              onClick={() => navigate("/routine")}
              className="mt-[16px] cursor-pointer bg-transparent border-none"
            >
              <p className="font-['Simplon_Mono',monospace] font-medium text-[12px] text-[#161716] tracking-[0.96px] uppercase leading-[1.2] underline underline-offset-[8px]" style={{ textDecorationColor: '#C5765A' }}>
                Shop your routine
              </p>
            </button>

            <div className="w-full h-[1px] bg-[#d9d9d9] mt-[24px]" />
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
              <p className="font-['Simplon_Norm',sans-serif] text-[14px] text-[#161716] tracking-[0.28px] leading-[1.5] cursor-pointer underline" onClick={() => navigate("/routine")}>Edit</p>
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
              onCheckout={() => navigate("/checkout")}
            />
          </div>
        </>
      )}
    </div>
  );
}
