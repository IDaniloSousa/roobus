// src/app/(main)/page.tsx
'use client';

import { useEffect, useState } from "react";
import { getAnonymousUserId } from "@/utils/anonymousUser";
import LinhaCards from "@/components/LinhaCards";
import Link from "next/link";
import { Clock } from "@phosphor-icons/react";

// Tipo apenas para o que interessa agora: Histórico
type LinhaRecente = {
  id: number;
  linha: string;
  descricao: string;
};

export default function HomePage() {
  const [historico, setHistorico] = useState<LinhaRecente[]>([]);
  const [loadingHistorico, setLoadingHistorico] = useState(true);

  // Busca APENAS o histórico real do usuário
  useEffect(() => {
    async function fetchHistorico() {
      const userId = getAnonymousUserId();
      if (!userId) return;

      try {
        const response = await fetch(`/api/linhas-recentes?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setHistorico(data);
        }
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
      } finally {
        setLoadingHistorico(false);
      }
    }

    fetchHistorico();
  }, []);

  return (
    <div className="p-4 space-y-8">

      {/* Seção Linhas Próximas (Placeholder conforme solicitado) */}
      <section className="opacity-50">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 ml-1 flex items-center gap-2">
          Linhas Próximas
          <span className="text-xs font-normal text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">Em breve</span>
        </h2>
        <div className="bg-gray-100 border border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Clock size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500 text-sm">
            A funcionalidade de localização por GPS será implementada em breve.
          </p>
        </div>
      </section>

      {/* Seção Vistos Recentemente (A funcionalidade principal agora) */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-3 ml-1">
          Vistos Recentemente
        </h2>

        <div className="space-y-3">
          {loadingHistorico ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-600 mb-2"></div>
              <p className="text-gray-500 text-sm">Carregando seu histórico...</p>
            </div>
          ) : historico.length > 0 ? (
            historico.map((linha) => (
              <Link key={linha.id} href={`/linha/${linha.id}`} passHref>
                <div className="cursor-pointer transition-transform hover:scale-[1.01] active:scale-95">
                  <LinhaCards
                    linha={linha.linha}
                    nome={linha.descricao}
                    // Usamos a variante 'historico' para exibir o ícone de mapa/pin
                    variant={{ type: 'historico', ultimoLocal: 'Acessado recentemente' }}
                  />
                </div>
              </Link>
            ))
          ) : (
            <div className="bg-white text-center p-8 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-gray-500 text-sm mb-1">
                Nenhuma linha visualizada recentemente.
              </p>
              <p className="text-xs text-gray-400">
                Pesquise uma linha ou selecione no mapa para vê-la aqui.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}