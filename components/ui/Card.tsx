"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export type CardVariant = "default" | "elevated" | "outlined";
export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  hoverable?: boolean;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}

export interface CardImageProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  aspectRatio?: "video" | "square" | "wide";
}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

const variantStyles: Record<CardVariant, string> = {
  default: `
    bg-[var(--color-bg-secondary)]
    border border-[var(--color-border-primary)]
  `,
  elevated: `
    bg-[var(--color-bg-secondary)]
    shadow-[var(--shadow-medium)]
  `,
  outlined: `
    bg-transparent
    border border-[var(--color-border-secondary)]
  `,
};

const paddingStyles: Record<CardPadding, string> = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

const aspectRatioStyles = {
  video: "aspect-video",
  square: "aspect-square",
  wide: "aspect-[2/1]",
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      padding = "md",
      hoverable = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      rounded-[var(--radius-xl)]
      overflow-hidden
      transition-all duration-150 ease-out
    `;

    const hoverStyles = hoverable
      ? "hover:border-[var(--color-border-secondary)] hover:shadow-[var(--shadow-low)] cursor-pointer"
      : "";

    return (
      <div
        ref={ref}
        className={`
          ${baseStyles}
          ${variantStyles[variant]}
          ${paddingStyles[padding]}
          ${hoverStyles}
          ${className}
        `.trim()}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, action, className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-start justify-between gap-4 ${className}`}
        {...props}
      >
        {children || (
          <>
            <div className="flex flex-col gap-1">
              {title && (
                <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-[var(--color-text-tertiary)]">
                  {subtitle}
                </p>
              )}
            </div>
            {action && <div className="flex-shrink-0">{action}</div>}
          </>
        )}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

const CardImage = forwardRef<HTMLDivElement, CardImageProps>(
  ({ src, alt, aspectRatio = "video", className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          relative overflow-hidden
          ${aspectRatioStyles[aspectRatio]}
          ${className}
        `.trim()}
        {...props}
      >
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    );
  }
);

CardImage.displayName = "CardImage";

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`text-[var(--color-text-secondary)] ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-center gap-3 pt-4 border-t border-[var(--color-border-primary)] mt-4 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardImage, CardContent, CardFooter };
