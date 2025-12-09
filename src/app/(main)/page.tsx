// src/app/(main)/page.tsx
'use client';

import { useEffect, useState } from "react";
import { getAnonymousUserId } from "@/utils/anonymousUser";
import LinhaCards from "@/components/LinhaCards";
import Link from "next/link";
import { MapPin, NavigationArrow } from "@phosphor-icons/react";

// Tipos
type LinhaRecente = {
  id: number;
  linha: string;
  descricao: string;
};

type LinhaProxima = {
  id: number;
  linha: string;
  nome: string;
  distanciaKm: number;
  tempoEstimado: number;
  status: 'Pontual' | 'Atrasado';
};

export default function HomePage() {
  const [historico, setHistorico] = useState<LinhaRecente[]>([]);
  const [loadingHistorico, setLoadingHistorico] = useState(true);
  
  // Estados para Geolocalização
  const [linhasProximas, setLinhasProximas] = useState<LinhaProxima[]>([]);
  const [loadingGPS, setLoadingGPS] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // 1. Busca Histórico (Código existente)
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
        console.error("Erro histórico:", error);
      } finally {
        setLoadingHistorico(false);
      }
    }
    fetchHistorico();
  }, []);

  // 2. Busca Geolocalização e Linhas Próximas (NOVO)
  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setGpsError('Navegador não suporta geolocalização.');
      return;
    }

    setLoadingGPS(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Chama nossa nova API passando as coordenadas
          const res = await fetch(`/api/linhas-proximas?lat=${latitude}&lng=${longitude}`);
          if (res.ok) {
            const data = await res.json();
            setLinhasProximas(data);
          } else {
            setGpsError('Erro ao buscar linhas próximas.');
          }
        } catch (error) {
          console.error(error);
          setGpsError('Erro de conexão.');
        } finally {
          setLoadingGPS(false);
        }
      },
      (error) => {
        console.error("Erro GPS:", error);
        if (error.code === 1) setGpsError('Permissão de localização negada.');
        else if (error.code === 2) setGpsError('Localização indisponível.');
        else setGpsError('Erro ao obter localização.');
        setLoadingGPS(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return (
    <div className="p-4 space-y-8">

      {/* --- Seção Linhas Próximas (Automática) --- */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-3 ml-1 flex items-center gap-2">
          <NavigationArrow size={20} className="text-blue-600" weight="fill" />
          Próximo a você
        </h2>

        {loadingGPS && (
          <div className="flex flex-col items-center justify-center py-6 bg-white rounded-lg border border-gray-200">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-xs text-gray-500">Localizando...</p>
          </div>
        )}

        {!loadingGPS && gpsError && (
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 text-center">
            <MapPin size={24} className="mx-auto text-orange-400 mb-1" />
            <p className="text-xs text-orange-600">{gpsError}</p>
            <p className="text-[10px] text-orange-400 mt-1">Ative o GPS para ver linhas próximas.</p>
          </div>
        )}

        {!loadingGPS && !gpsError && linhasProximas.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <p className="text-sm text-gray-500">Nenhuma linha encontrada num raio de 2km.</p>
          </div>
        )}

        <div className="space-y-3">
          {linhasProximas.map((linha) => (
            <Link key={linha.id} href={`/linha/${linha.id}`} passHref>
              <div className="cursor-pointer transition-transform hover:scale-[1.01] active:scale-95">
                <LinhaCards
                  linha={linha.linha}
                  nome={linha.nome}
                  variant={{ 
                    type: 'proxima', 
                    tempoEstimado: linha.tempoEstimado, // Calculado pela API
                    status: linha.status 
                  }}
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* --- Seção Histórico --- */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-3 ml-1">
          Vistos Recentemente
        </h2>

        <div className="space-y-3">
          {loadingHistorico ? (
            <div className="text-center py-4">
              <p className="text-gray-500 text-xs">Carregando histórico...</p>
            </div>
          ) : historico.length > 0 ? (
            historico.map((linha) => (
              <Link key={linha.id} href={`/linha/${linha.id}`} passHref>
                <div className="cursor-pointer transition-transform hover:scale-[1.01] active:scale-95">
                  <LinhaCards
                    linha={linha.linha}
                    nome={linha.descricao}
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
            </div>
          )}
        </div>
      </section>
    </div>
  );
}