'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import LinhaCards from '@/components/LinhaCards';
import Link from 'next/link';

// Define um tipo para os dados do itinerário que virão da API
type Itinerario = {
  id: number;
  linha: string;
  descricao: string;
};

// Define o tipo da resposta da API (que agora é paginada)
type ApiResponse = {
  data: Itinerario[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export default function BuscaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [todasAsLinhas, setTodasAsLinhas] = useState<Itinerario[]>([]);
  const [filteredResults, setFilteredResults] = useState<Itinerario[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Efeito que busca os dados da API
  useEffect(() => {
    async function fetchItinerarios() {
      try {
        // CORREÇÃO 1: Adicionamos ?limit=1000 para buscar todas as linhas
        const response = await fetch('/api/itinerarios?limit=1000');
        
        if (!response.ok) {
          throw new Error('Falha ao buscar dados');
        }
        
        // CORREÇÃO 2: O objeto retornado contém paginação, a lista real está em '.data'
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

  // Efeito que filtra os resultados
  useEffect(() => {
    if (searchTerm.trim() === '') {
      // Se a busca estiver vazia, exibe todas as linhas
      setFilteredResults(todasAsLinhas);
      return;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    const results = todasAsLinhas.filter(
      (linha) =>
        linha.linha.toLowerCase().includes(lowercasedFilter) ||
        linha.descricao.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredResults(results);
  }, [searchTerm, todasAsLinhas]);

  return (
    <div className="p-4 space-y-6">
      {/* --- Seção ÚNICA de Busca de Linha --- */}
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
          ) : filteredResults.length > 0 ? (
            filteredResults.map((linha) => (
              <Link key={linha.id} href={`/linha/${linha.id}`} passHref>
                <div className="cursor-pointer transition-transform duration-200 hover:scale-[1.02]">
                  <LinhaCards 
                    linha={linha.linha}
                    nome={linha.descricao}
                    variant={{ type: 'busca' }}
                  />
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-600">Nenhum resultado encontrado para "{searchTerm}"</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}