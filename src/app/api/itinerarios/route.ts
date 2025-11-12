// src/app/api/itinerarios/route.ts
import prisma from '../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parâmetros de paginação com valores padrão
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;

    // Calcula quantos registros deve pular antes de começar a listar
    const skip = (page - 1) * limit;

    // Busca os itinerários da página atual
    const [itinerarios, total] = await Promise.all([
      prisma.itinerarios.findMany({
        skip,
        take: limit,
        orderBy: { linha: 'asc' },
        include: {
          route_shapes: {
            select: {
              sentido: true,
            },
          },
        },
      }),
      prisma.itinerarios.count(), // total de registros no banco
    ]);

    // Retorna dados paginados e informações extras
    return NextResponse.json(
      {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        data: itinerarios,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erro ao buscar itinerários:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}