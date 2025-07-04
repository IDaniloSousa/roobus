// src/app/page.tsx

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Bem-vindo ao Roobus
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Esta é a sua página inicial.
        </p>
        <div className="flex justify-center gap-4">
            <Link href="/login" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                Ir para Login
            </Link>
            <Link href="/cadastro" className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors">
                Ir para Cadastro
            </Link>
        </div>
      </div>
    </main>
  );
}