import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getToken } from "./lib/jwt/getToken";
import { redirectToLogin } from "./lib/jwt/redirectToLogin";

const routesNotRequiringAuth = ["/log-in", "/update-password"];

export async function middleware(request: NextRequest) {
    // Extraer la cookie llamada 'access_token'
    const token = getToken(request);

    // Si no hay token y la ruta requiere autenticación, redirigir a login
    if (!token && !routesNotRequiringAuth.includes(request.nextUrl.pathname)) {
        return redirectToLogin(request);
    }

    // Si hay token y el usuario intenta acceder a una ruta pública, redirigir a la página de inicio
    if (token && routesNotRequiringAuth.includes(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // Permitir la solicitud
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|favicon.ico|static).*)"],
};
