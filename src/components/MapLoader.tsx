// src/components/MapLoader.tsx
'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { BusData } from './MapDisplay'; // Importando o tipo

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

// Tipo do usuário
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

  // 👇 ESTADO ATUALIZADO para guardar o objeto inteiro
  const [routeShape, setRouteShape] = useState<RouteShapeData | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [buses, setBuses] = useState<Record<number, BusData>>({});
  const watchIdRef = useRef<number | null>(null);

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

  // Conecta ao WebSocket
  useEffect(() => {
    const socketInstance = io();
    setSocket(socketInstance);

    socketInstance.on('update-bus-position', (data: BusData) => {
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

  // Lógica de TRANSMISSÃO (Se for motorista)
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

          // Envia para o servidor
          socket.emit('driver-location', payload);

          // Atualiza localmente
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
        loading: () => <p className="text-center pt-20 text-gray-500">Carregando mapa...</p>,
        ssr: false,
      }),
    []
  );

  return <Map stops={stops} center={mapCenter} routeShape={routeShape} buses={buses}/>;
}