"use client";

import { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Navbar, Footer, SocialIcons, Button, NotificationBadge } from "@/components/ui";


// Dynamic import for Leaflet map (SSR disabled)
const MapComponent = dynamic(() => import("@/components/map/MapComponent"), {
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
  // Computed field: first available video ID (original or community) for thumbnail display
  displayThumbnailId?: string | null;
}

interface CampingSite {
  id: string;
  title: string;
  location: string;
  lat: number;
  lng: number;
  category: string;
  description: string;
}

interface Video {
  id: string;
  videoId: string;
  title: string;
  duration: string;
  views: number;
  campingSiteId: string | null;
}

interface CommunityVideoEntry {
  campingSiteId: string;
  videos: Array<{
    videoId: string;
    title: string;
    channelName: string;
    source?: string;
  }>;
}

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
  "Farm Stay": "#8B4513", // Saddle brown - rustic farm color
  "Winery": "#722F37", // Wine red
};

const navLinks = [
  { label: "Map - Victoria", href: "/", isActive: true },
  { label: "Map - Korea", href: "/map-korea" },
  { label: "My Profile", href: "/profile/adventurevictoria" },
  { label: "iOS App", href: "/ios-adventuretube" },
  { label: "Wireframes", href: "/wireframes" },
  { label: "About AdventureTube", href: "/about" },
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
const getPreloadedCommunityVideos = (communityVideoData: CommunityVideoEntry[]): Record<string, CommunityVideo[]> => {
  const preloaded: Record<string, CommunityVideo[]> = {};
  communityVideoData.forEach((location) => {
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
const getCommunityVideos = (communityVideoData: CommunityVideoEntry[]): Record<string, CommunityVideo[]> => {
  const preloaded = getPreloadedCommunityVideos(communityVideoData);
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

function HomePageContent() {
  const searchParams = useSearchParams();
  const [videoLocations, setVideoLocations] = useState<VideoLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<VideoLocation | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [userVoted, setUserVoted] = useState<string[]>([]);
  const [communityVideos, setCommunityVideos] = useState<Record<string, CommunityVideo[]>>({});
  const [videoUrl, setVideoUrl] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [videoRecommendations, setVideoRecommendations] = useState<Record<string, number>>({});
  const [userRecommendedVideos, setUserRecommendedVideos] = useState<string[]>([]);
  const [currentPlayingVideoId, setCurrentPlayingVideoId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [mapPopupLocation, setMapPopupLocation] = useState<VideoLocation | null>(null);
  const [popupTrigger, setPopupTrigger] = useState(0); // Counter to force popup reopen

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Fetch data from API routes on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [campingRes, videoRes, communityRes] = await Promise.all([
          fetch("/api/victoria/camping-sites"),
          fetch("/api/victoria/videos"),
          fetch("/api/victoria/community-videos"),
        ]);

        const campingData: { campingSites: CampingSite[] } = await campingRes.json();
        const videoData: { videos: Video[] } = await videoRes.json();
        const communityData: { communityVideos: CommunityVideoEntry[] } = await communityRes.json();

        // Create a map of campingSiteId to video data for quick lookup
        const videosByCampingSiteId = new Map(
          videoData.videos
            .filter((v) => v.campingSiteId)
            .map((v) => [v.campingSiteId, v])
        );

        // Build video locations from camping sites + linked videos
        const locations: VideoLocation[] = campingData.campingSites.map((site) => {
          const linkedVideo = videosByCampingSiteId.get(site.id);
          return {
            id: site.id,
            title: site.title,
            location: site.location,
            lat: site.lat,
            lng: site.lng,
            category: site.category,
            description: site.description,
            youtubeId: linkedVideo?.videoId || null,
            videoTitle: linkedVideo?.title || null,
            duration: linkedVideo?.duration || null,
            views: linkedVideo?.views || null,
            hasVideo: !!linkedVideo,
          };
        });

        setVideoLocations(locations);
        setCommunityVideos(getCommunityVideos(communityData.communityVideos));

        // Check for site query parameter to auto-open popup
        const siteId = searchParams.get("site");
        if (siteId) {
          const targetLocation = locations.find(loc => loc.id === siteId);
          if (targetLocation) {
            setSelectedVideo(targetLocation);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
    setVotes(getVotes());
    setUserVoted(getUserVoted());
    setVideoRecommendations(getVideoRecommendations());
    setUserRecommendedVideos(getUserRecommendedVideos());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce search query by 2000ms
  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 2000);
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [searchQuery]);

  // Reset form state when modal closes or location changes
  useEffect(() => {
    setVideoUrl("");
    setSubmitStatus("idle");
    setShowSubmitForm(false);
    setShareCopied(false);
    // Set the current playing video: original video first, otherwise first community video
    if (selectedVideo?.youtubeId) {
      setCurrentPlayingVideoId(selectedVideo.youtubeId);
    } else if (selectedVideo) {
      // No original video, check for community videos
      const locationCommunityVideos = communityVideos[selectedVideo.id] || [];
      setCurrentPlayingVideoId(locationCommunityVideos[0]?.youtubeId || null);
    } else {
      setCurrentPlayingVideoId(null);
    }

    // Update URL with site parameter for sharing
    if (selectedVideo) {
      const url = new URL(window.location.href);
      url.searchParams.set("site", selectedVideo.id);
      window.history.replaceState({}, "", url.toString());
      // Clear map popup when modal opens
      setMapPopupLocation(null);
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete("site");
      window.history.replaceState({}, "", url.toString());
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

  // Close modal and reopen map popup
  const closeModalAndShowPopup = () => {
    const lastVideo = selectedVideo;
    setSelectedVideo(null);
    // Reopen map popup after modal closes
    if (lastVideo) {
      setTimeout(() => {
        setMapPopupLocation(lastVideo);
        setPopupTrigger(prev => prev + 1); // Force trigger even if same location
      }, 150);
    }
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

  // Enrich locations with displayThumbnailId (original video or first community video) and community video count
  const enrichedLocations = useMemo(() => {
    return videoLocations.map((location) => {
      const locationCommunityVideos = communityVideos[location.id] || [];
      const communityVideoCount = locationCommunityVideos.length;

      // If location has original video, use that
      if (location.hasVideo && location.youtubeId) {
        return { ...location, displayThumbnailId: location.youtubeId, communityVideoCount };
      }
      // Otherwise, check for community videos
      if (communityVideoCount > 0) {
        return { ...location, displayThumbnailId: locationCommunityVideos[0].youtubeId, communityVideoCount };
      }
      // No videos at all
      return { ...location, displayThumbnailId: null, communityVideoCount: 0 };
    });
  }, [communityVideos]);

  // All locations for count display
  const allLocations = enrichedLocations;
  const totalCount = allLocations.length;

  // Apply category filter and search query - memoized to prevent unnecessary re-renders
  const filteredLocations = useMemo(() => {
    return enrichedLocations.filter((v) => {
      // Category filter
      if (categoryFilter !== null && v.category !== categoryFilter) return false;

      // Search filter: match against site title, location, or community video title/channelName
      if (debouncedSearch.trim()) {
        const query = debouncedSearch.trim().toLowerCase();
        // Match site name or location
        const matchesSite =
          v.title.toLowerCase().includes(query) ||
          v.location.toLowerCase().includes(query);
        if (matchesSite) return true;
        // Match community video title or channel name
        const locationCommunityVideos = communityVideos[v.id] || [];
        const matchesCommunity = locationCommunityVideos.some(
          (cv) =>
            (cv.title && cv.title.toLowerCase().includes(query)) ||
            (cv.channelName && cv.channelName.toLowerCase().includes(query))
        );
        if (!matchesCommunity) return false;
      }

      return true;
    });
  }, [enrichedLocations, categoryFilter, debouncedSearch, communityVideos]);

  // Sort locations: videos first, then by votes for locations without videos - memoized
  const sortedLocations = useMemo(() => {
    return [...filteredLocations].sort((a, b) => {
      // Real videos first, then placeholders sorted by votes
      if (a.hasVideo && !b.hasVideo) return -1;
      if (!a.hasVideo && b.hasVideo) return 1;
      if (!a.hasVideo && !b.hasVideo) {
        return (votes[b.id] || 0) - (votes[a.id] || 0);
      }
      return 0;
    });
  }, [filteredLocations, votes]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[--color-bg-primary] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[--color-brand] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[--color-text-secondary]">Loading camping sites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[--color-bg-primary]">
      {/* Fullscreen Map Overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[9999]">
          {/* Map fills entire screen */}
          <div className="w-full h-full">
            <MapComponent
              key="fullscreen"
              locations={filteredLocations}
              onMarkerClick={(video) => setSelectedVideo(video)}
              externalActivePopup={mapPopupLocation}
              externalPopupTrigger={popupTrigger}
            />
          </div>

          {/* Floating category filter - top left */}
          <div className="absolute top-4 left-14 z-[1001] flex flex-wrap gap-1.5 max-w-[60%]">
            <button
              onClick={() => setCategoryFilter(null)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap border-2 border-white shadow-[0_2px_8px_rgba(0,0,0,0.3)] ${
                categoryFilter === null
                  ? "bg-white text-black"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[--color-green] to-[--color-brand]" />
              <span>All</span>
            </button>
            {Object.entries(categoryColors).map(([category, color]) => {
              const isActive = categoryFilter === category;
              return (
                <button
                  key={`fs-${category}`}
                  onClick={() => setCategoryFilter(isActive ? null : category)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap border-2 border-white shadow-[0_2px_8px_rgba(0,0,0,0.3)] ${
                    isActive
                      ? "bg-gray-100 text-black"
                      : "bg-white text-black hover:bg-gray-100"
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full transition-transform ${isActive ? "scale-125" : ""}`}
                    style={{ backgroundColor: color }}
                  />
                  <span>{category}</span>
                </button>
              );
            })}
          </div>

          {/* Floating search input - top right */}
          <div className="absolute top-4 right-14 z-[1001] w-56">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--color-text-tertiary]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-10 pr-9 py-2 bg-white border-2 border-white rounded-lg text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-[--color-brand] shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[--color-text-tertiary] hover:text-[--color-text-secondary] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Floating close button - top right corner */}
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 z-[1001] p-2 bg-[--color-bg-primary] hover:bg-[--color-bg-secondary] rounded-lg border-2 border-white shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-colors"
            title="Exit fullscreen"
          >
            <svg className="w-5 h-5 text-[--color-text-primary]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Navbar - hidden in fullscreen mode */}
      {!isFullscreen && <Navbar
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
      />}

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
              Discover {totalCount} camping spots across Victoria. Click any marker to watch our adventure videos and plan your next family trip.
            </p>
          </div>

          {/* Category Filter - Clickable Legend Style */}
          <div className="mb-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {/* All option */}
            <button
              onClick={() => setCategoryFilter(null)}
              className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-all ${
                categoryFilter === null
                  ? "bg-[--color-bg-tertiary] text-[--color-text-primary]"
                  : "text-[--color-text-tertiary] hover:text-[--color-text-secondary]"
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-gradient-to-r from-[--color-green] to-[--color-brand]" />
              <span>All ({totalCount})</span>
            </button>
            {/* Category options */}
            {Object.entries(categoryColors).map(([category, color]) => {
              const count = allLocations.filter(loc => loc.category === category).length;
              const isActive = categoryFilter === category;
              return (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(isActive ? null : category)}
                  className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-all ${
                    isActive
                      ? "bg-[--color-bg-tertiary] text-[--color-text-primary]"
                      : "text-[--color-text-tertiary] hover:text-[--color-text-secondary]"
                  }`}
                >
                  <span
                    className={`w-3 h-3 rounded-full transition-transform ${isActive ? "scale-125" : ""}`}
                    style={{ backgroundColor: color }}
                  />
                  <span>{category}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="mb-6 max-w-md mx-auto relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--color-text-tertiary]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by video title or channel name..."
              className="w-full pl-10 pr-9 py-2 bg-[--color-bg-secondary] border border-[--color-border-primary] rounded-lg text-sm text-[--color-text-primary] placeholder:text-[--color-text-tertiary] focus:outline-none focus:border-[--color-brand] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[--color-text-tertiary] hover:text-[--color-text-secondary] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Interactive Map Container - Using Leaflet with OpenStreetMap (normal mode) */}
          <div className="relative rounded-2xl overflow-hidden border border-[--color-border-primary]">
            {/* Fullscreen toggle button */}
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 z-[1001] p-2 bg-[--color-bg-secondary] hover:bg-[--color-bg-tertiary] rounded-lg border border-[--color-border-primary] transition-colors"
              title="Enter fullscreen"
            >
              <svg className="w-5 h-5 text-[--color-text-primary]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            </button>

            <div className="relative aspect-[2/1]">
              <MapComponent
                key="normal"
                locations={filteredLocations}
                onMarkerClick={(video) => setSelectedVideo(video)}
                externalActivePopup={mapPopupLocation}
                externalPopupTrigger={popupTrigger}
              />
            </div>
          </div>

        </div>
      </section>

      {/* Selected Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4"
          onClick={closeModalAndShowPopup}
        >
          <div
            className="bg-[--color-bg-secondary] rounded-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {!currentPlayingVideoId ? (
              // Placeholder location - Coming Soon (no video playing)
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
                  key={currentPlayingVideoId}
                  src={`https://www.youtube.com/embed/${currentPlayingVideoId}?autoplay=1`}
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
                    <button
                      onClick={() => {
                        const shareUrl = `${window.location.origin}?site=${selectedVideo.id}`;
                        navigator.clipboard.writeText(shareUrl);
                        setShareCopied(true);
                        setTimeout(() => setShareCopied(false), 2000);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[--color-brand] hover:bg-[--color-brand-hover] text-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      {shareCopied ? "Link Copied!" : "Share Page"}
                    </button>
                  </div>
                </div>
                <button
                  onClick={closeModalAndShowPopup}
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
                    // Build combined video list: original video first (if exists), then community videos
                    const allVideos: Array<{
                      youtubeId: string;
                      title: string;
                      channelName: string;
                      isOriginal: boolean;
                    }> = [];

                    // Add original video first if it exists
                    if (selectedVideo.hasVideo && selectedVideo.youtubeId) {
                      allVideos.push({
                        youtubeId: selectedVideo.youtubeId,
                        title: selectedVideo.videoTitle || selectedVideo.title,
                        channelName: "Adventure Victoria",
                        isOriginal: true,
                      });
                    }

                    // Add community videos
                    const communityList = communityVideos[selectedVideo.id] || [];
                    communityList.forEach((video) => {
                      allVideos.push({
                        youtubeId: video.youtubeId,
                        title: video.title || "Community Video",
                        channelName: video.channelName || "Member",
                        isOriginal: false,
                      });
                    });

                    if (allVideos.length === 0) {
                      return (
                        <p className="text-xs text-[--color-text-tertiary] text-center py-4">
                          No community videos yet. Be the first to share your adventure!
                        </p>
                      );
                    }

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

      {/* Video List Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[--color-bg-secondary]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-[--color-text-primary] mb-6">
            {(() => {
              // Build dynamic title based on category filter
              return categoryFilter ? categoryFilter : "All Locations";
            })()} ({sortedLocations.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sortedLocations.map((video, index) => {
              const voteCount = votes[video.id] || 0;
              const communityVideoCount = communityVideos[video.id]?.length || 0;
              return (
                <button
                  key={`card-${video.id}-${index}`}
                  onClick={() => setSelectedVideo(video)}
                  className="group text-left"
                >
                  <div className="relative mb-2">
                    {/* Community video count badge - outside overflow container */}
                    <NotificationBadge count={communityVideoCount} />
                    <div className="relative aspect-video rounded-xl overflow-hidden">
                      {!video.displayThumbnailId ? (
                        // No video at all - show placeholder
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
                        // Has video (original or community) - show thumbnail
                        <img
                          src={`https://img.youtube.com/vi/${video.displayThumbnailId}/mqdefault.jpg`}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        {video.displayThumbnailId && (
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
                      {/* Vote count badge for locations without any videos */}
                      {!video.displayThumbnailId && voteCount > 0 && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-medium text-white bg-[--color-brand] flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                          {voteCount}
                        </span>
                      )}
                    </div>
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

// Wrap with Suspense for useSearchParams
export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[--color-bg-primary] flex items-center justify-center">
        <span className="text-[--color-text-tertiary]">Loading...</span>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}
