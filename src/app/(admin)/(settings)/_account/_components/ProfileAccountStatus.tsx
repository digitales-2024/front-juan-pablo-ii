import { Badge } from "@/components/ui/badge"
import { Profile } from '@/app/(auth)/types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface ProfileAccountStatusProps {
  profile: Profile;
}

type BadgeVariant = "default" | "destructive" | "secondary" | "outline";

type StatusItem = {
  id: string;
  label: string;
  value: string;
  badge?: boolean;
  variant?: BadgeVariant;
}

export function ProfileAccountStatus({ profile }: ProfileAccountStatusProps) {
  const accountStatus: StatusItem[] = [
    { 
      id: 'status',
      label: "Estado", 
      value: profile.isActive ? 'Activo' : 'Inactivo',
      badge: true,
      variant: profile.isActive ? "default" : "destructive"
    },
    { 
      id: 'lastLogin',
      label: "Último acceso", 
      value: profile.lastLogin 
        ? format(new Date(profile.lastLogin), "dd 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })
        : 'No disponible'
    },
    {
      id: 'passwordChange',
      label: "Cambio de contraseña requerido",
      value: profile.mustChangePassword ? 'Sí' : 'No',
      badge: true,
      variant: profile.mustChangePassword ? "destructive" : "default"
    }
  ]

  return (
    <div className="grid gap-4">
      <h4 className="text-md font-medium">Estado de la Cuenta</h4>
      <div className="grid gap-3">
        {accountStatus.map((item) => (
          <div key={item.id} className="grid gap-1">
            <label className="text-sm font-medium">{item.label}</label>
            {item.badge ? (
              <Badge variant={item.variant}>
                {item.value}
              </Badge>
            ) : (
              <p className="text-sm">{item.value}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 