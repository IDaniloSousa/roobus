// src/app/(main)/menu/page.tsx
'use client';

import Link from 'next/link';
import {
  CaretRight,
  Question,
  ShieldCheck,
  Phone,
  Info,
} from '@phosphor-icons/react';

export default function MenuPage() {
  // Dados para os links de suporte, facilitando a renderização
  const supportLinks = [
    {
      href: '/perguntas-frequentes',
      icon: Question,
      label: 'Perguntas Frequentes',
    },
    {
      href: '/privacidade',
      icon: ShieldCheck,
      label: 'Privacidade e Segurança',
    },
    { href: '/contato', icon: Phone, label: 'Contato' },
    { href: '/sobre-o-aplicativo', icon: Info, label: 'Sobre o Aplicativo' },
  ];

  return (
    // O padding geral foi mantido e o espaçamento ajustado para 'space-y-6'
    <div className="p-4 space-y-6">
      
      {/* --- Seção de Suporte --- */}
      <section>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
          Suporte e Informações
        </h3>
        <div className="bg-white border border-gray-200 rounded-lg">
          {supportLinks.map((link, index) => (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center gap-4 p-4 w-full text-left transition-colors hover:bg-gray-50 ${
                // Adiciona uma borda entre os itens, exceto no último
                index < supportLinks.length - 1 ? 'border-b border-gray-200' : ''
              }`}
            >
              <link.icon size={24} className="text-gray-600" />
              <span className="flex-grow font-medium text-gray-800">
                {link.label}
              </span>
              <CaretRight size={20} className="text-gray-400" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}