'use client';

import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { useTokens } from '@/hooks/useTokens';
import { http } from '@/utils/clientFetch';

interface ProvidersProps {
  children: ReactNode;
}

export function QueryProvider({ children }: ProvidersProps) {
  const router = useRouter();
  const { accessToken, refreshToken, setTokens, clearTokens, shouldRefreshToken } = useTokens();
  const [refreshingToken, setRefreshingToken] = useState(false);

  const refreshAuthToken = async () => {
    if (!refreshingToken && accessToken && refreshToken) {
      try {
        setRefreshingToken(true);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
          method: 'POST',
          headers: {
            Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}`
          }
        });

        // Obtener las nuevas cookies
        const newCookies = response.headers.getSetCookie();

        if (!newCookies || newCookies.length === 0) {
          throw new Error('El refresh fue exitoso, pero no contenía nuevas cookies');
        }

        // Actualizar las cookies
        setTokens(newCookies);
      } catch {
        clearTokens();
        router.replace('/sign-in');
      } finally {
        setRefreshingToken(false);
      }
    }
  };

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30000, // 30 seconds
            retry: (failureCount, error: any) => {
              // No reintentar para errores de autenticación
              if (error?.response?.status === 401) {
                return false;
              }
              // Reintentar otros errores una vez
              return failureCount <= 1;
            },
          },
        },
        queryCache: new QueryCache({
          onError: async (error: any) => {
            if (error?.response?.status === 401) {
              // Verificar si debemos refrescar el token
              if (shouldRefreshToken()) {
                await refreshAuthToken();
              } else {
                clearTokens();
                router.replace('/sign-in');
              }
            }
          },
        }),
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}