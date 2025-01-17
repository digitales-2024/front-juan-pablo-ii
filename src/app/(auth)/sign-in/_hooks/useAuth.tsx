'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { http } from '@/utils/clientFetch'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { signIn } from '../_actions/sign-in.action'
import { useRouter } from 'next/navigation'
import { Profile } from '../_interfaces/auth.interface'
import { LoginAuthDto } from '../_interfaces/auth.interface'

interface AuthState {
  user: Profile | null
  isLoading: boolean
  isHydrated: boolean
  setUser: (user: Profile) => void
  logout: () => Promise<void>
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      isHydrated: false,
      
      setUser: (user: Profile) => set({ 
        user: {
          ...user,
          roles: user.roles || [],
          lastLogin: user.lastLogin || undefined
        }
      }),

      logout: async () => {
        set({ isLoading: true })
        try {
          await http.post('/auth/logout')
          set({ user: null })
          window.location.href = '/sign-in'
        } finally {
          set({ isLoading: false })
        }
      }
    }),
    {
      name: 'auth-storage',
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

export function useSignIn() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setUser } = useAuth()

  return useMutation({
    mutationFn: async (credentials: LoginAuthDto) => {
      const result = await signIn(credentials)
      console.log("🚀 ~ mutationFn: ~ result:", result)
      
      if (result.error) {
        throw new Error(result.error)
      }

      if (result.validationErrors) {
        throw new Error(Object.values(result.validationErrors).flat().join(', '))
      }

      if (!result.data) {
        throw new Error('No se recibieron datos del servidor')
      }

      return result.data
    },
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
