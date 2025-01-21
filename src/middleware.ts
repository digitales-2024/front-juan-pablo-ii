import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { Result } from "./utils/result";

interface JWTPayload {
	exp: number;
}

const PUBLIC_ROUTES = [
	'/sign-in',
];

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5000/api/v1";

// Rutas que no queremos guardar como última URL visitada
const EXCLUDED_REDIRECT_ROUTES = ["/", "/sign-in"];

export async function middleware(request: NextRequest) {
	const access_token = request.cookies.get("access_token");
	const refresh_token = request.cookies.get("refresh_token");
	const isAuthenticated = !!access_token && !!refresh_token;
	const { pathname } = request.nextUrl;


	// Si estamos en una ruta pública (sign-in) y el usuario está autenticado
	// redirigimos al home o a la última URL visitada
	if (PUBLIC_ROUTES.includes(pathname) && isAuthenticated) {
		const lastVisitedUrl = request.cookies.get("lastUrl")?.value ?? "/";
		const nextResponse = NextResponse.redirect(new URL(lastVisitedUrl, request.url));
		nextResponse.cookies.delete("lastUrl");
		return nextResponse;
	}

	// Si NO estamos en una ruta pública y el usuario NO está autenticado
	// guardamos la URL actual (si no está excluida) y redirigimos a sign-in
	if (!PUBLIC_ROUTES.includes(pathname) && !isAuthenticated) {
		const response = NextResponse.redirect(
			new URL("/sign-in", request.url)
		);

		// Solo guardamos la URL si no está en la lista de excluidas
		if (!EXCLUDED_REDIRECT_ROUTES.includes(pathname)) {
			response.cookies.set("lastUrl", pathname);
		}

		return response;
	}

	// Si estamos en una ruta publica, y el usuario no esta autenticado, continuar
	if (PUBLIC_ROUTES.includes(request.nextUrl.pathname)) {
		return NextResponse.next();
	}

	// En este punto se cumple que:
	// - Estamos en una ruta privada, y el usuario esta "autenticado"

	// Si no existe access_token o refresh_token,
	// redirigir a login
	if (!access_token || !refresh_token) {
		const redirectUrl = EXCLUDED_REDIRECT_ROUTES.includes(pathname) ? "/" : pathname;
		return logoutAndRedirectLogin(request, redirectUrl);
	}

	// Si el access_token expira en 30s o menos,
	// intentar refrescarlo
	if (tokenExpiration(access_token.value) < 30) {
		// Si refresh_token expira en 5s o menos,
		// eliminar todas las cookies y redirigir a login
		if (tokenExpiration(refresh_token.value) < 5) {
			const redirectUrl = EXCLUDED_REDIRECT_ROUTES.includes(pathname) ? "/" : pathname;
			return logoutAndRedirectLogin(request, redirectUrl);
		}

		const [newCookies, err] = await refresh(
			access_token.value,
			refresh_token.value,
		);
		if (err) {
			console.log(err);
			const redirectUrl = EXCLUDED_REDIRECT_ROUTES.includes(pathname) ? "/" : pathname;
			return logoutAndRedirectLogin(request, redirectUrl);
		}

		const response = NextResponse.next();

		// Eliminar cookies antiguas
		response.cookies.delete("logged_in");
		response.cookies.delete("access_token");
		response.cookies.delete("refresh_token");

		// Establecer las nuevas cookies
		newCookies.forEach((cookie) => {
			const [nameValue] = cookie.split(";");
			const [name, value] = nameValue.split("=");
			response.cookies.set({
				name,
				value,
			});
		});

		return response;
	}

	// access_token es valido, continuar
	return NextResponse.next();
}

/**
 * Elimina todas las cookies y redirige a login. Guarda
 * la URL pasada como segundo parametro como cookie.
 */
function logoutAndRedirectLogin(request: NextRequest, redirectUrl: string) {
	const response = NextResponse.redirect(new URL("/sign-in", request.url));
	response.cookies.delete("logged_in");
	response.cookies.delete("access_token");
	response.cookies.delete("refresh_token");
	response.cookies.set("lastUrl", redirectUrl);
	return response;
}

/**
 * Devuelve en cuantos segundos expira el token jwt pasado como param.
 * Si el token es invalido, o ya ha expirado, devuelve 0
 */
function tokenExpiration(token: string): number {
	try {
		const decoded = jwtDecode<JWTPayload>(token);
		const expirationMs = decoded.exp * 1000;
		const now = Date.now();
		const secondsToExpiration = (expirationMs - now) / 1000;
		return secondsToExpiration > 0 ? secondsToExpiration : 0;
	} catch {
		return 0;
	}
}

async function refresh(
	accessToken: string,
	refreshToken: string,
): Promise<Result<Array<string>, string>> {
	try {
		const response = await fetch(
			`${BACKEND_URL}/auth/refresh-token`,
			{
				method: "POST",
				headers: {
					Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}`,
				},
			},
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const newCookies = response.headers.getSetCookie();

		if (!newCookies || newCookies.length === 0) {
			return [
				// @ts-expect-error allowing null
				null,
				"El refresh fue exitoso, pero no contenia nuevas cookies",
			];
		}

		return [newCookies, null];
	} catch (error) {
		console.error("Refresh token error:", error);

		return [
			// @ts-expect-error allowing null
			null,
			"Error refrescando token",
		];
	}
}

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
		"/((?!api|_next|_static|_vercel|favicon.ico|sitemap.xml).*)",
	],
};
