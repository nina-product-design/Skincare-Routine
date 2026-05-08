import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const offerBadgeVariants = cva(
  "rounded-full flex flex-col items-center justify-center text-center uppercase tracking-[1px] font-['Simplon Mono',monospace]",
  {
    variants: {
      color: {
        yellow: "bg-[#ecff92] text-[#161716]",
        green: "bg-[#323429] text-[#ecff92]",
      },
      size: {
        desktop: "size-[136px]",
        mobile: "size-[88px]",
      },
    },
    defaultVariants: {
      color: "yellow",
      size: "desktop",
    },
  },
);

type OfferBadgeProps = React.ComponentProps<"div"> &
  VariantProps<typeof offerBadgeVariants> & {
    offer: "50-off" | "sss" | "raf";
  };

function OfferBadge({
  className,
  color,
  size,
  offer,
  ...props
}: OfferBadgeProps) {
  const isDesktop = size === "desktop" || size === undefined;

  return (
    <div
      data-slot="offer-badge"
      className={cn(offerBadgeVariants({ color, size }), className)}
      {...props}
    >
      {offer === "50-off" && (
        <div
          className={cn(
            "font-medium leading-[1]",
            isDesktop ? "text-[32px]" : "text-[20px]",
          )}
        >
          <p>50%</p>
          <p>OFF</p>
        </div>
      )}

      {offer === "sss" && (
        <div
          className={cn(
            "flex flex-col items-center",
            isDesktop ? "gap-[8px]" : "gap-[4px]",
          )}
        >
          <p
            className={cn(
              "font-medium leading-[1]",
              isDesktop ? "text-[32px]" : "text-[20px]",
            )}
          >
            FREE
          </p>
          <p
            className={cn(
              "font-light leading-[1]",
              isDesktop ? "text-[16px]" : "text-[10px]",
            )}
          >
            $65 VALUE
          </p>
        </div>
      )}

      {offer === "raf" && (
        <div
          className={cn(
            "font-medium leading-[1]",
            isDesktop ? "text-[32px]" : "text-[20px]",
          )}
        >
          <p>GET</p>
          <p>$20</p>
        </div>
      )}
    </div>
  );
}

export { OfferBadge, offerBadgeVariants };
