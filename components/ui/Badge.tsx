"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export type BadgeVariant = "success" | "warning" | "error" | "info" | "default";
export type BadgeSize = "sm" | "md";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  icon?: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: `
    bg-[var(--color-green)]/15
    text-[var(--color-green)]
    border border-[var(--color-green)]/20
  `,
  warning: `
    bg-[var(--color-orange)]/15
    text-[var(--color-orange)]
    border border-[var(--color-orange)]/20
  `,
  error: `
    bg-[var(--color-red)]/15
    text-[var(--color-red)]
    border border-[var(--color-red)]/20
  `,
  info: `
    bg-[var(--color-blue)]/15
    text-[var(--color-blue)]
    border border-[var(--color-blue)]/20
  `,
  default: `
    bg-[var(--color-bg-tertiary)]
    text-[var(--color-text-secondary)]
    border border-[var(--color-border-primary)]
  `,
};

const dotColors: Record<BadgeVariant, string> = {
  success: "bg-[var(--color-green)]",
  warning: "bg-[var(--color-orange)]",
  error: "bg-[var(--color-red)]",
  info: "bg-[var(--color-blue)]",
  default: "bg-[var(--color-text-tertiary)]",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "h-5 px-1.5 text-xs gap-1",
  md: "h-6 px-2 text-xs gap-1.5",
};

const dotSizeStyles: Record<BadgeSize, string> = {
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
};

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = "default",
      size = "md",
      dot = false,
      icon,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center
      font-medium
      rounded-[var(--radius-md)]
      whitespace-nowrap
    `;

    return (
      <span
        ref={ref}
        className={`
          ${baseStyles}
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `.trim()}
        {...props}
      >
        {dot && (
          <span
            className={`rounded-full flex-shrink-0 ${dotColors[variant]} ${dotSizeStyles[size]}`}
          />
        )}
        {icon && !dot && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
