'use client'

import { useAuth } from '@/app/(auth)/sign-in/_hooks/useAuth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useProfile } from '../_hooks/useProfile'

export default function AccountData() {
  const { user } = useAuth()
  const { profile } = useProfile()

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Datos de la cuenta</CardTitle>
          <CardDescription>No hay información disponible</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos de la cuenta</CardTitle>
        <CardDescription>
          Información detallada de tu cuenta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Nombre</label>
          <p className="text-sm">{profile.name}</p>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Email</label>
          <p className="text-sm">{profile.email}</p>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Teléfono</label>
          <p className="text-sm">{profile.phone || 'No especificado'}</p>
        </div>

        {user?.lastLogin && (
          <div className="grid gap-2">
            <label className="text-sm font-medium">Último acceso</label>
            <p className="text-sm">
              {format(new Date(user?.lastLogin), "dd 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
            </p>
          </div>
        )}

        <div className="grid gap-2">
          <label className="text-sm font-medium">Roles</label>
          <div className="flex flex-wrap gap-2">
            
              <Badge variant="outline">
                {profile.roles[0].name}
              </Badge>
           
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
