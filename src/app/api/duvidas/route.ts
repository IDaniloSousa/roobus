import prisma from '../../lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const mensagem = data

        await prisma.duvidas.create({
        data: {
            anonymous_user_id: '0',
            mensagem: mensagem,
            fechado: false
        }
        })

        return NextResponse.json({ status: 200, mensagem: 'Sucesso' });
    } catch (error) {
        console.error('Erro ao processar requisição:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor.' },
            { status: 500 }
        );
    }
}
