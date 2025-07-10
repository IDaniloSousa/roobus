// src/components/LoginModal.tsx
'use client'
import { useState } from 'react'
import { X, ArrowRight } from '@phosphor-icons/react'

type LoginModalProps = {
  onClose: () => void;
  onSwitchToCadastro: () => void;
};

export default function LoginModal({ onClose, onSwitchToCadastro }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Credenciais inválidas');
      }

      // Fecha o modal após login bem-sucedido
      onClose();
      window.location.reload(); // Atualiza o estado de autenticação
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro no servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full relative mx-4">
        {/* Botão de fechar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          disabled={isLoading}
        >
          <X size={24} />
        </button>

        {/* Cabeçalho */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Acesse sua conta</h2>
          <p className="text-gray-600 mt-1">Informe seus dados para entrar</p>
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 flex items-start gap-2">
            <span className="flex-1 text-sm">{error}</span>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="seu@email.com"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                'Carregando...'
              ) : (
                <>
                  Entrar <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Rodapé com link para cadastro */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Não tem uma conta?{' '}
          <button
            type="button"
            onClick={() => {
              onClose()
              onSwitchToCadastro()
            }}
            className="text-blue-600 hover:underline font-medium"
            disabled={isLoading}
          >
            Cadastre-se
          </button>
        </div>
      </div>
    </div>
  )
}