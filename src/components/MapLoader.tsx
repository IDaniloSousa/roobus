// src/components/MapLoader.tsx
'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState, useEffect } from 'react';

interface Stop {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

// 👇 TIPO DE DADO ATUALIZADO
// Define a estrutura do objeto que esperamos da API
type RouteShapeData = {
  coordinates: [number, number][];
  startPoint: [number, number];
  endPoint: [number, number];
};

interface MapLoaderProps {
  stops: Stop[];
  lineId?: number;
  sentido?: string;
}

export default function MapLoader({ stops, lineId, sentido }: MapLoaderProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([-23.5505, -46.6333]);
  
  // 👇 ESTADO ATUALIZADO para guardar o objeto inteiro
  const [routeShape, setRouteShape] = useState<RouteShapeData | null>(null);

  // Efeito para buscar a localização do usuário (sem alterações)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
        },
        (error) => {
          console.error("Erro ao obter a localização do usuário:", error);
        }
      );
    }
  }, []);

  // Efeito para buscar o traçado da rota (sem alterações lógicas)
  useEffect(() => {
    if (!lineId || !sentido) {
      setRouteShape(null);
      return; 
    }
    
    const fetchRouteShape = async () => {
      try {
        const response = await fetch(`/api/itinerarios/${lineId}/shape?sentido=${encodeURIComponent(sentido)}`);
        
        if (!response.ok) {
          throw new Error('Traçado não encontrado');
        }
        // Agora esperamos o objeto completo (com startPoint, endPoint, etc.)
        const data: RouteShapeData = await response.json(); 
        setRouteShape(data); // Salva o objeto inteiro no estado
      } catch (err) {
        console.error("Erro ao buscar traçado da rota:", err);
        setRouteShape(null);
      }
    };
    
    fetchRouteShape();
    
  }, [lineId, sentido]); 

  const Map = useMemo(
    () =>
      dynamic(() => import('@/components/MapDisplay'), {
        loading: () => <p className="text-center">Carregando mapa...</p>,
        ssr: false,
      }),
    []
  );

  // Passe o objeto 'routeShape' inteiro como prop para o mapa
  return <Map stops={stops} center={mapCenter} routeShape={routeShape} />;
}