'use server';

import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function loginAction(formData: FormData) {
  const login = formData.get('login') as string;
  const password = formData.get('password') as string;

  const user = await prisma.systemBus.findUnique({
    where: { login },
  });

  if (!user || user.password !== password) {
    return { success: false, message: 'Login ou senha inválidos' };
  }

  const cookieStore = await cookies();
  
  cookieStore.set('session_user_id', String(user.id), { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 
  });

  return { success: true, user };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('session_user_id');
}

export async function getLoggedUser() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('session_user_id')?.value;
    
    if (!userId) return null;

    const user = await prisma.systemBus.findUnique({
      where: { id: parseInt(userId) },
      select: { id: true, name: true, route_number: true } // Não retornamos a senha
    });

    return user;
  } catch (error) {
    console.error("Erro ao buscar usuário logado:", error);
    return null;
  }
}