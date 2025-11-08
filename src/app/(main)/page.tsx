// src/app/(main)/page.tsx
'use client';

import { useEffect, useState } from "react";
import { getAnonymousUserId } from "@/utils/anonymousUser";
import { Bus, Clock, MapPin } from "@phosphor-icons/react";

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
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const id = getAnonymousUserId();
    setUserId(id);
  }, []);

  const linhasProximas: LinhaProxima[] = [];
  const historico: LinhaHistorico[] = [];

  return (
    <div className="p-4">

      {/* Seção Linhas Próximas */}
      <section className="mb-8 mt-6">
        <h2 className="text-center text-lg font-semibold text-gray-800 mb-4">
          Linhas Próximas
        </h2>

        <div className="space-y-3">
          {linhasProximas.length > 0 ? (
            linhasProximas.map((linha) => (
              <div
                key={linha.id}
                className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4"
              >
                <Bus size={28} className="text-gray-600 flex-shrink-0" />
                <div className="flex-grow">
                  <p className="font-bold text-gray-900">
                    {linha.linha} - {linha.nome}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock size={16} />
                    <span>{linha.tempoEstimado} min</span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-bold text-white rounded-full ${
                    linha.status === "Pontual" ? "bg-green-500" : "bg-red-600"
                  }`}
                >
                  {linha.status}
                </span>
              </div>
            ))
          ) : (
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
            historico.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4"
              >
                <Bus size={28} className="text-gray-600 flex-shrink-0" />
                <div className="flex-grow">
                  <p className="font-bold text-gray-900">
                    {item.linha} - {item.nome}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin size={16} />
                    <span>{item.ultimoLocal}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white text-center p-6 rounded-lg border border-gray-200">
              <p className="text-gray-500">
                Nenhum ônibus embarcado anteriormente
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
