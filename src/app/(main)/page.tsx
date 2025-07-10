// src/app/(main)/page.tsx
'use client';

import { User } from '@phosphor-icons/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
  // Estados do componente
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ nome: string; email: string } | null>(null);
  const router = useRouter();

  // --- DADOS MOCK (VAZIOS POR ENQUANTO) ---
  // No futuro, estes arrays serão preenchidos com dados do seu banco de dados.
  const linhasProximas: LinhaProxima[] = [];
  const historico: LinhaHistorico[] = [];
  // -----------------------------------------

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    setIsLoggedIn(!!token);
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    router.push('/login');
  };

  return (
    <div className="p-4">
      {/* Cabeçalho com botão de login e cadastro */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🚌 RooBus</h1>
          <p className="text-gray-600">Rastreamento de ônibus em tempo real</p>
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User size={20} />
                <span className="text-gray-700">Olá, {user?.nome || 'Usuário'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Sair
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cadastrar
              </Link>
            </>
          )}
        </div>
      </header>




       {/* Seção Linhas Próximas */}
      <section className="mb-8">
        <h2 className="text-center text-lg font-semibold text-gray-800 mb-4">
          Linhas Próximas
        </h2>
        <div className="space-y-3">
          {linhasProximas.length > 0 ? (
            linhasProximas.map((linha) => (
              <div key={linha.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{linha.linha} - {linha.nome}</h3>
                  <p className="text-sm text-gray-600">Chegada em {linha.tempoEstimado} min</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    linha.status === 'Pontual' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {linha.status}
                  </span>
                </div>
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
              <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.linha} - {item.nome}</h3>
                  <p className="text-sm text-gray-600">Último local: {item.ultimoLocal}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white text-center p-6 rounded-lg border border-gray-200">
              <p className="text-gray-500">Nenhum ônibus embarcado anteriormente</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}