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
	/** Número máximo de reintentos para errores temporales */
	maxRetries?: number;
	/** Tiempo base entre reintentos (ms) */
	retryDelay?: number;
}

// Tipo para errores del servidor
interface ServerFetchError {
	statusCode: number;
	message: string;
	error: string;
	/** Indica si el error es temporal y se puede reintentar */
	isRetryable?: boolean;
}

// Tipo para la respuesta del refresh token
interface RefreshTokenResponse {
	access_token: string;
}

// Configuración por defecto
const DEFAULT_CONFIG = {
	maxRetries: 3,
	retryDelay: 1000, // 1 segundo
};

// Control de concurrencia para el refresh token
let refreshTokenPromise: Promise<string | null> | null = null;

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
			console.error("❌ Error en la configuración de la petición:", error);
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
				console.error(`❌ [${error.response.status}] ${error.config?.url}`, {
					error: error.response.data,
				});
			}
		}
		return Promise.reject(error);
	}
);

/**
 * Verifica si un error es temporal y se puede reintentar
 */
function isRetryableError(error: AxiosError): boolean {
	// Errores de red son retryables
	if (!error.response) return true;

	const status = error.response.status;
	// 5xx son errores del servidor, probablemente temporales
	// 429 es rate limit
	return status >= 500 || status === 429;
}

/**
 * Calcula el delay para el próximo reintento usando exponential backoff
 */
function getRetryDelay(retryCount: number, baseDelay: number): number {
	return Math.min(baseDelay * Math.pow(2, retryCount), 10000); // máximo 10 segundos
}

/**
 * Intenta refrescar el token de acceso usando el refresh token
 * @returns El nuevo access token o null si falla
 */
async function refreshAccessToken(): Promise<string | null> {
	// Si ya hay una petición en curso, esperar por ella
	if (refreshTokenPromise) {
		return refreshTokenPromise;
	}

	refreshTokenPromise = (async () => {
		try {
			const cookieStore = await cookies();
			const refreshToken = cookieStore.get("refresh_token")?.value;

			if (!refreshToken) {
				console.error("No hay refresh token disponible");
				return null;
			}

			const response = await api.post<RefreshTokenResponse>(
				"/auth/refresh-token",
				null,
				{
					headers: {
						Cookie: `refresh_token=${refreshToken}`,
					},
				}
			);

			return response.data.access_token;
		} catch (error) {
			console.error("Error al refrescar el token:", error);
			return null;
		} finally {
			refreshTokenPromise = null;
		}
	})();

	return refreshTokenPromise;
}

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
	const {
		maxRetries = DEFAULT_CONFIG.maxRetries,
		retryDelay = DEFAULT_CONFIG.retryDelay,
		...restConfig
	} = config;

	let retryCount = 0;

	async function executeRequest(
		accessToken: string | null
	): Promise<Result<Success, ServerFetchError>> {
		try {
			const response = await api.request<Success>({
				method,
				url,
				data: config.body,
				params: config.params,
				headers: {
					...config.headers,
					...(accessToken && { Cookie: `access_token=${accessToken}` }),
				},
				...restConfig,
			});

			return [response.data, null];
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<Partial<ServerFetchError>>;

				// Si es error 401, intentar refrescar el token
				if (axiosError.response?.status === 401) {
					const newAccessToken = await refreshAccessToken();
					if (newAccessToken) {
						return executeRequest(newAccessToken);
					}

					return [
						null,
						{
							statusCode: 401,
							message: "Sesión expirada",
							error: "Por favor, inicie sesión nuevamente",
							isRetryable: false,
						},
					];
				}

				// Para errores retryables, intentar de nuevo si hay reintentos disponibles
				if (
					isRetryableError(axiosError) &&
					retryCount < maxRetries
				) {
					retryCount++;
					const delay = getRetryDelay(retryCount, retryDelay);
					await new Promise((resolve) => setTimeout(resolve, delay));
					return executeRequest(accessToken);
				}

				// Para otros errores HTTP
				if (axiosError.response) {
					const data = axiosError.response.data;
					return [
						null,
						{
							statusCode: axiosError.response.status,
							message: data?.message ?? "API no disponible",
							error: data?.error ?? "Error desconocido",
							isRetryable: isRetryableError(axiosError),
						},
					];
				}

				// Error de red
				if (axiosError.request) {
					return [
						null,
						{
							statusCode: 502,
							message: "API no disponible",
							error: "Error de red",
							isRetryable: true,
						},
					];
				}
			}

			// Error inesperado
			console.error(error);
			return [
				null,
				{
					statusCode: 503,
					message: "Error interno",
					error: "Error inesperado",
					isRetryable: true,
				},
			];
		}
	}

	const cookieStore = await cookies();
	let accessToken = cookieStore.get("access_token")?.value;

	// Si no hay access token, intentar obtener uno nuevo
	if (!accessToken) {
		accessToken = await refreshAccessToken();
	}

	return executeRequest(accessToken);
}

// Funciones helper para cada método HTTP
export const http = {
	get<T>(url: string, config?: Omit<ServerFetchConfig, "body">) {
		return serverFetch<T>("GET", url, config);
	},

	post<T, B = any>(
		url: string,
		body?: B,
		config?: Omit<ServerFetchConfig, "body">
	) {
		return serverFetch<T, B>("POST", url, { ...config, body });
	},

	put<T, B = any>(
		url: string,
		body?: B,
		config?: Omit<ServerFetchConfig, "body">
	) {
		return serverFetch<T, B>("PUT", url, { ...config, body });
	},

	delete<T>(url: string, config?: ServerFetchConfig) {
		return serverFetch<T>("DELETE", url, config);
	},

	patch<T, B = any>(
		url: string,
		body?: B,
		config?: Omit<ServerFetchConfig, "body">
	) {
		return serverFetch<T, B>("PATCH", url, { ...config, body });
	},
};
