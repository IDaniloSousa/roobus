// src/components/LoginModal.tsx
'use client'
import { useState } from 'react'
import { X } from '@phosphor-icons/react' // Importe um ícone de fechar

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      })
      if (res.ok) {
        window.location.reload() // Recarrega após login
      } else {
        setError('Credenciais inválidas')
      }
    } catch (err) {
      setError('Erro no servidor')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-xl font-bold mb-4">Acesse sua conta</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campos do formulário */}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md">
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}
