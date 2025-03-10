"use server";

import { http } from "@/utils/serverFetch";
import {
    UserResponseDto,
    UserCreateDto,
    SendEmailDto,
    UserUpdateDto,
} from "./types";
import { BaseApiResponse } from "@/types/api/types";
import { revalidatePath } from "next/cache";

type GetUsersResponse = UserResponseDto[] | { error: string };
type CreateUserResponse = BaseApiResponse | { error: string };
type DeleteUserResponse = BaseApiResponse | { error: string };

export async function getUsers(): Promise<GetUsersResponse> {
    try {
        const [users, error] = await http.get<UserResponseDto[]>("/users");

        if (error) {
            return { error: error.message };
        }
		console.log("🚀 ~ getUsers ~ users:", users)
        return users;
    } catch (error) {
        if (error instanceof Error) return { error: error.message };
        return { error: "Error desconocido" };
    }
    
}

export async function createUser(
    data: UserCreateDto
): Promise<CreateUserResponse> {
    try {
        const [user, error] = await http.post<BaseApiResponse>("/users", data);

        if (error) {
            return { error: error.message };
        }
        
        // Invalidar la caché para que getUsers() se vuelva a ejecutar
        revalidatePath('/users');
        return user;
    } catch (error) {
        if (error instanceof Error) return { error: error.message };
        return { error: "Error desconocido" };
    }
}

export async function updateUser(
    id: string,
    data: UserUpdateDto
): Promise<CreateUserResponse> {
    try {
        const [user, error] = await http.patch<BaseApiResponse>(
            `/users/${id}`,
            data
        );

        if (error) {
            return { error: error.message };
        }

        // Invalidar la caché para que getUsers() se vuelva a ejecutar
        revalidatePath('/users');
        return user;
    } catch (error) {
        if (error instanceof Error) return { error: error.message };
        return { error: "Error desconocido" };
    }
}

export async function deleteUser(id: string): Promise<DeleteUserResponse> {
    try {
        const [response, error] = await http.delete<BaseApiResponse>(
            `/users/${id}`
        );

        if (error) {
            return { error: error.message };
        }

        // Invalidar la caché para que getUsers() se vuelva a ejecutar
        revalidatePath('/users');
        return response;
    } catch (error) {
        if (error instanceof Error) return { error: error.message };
        return { error: "Error desconocido" };
    }
}

export async function reactivateUser(id: string): Promise<DeleteUserResponse> {
    try {
        const [response, error] = await http.patch<BaseApiResponse>(
            `/users/reactivate/${id}`
        );

        if (error) {
            return { error: error.message };
        }

        // Invalidar la caché para que getUsers() se vuelva a ejecutar
        revalidatePath('/users');
        return response;
    } catch (error) {
        if (error instanceof Error) return { error: error.message };
        return { error: "Error desconocido" };
    }
}

export async function sendNewPassword(
    data: SendEmailDto
): Promise<{ error?: string }> {
    try {
        const [, error] = await http.post(`/users/send-new-password`, data);

        if (error) {
            return { error: error.message };
        }

        return {};
    } catch (error) {
        if (error instanceof Error) return { error: error.message };
        return { error: "Error desconocido" };
    }
}