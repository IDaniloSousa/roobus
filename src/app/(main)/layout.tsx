// src/app/(main)/layout.tsx

import Navbar from '@/components/Navbar';
import Header from '@/components/Header'; // 1. Importe o novo componente

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">

      {/* 2. Adicione o Header aqui, passando um título padrão */}
      <Header title="RooBus" />

      <main className="flex-grow bg-gray-50">
        {children}
      </main>

      <Navbar />
    </div>
  );
}