'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { Profile } from '@/app/(auth)/types'
import { http } from '@/utils/clientFetch';
import { ExtendedUser, toProfile } from '@/app/(admin)/(settings)/account/_interfaces/account.interface';

interface AuthState {
  user: Profile | null;
  setUser: (user: ExtendedUser | null) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      
      setUser: (user: ExtendedUser | null) => set({ 
        user: user ? toProfile(user) : null,
      }),

      logout: async () => {
        // Limpiar estado
        set({ user: null });
        
        // Limpiar cookies (mediante una llamada API)
        await http.post('/auth/logout');
        
        // Redirigir a login
        window.location.href = '/sign-in';
      }
    }),
    {
      name: 'auth-storage',
      skipHydration: true, // Importante para evitar errores de hidratación
      storage: createJSONStorage(() => localStorage),
    }
  )
)
