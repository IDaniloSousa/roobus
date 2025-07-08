// src/app/(main)/busca/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlass, ArrowsLeftRight, MapPin } from '@phosphor-icons/react';
import LinhaCards from '@/components/LinhaCards';

// --- Dados Mockados ---
const mockLinhas = [
  { id: '1', linha: '214', nome: 'Vila Mineira', status: 'Pontual', tempoEstimado: 5 },
  { id: '2', linha: '113', nome: 'Marechal Rondon', status: 'Atrasado', tempoEstimado: 15 },
  { id: '3', linha: '211-A', nome: 'Atl. Cidade de Deus', ultimoLocal: 'Terminal Rodoviário' },
  { id: '4', linha: '505', nome: 'Jardim Panorama', ultimoLocal: 'Praça Central' },
  { id: '5', linha: '301', nome: 'Centro / UFR', status: 'Pontual', tempoEstimado: 12 },
];
// ----------------------

export default function BuscaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('UFR');
  const [searchType, setSearchType] = useState('agora');
  const [selectedDateTime, setSelectedDateTime] = useState('');
  const [filteredResults, setFilteredResults] = useState(mockLinhas);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredResults([]);
      return;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    const results = mockLinhas.filter(
      (linha) =>
        linha.linha.toLowerCase().includes(lowercasedFilter) ||
        linha.nome.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredResults(results);
  }, [searchTerm]);

  const handleSwapLocations = () => {
    setFromLocation(toLocation);
    setToLocation(fromLocation);
  };

  return (
    <div className="p-4 space-y-6">
      {/* --- Seção de Busca de Rota (De/Para) --- */}
      <section className="relative flex items-center gap-2">
        <div className="flex-grow space-y-2">
          <div className="relative">
            <MapPin size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="De: Ponto de partida"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="relative">
            <MapPin size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Para: Destino"
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <button
          onClick={handleSwapLocations}
          className="p-2 bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300 transition-colors"
          aria-label="Trocar partida e destino"
        >
          <ArrowsLeftRight size={20} />
        </button>
      </section>

      {/* --- Seção de Opções de Horário (CORRIGIDA) --- */}
      <section className="flex flex-row gap-4">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          // MUDANÇA: A largura agora é fixa para manter a posição e o tamanho consistentes.
          className="w-1/2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="agora">Sair agora</option>
          <option value="saida">Horário de saída</option>
          <option value="chegada">Horário de chegada</option>
        </select>

        {/* MUDANÇA: O campo de data/hora agora fica invisível para preservar o layout, em vez de ser removido do DOM. */}
        <input
          type="datetime-local"
          value={selectedDateTime}
          onChange={(e) => setSelectedDateTime(e.target.value)}
          className={`w-1/2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-opacity duration-300 ${
            searchType === 'agora' ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        />
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
          {searchTerm && filteredResults.length > 0 && (
            filteredResults.map((linha) => (
              <LinhaCards 
                key={linha.id}
                linha={linha.linha}
                nome={linha.nome}
                variant={{ type: 'busca' }}
              />
            ))
          )}
          {searchTerm && filteredResults.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-600">Nenhum resultado encontrado para "{searchTerm}"</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
