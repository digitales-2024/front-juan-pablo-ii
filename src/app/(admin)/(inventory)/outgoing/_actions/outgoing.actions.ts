"use server";

import { http } from "@/utils/serverFetch";
import { 
  Outgoing,
  DetailedOutgoing,
  DeleteOutgoingDto,
  CreateOutgoingDto,
  UpdateOutgoingDto,
 } from "../_interfaces/outgoing.interface";
import { BaseApiResponse } from "@/types/api/types";
import { z } from "zod";
import { createSafeAction } from "@/utils/createSafeAction";

export type OutgoingResponse = BaseApiResponse<Outgoing> | { error: string };
export type DetailedOutgoingResponse = BaseApiResponse<DetailedOutgoing> | { error: string };
export type ListOutgoingResponse = Outgoing[] | { error: string };
export type ListDetailedOutgoingResponse = DetailedOutgoing[] | { error: string };
export type ListUpdatedDetailedOutgoingResponse = BaseApiResponse<DetailedOutgoing[]> | { error: string };

// export type ProductResponse = BaseApiResponse<Product> | { error: string };
// export type DetailedProductResponse = BaseApiResponse<DetailedProduct> | { error: string };
// export type ListProductResponse = Product[] | { error: string };
// export type ListDetailedProductResponse = DetailedProduct[] | { error: string };

const GetProductSchema = z.object({});

// const GetProductByIdSchema = z.string();

/**
 * Obtiene todos los productos del catálogo.
 *
 * @returns Un objeto con una propiedad `data` que contiene un array de objetos `Product`,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
const getOutgoingHandler = async () => {
  try {
    const [outcomes, error] = await http.get<ListOutgoingResponse>("/outgoing");
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener las salidas",
      };
    }
    if (!Array.isArray(outcomes)) {
      return { error: "Respuesta inválida del servidor" };
    }
    return { data: outcomes };
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
};

export const getOutcomes = await createSafeAction(GetProductSchema, getOutgoingHandler);

const getDetailedOutgoingHandler = async () => {
  try {
    const [products, error] = await http.get<ListDetailedOutgoingResponse>("/outgoing/detailed");
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener las salidas detalladas",
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

export const getDetailedOutcomes = await createSafeAction(GetProductSchema, getDetailedOutgoingHandler);

export async function getOutgoingById (id: string) : Promise<OutgoingResponse> {
  try {
    const [outgoing, error] = await http.get<OutgoingResponse>(`/outgoing/${id}`);
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener la salida",
      };
    }
    return outgoing;
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
export async function createOutgoing(
  data: CreateOutgoingDto
): Promise<DetailedOutgoingResponse> {
    try {
        const [responseData, error] = await http.post<DetailedOutgoingResponse>("/outgoing/create/outgoingStorage", data);

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
export async function updateOutgoing(
  id: string,
  data: UpdateOutgoingDto
): Promise<DetailedOutgoingResponse> {
  try {
    const [responseData, error] = await http.patch<DetailedOutgoingResponse>(`/outgoing/${id}`, data);

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
export async function deleteOutgoing(data: DeleteOutgoingDto): Promise<ListUpdatedDetailedOutgoingResponse> {
  try {
    const [response, error] = await http.delete<BaseApiResponse>("/outgoing/remove/all", data);

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
export async function reactivateOutgoing(data: DeleteOutgoingDto): Promise<ListUpdatedDetailedOutgoingResponse> {
  try {
    const [response, error] = await http.patch<BaseApiResponse>("/outgoing/reactivate/all", data);

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
