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

  // Permitir el acceso a rutas públicas sin verificar tokens
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Verificar tokens
  const accessToken = request.cookies.get("access_token");
  const refreshToken = request.cookies.get("refresh_token");

  // Redirigir a la página de inicio de sesión si no hay tokens
  if (!accessToken && !refreshToken) {
    console.log('estoy en el 1');
    const loginUrl = new URL("/sign-in", request.url);
    // loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verificar con el backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify`, {
      method: 'HEAD',
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
    });

    if (!response.ok) {
      console.log('estoy en el 2');
      const loginUrl = new URL("/sign-in", request.url);
      // loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Si está autenticado y en una ruta pública, redirigir al inicio
    if (isPublicRoute(pathname) && response.ok && !accessToken && !refreshToken) {
      console.log('estoy en el 3');
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