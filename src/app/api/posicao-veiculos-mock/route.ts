// src/app/api/posicao-veiculos-mock/route.ts
import { NextResponse } from 'next/server';

/**
 * Tipo para representar a posição de um veículo.
 */
type PosicaoVeiculo = {
  id: string; // ID único do veículo (ex: prefixo)
  linha: string; // Linha que o veículo está operando
  lat: number; // Latitude
  lng: number; // Longitude
  sentido: 'BAIRRO → CENTRO' | 'CENTRO → BAIRRO' | 'CIRCULAR';
  timestamp: string; // Data/hora da última atualização
};

/**
 * Dados estáticos para simular a API de veículos.
 *
 * Baseei as coordenadas próximas às paradas de exemplo em 'src/app/(main)/mapa/page.tsx'
 * e os números das linhas em 'prisma/seed.ts' (ex: 108, 211) para manter a consistência.
 */
const mockData: PosicaoVeiculo[] = [
  {
    id: 'V001',
    linha: '108', // Linha "Carlos Bezerra"
    lat: -23.551,
    lng: -46.634,
    sentido: 'BAIRRO → CENTRO',
    timestamp: new Date(Date.now() - 30 * 1000).toISOString(), // 30 segundos atrás
  },
  {
    id: 'V002',
    linha: '211', // Linha "Atlantico via Cidade de Deus"
    lat: -23.5495,
    lng: -46.632,
    sentido: 'CENTRO → BAIRRO',
    timestamp: new Date(Date.now() - 60 * 1000).toISOString(), // 1 minuto atrás
  },
  {
    id: 'V003',
    linha: '101', // Linha "Cidade Alta"
    lat: -23.5525,
    lng: -46.6315,
    sentido: 'BAIRRO → CENTRO',
    timestamp: new Date(Date.now() - 15 * 1000).toISOString(), // 15 segundos atrás
  },
  {
    id: 'V004',
    linha: '108', // Outro ônibus na Linha "Carlos Bezerra"
    lat: -23.56,
    lng: -46.65,
    sentido: 'CENTRO → BAIRRO',
    timestamp: new Date(Date.now() - 120 * 1000).toISOString(), // 2 minutos atrás
  },
];

/**
 * Handler GET para a API mock de posição de veículos.
 */
export async function GET(request: Request) {
  try {
    // Em uma API real, aqui você buscaria os dados de uma fonte externa ou do cache.
    // Para este mock, apenas retornamos os dados estáticos.

    // Atualiza os timestamps para parecerem "em tempo real" a cada requisição
    const dadosAtualizados = mockData.map((veiculo, index) => ({
      ...veiculo,
      // Simula pequenas variações de tempo
      timestamp: new Date(Date.now() - (30 + index * 15) * 1000).toISOString(),
    }));

    return NextResponse.json(dadosAtualizados, { status: 200 });
  } catch (error) {
    console.error('Erro no endpoint mock de posição de veículos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 },
    );
  }
}