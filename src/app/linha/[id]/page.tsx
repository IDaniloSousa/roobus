'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { ArrowUp, ArrowDown, Calendar, ArrowLeft } from '@phosphor-icons/react';

// Tipos para os dados que virão da API
type Horario = {
  id: number;
  diaDaSemana: string;
  sentido: string;
  partidas: string[];
};

type ItinerarioDetalhado = {
  id: number;
  linha: string;
  descricao: string;
  horarios: Horario[];
};

export default function LinhaDetalhePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [itinerario, setItinerario] = useState<ItinerarioDetalhado | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    async function fetchDetalhes() {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/itinerarios/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Erro ao buscar dados da linha`);
        }
        const data = await response.json();
        setItinerario(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDetalhes();
  }, [id]);

  // Agrupa os horários por sentido para facilitar a renderização
  const horariosPorSentido = itinerario?.horarios.reduce((acc, horario) => {
    const sentido = horario.sentido;
    if (!acc[sentido]) {
      acc[sentido] = [];
    }
    acc[sentido].push(horario);
    return acc;
  }, {} as Record<string, Horario[]>);

  if (isLoading) {
    return (
      <>
        <Header title="Carregando..." showBackButton />
        <main className="p-4 text-center text-gray-500">Buscando horários...</main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header title="Erro" showBackButton />
        <main className="p-4 text-center">
          <p className="text-red-600 font-semibold">Ocorreu um erro:</p>
          <p className="text-gray-700 mt-2">{error}</p>
          <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center justify-center mx-auto gap-2">
            <ArrowLeft size={20} />
            Voltar
          </button>
        </main>
      </>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header title={`Linha ${itinerario?.linha}`} showBackButton />

      <main className="p-4 space-y-6">
        <h1 className="text-center text-2xl font-bold text-gray-800 -mb-2">{itinerario?.descricao}</h1>
        
        {itinerario && itinerario.horarios.length > 0 && horariosPorSentido ? (
          Object.entries(horariosPorSentido).map(([sentido, horarios]) => (
            <div key={sentido}>
              <div className="flex items-center gap-3 p-3 bg-gray-200 rounded-t-lg">
                {sentido.includes('BAIRRO → CENTRO') ? 
                  <ArrowUp size={24} className="text-green-600" weight="bold" /> : 
                  <ArrowDown size={24} className="text-blue-600" weight="bold" />
                }
                <h2 className="text-lg font-semibold text-gray-700">{sentido}</h2>
              </div>

              <div className="bg-white p-4 rounded-b-lg shadow-sm space-y-4">
                {horarios.map(horario => (
                  <div key={horario.id}>
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar size={20} className="text-gray-500" />
                      <h3 className="font-medium text-gray-600">{horario.diaDaSemana}</h3>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                      {horario.partidas.map(partida => (
                        <div key={partida} className="bg-gray-100 text-center p-2 rounded-md border border-gray-200">
                          <span className="font-mono font-semibold text-gray-800">{partida}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">Nenhuma grade de horário cadastrada para esta linha.</p>
          </div>
        )}
      </main>
    </div>
  );
}
