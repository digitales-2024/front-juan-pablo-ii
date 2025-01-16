import { http } from "@/utils/serverFetch";
import { ExtendedUser, UserResponse } from '../_interfaces/account.interface';

export async function getProfile(): Promise<UserResponse> {
    const response = await http.get<ExtendedUser>('/profile');
    
    if (response[1]) {
        throw new Error(response[1].message);
    }

    const account = response[0];
    return {
        name: account.name,
        email: account.email,
        phone: account.phone,
        isSuperAdmin: account.isSuperAdmin,
        roles: account.roles?.map(role => ({ name: role.name })),
        lastLogin: account.lastLogin ? new Date(account.lastLogin) : undefined
    };
}