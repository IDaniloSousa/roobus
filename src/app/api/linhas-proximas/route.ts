// src/app/api/linhas-proximas/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { calculateDistance } from '@/utils/geo';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const latUser = parseFloat(searchParams.get('lat') || '');
    const lngUser = parseFloat(searchParams.get('lng') || '');

    if (isNaN(latUser) || isNaN(lngUser)) {
      return NextResponse.json({ error: 'Latitude e Longitude inválidas' }, { status: 400 });
    }

    // 1. Busca todas as linhas que possuem traçado (RouteShape)
    // Otimização futura: Usar PostGIS para filtrar direto no banco.
    // Por enquanto, faremos o cálculo em memória (funciona bem para < 100 linhas).
    const itinerarios = await prisma.itinerarios.findMany({
      include: {
        route_shapes: {
          select: { coordinates: true }
        }
      }
    });

    const linhasProximas = itinerarios.map((linha) => {
      let menorDistancia = Infinity;

      // 2. Itera sobre todos os traçados dessa linha (Ida/Volta)
      linha.route_shapes.forEach((shape) => {
        const coords = shape.coordinates as [number, number][]; // Casting do JSON
        
        if (Array.isArray(coords)) {
          // 3. Itera sobre cada ponto do traçado para achar o mais próximo do usuário
          // Otimização: Poderíamos pular índices (ex: checar a cada 5 pontos) para performance
          for (const [latPonto, lngPonto] of coords) {
            const dist = calculateDistance(latUser, lngUser, latPonto, lngPonto);
            if (dist < menorDistancia) {
              menorDistancia = dist;
            }
          }
        }
      });

      // Estimativa simples: Assumindo velocidade média de 30km/h
      // Tempo (min) = (Distancia (km) / Velocidade (km/h)) * 60
      const tempoEstimado = Math.ceil((menorDistancia / 30) * 60);

      return {
        id: linha.id,
        linha: linha.linha,
        nome: linha.descricao,
        distanciaKm: menorDistancia,
        tempoEstimado: tempoEstimado < 1 ? 1 : tempoEstimado, // Mínimo 1 min
        status: 'Pontual' as const // Mock por enquanto
      };
    })
    // 4. Filtra linhas muito longe (ex: > 2km) e ordena pela mais próxima
    .filter(item => item.distanciaKm < 2) 
    .sort((a, b) => a.distanciaKm - b.distanciaKm)
    .slice(0, 3); // Pega as top 3

    return NextResponse.json(linhasProximas, { status: 200 });

  } catch (error) {
    console.error('Erro ao calcular linhas próximas:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}