// src/app/(main)/busca/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlass, ArrowsLeftRight, MapPin } from '@phosphor-icons/react';
import LinhaCards from '@/components/LinhaCards';

// Define um tipo para os dados do itinerário que virão da API
type Itinerario = {
  id: number;
  linha: string;
  descricao: string;
};

export default function BuscaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('UFR');
  const [searchType, setSearchType] = useState('agora');
  const [selectedDateTime, setSelectedDateTime] = useState('');
  
  // Estado para armazenar TODAS as linhas vindas do banco de dados
  const [todasAsLinhas, setTodasAsLinhas] = useState<Itinerario[]>([]);
  // Estado para os resultados filtrados pela busca do usuário
  const [filteredResults, setFilteredResults] = useState<Itinerario[]>([]);
  // Estado para controlar o carregamento dos dados
  const [isLoading, setIsLoading] = useState(true);

  // Efeito que busca os dados da API assim que o componente é montado
  useEffect(() => {
    async function fetchItinerarios() {
      try {
        const response = await fetch('/api/itinerarios');
        if (!response.ok) {
          throw new Error('Falha ao buscar dados');
        }
        const data: Itinerario[] = await response.json();
        setTodasAsLinhas(data); // Armazena a lista completa
      } catch (error) {
        console.error(error);
        // Aqui você poderia definir um estado de erro para mostrar na UI
      } finally {
        setIsLoading(false); // Finaliza o carregamento
      }
    }

    fetchItinerarios();
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  // Efeito que filtra os resultados conforme o usuário digita
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredResults([]);
      return;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    const results = todasAsLinhas.filter(
      (linha) =>
        linha.linha.toLowerCase().includes(lowercasedFilter) ||
        linha.descricao.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredResults(results);
  }, [searchTerm, todasAsLinhas]); // Roda sempre que o termo de busca ou a lista de linhas mudar

  const handleSwapLocations = () => {
    setFromLocation(toLocation);
    setToLocation(fromLocation);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Seções de busca de rota e horário (sem alterações) */}
      <section className="relative flex items-center gap-2">
        {/* ... código da busca de/para ... */}
      </section>
      <section className="flex flex-row gap-4">
        {/* ... código do seletor de horário ... */}
      </section>
      <hr className="border-gray-200" />

      {/* --- Seção de Busca de Linha --- */}
      <section>
        <div className="relative">
          <MagnifyingGlass size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar pelo número ou nome da linha..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-lg text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </section>

      {/* --- Seção de Resultados --- */}
      <section>
        <div className="space-y-3">
          {isLoading ? (
            <p className="text-center text-gray-500">Carregando linhas...</p>
          ) : searchTerm && filteredResults.length > 0 ? (
            filteredResults.map((linha) => (
              <LinhaCards 
                key={linha.id}
                linha={linha.linha}
                nome={linha.descricao} // Usando 'descricao' que vem do banco
                variant={{ type: 'busca' }}
              />
            ))
          ) : searchTerm && !isLoading ? (
            <div className="text-center py-10">
              <p className="text-gray-600">Nenhum resultado encontrado para "{searchTerm}"</p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}