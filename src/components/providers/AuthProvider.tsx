'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/store/auth'
import { useRouter, usePathname } from 'next/navigation'
import { clientFetch } from '@/utils/clientFetch'
import { Profile } from '@/app/(auth)/types'
import { useAuthStore } from '@/lib/store/auth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, setUser } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Hidratar el store
  useEffect(() => {
    useAuthStore.persist.rehydrate()
  }, [])

  // Inicializar auth
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Si hay token pero no hay usuario, intentamos obtener el perfil
        if (!user && document.cookie.includes('access_token')) {
          const profile = await clientFetch<Profile>('/profile')
          setUser(profile)
        }
      } catch (error) {
        console.error('Error inicializando auth:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    // Solo inicializamos si no hay usuario en el store
    if (!user) {
      initAuth()
    } else {
      setIsLoading(false)
    }
  }, [user, setUser])

  // Protección de rutas
  useEffect(() => {
    const publicRoutes = ['/sign-in', '/sign-up', '/forgot-password']
    const isPublicRoute = publicRoutes.includes(pathname)

    if (!isLoading) {
      if (!user && !isPublicRoute) {
        router.replace('/sign-in')
      } else if (user && isPublicRoute) {
        router.replace('/')
      }
    }
  }, [user, isLoading, pathname, router])

  // Mostrar un loading silencioso durante la hidratación
  if (isLoading) {
    return <>{children}</>
  }

  return <>{children}</>
}