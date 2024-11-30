import { NextRequest, NextResponse } from "next/server";

// Función para redirigir al login
export function redirectToLogin(req: NextRequest): NextResponse {
    return NextResponse.redirect(new URL("/log-in", req.url));
}
