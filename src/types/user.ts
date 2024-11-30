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

export type UserProfileOutput = {
    password: string;
    newPassword: string;
    confirmPassword: string;
};

export type Role = {
    id: string;
    name: string;
};

export type UserLoginInput = {
    email: string;
    password: string;
};

export type UserLoginOutput = {
    id: string;
    name: string;
    email: string;
    phone: string;
    roles: { id: string; name: string }[];
};

export type UserLogin = {
    id: string;
    name: string;
    email: string;
    phone: string;
    roles: { id: string; name: string }[];
};
