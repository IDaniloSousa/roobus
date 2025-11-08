// src/app/api/itinerarios/[id]/shape/route.ts
import prisma from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  _context: { params: { id: string } } // Ignoramos o context com '_'
) {
  try {
    const url = new URL(request.url);
    const sentido = url.searchParams.get('sentido');
    
    // --- INÍCIO DA CORREÇÃO DO BUG ---
    // O pathname será algo como: /api/itinerarios/61/shape
    const pathParts = url.pathname.split('/');
    // pathParts[0] = ''
    // pathParts[1] = 'api'
    // pathParts[2] = 'itinerarios'
    // pathParts[3] = '61'  <-- É quem queremos!
    // pathParts[4] = 'shape'
    
    const idString = pathParts[3]; 
    const id = parseInt(idString, 10);
    // --- FIM DA CORREÇÃO DO BUG ---
    
    if (isNaN(id)) {
      return NextResponse.json({ error: `ID da linha é inválido: ${idString}` }, { status: 400 });
    }
    if (!sentido) {
      return NextResponse.json({ error: 'O parâmetro "sentido" é obrigatório.' }, { status: 400 });
    }

    const shape = await prisma.routeShape.findFirst({
      where: {
        itinerario_id: id,
        sentido: sentido,
      },
      select: {
        coordinates: true,
        startPoint: true,
        endPoint: true
      }
    });

    if (!shape) {
      return NextResponse.json({ error: 'Traçado não encontrado para esta linha e sentido.' }, { status: 404 });
    }

    return NextResponse.json(shape, { status: 200 });

  } catch (error) {
    console.error('Erro ao buscar traçado:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}