// src/components/Navbar.tsx
'use client'; // Este componente precisa ser um Client Component para usar hooks

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Hook para saber a rota atual
import { House, MagnifyingGlass, MapTrifold, List } from '@phosphor-icons/react'; // Ícones excelentes e leves

// Definindo a estrutura de um item da navegação
const navItems = [
  { href: '/', label: 'Home', icon: House },
  { href: '/busca', label: 'Busca', icon: MagnifyingGlass },
  { href: '/mapa', label: 'Mapa', icon: MapTrifold },
  { href: '/menu', label: 'Menu', icon: List },
];

export default function Navbar() {
  const pathname = usePathname(); // Pega a URL atual (ex: "/busca")

  return (
    // A tag <nav> é semanticamente correta para navegação.
    // As classes abaixo criam uma barra fixa na parte inferior da tela, ideal para mobile.
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-1px_4px_rgba(0,0,0,0.1)]">
      <div className="flex justify-around max-w-screen-sm mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}
              // Lógica de Estilo:
              // - Se o link estiver ativo (isActive), a cor do texto será 'text-blue-600'.
              // - Caso contrário, será 'text-gray-500'.
              className={`flex flex-col items-center justify-center w-full py-3 transition-colors duration-200 ${
                isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'
              }`}
            >
              <Icon size={24} weight={isActive ? 'fill' : 'regular'} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
