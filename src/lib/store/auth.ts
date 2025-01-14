'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Profile } from '@/app/(auth)/types'

const ACCESS_TOKEN = 'access_token'
const REFRESH_TOKEN = 'refresh_token'
const LOGGED_IN = 'logged_in'

interface AuthState {
  user: Profile | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: Profile | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

// Funciones auxiliares para manejar cookies
export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift()
    return cookieValue || null
  }
  return null
}

export const setCookie = (name: string, value: string) => {
  if (typeof document !== 'undefined') {
    document.cookie = `${name}=${value};path=/;`
  }
}

export const deleteCookie = (name: string) => {
  if (typeof document !== 'undefined') {
    document.cookie = `${name}=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: getCookie(ACCESS_TOKEN),
      refreshToken: getCookie(REFRESH_TOKEN),
      isAuthenticated: false,
      isLoading: true,
      
      setUser: (user) => set({ 
        user,
        isAuthenticated: !!user,
        isLoading: false
      }),

      setTokens: (accessToken: string, refreshToken: string) => {
        setCookie(ACCESS_TOKEN, accessToken);
        setCookie(REFRESH_TOKEN, refreshToken);
        setCookie(LOGGED_IN, 'true');
        
        set({ 
          accessToken, 
          refreshToken, 
          isAuthenticated: true 
        })
      },

      logout: () => {
        deleteCookie(ACCESS_TOKEN)
        deleteCookie(REFRESH_TOKEN)
        deleteCookie(LOGGED_IN)
        set({ 
          user: null, 
          accessToken: null, 
          refreshToken: null, 
          isAuthenticated: false 
        })
      }
    }),
    {
      name: 'auth-storage',
      skipHydration: true, // Importante para evitar errores de hidratación
    }
  )
)

export const useAuth = () => {
  const store = useAuthStore()
  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    setUser: store.setUser,
    setTokens: store.setTokens,
    logout: store.logout
  }
} 