import { serverFetch } from "../utils/serverFetch";

export type Role = {
    id: string;
    name: string;
};

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

interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

interface UseProfileResponse {
    user: User | null;
    noencontrado: boolean;
}

export async function useProfile(email: string, password: string): Promise<UseProfileResponse> {
    // Autenticar al usuario
    const [loginResponse, loginError] = await serverFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (loginError) {
        console.error("Error logging in:", loginError);
        return { user: null, noencontrado: true };
    }

    const { user } = loginResponse;

    // Devolver el objeto de usuario completo y el indicador de encontrado
    return { user, noencontrado: false };
}