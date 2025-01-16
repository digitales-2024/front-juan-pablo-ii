import { getCookie } from '@/lib/store/auth'

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function clientFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { ...fetchOptions } = options;
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`;
  const accessToken = getCookie('access_token');
  const refreshToken = getCookie('refresh_token');

  fetchOptions.headers = {
    ...fetchOptions.headers,
    Cookie: `refresh_token=${refreshToken}; access_token=${accessToken}`,
  };

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    throw new Error('Error en la petición');
  }

  return response.json();
}