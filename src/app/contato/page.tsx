// src/app/contato/page.tsx
'use client';

import { useState } from 'react';
import {
  Phone, EnvelopeSimple, Info,
  Clock
} from '@phosphor-icons/react';
import Header from '@/components/Header'; // Importando nosso Header reutilizável

export default function Contato() {
  return (
    <>
      <Header title="Contato" showBackButton={true} />

      <main className="min-h-screen bg-gray-50 p-6 flex justify-center">
        <div className="w-full max-w-3xl space-y-6">

          {/* Cartão de Informações */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Informações de Contato</h2>
            <div className="flex items-start gap-4 mb-2">
              <Phone className="text-indigo-600" size={24} />
              <p><strong>Telefone:</strong> (66) 3421-3452</p>
            </div>
            <div className="flex items-start gap-4 mb-2">
              <EnvelopeSimple className="text-indigo-600" size={24} />
              <p><strong>Email:</strong> amtcapp@contato.com.br</p>
            </div>
            <div className="flex items-start gap-4">
              <Clock className="text-indigo-600" size={24} />
              <p><strong>Horário de Atendimento:</strong> Segunda a Sexta, das 08h às 17h</p>
            </div>
          </div>

          {/* Formulário de Contato */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Envie uma Mensagem</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Seu nome"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="email"
                placeholder="Seu email"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <textarea
                placeholder="Digite sua mensagem..."
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 h-32 resize-none"
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
