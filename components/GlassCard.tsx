import React from "react";
import clsx from "clsx";

export type GlassCardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "glass-card",
          "transition-all duration-300",
          "hover:-translate-y-[2px] hover:shadow-[0_0_40px_rgba(34,211,238,0.25)]",
          "focus-within:ring-2 focus-within:ring-cyan-400/40",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";
