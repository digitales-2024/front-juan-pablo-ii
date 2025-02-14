"use server";

import { http } from "@/utils/serverFetch";
import { Product, DetailedProduct, CreateProductDto, UpdateProductDto, DeleteProductDto } from "../_interfaces/outgoing.interface";
import { BaseApiResponse } from "@/types/api/types";
import { z } from "zod";
import { createSafeAction } from "@/utils/createSafeAction";

export type ProductResponse = BaseApiResponse<Product> | { error: string };
export type DetailedProductResponse = BaseApiResponse<DetailedProduct> | { error: string };
export type ListProductResponse = Product[] | { error: string };
export type ListDetailedProductResponse = DetailedProduct[] | { error: string };

const GetProductSchema = z.object({});

// const GetProductByIdSchema = z.string();

/**
 * Obtiene todos los productos del catálogo.
 *
 * @returns Un objeto con una propiedad `data` que contiene un array de objetos `Product`,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
const getProductsHandler = async () => {
  try {
    const [products, error] = await http.get<ListProductResponse>("/product");
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener los productos",
      };
    }
    if (!Array.isArray(products)) {
      return { error: "Respuesta inválida del servidor" };
    }
    return { data: products };
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
};

export const getProducts = await createSafeAction(GetProductSchema, getProductsHandler);

const getDetailedProductsHandler = async () => {
  try {
    const [products, error] = await http.get<ListDetailedProductResponse>("/product/detailed");
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener los productos detallados",
      };
    }
    if (!Array.isArray(products)) {
      return { error: "Respuesta inválida del servidor" };
    }
    return { data: products };
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
};

export const getDetailedProducts = await createSafeAction(GetProductSchema, getDetailedProductsHandler);

export async function getProductById (id: string) : Promise<ProductResponse> {
  try {
    const [product, error] = await http.get<ProductResponse>(`/product/${id}`);
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener el producto",
      };
    }
    return product;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
};

/**
 * Crea un nuevo producto en el catálogo.
 *
 * Crea un nuevo producto en el catálogo.
 *
 * @param data - Un objeto con la información del producto a crear.
 * @returns Un objeto con una propiedad `data` que contiene el producto creado,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
export async function createProduct(
  data: CreateProductDto
): Promise<ProductResponse> {
    try {
        const [responseData, error] = await http.post<ProductResponse>("/product", data);

        if (error) {
            return { error: error.message };
        }

        return responseData;
    } catch (error) {
        if (error instanceof Error) return { error: error.message };
        return { error: "Error desconocido" };
    }
}

/**
 * Actualiza un producto en el catálogo.
 *
 * @param id - El identificador único del producto a actualizar.
 * @param data - Un objeto con la información del producto a actualizar.
 * @returns Un objeto con una propiedad `data` que contiene el producto actualizado,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
export async function updateProduct(
  id: string,
  data: UpdateProductDto
): Promise<ProductResponse> {
  try {
    const [responseData, error] = await http.patch<ProductResponse>(`/product/${id}`, data);

    if (error) {
      return { error: error.message };
    }

    return responseData;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

/**
 * Elimina uno o varios productos del catálogo.
 *
 * @param data - Un objeto con la información de los productos a eliminar.
 * @returns Un objeto con una propiedad `data` que contiene la respuesta del servidor,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
export async function deleteProduct(data: DeleteProductDto): Promise<ProductResponse> {
  try {
    const [response, error] = await http.delete<BaseApiResponse>("/product/remove/all", data);

    if (error) {
      if (error.statusCode === 401) {
        return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
      }
      return { error: error.message };
    }

    return response;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al eliminar los productos" };
  }
}

/**
 * Reactiva uno o varios productos en el catálogo.
 *
 * @param data - Un objeto con la información de los productos a reactivar.
 * @returns Un objeto con una propiedad `data` que contiene la respuesta del servidor,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
export async function reactivateProduct(data: DeleteProductDto): Promise<ProductResponse> {
  try {
    const [response, error] = await http.patch<BaseApiResponse>("/product/reactivate/all", data);

    if (error) {
      if (error.statusCode === 401) {
        return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
      }
      return { error: error.message };
    }

    return response;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al reactivar los productos" };
  }
}
