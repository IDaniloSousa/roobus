import { cookies } from 'next/headers';
import prisma from '../../lib/prisma';
import { NextResponse } from 'next/server';
import { checkProfanity } from 'glin-profanity';

function zerarHorario(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function GET(request: Request) {
  try {
    const duvidas = await prisma.duvidas.findMany({
      select: {
        id: true,
        mensagem: true,
        createdAt: true,
        updatedAt: true,
        respostas: true
      },
      where: {
        respostas: {
          some: {}
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(duvidas);
  } catch (e) {
    console.error("GET:/duvidas Erro interno do servidor.", e);
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  try {
    const data = await request.json();
    const mensagem = data;

    const cookiesStore = await cookies();
    const user = cookiesStore.get('session_user_id');
    const userId = Number(user?.value);

    if (userId >= 0) {
      const verificaUltimaPostagem = await prisma.duvidas.findFirst({
        select: { createdAt: true },
        where: { user_id: userId },
        orderBy: { createdAt: 'desc' }
      });

      const result = checkProfanity(mensagem, {
        languages: ['portuguese', 'english', 'spanish'],
        replaceWith: '***',
      });

      // Verifica palavras de baixo calão
      if (result.containsProfanity) {
        console.error('Postagem de dúvida cancelada - A mensagem contém palavras inadequadas')
        return NextResponse.json(
          { error: 'A mensagem contém palavras inadequadas.' },
          { status: 400 }
        );
      }

      // Se nunca postou, pode postar direto
      if (!verificaUltimaPostagem) {
        await prisma.duvidas.create({
          data: {
            user_id: userId,
            mensagem,
            fechado: false
          }
        });
        return NextResponse.json({ status: 200, mensagem: 'Sucesso' });
      }

      // Existe data anterior → validar 2 dias
      const hoje = zerarHorario(new Date());
      const ultimaPostagem = zerarHorario(verificaUltimaPostagem.createdAt);

      const diffMs = hoje.getTime() - ultimaPostagem.getTime();
      const diffDias = diffMs / (1000 * 60 * 60 * 24);

      if (diffDias < 1) {
        console.error('Postagem de dúvida cancelada - Só pode postar novamente após 1 dia', ` Mensagem: "${mensagem}" User: ${userId}`)
        return NextResponse.json(
          { error: 'Você só pode postar novamente após 1 dias.' },
          { status: 429 }
        );
      }

      // Se passou de 2 dias → pode criar
      await prisma.duvidas.create({
        data: {
          user_id: userId,
          mensagem,
          fechado: false
        }
      });

      return NextResponse.json({ status: 200, mensagem: 'Sucesso' });
    } else {
      console.error("Postagem de dúvida cancelada - Usuário sem login");
      throw new Error("Usuário sem login");
    }

  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}
