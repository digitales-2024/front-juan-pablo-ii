'use client';

import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function QueryProvider({ children }: ProvidersProps) {
  const router = useRouter();

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
              router.replace('/sign-in');
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