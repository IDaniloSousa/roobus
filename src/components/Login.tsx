// src\components\Login.tsx
'use client';

import { useState } from 'react';
import { UserCircle, X, SignOut, Bus, User as UserIcon } from '@phosphor-icons/react';
import { loginAction, registerAction, logoutAction } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';

type User = {
  id: number;
  name: string;
  route_number: number | null;
  role: string;
} | null;

export default function Login({ currentUser }: { currentUser: User }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setError('');
    
    const action = isRegister ? registerAction : loginAction;
    const result = await action(formData);

    if (result.success) {
      setIsOpen(false);
      setIsRegister(false); // Reseta para login na próxima vez
      router.refresh();
    } else {
      setError(result.message || 'Ocorreu um erro');
    }
  }

  // Função de logout
  async function handleLogout() {
    await logoutAction();
    router.refresh();
  }

  // --- ESTADO 1: USUÁRIO LOGADO ---
  if (currentUser) {
    const isDriver = currentUser.role === 'DRIVER';
    return (
      <div className="flex items-center gap-3 animate-in fade-in duration-300">
        <div className="text-right hidden sm:block leading-tight">
          <p className="text-sm font-bold flex items-center justify-end gap-1">
            {currentUser.name}
            {isDriver ? <Bus size={14} className="text-yellow-400" /> : <UserIcon size={14} className="text-blue-300" />}
          </p>
          {isDriver ? (
             <p className="text-xs text-yellow-300">Motorista Rota {currentUser.route_number}</p>
          ) : (
             <p className="text-xs text-indigo-200">Passageiro</p>
          )}
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
            onClick={() => { setIsOpen(false); setIsRegister(false); setError(''); }}
          />

          <div className="relative bg-white text-gray-800 rounded-xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in duration-200">
            
            <button 
              onClick={() => { setIsOpen(false); setIsRegister(false); setError(''); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-indigo-700">
                {isRegister ? 'Criar Conta' : 'Acesso RooBus'}
              </h2>
              <p className="text-sm text-gray-500">
                {isRegister ? 'Cadastre-se para acompanhar as rotas' : 'Entre na sua conta'}
              </p>
            </div>

            <form action={handleSubmit} className="space-y-4">
              
              {/* Campo Nome só aparece no Cadastro */}
              {isRegister && (
                <div className="animate-in slide-in-from-top-2 duration-200">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                  <input 
                    name="name"
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Seu nome"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Login / Email</label>
                <input 
                  name="login"
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <input 
                  name="password"
                  type="password" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
                {isRegister ? 'Cadastrar' : 'Entrar'}
              </button>
            </form>

            {/* Link para alternar */}
            <div className="mt-4 text-center text-sm">
              <span className="text-gray-500">
                {isRegister ? 'Já tem conta? ' : 'Não tem conta? '}
              </span>
              <button 
                type="button"
                onClick={() => { setIsRegister(!isRegister); setError(''); }}
                className="text-indigo-600 font-bold hover:underline"
              >
                {isRegister ? 'Fazer Login' : 'Cadastre-se'}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}