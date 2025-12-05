// src/app/api/itinerarios/route.ts
import prisma from '../../lib/prisma'; //
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || ''; // Captura o termo de busca

    const skip = (page - 1) * limit;

    // Constrói o filtro dinamicamente
    const whereClause: Prisma.itinerariosWhereInput = search
      ? {
          OR: [
            { linha: { contains: search, mode: 'insensitive' } },
            { descricao: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    // Busca com filtro e paginação
    const [itinerarios, total] = await Promise.all([
      prisma.itinerarios.findMany({
        skip,
        take: limit,
        where: whereClause, // Aplica o filtro
        orderBy: { linha: 'asc' },
        include: {
          route_shapes: {
            select: {
              sentido: true,
            },
          },
        },
      }),
      prisma.itinerarios.count({ where: whereClause }), // Conta apenas os filtrados
    ]);

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