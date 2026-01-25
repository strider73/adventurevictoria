"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, Polyline, useMap, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// OpenRouteService API key
const ORS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjhiZDMzNzQ2NDA4ZTRiZTBhMmViNDc5MmQ4ODM2NGE1IiwiaCI6Im11cm11cjY0In0=";

// Home location: 92 Black Dog Dr, Brookfield VIC 3338
const HOME_COORDS: [number, number] = [-37.6858, 144.5534];

// Route cache to avoid repeated API calls
const routeCache = new Map<string, { coordinates: [number, number][]; duration: number; distance: number; isStraightLine?: boolean }>();

// Calculate straight-line distance between two points (Haversine formula) - returns km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Fetch route from OpenRouteService
async function fetchRoute(destLat: number, destLng: number): Promise<{ coordinates: [number, number][]; duration: number; distance: number; isStraightLine?: boolean } | null> {
  const cacheKey = `${destLat},${destLng}`;

  if (routeCache.has(cacheKey)) {
    return routeCache.get(cacheKey)!;
  }

  try {
    // OpenRouteService expects: start=lng,lat&end=lng,lat
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${HOME_COORDS[1]},${HOME_COORDS[0]}&end=${destLng},${destLat}`;
    const response = await fetch(url);

    if (!response.ok) {
      // API failed - use straight line fallback
      // Route API failed - use straight line fallback
      const straightLineDistance = calculateDistance(HOME_COORDS[0], HOME_COORDS[1], destLat, destLng);
      const estimatedDuration = (straightLineDistance / 80) * 3600; // Assume 80km/h average
      const result = {
        coordinates: [HOME_COORDS, [destLat, destLng]] as [number, number][],
        duration: estimatedDuration,
        distance: straightLineDistance * 1000, // Convert to meters
        isStraightLine: true,
      };
      routeCache.set(cacheKey, result);
      return result;
    }

    const data = await response.json();
    const feature = data.features?.[0];

    if (!feature) {
      // No route found - use straight line
      const straightLineDistance = calculateDistance(HOME_COORDS[0], HOME_COORDS[1], destLat, destLng);
      const estimatedDuration = (straightLineDistance / 80) * 3600;
      const result = {
        coordinates: [HOME_COORDS, [destLat, destLng]] as [number, number][],
        duration: estimatedDuration,
        distance: straightLineDistance * 1000,
        isStraightLine: true,
      };
      routeCache.set(cacheKey, result);
      return result;
    }

    // Extract coordinates (GeoJSON format: [lng, lat] -> convert to [lat, lng] for Leaflet)
    const coordinates: [number, number][] = feature.geometry.coordinates.map(
      (coord: [number, number]) => [coord[1], coord[0]]
    );

    const duration = feature.properties.summary.duration; // seconds
    const distance = feature.properties.summary.distance; // meters

    const result = { coordinates, duration, distance, isStraightLine: false };
    routeCache.set(cacheKey, result);

    return result;
  } catch (error) {
    console.error("Failed to fetch route:", error);
    // Fallback to straight line on any error
    const straightLineDistance = calculateDistance(HOME_COORDS[0], HOME_COORDS[1], destLat, destLng);
    const estimatedDuration = (straightLineDistance / 80) * 3600;
    return {
      coordinates: [HOME_COORDS, [destLat, destLng]] as [number, number][],
      duration: estimatedDuration,
      distance: straightLineDistance * 1000,
      isStraightLine: true,
    };
  }
}

// Format duration (seconds) to human readable
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes}min`;
}

// Format distance (meters) to human readable
function formatDistance(meters: number): string {
  const km = meters / 1000;
  return `${km.toFixed(0)} km`;
}

// Open Google Maps directions in new tab
function openGoogleMapsDirections(destLat: number, destLng: number): void {
  const url = `https://www.google.com/maps/dir/${HOME_COORDS[0]},${HOME_COORDS[1]}/${destLat},${destLng}`;
  window.open(url, '_blank');
}

// Component to fix map size after container renders
function MapResizeHandler() {
  const map = useMap();

  useEffect(() => {
    // Invalidate size after a short delay to ensure container is rendered
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);

    // Also invalidate on window resize
    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [map]);

  return null;
}

// Component to control map dragging based on popup state
function MapDragController({ isPopupActive }: { isPopupActive: boolean }) {
  const map = useMap();

  useEffect(() => {
    if (isPopupActive) {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
    } else {
      map.dragging.enable();
      map.scrollWheelZoom.enable();
    }
  }, [map, isPopupActive]);

  return null;
}

// Fix for default marker icons in Leaflet with webpack
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Category colors
const categoryColors: Record<string, string> = {
  "National Parks": "#4cb782",
  "State Forests": "#5e6ad2",
  "Great Ocean Road": "#4ea7fc",
  Hiking: "#f2c94c",
  "Holiday Parks": "#fc7840",
  "Family Holidays": "#eb5757",
  "Water Activities": "#7170ff",
  "Bush Camping": "#8a8f98",
};

export interface VideoLocation {
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

interface MapComponentProps {
  locations: VideoLocation[];
  onMarkerClick: (video: VideoLocation) => void;
  onShowCommunityVideos?: (video: VideoLocation) => void;
  center?: [number, number];
  zoom?: number;
}

// Cache for marker icons to prevent re-creation on every render
const markerIconCache = new Map<string, L.DivIcon>();

// Create custom marker icon with YouTube thumbnail (original or community video)
const createMarkerIcon = (video: VideoLocation) => {
  // Check cache first
  const cacheKey = `${video.id}-${video.displayThumbnailId || 'none'}-${video.category}`;
  if (markerIconCache.has(cacheKey)) {
    return markerIconCache.get(cacheKey)!;
  }

  const color = categoryColors[video.category] || "#8a8f98";

  // Use displayThumbnailId if available (original or community video), otherwise show placeholder
  const iconHtml = !video.displayThumbnailId
    ? `<div class="leaflet-custom-marker" style="background-color: ${color};">
        <svg class="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>`
    : `<div class="leaflet-custom-marker" style="background-color: ${color};">
        <img src="https://img.youtube.com/vi/${video.displayThumbnailId}/mqdefault.jpg" alt="${video.title}" />
      </div>`;

  const icon = L.divIcon({
    html: iconHtml,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
    className: "",
  });

  markerIconCache.set(cacheKey, icon);
  return icon;
};

export default function MapComponent({
  locations,
  onMarkerClick,
  onShowCommunityVideos,
  center = [-37.4, 145.5], // Victoria center coordinates by default
  zoom = 7
}: MapComponentProps) {
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set());
  const [routeData, setRouteData] = useState<{
    coordinates: [number, number][];
    duration: number;
    distance: number;
    title: string;
  } | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [activePopup, setActivePopup] = useState<VideoLocation | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Create a stable key from location IDs to detect actual filter changes
  const locationsKey = useMemo(() => {
    return locations.map(l => l.id).sort().join(',');
  }, [locations]);

  // Generate random order for staggered animation
  const randomOrder = useMemo(() => {
    const indices = locations.map((_, i) => i);
    // Fisher-Yates shuffle
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  }, [locationsKey]);

  // Stagger marker appearance when locations actually change (filter applied)
  useEffect(() => {
    if (locations.length === 0) return;

    setVisibleIndices(new Set());
    const timers: NodeJS.Timeout[] = [];

    randomOrder.forEach((originalIndex, orderIndex) => {
      if (originalIndex < locations.length) {
        const timer = setTimeout(() => {
          setVisibleIndices((prev) => new Set([...prev, originalIndex]));
        }, orderIndex * 30); // 30ms gap between each marker
        timers.push(timer);
      }
    });

    return () => timers.forEach(clearTimeout);
  }, [locationsKey, randomOrder]);

  // Handle show route button click
  const handleShowRoute = useCallback(async (video: VideoLocation) => {
    const cacheKey = `${video.lat},${video.lng}`;

    // Check cache first
    if (routeCache.has(cacheKey)) {
      const cached = routeCache.get(cacheKey)!;
      setRouteData({
        ...cached,
        title: video.title,
      });
      return;
    }

    setIsLoadingRoute(true);
    const route = await fetchRoute(video.lat, video.lng);
    if (route) {
      setRouteData({
        ...route,
        title: video.title,
      });
    }
    setIsLoadingRoute(false);
  }, []);

  // Handle marker click - show popup with 3 options
  const handleMarkerClick = useCallback((video: VideoLocation) => {
    setActivePopup(video);
  }, []);

  // Close popup
  const handleClosePopup = useCallback(() => {
    setActivePopup(null);
    setRouteData(null);
  }, []);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      zoomControl={true}
      dragging={true}
      style={{ height: "100%", width: "100%" }}
      className="rounded-2xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapResizeHandler />
      <MapDragController isPopupActive={activePopup !== null} />

      {/* Home marker */}
      <Marker
        position={HOME_COORDS}
        icon={L.divIcon({
          html: `<div style="background-color: #eb5757; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          className: "",
        })}
      >
        <Tooltip direction="top" offset={[0, -15]} opacity={1}>
          <span className="font-medium">Home</span>
        </Tooltip>
      </Marker>

      {/* Route line */}
      {routeData && (
        <Polyline
          positions={routeData.coordinates}
          pathOptions={{
            color: "#5e6ad2",
            weight: 4,
            opacity: 0.8,
            dashArray: "10, 10",
          }}
        />
      )}

      {/* Camping site markers */}
      {locations.map((video, index) => {
        if (!visibleIndices.has(index)) return null;
        return (
          <Marker
            key={`marker-${video.id}-${index}`}
            position={[video.lat, video.lng]}
            icon={createMarkerIcon(video)}
            eventHandlers={{
              click: () => handleMarkerClick(video),
            }}
          >
            {/* Simple tooltip on hover - only shows when no popup is active */}
            {!activePopup && (
              <Tooltip direction="top" offset={[0, -20]} opacity={1}>
                <span className="font-medium">{video.title}</span>
              </Tooltip>
            )}
          </Marker>
        );
      })}

      {/* Action popup - appears on click */}
      {activePopup && (
        <Popup
          position={[activePopup.lat, activePopup.lng]}
          closeButton={false}
          closeOnClick={false}
          autoClose={false}
          className="action-popup"
        >
          <div className="min-w-[200px]">
            {/* Header with title and close button */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[--color-border-primary]">
              <span className="font-medium text-sm">{activePopup.title}</span>
              <button
                onClick={handleClosePopup}
                className="w-6 h-6 flex items-center justify-center rounded hover:bg-[--color-bg-tertiary] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2">
              {/* Community Videos button */}
              <button
                onClick={() => {
                  if (onShowCommunityVideos) {
                    onShowCommunityVideos(activePopup);
                  } else {
                    onMarkerClick(activePopup);
                  }
                  // Don't close popup - keep it visible behind the modal
                }}
                className="flex items-center gap-3 px-3 py-2 text-sm rounded transition-colors w-full text-left"
              >
                <span>📹</span>
                <span>Community Videos</span>
              </button>

              {/* Show Route button */}
              <button
                onClick={() => handleShowRoute(activePopup)}
                disabled={isLoadingRoute}
                className="flex items-center gap-3 px-3 py-2 text-sm rounded transition-colors w-full text-left disabled:opacity-50"
              >
                <span>🚗</span>
                <span>{isLoadingRoute ? 'Loading...' : 'Show Route'}</span>
              </button>

              {/* Route info if loaded */}
              {routeData && routeData.title === activePopup.title && (
                <div className="route-info text-xs px-3 py-2 rounded ml-6">
                  {formatDuration(routeData.duration)} • {formatDistance(routeData.distance)}
                </div>
              )}

              {/* Google Maps button */}
              <button
                onClick={() => {
                  openGoogleMapsDirections(activePopup.lat, activePopup.lng);
                }}
                className="flex items-center gap-3 px-3 py-2 text-sm rounded transition-colors w-full text-left"
              >
                <span>📍</span>
                <span>Open in Google Maps</span>
              </button>
            </div>
          </div>
        </Popup>
      )}
    </MapContainer>
  );
}
