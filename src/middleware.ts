// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Verifica se há um token nos cookies
  const token = request.cookies.get('token')?.value;
  
  // URLs que requerem autenticação
  const protectedPaths = ['/dashboard', '/perfil', '/historico'];
  
  // URLs de autenticação
  const authPaths = ['/login', '/cadastro'];
  
  const { pathname } = request.nextUrl;

  // Se está tentando acessar uma rota protegida sem token
  if (protectedPaths.some(path => pathname.startsWith(path)) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se está logado e tentando acessar login/cadastro, redireciona para home
  if (authPaths.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
