export type User = {
    id: string;
    name: string;
    email: string;
    phone: string;
    isActive: boolean;
    isSuperAdmin: boolean;
    mustChangePassword: boolean;
    lastLogin: string;
    roles: Role[];
};
export type Role = {
    id: string;
    name: string;
};