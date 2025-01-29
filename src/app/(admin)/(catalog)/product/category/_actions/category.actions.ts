"use server";

import { http } from "@/utils/serverFetch";
import { Category, CreateCategoryDto, UpdateCategoryDto, DeleteCategoriesDto } from "../_interfaces/category.interface";
import { BaseApiResponse } from "@/types/api/types";
import { z } from "zod";
import { createSafeAction } from "@/utils/createSafeAction";

export type CategoryResponse = BaseApiResponse<Category> | { error: string };//{} debe de ser un objeto
export type ListCategoryResponse = Category[] | { error: string };

// type ApiResponse<T> = BaseApiResponse & {
//   data: T;
// };

const GetCategoriesSchema = z.object({});

/**
 * Obtiene todas las categorías del catálogo de productos.
 *
 * @returns Un objeto con una propiedad `data` que contiene un array de objetos `Category`,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
const getCategoriesHandler = async () => {
  try {
    const [categories, error] = await http.get<ListCategoryResponse>("/category");
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener las categorías",
      };
    }
    if (!Array.isArray(categories)) {
      return { error: "Respuesta inválida del servidor" };
    }
    return { data: categories };
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
};

export const getCategories = await createSafeAction(GetCategoriesSchema, getCategoriesHandler);


/**
 * Crea una nueva categoría de productos en el catálogo.
 *
 * @param data - Un objeto con la información de la categoría a crear.
 * @returns Un objeto con una propiedad `data` que contiene la categoría creada,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
export async function createCategory(
  data: CreateCategoryDto
): Promise<CategoryResponse> {
    try {
        const [responseData, error] = await http.post<CategoryResponse>("/category", data);

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
 * Actualiza una categoría de productos en el catálogo.
 *
 * @param id - El identificador único de la categoría a actualizar.
 * @param data - Un objeto con la información de la categoría a actualizar.
 * @returns Un objeto con una propiedad `data` que contiene la categoría actualizada,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
export async function updateCategory(
  id: string,
  data: UpdateCategoryDto
): Promise<CategoryResponse> {
  try {
    const [responseData, error] = await http.patch<CategoryResponse>(`/category/${id}`, data);

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
 * Elimina una o varias categorías de productos en el catálogo.
 *
 * @param data - Un objeto con la información de las categorías a eliminar.
 * @returns Un objeto con una propiedad `data` que contiene la respuesta del servidor,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
export async function deleteCategory(data: DeleteCategoriesDto): Promise<CategoryResponse> {
  try {
    const [response, error] = await http.delete<BaseApiResponse>("/category/remove/all",data);

    if (error) {
      if (error.statusCode === 401) {
        return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
      }
      return { error: error.message };
    }

    return response;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al eliminar las sucursales" };
  }
}


/**
 * Reactiva una o varias sucursales de productos en el catálogo.
 *
 * @param data - Un objeto con la información de las sucursales a reactivar.
 * @returns Un objeto con una propiedad `data` que contiene la respuesta del servidor,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
export async function reactivateCategory(data: DeleteCategoriesDto): Promise<CategoryResponse> {
  try {
    const [response, error] = await http.patch<BaseApiResponse>("/branch/reactivate/all", data);

    if (error) {
      if (error.statusCode === 401) {
        return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
      }
      return { error: error.message };
    }

    return response;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al reactivar las sucursales" };
  }
}