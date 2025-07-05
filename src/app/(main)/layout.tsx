// src/app/(main)/layout.tsx

import Navbar from '@/components/Navbar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Container principal que agora controla o layout da tela inteira
    <div className="flex flex-col min-h-screen">
      
      {/* A tag <main> agora cresce para ocupar todo o espaço disponível,
        empurrando a Navbar para o final da tela.
      */}
      <main className="flex-grow bg-gray-50">
        {children}
      </main>
      
      {/* A Navbar é o último item do flex container, posicionando-se no fundo */}
      <Navbar />
    </div>
  );
}