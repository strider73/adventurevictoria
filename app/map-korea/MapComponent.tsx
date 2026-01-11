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

// Category colors for Korea travel videos
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

export interface KoreaVideo {
  videoId: string;
  title: string;
  duration: string;
  views: number;
  uploadedAgo: string;
  location: string;
  category: string;
  lat: number;
  lng: number;
}

interface MapComponentProps {
  videos: KoreaVideo[];
  onMarkerClick: (video: KoreaVideo) => void;
}

// Create custom marker icon with YouTube thumbnail
const createMarkerIcon = (video: KoreaVideo) => {
  const color = categoryColors[video.category] || "#8a8f98";

  const iconHtml = `<div class="leaflet-custom-marker" style="background-color: ${color};">
      <img src="https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg" alt="${video.title}" />
    </div>`;

  return L.divIcon({
    html: iconHtml,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
    className: "custom-marker-container",
  });
};

export default function MapComponent({ videos, onMarkerClick }: MapComponentProps) {
  // South Korea center coordinates
  const koreaCenter: [number, number] = [36.5, 127.8];

  return (
    <MapContainer
      center={koreaCenter}
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
      {videos.map((video, index) => (
        <Marker
          key={`marker-${video.videoId}-${index}`}
          position={[video.lat, video.lng]}
          icon={createMarkerIcon(video)}
          eventHandlers={{
            click: () => onMarkerClick(video),
          }}
        >
          <Tooltip direction="top" offset={[0, -20]} opacity={1}>
            <span className="font-medium">{video.title}</span>
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}
