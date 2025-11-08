// src/components/MapDisplay.tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- Correção do ícone padrão ---
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl.src,
  iconUrl: iconUrl.src,
  shadowUrl: shadowUrl.src,
});
// --- Fim da correção ---

// --- Ícone de Localização do Usuário ---
const userLocationIcon = new L.DivIcon({
  html: `<div class"user-location-icon-pulse"></div><div class="user-location-icon"></div>`,
  className: 'bg-transparent',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// 👇 1. ÍCONES PERSONALIZADOS PARA INÍCIO E FIM (A e B)
// (Não precisa de CSS, usa estilos inline)
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
// --- Fim dos ícones ---


function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

interface Stop {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

// 👇 2. TIPO DE DADO ATUALIZADO
type RouteShapeData = {
  coordinates: [number, number][];
  startPoint: [number, number];
  endPoint: [number, number];
};

interface MapDisplayProps {
  stops: Stop[];
  center: [number, number];
  routeShape: RouteShapeData | null; // <-- Prop atualizada para o objeto
}

export default function MapDisplay({ stops, center, routeShape }: MapDisplayProps) {
  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{ height: '100%', width: '100%' }}
    >
      <ChangeView center={center} zoom={15} />

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Marcadores das paradas (ícone padrão) */}
      {stops.map(stop => (
        <Marker key={stop.id} position={[stop.lat, stop.lng]}>
          <Popup>{stop.name}</Popup>
        </Marker>
      ))}

      {/* Marcador da localização do usuário (ícone azul) */}
      <Marker position={center} icon={userLocationIcon}>
        <Popup>Você está aqui</Popup>
      </Marker>
      
      {/* 👇 3. RENDERIZAÇÃO ATUALIZADA (LINHA + PONTOS A/B) */}
      {routeShape && (
        <>
          {/* A Linha (Polyline) */}
          <Polyline
            positions={routeShape.coordinates} // Pega as coordenadas do objeto
            pathOptions={{ color: '#3b82f6', weight: 5, opacity: 0.8 }}
          />
          {/* Marcador de Início (A) */}
          <Marker position={routeShape.startPoint} icon={startIcon}>
            <Popup>Início da Rota (Ponto A)</Popup>
          </Marker>
          {/* Marcador de Fim (B) */}
          <Marker position={routeShape.endPoint} icon={endIcon}>
            <Popup>Fim da Rota (Ponto B)</Popup>
          </Marker>
        </>
      )}
    </MapContainer>
  );
}