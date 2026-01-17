"use client";

export interface StatItem {
  value: number | string;
  label: string;
  icon?: React.ReactNode;
}

export interface StatsCardProps {
  stats: StatItem[];
  className?: string;
}

export function StatsCard({ stats, className = "" }: StatsCardProps) {
  return (
    <div
      className={`grid grid-cols-${stats.length} gap-4 bg-[--color-bg-secondary] rounded-xl p-4 border border-[--color-border-primary] ${className}`}
      style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
    >
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="flex items-center justify-center gap-2">
            {stat.icon && (
              <span className="text-[--color-brand]">{stat.icon}</span>
            )}
            <span className="text-2xl font-bold text-[--color-text-primary]">
              {stat.value}
            </span>
          </div>
          <span className="text-xs text-[--color-text-tertiary]">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
