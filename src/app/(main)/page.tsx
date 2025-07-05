// src/app/(main)/page.tsx
'use client';

import { Bus, Clock, MapPin } from '@phosphor-icons/react';

// Tipos para os nossos dados (útil para quando formos usar dados reais)
type LinhaProxima = {
  id: string;
  linha: string;
  nome: string;
  tempoEstimado: number;
  status: 'Pontual' | 'Atrasado';
};

type LinhaHistorico = {
  id: string;
  linha: string;
  nome: string;
  ultimoLocal: string;
};

export default function HomePage() {
  // --- DADOS MOCK (VAZIOS POR ENQUANTO) ---
  // No futuro, estes arrays serão preenchidos com dados do seu banco de dados.
  const linhasProximas: LinhaProxima[] = [];
  const historico: LinhaHistorico[] = [];
  // -----------------------------------------

  return (
    <div>
      {/* Cabeçalho Roxo/Azul */}
      <header className="bg-indigo-700 text-white p-4 shadow-md">
        <h1 className="text-xl font-bold">Meu Ônibus</h1>
      </header>

      {/* Container para o conteúdo principal da página com padding */}
      <div className="p-4">
        {/* Seção Linhas Próximas */}
        <section className="mb-8">
          <h2 className="text-center text-lg font-semibold text-gray-800 mb-4">
            Linhas Próximas
          </h2>
          <div className="space-y-3">
            {linhasProximas.length > 0 ? (
              // Se houver linhas, mapeie e mostre os cards
              linhasProximas.map((linha) => (
                <div key={linha.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
                  <Bus size={28} className="text-gray-600 flex-shrink-0" />
                  <div className="flex-grow">
                    <p className="font-bold text-gray-900">{linha.linha} - {linha.nome}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock size={16} />
                      <span>{linha.tempoEstimado} min</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold text-white rounded-full ${
                      linha.status === 'Pontual' ? 'bg-green-500' : 'bg-red-600'
                    }`}>
                    {linha.status}
                  </span>
                </div>
              ))
            ) : (
              // Se não houver linhas, mostre a mensagem
              <div className="bg-white text-center p-6 rounded-lg border border-gray-200">
                <p className="text-gray-500">Não há linhas próximas</p>
              </div>
            )}
          </div>
        </section>

        {/* Seção Histórico */}
        <section>
          <h2 className="text-center text-lg font-semibold text-gray-800 mb-4">
            Histórico
          </h2>
          <div className="space-y-3">
            {historico.length > 0 ? (
              // Se houver histórico, mapeie e mostre os cards
              historico.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
                  <Bus size={28} className="text-gray-600 flex-shrink-0" />
                  <div className="flex-grow">
                    <p className="font-bold text-gray-900">{item.linha} - {item.nome}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin size={16} />
                      <span>{item.ultimoLocal}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Se não houver histórico, mostre a mensagem
              <div className="bg-white text-center p-6 rounded-lg border border-gray-200">
                <p className="text-gray-500">Nenhum ônibus embarcado anteriormente</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}