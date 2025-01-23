export type Credentials = {
    email: string;
    password: string;
};

export type UserLogin = {
    id: string;
    name: string;
    email: string;
    phone: string;
    roles: { id: string; name: string }[];
};
