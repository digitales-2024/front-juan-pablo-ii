// src/middleware.ts
import { NextResponse, type NextRequest } from "next/server";

// Define tus rutas públicas
const PUBLIC_ROUTES = [
  '/sign-in',
  '/sign-up',
  '/forgot-password'
];

// Middleware function
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verifica si la ruta actual es pública
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // Verifica autenticación
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const isAuthenticated = !!(accessToken || refreshToken);

  // Si la ruta es pública y el usuario está autenticado, redirige al dashboard
  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Si la ruta NO es pública y el usuario NO está autenticado, redirige al login
  if (!isPublicRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

// Configuración estática del matcher
export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas excepto:
     * 1. /api (rutas API)
     * 2. /_next (archivos estáticos de Next.js)
     * 3. /_static (si tienes una carpeta static)
     * 4. /_vercel (archivos internos de Vercel)
     * 5. /favicon.ico, /sitemap.xml, etc.
     */
    '/((?!api|_next|_static|_vercel|favicon.ico|sitemap.xml).*)',
  ]
};