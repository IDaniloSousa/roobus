// src/app/(main)/layout.tsx

import Navbar from '@/components/Navbar';
import Header from '@/components/Header'; // 1. Importe o novo componente
import Login from '@/components/Login';
import { getLoggedUser } from '@/app/actions/auth';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getLoggedUser();

  return (
    <div className="flex flex-col min-h-screen">

      {/* 2. Adicione o Header aqui, passando um título padrão */}
      <Header title="RooBus">
        <Login currentUser={user} />
      </Header>

      <main className="flex-grow bg-gray-50">
        {children}
      </main>

      <Navbar />
    </div>
  );
}