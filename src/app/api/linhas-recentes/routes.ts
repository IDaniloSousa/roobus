// src/app/api/linhas-recentes/routes.ts
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma'; //

// --- FUNÇÃO GET (Nova) ---
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const anonymous_user_id = searchParams.get('userId');

    // 1. Validação de entrada
    if (!anonymous_user_id || typeof anonymous_user_id !== 'string') {
      return NextResponse.json(
        { error: 'O parâmetro "userId" é obrigatório e deve ser uma string.' },
        { status: 400 },
      );
    }

    // 2. Busca no banco de dados
    const linhasRecentes = await prisma.linhas_recentes.findMany({
      where: {
        anonymous_user_id: anonymous_user_id,
      },
      include: {
        // Inclui os dados do itinerário (linha, descrição)
        itinerario: {
          select: {
            id: true,
            linha: true,
            descricao: true,
          },
        },
      },
      orderBy: {
        // Ordena pelas mais recentes (última visualização)
        updatedAt: 'desc',
      },
      take: 6, // Limita aos 6 resultados mais recentes
    });

    // 3. Retorna os dados
    // Mapeia para retornar apenas os dados do itinerário,
    // que é o que o front-end provavelmente precisa.
    const itinerarios = linhasRecentes.map((recente) => recente.itinerario);

    return NextResponse.json(itinerarios, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar linhas recentes:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}

// --- FUNÇÃO POST (Existente) ---
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { itinerario_id, anonymous_user_id } = body;

    // 1. Validação de entrada
    if (!itinerario_id || !anonymous_user_id) {
      return NextResponse.json(
        { error: 'itinerario_id e anonymous_user_id são obrigatórios' },
        { status: 400 },
      );
    }

    if (
      typeof anonymous_user_id !== 'string' ||
      typeof itinerario_id !== 'number'
    ) {
      return NextResponse.json(
        { error: 'Tipos de dados inválidos' },
        { status: 400 },
      );
    }

    // 2. Lógica de Upsert
    const linhaRecente = await prisma.linhas_recentes.upsert({
      where: {
        // Onde encontrar o registro (com base no índice único do schema)
        UserRecentLineUnique: {
          anonymous_user_id: anonymous_user_id,
          itinerario_id: itinerario_id,
        },
      },
      update: {
        // Se encontrar, apenas atualiza o `updatedAt` (automaticamente pelo Prisma)
        obs: 'visualizado novamente',
      },
      create: {
        // Se não encontrar, cria um novo registro
        anonymous_user_id: anonymous_user_id,
        itinerario_id: itinerario_id,
        obs: 'primeira visualização',
      },
    });

    return NextResponse.json(linhaRecente, { status: 200 });
  } catch (error) {
    console.error('Erro ao salvar linha recente:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}