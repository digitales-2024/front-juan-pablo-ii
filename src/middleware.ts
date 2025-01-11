// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rutas públicas que no requieren autenticación
const PUBLIC_ROUTES = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
];

// Rutas API públicas
const PUBLIC_API_ROUTES = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/forgot-password",
];

function isPublicRoute(path: string): boolean {
  return (
    PUBLIC_ROUTES.includes(path) ||
    PUBLIC_API_ROUTES.some(route => path.startsWith(route)) ||
    path.startsWith("/_next") ||
    path.includes("favicon")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token");
  const refreshToken = request.cookies.get("refresh_token");

  // Si tiene tokens y está intentando acceder a una ruta pública, redirigir al dashboard
  if ((accessToken || refreshToken) && isPublicRoute(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Permitir el acceso a rutas públicas sin verificar tokens (solo para usuarios no autenticados)
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Redirigir a la página de inicio de sesión si no hay tokens
  if (!accessToken && !refreshToken) {
    const loginUrl = new URL("/sign-in", request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verificar con el backend
    const response = await fetch(`${process.env.BACKEND_URL}/auth/verify`, {
      method: 'HEAD',
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
    });

    if (!response.ok) {
      const loginUrl = new URL("/sign-in", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Si está autenticado y en una ruta pública, redirigir al inicio
    if (isPublicRoute(pathname) && response.ok && !accessToken && !refreshToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Error en middleware:', error);
    const loginUrl = new URL("/sign-in", request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};