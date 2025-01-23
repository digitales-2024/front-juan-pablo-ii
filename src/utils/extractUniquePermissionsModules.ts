import { ModulePermissions, Permission } from "@/types";

export const extractUniquePermissionsModules = (data: ModulePermissions[]) => {
    const permissionsSet = new Set();
    const uniquePermissions: Permission[] = [];

    data.forEach((rolePermission) => {
        rolePermission.permissions.forEach((permission) => {
            if (!permissionsSet.has(permission.id)) {
                permissionsSet.add(permission.id);
                uniquePermissions.push(permission);
            }
        });
    });

    return uniquePermissions;
};
