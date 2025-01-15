import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import axios from 'axios';

export const serverApi = axios.create({
  baseURL: `${process.env.BACKEND_URL}`,
  headers: {
    Cookie: '' // Inicialmente vacío
  }
});

// Agregar interceptor para request
serverApi.interceptors.request.use(async (config) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;
  
  config.headers.Cookie = `refresh_token=${refreshToken}; access_token=${accessToken}`;
  return config;
});

// Agregar interceptor para manejar refresh token
serverApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshResponse = await axios.post<any>(
          `${process.env.BACKEND_URL}/auth/refresh-token`,
          {},
          {
            headers: {
              Cookie: originalRequest.headers?.Cookie || '',
            },
            validateStatus: (status) => status === 200, // Solo acepta 200 como válido
          }
        );
        
        // Verificamos explícitamente que tengamos headers
        if (refreshResponse.headers['set-cookie']) {
          originalRequest.headers = {
            ...originalRequest.headers,
            Cookie: refreshResponse.headers['set-cookie'].join(';'),
          };
          return serverApi(originalRequest);
        }
      } catch (refreshError) {
        // Si hay error en el refresh, manejamos el logout
        try {
          await serverApi.post('/auth/logout');
        } catch (logoutError) {
          console.error('Error during logout:', logoutError);
        }
        return redirect('/sign-in');
      }
    }
    
    return Promise.reject(error);
  }
);