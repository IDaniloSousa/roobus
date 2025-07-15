// src/components/MapLoader.tsx
'use client';

import dynamic from 'next/dynamic';
// Importe os hooks 'useState' e 'useEffect' do React
import { useMemo, useState, useEffect } from 'react';

interface Stop {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

interface MapLoaderProps {
  stops: Stop[];
}

export default function MapLoader({ stops }: MapLoaderProps) {
  // 1. Crie um estado para o centro do mapa.
  // Começa com uma localização padrão (São Paulo), que será usada caso o usuário negue a permissão.
  const [mapCenter, setMapCenter] = useState<[number, number]>([-23.5505, -46.6333]);

  // 2. Use o useEffect para executar o código de geolocalização no navegador.
  useEffect(() => {
    // A API de geolocalização só existe no objeto 'navigator' do navegador.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // Callback de sucesso:
        (position) => {
          const { latitude, longitude } = position.coords;
          // 3. Se obtiver a localização, atualiza o estado do centro do mapa.
          setMapCenter([latitude, longitude]);
        },
        // Callback de erro (opcional, mas recomendado):
        (error) => {
          console.error("Erro ao obter a localização do usuário:", error);
          // O mapa permanecerá na localização padrão.
        }
      );
    }
  }, []); // O array vazio [] garante que este efeito rode apenas uma vez.

  const Map = useMemo(
    () =>
      dynamic(() => import('@/components/MapDisplay'), {
        loading: () => <p className="text-center">Carregando mapa...</p>,
        ssr: false,
      }),
    []
  );

  // 4. Passe o estado 'mapCenter' como prop para o componente do mapa.
  return <Map stops={stops} center={mapCenter} />;
}