"use client";

import { useState, useMemo, useEffect } from "react";
import { Navbar, Footer, SocialIcons, Button, Badge, NotificationBadge } from "@/components/ui";
import dynamic from "next/dynamic";
import koreaVideoData from "@/data/korea-travel-video.json";
import koreaCommunityVideoData from "@/data/korea-community-videos.json";
import type { KoreaVideo } from "./MapComponent";

// Type for community video submissions
interface CommunityVideo {
  youtubeId: string;
  submittedAt: string;
  locationId: string;
  title?: string;
  channelName?: string;
}

// Convert pre-loaded community videos to the CommunityVideo format
const getPreloadedCommunityVideos = (): Record<string, CommunityVideo[]> => {
  const preloaded: Record<string, CommunityVideo[]> = {};
  koreaCommunityVideoData.communityVideos.forEach((location) => {
    preloaded[location.campingSiteId] = location.videos
      .filter((v) => v.videoId.length === 11) // Only include valid YouTube IDs (11 chars)
      .map((v) => ({
        youtubeId: v.videoId,
        submittedAt: "preloaded",
        locationId: location.campingSiteId,
        title: v.title,
        channelName: v.channelName,
      }));
  });
  return preloaded;
};

// Helper to get community videos from localStorage and merge with preloaded
const getCommunityVideos = (): Record<string, CommunityVideo[]> => {
  const preloaded = getPreloadedCommunityVideos();
  if (typeof window === "undefined") return preloaded;

  const stored = localStorage.getItem("koreaMapCommunityVideos");
  const userSubmitted: Record<string, CommunityVideo[]> = stored ? JSON.parse(stored) : {};

  // Merge preloaded with user-submitted, avoiding duplicates
  const merged: Record<string, CommunityVideo[]> = { ...preloaded };
  Object.keys(userSubmitted).forEach((locationId) => {
    const existing = merged[locationId] || [];
    const existingIds = new Set(existing.map((v) => v.youtubeId));
    const newVideos = userSubmitted[locationId].filter((v) => !existingIds.has(v.youtubeId));
    merged[locationId] = [...existing, ...newVideos];
  });

  return merged;
};

// Helper to extract YouTube video ID from URL
const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

// Helper to get video recommendations from localStorage
const getVideoRecommendations = (): Record<string, number> => {
  if (typeof window === "undefined") return {};
  const stored = localStorage.getItem("koreaVideoRecommendations");
  return stored ? JSON.parse(stored) : {};
};

// Helper to get user's recommended videos
const getUserRecommendedVideos = (): string[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("koreaUserRecommendedVideos");
  return stored ? JSON.parse(stored) : [];
};

// Dynamic import for Leaflet map (SSR disabled)
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[2/1] bg-[--color-bg-tertiary] rounded-2xl animate-pulse flex items-center justify-center">
      <span className="text-[--color-text-tertiary]">Loading map...</span>
    </div>
  ),
});

const navLinks = [
  { label: "Map - Victoria", href: "/" },
  { label: "Map - Korea", href: "/map-korea", isActive: true },
  { label: "My Profile", href: "/profile/adventurevictoria" },
  { label: "iOS App", href: "/ios-adventuretube" },
  { label: "Wireframes", href: "/wireframes" },
  { label: "About", href: "/about" },
];

const footerSections = [
  {
    title: "Content",
    links: [
      { label: "Latest Videos", href: "https://www.youtube.com/@outboundscape/videos" },
      { label: "Playlists", href: "https://www.youtube.com/@outboundscape/playlists" },
      { label: "Community", href: "https://www.youtube.com/@outboundscape/community" },
    ],
  },
  {
    title: "Categories",
    links: [
      { label: "Hiking", href: "/" },
      { label: "Beach", href: "/" },
      { label: "Valley", href: "/" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Subscribe", href: "https://www.youtube.com/@outboundscape?sub_confirmation=1" },
      { label: "YouTube", href: "https://www.youtube.com/@outboundscape" },
      { label: "Contact Us", href: "/#contact" },
    ],
  },
];

const socialLinks = [
  { name: "YouTube", href: "https://www.youtube.com/@outboundscape", icon: SocialIcons.YouTube },
  { name: "Instagram", href: "#", icon: SocialIcons.Instagram },
];

// Tent/Camping Logo Component
const CampingLogo = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2L2 22h20L12 2z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 22V12" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 22l5-10 5 10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Category colors matching MapComponent
const categoryColors: Record<string, string> = {
  Hiking: "#4cb782",
  Beach: "#4ea7fc",
  Temple: "#f2c94c",
  Valley: "#5e6ad2",
  Nature: "#7170ff",
  Urban: "#8a8f98",
  Cultural: "#fc7840",
  Palace: "#eb5757",
  Garden: "#27ae60",
  Waterfall: "#3498db",
  Trail: "#9b59b6",
  International: "#e74c3c",
  Camping: "#2ecc71",
  Drive: "#f39c12",
};

// All category types for filtering
type CategoryType = "all" | "Hiking" | "Nature" | "Beach" | "Valley" | "Urban" | "Temple" | "Waterfall" | "Cultural" | "Garden" | "International" | "Palace" | "Trail" | "Camping" | "Drive";

// Category icons for filter buttons
const categoryIcons: Record<string, React.ReactNode> = {
  Hiking: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  Nature: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  Beach: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.893 13.393l-1.135-1.135a2.252 2.252 0 01-.421-.585l-1.08-2.16a.414.414 0 00-.663-.107.827.827 0 01-.812.21l-1.273-.363a.89.89 0 00-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 01-1.81 1.025 1.055 1.055 0 01-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 01-1.383-2.46l.007-.042a2.25 2.25 0 01.29-.787l.09-.15a2.25 2.25 0 012.37-1.048l1.178.236a1.125 1.125 0 001.302-.795l.208-.73a1.125 1.125 0 00-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 01-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 01-1.458-1.137l1.411-2.353a2.25 2.25 0 00.286-.76m11.928 9.869A9 9 0 008.965 3.525m11.928 9.868A9 9 0 118.965 3.525" />
    </svg>
  ),
  Valley: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21l6-6 4 4 8-8M21 21H3" />
    </svg>
  ),
  Urban: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  Temple: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3L2 12h3v9h14v-9h3L12 3z" />
    </svg>
  ),
  Waterfall: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m-4-8v8m8-12v12" />
    </svg>
  ),
  Cultural: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
    </svg>
  ),
  Garden: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  International: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Palace: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3L2 8l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
  Trail: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  ),
  Camping: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 22h20L12 2z" />
    </svg>
  ),
  Drive: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  ),
};

export default function MapKoreaPage() {
  const [selectedVideo, setSelectedVideo] = useState<KoreaVideo | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<CategoryType>("all");
  const [communityVideos, setCommunityVideos] = useState<Record<string, CommunityVideo[]>>({});
  const [videoUrl, setVideoUrl] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [videoRecommendations, setVideoRecommendations] = useState<Record<string, number>>({});
  const [userRecommendedVideos, setUserRecommendedVideos] = useState<string[]>([]);
  const [currentPlayingVideoId, setCurrentPlayingVideoId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Load community videos and recommendations from localStorage on mount
  useEffect(() => {
    setCommunityVideos(getCommunityVideos());
    setVideoRecommendations(getVideoRecommendations());
    setUserRecommendedVideos(getUserRecommendedVideos());
  }, []);

  // Reset form state when modal closes or location changes
  useEffect(() => {
    setVideoUrl("");
    setSubmitStatus("idle");
    setShowSubmitForm(false);
    // Set the current playing video: original video first
    if (selectedVideo?.videoId) {
      setCurrentPlayingVideoId(selectedVideo.videoId);
    } else if (selectedVideo) {
      // No original video, check for community videos
      const locationCommunityVideos = communityVideos[selectedVideo.videoId] || [];
      setCurrentPlayingVideoId(locationCommunityVideos[0]?.youtubeId || null);
    } else {
      setCurrentPlayingVideoId(null);
    }
  }, [selectedVideo, communityVideos]);

  // Handle community video submission
  const handleVideoSubmit = () => {
    if (!selectedVideo) return;

    const youtubeId = extractYouTubeId(videoUrl);
    if (!youtubeId) {
      setSubmitStatus("error");
      return;
    }

    const newVideo: CommunityVideo = {
      youtubeId,
      submittedAt: new Date().toISOString(),
      locationId: selectedVideo.videoId,
    };

    const locationVideos = communityVideos[selectedVideo.videoId] || [];

    // Check if video already exists
    if (locationVideos.some(v => v.youtubeId === youtubeId)) {
      setSubmitStatus("error");
      return;
    }

    const updatedVideos = {
      ...communityVideos,
      [selectedVideo.videoId]: [...locationVideos, newVideo],
    };

    setCommunityVideos(updatedVideos);
    localStorage.setItem("koreaMapCommunityVideos", JSON.stringify(updatedVideos));
    setVideoUrl("");
    setSubmitStatus("success");
    setShowSubmitForm(false);
  };

  // Handle recommend for a community video
  const handleRecommend = (youtubeId: string) => {
    if (userRecommendedVideos.includes(youtubeId)) return; // Already recommended

    const newRecommendations = {
      ...videoRecommendations,
      [youtubeId]: (videoRecommendations[youtubeId] || 0) + 1
    };
    const newUserRecommended = [...userRecommendedVideos, youtubeId];

    setVideoRecommendations(newRecommendations);
    setUserRecommendedVideos(newUserRecommended);

    localStorage.setItem("koreaVideoRecommendations", JSON.stringify(newRecommendations));
    localStorage.setItem("koreaUserRecommendedVideos", JSON.stringify(newUserRecommended));
  };

  // Load videos from JSON
  const videos: KoreaVideo[] = koreaVideoData.videos;

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    videos.forEach((video) => {
      counts[video.category] = (counts[video.category] || 0) + 1;
    });
    return counts;
  }, [videos]);

  // Filter videos based on category
  const filteredVideos = useMemo(() => {
    if (categoryFilter === "all") return videos;
    return videos.filter((video) => video.category === categoryFilter);
  }, [videos, categoryFilter]);

  // Sort by views (most popular first)
  const sortedVideos = useMemo(() => {
    return [...filteredVideos].sort((a, b) => b.views - a.views);
  }, [filteredVideos]);

  const handleMarkerClick = (video: KoreaVideo) => {
    setSelectedVideo(video);
  };

  const closeModal = () => {
    setSelectedVideo(null);
  };

  // Format view count
  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  // Categories ordered by count (highest first), then alphabetically
  const orderedCategories: CategoryType[] = [
    "Hiking", "Nature", "Beach", "Urban", "Valley", "Temple",
    "Waterfall", "Cultural", "Garden", "International", "Palace", "Trail", "Camping", "Drive"
  ];

  return (
    <div className="min-h-screen bg-[--color-bg-primary]">
      {/* Navbar */}
      <Navbar
        logo={
          <div className="w-10 h-10 rounded-[--radius-lg] bg-gradient-to-br from-[--color-green] to-[--color-brand] flex items-center justify-center text-white">
            <CampingLogo />
          </div>
        }
        logoText="Adventure Victoria"
        links={navLinks}
        ctaButton={
          <a
            href="https://www.youtube.com/@outboundscape?sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="sm" className="bg-[#FF0000] hover:bg-[#CC0000]">
              Subscribe
            </Button>
          </a>
        }
        sticky
      />

      {/* Hero Map Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[--color-text-primary] mb-6">
              Outboundscape Korea
            </h1>
            <p className="text-xl sm:text-2xl text-[--color-text-secondary] max-w-3xl mx-auto mb-4">
              Scenic Travel Adventures Across South Korea
            </p>
            <p className="text-[--color-text-tertiary] max-w-2xl mx-auto">
              Discover {videos.length} amazing locations across South Korea. Click any marker to watch the video.
            </p>
          </div>

          {/* Category Filter Section */}
          <div className="mb-6 space-y-4 max-w-4xl mx-auto">
            <div className="bg-[--color-bg-secondary] rounded-xl p-4">
              <span className="text-xs text-[--color-text-tertiary] block mb-3">Category</span>
              <div className="flex flex-wrap justify-center gap-2">
                {/* All button */}
                <Button
                  size="sm"
                  variant={categoryFilter === "all" ? "primary" : "secondary"}
                  onClick={() => setCategoryFilter("all")}
                  className="rounded-full text-xs px-3 py-1.5"
                >
                  All ({videos.length})
                </Button>
                {/* Category buttons */}
                {orderedCategories.map((category) => {
                  const count = categoryCounts[category] || 0;
                  if (count === 0) return null;
                  const isActive = categoryFilter === category;
                  return (
                    <Button
                      key={category}
                      size="sm"
                      variant={isActive ? "primary" : "secondary"}
                      onClick={() => setCategoryFilter(category)}
                      className={`rounded-full text-xs px-3 py-1.5 ${isActive ? "" : ""}`}
                      style={isActive ? { backgroundColor: categoryColors[category] } : undefined}
                      leftIcon={categoryIcons[category]}
                    >
                      {category} ({count})
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Fullscreen Map Overlay */}
          {isFullscreen && (
            <div className="fixed inset-0 z-[9999] bg-[--color-bg-primary]">
              {/* Close button */}
              <button
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 z-10 p-3 bg-[--color-bg-secondary] hover:bg-[--color-bg-tertiary] rounded-full border border-[--color-border-primary] transition-colors shadow-lg"
                title="Exit fullscreen"
              >
                <svg className="w-6 h-6 text-[--color-text-primary]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Fullscreen Map */}
              <div className="w-full h-full">
                <MapComponent key="fullscreen" videos={filteredVideos} onMarkerClick={handleMarkerClick} />
              </div>
            </div>
          )}

          {/* Interactive Map Container (normal mode) */}
          <div className="relative rounded-2xl overflow-hidden border border-[--color-border-primary]">
            {/* Fullscreen toggle button */}
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 z-20 p-2 bg-[--color-bg-secondary] hover:bg-[--color-bg-tertiary] rounded-lg border border-[--color-border-primary] transition-colors"
              title="Enter fullscreen"
            >
              <svg className="w-5 h-5 text-[--color-text-primary]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            </button>

            <div className="relative w-full aspect-[2/1]">
              <MapComponent key="normal" videos={filteredVideos} onMarkerClick={handleMarkerClick} />
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
            {orderedCategories.map((category) => {
              const count = categoryCounts[category] || 0;
              if (count === 0) return null;
              return (
                <div key={`legend-${category}`} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: categoryColors[category] }}
                  />
                  <span className="text-[--color-text-tertiary]">{category}</span>
                </div>
              );
            })}
          </div>

          {/* Channel Info */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[--color-bg-secondary] rounded-full">
              <span className="text-[--color-text-secondary]">
                {videos.length} videos from
              </span>
              <a
                href="https://www.youtube.com/@outboundscape"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[--color-brand] hover:text-[--color-brand-hover] font-medium"
              >
                @outboundscape
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Video List Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[--color-bg-secondary]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-[--color-text-primary] mb-6">
            {categoryFilter === "all" ? "All Videos" : `${categoryFilter} Videos`} ({sortedVideos.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sortedVideos.map((video, index) => {
              const communityVideoCount = communityVideos[video.videoId]?.length || 0;
              return (
                <button
                  key={`card-${video.videoId}-${index}`}
                  onClick={() => setSelectedVideo(video)}
                  className="group text-left"
                >
                  <div className="relative mb-2">
                    {/* Community video count badge */}
                    <NotificationBadge count={communityVideoCount} />
                    <div className="relative aspect-video rounded-xl overflow-hidden">
                      <img
                        src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <svg
                          className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <span
                        className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-medium text-white"
                        style={{ backgroundColor: categoryColors[video.category] }}
                      >
                        {video.category}
                      </span>
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-medium text-white bg-black/70">
                        {video.duration}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-[--color-text-primary] line-clamp-2 group-hover:text-[--color-brand] transition-colors">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-[--color-text-tertiary]">
                      {formatViews(video.views)} views
                    </p>
                    <span className="text-xs text-[--color-text-tertiary]">•</span>
                    <p className="text-xs text-[--color-text-tertiary]">
                      {video.uploadedAgo}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-[--color-bg-secondary] rounded-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video Player */}
            <div className="aspect-video flex-shrink-0 m-4 mb-0 rounded-xl overflow-hidden">
              <iframe
                key={currentPlayingVideoId}
                src={`https://www.youtube.com/embed/${currentPlayingVideoId || selectedVideo.videoId}?autoplay=1`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            </div>

            {/* Video Info */}
            <div className="p-4 overflow-y-auto flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-[--color-text-primary]">
                    {selectedVideo.title}
                  </h3>
                  <p className="text-[--color-text-tertiary] text-sm mt-1">
                    {selectedVideo.location}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: categoryColors[selectedVideo.category] }}
                    >
                      {selectedVideo.category}
                    </span>
                    <a
                      href={`https://www.youtube.com/watch?v=${selectedVideo.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#FF0000] hover:bg-[#CC0000] text-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                      Watch on YouTube
                    </a>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[--color-text-tertiary] mt-2">
                    <span>{formatViews(selectedVideo.views)} views</span>
                    <span>{selectedVideo.uploadedAgo}</span>
                    <span>{selectedVideo.duration}</span>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg bg-[--color-bg-tertiary] hover:bg-[--color-border-primary] transition-colors"
                >
                  <svg className="w-5 h-5 text-[--color-text-secondary]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Community Videos Section */}
              <div className="mt-6 pt-6 border-t border-[--color-border-primary]">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-[--color-text-primary] flex items-center gap-2">
                    <svg className="w-4 h-4 text-[--color-brand]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Community Videos
                    {communityVideos[selectedVideo.videoId]?.length > 0 && (
                      <span className="text-xs text-[--color-text-tertiary]">
                        ({communityVideos[selectedVideo.videoId].length})
                      </span>
                    )}
                  </h4>
                  {!showSubmitForm && (
                    <button
                      onClick={() => setShowSubmitForm(true)}
                      className="px-3 py-1.5 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                      style={{ backgroundColor: 'var(--color-brand)' }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Share Your Video
                    </button>
                  )}
                </div>

                {/* Submit Form */}
                {showSubmitForm && (
                  <div className="mb-4 p-4 bg-[--color-bg-tertiary] rounded-lg">
                    <p className="text-xs text-[--color-text-secondary] mb-3">
                      Share your adventure video at this location with the community!
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={videoUrl}
                        onChange={(e) => {
                          setVideoUrl(e.target.value);
                          setSubmitStatus("idle");
                        }}
                        placeholder="Paste YouTube URL..."
                        className="flex-1 px-3 py-2 bg-[--color-bg-secondary] border border-[--color-border-primary] rounded-lg text-sm text-[--color-text-primary] placeholder:text-[--color-text-tertiary] focus:outline-none focus:border-[--color-brand]"
                      />
                      <button
                        onClick={handleVideoSubmit}
                        disabled={!videoUrl.trim()}
                        className="px-4 py-2 bg-[--color-brand] hover:bg-[--color-brand-hover] disabled:bg-[--color-bg-secondary] disabled:text-[--color-text-tertiary] text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        Submit
                      </button>
                      <button
                        onClick={() => {
                          setShowSubmitForm(false);
                          setVideoUrl("");
                          setSubmitStatus("idle");
                        }}
                        className="px-3 py-2 bg-[--color-bg-secondary] hover:bg-[--color-border-primary] text-[--color-text-secondary] text-sm rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                    {submitStatus === "error" && (
                      <p className="text-xs text-[--color-red] mt-2">
                        Invalid YouTube URL or video already submitted. Please check and try again.
                      </p>
                    )}
                  </div>
                )}

                {/* Success Message */}
                {submitStatus === "success" && (
                  <div className="mb-4 p-3 bg-[--color-green]/10 border border-[--color-green]/20 rounded-lg flex items-center gap-2">
                    <svg className="w-4 h-4 text-[--color-green]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-xs text-[--color-green]">
                      Thank you! Your video has been added to the community collection.
                    </p>
                  </div>
                )}

                {/* Video Playlist - Original video first, then community videos */}
                {(() => {
                  // Build combined video list: original video first, then community videos
                  const allVideos: Array<{
                    youtubeId: string;
                    title: string;
                    channelName: string;
                    isOriginal: boolean;
                  }> = [];

                  // Add original video first
                  allVideos.push({
                    youtubeId: selectedVideo.videoId,
                    title: selectedVideo.title,
                    channelName: "Outboundscape",
                    isOriginal: true,
                  });

                  // Add community videos
                  const communityList = communityVideos[selectedVideo.videoId] || [];
                  communityList.forEach((video) => {
                    allVideos.push({
                      youtubeId: video.youtubeId,
                      title: video.title || "Community Video",
                      channelName: video.channelName || "Member",
                      isOriginal: false,
                    });
                  });

                  return (
                    <div className="space-y-2">
                      {allVideos.map((video, index) => {
                        const isPlaying = currentPlayingVideoId === video.youtubeId;
                        const recommendCount = videoRecommendations[video.youtubeId] || 0;
                        const hasRecommended = userRecommendedVideos.includes(video.youtubeId);

                        return (
                          <button
                            key={`playlist-${video.youtubeId}-${index}`}
                            onClick={() => setCurrentPlayingVideoId(video.youtubeId)}
                            className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-all ${
                              isPlaying
                                ? "bg-[--color-brand]/20 ring-2 ring-[--color-brand]"
                                : "bg-[--color-bg-tertiary] hover:bg-[--color-bg-tertiary]/80"
                            }`}
                          >
                            {/* Video Thumbnail */}
                            <div className="relative w-24 h-14 flex-shrink-0 rounded-md overflow-hidden">
                              <img
                                src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                                alt={video.title}
                                className="w-full h-full object-cover"
                              />
                              {isPlaying ? (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                  <div className="flex items-center gap-0.5">
                                    <span className="w-1 h-3 bg-white rounded-full animate-pulse" />
                                    <span className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                                    <span className="w-1 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
                                  </div>
                                </div>
                              ) : (
                                <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center group">
                                  <svg
                                    className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                              )}
                              {video.isOriginal && (
                                <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#FF0000] rounded text-[8px] font-bold text-white">
                                  ORIGINAL
                                </div>
                              )}
                            </div>

                            {/* Video Info */}
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs line-clamp-2 ${isPlaying ? "text-[--color-brand] font-medium" : "text-[--color-text-primary]"}`}>
                                {video.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-[--color-text-tertiary] flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                  {video.channelName}
                                </span>
                                {isPlaying && (
                                  <span className="text-[10px] text-[--color-brand] font-medium">
                                    Now Playing
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Recommend Button - only for community videos */}
                            {!video.isOriginal && (
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRecommend(video.youtubeId);
                                }}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                  hasRecommended
                                    ? "bg-[--color-green]/20 text-[--color-green] cursor-default"
                                    : "bg-[--color-bg-secondary] hover:bg-[--color-brand] text-[--color-text-secondary] hover:text-white cursor-pointer"
                                }`}
                              >
                                {hasRecommended ? (
                                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
                                  </svg>
                                ) : (
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
                                  </svg>
                                )}
                                {recommendCount > 0 ? recommendCount : "Recommend"}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer
        logo={
          <div className="w-10 h-10 rounded-[--radius-lg] bg-gradient-to-br from-[--color-green] to-[--color-brand] flex items-center justify-center text-white">
            <CampingLogo />
          </div>
        }
        logoText="Outboundscape Korea"
        description="Scenic travel adventures across South Korea. Explore serene landscapes and enchanting destinations."
        sections={footerSections}
        socialLinks={socialLinks}
        copyright="© 2026 Outboundscape. All rights reserved."
        bottomLinks={[
          { label: "Privacy Policy", href: "#" },
          { label: "Terms of Service", href: "#" },
        ]}
      />
    </div>
  );
}
