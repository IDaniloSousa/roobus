// src/app/(main)/page.tsx
'use client';

import { Bus, Clock, MapPin, User } from '@phosphor-icons/react';
import { useState, useEffect } from 'react';
import LoginModal from '@/components/LoginModal';

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
  const [showLogin, setShowLogin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

   useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'))
  }, [])

  return (
    <div className="p-4">
      {/* Cabeçalho com botão de login */}
      <header className="flex justify-end mb-6">
        {isLoggedIn ? (
          <div className="flex items-center gap-2 text-sm">
            <User size={20} className="text-gray-600" />
            <span>Minha Conta</span>
          </div>
        ) : (
          <button 
            onClick={() => setShowLogin(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
          >
            <User size={20} />
            <span>Entrar</span>
          </button>
        )}
      </header>

       {/* Seção Linhas Próximas (mantida igual) */}
      <section className="mb-8">
        <h2 className="text-center text-lg font-semibold text-gray-800 mb-4">
          Linhas Próximas
        </h2>
        <div className="space-y-3">
          {linhasProximas.length > 0 ? (
            linhasProximas.map((linha) => (
              <div key={linha.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
                {/* ... conteúdo existente ... */}
              </div>
            ))
          ) : (
            <div className="bg-white text-center p-6 rounded-lg border border-gray-200">
              <p className="text-gray-500">Não há linhas próximas</p>
            </div>
          )}
        </div>
      </section>

      {/* Seção Histórico (mantida igual) */}
      <section>
        <h2 className="text-center text-lg font-semibold text-gray-800 mb-4">
          Histórico
        </h2>
        <div className="space-y-3">
          {historico.length > 0 ? (
            historico.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
                {/* ... conteúdo existente ... */}
              </div>
            ))
          ) : (
            <div className="bg-white text-center p-6 rounded-lg border border-gray-200">
              <p className="text-gray-500">Nenhum ônibus embarcado anteriormente</p>
            </div>
          )}
        </div>
      </section>

      {/* Modal de Login (aparece apenas quando showLogin = true) */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  )
}