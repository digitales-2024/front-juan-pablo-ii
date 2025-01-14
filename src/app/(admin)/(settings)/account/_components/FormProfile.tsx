"use client"

import { useAuth } from '@/lib/store/auth'
import { useEffect } from 'react'
import { Profile } from '@/app/(auth)/types'
import { ProfilePersonalData } from './ProfilePersonalData'
import { ProfileAccountStatus } from './ProfileAccountStatus'
import { ProfileRolesPermissions } from './ProfileRolesPermissions'

interface FormProfileProps {
  profile: Profile
}

export default function FormProfile({ profile: serverProfile }: FormProfileProps) {
  const { user, setUser } = useAuth()
  
  useEffect(() => {
    if (!user && serverProfile) {
      setUser(serverProfile);
    }
  }, [serverProfile, setUser, user]);

  const profile = user || serverProfile

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Información del Perfil</h3>
        <p className="text-sm text-muted-foreground">
          Aquí puedes ver y actualizar tu información de perfil
        </p>
      </div>
      
      <div className="grid gap-6">
        <ProfilePersonalData profile={profile} />
        {/* <ProfileAccountStatus profile={profile} /> */}
        {/* <ProfileRolesPermissions profile={profile} /> */}

       
      </div>
    </div>
  )
}

