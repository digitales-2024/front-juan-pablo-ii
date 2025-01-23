export type Client = {
    id: string;
    name: string;
    rucDni: string;
    address: string;
    phone: string;
    department: string;
    province: string;
    isActive: boolean;
};

export type ClientWithDescription = {
    id: string;
    name: string;
    rucDni: string;
    address: string;
    phone: string;
    department: string;
    province: string;
    isActive: boolean;
    description: Client[];
};
