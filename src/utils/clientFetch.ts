import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';

interface FetchOptions extends Omit<AxiosRequestConfig, 'url'> {
  skipAuth?: boolean;
}

// Crear instancia de axios
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL,
  timeout: 5000,
  withCredentials: true,
  validateStatus: (status) => status >= 200 && status < 300,
});

// Interceptores para logs
api.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`🚀 [${config.method?.toUpperCase()}] ${config.url}`, {
        body: config.data,
        params: config.params,
      });
    }
    return config;
  },
  (error) => {
    console.error('❌ Error en la configuración de la petición:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`✅ [${response.status}] ${response.config.url}`, {
        data: response.data,
      });
    }
    return response;
  },
  (error: AxiosError) => {
    console.error('❌ Error en la respuesta:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export async function clientFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  try {
    const { data } = await api.request<T>({
      url: path,
      ...options,
    });
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || error.message;
      throw new Error(message);
    }
    throw error;
  }
}

// Métodos helper para mayor comodidad
export const http = {
  get: <T>(path: string, options?: Omit<FetchOptions, 'method' | 'data'>) =>
    clientFetch<T>(path, { ...options, method: 'GET' }),

  post: <T>(path: string, body?: any, options?: Omit<FetchOptions, 'method' | 'data'>) =>
    clientFetch<T>(path, {
      ...options,
      method: 'POST',
      data: body,
    }),

  put: <T>(path: string, body?: any, options?: Omit<FetchOptions, 'method' | 'data'>) =>
    clientFetch<T>(path, {
      ...options,
      method: 'PUT',
      data: body,
    }),

  delete: <T>(path: string, options?: Omit<FetchOptions, 'method' | 'data'>) =>
    clientFetch<T>(path, { ...options, method: 'DELETE' }),
};