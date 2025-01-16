// src/middleware.ts
import { NextResponse, type NextRequest } from "next/server";

// Rutas públicas que no requieren autenticación
const PUBLIC_ROUTES = ["/sign-in"];

// Rutas que no queremos guardar como última URL visitada
const EXCLUDED_REDIRECT_ROUTES = ["/", "/sign-in"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Verificar si hay tokens de autenticación
  const accessToken = request.cookies.get("access_token")?.value ?? null;
  const refreshToken = request.cookies.get("refresh_token")?.value ?? null;
  const isAuthenticated = !!(accessToken && refreshToken);

  // Si estamos en una ruta pública (sign-in) y el usuario está autenticado
  // redirigimos al home o a la última URL visitada
  if (PUBLIC_ROUTES.includes(pathname) && isAuthenticated) {
    const lastVisitedUrl = request.cookies.get("lastUrl")?.value ?? "/";
    return NextResponse.redirect(new URL(lastVisitedUrl, request.url));
  }

  // Si NO estamos en una ruta pública y el usuario NO está autenticado
  // guardamos la URL actual (si no está excluida) y redirigimos a sign-in
  if (!PUBLIC_ROUTES.includes(pathname) && !isAuthenticated) {
    const response = NextResponse.redirect(new URL("/sign-in", request.url));
    
    // Solo guardamos la URL si no está en la lista de excluidas
    if (!EXCLUDED_REDIRECT_ROUTES.includes(pathname)) {
      response.cookies.set("lastUrl", pathname);
    }
    
    return response;
  }

  // Si la ruta actual no está excluida, la guardamos como última URL visitada
  if (!EXCLUDED_REDIRECT_ROUTES.includes(pathname)) {
    const response = NextResponse.next();
    response.cookies.set("lastUrl", pathname);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|static|api|images).*)"],
}
