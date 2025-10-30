///route.ts]
import prisma from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  _context: { params: { id: string } } 
) {
  try {
    // 1. Criamos a URL a partir do request
    const url = new URL(request.url); 
    // 2. Pegamos o pathname: /api/itinerarios/X
    const pathParts = url.pathname.split('/');
    // 3. Pegamos a última parte: "X"
    const idString = pathParts[pathParts.length - 1];
    
    // 4. Usamos o idString em vez de params.id
    const id = parseInt(idString, 10);

    if (isNaN(id)) {
      // Usamos o idString para o erro, caso não seja um número
      return NextResponse.json({ error: `ID da linha é inválido: ${idString}` }, { status: 400 });
    }

    const itinerario = await prisma.itinerarios.findUnique({
      where: { id },
      include: {
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