"use client";

export interface FilterTab {
  id: string;
  label: string;
  count?: number;
}

export interface FilterTabsProps {
  tabs: FilterTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function FilterTabs({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}: FilterTabsProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isActive
                ? "bg-[--color-brand] text-white"
                : "bg-[--color-bg-tertiary] text-[--color-text-secondary] hover:bg-[--color-bg-secondary] hover:text-[--color-text-primary]"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`ml-1.5 ${isActive ? "text-white/80" : "text-[--color-text-tertiary]"}`}>
                ({tab.count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
