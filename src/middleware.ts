import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'
import { AxiosError } from 'axios'
import { Result } from './utils/result'

interface JWTPayload {
	exp: number;
	id: string;
}

// Rutas públicas que no requieren autenticación
const PUBLIC_ROUTES = ["/sign-in"];
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5000/api/v1";

// Rutas que no queremos guardar como última URL visitada
const EXCLUDED_REDIRECT_ROUTES = ["/", "/sign-in"];

// Función para obtener el access token
function getAccessToken(request: NextRequest) {
	return request.cookies.get("access_token")?.value ?? null;
}

// Función para obtener el refresh token
function getRefreshToken(request: NextRequest) {
	return request.cookies.get("refresh_token")?.value ?? null;
}

// Función para verificar si el refresh token no ha expirado
function checkRefreshTokenExpiration(refreshToken: string | null) {
	try {
		if (!refreshToken) {
			throw new Error("Refresh token is null");
		}
		const decodedToken = jwtDecode<JWTPayload>(refreshToken);
		const currentTime = Math.floor(Date.now() / 1000); // Convertir a segundos

		return decodedToken.exp > currentTime;
	} catch (error) {
		console.error("Error decoding refresh token:", error);
		return false;
	}
}

// Función para refrescar el access token
async function refreshAccessToken() {
	try {
		const response = await fetch(`${BACKEND_URL}/auth/refresh-token`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		if (!response.ok) {
			throw new Error("Failed to refresh token");
		}

		const data = (await response.json()) as { access_token: string };
		return data.access_token;
	} catch (error) {
		console.error("Error refreshing access token:", error);
		return null;
	}
}

// Función para llamar al endpoint de logout
async function logout(request: NextRequest) {
	try {
		const refreshToken = getRefreshToken(request);

		if (refreshToken) {
			await fetch(`${BACKEND_URL}/auth/logout`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ refresh_token: refreshToken }),
			});
		}

		const redirectResponse = NextResponse.redirect(
			new URL("/sign-in", request.url)
		);
		redirectResponse.cookies.delete("access_token");
		redirectResponse.cookies.delete("refresh_token");
		redirectResponse.cookies.delete("lastUrl");

		return redirectResponse;
	} catch (error) {
		console.error("Error during logout:", error);
		const redirectResponse = NextResponse.redirect(
			new URL("/sign-in", request.url)
		);
		redirectResponse.cookies.delete("access_token");
		redirectResponse.cookies.delete("refresh_token");
		redirectResponse.cookies.delete("lastUrl");

		return redirectResponse;
	}
}

// Función para manejar la verificación y renovación del access token
async function handleToken(request: NextRequest) {
	const accessToken = getAccessToken(request);
	const refreshToken = getRefreshToken(request);
	if (!accessToken) {
		if (refreshToken) {
			const isRefreshTokenValid =
				checkRefreshTokenExpiration(refreshToken);
			if (isRefreshTokenValid) {
				await refreshAccessToken();
			} else {
				await logout(request);
				return;
			}
		} else {
			await logout(request);
			return;
		}
	}
	return NextResponse.next();
}

export async function middleware(request: NextRequest) {
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
		const response = NextResponse.redirect(
			new URL("/sign-in", request.url)
		);

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

	// Llamar a la función handleToken
	const response = await handleToken(request);
	if (response) {
		return response;
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next|favicon.ico|static|api|images).*)"],
};
