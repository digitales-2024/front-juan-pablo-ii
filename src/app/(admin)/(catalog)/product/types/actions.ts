"use server";
import { serverFetch } from "@/utils/serverFetch";
import { TypeProduct, CreateTypeProductInput, UpdateTypeProductInput } from "./types";

/**
 * Función para obtener todos los tipos de productos.
 *
 * Esta función envía una solicitud al servidor para recuperar todos los tipos de productos.
 * Si se produce un error durante la búsqueda, se lanza un error.
 *
 * @returns {Promise<TypeProduct[]>} Una promesa que resuelve una matriz de tipos de productos.
 * @throws Lanzará un error si el proceso de recuperación falla.
 */
export async function getAllTypeProducts(): Promise<TypeProduct[]> {
    const [response, error] = await serverFetch<TypeProduct[]>("/type-product");

    if (error) {
        throw new Error("Error fetching type products");
    }

    return response;
}

/**
 * Función para crear un nuevo tipo de producto.
 *
 * Esta función envía una solicitud al servidor para crear un nuevo tipo de producto.
 * Si se produce un error durante la creación, se lanza un error.
 *
 * @param {CreateTypeProductInput} data - La información del tipo de producto que se va a crear.
 * @returns {Promise<TypeProduct>} Una promesa que resuelve con el tipo de producto recién creado.
 * @throws Lanza un error si el proceso de creación falla.
 */
export async function createTypeProduct(data: CreateTypeProductInput): Promise<TypeProduct> {
    const [response, error] = await serverFetch<TypeProduct>("/type-product", {
        method: "POST",
        body: JSON.stringify(data),
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (error) {
        throw new Error("Error creating type product");
    }

    return response;
}

/**
 * Función para obtener un tipo de producto por su ID.
 *
 * Esta función envía una solicitud al servidor para obtener un tipo de producto por su ID.
 * Si se produce un error durante la recuperación, se lanza un error.
 *
 * @param {string} id - El ID del tipo de producto que se va a recuperar.
 * @returns {Promise<TypeProduct>} Una promesa que resuelve con el tipo de producto recuperado.
 * @throws Lanza un error si el proceso de recuperación falla.
 */
export async function getTypeProductById(id: string): Promise<TypeProduct> {
    const [response, error] = await serverFetch<TypeProduct>(`/type-product/${id}`);

    if (error) {
        throw new Error("Error fetching type product");
    }

    return response;
}

/**
 * Función para actualizar un tipo de producto existente.
 *
 * Esta función envía una solicitud al servidor para actualizar un tipo de producto específico
 * utilizando su ID y los datos de actualización proporcionados.
 * Si se produce un error durante la actualización, se lanza un error.
 *
 * @param {string} id - El ID del tipo de producto que se va a actualizar.
 * @param {UpdateTypeProductInput} data - Los datos de actualización del tipo de producto.
 * @returns {Promise<TypeProduct>} Una promesa que resuelve con el tipo de producto actualizado.
 * @throws Lanza un error si el proceso de actualización falla.
 */
export async function updateTypeProduct(id: string, data: UpdateTypeProductInput): Promise<TypeProduct> {
    const [response, error] = await serverFetch<TypeProduct>(`/type-product/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (error) {
        throw new Error("Error updating type product");
    }

    return response;
}

/**
 * Función para desactivar múltiples tipos de productos.
 *
 * Esta función envía una solicitud al servidor para desactivar varios tipos de productos
 * utilizando sus IDs.
 * Si se produce un error durante la desactivación, se lanza un error.
 *
 * @param {string[]} ids - Los IDs de los tipos de productos que se van a desactivar.
 * @returns {Promise<TypeProduct[]>} Una promesa que resuelve con los tipos de productos desactivados.
 * @throws Lanza un error si el proceso de desactivación falla.
 */
export async function deleteManyTypeProducts(ids: string[]): Promise<TypeProduct[]> {
    const [response, error] = await serverFetch<TypeProduct[]>(`/type-product/remove/all`, {
        method: "DELETE",
        body: JSON.stringify({ ids }),
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (error) {
        throw new Error("Error deleting type products");
    }

    return response;
}

/**
 * Función para reactivar múltiples tipos de productos.
 *
 * Esta función envía una solicitud al servidor para reactivar varios tipos de productos
 * utilizando sus IDs.
 * Si se produce un error durante la reactivación, se lanza un error.
 *
 * @param {string[]} ids - Los IDs de los tipos de productos que se van a reactivar.
 * @returns {Promise<TypeProduct[]>} Una promesa que resuelve con los tipos de productos reactivados.
 * @throws Lanza un error si el proceso de reactivación falla.
 */
export async function reactivateManyTypeProducts(ids: string[]): Promise<TypeProduct[]> {
    const [response, error] = await serverFetch<TypeProduct[]>(`/type-product/reactivate/all`, {
        method: "PATCH",
        body: JSON.stringify({ ids }),
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (error) {
        throw new Error("Error reactivating type products");
    }

    return response;
}