'use client';

import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';
const LOGGED_IN = 'logged_in';

interface JWTPayload {
  exp: number;
}

interface TokenState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setTokens: (cookies: Array<string>) => void;
  clearTokens: () => void;
  shouldRefreshToken: () => boolean;
}

// Funciones auxiliares para manejar cookies
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue || null;
  }
  return null;
};

const setCookie = (cookieString: string) => {
  if (typeof document !== 'undefined') {
    document.cookie = cookieString;
  }
};

const deleteCookie = (name: string) => {
  if (typeof document !== 'undefined') {
    document.cookie = `${name}=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
  }
};

// Función para calcular la expiración del token
const tokenExpiration = (token: string): number => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const expirationMs = decoded.exp * 1000;
    const now = Date.now();
    const secondsToExpiration = (expirationMs - now) / 1000;
    return secondsToExpiration > 0 ? secondsToExpiration : 0;
  } catch {
    return 0;
  }
};

const useTokenStore = create<TokenState>()((set, get) => ({
  accessToken: getCookie(ACCESS_TOKEN),
  refreshToken: getCookie(REFRESH_TOKEN),
  isAuthenticated: !!getCookie(LOGGED_IN),
  
  setTokens: (cookies: Array<string>) => {
    // Limpiar cookies existentes
    deleteCookie(ACCESS_TOKEN);
    deleteCookie(REFRESH_TOKEN);
    deleteCookie(LOGGED_IN);

    // Establecer nuevas cookies
    cookies.forEach(cookie => {
      setCookie(cookie);
    });

    // Actualizar el estado
    set({
      accessToken: getCookie(ACCESS_TOKEN),
      refreshToken: getCookie(REFRESH_TOKEN),
      isAuthenticated: true
    });
  },
  
  clearTokens: () => {
    deleteCookie(ACCESS_TOKEN);
    deleteCookie(REFRESH_TOKEN);
    deleteCookie(LOGGED_IN);
    set({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false
    });
  },

  shouldRefreshToken: () => {
    const { accessToken, refreshToken } = get();
    if (!accessToken || !refreshToken) return false;

    // Si el access token expira en menos de 60 segundos
    const accessExpiration = tokenExpiration(accessToken);
    if (accessExpiration < 60) {
      // Verificar que el refresh token no esté por expirar
      const refreshExpiration = tokenExpiration(refreshToken);
      return refreshExpiration >= 5;
    }
    return false;
  }
}));

export const useTokens = () => {
  const store = useTokenStore();
  return {
    accessToken: store.accessToken,
    refreshToken: store.refreshToken,
    isAuthenticated: store.isAuthenticated,
    setTokens: store.setTokens,
    clearTokens: store.clearTokens,
    shouldRefreshToken: store.shouldRefreshToken
  };
};
