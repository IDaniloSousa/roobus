// src/app/(main)/mapa/page.tsx
'use client'; 

import { useState, useEffect, useMemo } from 'react';
import MapLoader from '@/components/MapLoader';
import Navbar from '@/components/Navbar';
import { Bus, ArrowClockwise, MapPin } from '@phosphor-icons/react';

// O Header que você já tinha
function Header() {
  return (
    <header className="flex-shrink-0 bg-blue-600 text-white flex items-center justify-center h-16 shadow-md z-20">
      <h1 className="text-2xl font-bold">RooBus</h1>
    </header>
  );
}

// Definimos um tipo para os dados da API
type ItinerarioComSentidos = {
  id: number;
  linha: string;
  descricao: string;
  route_shapes: {
    sentido: string;
  }[];
};

export default function MapaPage() {
  const exampleStops = [
    { id: 1, name: 'Parada Teste 1', lat: -16.4368, lng: -54.6374 },
    { id: 2, name: 'Parada Teste 2', lat: -16.4562, lng: -54.6321 },
  ];

  const [todasAsLinhas, setTodasAsLinhas] = useState<ItinerarioComSentidos[]>([]);
  const [selectedLineId, setSelectedLineId] = useState<string>(''); 
  const [selectedSentido, setSelectedSentido] = useState<string>(''); 
  const [isLoading, setIsLoading] = useState(true);

  // Busca todas as linhas quando o componente carrega
  useEffect(() => {
    async function fetchItinerarios() {
      try {
        const response = await fetch('/api/itinerarios');
        if (!response.ok) {
          throw new Error('Falha ao buscar dados');
        }
        const data: ItinerarioComSentidos[] = await response.json();
        setTodasAsLinhas(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchItinerarios();
  }, []);

  // Filtra os sentidos disponíveis com base na linha selecionada
  const availableSentidos = useMemo(() => {
    if (!selectedLineId) return [];
    
    const linha = todasAsLinhas.find(l => l.id === parseInt(selectedLineId));
    return linha ? linha.route_shapes.map(shape => shape.sentido) : [];
  }, [selectedLineId, todasAsLinhas]);

  const handleLinhaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLineId(e.target.value);
    setSelectedSentido(''); // Reseta o sentido
  };

  const handleSentidoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSentido(e.target.value);
  };

  return (
    <div className="fixed inset-0 flex flex-col">
      <Header />

      {/* PAINEL DE CONTROLE (OS DROPDOWNS) */}
      <div className="absolute top-16 left-0 right-0 z-10 p-2 bg-white shadow-lg m-3 rounded-lg flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Bus size={20} className="text-gray-600 flex-shrink-0" />
          <select
            value={selectedLineId}
            onChange={handleLinhaChange}
            className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="">{isLoading ? "Carregando linhas..." : "Selecione uma linha"}</option>
            {/* 👇 Filtra para mostrar apenas linhas que TÊM traçados cadastrados */}
            {todasAsLinhas.filter(linha => linha.route_shapes.length > 0).map((linha) => (
              <option key={linha.id} value={linha.id}>
                {linha.linha} - {linha.descricao}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <ArrowClockwise size={20} className="text-gray-600 flex-shrink-0" />
          <select
            value={selectedSentido}
            onChange={handleSentidoChange}
            className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!selectedLineId || availableSentidos.length === 0}
          >
            <option value="">Selecione um sentido</option>
            {availableSentidos.map((sentido) => (
              <option key={sentido} value={sentido}>
                {sentido}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* A ÁREA DO MAPA */}
      <main className="flex-1 relative z-0">
        <MapLoader
          stops={exampleStops}
          // Passa os estados dinâmicos para o MapLoader
          lineId={selectedLineId ? parseInt(selectedLineId) : undefined}
          sentido={selectedSentido ? selectedSentido : undefined}
        />
      </main>

      {/* O RODAPÉ (Navbar) */}
      <div className="flex-shrink-0 relative z-10 bg-white shadow-t">
        <Navbar />
      </div>
    </div>
  );
}