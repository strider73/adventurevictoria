"use client";

import { useState, useEffect } from "react";
import { Navbar, Footer, SocialIcons, Button } from "@/components/ui";

// Video locations with coordinates (approximate locations in Victoria)
const videoLocations = [
  {
    id: "vA774gsNutA",
    title: "Wilsons Promontory",
    location: "Wilsons Promontory National Park",
    lat: -39.0,
    lng: 146.3,
    category: "National Parks",
  },
  {
    id: "5taI0vAm5Fw",
    title: "Great Otway National Park",
    location: "Lake Elizabeth Camp Ground",
    lat: -38.65,
    lng: 143.8,
    category: "National Parks",
  },
  {
    id: "hOmbxnF7sh0",
    title: "Lake Eildon",
    location: "Lake Eildon National Park",
    lat: -37.23,
    lng: 145.9,
    category: "National Parks",
  },
  {
    id: "kcwuj8EuCP8",
    title: "Lerderderg State Park",
    location: "Lerderderg State Park",
    lat: -37.45,
    lng: 144.35,
    category: "National Parks",
  },
  {
    id: "9U1m_LiJALg",
    title: "Wombat State Forest",
    location: "Firth Park",
    lat: -37.4,
    lng: 144.2,
    category: "State Forests",
  },
  {
    id: "pT_dDWd17gY",
    title: "Blackwood Forest",
    location: "Blackwood",
    lat: -37.47,
    lng: 144.3,
    category: "State Forests",
  },
  {
    id: "D4zAOubdqNA",
    title: "Briagolong State Forest",
    location: "The Quarries Campground",
    lat: -37.85,
    lng: 147.1,
    category: "State Forests",
  },
  {
    id: "HL6FR_Kr4GU",
    title: "Nolans Creek",
    location: "Nolans Creek Camping Area",
    lat: -37.55,
    lng: 145.7,
    category: "State Forests",
  },
  {
    id: "2s-IFKwgFyA",
    title: "Johanna Beach",
    location: "Great Ocean Road",
    lat: -38.75,
    lng: 143.4,
    category: "Great Ocean Road",
  },
  {
    id: "RKHe9BbLTiM",
    title: "Port Campbell",
    location: "Port Campbell Holiday Park",
    lat: -38.62,
    lng: 143.0,
    category: "Great Ocean Road",
  },
  {
    id: "BQ_IE8Kv12E",
    title: "12 Apostles",
    location: "Princetown",
    lat: -38.66,
    lng: 143.1,
    category: "Great Ocean Road",
  },
  {
    id: "gu2F2qi6p2k",
    title: "Surf Coast Walk",
    location: "Point Addis via Bells Beach",
    lat: -38.35,
    lng: 144.3,
    category: "Great Ocean Road",
  },
  {
    id: "tMbw_UXgR_k",
    title: "Lerderderg Gorge",
    location: "Lerderderg Gorge Walk",
    lat: -37.48,
    lng: 144.38,
    category: "Hiking",
  },
  {
    id: "TOs6qC1J-Qo",
    title: "Mt Oberon",
    location: "Wilsons Promontory",
    lat: -39.05,
    lng: 146.35,
    category: "Hiking",
  },
  {
    id: "YGIUYz2V7eg",
    title: "Macedon Regional Park",
    location: "Macedon",
    lat: -37.35,
    lng: 144.55,
    category: "Hiking",
  },
  {
    id: "SMngB9Ae_4M",
    title: "BIG4 Yarra Valley",
    location: "Park Lane Holiday Park",
    lat: -37.75,
    lng: 145.5,
    category: "Holiday Parks",
  },
  {
    id: "BrBitvmjpX0",
    title: "Anderson's Camping",
    location: "Anderson's Camping Ground",
    lat: -37.6,
    lng: 145.8,
    category: "Holiday Parks",
  },
  {
    id: "MpvNLoyGQsM",
    title: "Dandos Camping",
    location: "Dandos Camping Ground",
    lat: -37.3,
    lng: 145.6,
    category: "Holiday Parks",
  },
  {
    id: "03-JfDNVKwk",
    title: "Phillip Island",
    location: "Phillip Island",
    lat: -38.48,
    lng: 145.23,
    category: "Family Holidays",
  },
  {
    id: "pURlGTAsOig",
    title: "Portland Farm Stay",
    location: "Portland",
    lat: -38.35,
    lng: 141.6,
    category: "Family Holidays",
  },
  {
    id: "GKx2TFgqgVc",
    title: "Portland Boat Trip",
    location: "Portland",
    lat: -38.33,
    lng: 141.58,
    category: "Family Holidays",
  },
  {
    id: "ReX_9UkJB2M",
    title: "Squeaky Beach",
    location: "Wilsons Promontory",
    lat: -39.03,
    lng: 146.32,
    category: "Water Activities",
  },
  {
    id: "cXWxeoVuLF4",
    title: "Snowy River",
    location: "BalleyHooly Camping Ground",
    lat: -37.45,
    lng: 148.2,
    category: "Water Activities",
  },
  {
    id: "N4qiHN4_SvI",
    title: "Howqua Hills",
    location: "Mt Buller",
    lat: -37.15,
    lng: 146.45,
    category: "Water Activities",
  },
  {
    id: "YXsIWSPdwkQ",
    title: "Digger's Track",
    location: "Lerderderg",
    lat: -37.5,
    lng: 144.32,
    category: "Bush Camping",
  },
  // Additional Popular Victorian Camping Spots
  {
    id: "placeholder-1",
    title: "Grampians National Park",
    location: "Halls Gap",
    lat: -37.14,
    lng: 142.52,
    category: "National Parks",
  },
  {
    id: "placeholder-2",
    title: "Mount Buffalo",
    location: "Mount Buffalo National Park",
    lat: -36.76,
    lng: 146.82,
    category: "National Parks",
  },
  {
    id: "placeholder-3",
    title: "Croajingolong",
    location: "Croajingolong National Park",
    lat: -37.8,
    lng: 149.3,
    category: "National Parks",
  },
  {
    id: "placeholder-4",
    title: "Alpine National Park",
    location: "Falls Creek Area",
    lat: -36.87,
    lng: 147.28,
    category: "National Parks",
  },
  {
    id: "placeholder-5",
    title: "Murray River",
    location: "Echuca Region",
    lat: -36.13,
    lng: 144.75,
    category: "Water Activities",
  },
  {
    id: "placeholder-6",
    title: "Gippsland Lakes",
    location: "Lakes Entrance",
    lat: -37.88,
    lng: 147.98,
    category: "Water Activities",
  },
  {
    id: "placeholder-7",
    title: "Cathedral Range",
    location: "Cathedral Range State Park",
    lat: -37.37,
    lng: 145.82,
    category: "Hiking",
  },
  {
    id: "placeholder-8",
    title: "Mount Buller",
    location: "Mount Buller Alpine Village",
    lat: -37.15,
    lng: 146.44,
    category: "Hiking",
  },
  {
    id: "placeholder-9",
    title: "Tidal River",
    location: "Wilsons Promontory",
    lat: -39.03,
    lng: 146.3,
    category: "National Parks",
  },
  {
    id: "placeholder-10",
    title: "Cape Otway",
    location: "Cape Otway Lightstation",
    lat: -38.86,
    lng: 143.51,
    category: "Great Ocean Road",
  },
  {
    id: "placeholder-11",
    title: "Anglesea",
    location: "Anglesea Family Caravan Park",
    lat: -38.41,
    lng: 144.19,
    category: "Great Ocean Road",
  },
  {
    id: "placeholder-12",
    title: "Lorne",
    location: "Lorne Foreshore",
    lat: -38.54,
    lng: 143.98,
    category: "Great Ocean Road",
  },
  {
    id: "placeholder-13",
    title: "Toolangi State Forest",
    location: "Toolangi",
    lat: -37.53,
    lng: 145.48,
    category: "State Forests",
  },
  {
    id: "placeholder-14",
    title: "Baw Baw National Park",
    location: "Mount Baw Baw",
    lat: -37.84,
    lng: 146.27,
    category: "National Parks",
  },
  {
    id: "placeholder-15",
    title: "French Island",
    location: "French Island National Park",
    lat: -38.35,
    lng: 145.38,
    category: "Bush Camping",
  },
  {
    id: "placeholder-16",
    title: "Mornington Peninsula",
    location: "Point Leo",
    lat: -38.43,
    lng: 145.08,
    category: "Family Holidays",
  },
  {
    id: "placeholder-17",
    title: "Daylesford",
    location: "Jubilee Lake Holiday Park",
    lat: -37.35,
    lng: 144.14,
    category: "Holiday Parks",
  },
  {
    id: "placeholder-18",
    title: "Bright",
    location: "Bright Holiday Park",
    lat: -36.73,
    lng: 146.96,
    category: "Holiday Parks",
  },
  {
    id: "placeholder-19",
    title: "Mallacoota",
    location: "Mallacoota Foreshore",
    lat: -37.56,
    lng: 149.76,
    category: "Bush Camping",
  },
  {
    id: "placeholder-20",
    title: "Bendigo Region",
    location: "Lake Eppalock",
    lat: -36.88,
    lng: 144.55,
    category: "Water Activities",
  },
];

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
  { label: "Map", href: "/map", isActive: true },
  { label: "YouTube", href: "https://www.youtube.com/@Adventurevictoria/videos" },
  { label: "About Us", href: "/about" },
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

// Convert lat/lng to map position (percentage)
// Using zoom 8 for better detail and selecting tiles that center Melbourne

const tileToLng = (x: number, z: number) => (x / Math.pow(2, z)) * 360 - 180;
const tileToLat = (y: number, z: number) => {
  const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, z);
  return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
};

// Tile configuration for zoom 8
// Melbourne is around -37.8, 145 - this puts it in tile (229, 157) at zoom 8
// We'll use tiles 226-233 (8 wide) x 155-158 (4 tall) to cover Victoria
// This centers Melbourne and covers all camping locations
const zoom = 8;
const tilesX = { start: 226, end: 234 }; // 8 tiles wide
const tilesY = { start: 155, end: 159 }; // 4 tiles tall

const mapBounds = {
  west: tileToLng(tilesX.start, zoom),
  east: tileToLng(tilesX.end, zoom),
  north: tileToLat(tilesY.start, zoom),
  south: tileToLat(tilesY.end, zoom),
};

// Simple coordinate conversion - no CSS offsets, tiles fill container exactly
const latToY = (lat: number) => {
  // Use Web Mercator projection
  const latRad = (lat * Math.PI) / 180;
  const mercY = Math.log(Math.tan(Math.PI / 4 + latRad / 2));

  const northRad = (mapBounds.north * Math.PI) / 180;
  const southRad = (mapBounds.south * Math.PI) / 180;
  const mercNorth = Math.log(Math.tan(Math.PI / 4 + northRad / 2));
  const mercSouth = Math.log(Math.tan(Math.PI / 4 + southRad / 2));

  return ((mercNorth - mercY) / (mercNorth - mercSouth)) * 100;
};

const lngToX = (lng: number) => {
  return ((lng - mapBounds.west) / (mapBounds.east - mapBounds.west)) * 100;
};

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
}

// Helper to get community videos from localStorage
const getCommunityVideos = (): Record<string, CommunityVideo[]> => {
  if (typeof window === "undefined") return {};
  const stored = localStorage.getItem("communityVideos");
  return stored ? JSON.parse(stored) : {};
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

export default function MapPage() {
  const [selectedVideo, setSelectedVideo] = useState<typeof videoLocations[0] | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
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

  const categories = [...new Set(videoLocations.map((v) => v.category))];

  const filteredLocations = activeCategory
    ? videoLocations.filter((v) => v.category === activeCategory)
    : videoLocations;

  // Sort placeholder locations by votes (most requested first)
  const sortedLocations = [...filteredLocations].sort((a, b) => {
    const aIsPlaceholder = a.id.startsWith("placeholder");
    const bIsPlaceholder = b.id.startsWith("placeholder");

    // Real videos first, then placeholders sorted by votes
    if (!aIsPlaceholder && bIsPlaceholder) return -1;
    if (aIsPlaceholder && !bIsPlaceholder) return 1;
    if (aIsPlaceholder && bIsPlaceholder) {
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

      {/* Map Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-[--color-text-primary] mb-4">
              Explore Victoria&apos;s Camping Spots
            </h1>
            <p className="text-[--color-text-secondary] max-w-2xl mx-auto">
              Click on any location marker to watch our camping adventure at that spot
            </p>
          </div>

          {/* Category Filter - Grouped by Type */}
          <div className="mb-6 space-y-4">
            {/* All Locations Button */}
            <div className="flex justify-center">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === null
                    ? "bg-[--color-brand] text-white"
                    : "bg-[--color-bg-secondary] text-[--color-text-secondary] hover:text-[--color-text-primary]"
                }`}
              >
                All Locations
              </button>
            </div>

            {/* Grouped Categories - Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
              {/* Nature Group */}
              <div className="bg-[--color-bg-secondary] rounded-xl p-3">
                <span className="text-xs text-[--color-text-tertiary] block mb-2">Nature</span>
                <div className="flex flex-wrap gap-1.5">
                  {["National Parks", "State Forests", "Bush Camping"].map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
                        activeCategory === category
                          ? "bg-[--color-brand] text-white"
                          : "bg-[--color-bg-tertiary] text-[--color-text-secondary] hover:text-[--color-text-primary]"
                      }`}
                    >
                      {activeCategory === category ? (
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: categoryColors[category] }}
                        />
                      )}
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Coastal Group */}
              <div className="bg-[--color-bg-secondary] rounded-xl p-3">
                <span className="text-xs text-[--color-text-tertiary] block mb-2">Coastal</span>
                <div className="flex flex-wrap gap-1.5">
                  {["Great Ocean Road"].map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
                        activeCategory === category
                          ? "bg-[--color-brand] text-white"
                          : "bg-[--color-bg-tertiary] text-[--color-text-secondary] hover:text-[--color-text-primary]"
                      }`}
                    >
                      {activeCategory === category ? (
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: categoryColors[category] }}
                        />
                      )}
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activities Group */}
              <div className="bg-[--color-bg-secondary] rounded-xl p-3">
                <span className="text-xs text-[--color-text-tertiary] block mb-2">Activities</span>
                <div className="flex flex-wrap gap-1.5">
                  {["Hiking", "Water Activities"].map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
                        activeCategory === category
                          ? "bg-[--color-brand] text-white"
                          : "bg-[--color-bg-tertiary] text-[--color-text-secondary] hover:text-[--color-text-primary]"
                      }`}
                    >
                      {activeCategory === category ? (
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: categoryColors[category] }}
                        />
                      )}
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Family Group */}
              <div className="bg-[--color-bg-secondary] rounded-xl p-3">
                <span className="text-xs text-[--color-text-tertiary] block mb-2">Family</span>
                <div className="flex flex-wrap gap-1.5">
                  {["Holiday Parks", "Family Holidays"].map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
                        activeCategory === category
                          ? "bg-[--color-brand] text-white"
                          : "bg-[--color-bg-tertiary] text-[--color-text-secondary] hover:text-[--color-text-primary]"
                      }`}
                    >
                      {activeCategory === category ? (
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: categoryColors[category] }}
                        />
                      )}
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Map Container - Using OpenStreetMap tiles */}
          <div className="relative rounded-2xl overflow-hidden border border-[--color-border-primary]">
            <div className="relative aspect-[2/1]">
              {/* OpenStreetMap Static Tiles - Victoria region (zoom 8) */}
              {/* 8 tiles wide (226-233) x 4 tiles tall (155-158) - centers Melbourne */}
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-4">
                {/* Generate all tiles programmatically */}
                {[155, 156, 157, 158].flatMap((y) =>
                  [226, 227, 228, 229, 230, 231, 232, 233].map((x) => (
                    <img
                      key={`tile-${x}-${y}`}
                      src={`https://tile.openstreetmap.org/8/${x}/${y}.png`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ))
                )}
              </div>

              {/* Dark overlay for better visibility */}
              <div className="absolute inset-0 bg-black/10 pointer-events-none" />

              {/* Video Location Markers */}
              {filteredLocations.map((video, index) => {
                const x = lngToX(video.lng);
                const y = latToY(video.lat);
                const isPlaceholder = video.id.startsWith("placeholder");
                return (
                  <button
                    key={`marker-${video.id}-${index}`}
                    onClick={() => setSelectedVideo(video)}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-10"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    {/* Marker */}
                    <div
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-lg overflow-hidden transition-transform hover:scale-125 hover:z-20 flex items-center justify-center"
                      style={{ backgroundColor: categoryColors[video.category] }}
                    >
                      {isPlaceholder ? (
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      ) : (
                        <img
                          src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[--color-bg-primary] text-[--color-text-primary] text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-[--color-border-primary]">
                      {video.title}
                      {isPlaceholder && <span className="text-[--color-text-tertiary]"> (Coming Soon)</span>}
                      <div
                        className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[--color-bg-primary]"
                      />
                    </div>
                  </button>
                );
              })}

              {/* OSM Attribution */}
              <div className="absolute bottom-2 right-2 bg-white/80 px-2 py-1 rounded text-[10px] text-gray-600">
                © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline">OpenStreetMap</a>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
            {categories.map((category, index) => (
              <div key={`legend-${category}-${index}`} className="flex items-center gap-2">
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
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="bg-[--color-bg-secondary] rounded-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedVideo.id.startsWith("placeholder") ? (
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
                  src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
                  title={selectedVideo.title}
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
                    {!selectedVideo.id.startsWith("placeholder") && (
                      <a
                        href={`https://www.youtube.com/watch?v=${selectedVideo.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 rounded-full text-xs font-medium bg-[#FF0000] hover:bg-[#CC0000] text-white transition-colors"
                      >
                        Watch on YouTube
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
              {selectedVideo.id.startsWith("placeholder") && (
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

              {/* Community Videos Section */}
              {!selectedVideo.id.startsWith("placeholder") && (
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
                                className="text-xs text-[--color-text-primary] hover:text-[--color-brand] transition-colors line-clamp-1"
                              >
                                Community Video #{index + 1}
                              </a>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-[--color-text-tertiary] flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                  Member
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
              )}
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
              const isPlaceholder = video.id.startsWith("placeholder");
              const voteCount = votes[video.id] || 0;
              return (
                <button
                  key={`card-${video.id}-${index}`}
                  onClick={() => setSelectedVideo(video)}
                  className="group text-left"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-2">
                    {isPlaceholder ? (
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
                        src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      {!isPlaceholder && (
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
                    {/* Vote count badge for placeholders */}
                    {isPlaceholder && voteCount > 0 && (
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
