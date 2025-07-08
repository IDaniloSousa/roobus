// src/app/sobre-o-aplicativo/page.tsx
'use client';

import { useState } from 'react';
import {
  CaretDown,
  ThumbsUp,
  ThumbsDown,
  PaperPlaneTilt,
} from '@phosphor-icons/react';
import Header from '@/components/Header'; // Importando nosso Header reutilizável

export default function Sobre() {
  return (

        <><Header title="Sobre o Aplicativo" showBackButton={true} />
    <main className="min-h-screen bg-white p-6 flex items-start justify-center">
      <div className="max-w-md w-full bg-white p-4 rounded-lg">
        <h1 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>ℹ️</span>
          Sobre o Aplicativo
        </h1>
        <p className="text-gray-800 text-justify mb-4">
          Desenvolvido pela Universidade Federal de Rondonópolis (UFR), este aplicativo facilita o acesso
          a informações sobre o transporte público municipal. A plataforma permite a consulta de todas as
          linhas de ônibus da cidade, exibindo horários, itinerários e a localização dos veículos em tempo real.
        </p>
        <p className="text-gray-800 text-justify">
          Disponibilizado gratuitamente pela Autarquia Municipal de Transporte Coletivo, o aplicativo auxilia os
          cidadãos no planejamento de seus deslocamentos, reduzindo a incerteza causada por atrasos e garantindo
          informações precisas sobre a chegada dos ônibus.
        </p>
      </div>
    </main></>
      
  );
}