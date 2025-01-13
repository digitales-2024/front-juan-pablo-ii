"use server";
import { serverFetch } from "@/utils/serverFetch";
import { Category, CreateCategoryInput, UpdateCategoryInput } from "./types";

// Función para obtener todas las categorías
export async function getAllCategories(): Promise<Category[]> {
    const [response, error] = await serverFetch<Category[]>("/category");

    if (error) {
        throw new Error("Error fetching categories");
    }

    return response;
}

// Función para crear una nueva categoría
export async function createCategory(data: CreateCategoryInput): Promise<Category> {
    const [response, error] = await serverFetch<Category>("/category", {
        method: "POST",
        body: JSON.stringify(data),
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (error) {
        throw new Error("Error creating category");
    }

    return response;
}

// Función para obtener una categoría por su ID
export async function getCategoryById(id: string): Promise<Category> {
    const [response, error] = await serverFetch<Category>(`/category/${id}`);

    if (error) {
        throw new Error("Error fetching category");
    }

    return response;
}

// Función para actualizar una categoría existente
export async function updateCategory(id: string, data: UpdateCategoryInput): Promise<Category> {
    const [response, error] = await serverFetch<Category>(`/category/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (error) {
        throw new Error("Error updating category");
    }

    return response;
}

// Función para desactivar múltiples categorías
export async function deleteManyCategories(ids: string[]): Promise<Category[]> {
    const [response, error] = await serverFetch<Category[]>(`/category/remove/all`, {
        method: "DELETE",
        body: JSON.stringify({ ids }),
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (error) {
        throw new Error("Error deleting categories");
    }

    return response;
}

// Función para reactivar múltiples categorías
export async function reactivateManyCategories(ids: string[]): Promise<Category[]> {
    const [response, error] = await serverFetch<Category[]>(`/category/reactivate/all`, {
        method: "PATCH",
        body: JSON.stringify({ ids }),
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (error) {
        throw new Error("Error reactivating categories");
    }

    return response;
}