import { cn } from "@/lib/utils";
import React, { CSSProperties } from "react";

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "#FF69B4", // Hot pink shimmer
      shimmerSize = "0.05em",
      shimmerDuration = "2.5s", // Slightly faster animation
      borderRadius = "100px",
      background = "linear-gradient(135deg, #6366F1, #8B5CF6)", // Indigo to purple gradient
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        style={
          {
            "--spread": "120deg", // Wider shimmer spread
            "--shimmer-color": shimmerColor,
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--cut": shimmerSize,
            "--bg": background,
          } as CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/20 px-6 py-3 text-white [background:var(--bg)] [border-radius:var(--radius)] dark:text-white",
          "transform-gpu transition-transform duration-300 ease-in-out hover:scale-[1.02] active:translate-y-[1px]",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* spark container */}
        <div
          className={cn(
            "-z-30 blur-[2px]",
            "absolute inset-0 overflow-visible [container-type:size]"
          )}
        >
          {/* spark */}
          <div className="absolute inset-0 h-[100cqh] animate-slide [aspect-ratio:1] [border-radius:0] [mask:none]">
            {/* spark before */}
            <div className="animate-spin-around absolute inset-[-100%] w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
          </div>
        </div>
        {children}

        {/* Highlight */}
        <div
          className={cn(
            "insert-0 absolute h-full w-full",
            "rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_15px_#ffffff2f]",
            // transition
            "transform-gpu transition-all duration-300 ease-in-out",
            // on hover
            "group-hover:shadow-[inset_0_-6px_15px_#ffffff4f]",
            // on click
            "group-active:shadow-[inset_0_-10px_15px_#ffffff4f]"
          )}
        />

        {/* backdrop */}
        <div
          className={cn(
            "absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]"
          )}
        />
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";

export default ShimmerButton;
