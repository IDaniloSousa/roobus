// src/app/api/cadastro/route.ts
import prisma from '../../lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, senha } = body;

    // Validação básica
    if (!nome || !email || !senha) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios' }, { status: 400 });
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    // Validação de senha
    if (senha.length < 6) {
      return NextResponse.json({ error: 'Senha deve ter pelo menos 6 caracteres' }, { status: 400 });
    }

    // Gera uma matrícula única (simplificado)
    const matricula = `USR${Date.now()}`;

    // Cria o novo usuário
    const novoUsuario = await prisma.usuarios.create({
      data: {
        matricula,
        nome,
        email,
        senha, // Em um projeto real, você deve fazer o hash da senha!
      },
    });

    // Remove a senha da resposta
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { senha: _, ...usuarioSemSenha } = novoUsuario;

    return NextResponse.json({ 
      message: 'Usuário criado com sucesso',
      usuario: usuarioSemSenha 
    }, { status: 201 });

  } catch (error: unknown) {
    // Trata erro de email duplicado
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: 'Este email já está em uso' }, { status: 409 });
    }
    
    console.error('Erro no cadastro:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}