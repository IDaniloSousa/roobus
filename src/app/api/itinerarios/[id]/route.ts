import prisma from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID da linha é inválido.' }, { status: 400 });
    }

    const itinerario = await prisma.itinerarios.findUnique({
      where: { id },
      include: {
        // Inclui os horários relacionados a este itinerário na resposta
        horarios: true, 
      },
    });

    if (!itinerario) {
      return NextResponse.json({ error: 'Itinerário não encontrado.' }, { status: 404 });
    }

    return NextResponse.json(itinerario, { status: 200 });

  } catch (error) {
    console.error('Erro ao buscar detalhes do itinerário:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
