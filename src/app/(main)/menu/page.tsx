// src/app/(main)/menu/page.tsx
'use client';

import Link from 'next/link';
import {
  UserCircle,
  CaretRight,
  SignOut,
  Question,
  ShieldCheck,
  Phone,
  Info,
} from '@phosphor-icons/react';

export default function MenuPage() {
  // Ação de placeholder para o botão de sair
  const handleSignOut = () => {
    // Em uma aplicação real, aqui você chamaria a lógica para
    // limpar o token de sessão e redirecionar para a tela de login.
    alert('Lógica de Logout a ser implementada!');
    // router.push('/login');
  };

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
    { href: '/sobre', icon: Info, label: 'Sobre o Aplicativo' },
  ];

  return (
    // O layout já fornece o fundo cinza. O padding geral é adicionado aqui.
    <div className="p-4 space-y-8">
      
      {/* --- Seção de Perfil do Usuário --- */}
      <section>
        <Link href="/perfil" className="flex items-center gap-4 group">
          <UserCircle size={64} weight="light" className="text-gray-700 flex-shrink-0" />
          <div className="flex-grow">
            {/* Utilizando seu nome para personalizar a tela */}
            <h2 className="text-xl font-bold text-gray-900">Danilo de Sousa</h2>
            <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors">
              Ver Mais Informações
            </p>
          </div>
          <CaretRight size={20} className="text-gray-400" />
        </Link>
      </section>

      {/* --- Seção de Ações (Sair) --- */}
      <section>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          <SignOut size={20} />
          Sair
        </button>
      </section>

      {/* --- Seção de Suporte --- */}
      <section>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
          Suporte
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