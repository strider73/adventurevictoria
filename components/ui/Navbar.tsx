"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";

export interface NavLink {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface NavbarProps {
  logo?: ReactNode;
  logoText?: string;
  links?: NavLink[];
  ctaButton?: ReactNode;
  sticky?: boolean;
  transparent?: boolean;
}

export function Navbar({
  logo,
  logoText = "Logo",
  links = [],
  ctaButton,
  sticky = true,
  transparent = false,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav
      className={`
        w-full z-50 transition-all duration-200
        ${sticky ? "sticky top-0" : "relative"}
        ${transparent ? "bg-transparent" : "bg-[--color-bg-primary]/80 backdrop-blur-xl"}
        border-b border-[--color-border-primary]/50
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            {logo || (
              <div className="w-8 h-8 rounded-[--radius-md] bg-[--color-brand] flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
            )}
            <span className="text-[--color-text-primary] font-semibold text-lg">
              {logoText}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  px-4 py-2 rounded-[--radius-lg] text-sm font-medium
                  transition-colors duration-150
                  ${
                    link.isActive
                      ? "text-[--color-text-primary] bg-[--color-bg-secondary]"
                      : "text-[--color-text-tertiary] hover:text-[--color-text-primary] hover:bg-[--color-bg-secondary]"
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button & Mobile Menu Button */}
          <div className="flex items-center gap-3">
            {ctaButton && <div className="hidden sm:block">{ctaButton}</div>}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-[--radius-md] text-[--color-text-tertiary] hover:text-[--color-text-primary] hover:bg-[--color-bg-secondary]"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[--color-border-primary]">
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    px-4 py-3 rounded-[--radius-lg] text-sm font-medium
                    transition-colors duration-150
                    ${
                      link.isActive
                        ? "text-[--color-text-primary] bg-[--color-bg-secondary]"
                        : "text-[--color-text-tertiary] hover:text-[--color-text-primary] hover:bg-[--color-bg-secondary]"
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}
              {ctaButton && <div className="mt-3 px-4 sm:hidden">{ctaButton}</div>}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
