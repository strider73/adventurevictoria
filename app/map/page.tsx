"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Navbar, Footer, SocialIcons, Button } from "@/components/ui";

// Import camping sites data
import campingData from "@/data/victoria-camping-sites.json";
import videoData from "@/data/chris-video.json";
import communityVideoData from "@/data/community-videos.json";

// Dynamic import for Leaflet map (SSR disabled)
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[2/1] bg-[--color-bg-tertiary] rounded-2xl animate-pulse flex items-center justify-center">
      <span className="text-[--color-text-tertiary]">Loading map...</span>
    </div>
  ),
});

// Video location type definition
interface VideoLocation {
  id: string;
  title: string;
  location: string;
  lat: number;
  lng: number;
  category: string;
  description: string;
  youtubeId: string | null;
  videoTitle: string | null;
  duration: string | null;
  views: number | null;
  hasVideo: boolean;
}

// Create a map of campingSiteId to video data for quick lookup
const videosByCampingSiteId = new Map(
  videoData.videos
    .filter((v) => v.campingSiteId)
    .map((v) => [v.campingSiteId, v])
);

// Use camping sites from JSON data, linking with actual YouTube videos where available
const videoLocations: VideoLocation[] = campingData.campingSites.map((site) => {
  const linkedVideo = videosByCampingSiteId.get(site.id);
  return {
    id: site.id,
    title: site.title,
    location: site.location,
    lat: site.lat,
    lng: site.lng,
    category: site.category,
    description: site.description,
    // Add YouTube video data if we have a video for this site
    youtubeId: linkedVideo?.videoId || null,
    videoTitle: linkedVideo?.title || null,
    duration: linkedVideo?.duration || null,
    views: linkedVideo?.views || null,
    hasVideo: !!linkedVideo,
  };
});

// Category colors
const categoryColors: Record<string, string> = {
  "National Parks": "#4cb782",
  "State Forests": "#5e6ad2",
  "Great Ocean Road": "#4ea7fc",
  "Hiking": "#f2c94c",
  "Holiday Parks": "#fc7840",
  "Family Holidays": "#eb5757",
  "Water Activities": "#7170ff",
  "Bush Camping": "#8a8f98",
};

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Map Playground", href: "/map", isActive: true },
  { label: "About", href: "/about" },
];

const footerSections = [
  {
    title: "Content",
    links: [
      { label: "Latest Videos", href: "https://www.youtube.com/@Adventurevictoria/videos" },
      { label: "Playlists", href: "https://www.youtube.com/@Adventurevictoria/playlists" },
      { label: "Community", href: "https://www.youtube.com/@Adventurevictoria/community" },
    ],
  },
  {
    title: "Categories",
    links: [
      { label: "Destination Guides", href: "/" },
      { label: "Gear Reviews", href: "/" },
      { label: "Camp Cooking", href: "/" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Subscribe", href: "https://www.youtube.com/@Adventurevictoria?sub_confirmation=1" },
      { label: "YouTube", href: "https://www.youtube.com/@Adventurevictoria" },
      { label: "Contact Us", href: "/#contact" },
    ],
  },
];

const socialLinks = [
  { name: "YouTube", href: "https://www.youtube.com/@Adventurevictoria", icon: SocialIcons.YouTube },
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


// Helper to get votes from localStorage
const getVotes = (): Record<string, number> => {
  if (typeof window === "undefined") return {};
  const stored = localStorage.getItem("locationVotes");
  return stored ? JSON.parse(stored) : {};
};

// Helper to get user's voted locations
const getUserVoted = (): string[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("userVotedLocations");
  return stored ? JSON.parse(stored) : [];
};

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
  communityVideoData.communityVideos.forEach((location) => {
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

  const stored = localStorage.getItem("communityVideos");
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
  const stored = localStorage.getItem("videoRecommendations");
  return stored ? JSON.parse(stored) : {};
};

// Helper to get user's recommended videos
const getUserRecommendedVideos = (): string[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("userRecommendedVideos");
  return stored ? JSON.parse(stored) : [];
};

// Activity filter mapping to categories
const activityMapping: Record<string, string[]> = {
  camping: ["National Parks", "State Forests", "Bush Camping"],
  hiking: ["Hiking"],
  beach: ["Great Ocean Road", "Water Activities"],
  family: ["Holiday Parks", "Family Holidays"],
};

export default function MapPage() {
  const [selectedVideo, setSelectedVideo] = useState<typeof videoLocations[0] | null>(null);
  const [videoFilter, setVideoFilter] = useState<"all" | "hasVideo" | "myVideos">("all");
  const [activityFilter, setActivityFilter] = useState<"all" | "camping" | "hiking" | "beach" | "family">("all");
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [userVoted, setUserVoted] = useState<string[]>([]);
  const [communityVideos, setCommunityVideos] = useState<Record<string, CommunityVideo[]>>({});
  const [videoUrl, setVideoUrl] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [videoRecommendations, setVideoRecommendations] = useState<Record<string, number>>({});
  const [userRecommendedVideos, setUserRecommendedVideos] = useState<string[]>([]);

  // Load votes, community videos, and recommendations from localStorage on mount
  useEffect(() => {
    setVotes(getVotes());
    setUserVoted(getUserVoted());
    setCommunityVideos(getCommunityVideos());
    setVideoRecommendations(getVideoRecommendations());
    setUserRecommendedVideos(getUserRecommendedVideos());
  }, []);

  // Reset form state when modal closes or location changes
  useEffect(() => {
    setVideoUrl("");
    setSubmitStatus("idle");
    setShowSubmitForm(false);
  }, [selectedVideo]);

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
      locationId: selectedVideo.id,
    };

    const locationVideos = communityVideos[selectedVideo.id] || [];

    // Check if video already exists
    if (locationVideos.some(v => v.youtubeId === youtubeId)) {
      setSubmitStatus("error");
      return;
    }

    const updatedVideos = {
      ...communityVideos,
      [selectedVideo.id]: [...locationVideos, newVideo],
    };

    setCommunityVideos(updatedVideos);
    localStorage.setItem("communityVideos", JSON.stringify(updatedVideos));
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

    localStorage.setItem("videoRecommendations", JSON.stringify(newRecommendations));
    localStorage.setItem("userRecommendedVideos", JSON.stringify(newUserRecommended));
  };

  // Handle vote/request for a location
  const handleVote = (locationId: string) => {
    if (userVoted.includes(locationId)) return; // Already voted

    const newVotes = { ...votes, [locationId]: (votes[locationId] || 0) + 1 };
    const newUserVoted = [...userVoted, locationId];

    setVotes(newVotes);
    setUserVoted(newUserVoted);

    localStorage.setItem("locationVotes", JSON.stringify(newVotes));
    localStorage.setItem("userVotedLocations", JSON.stringify(newUserVoted));
  };

  // Calculate counts for filter badges
  const totalCount = videoLocations.length;
  const hasVideoCount = videoLocations.filter((v) => v.hasVideo || (communityVideos[v.id]?.length > 0)).length;
  const myVideosCount = videoLocations.filter((v) => v.hasVideo).length;

  // Apply filters
  const filteredLocations = videoLocations.filter((v) => {
    // Video source filter
    if (videoFilter === "hasVideo" && !v.hasVideo && !(communityVideos[v.id]?.length > 0)) {
      return false;
    }
    if (videoFilter === "myVideos" && !v.hasVideo) {
      return false;
    }

    // Activity filter
    if (activityFilter !== "all") {
      const allowedCategories = activityMapping[activityFilter];
      if (!allowedCategories.includes(v.category)) {
        return false;
      }
    }

    return true;
  });

  // Sort locations: videos first, then by votes for locations without videos
  const sortedLocations = [...filteredLocations].sort((a, b) => {
    // Real videos first, then placeholders sorted by votes
    if (a.hasVideo && !b.hasVideo) return -1;
    if (!a.hasVideo && b.hasVideo) return 1;
    if (!a.hasVideo && !b.hasVideo) {
      return (votes[b.id] || 0) - (votes[a.id] || 0);
    }
    return 0;
  });

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
            href="https://www.youtube.com/@Adventurevictoria?sub_confirmation=1"
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
              Adventure Victoria
            </h1>
            <p className="text-xl sm:text-2xl text-[--color-text-secondary] max-w-3xl mx-auto mb-4">
              Family Camping Adventures Across Victoria
            </p>
            <p className="text-[--color-text-tertiary] max-w-2xl mx-auto">
              Discover 81 camping spots across Victoria. Click any marker to watch our adventure videos and plan your next family trip.
            </p>
          </div>

          {/* Filter Section */}
          <div className="mb-6 space-y-4 max-w-2xl mx-auto">
            {/* Video Source Filter */}
            <div className="bg-[--color-bg-secondary] rounded-xl p-4">
              <span className="text-xs text-[--color-text-tertiary] block mb-3">Video Source</span>
              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  size="sm"
                  variant={videoFilter === "all" ? "primary" : "secondary"}
                  onClick={() => setVideoFilter("all")}
                  className="rounded-full"
                >
                  All ({totalCount})
                </Button>
                <Button
                  size="sm"
                  variant={videoFilter === "hasVideo" ? "primary" : "secondary"}
                  onClick={() => setVideoFilter("hasVideo")}
                  className="rounded-full"
                  leftIcon={
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  }
                >
                  Has Video ({hasVideoCount})
                </Button>
                <Button
                  size="sm"
                  variant={videoFilter === "myVideos" ? "primary" : "secondary"}
                  onClick={() => setVideoFilter("myVideos")}
                  className={`rounded-full ${videoFilter === "myVideos" ? "bg-[#FF0000] hover:bg-[#CC0000]" : ""}`}
                  leftIcon={
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  }
                >
                  My Videos ({myVideosCount})
                </Button>
              </div>
            </div>

            {/* Activity Filter */}
            <div className="bg-[--color-bg-secondary] rounded-xl p-4">
              <span className="text-xs text-[--color-text-tertiary] block mb-3">Activity</span>
              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  size="sm"
                  variant={activityFilter === "all" ? "primary" : "secondary"}
                  onClick={() => setActivityFilter("all")}
                  className="rounded-full text-xs px-3 py-1.5"
                >
                  All
                </Button>
                <Button
                  size="sm"
                  variant={activityFilter === "camping" ? "primary" : "secondary"}
                  onClick={() => setActivityFilter("camping")}
                  className={`rounded-full text-xs px-3 py-1.5 ${activityFilter === "camping" ? "bg-[--color-green] hover:bg-[--color-green]" : ""}`}
                  leftIcon={
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 22h20L12 2z" />
                    </svg>
                  }
                >
                  Camping
                </Button>
                <Button
                  size="sm"
                  variant={activityFilter === "hiking" ? "primary" : "secondary"}
                  onClick={() => setActivityFilter("hiking")}
                  className={`rounded-full text-xs px-3 py-1.5 ${activityFilter === "hiking" ? "bg-[--color-yellow] hover:bg-[--color-yellow] text-black" : ""}`}
                  leftIcon={
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  }
                >
                  Hiking
                </Button>
                <Button
                  size="sm"
                  variant={activityFilter === "beach" ? "primary" : "secondary"}
                  onClick={() => setActivityFilter("beach")}
                  className={`rounded-full text-xs px-3 py-1.5 ${activityFilter === "beach" ? "bg-[--color-blue] hover:bg-[--color-blue]" : ""}`}
                  leftIcon={
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.893 13.393l-1.135-1.135a2.252 2.252 0 01-.421-.585l-1.08-2.16a.414.414 0 00-.663-.107.827.827 0 01-.812.21l-1.273-.363a.89.89 0 00-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 01-1.81 1.025 1.055 1.055 0 01-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 01-1.383-2.46l.007-.042a2.25 2.25 0 01.29-.787l.09-.15a2.25 2.25 0 012.37-1.048l1.178.236a1.125 1.125 0 001.302-.795l.208-.73a1.125 1.125 0 00-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 01-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 01-1.458-1.137l1.411-2.353a2.25 2.25 0 00.286-.76m11.928 9.869A9 9 0 008.965 3.525m11.928 9.868A9 9 0 118.965 3.525" />
                    </svg>
                  }
                >
                  Beach
                </Button>
                <Button
                  size="sm"
                  variant={activityFilter === "family" ? "primary" : "secondary"}
                  onClick={() => setActivityFilter("family")}
                  className={`rounded-full text-xs px-3 py-1.5 ${activityFilter === "family" ? "bg-[--color-orange] hover:bg-[--color-orange]" : ""}`}
                  leftIcon={
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                  }
                >
                  Family
                </Button>
              </div>
            </div>
          </div>

          {/* Interactive Map Container - Using Leaflet with OpenStreetMap */}
          <div className="relative rounded-2xl overflow-hidden border border-[--color-border-primary]">
            <div className="relative aspect-[2/1]">
              <MapComponent
                locations={filteredLocations}
                onMarkerClick={(video) => setSelectedVideo(video)}
              />
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
            {Object.keys(categoryColors).map((category) => (
              <div key={`legend-${category}`} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: categoryColors[category] }}
                />
                <span className="text-[--color-text-tertiary]">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Selected Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="bg-[--color-bg-secondary] rounded-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {!selectedVideo.hasVideo ? (
              // Placeholder location - Coming Soon
              <div className="aspect-video flex-shrink-0 flex flex-col items-center justify-center" style={{ backgroundColor: categoryColors[selectedVideo.category] }}>
                <svg className="w-20 h-20 text-white/80 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-white text-xl font-semibold">Video Coming Soon</p>
                <p className="text-white/70 text-sm mt-1">We haven&apos;t visited this spot yet!</p>
                {votes[selectedVideo.id] > 0 && (
                  <div className="mt-3 px-4 py-1.5 bg-white/20 rounded-full">
                    <span className="text-white font-medium">{votes[selectedVideo.id]} {votes[selectedVideo.id] === 1 ? 'person' : 'people'} requested this!</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-video flex-shrink-0 m-4 mb-0 rounded-xl overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                  title={selectedVideo.videoTitle || selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            )}
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
                    {selectedVideo.hasVideo && selectedVideo.youtubeId && (
                      <a
                        href={`https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#FF0000] hover:bg-[#CC0000] text-white transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                        Play on YouTube
                      </a>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="p-2 rounded-lg bg-[--color-bg-tertiary] hover:bg-[--color-border-primary] transition-colors"
                >
                  <svg className="w-5 h-5 text-[--color-text-secondary]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {!selectedVideo.hasVideo && (
                <div className="mt-4">
                  <button
                    onClick={() => handleVote(selectedVideo.id)}
                    disabled={userVoted.includes(selectedVideo.id)}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                      userVoted.includes(selectedVideo.id)
                        ? "bg-[--color-green]/20 text-[--color-green] cursor-default"
                        : "bg-[--color-brand] hover:bg-[--color-brand-hover] text-white cursor-pointer"
                    }`}
                  >
                    {userVoted.includes(selectedVideo.id) ? (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        You Requested This Location!
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        Request This Location!
                      </>
                    )}
                  </button>
                  <p className="text-center text-[--color-text-tertiary] text-xs mt-2">
                    Help us decide where to camp next!
                  </p>
                </div>
              )}

              {/* Community Videos Section - Show for all locations */}
              <div className="mt-6 pt-6 border-t border-[--color-border-primary]">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-[--color-text-primary] flex items-center gap-2">
                      <svg className="w-4 h-4 text-[--color-brand]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Community Videos
                      {communityVideos[selectedVideo.id]?.length > 0 && (
                        <span className="text-xs text-[--color-text-tertiary]">
                          ({communityVideos[selectedVideo.id].length})
                        </span>
                      )}
                    </h4>
                    {!showSubmitForm && (
                      <button
                        onClick={() => setShowSubmitForm(true)}
                        className="text-xs text-[--color-brand] hover:text-[--color-brand-hover] font-medium flex items-center gap-1"
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

                  {/* Community Video List */}
                  {communityVideos[selectedVideo.id]?.length > 0 ? (
                    <div className="space-y-3">
                      {communityVideos[selectedVideo.id].map((video, index) => {
                        const recommendCount = videoRecommendations[video.youtubeId] || 0;
                        const hasRecommended = userRecommendedVideos.includes(video.youtubeId);
                        return (
                          <div
                            key={`community-${video.youtubeId}-${index}`}
                            className="flex items-center gap-3 p-2 bg-[--color-bg-tertiary] rounded-lg"
                          >
                            {/* Video Thumbnail */}
                            <a
                              href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group relative w-24 h-14 flex-shrink-0 rounded-md overflow-hidden"
                            >
                              <img
                                src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                                alt="Community video"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </a>

                            {/* Video Info */}
                            <div className="flex-1 min-w-0">
                              <a
                                href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-[--color-text-primary] hover:text-[--color-brand] transition-colors line-clamp-2"
                              >
                                {video.title || `Community Video #${index + 1}`}
                              </a>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-[--color-text-tertiary] flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                  {video.channelName || "Member"}
                                </span>
                              </div>
                            </div>

                            {/* Recommend Button */}
                            <button
                              onClick={() => handleRecommend(video.youtubeId)}
                              disabled={hasRecommended}
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
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-[--color-text-tertiary] text-center py-4">
                      No community videos yet. Be the first to share your adventure!
                    </p>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video List Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[--color-bg-secondary]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-[--color-text-primary] mb-6">
            All Camping Locations ({sortedLocations.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sortedLocations.map((video, index) => {
              const voteCount = votes[video.id] || 0;
              return (
                <button
                  key={`card-${video.id}-${index}`}
                  onClick={() => setSelectedVideo(video)}
                  className="group text-left"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-2">
                    {!video.hasVideo ? (
                      <div
                        className="w-full h-full flex flex-col items-center justify-center"
                        style={{ backgroundColor: categoryColors[video.category] }}
                      >
                        <svg className="w-10 h-10 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-white/70 text-xs mt-1">Coming Soon</span>
                      </div>
                    ) : (
                      <img
                        src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      {video.hasVideo && (
                        <svg
                          className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </div>
                    <span
                      className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-medium text-white"
                      style={{ backgroundColor: categoryColors[video.category] }}
                    >
                      {video.category}
                    </span>
                    {/* Vote count badge for locations without videos */}
                    {!video.hasVideo && voteCount > 0 && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-medium text-white bg-[--color-brand] flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        {voteCount}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-[--color-text-primary] line-clamp-1 group-hover:text-[--color-brand] transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-xs text-[--color-text-tertiary] line-clamp-1">
                    {video.location}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer
        logo={
          <div className="w-10 h-10 rounded-[--radius-lg] bg-gradient-to-br from-[--color-green] to-[--color-brand] flex items-center justify-center text-white">
            <CampingLogo />
          </div>
        }
        logoText="Adventure Victoria"
        description="Family camping adventures in Victoria, Australia. Inspiring families to explore the great outdoors together."
        sections={footerSections}
        socialLinks={socialLinks}
        copyright="© 2026 Adventure Victoria. All rights reserved."
        bottomLinks={[
          { label: "Privacy Policy", href: "#" },
          { label: "Terms of Service", href: "#" },
        ]}
      />
    </div>
  );
}
