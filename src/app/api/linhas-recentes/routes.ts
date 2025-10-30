import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { itinerario_id, anonymous_user_id } = body;

    // 1. Validação de entrada
    if (!itinerario_id || !anonymous_user_id) {
      return NextResponse.json({ error: 'itinerario_id e anonymous_user_id são obrigatórios' }, { status: 400 });
    }

    if (typeof anonymous_user_id !== 'string' || typeof itinerario_id !== 'number') {
        return NextResponse.json({ error: 'Tipos de dados inválidos' }, { status: 400 });
    }

    // 2. Lógica de Upsert
    const linhaRecente = await prisma.linhas_recentes.upsert({
      where: {
        // Onde encontrar o registro (com base no índice único)
        UserRecentLineUnique: {
          anonymous_user_id: anonymous_user_id,
          itinerario_id: itinerario_id,
        }
      },
      update: {
        // Se encontrar, apenas atualiza o `updatedAt` (automaticamente pelo Prisma)
        obs: "visualizado novamente"
      },
      create: {
        // Se não encontrar, cria um novo registro
        anonymous_user_id: anonymous_user_id,
        itinerario_id: itinerario_id,
        obs: "primeira visualização"
      },
    });

    return NextResponse.json(linhaRecente, { status: 200 });

  } catch (error) {
    console.error('Erro ao salvar linha recente:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}