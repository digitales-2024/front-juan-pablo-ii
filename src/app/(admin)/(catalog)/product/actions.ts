import { serverFetch } from "@/utils/serverFetch";
import { Product, CreateProductInput, UpdateProductInput } from "./types";

// Función para obtener todos los productos
export async function getAllProducts(): Promise<Product[]> {
    const [response, error] = await serverFetch<Product[]>("/product");

    if (error) {
        throw new Error("Error fetching products");
    }

    return response;
}

// Función para crear un nuevo producto
export async function createProduct(data: CreateProductInput): Promise<Product> {
    const [response, error] = await serverFetch<Product>("/product", {
        method: "POST",
        body: JSON.stringify(data),
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (error) {
        throw new Error("Error creating product");
    }

    return response;
}

// Función para obtener un producto por su ID
export async function getProductById(id: string): Promise<Product> {
    const [response, error] = await serverFetch<Product>(`/product/${id}`);

    if (error) {
        throw new Error("Error fetching product");
    }

    return response;
}

// Función para actualizar un producto existente
export async function updateProduct(id: string, data: UpdateProductInput): Promise<Product> {
    const [response, error] = await serverFetch<Product>(`/product/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (error) {
        throw new Error("Error updating product");
    }

    return response;
}

// Función para eliminar un producto
export async function deleteProduct(id: string): Promise<void> {
    const [response, error] = await serverFetch<void>(`/product/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (error) {
        throw new Error("Error deleting product");
    }
}

// Función para desactivar múltiples productos
export async function deleteManyProducts(ids: string[]): Promise<Product[]> {
    const [response, error] = await serverFetch<Product[]>(`/product/remove/all`, {
        method: "DELETE",
        body: JSON.stringify({ ids }),
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (error) {
        throw new Error("Error deleting products");
    }

    return response;
}

// Función para reactivar múltiples productos
export async function reactivateManyProducts(ids: string[]): Promise<Product[]> {
    const [response, error] = await serverFetch<Product[]>(`/product/reactivate/all`, {
        method: "PATCH",
        body: JSON.stringify({ ids }),
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (error) {
        throw new Error("Error reactivating products");
    }

    return response;
}