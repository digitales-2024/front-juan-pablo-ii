'use client';

import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

// Constantes para los nombres de las cookies
const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';
const LOGGED_IN = 'logged_in';

/**
 * @interface JWTPayload
 * @description Interfaz que define la estructura del payload de un token JWT
 * @property {number} exp - Timestamp de expiración del token
 */
interface JWTPayload {
  exp: number;
}

/**
 * @interface TokenState
 * @description Interfaz que define el estado de los tokens de autenticación
 * @property {string | null} accessToken - Token de acceso actual
 * @property {string | null} refreshToken - Token de actualización
 * @property {boolean} isAuthenticated - Estado de autenticación del usuario
 * @property {function} setTokens - Función para establecer nuevos tokens
 * @property {function} clearTokens - Función para limpiar todos los tokens
 * @property {function} shouldRefreshToken - Función que determina si el token debe ser actualizado
 */
interface TokenState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setTokens: (cookies: Array<string>) => void;
  clearTokens: () => void;
  shouldRefreshToken: () => boolean;
}

// Funciones auxiliares para manejar cookies

/**
 * Obtiene el valor de una cookie por su nombre
 * @param name - Nombre de la cookie a buscar
 * @returns {string | null} Valor de la cookie o null si no existe
 */
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

/**
 * Establece una nueva cookie en el navegador
 * @param cookieString - String completo de la cookie a establecer
 */
const setCookie = (cookieString: string) => {
  if (typeof document !== 'undefined') {
    document.cookie = cookieString;
  }
};

/**
 * Elimina una cookie específica
 * @param name - Nombre de la cookie a eliminar
 */
const deleteCookie = (name: string) => {
  if (typeof document !== 'undefined') {
    document.cookie = `${name}=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
  }
};

/**
 * Calcula el tiempo restante de expiración de un token JWT
 * @param token - Token JWT a analizar
 * @returns {number} Segundos restantes hasta la expiración (0 si ya expiró o es inválido)
 */
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

/**
 * Store de Zustand para manejar los tokens de autenticación
 * Provee funciones para gestionar tokens y el estado de autenticación
 */
const useTokenStore = create<TokenState>()((set, get) => ({
  accessToken: getCookie(ACCESS_TOKEN),
  refreshToken: getCookie(REFRESH_TOKEN),
  isAuthenticated: !!getCookie(LOGGED_IN),
  
  /**
   * Establece nuevos tokens a partir de un array de cookies
   * @param cookies - Array de strings con las cookies a establecer
   */
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
  
  /**
   * Limpia todos los tokens y marca al usuario como no autenticado
   */
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

  /**
   * Determina si el token de acceso necesita ser actualizado
   * @returns {boolean} true si el token debe actualizarse (expira en menos de 60 segundos)
   */
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
