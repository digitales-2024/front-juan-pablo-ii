import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'
import { AxiosError } from 'axios'
import { Result } from './utils/result'

interface JWTPayload {
	exp: number
}

const routesNotRequiringAuth = ["/sign-in", "/update-password"];

/**
 * Devuelve en cuantos segundos expira el token jwt pasado como param.
 * Si el token es invalido, o ya ha expirado, devuelve 0
 */
function tokenExpiration(token: string): number {
	try {
		const decoded = jwtDecode<JWTPayload>(token)
		const expirationMs = decoded.exp * 1000;
		const now = Date.now()
		const secondsToExpiration = (expirationMs - now) / 1000
		return secondsToExpiration > 0 ? secondsToExpiration : 0;
	} catch {
		return 0;
	}
}

export async function middleware(request: NextRequest) {
	const access_token = request.cookies.get('access_token')
	const refresh_token = request.cookies.get('refresh_token')

	if (routesNotRequiringAuth.includes(request.nextUrl.pathname)) {
		return NextResponse.next()
	}

	if (!access_token || !refresh_token) {
		// No token? GTFO to login
		return logoutAndRedirectLogin(request);
	}

	// if the access_token expires in 60s or less,
	// attempt to refresh it
	if (tokenExpiration(access_token.value) < 60) {
		// check them refresh_token. if it expires in 5 seconds or
		// less, forget it, remove all tokens and redirect to /login
		if (tokenExpiration(refresh_token.value) < 5) {
			console.log('💀 Refresh token almost dead, nuking everything!')
			return logoutAndRedirectLogin(request);
		}

		// do session refresh here :D
		const [newCookies, err] = await refresh(access_token.value, refresh_token.value);
		if (err) {
			console.log(err)
			return logoutAndRedirectLogin(request);
		}

		// Cookies have been refreshed, all is right in the world :D
		const response = NextResponse.next()

		response.cookies.delete('logged_in')
		response.cookies.delete('access_token')
		response.cookies.delete('refresh_token')

		newCookies.forEach(cookie => {
			// Extract the name and value from the cookie string
			const [nameValue] = cookie.split(';')
			const [name, value] = nameValue.split('=')

			// Update the request cookies
			response.cookies.set({
				name,
				value
			})
		})

		return response
	}

	// access_token is valid, just continue :D
	return NextResponse.next()
}

function logoutAndRedirectLogin(request: NextRequest) {
	const response = NextResponse.redirect(new URL('/sign-in', request.url))
	// Nuke them cookies from orbit
	response.cookies.delete('logged_in')
	response.cookies.delete('access_token')
	response.cookies.delete('refresh_token')
	return response
}

/**
 * Attempt to refresh the session cookies. Returns all the
 * Set-Cookie headers, like so:
 * [
 *   "access_token=jfdlskjflsdkfjsldkjf;",
 *   "refresh_token=jfdlskjflsdkfjsldkjf;",
 * ]
 */
async function refresh(accessToken: string, refreshToken: string): Promise<Result<Array<string>, string>> {
	try {
		// Try token refresh
		const response = await fetch(`${process.env.BACKEND_URL}/auth/refresh-token`, {
			method: 'POST',
			headers: {
				Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}`
			}
		});
		// Get ALL cookies, no games, no tricks
		const newCookies = response.headers.getSetCookie();

		if (!newCookies || newCookies.length === 0) {
			return [
				// @ts-expect-error allowing null
				null,
				"El refresh fue exitoso, pero no contenia nuevas cookies"
			]
		}
		return [newCookies, null];
	} catch (e) {
		const err = e as AxiosError;
		console.log(err.response);

		// @ts-expect-error allowing null
		return [null, "Error refrescando token"]
	}
}

export const config = {
	matcher: ["/((?!_next|favicon.ico|static).*)"],
}
