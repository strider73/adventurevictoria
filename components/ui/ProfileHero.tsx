"use client";

import { Badge } from "./Badge";
import { Button } from "./Button";

export interface ProfileHeroProps {
  avatarUrl?: string;
  name: string;
  tagline?: string;
  experienceBadge?: string;
  onSubscribe?: () => void;
  onWatchVideos?: () => void;
  subscribeHref?: string;
  watchVideosHref?: string;
  className?: string;
}

export function ProfileHero({
  avatarUrl,
  name,
  tagline,
  experienceBadge,
  onSubscribe,
  onWatchVideos,
  subscribeHref,
  watchVideosHref,
  className = "",
}: ProfileHeroProps) {
  const SubscribeWrapper = subscribeHref ? "a" : "button";
  const WatchWrapper = watchVideosHref ? "a" : "button";

  return (
    <div
      className={`py-8 px-4 text-center bg-[--color-bg-secondary] border-b border-[--color-border-primary] ${className}`}
    >
      {/* Avatar */}
      <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-[--color-green] to-[--color-brand] flex items-center justify-center">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <svg
            className="w-10 h-10 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              d="M12 2L2 22h20L12 2z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M12 22V12" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d="M7 22l5-10 5 10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Name */}
      <h1 className="text-2xl font-bold text-[--color-text-primary] mb-2">
        {name}
      </h1>

      {/* Tagline */}
      {tagline && (
        <p className="text-[--color-text-secondary] text-sm mb-3">{tagline}</p>
      )}

      {/* Experience Badge */}
      {experienceBadge && (
        <div className="mb-4">
          <Badge variant="success" dot>
            {experienceBadge}
          </Badge>
        </div>
      )}

      {/* CTAs */}
      <div className="flex items-center justify-center gap-3">
        <SubscribeWrapper
          {...(subscribeHref
            ? { href: subscribeHref, target: "_blank", rel: "noopener noreferrer" }
            : { onClick: onSubscribe })}
        >
          <Button size="sm" className="bg-[#FF0000] hover:bg-[#CC0000] gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            Subscribe to Channel
          </Button>
        </SubscribeWrapper>

        <WatchWrapper
          {...(watchVideosHref
            ? { href: watchVideosHref, target: "_blank", rel: "noopener noreferrer" }
            : { onClick: onWatchVideos })}
        >
          <Button size="sm" variant="secondary">
            Watch Videos
          </Button>
        </WatchWrapper>
      </div>
    </div>
  );
}
