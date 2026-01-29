"use client";

import { useState, useCallback } from "react";

export type FeedbackType = "helpful" | "wrongInfo" | "lowQuality";

export interface VideoStats {
  helpfulCount: number;
  wrongInfoCount: number;
  lowQualityCount: number;
}

export interface FeedbackButtonsProps {
  videoId: string;
  siteId: string;
  stats: VideoStats;
  userVotes: FeedbackType[];
  onVote: (type: FeedbackType, newStats: VideoStats, isCancel: boolean) => void;
  disabled?: boolean;
}

// Generate or retrieve visitor ID from localStorage
export function getVisitorId(): string {
  if (typeof window === "undefined") return "";

  let id = localStorage.getItem("visitorId");
  if (!id) {
    id = "v_" + Math.random().toString(36).substr(2, 9) + Date.now();
    localStorage.setItem("visitorId", id);
  }
  return id;
}

export function FeedbackButtons({
  videoId,
  siteId,
  stats,
  userVotes,
  onVote,
  disabled = false,
}: FeedbackButtonsProps) {
  const [loadingType, setLoadingType] = useState<FeedbackType | null>(null);

  const handleVote = useCallback(
    async (type: FeedbackType) => {
      if (disabled || loadingType) return;

      const hasVoted = userVotes.includes(type);
      setLoadingType(type);

      try {
        const visitorId = getVisitorId();

        if (hasVoted) {
          // Cancel the vote
          const response = await fetch("/api/video/report", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ videoId, siteId, visitorId, reportType: type }),
          });

          const data = await response.json();

          if (data.success) {
            onVote(type, data.stats, true);
          }
        } else {
          // Submit new vote
          const response = await fetch("/api/video/report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ videoId, siteId, visitorId, reportType: type }),
          });

          const data = await response.json();

          if (data.success) {
            onVote(type, data.stats, false);
          }
        }
      } catch (error) {
        console.error("Failed to submit feedback:", error);
      } finally {
        setLoadingType(null);
      }
    },
    [videoId, siteId, userVotes, onVote, disabled, loadingType]
  );

  const buttons: Array<{
    type: FeedbackType;
    label: string;
    count: number;
    icon: React.ReactNode;
    activeColor: string;
  }> = [
    {
      type: "helpful",
      label: "Helpful",
      count: stats.helpfulCount,
      activeColor: "bg-[--color-green]/20 text-[--color-green] border-[--color-green]",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
        </svg>
      ),
    },
    {
      type: "wrongInfo",
      label: "Wrong",
      count: stats.wrongInfoCount,
      activeColor: "bg-[--color-orange]/20 text-[--color-orange] border-[--color-orange]",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
    {
      type: "lowQuality",
      label: "Low",
      count: stats.lowQualityCount,
      activeColor: "bg-[--color-red]/20 text-[--color-red] border-[--color-red]",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {buttons.map(({ type, label, count, icon, activeColor }) => {
        const hasVoted = userVotes.includes(type);
        const isLoading = loadingType === type;

        return (
          <button
            key={type}
            onClick={() => handleVote(type)}
            disabled={disabled || isLoading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
              hasVoted
                ? activeColor
                : "bg-[--color-bg-tertiary] text-[--color-text-secondary] border-transparent hover:bg-[--color-bg-secondary] hover:border-[--color-border-primary]"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              icon
            )}
            <span>{label}</span>
            {count > 0 && (
              <span className="ml-0.5 opacity-75">({count})</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default FeedbackButtons;
