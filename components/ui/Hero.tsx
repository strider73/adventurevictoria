"use client";

import { type ReactNode } from "react";

export type HeroVariant = "default" | "centered" | "split";
export type HeroSize = "sm" | "md" | "lg";

export interface HeroProps {
  variant?: HeroVariant;
  size?: HeroSize;
  badge?: ReactNode;
  title: string | ReactNode;
  description?: string;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  image?: ReactNode;
  showGradient?: boolean;
  gradientColors?: {
    from: string;
    via?: string;
    to: string;
  };
}

const sizeStyles: Record<HeroSize, { padding: string; titleSize: string; descSize: string }> = {
  sm: {
    padding: "py-16 lg:py-20",
    titleSize: "text-3xl sm:text-4xl lg:text-5xl",
    descSize: "text-base lg:text-lg",
  },
  md: {
    padding: "py-20 lg:py-28",
    titleSize: "text-4xl sm:text-5xl lg:text-6xl",
    descSize: "text-lg lg:text-xl",
  },
  lg: {
    padding: "py-24 lg:py-36",
    titleSize: "text-5xl sm:text-6xl lg:text-7xl",
    descSize: "text-lg lg:text-xl",
  },
};

export function Hero({
  variant = "centered",
  size = "md",
  badge,
  title,
  description,
  primaryAction,
  secondaryAction,
  image,
  showGradient = true,
  gradientColors = {
    from: "var(--color-brand)",
    via: "var(--color-accent)",
    to: "transparent",
  },
}: HeroProps) {
  const styles = sizeStyles[size];

  const renderContent = () => (
    <div
      className={`
        flex flex-col gap-6
        ${variant === "centered" ? "items-center text-center max-w-4xl mx-auto" : "items-start text-left max-w-2xl"}
      `}
    >
      {badge && <div>{badge}</div>}

      <h1
        className={`
          ${styles.titleSize}
          font-bold tracking-tight
          text-[--color-text-primary]
          leading-[1.1]
        `}
      >
        {title}
      </h1>

      {description && (
        <p
          className={`
            ${styles.descSize}
            text-[--color-text-secondary]
            max-w-2xl
            leading-relaxed
          `}
        >
          {description}
        </p>
      )}

      {(primaryAction || secondaryAction) && (
        <div
          className={`
            flex flex-wrap gap-4 mt-2
            ${variant === "centered" ? "justify-center" : "justify-start"}
          `}
        >
          {primaryAction}
          {secondaryAction}
        </div>
      )}
    </div>
  );

  return (
    <section className={`relative overflow-hidden ${styles.padding}`}>
      {/* Background Gradient */}
      {showGradient && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top gradient blob */}
          <div
            className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-20 blur-3xl"
            style={{
              background: `radial-gradient(circle, ${gradientColors.from} 0%, ${gradientColors.via || gradientColors.from} 40%, ${gradientColors.to} 70%)`,
            }}
          />
          {/* Side gradient accents */}
          <div
            className="absolute top-1/4 -left-32 w-64 h-64 rounded-full opacity-10 blur-3xl"
            style={{ background: gradientColors.from }}
          />
          <div
            className="absolute top-1/3 -right-32 w-64 h-64 rounded-full opacity-10 blur-3xl"
            style={{ background: gradientColors.via || gradientColors.from }}
          />
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {variant === "split" && image ? (
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {renderContent()}
            <div className="relative">{image}</div>
          </div>
        ) : (
          <>
            {renderContent()}
            {image && variant !== "split" && (
              <div className="mt-12 lg:mt-16 relative">{image}</div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

// Hero with gradient text support
export function HeroGradientText({
  children,
  gradient = "from-[--color-brand] via-[--color-accent] to-[--color-brand-hover]",
}: {
  children: ReactNode;
  gradient?: string;
}) {
  return (
    <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
      {children}
    </span>
  );
}
