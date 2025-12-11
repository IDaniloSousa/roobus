'use server';

import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

async function createLog(userId: number, action: 'LOGIN' | 'LOGOUT' | 'REGISTER') {
  try {
    await prisma.accessLog.create({
      data: {
        user_id: userId,
        action: action,
      }
    });
  } catch (error) {
    console.error("Erro ao criar log de acesso:", error);
  }
}

export async function registerAction(formData: FormData) {
  const name = formData.get('name') as string;
  const login = formData.get('login') as string;
  const password = formData.get('password') as string;

  if (!name || !login || !password) {
    return { success: false, message: 'Preencha todos os campos' };
  }

  const existingUser = await prisma.systemBus.findUnique({
    where: { login },
  });

  if (existingUser) {
    return { success: false, message: 'Este login já está em uso' };
  }

  const newUser = await prisma.systemBus.create({
    data: {
      name,
      login,
      password,
      role: 'USER',
      route_number: null,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set('session_user_id', String(newUser.id), { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    maxAge: 60 * 60 * 24 
  });

  // LOG: Registro de novo usuário
  await createLog(newUser.id, 'REGISTER');

  return { success: true, user: newUser };
}

export async function loginAction(formData: FormData) {
  const login = formData.get('login') as string;
  const password = formData.get('password') as string;

  const user = await prisma.systemBus.findUnique({ where: { login } });

  if (!user || user.password !== password) {
    return { success: false, message: 'Login ou senha inválidos' };
  }

  const cookieStore = await cookies();

  cookieStore.set('session_user_id', String(user.id), { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    maxAge: 60 * 60 * 24 
  });

  await createLog(user.id, 'LOGIN');

  return { success: true, user };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('session_user_id')?.value;

  if (userId) {
    await createLog(parseInt(userId), 'LOGOUT');
  }

  cookieStore.delete('session_user_id');
}

export async function getLoggedUser() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('session_user_id')?.value;
    
    if (!userId) return null;

    const user = await prisma.systemBus.findUnique({
      where: { id: parseInt(userId) },
      select: { id: true, name: true, route_number: true, role: true } 
    });

    return user;
  } catch (error) {
      console.error("Erro ao buscar usuário logado:", error);
    return null;
  }
}