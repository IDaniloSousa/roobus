// src/app/contato/page.tsx
'use client';

import { Phone, EnvelopeSimple, Clock } from '@phosphor-icons/react';
import Header from '@/components/Header';

export default function Contato() {
  return (
    <>
      <Header title="Contato" showBackButton={true} />

      <main className="min-h-screen bg-gray-100 p-6 flex justify-center">
        <div className="w-full max-w-3xl space-y-6">

          {/* Cartão de Informações */}
          <div className="bg-white p-6 rounded-2xl shadow-lg text-gray-900">
            <h2 className="text-2xl font-bold mb-4">Informações de Contato</h2>
            <div className="flex items-start gap-4 mb-3">
              <Phone className="text-indigo-700" size={26} />
              <p><strong>Telefone:</strong> (66) 3421-3452</p>
            </div>
            <div className="flex items-start gap-4 mb-3">
              <EnvelopeSimple className="text-indigo-700" size={26} />
              <p><strong>Email:</strong> amtcapp@contato.com.br</p>
            </div>
            <div className="flex items-start gap-4">
              <Clock className="text-indigo-700" size={26} />
              <p><strong>Horário de Atendimento:</strong> Segunda a Sexta, das 08h às 17h</p>
            </div>
          </div>

          {/* Formulário de Contato */}
          <div className="bg-white p-6 rounded-2xl shadow-lg text-gray-900">
            <h2 className="text-2xl font-bold mb-4">Envie uma Mensagem</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Seu nome"
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="email"
                placeholder="Seu email"
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                placeholder="Digite sua mensagem..."
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32 resize-none"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                Enviar
              </button>
            </form>
          </div>

        </div>
      </main>
    </>
  );
}
