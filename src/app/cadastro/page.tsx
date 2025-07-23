// src/app/cadastro/page.tsx
'use client';

import { useState, useEffect } from 'react';
// Importações de next/navigation e next/link removidas para evitar erros de resolução
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// Importa o componente Header com caminho relativo
// Certifique-se de que este caminho está correto em relação ao seu arquivo Header.tsx
// Se o seu Header.tsx estiver em src/components/Header.tsx e este arquivo em src/app/cadastro/page.tsx,
// o caminho relativo correto seria '../../components/Header'.
// Se você tiver uma estrutura de pastas diferente (ex: src/app/(auth)/cadastro/page.tsx),
// o caminho pode precisar de mais ou menos '../'.
import Header from '../../components/Header';

// Ícones Phosphor removidos e substituídos por SVGs inline para evitar erros de resolução
// import { ArrowRight, Eye, EyeSlash, Check } from '@phosphor-icons/react';

export default function CadastroPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const router = useRouter(); // Removido para evitar erro de resolução

  // Verifica se já está logado
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null; // Verifica se window está definido
    if (token) {
      // Redireciona para a página principal
      window.location.href = '/';
    }
  }, []); // Dependência vazia para garantir que o efeito rode apenas uma vez

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validações
    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    if (senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro no cadastro');
      }

      setSuccess('Conta criada com sucesso! Redirecionando para o login...');

      // Redireciona para login após 2 segundos
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Erro ao conectar com o servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Usando uma div como elemento raiz em vez de um fragmento para maior compatibilidade em alguns ambientes
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Componente Header com título e botão de voltar */}
      <Header title="Criar Conta" showBackButton={true} />

      {/* Container principal da página, estilizado para preencher a tela e centralizar o conteúdo */}
      <main className="flex-grow p-6 flex justify-center items-center">
        {/* Cartão de conteúdo, com largura máxima e espaçamento vertical */}
        <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-2xl shadow-lg text-gray-900">

          {/* Título e subtítulo da seção de cadastro */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">RooBus</h1>
            <h2 className="text-xl font-semibold text-gray-700 mb-1">Criar Conta</h2>
            <p className="text-gray-600">Preencha os dados para começar</p>
          </div>

          {/* Mensagem de erro (condicional) */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Mensagem de sucesso (condicional) */}
          {success && (
            <div className="bg-indigo-50 border border-indigo-200 text-indigo-600 p-4 rounded-lg mb-6 flex items-center gap-2">
              {/* Ícone de check em SVG simplificado */}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <p className="text-sm">{success}</p>
            </div>
          )}

          {/* Formulário de Cadastro */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                Nome completo
              </label>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                placeholder="Seu nome completo"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                placeholder="seu@email.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors pr-12"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                  aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                >
                  {/* Ícone de olho em SVG simplificado */}
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar senha
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmarSenha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors pr-12"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                  aria-label={showConfirmPassword ? 'Esconder senha' : 'Mostrar senha'}
                >
                  {/* Ícone de olho em SVG simplificado */}
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  Criar conta {/* Ícone de seta em SVG simplificado */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Link para login */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Já tem uma conta?{' '}
              <a
                href="/login"
                className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors"
              >
                Faça login aqui
              </a>
            </p>
          </div>

          {/* Link para voltar */}
          <div className="mt-4 text-center">
            <a
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Voltar para o início
            </a>
          </div>

        </div>
      </main>
    </div>
  );
}