"use client";

import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

interface VideoLocation {
  id: string;
  title: string;
  location: string;
  lat: number;
  lng: number;
  category: string;
  description: string;
}

interface MapComponentProps {
  locations: VideoLocation[];
  onMarkerClick: (video: VideoLocation) => void;
}

// Create custom marker icon with YouTube thumbnail
const createMarkerIcon = (video: VideoLocation) => {
  const isPlaceholder = video.id.startsWith("placeholder");
  const color = categoryColors[video.category] || "#8a8f98";

  const iconHtml = isPlaceholder
    ? `<div class="leaflet-custom-marker" style="background-color: ${color};">
        <svg class="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>`
    : `<div class="leaflet-custom-marker" style="background-color: ${color};">
        <img src="https://img.youtube.com/vi/${video.id}/mqdefault.jpg" alt="${video.title}" />
      </div>`;

  return L.divIcon({
    html: iconHtml,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
    className: "custom-marker-container",
  });
};

export default function MapComponent({ locations, onMarkerClick }: MapComponentProps) {
  // Victoria center coordinates
  const victoriaCenter: [number, number] = [-37.4, 145.5];

  return (
    <MapContainer
      center={victoriaCenter}
      zoom={7}
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
      {locations.map((video, index) => {
        const isPlaceholder = video.id.startsWith("placeholder");
        return (
          <Marker
            key={`marker-${video.id}-${index}`}
            position={[video.lat, video.lng]}
            icon={createMarkerIcon(video)}
            eventHandlers={{
              click: () => onMarkerClick(video),
            }}
          >
            <Tooltip direction="top" offset={[0, -20]} opacity={1}>
              <span className="font-medium">{video.title}</span>
              {isPlaceholder && (
                <span className="text-gray-500 ml-1">(Coming Soon)</span>
              )}
            </Tooltip>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
