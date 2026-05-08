import { productCatalog, trialSetBundle, initialTrialIds } from "../data/product-catalog";

interface TrialSetCardProps {
  onSwitchToFullSize: () => void;
}

export default function TrialSetCard({ onSwitchToFullSize }: TrialSetCardProps) {
  const trialProducts = initialTrialIds
    .map((id) => productCatalog[id])
    .filter(Boolean);

  return (
    <div className="w-[327px]">
      {/* Main Card */}
      <div className="bg-white rounded-[10px] overflow-hidden">
        {/* Product Image Area */}
        <div className="h-[220px] relative bg-[#f1ece0] flex items-center justify-center gap-[12px] px-[24px]">
          {trialProducts.map((product) => (
            <div key={product.id} className="flex flex-col items-center gap-[8px]">
              <div className="w-[80px] h-[140px] rounded-[6px] overflow-hidden bg-white">
                <img
                  alt={product.routineName}
                  className="size-full object-cover"
                  src={product.routineImage}
                />
              </div>
              <p className="font-['Simplon Norm',sans-serif] text-[10px] text-[#4d523c] tracking-[0.2px] leading-[1.5] text-center whitespace-nowrap">
                {product.routineName.replace("Maggie's ", "").replace(" (Trial)", "")}
              </p>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-[16px] px-[16px] py-[24px]">
          {/* Title + Description */}
          <div className="flex flex-col gap-[8px]">
            <p className="font-['Saol Text',serif] font-light text-[24px] text-[#323429] tracking-[-0.72px] leading-[1.1]">
              {trialSetBundle.name}
            </p>
            <p className="font-['Simplon Norm',sans-serif] text-[14px] text-[#4d523c] tracking-[0.28px] leading-[1.5]">
              {trialSetBundle.description}
            </p>
          </div>

          {/* Product List */}
          <div className="flex flex-col gap-[8px]">
            {trialProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between">
                <p className="font-['Simplon Norm',sans-serif] text-[12px] text-[#4d523c] tracking-[0.24px] leading-[1.5]">
                  {product.routineName.replace(" (Trial)", "")} — {product.size}
                </p>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-[8px]">
            <div className="bg-[#ecff92] px-[8px] py-[4px] rounded-[4px]">
              <p className="font-['Simplon Norm',sans-serif] font-medium text-[16px] text-[#161716] leading-[1.5]">
                FREE
              </p>
            </div>
            <p className="font-['Simplon Norm',sans-serif] text-[12px] text-[#6c6c6c] tracking-[0.24px] leading-[1.5]">
              + ${trialSetBundle.shippingCost.toFixed(2)} shipping
            </p>
          </div>

          {/* Switch to Full Size Link */}
          <button
            onClick={onSwitchToFullSize}
            className="cursor-pointer self-start"
          >
            <p className="font-['Simplon Mono',monospace] font-medium text-[12px] text-[#323429] tracking-[0.96px] uppercase border-b-[2px] border-[#C5765A] pb-[2px]">
              Switch to full size
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
