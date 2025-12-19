// src/components/MapDisplay.tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- Fronteiras de Rondonópolis ---
const RONDONOPOLIS_BOUNDS: L.LatLngBoundsExpression = [
  [-16.55, -54.75], // Ponto Sudoeste
  [-16.35, -54.50], // Ponto Nordeste
];

// --- Correção do ícone padrão ---
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl.src,
  iconUrl: iconUrl.src,
  shadowUrl: shadowUrl.src,
});

// --- Ícones ---
const userLocationIcon = new L.DivIcon({
  html: `<div class="user-location-icon-pulse"></div><div class="user-location-icon"></div>`,
  className: 'bg-transparent',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const startIcon = new L.DivIcon({
  html: `<div style="background-color: #22c55e; color: white; border-radius: 50%; width: 24px; height: 24px; text-align: center; font-weight: bold; line-height: 24px; border: 2px solid white; box-shadow: 0 0 3px rgba(0,0,0,0.5);">A</div>`,
  className: 'bg-transparent',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const endIcon = new L.DivIcon({
  html: `<div style="background-color: #ef4444; color: white; border-radius: 50%; width: 24px; height: 24px; text-align: center; font-weight: bold; line-height: 24px; border: 2px solid white; box-shadow: 0 0 3px rgba(0,0,0,0.5);">B</div>`,
  className: 'bg-transparent',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const busIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
  iconSize: [35, 35],
  popupAnchor: [0, -15],
});

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

// --- Interfaces ---
interface Stop {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

type RouteShapeData = {
  coordinates: [number, number][];
  startPoint: [number, number];
  endPoint: [number, number];
};

export type BusData = {
  userId: number;
  name: string;
  routeNumber: number;
  lat: number;
  lng: number;
  timestamp: number;
};

interface MapDisplayProps {
  stops: Stop[];
  center: [number, number];
  routeShape: RouteShapeData | null;
  buses: Record<number, BusData>;
}

export default function MapDisplay({ stops, center, routeShape, buses }: MapDisplayProps) {
  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{ height: '100%', width: '100%' }}
      maxBounds={RONDONOPOLIS_BOUNDS}      
      maxBoundsViscosity={1.0}             
      minZoom={12}                         
      maxZoom={18}                         
    >
      <ChangeView center={center} zoom={15} />

    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      bounds={RONDONOPOLIS_BOUNDS}
    />

      {stops.map(stop => (
        <Marker key={stop.id} position={[stop.lat, stop.lng]}>
          <Popup>{stop.name}</Popup>
        </Marker>
      ))}

      <Marker position={center} icon={userLocationIcon}>
        <Popup>Você está aqui</Popup>
      </Marker>
      
      {routeShape && (
        <>
          <Polyline
            positions={routeShape.coordinates}
            pathOptions={{ color: '#3b82f6', weight: 5, opacity: 0.8 }}
          />
          <Marker position={routeShape.startPoint} icon={startIcon}>
            <Popup>Início da Rota (Ponto A)</Popup>
          </Marker>
          <Marker position={routeShape.endPoint} icon={endIcon}>
            <Popup>Fim da Rota (Ponto B)</Popup>
          </Marker>
        </>
      )}

      {Object.values(buses).map((bus) => (
        <Marker 
          key={bus.userId} 
          position={[bus.lat, bus.lng]} 
          icon={busIcon}
          zIndexOffset={1000}
        >
          <Popup>
            <div className="text-center">
              <strong className="text-indigo-700 block text-lg">Linha {bus.routeNumber}</strong>
              <span className="text-gray-600">{bus.name}</span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}