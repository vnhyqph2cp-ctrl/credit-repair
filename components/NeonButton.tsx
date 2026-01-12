import React from "react";
import clsx from "clsx";

type NeonButtonOwnProps = {
  as?: React.ElementType;
  variant?: "primary" | "secondary" | "ghost";
  color?: "cyan" | "purple" | "green" | "yellow";
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
};

type NeonButtonProps<T extends React.ElementType = "button"> =
  NeonButtonOwnProps &
    Omit<React.ComponentPropsWithoutRef<T>, keyof NeonButtonOwnProps>;

export const NeonButton = React.forwardRef<
  HTMLElement,
  NeonButtonProps
>(function NeonButton(
  {
    as: Component = "button",
    variant = "primary",
    color = "cyan",
    size = "md",
    className,
    children,
    disabled,
    ...props
  },
  ref
) {
  return (
    <Component
      ref={ref as any}
      className={clsx(
        "neon-btn",
        `neon-btn-${variant}`,
        `neon-btn-${color}`,
        `neon-btn-${size}`,
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      disabled={Component === "button" ? disabled : undefined}
      {...props}
    >
      <span className="neon-btn-inner">{children}</span>
      <span className="neon-btn-shimmer" aria-hidden />
    </Component>
  );
});

NeonButton.displayName = "NeonButton";
