import { cookies } from "next/headers";
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from "axios";

// Types
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface DALConfig<T = any>
	extends Omit<AxiosRequestConfig, "url" | "method"> {
	body?: T;
	params?: Record<string, string | number>;
	headers?: Record<string, string>;
	maxRetries?: number;
	retryDelay?: number;
}

interface DALError {
	statusCode: number;
	message: string;
	error: string;
	isRetryable?: boolean;
}

interface TokenResponse {
	access_token: string;
}

type Result<T> = Promise<[T | null, DALError | null]>;

// Constants
const DEFAULT_CONFIG = {
	maxRetries: 3,
	retryDelay: 1000,
	baseURL: process.env.BACKEND_URL,
	timeout: 5000,
};

// Singleton for token refresh
let refreshPromise: Promise<string | null> | null = null;

// Create axios instance
const api: AxiosInstance = axios.create({
	baseURL: DEFAULT_CONFIG.baseURL,
	timeout: DEFAULT_CONFIG.timeout,
	validateStatus: (status) => status >= 200 && status < 300,
});

// Development logging
if (process.env.NODE_ENV !== "production") {
	api.interceptors.request.use(
		(config) => {
			console.log(`🚀 [${config.method?.toUpperCase()}] ${config.url}`, {
				body: config.data,
				params: config.params,
			});
			return config;
		},
		(error) => {
			console.error("❌ Request configuration error:", error);
			return Promise.reject(error);
		}
	);

	api.interceptors.response.use(
		(response) => {
			console.log(`✅ [${response.status}] ${response.config.url}`, {
				data: response.data,
			});
			return response;
		},
		(error) => {
			if (axios.isAxiosError(error) && error.response) {
				console.error(
					`❌ [${error.response.status}] ${error.config?.url}`,
					{
						error: error.response.data,
					}
				);
			}
			return Promise.reject(error);
		}
	);
}

// Utility functions
const isRetryableError = (error: AxiosError): boolean => {
	if (!error.response) return true;
	const status = error.response.status;
	return status >= 500 || status === 429;
};

const getRetryDelay = (retryCount: number, baseDelay: number): number => {
	return Math.min(baseDelay * Math.pow(2, retryCount), 10000);
};

const refreshAccessToken = async (): Promise<string | null> => {
	if (refreshPromise) return refreshPromise;

	refreshPromise = (async () => {
		try {
			const cookieStore = await cookies();
			const refreshToken = cookieStore.get("refresh_token")?.value;

			if (!refreshToken) {
				console.warn("No refresh token available");
				return null;
			}

			const response = await api.post<TokenResponse>(
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
			console.error("Token refresh failed:", error);
			return null;
		} finally {
			refreshPromise = null;
		}
	})();

	return refreshPromise;
};

// Main DAL function
async function dal<T, ReqBody = any>(
	method: HttpMethod,
	url: string,
	config: DALConfig<ReqBody> = {}
): Result<T> {
	const {
		maxRetries = DEFAULT_CONFIG.maxRetries,
		retryDelay = DEFAULT_CONFIG.retryDelay,
		...restConfig
	} = config;

	let retryCount = 0;

	const executeRequest = async (accessToken: string | null): Result<T> => {
		try {
			const response = await api.request<T>({
				method,
				url,
				data: config.body,
				params: config.params,
				headers: {
					...config.headers,
					...(accessToken && {
						Cookie: `access_token=${accessToken}`,
					}),
				},
				...restConfig,
			});

			return [response.data, null];
		} catch (error) {
			if (axios.isAxiosError(error)) {
				// Handle 401 - Unauthorized
				if (error.response?.status === 401) {
					const newToken = await refreshAccessToken();
					if (newToken) {
						return executeRequest(newToken);
					}

					// If refresh failed, return auth error
					return [
						null,
						{
							statusCode: 401,
							message: "Session expired",
							error: "Please sign in again",
							isRetryable: false,
						},
					];
				}

				// Handle retryable errors
				if (isRetryableError(error) && retryCount < maxRetries) {
					retryCount++;
					const delay = getRetryDelay(retryCount, retryDelay);
					await new Promise((resolve) => setTimeout(resolve, delay));
					return executeRequest(accessToken);
				}

				// Handle HTTP errors
				if (error.response) {
					const data = error.response.data;
					return [
						null,
						{
							statusCode: error.response.status,
							message: data?.message ?? "API unavailable",
							error: data?.error ?? "Unknown error",
							isRetryable: isRetryableError(error),
						},
					];
				}

				// Handle network errors
				if (error.request) {
					return [
						null,
						{
							statusCode: 502,
							message: "API unavailable",
							error: "Network error",
							isRetryable: true,
						},
					];
				}
			}

			// Handle unexpected errors
			console.error("Unexpected error:", error);
			return [
				null,
				{
					statusCode: 503,
					message: "Internal error",
					error: "Unexpected error",
					isRetryable: true,
				},
			];
		}
	};

	// Get initial access token
	const cookieStore = await cookies();
	let accessToken = cookieStore.get("access_token")?.value;

	if (!accessToken) {
		accessToken = await refreshAccessToken();
	}

	return executeRequest(accessToken);
}

// HTTP method helpers
export const http = {
	get<T>(url: string, config?: Omit<DALConfig, "body">) {
		return dal<T>("GET", url, config);
	},

	post<T, B = any>(url: string, body?: B, config?: Omit<DALConfig, "body">) {
		return dal<T, B>("POST", url, { ...config, body });
	},

	put<T, B = any>(url: string, body?: B, config?: Omit<DALConfig, "body">) {
		return dal<T, B>("PUT", url, { ...config, body });
	},

	delete<T>(url: string, config?: DALConfig) {
		return dal<T>("DELETE", url, config);
	},

	patch<T, B = any>(url: string, body?: B, config?: Omit<DALConfig, "body">) {
		return dal<T, B>("PATCH", url, { ...config, body });
	},
};

export default http;
