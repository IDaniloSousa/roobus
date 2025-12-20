// src/app/(main)/mapa/page.tsx
'use client'; 

import { useState, useEffect, useMemo } from 'react';
import MapLoader from '@/components/MapLoader';
import Navbar from '@/components/Navbar';
import { Bus, ArrowClockwise } from '@phosphor-icons/react';
import { getLoggedUser } from '@/app/actions/auth';
import { getAnonymousUserId } from '@/utils/anonymousUser';

// Componente Header local
function Header() {
  return (
    <header className="shrink-0 bg-blue-600 text-white flex items-center justify-center h-16 shadow-md z-20">
      <h1 className="text-2xl font-bold">RooBus</h1>
    </header>
  );
}

// Tipos definidos localmente
type ItinerarioComSentidos = {
  id: number;
  linha: string;
  descricao: string;
  route_shapes: {
    sentido: string;
  }[];
};

type ApiResponse = {
  data: ItinerarioComSentidos[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type User = {
  id: number;
  name: string;
  route_number: number | null;
  role: string;
} | null;

export default function MapaPage() {
  // --- PARADAS DE TESTE REMOVIDAS DAQUI ---

  const [todasAsLinhas, setTodasAsLinhas] = useState<ItinerarioComSentidos[]>([]);
  const [selectedLineId, setSelectedLineId] = useState<string>(''); 
  const [selectedSentido, setSelectedSentido] = useState<string>(''); 
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentUser, setCurrentUser] = useState<User>(null);

  // Busca o usuário logado
  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getLoggedUser();
        setCurrentUser(user);
      } catch (e) {
        console.error("Erro ao verificar sessão:", e);
      }
    }
    fetchUser();
  }, []);

  // Lógica para pré-selecionar a linha do motorista
  useEffect(() => {
    if (currentUser && currentUser.route_number && todasAsLinhas.length > 0) {
      const linhaDoMotorista = todasAsLinhas.find(l => l.linha === String(currentUser.route_number));
      if (linhaDoMotorista) {
        setSelectedLineId(String(linhaDoMotorista.id));
      }
    }
  }, [currentUser, todasAsLinhas]);

  // Busca todas as linhas quando o componente carrega
  useEffect(() => {
    async function fetchItinerarios() {
      try {
        const response = await fetch('/api/itinerarios?limit=1000');
        if (!response.ok) {
          throw new Error('Falha ao buscar dados');
        }
        const jsonResponse: ApiResponse = await response.json();
        setTodasAsLinhas(jsonResponse.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchItinerarios();
  }, []);

  // Salvar no Histórico ao selecionar uma linha
  useEffect(() => {
    if (!selectedLineId) return;

    const salvarNoHistorico = async () => {
      const anonymousId = getAnonymousUserId();
      try {
        await fetch('/api/linhas-recentes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            itinerario_id: Number(selectedLineId),
            anonymous_user_id: anonymousId,
          }),
        });
      } catch (error) {
        console.error("Erro ao salvar histórico no mapa:", error);
      }
    };

    salvarNoHistorico();
  }, [selectedLineId]);

  // Filtra os sentidos disponíveis
  const availableSentidos = useMemo(() => {
    if (!selectedLineId) return [];
    const linha = todasAsLinhas.find(l => l.id === parseInt(selectedLineId));
    return linha ? linha.route_shapes.map(shape => shape.sentido) : [];
  }, [selectedLineId, todasAsLinhas]);

  const handleLinhaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLineId(e.target.value);
    setSelectedSentido(''); 
  };

  const handleSentidoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSentido(e.target.value);
  };

  return (
    <div className="fixed inset-0 flex flex-col">
      <Header />

      <div className="absolute top-16 left-0 right-0 z-10 p-2 bg-white shadow-lg m-3 rounded-lg flex flex-col gap-2">
        {currentUser && currentUser.role === 'DRIVER' && (
          <div className="bg-indigo-100 border border-indigo-300 text-indigo-800 px-3 py-2 rounded text-xs font-bold text-center shadow-sm">
            Modo Motorista Ativo: Linha {currentUser.route_number}
          </div>
        )}

        <div className="flex items-center gap-2">
          <Bus size={20} className="text-gray-600 shrink-0" />
          <select
            value={selectedLineId}
            onChange={handleLinhaChange}
            className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="">{isLoading ? "Carregando linhas..." : "Selecione uma linha"}</option>
            {todasAsLinhas.filter(linha => linha.route_shapes.length > 0).map((linha) => (
              <option key={linha.id} value={linha.id}>
                {linha.linha} - {linha.descricao}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <ArrowClockwise size={20} className="text-gray-600 shrink-0" />
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

      <main className="flex-1 relative z-0">
        <MapLoader
          // 👇 Passamos um array vazio para não exibir paradas por enquanto
          stops={[]} 
          lineId={selectedLineId ? parseInt(selectedLineId) : undefined}
          sentido={selectedSentido ? selectedSentido : undefined}
          currentUser={currentUser}
        />
      </main>

      <div className="shrink-0 relative z-10 bg-white shadow-t">
        <Navbar />
      </div>
    </div>
  );
}