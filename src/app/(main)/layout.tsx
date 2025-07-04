// src/app/(main)/layout.tsx
import Navbar from '@/components/Navbar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // O div extra com padding-bottom garante que o conteúdo da página
    // não seja coberto pela Navbar fixa. `pb-20` é uma boa base.
    <div className="pb-20">
      {/* '{children}' é onde o conteúdo da sua página (page.tsx) será renderizado */}
      <main>{children}</main>

      {/* A Navbar é renderizada aqui, fora do conteúdo principal da página */}
      <Navbar />
    </div>
  );
}