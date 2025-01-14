import { Badge } from "@/components/ui/badge"
import { Profile } from '@/app/(auth)/types'

interface ProfileRolesPermissionsProps {
  profile: Profile;
}

export function ProfileRolesPermissions({ profile }: ProfileRolesPermissionsProps) {
  return (
    <div className="grid gap-4">
      <h4 className="text-md font-medium">Roles y Permisos</h4>
      <div className="grid gap-3">
        <div className="grid gap-1">
          <label className="text-sm font-medium">Tipo de usuario</label>
          <Badge variant={profile.isSuperAdmin ? "default" : "secondary"}>
            {profile.isSuperAdmin ? 'Super Administrador' : 'Usuario Regular'}
          </Badge>
        </div>
        <div className="grid gap-1">
          <label className="text-sm font-medium">Roles asignados</label>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(profile.roles) && profile.roles.length > 0 ? (
              profile.roles.map((role) => (
                <Badge key={`role-${role.id}`} variant="outline">
                  {role.name}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">
                Sin roles asignados
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}