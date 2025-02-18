"use server";

import { http } from "@/utils/serverFetch";
import { Incoming, DetailedIncoming, DeleteIncomingDto, CreateIncomingDto, UpdateIncomingDto } from "../_interfaces/income.interface";
import { BaseApiResponse } from "@/types/api/types";
import { z } from "zod";
import { createSafeAction } from "@/utils/createSafeAction";

export type IncomingResponse = BaseApiResponse<Incoming> | { error: string };
export type DetailedIncomingResponse = BaseApiResponse<DetailedIncoming> | { error: string };
export type ListIncomingResponse = Incoming[] | { error: string };
export type ListDetailedIncomingResponse = DetailedIncoming[] | { error: string };
export type ListUpdatedDetailedIncomingResponse = BaseApiResponse<DetailedIncoming[]> | { error: string };

const GetIncomingSchema = z.object({});

/**
 * Obtiene todos los ingresos detallados.
 *
 * @returns Un objeto con una propiedad `data` que contiene un array de objetos `DetailedIncoming`,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
const getIncomingsHandler = async () => {
  try {
    const [incomings, error] = await http.get<ListIncomingResponse>("/incoming/");
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener los ingresos",
      };
    }
    if (!Array.isArray(incomings)) {
      return { error: "Respuesta inválida del servidor" };
    }
    return { data: incomings };
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
};

export const getIncomings = await createSafeAction(GetIncomingSchema, getIncomingsHandler);

const getDetailedIncomingsHandler = async () => {
  try {
    const [incomings, error] = await http.get<ListDetailedIncomingResponse>("/incoming/detailed");
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener los ingresos detallados",
      };
    }
    if (!Array.isArray(incomings)) {
      return { error: "Respuesta inválida del servidor" };
    }
    return { data: incomings };
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
};

export const getDetailedIncomings = await createSafeAction(GetIncomingSchema, getDetailedIncomingsHandler);

export async function getIncomingById(id: string): Promise<IncomingResponse> {
  try {
    const [incoming, error] = await http.get<IncomingResponse>(`/incoming/${id}`);
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener el ingreso",
      };
    }
    return incoming;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
};

/**
 * Crea un nuevo ingreso.
 *
 * @param data - Un objeto con la información del ingreso a crear.
 * @returns Un objeto con una propiedad `data` que contiene el ingreso creado,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
export async function createIncoming(
  data: CreateIncomingDto
): Promise<DetailedIncomingResponse> {
  try {
    const [responseData, error] = await http.post<DetailedIncomingResponse>("/incoming/create/incomingStorage", data);

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
 * Actualiza un ingreso.
 *
 * @param id - El identificador único del ingreso a actualizar.
 * @param data - Un objeto con la información del ingreso a actualizar.
 * @returns Un objeto con una propiedad `data` que contiene el ingreso actualizado,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
//TODO: Revisat este campo e más detalle
export async function updateIncoming(
  id: string,
  data: UpdateIncomingDto
): Promise<DetailedIncomingResponse> {
  try {
    const [responseData, error] = await http.patch<DetailedIncomingResponse>(`/incoming/${id}`, data);

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
 * Elimina uno o varios ingresos.
 *
 * @param data - Un objeto con la información de los ingresos a eliminar.
 * @returns Un objeto con una propiedad `data` que contiene la respuesta del servidor,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
export async function deleteIncoming(data: DeleteIncomingDto): Promise<ListUpdatedDetailedIncomingResponse> {
  try {
    const [response, error] = await http.delete<BaseApiResponse>("/incoming/remove/all", data);

    if (error) {
      if (error.statusCode === 401) {
        return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
      }
      return { error: error.message };
    }

    return response;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al eliminar los ingresos" };
  }
}

/**
 * Reactiva uno o varios ingresos.
 *
 * @param data - Un objeto con la información de los ingresos a reactivar.
 * @returns Un objeto con una propiedad `data` que contiene la respuesta del servidor,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
export async function reactivateIncoming(data: DeleteIncomingDto): Promise<ListUpdatedDetailedIncomingResponse> {
  try {
    const [response, error] = await http.patch<BaseApiResponse>("/incoming/reactivate/all", data);

    if (error) {
      if (error.statusCode === 401) {
        return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
      }
      return { error: error.message };
    }

    return response;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al reactivar los ingresos" };
  }
}
