import { cookies } from "next/headers";
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from "axios";
import { Result } from "./result";

// Tipos para los métodos HTTP
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// Configuración extendida para las peticiones
interface ServerFetchConfig<T = any>
	extends Omit<AxiosRequestConfig, "url" | "method"> {
	body?: T;
	params?: Record<string, string | number>;
	headers?: Record<string, string>;
}

// Tipo para errores del servidor
type ServerFetchError = {
	statusCode: number;
	message: string;
	error: string;
};

// Crear instancia de axios
export const api: AxiosInstance = axios.create({
	baseURL: process.env.BACKEND_URL,
	timeout: 5000,
	validateStatus: (status) => status >= 200 && status < 300,
});

// Interceptores para logs
api.interceptors.request.use(
	(config) => {
		if (process.env.NODE_ENV !== "production") {
			console.log(`🚀 [${config.method?.toUpperCase()}] ${config.url}`, {
				body: config.data,
				params: config.params,
			});
		}
		return config;
	},
	(error) => {
		if (process.env.NODE_ENV !== "production") {
			console.error(
				"❌ Error en la configuración de la petición:",
				error
			);
		}
		return Promise.reject(error);
	}
);

api.interceptors.response.use(
	(response) => {
		if (process.env.NODE_ENV !== "production") {
			console.log(`✅ [${response.status}] ${response.config.url}`, {
				data: response.data,
			});
		}
		return response;
	},
	(error) => {
		if (process.env.NODE_ENV !== "production") {
			if (axios.isAxiosError(error) && error.response) {
				console.error(
					`❌ [${error.response.status}] ${error.config?.url}`,
					{
						error: error.response.data,
					}
				);
			}
		}
		return Promise.reject(error);
	}
);

/**
 * Función base para realizar peticiones HTTP
 * @param method Método HTTP
 * @param url URL del endpoint
 * @param config Configuración adicional de la petición
 */
export async function serverFetch<Success, ReqBody = any>(
	method: HttpMethod,
	url: string,
	config: ServerFetchConfig<ReqBody> = {}
): Promise<Result<Success, ServerFetchError>> {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("access_token")?.value;

	if (!accessToken) {
		if (process.env.NODE_ENV !== "production") {
			console.error(
				"DEBUG: Intentando usar serverFetch sin una cookie `access_token` válida"
			);
		}
	}

	try {
		const response = await api.request<Success>({
			method,
			url,
			data: config.body,
			params: config.params,
			headers: {
				...config.headers,
				Cookie: `access_token=${accessToken}`,
			},
			...config,
		});

		return [response.data, null];
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const axiosError = error as AxiosError<Partial<ServerFetchError>>;

			if (axiosError.response) {
				const data = axiosError.response.data;
				return [
					// @ts-expect-error allowing null
					null,
					{
						statusCode: axiosError.response.status,
						message: data?.message ?? "API no disponible",
						error: data?.error ?? "Error desconocido",
					},
				];
			}

			if (axiosError.request) {
				return [
					// @ts-expect-error allowing null
					null,
					{
						statusCode: 502,
						message: "API no disponible",
						error: "API no disponible",
					},
				];
			}
		}

		console.error(error);
		return [
			// @ts-expect-error allowing null
			null,
			{
				statusCode: 503,
				message: "Error interno",
				error: "Error interno",
			},
		];
	}
}

// Funciones helper para cada método HTTP
export const http = {
	/**
	 * Realizar petición GET
	 */
	get: <Response>(url: string, config?: Omit<ServerFetchConfig, "body">) =>
		serverFetch<Response>("GET", url, config),

	/**
	 * Realizar petición POST
	 */
	post: <Response, ReqBody = any>(
		url: string,
		body?: ReqBody,
		config?: Omit<ServerFetchConfig, "body">
	) => serverFetch<Response, ReqBody>("POST", url, { ...config, body }),

	/**
	 * Realizar petición PUT
	 */
	put: <Response, ReqBody = any>(
		url: string,
		body?: ReqBody,
		config?: Omit<ServerFetchConfig, "body">
	) => serverFetch<Response, ReqBody>("PUT", url, { ...config, body }),

	/**
	 * Realizar petición DELETE
	 */
	delete: <Response>(url: string, config?: ServerFetchConfig) =>
		serverFetch<Response>("DELETE", url, config),

	/**
	 * Realizar petición PATCH
	 */
	patch: <Response, ReqBody = any>(
		url: string,
		body?: ReqBody,
		config?: Omit<ServerFetchConfig, "body">
	) => serverFetch<Response, ReqBody>("PATCH", url, { ...config, body }),
};
