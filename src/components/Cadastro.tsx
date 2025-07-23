// src/components/CadastroModal.tsx
'use client'
import { useState } from 'react'
import { X } from '@phosphor-icons/react' // Importe um ícone de fechar

export default function CadastroModal({ onClose, onSwitchToLogin }: { 
    onClose: () => void 
    onSwitchToLogin: () => void
}) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

 // Validações
    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem')
      return
    }

    try {
      const res = await fetch('/api/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      })

      if (res.ok) {
        onClose()
      } else {
        const errorData = await res.json()
        setError(errorData.error || 'Erro no cadastro')  
      }
    } catch {
        setError('Erro ao conectar com o servidor')
    }
}

return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500">
          <X size={24} />
        </button>
        
        <h2 className="text-xl font-bold mb-4">Criar conta</h2>
        
        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome completo</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full p-2 border rounded"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirmar senha</label>
            <input
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Cadastrar
          </button>

          <div className="text-center text-sm mt-4">
            Já tem uma conta?{' '}
            <button 
              type="button"
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:underline"
            >
              Faça login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}