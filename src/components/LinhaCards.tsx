// src/components/LinhaCard.tsx
'use client';

import { Bus, Clock, MapPin } from '@phosphor-icons/react';

// Usamos 'type' para definir as diferentes variantes do card
export type CardVariant = 
  | { type: 'proxima', tempoEstimado: number, status: 'Pontual' | 'Atrasado' }
  | { type: 'historico', ultimoLocal: string }
  | { type: 'busca' }; // Variante genérica para tela de busca

type LinhaCardProps = {
  linha: string;
  nome: string;
  variant: CardVariant;
};

export default function LinhaCard({ linha, nome, variant }: LinhaCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
      <Bus size={28} className="text-gray-600 flex-shrink-0" />
      
      <div className="flex-grow">
        <p className="font-bold text-gray-900">{linha} - {nome}</p>
        
        {/* Renderização condicional baseada na variante do card */}
        {variant.type === 'proxima' && (
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock size={16} />
            <span>{variant.tempoEstimado} min</span>
          </div>
        )}

        {variant.type === 'historico' && (
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <MapPin size={16} />
            <span>{variant.ultimoLocal}</span>
          </div>
        )}
      </div>

      {/* Renderiza o status apenas para a variante 'proxima' */}
      {variant.type === 'proxima' && (
        <span className={`px-3 py-1 text-xs font-bold text-white rounded-full ${
            variant.status === 'Pontual' ? 'bg-green-500' : 'bg-red-600'
          }`}>
          {variant.status}
        </span>
      )}
    </div>
  );
}