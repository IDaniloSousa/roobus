// src/app/(main)/busca/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import LinhaCards from '@/components/LinhaCards'; //
import Link from 'next/link';

type Itinerario = {
  id: number;
  linha: string;
  descricao: string;
};

type ApiResponse = {
  data: Itinerario[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

// Hook personalizado para Debounce (evita muitas requisições enquanto digita)
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function BuscaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Itinerario[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Aguarda o usuário parar de digitar por 500ms
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    async function fetchItinerarios() {
      setIsLoading(true);
      try {
        // Passa o termo de busca para a API
        const params = new URLSearchParams();
        params.set('limit', '50'); // Traz 50 resultados por vez
        if (debouncedSearch) {
          params.set('search', debouncedSearch);
        }

        const response = await fetch(`/api/itinerarios?${params.toString()}`);
        
        if (!response.ok) throw new Error('Falha ao buscar dados');
        
        const jsonResponse: ApiResponse = await response.json();
        setResults(jsonResponse.data);
        
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchItinerarios();
  }, [debouncedSearch]); // Re-executa quando o termo debounced mudar

  return (
    <div className="p-4 space-y-6">
      {/* Seção de Busca */}
      <section>
        <div className="relative">
          <MagnifyingGlass size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar pelo número ou nome da linha..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-lg text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
      </section>

      {/* Seção de Resultados */}
      <section>
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-2"></div>
              <p className="text-gray-500 text-sm">Buscando rotas...</p>
            </div>
          ) : results.length > 0 ? (
            results.map((linha) => (
              <Link key={linha.id} href={`/linha/${linha.id}`} passHref>
                <div className="cursor-pointer transition-transform duration-200 hover:scale-[1.02] active:scale-95">
                  <LinhaCards 
                    linha={linha.linha}
                    nome={linha.descricao}
                    variant={{ type: 'busca' }}
                  />
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-10 bg-white rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-600">
                Nenhuma linha encontrada para "<strong>{searchTerm}</strong>"
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}