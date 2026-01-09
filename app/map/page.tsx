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

export default function MapPage() {
  const [selectedVideo, setSelectedVideo] = useState<typeof videoLocations[0] | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [userVoted, setUserVoted] = useState<string[]>([]);

  // Load votes from localStorage on mount
  useEffect(() => {
    setVotes(getVotes());
    setUserVoted(getUserVoted());
  }, []);

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

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === null
                  ? "bg-[--color-brand] text-white"
                  : "bg-[--color-bg-secondary] text-[--color-text-secondary] hover:text-[--color-text-primary]"
              }`}
            >
              All Locations
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeCategory === category
                    ? "bg-[--color-brand] text-white"
                    : "bg-[--color-bg-secondary] text-[--color-text-secondary] hover:text-[--color-text-primary]"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: categoryColors[category] }}
                />
                {category}
              </button>
            ))}
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
              {filteredLocations.map((video) => {
                const x = lngToX(video.lng);
                const y = latToY(video.lat);
                const isPlaceholder = video.id.startsWith("placeholder");
                return (
                  <button
                    key={video.id}
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
            {categories.map((category) => (
              <div key={category} className="flex items-center gap-2">
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
            className="bg-[--color-bg-secondary] rounded-2xl overflow-hidden max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedVideo.id.startsWith("placeholder") ? (
              // Placeholder location - Coming Soon
              <div className="aspect-video flex flex-col items-center justify-center" style={{ backgroundColor: categoryColors[selectedVideo.category] }}>
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
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-[--color-text-primary]">
                    {selectedVideo.title}
                  </h3>
                  <p className="text-[--color-text-tertiary] text-sm mt-1">
                    {selectedVideo.location}
                  </p>
                  <span
                    className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: categoryColors[selectedVideo.category] }}
                  >
                    {selectedVideo.category}
                  </span>
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
              {selectedVideo.id.startsWith("placeholder") ? (
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
              ) : (
                <div className="mt-4">
                  <a
                    href={`https://www.youtube.com/watch?v=${selectedVideo.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-[#FF0000] hover:bg-[#CC0000]">
                      Watch on YouTube
                    </Button>
                  </a>
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
            {sortedLocations.map((video) => {
              const isPlaceholder = video.id.startsWith("placeholder");
              const voteCount = votes[video.id] || 0;
              return (
                <button
                  key={video.id}
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
