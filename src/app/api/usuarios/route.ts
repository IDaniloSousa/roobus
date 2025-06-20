// src/app/api/usuarios/route.ts
import prisma from '../../lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { matricula, nome, email, senha } = body;

    // Validação básica
    if (!matricula || !nome || !email || !senha) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios' }, { status: 400 });
    }

    const novoUsuario = await prisma.usuarios.create({
      data: {
        matricula,
        nome,
        email,
        senha, // Em um projeto real, você deve fazer o hash da senha!
        // Outros campos usarão seus valores padrão
      },
    });

    return NextResponse.json(novoUsuario, { status: 201 });

  } catch (error: any) {
    // Trata erro de email/matrícula duplicado
    if (error.code === 'P2002') {
         return NextResponse.json({ error: 'Email ou matrícula já existem.' }, { status: 409 });
    }
    console.error(error);
    return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 });
  }
}