// src/components/Header.tsx
'use client';

import { ArrowLeft } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react'

// As propriedades que o nosso Header pode receber
type HeaderProps = {
  title: string;
  showBackButton?: boolean; // Nova propriedade opcional para controlar o botão
  children?: ReactNode;
};

export default function Header({ title, showBackButton = false, children }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="bg-indigo-700 text-white p-4 shadow-md sticky top-0 z-10 flex items-center justify-between">
      {/* O botão de voltar só é renderizado se showBackButton for true */}
      <div className="flex items-center gap-4">
        {showBackButton && (
          <button
          onClick={() => router.back()} // Função para voltar à página anterior
          className="p-1 rounded-full hover:bg-indigo-600 transition-colors"
          aria-label="Voltar para a página anterior"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        <h1 className="text-xl font-bold">{title}</h1>
      </div>

      {/* Grupo do botão de Login) */}
      <div>
        {children}
      </div>

    </header>
  );
}
