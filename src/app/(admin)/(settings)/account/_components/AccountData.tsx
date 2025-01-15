'use client'

import { useAccount } from '../_hooks/useAccount'
import { useAuth } from '@/lib/store/auth'
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

export default function AccountData() {
  const { user } = useAuth()
  const { data: account, isLoading, error } = useAccount(user?.id || '')

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Datos de la cuenta</CardTitle>
          <CardDescription>Cargando información...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription className="text-red-500">
            {error.message}
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!account) return null

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
          <p className="text-sm">{account.name}</p>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Email</label>
          <p className="text-sm">{account.email}</p>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Teléfono</label>
          <p className="text-sm">{account.phone || 'No especificado'}</p>
        </div>

        {/* {account.lastLogin && (
          <div className="grid gap-2">
            <label className="text-sm font-medium">Último acceso</label>
            <p className="text-sm">
              {format(new Date(account.lastLogin), "dd 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
            </p>
          </div>
        )} */}

        <div className="grid gap-2">
          <label className="text-sm font-medium">Roles</label>
          <div className="flex flex-wrap gap-2">
            {account.roles?.map((role: any) => (
              <Badge key={role.id} variant="outline">
                {role.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


