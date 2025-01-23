export type Role = {
    id: string;
    name: string;
    description: string;
    isActive?: boolean;
    rolPermissions: RolPermissions[];
};

export type RolPermissions = {
    id: string;
    module: Module;
    permissions: Permission[];
};

export interface Module {
    id: string;
    cod: string;
    name: string;
    description: string;
}

export interface Permission {
    id: string;
    cod: string;
    name: string;
    description: string;
    idModulePermission?: string;
}

export interface ModulePermissions {
    module: Module;
    permissions: {
        id: string;
        cod: string;
        name: string;
        description: string;
        idModulePermission: string;
    }[];
}
