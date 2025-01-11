// src/middleware.ts
import { NextResponse, type NextRequest } from "next/server";

// Definir rutas de forma más organizada
const PUBLIC_ROUTES = ["/sign-in", "/sign-up", "/forgot-password"];
const AUTH_ROUTES = ["/", "/dashboard", "/profile", "/settings"];
const DEFAULT_REDIRECT = "/";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const isAuthenticated = !!(accessToken || refreshToken);
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  // Caso 1: Usuario autenticado intentando acceder a rutas públicas
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL(DEFAULT_REDIRECT, request.url));
  }

  // Caso 2: Usuario no autenticado intentando acceder a rutas protegidas
  if (!isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Caso 3: Permitir el acceso normal en todos los demás casos
  return NextResponse.next();
}

// Configuración estática del matcher
export const config = {
  matcher: [
    '/',
    '/sign-in',
    '/sign-up',
    '/forgot-password',
    '/dashboard',
    '/profile',
    '/settings'
  ]
};