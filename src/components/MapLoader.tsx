// src/components/MapLoader.tsx
'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { BusData } from './MapDisplay';

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

type User = {
  id: number;
  name: string;
  route_number: number;
  role: string;
} | null;

interface MapLoaderProps {
  stops: Stop[];
  lineId?: number;
  sentido?: string;
  currentUser: User;
}

export default function MapLoader({ stops, lineId, sentido, currentUser }: MapLoaderProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([-16.4674, -54.6382]);
  const [routeShape, setRouteShape] = useState<RouteShapeData | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [buses, setBuses] = useState<Record<number, BusData>>({});
  const watchIdRef = useRef<number | null>(null);

  // 1. Busca localização do usuário (GPS)
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

  // 2. Conecta ao WebSocket (ALTERADO PARA TAILSCALE/UMBREL)
  useEffect(() => {
    // 👇 AQUI ESTÁ A MUDANÇA IMPORTANTE
    // Pega a URL do Tailscale do arquivo .env ou usa localhost se não tiver
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

    console.log('Tentando conectar no Socket:', socketUrl);

    const socketInstance = io(socketUrl, {
      transports: ['websocket'], // 👇 Força Websocket (Essencial para Túneis como Tailscale)
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('✅ Conectado ao Socket do Umbrel!', socketInstance.id);
    });

    socketInstance.on('connect_error', (err) => {
      console.error('❌ Erro de conexão Socket:', err);
    });

    socketInstance.on('update-bus-position', (data: BusData) => {
      // Se a atualização for do próprio usuário, ignora (já atualizamos localmente)
      if (currentUser && data.userId === currentUser.id) return;

      setBuses((prev) => ({
        ...prev,
        [data.userId]: data,
      }));
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [currentUser]);

  // 3. Transmissão de Posição (Motorista)
  useEffect(() => {
    if (!currentUser || !socket || currentUser.role !== 'DRIVER' || !currentUser.route_number) {
      return; 
    }

    if ('geolocation' in navigator) {
      console.log(`Iniciando transmissão rota ${currentUser.route_number}...`);
      
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          const payload: BusData = {
            userId: currentUser.id,
            name: currentUser.name,
            routeNumber: currentUser.route_number!,
            lat: latitude,
            lng: longitude,
            timestamp: Date.now(),
          };

          // Envia para o servidor Umbrel
          socket.emit('driver-location', payload);

          // Atualiza o mapa localmente instantaneamente
          setBuses((prev) => ({
            ...prev,
            [currentUser.id]: payload,
          }));
        },
        (error) => console.error('Erro GPS Watch:', error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }

    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [currentUser, socket]);

  // 4. Busca traçado da rota (API Next.js)
  useEffect(() => {
    if (!lineId || !sentido) {
      setRouteShape(null);
      return; 
    }
    
    const fetchRouteShape = async () => {
      try {
        const response = await fetch(`/api/itinerarios/${lineId}/shape?sentido=${encodeURIComponent(sentido)}`);
        if (!response.ok) throw new Error('Traçado não encontrado');
        const data: RouteShapeData = await response.json(); 
        setRouteShape(data); 
      } catch (err) {
        console.error("Erro ao buscar traçado:", err);
        setRouteShape(null);
      }
    };

    fetchRouteShape();
  }, [lineId, sentido]); 

  const Map = useMemo(
    () =>
      dynamic(() => import('@/components/MapDisplay'), {
        loading: () => <p className="text-center pt-20 text-gray-500">Carregando mapa...</p>,
        ssr: false,
      }),
    []
  );

  return <Map stops={stops} center={mapCenter} routeShape={routeShape} buses={buses}/>;
}