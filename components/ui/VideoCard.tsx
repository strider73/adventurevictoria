"use client";

export interface VideoCardProps {
  thumbnailId: string;
  title: string;
  views?: string;
  uploadDate?: string;
  location?: string;
  duration?: string;
  onClick?: () => void;
  className?: string;
}

export function VideoCard({
  thumbnailId,
  title,
  views,
  uploadDate,
  location,
  duration,
  onClick,
  className = "",
}: VideoCardProps) {
  return (
    <button
      onClick={onClick}
      className={`group text-left w-full ${className}`}
    >
      {/* Thumbnail */}
      <div className="relative mb-3 rounded-xl overflow-hidden aspect-video">
        <img
          src={`https://img.youtube.com/vi/${thumbnailId}/mqdefault.jpg`}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <svg
            className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        {/* Duration badge */}
        {duration && (
          <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-medium text-white bg-black/70">
            {duration}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="space-y-1.5">
        <h3 className="text-sm font-medium text-[--color-text-primary] line-clamp-2 group-hover:text-[--color-brand] transition-colors">
          {title}
        </h3>

        {/* Meta info */}
        {(views || uploadDate) && (
          <p className="text-xs text-[--color-text-tertiary]">
            {views && <span>{views}</span>}
            {views && uploadDate && <span className="mx-1">•</span>}
            {uploadDate && <span>{uploadDate}</span>}
          </p>
        )}

        {/* Location badge */}
        {location && (
          <div className="flex items-center gap-1 text-xs text-[--color-text-secondary]">
            <span>📍</span>
            <span className="truncate">{location}</span>
          </div>
        )}
      </div>
    </button>
  );
}
