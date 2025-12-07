import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma'; // Certifique-se que o caminho do prisma está correto

// --- FUNÇÃO GET: Busca o histórico do usuário ---
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
        // Inclui os dados do itinerário para exibir no card
        itinerario: {
          select: {
            id: true,
            linha: true,
            descricao: true,
          },
        },
      },
      orderBy: {
        // Ordena pelas mais recentes (última visualização primeiro)
        updatedAt: 'desc',
      },
      take: 6, // Limita aos 6 resultados mais recentes
    });

    // 3. Formata os dados para retornar apenas a lista de itinerários
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

// --- FUNÇÃO POST: Salva/Atualiza uma linha no histórico ---
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
        { error: 'Tipos de dados inválidos: anonymous_user_id deve ser string e itinerario_id deve ser number.' },
        { status: 400 },
      );
    }

    // 2. Lógica de Upsert (Inserir ou Atualizar)
    // Se já existe, atualiza o updatedAt (trazendo pro topo). Se não, cria.
    const linhaRecente = await prisma.linhas_recentes.upsert({
      where: {
        // Usa o índice único composto definido no schema.prisma
        UserRecentLineUnique: {
          anonymous_user_id: anonymous_user_id,
          itinerario_id: itinerario_id,
        },
      },
      update: {
        // Ao atualizar, o campo updatedAt é atualizado automaticamente pelo Prisma
        obs: 'visualizado novamente', 
      },
      create: {
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