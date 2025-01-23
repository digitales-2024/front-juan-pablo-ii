export interface Permission {
  id: string;
  cod: string;
  name: string;
  description: string;
}

export interface Module {
  id: string;
  cod: string;
  name: string;
  description: string;
}

export interface RolPermission {
  module: Module;
  permissions: Permission[];
}

export interface PermissionResponse {
  id: string;
  name: string;
  description: string;
  rolPermissions: RolPermission[];
}
