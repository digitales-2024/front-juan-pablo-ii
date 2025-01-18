'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { http } from '@/utils/clientFetch'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { signIn } from '../_actions/sign-in.action'
import { useRouter } from 'next/navigation'
import { Profile } from '../_interfaces/auth.interface'
import { LoginAuthDto } from '../_interfaces/auth.interface'

/**
 * @interface AuthState
 * @description Interfaz que define el estado de autenticación del usuario
 * @property {Profile | null} user - Perfil del usuario autenticado o null si no hay usuario
 * @property {boolean} isLoading - Indica si hay una operación de autenticación en curso
 * @property {boolean} isHydrated - Indica si el estado ha sido hidratado desde el almacenamiento
 * @property {function} setUser - Función para establecer los datos del usuario
 * @property {function} logout - Función asíncrona para cerrar la sesión del usuario
 */
interface AuthState {
  user: Profile | null
  isLoading: boolean
  isHydrated: boolean
  setUser: (user: Profile) => void
  logout: () => Promise<void>
}

/**
 * Hook personalizado para manejar el estado de autenticación
 * Utiliza Zustand para la gestión del estado y persist para mantener los datos en localStorage
 */
export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      isHydrated: false,
      
      /**
       * Establece los datos del usuario en el estado
       * @param user - Objeto con los datos del perfil del usuario
       */
      setUser: (user: Profile) => set({ 
        user: {
          ...user,
          roles: user.roles || [],
          lastLogin: user.lastLogin || undefined
        }
      }),

      /**
       * Cierra la sesión del usuario actual
       * Realiza una petición al endpoint de logout y limpia el estado
       */
      logout: async () => {
        set({ isLoading: true })
        try {
          const response = await http.post('/auth/logout')
          set({ user: null })
          // Solo redirigir si el logout fue exitoso
          if (response.data) {
            window.location.href = '/sign-in'
          }
        } catch (error) {
          // Ignorar el error de "Request aborted" ya que es esperado durante la redirección
          if (error instanceof Error && !error.message?.includes('Request aborted')) {
            console.error('Error durante el logout:', error)
          }
          // Aún así, limpiar el estado y redirigir
          set({ user: null })
          window.location.href = '/sign-in'
        } finally {
          set({ isLoading: false })
        }
      }
    }),
    {
      name: 'auth-storage', // Nombre del almacenamiento en localStorage
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: (state) => {
        return (state) => {
          if (state) {
            state.isHydrated = true
          }
          return state
        }
      }
    }
  )
)

/**
 * Hook personalizado para manejar el proceso de inicio de sesión
 * @returns {Object} Objeto de mutación con funciones y estado para el proceso de login
 */
export function useSignIn() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setUser } = useAuth()

  return useMutation({
    /**
     * Función principal de mutación para el inicio de sesión
     * @param credentials - Credenciales del usuario (email y contraseña)
     * @throws {Error} Si hay errores de validación o respuesta del servidor
     * @returns {Promise<any>} Datos del usuario autenticado
     */
    mutationFn: async (credentials: LoginAuthDto) => {
      const result = await signIn(credentials)
      console.log("🚀 ~ mutationFn: ~ result:", result)
      
      if (result.validationErrors) {
        throw new Error(Object.values(result.validationErrors).flat().join(', '))
      }

      if (result.error) {
        throw new Error(result.error)
      }

      if (!result.data) {
        throw new Error('No se recibieron datos del servidor')
      }

      return result.data
    },
    /**
     * Callback ejecutado cuando el inicio de sesión es exitoso
     * Transforma y almacena los datos del usuario en el estado
     * @param response - Respuesta del servidor con los datos del usuario
     */
    onSuccess: (response) => {
      // Transform the response data to match Profile type
      const profileData: Profile = {
        id: response.id,
        name: response.name,
        email: response.email,
        phone: response.phone,
        roles: response.roles || [],
        isSuperAdmin: response.isSuperAdmin,
        isActive: true,
        mustChangePassword: false,
        lastLogin: new Date().toISOString()
      }

      console.log("🚀 ~ useSignIn ~ profileData:", profileData)
      setUser(profileData)
      queryClient.invalidateQueries({ queryKey: ['user'] })
      router.push('/')
    },
    onError: (error: Error) => {
      console.error('Error en inicio de sesión:', error)
      throw error
    }
  })
}
