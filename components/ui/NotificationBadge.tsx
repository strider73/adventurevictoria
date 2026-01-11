"use client";

import React from "react";

export interface NotificationBadgeProps {
  count: number;
  className?: string;
}

export function NotificationBadge({ count, className = "" }: NotificationBadgeProps) {
  if (count <= 0) return null;

  return (
    <span
      className={`absolute -top-2 -right-2 z-10 min-w-[28px] h-7 px-2 rounded-full text-sm font-bold text-white bg-[--color-green]/90 backdrop-blur-sm flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.4),0_2px_4px_rgba(0,0,0,0.3)] border border-white/20 ${className}`}
    >
      {count}
    </span>
  );
}

export default NotificationBadge;
