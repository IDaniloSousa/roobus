// src\components\Login.tsx
'use client';

import { useState } from 'react';
import { UserCircle, X, SignOut } from '@phosphor-icons/react';
import { loginAction, logoutAction } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';

type User = {
  id: number;
  name: string;
  route_number: number;
} | null;

export default function Login({ currentUser }: { currentUser: User }) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleLoginSubmit(formData: FormData) {
    const result = await loginAction(formData);

    if (result.success) {
      setIsOpen(false);
      setError('');
      router.refresh();
    } else {
      setError(result.message || 'Erro ao entrar');
    }
  }

  // Função de logout
  async function handleLogout() {
    await logoutAction();
    router.refresh();
  }

  // --- ESTADO 1: USUÁRIO LOGADO ---
  if (currentUser) {
    return (
      <div className="flex items-center gap-3 animate-in fade-in duration-300">
        <div className="text-right hidden sm:block leading-tight">
          <p className="text-sm font-bold">{currentUser.name}</p>
          <p className="text-xs text-indigo-200">Rota: {currentUser.route_number}</p>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center p-2 bg-indigo-800 hover:bg-indigo-900 rounded-lg transition-colors text-white"
          title="Sair do sistema"
        >
          <SignOut size={20} weight="bold" />
        </button>
      </div>
    );
  }

  // --- ESTADO 2: USUÁRIO DESLOGADO (Botão + Modal) ---
  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="hover:text-indigo-200 transition-colors flex items-center p-1"
        aria-label="Abrir Login"
      >
        <UserCircle size={32} weight="fill" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
          />

          <div className="relative bg-white text-gray-800 rounded-xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in duration-200">
            
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-indigo-700">Acesso Motorista</h2>
              <p className="text-sm text-gray-500">Identifique-se para iniciar a rota</p>
            </div>

            {/* O atributo action conecta diretamente com a Server Action */}
            <form action={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Login</label>
                <input 
                  name="login"
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Ex: 108"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <input 
                  name="password"
                  type="password" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Ex: 108"
                  required
                />
                {/* versão de testes apenas com senha simples e placeholder indicativo */}
              </div>

              {error && (
                <div className="p-2 bg-red-50 text-red-600 text-sm rounded-lg text-center border border-red-100">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg transition-colors shadow-lg shadow-indigo-200"
              >
                Entrar no Sistema
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}