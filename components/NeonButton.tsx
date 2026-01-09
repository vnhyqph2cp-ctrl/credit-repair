
import React from "react";
import clsx from "clsx";

type AsProp<C extends React.ElementType> = {
  as?: C;
};

type NeonButtonOwnProps = {
  variant?: "primary" | "secondary";
  color?: "teal" | "aqua" | "purple" | "pink";
  size?: "md" | "lg";
  children: React.ReactNode;
  className?: string;
};

type NeonButtonProps<C extends React.ElementType> =
  AsProp<C> &
  NeonButtonOwnProps &
  Omit<React.ComponentPropsWithoutRef<C>, keyof NeonButtonOwnProps | "as">;

const defaultElement = "button";

export const NeonButton = React.forwardRef(
  <C extends React.ElementType = typeof defaultElement>(
    {
      as,
      variant = "primary",
      color = "teal",
      size = "md",
      className,
      children,
      ...props
    }: NeonButtonProps<C>,
    ref: React.Ref<any>
  ) => {
    const Component = as || defaultElement;
    return (
      <Component
        ref={ref}
        className={clsx(
          "neon-btn",
          `neon-btn-${variant}`,
          `neon-btn-${color}`,
          `neon-btn-${size}`,
          className
        )}
        {...props}
      >
        <span className="neon-btn-inner">{children}</span>
        <span className="neon-btn-shimmer" />
      </Component>
    );
  }
) as <C extends React.ElementType = typeof defaultElement>(
  props: NeonButtonProps<C> & { ref?: React.Ref<any> }
) => React.ReactElement | null;
NeonButton.displayName = "NeonButton";
