// src/app/(main)/layout.tsx
import Navbar from '@/components/Navbar';
import Header from '@/components/Header';
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

      {/* Header com o componente de Login integrado */}
      <Header title="RooBus">
        <Login currentUser={user} />
      </Header>

      {/* 👇 AQUI: Trocado 'flex-grow' por 'grow' */}
      <main className="grow bg-gray-50">
        {children}
      </main>

      <Navbar />
    </div>
  );
}