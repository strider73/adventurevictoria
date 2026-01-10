"use client";

import {
  useState,
  useEffect,
  useCallback,
  type ReactNode,
  Children,
} from "react";

export interface CarouselProps {
  children: ReactNode;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  loop?: boolean;
  className?: string;
}

export function Carousel({
  children,
  autoPlay = false,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  loop = true,
  className = "",
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const slides = Children.toArray(children);
  const totalSlides = slides.length;

  const goToSlide = useCallback(
    (index: number) => {
      if (loop) {
        setCurrentIndex((index + totalSlides) % totalSlides);
      } else {
        setCurrentIndex(Math.max(0, Math.min(index, totalSlides - 1)));
      }
    },
    [totalSlides, loop]
  );

  const goToPrevious = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  const goToNext = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || isHovered) return;

    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, goToNext, isHovered]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrevious, goToNext]);

  const canGoPrevious = loop || currentIndex > 0;
  const canGoNext = loop || currentIndex < totalSlides - 1;

  return (
    <div
      className={`relative group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides Container */}
      <div className="overflow-hidden rounded-[--radius-xl]">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="w-full flex-shrink-0">
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && totalSlides > 1 && (
        <>
          <button
            onClick={goToPrevious}
            disabled={!canGoPrevious}
            className={`
              absolute left-4 top-1/2 -translate-y-1/2 z-10
              w-10 h-10 rounded-full
              bg-[--color-bg-secondary]/80 backdrop-blur-sm
              border border-[--color-border-primary]
              flex items-center justify-center
              text-[--color-text-primary]
              transition-all duration-200
              opacity-0 group-hover:opacity-100
              ${canGoPrevious ? "hover:bg-[--color-bg-tertiary] cursor-pointer" : "opacity-30 cursor-not-allowed"}
            `}
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            disabled={!canGoNext}
            className={`
              absolute right-4 top-1/2 -translate-y-1/2 z-10
              w-10 h-10 rounded-full
              bg-[--color-bg-secondary]/80 backdrop-blur-sm
              border border-[--color-border-primary]
              flex items-center justify-center
              text-[--color-text-primary]
              transition-all duration-200
              opacity-0 group-hover:opacity-100
              ${canGoNext ? "hover:bg-[--color-bg-tertiary] cursor-pointer" : "opacity-30 cursor-not-allowed"}
            `}
            aria-label="Next slide"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {showDots && totalSlides > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`
                w-2 h-2 rounded-full transition-all duration-200
                ${
                  index === currentIndex
                    ? "w-6 bg-[--color-brand]"
                    : "bg-[--color-text-tertiary]/50 hover:bg-[--color-text-tertiary]"
                }
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Carousel Slide Component
export interface CarouselSlideProps {
  children?: ReactNode;
  image?: string;
  alt?: string;
  overlay?: boolean;
  className?: string;
}

export function CarouselSlide({
  children,
  image,
  alt = "",
  overlay = false,
  className = "",
}: CarouselSlideProps) {
  return (
    <div className={`relative aspect-video ${className}`}>
      {image && (
        <img
          src={image}
          alt={alt}
          className="w-full h-full object-cover"
        />
      )}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-[--color-bg-primary]/80 to-transparent" />
      )}
      {children && (
        <div className="absolute inset-0 flex items-end p-6">
          {children}
        </div>
      )}
    </div>
  );
}
