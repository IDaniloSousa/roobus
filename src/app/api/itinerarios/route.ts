// src/app/api/itinerarios/route.ts
import prisma from '../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Busca todos os itinerários, ordenando pelo número da linha
    const itinerarios = await prisma.itinerarios.findMany({
      orderBy: {
        linha: 'asc',
      },
      // 👇 MODIFICAÇÃO IMPORTANTE:
      // Incluímos os traçados (route_shapes) relacionados
      include: {
        route_shapes: {
          // Selecionamos apenas o campo 'sentido'
          select: {
            sentido: true,
          },
        },
      },
    });

    // Retorna os dados em formato JSON com status de sucesso
    return NextResponse.json(itinerarios, { status: 200 });

  } catch (error) {
    console.error('Erro ao buscar itinerários:', error);
    // Em caso de erro, retorna uma mensagem de erro com status de erro do servidor
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}