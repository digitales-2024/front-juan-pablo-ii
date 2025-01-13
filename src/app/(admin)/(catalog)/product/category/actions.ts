"use server";
import { serverFetch } from "@/utils/serverFetch";
import { Category, CreateCategoryInput, UpdateCategoryInput } from "./types";

/**
* Funcionar para obtener todas las categorías.
*
* Esta función envía una solicitud al servidor para recuperar todas las categorías.
* Si se produce un error durante la búsqueda, se lanza un error.
*
* @returns {promesa <categoría []>} Una promesa que resuelve una matriz de categorías.
* @throws lanzará un error si el proceso de recuperación falla.
*/
export async function getAllCategories(): Promise<Category[]> {
    const [response, error] = await serverFetch<Category[]>("/category");

    if (error) {
        throw new Error("Error fetching categories");
    }

    return response;
}

/**
 * Función para crear una nueva categoría.
 *
 * Esta función envía una solicitud al servidor para crear una nueva categoría.
 * Si se produce un error durante la creación, se lanza un error.
 *
 * @param {CreateCategoryInput} data - La información de la categoría que se va a crear.
 * @returns {promesa <categoría>} Una promesa que resuelve con la categoría recién creada.
 * @throws Lanza un error si el proceso de creación falla.
 */
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

/**
 * Función para obtener una categoría por su ID.
 *
 * Esta función envía una solicitud al servidor para obtener una categoría por su ID.
 * Si se produce un error durante la recuperación, se lanza un error.
 *
 * @param {string} id - El ID de la categoría que se va a recuperar.
 * @returns {promesa <categoría>} Una promesa que resuelve con la categoría recuperada.
 * @throws Lanza un error si el proceso de recuperación falla.
 */
export async function getCategoryById(id: string): Promise<Category> {
    const [response, error] = await serverFetch<Category>(`/category/${id}`);

    if (error) {
        throw new Error("Error fetching category");
    }

    return response;
}

/**
 * Función para actualizar una categoría existente.
 *
 * Esta función envía una solicitud al servidor para actualizar una categoría específica
 * utilizando su ID y los datos de actualización proporcionados.
 * Si se produce un error durante la actualización, se lanza un error.
 *
 * @param {string} id - El ID de la categoría que se va a actualizar.
 * @param {UpdateCategoryInput} data - Los datos de actualización de la categoría.
 * @returns {Promise<Category>} Una promesa que resuelve con la categoría actualizada.
 * @throws Lanza un error si el proceso de actualización falla.
 */
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

/**
 * Función para desactivar múltiples categorías.
 *
 * Esta función envía una solicitud al servidor para desactivar varias categorías
 * utilizando sus IDs.
 * Si se produce un error durante la desactivación, se lanza un error.
 *
 * @param {string[]} ids - Los IDs de las categorías que se van a desactivar.
 * @returns {Promise<Category[]>} Una promesa que resuelve con las categorías
 * desactivadas.
 * @throws Lanza un error si el proceso de desactivación falla.
 */
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

/**
 * Función para reactivar múltiples categorías.
 *
 * Esta función envía una solicitud al servidor para reactivar varias categorías
 * utilizando sus IDs.
 * Si se produce un error durante la reactivación, se lanza un error.
 *
 * @param {string[]} ids - Los IDs de las categorías que se van a reactivar.
 * @returns {Promise<Category[]>} Una promesa que resuelve con las categorías
 * reactivadas.
 * @throws Lanza un error si el proceso de reactivación falla.
 */
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
