"use server";

import { http } from "@/utils/serverFetch";
import {
    TypeProduct,
    CreateTypeProductDto,
    UpdateTypeProductDto,
    DeleteTypeProductDto,
    ReactivateTypeProductDto,
} from "./types";
import { BaseApiResponse } from "@/types/api/types";

//tipado para la respuesta de la api
/* type BaseApiResponse = {
    success: boolean;
    message: string;
    data: Record<string, never>;
} */
type GetTypeProductsResponse = TypeProduct[] | { error: string };//[]debe de ser  un array de objetos 
type CreateTypeProductResponse = BaseApiResponse | { error: string };//{} debe de ser un objeto sin el id
type UpdateTypeProductResponse = BaseApiResponse | { error: string };//{} debe de ser un objeto
type DeleteTypeProductResponse = BaseApiResponse | { error: string };//{} debe de ser un objeto
type ReactivateTypeProductResponse = BaseApiResponse | { error: string };//{} debe de ser un objeto

export async function getTypeProducts(): Promise<GetTypeProductsResponse> {
    try {
        const [typeProducts, error] = await http.get<TypeProduct[]>("/type-products");

        if (error) {
            return { error: error.message };
        }

        return typeProducts;
    } catch (error) {
        if (error instanceof Error) return { error: error.message };
        return { error: "Error desconocido" };
    }
}

export async function createTypeProduct(
    data: CreateTypeProductDto
): Promise<CreateTypeProductResponse> {
    try {
        const [typeProduct, error] = await http.post<CreateTypeProductResponse>("/type-products", data);

        if (error) {
            return { error: error.message };
        }

        return typeProduct;
    } catch (error) {
        if (error instanceof Error) return { error: error.message };
        return { error: "Error desconocido" };
    }
}

export async function updateTypeProduct(
    id: string,
    data: UpdateTypeProductDto
): Promise<UpdateTypeProductResponse> {
    try {
        const [typeProduct, error] = await http.patch<BaseApiResponse>(
            `/type-products/${id}`,
            data
        );

        if (error) {
            return { error: error.message };
        }

        return typeProduct;
    } catch (error) {
        if (error instanceof Error) return { error: error.message };
        return { error: "Error desconocido" };
    }
}
//funcion para desactivar un producto usando delete como adjetivo
export async function deleteTypeProduct(id: string,
    data: DeleteTypeProductDto
): Promise<DeleteTypeProductResponse> {
    try {
        const [response, error] = await http.patch<BaseApiResponse>(
            `/type-products/${id}`,
            data
        );

        if (error) {
            return { error: error.message };
        }

        return response;
    } catch (error) {
        if (error instanceof Error) return { error: error.message };
        return { error: "Error desconocido" };
    }
}

export async function reactivateTypeProduct(
    id: string,
    data: ReactivateTypeProductDto
): Promise<ReactivateTypeProductResponse> {
    try {
        const [response, error] = await http.patch<BaseApiResponse>(
            `/type-products/reactivate/${id}`,
            data
        );

        if (error) {
            return { error: error.message };
        }

        return response;
    } catch (error) {
        if (error instanceof Error) return { error: error.message };
        return { error: "Error desconocido" };
    }
}
