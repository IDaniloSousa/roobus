// src/app/sobre-o-aplicativo/page.tsx
'use client';

import { useState } from 'react';
import {
  CaretDown,
  ThumbsUp,
  ThumbsDown,
  PaperPlaneTilt,
  Info,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  Bus,
  Heart,
} from '@phosphor-icons/react';
import Header from '@/components/Header'; // Importando nosso Header reutilizável

export default function Sobre() {
  return (
    <>
      <Header title="Sobre o Aplicativo" showBackButton />
      <main className="bg-gray-50 min-h-screen px-8 py-10 flex justify-center">
        <div className="w-full max-w-5xl flex flex-col items-center gap-8">

          {/* Ícone + Título Central */}
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-6 rounded-full mb-4">
              <Bus size={60} color="white" weight="fill" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Transporte Público UFR</h1>
          </div>

          {/* Bloco Informativo 1 */}
          <div className="bg-white rounded-xl p-6 w-full shadow-md flex gap-5">
            <div className="mt-1">
              <ShieldCheck size={40} className="text-purple-500" weight="fill" />
            </div>
            <div>
              <h2 className="font-semibold text-lg text-gray-800 mb-1">Desenvolvido pela UFR</h2>
              <p className="text-gray-700 text-justify leading-relaxed">
                Desenvolvido pela <strong>Universidade Federal de Rondonópolis (UFR)</strong>, este aplicativo facilita o acesso
                a informações sobre o transporte público municipal. A plataforma permite a consulta de todas as linhas de
                ônibus da cidade, exibindo horários, itinerários e a localização dos veículos em tempo real.
              </p>
            </div>
          </div>

          {/* Funcionalidades */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <div className="bg-white rounded-xl p-5 shadow-md flex gap-4">
              <MapPin size={32} className="text-teal-500" />
              <div>
                <p className="font-semibold text-gray-800">Localização em Tempo Real</p>
                <p className="text-sm text-gray-600">Acompanhe os ônibus ao vivo</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-md flex gap-4">
              <Clock size={32} className="text-orange-500" />
              <div>
                <p className="font-semibold text-gray-800">Horários e Itinerários</p>
                <p className="text-sm text-gray-600">Consulte todas as linhas disponíveis</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-md flex gap-4">
              <Calendar size={32} className="text-violet-500" />
              <div>
                <p className="font-semibold text-gray-800">Planejamento de Viagem</p>
                <p className="text-sm text-gray-600">Organize seus deslocamentos</p>
              </div>
            </div>
          </div>

          {/* Bloco Informativo 2 */}
          <div className="bg-white rounded-xl p-6 w-full shadow-md flex gap-5">
            <ShieldCheck size={40} className="text-emerald-500" weight="fill" />
            <div>
              <h2 className="font-semibold text-lg text-gray-800 mb-1">Gratuito e Oficial</h2>
              <p className="text-gray-700 text-justify leading-relaxed">
                Disponibilizado gratuitamente pela <strong>Universidade Federal de Rondonópolis (UFR)</strong>,
                o aplicativo auxilia os cidadãos no planejamento de seus deslocamentos, reduzindo a incerteza causada
                por atrasos e garantindo informações precisas sobre a chegada dos ônibus.
              </p>
            </div>
          </div>

          {/* Banner Final */}
          <div className="bg-gradient-to-r from-teal-400 to-indigo-500 rounded-xl p-6 w-full text-center text-white shadow-md mt-4">
            <Heart size={32} weight="fill" className="mx-auto mb-2" />
            <p className="font-bold text-xl">Transporte Público Inteligente</p>
            <p className="text-sm mt-1">Conectando você ao futuro da mobilidade urbana em Rondonópolis</p>
          </div>
        </div>
      </main>
    </>
  );
}
