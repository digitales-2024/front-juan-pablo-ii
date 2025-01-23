import { NextResponse } from "next/server";

// Función para actualizar la cookie en la respuesta
export function setCookieInResponse(
    res: NextResponse,
    setCookieHeader: string | null,
): void {
    if (setCookieHeader) {
        res.headers.set("Set-Cookie", setCookieHeader);
    }
}
