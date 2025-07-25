// src/components/MapDisplay.tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- O código de correção do ícone padrão continua o mesmo ---
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl.src,
  iconUrl: iconUrl.src,
  shadowUrl: shadowUrl.src,
});
// --- Fim da correção ---

// ===================================================================
// ## NOVO: Definição do Ícone Personalizado para o Usuário ##
// ===================================================================
const userLocationIcon = new L.DivIcon({
  html: `<div class="user-location-icon-pulse"></div><div class="user-location-icon"></div>`,
  className: 'bg-transparent', // Classe para o container do ícone
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});
// ===================================================================

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

interface MapDisplayProps {
  stops: Stop[];
  center: [number, number];
}

export default function MapDisplay({ stops, center }: MapDisplayProps) {
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

      {/* Marcadores das paradas (continuam com o ícone padrão) */}
      {stops.map(stop => (
        <Marker key={stop.id} position={[stop.lat, stop.lng]}>
          <Popup>{stop.name}</Popup>
        </Marker>
      ))}

      {/* Marcador da localização do usuário */}
      {/* ATUALIZADO: Adicionada a prop 'icon' com nosso novo ícone */}
      <Marker position={center} icon={userLocationIcon}>
        <Popup>Você está aqui</Popup>
      </Marker>
    </MapContainer>
  );
}