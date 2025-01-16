// // 

// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
// import axios, { AxiosError } from "axios"
// import { Result } from "./result";

// export const api = axios.create({
// 	baseURL: process.env.BACKEND_URL,
// 	timeout: 5000,
// });

// type ServerFetchError = {
// 	statusCode: number;
// 	message: string;
// 	error: string;
// }

// /**
//  * Fetches a resource from the API backend, and returns it
//  * in a Result.
//  *
//  * IMPORTANT: This function does not do any session refresh. This function assumes that
//  * access_token is valid. However, refreshing tokens is needed, so, that is done at
//  * the middleware level.
//  *
//  * @type Success The data that the API will return if successful
//  */
// export async function serverFetch<Success>(url: string): Promise<Result<Success, ServerFetchError>> {
// 	const cookieStore = await cookies();
// 	const accessToken = cookieStore.get("access_token")?.value;

// 	if (!accessToken) {
// 		redirect("/log-in");
// 	}

// 	// attempt to fetch the url normally
// 	let axiosError: AxiosError;
// 	try {
// 		const response = await api.request<Success>({
// 			url,
// 			headers: {
// 				Cookie: `access_token=${accessToken}`,
// 			}
// 		});

// 		// return the data
// 		return [response.data, null]
// 	} catch (e) {
// 		axiosError = e as AxiosError;
// 	}

// 	//
// 	// handle the axios error
// 	//

// 	// Backed responds, with non 2xx status
// 	if (axiosError.response) {
// 		const data = axiosError.response.data as Partial<ServerFetchError>;
// 		return [
// 			// @ts-expect-error allowing null
// 			null,
// 			{
// 				statusCode: axiosError.status ?? 502,
// 				message: data.message ?? "API no disponible",
// 				error: data.error ?? "Error desconocido",
// 			}
// 		]
// 	}

// 	// The request was made but no response came
// 	if (axiosError.request) {
// 		return [
// 			// @ts-expect-error allowing null
// 			null,
// 			{
// 				statusCode: 502,
// 				message: "API no disponible",
// 				error: "API no disponible"
// 			}
// 		]

// 	}

// 	// Some other error
// 	console.error(axiosError)
// 	return [
// 		// @ts-expect-error allowing null
// 		null,
// 		{
// 			statusCode: 503,
// 			message: "Error interno",
// 			error: "Error interno"
// 		}
// 	]
// }

import { cookies } from "next/headers";
import { Result } from "./result";

type ServerFetchError = {
	statusCode: number;
	message: string;
	error: string;
}

/**
 * Fetches a resource from the API backend, and returns it
 * in a Result.
 *
 * IMPORTANT: This function does not do any session refresh. This function assumes that
 * access_token is valid. However, refreshing tokens is needed, so, that is done at
 * the middleware level.
 *
 * @type Success The data that the API will return if successful
 */
export async function serverFetch<Success>(url: string): Promise<Result<Success, ServerFetchError>> {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("access_token")?.value;

	if (!accessToken) {
		if (process.env.NODE_ENV !== "production") {
			console.error("DEBUG: Intentando user serverFetch sin una cookie `access_token valida`");
		}
	}

	try {
		const response = await fetch(`${process.env.BACKEND_URL}${url}`, {
			headers: {
				Cookie: `access_token=${accessToken}`,
			}
		});

		if (!response.ok) {
			const data = await response.json() as Partial<ServerFetchError>;
			return [
				// @ts-expect-error allowing null
				null,
				{
					statusCode: response.status,
					message: data.message ?? "API no disponible",
					error: data.error ?? "Error desconocido",
				}
			];
		}

		const data = await response.json();
		return [data, null];
	} catch (error) {
		console.error(error);
		return [
			// @ts-expect-error allowing null
			null,
			{
				statusCode: 503,
				message: "Error interno",
				error: "Error interno"
			}
		];
	}
}
