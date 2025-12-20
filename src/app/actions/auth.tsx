'use server';

import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import bcrypt from 'bcrypt';
import validator from 'validator';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

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

  if (name.trim().length < 5) {
    return { success: false, message: 'O nome deve ter pelo menos 5 caracteres' };
  }

  if (!validator.isEmail(login)) {
    return { success: false, message: 'Por favor, insira um email válido' };
  }

  const normalizedEmail = login.toLowerCase().trim();

  if (password.length < 6) {
    return { success: false, message: 'A senha deve ter pelo menos 6 caracteres' };
  }

  const existingUser = await prisma.systemBus.findUnique({
    where: { login: normalizedEmail },
  });

  if (existingUser) {
    return { success: false, message: 'Este email já está em uso' };
  }

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await prisma.systemBus.create({
      data: {
        name: name.trim(),
        login: normalizedEmail,
        password: hashedPassword,
        role: 'USER',
        route_number: null,
      },
    });

    const cookieStore = await cookies();
    cookieStore.set('session_user_id', String(newUser.id), { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 60 * 60 * 24, // 24 horas
      sameSite: 'lax'
    });

    await createLog(newUser.id, 'REGISTER');

    return { 
      success: true, 
      user: { 
        id: newUser.id, 
        name: newUser.name, 
        role: newUser.role 
      } 
    };
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return { success: false, message: 'Erro ao criar conta. Tente novamente.' };
  }
}

export async function loginAction(formData: FormData) {
  const login = formData.get('login') as string;
  const password = formData.get('password') as string;

  if (!login || !password) {
    return { success: false, message: 'Preencha todos os campos' };
  }

  if (!validator.isEmail(login)) {
    return { success: false, message: 'Por favor, insira um email válido' };
  }

  const normalizedEmail = login.toLowerCase().trim();

  try {
    const user = await prisma.systemBus.findUnique({ 
      where: { login: normalizedEmail } 
    });

    if (!user) {
      return { success: false, message: 'Email ou senha inválidos' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { success: false, message: 'Email ou senha inválidos' };
    }

    const cookieStore = await cookies();
    cookieStore.set('session_user_id', String(user.id), { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 60 * 60 * 24,
      sameSite: 'lax'
    });

    await createLog(user.id, 'LOGIN');

    return { 
      success: true, 
      user: { 
        id: user.id, 
        name: user.name, 
        role: user.role 
      } 
    };
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return { success: false, message: 'Erro ao fazer login. Tente novamente.' };
  }
}

export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('session_user_id')?.value;

    if (userId) {
      await createLog(parseInt(userId), 'LOGOUT');
    }

    cookieStore.delete('session_user_id');
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  }
}

export async function getLoggedUser() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('session_user_id')?.value;
    
    if (!userId) return null;

    const user = await prisma.systemBus.findUnique({
      where: { id: parseInt(userId) },
      select: { 
        id: true, 
        name: true, 
        route_number: true, 
        role: true 
      } 
    });

    return user;
  } catch (error) {
    console.error("Erro ao buscar usuário logado:", error);
    return null;
  }
}