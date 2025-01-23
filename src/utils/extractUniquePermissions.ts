import { Permission, Role } from "@/types";

export const extractUniquePermissions = (data: Role) => {
    const permissionsSet = new Set();
    const uniquePermissions: Permission[] = [];

    data.rolPermissions.forEach((rolePermission) => {
        rolePermission.permissions.forEach((permission) => {
            if (!permissionsSet.has(permission.id)) {
                permissionsSet.add(permission.id);
                uniquePermissions.push(permission);
            }
        });
    });

    return uniquePermissions;
};
