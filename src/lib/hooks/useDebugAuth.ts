import { useEffect } from 'react'
import { useAuth } from '@/lib/store/auth'

export function useDebugAuth() {
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    console.log('Estado de autenticación:', {
      isAuthenticated,
      user
    })
  }, [isAuthenticated, user])
} 