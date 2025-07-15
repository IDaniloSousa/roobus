// src/components/MapDisplay.tsx
'use client';

// Importe o hook 'useMap' do react-leaflet
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// (O código de correção do ícone continua o mesmo aqui)
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl.src,
  iconUrl: iconUrl.src,
  shadowUrl: shadowUrl.src,
});
// --- Fim da correção ---


// NOVO: Componente auxiliar para centralizar o mapa dinamicamente
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap(); // Pega a instância do mapa
  map.setView(center, zoom); // Define a nova visão do mapa
  return null; // Não renderiza nada na tela
}

interface Stop {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

// ATUALIZADO: A interface de props agora espera um 'center'
interface MapDisplayProps {
  stops: Stop[];
  center: [number, number];
}

export default function MapDisplay({ stops, center }: MapDisplayProps) {
  return (
    <MapContainer
      center={center}
      zoom={15} // Um zoom mais próximo é melhor para localização
      style={{ height: '100%', width: '100%' }}
    >
      {/* Componente que vai forçar a atualização da visão */}
      <ChangeView center={center} zoom={15} />

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {stops.map(stop => (
        <Marker key={stop.id} position={[stop.lat, stop.lng]}>
          <Popup>{stop.name}</Popup>
        </Marker>
      ))}

      {/* Opcional: Adiciona um marcador para a localização do usuário */}
      <Marker position={center}>
        <Popup>Você está aqui</Popup>
      </Marker>
    </MapContainer>
  );
}