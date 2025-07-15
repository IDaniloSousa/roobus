// src/app/mapa/page.tsx
import MapLoader from '@/components/MapLoader';
import Navbar from '@/components/Navbar';

// O Header que apareceu na sua última imagem.
function Header() {
  return (
    <header className="flex-shrink-0 bg-blue-600 text-white flex items-center justify-center h-16 shadow-md z-20">
      <h1 className="text-2xl font-bold">RooBus</h1>
    </header>
  );
}

export default function MapaPage() {
  const exampleStops = [
    { id: 1, name: 'Parada da Sé', lat: -23.5505, lng: -46.6333 },
    { id: 2, name: 'Parada da Paulista', lat: -23.5613, lng: -46.6565 },
  ];

  return (
    // 1. O CONTAINER "VIEWPORT-LOCK" - A SOLUÇÃO DEFINITIVA
    // - `fixed inset-0`: Esta é a mudança crucial. Ele fixa o container na tela,
    //   ignorando qualquer outra coisa na página. `inset-0` é o mesmo que top/right/bottom/left: 0.
    //   Isso cria uma "tela em branco" do tamanho exato da viewport.
    // - `flex flex-col`: Dentro desta tela, organizamos nosso conteúdo em uma coluna.
    <div className="fixed inset-0 flex flex-col">
      
      {/* 2. O CABEÇALHO */}
      <Header />

      {/* 3. A ÁREA DO MAPA */}
      {/* 'flex-1' faz o mapa ocupar todo o espaço que sobrar. */}
      {/* 'relative z-0' para a camada de baixo. */}
      <main className="flex-1 relative z-0">
        <MapLoader stops={exampleStops} />
      </main>

      {/* 4. O RODAPÉ (Navbar) */}
      {/* 'flex-shrink-0' para não encolher e 'z-10' para ficar na frente. */}
      <div className="flex-shrink-0 relative z-10 bg-white shadow-t">
        <Navbar />
      </div>

    </div>
  );
}