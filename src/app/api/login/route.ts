// src/app/api/login/route.ts
import prisma from '../../lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, senha } = body;

    // Validação básica
    if (!email || !senha) {
      return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 });
    }

    // Busca o usuário pelo email
    const usuario = await prisma.usuarios.findUnique({
      where: { email },
    });

    // Verifica se o usuário existe e se a senha está correta
    // NOTA: Em um projeto real, você deve usar hash para senhas (bcrypt, etc.)
    if (!usuario || usuario.senha !== senha) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    // Em um projeto real, você geraria um JWT token aqui
    // Por simplicidade, vamos retornar apenas os dados do usuário
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { senha: _, ...usuarioSemSenha } = usuario;

    // Simula um token (em produção, use JWT)
    const token = `token_${usuario.id}_${Date.now()}`;

    const response = NextResponse.json({ 
      usuario: usuarioSemSenha,
      token 
    }, { status: 200 });

    // Define o token como cookie httpOnly (mais seguro)
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return response;

  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}