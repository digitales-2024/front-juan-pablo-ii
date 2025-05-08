"use server";

import { http } from "@/utils/serverFetch";
import { TypeStorage, CreateTypeStorageDto, UpdateTypeStorageDto, DeleteTypeStorageDto } from "../_interfaces/storageTypes.interface";
import { BaseApiResponse } from "@/types/api/types";
import { z } from "zod";
import { createSafeAction } from "@/utils/createSafeAction";

export type TypeStorageResponse = BaseApiResponse<TypeStorage> | { error: string };
export type ListTypeStorageResponse = TypeStorage[] | { error: string };
export type ListDetailedTypeStorageResponse = TypeStorage[] | { error: string };
export type DetailedTypeStorageResponse = TypeStorage[] | { error: string };

const GetTypeStorageSchema = z.object({});

// const GetTypeStorageByIdSchema = z.string();

/**
 * Obtiene todos los tipos de almacenamiento del catálogo.
 *
 * @returns Un objeto con una propiedad `data` que contiene un array de objetos `TypeStorage`,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
const getTypeStoragesHandler = async () => {
  try {
    const [typeStorages, error] = await http.get<ListTypeStorageResponse>("/type-storage");
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener los tipos de almacenamiento",
      };
    }
    if (!Array.isArray(typeStorages)) {
      return { error: "Respuesta inválida del servidor" };
    }
    return { data: typeStorages };
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
};

const getActiveTypeStoragesHandler = async () => {
  try {
    const [typeStorages, error] = await http.get<ListTypeStorageResponse>("/type-storage/active");
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener los tipos de almacenamiento",
      };
    }
    if (!Array.isArray(typeStorages)) {
      return { error: "Respuesta inválida del servidor" };
    }
    return { data: typeStorages };
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
};

export const getTypeStorages = await createSafeAction(GetTypeStorageSchema, getTypeStoragesHandler);
export const getActiveTypeStorages = await createSafeAction(GetTypeStorageSchema, getActiveTypeStoragesHandler);

const getDetailedTypeStoragesHandler = async () => {
  try {
    const [typeStorages, error] = await http.get<ListDetailedTypeStorageResponse>("/type-storage/detailed");
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener los tipos de almacenamiento detallados",
      };
    }
    if (!Array.isArray(typeStorages)) {
      return { error: "Respuesta inválida del servidor" };
    }
    return { data: typeStorages };
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
};

export const getDetailedTypeStorages = await createSafeAction(GetTypeStorageSchema, getDetailedTypeStoragesHandler);

export async function getTypeStorageById (id: string) : Promise<TypeStorageResponse> {
  try {
    const [typeStorage, error] = await http.get<TypeStorageResponse>(`/type-storage/${id}`);
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener el tipo de almacenamiento",
      };
    }
    return typeStorage;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
};

export async function getDetailedTypeStorageById (id: string) : Promise<DetailedTypeStorageResponse> {
  try {
    const [typeStorage, error] = await http.get<DetailedTypeStorageResponse>(`/type-storage/detailed/${id}`);
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener el tipo de almacenamiento",
      };
    }
    return typeStorage;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
};

/**
 * Crea un nuevo tipo de almacenamiento en el catálogo.
 *
 * @param data - Un objeto con la información del tipo de almacenamiento a crear.
 * @returns Un objeto con una propiedad `data` que contiene el tipo de almacenamiento creado,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
export async function createTypeStorage(
  data: CreateTypeStorageDto
): Promise<TypeStorageResponse> {
    try {
        const [responseData, error] = await http.post<TypeStorageResponse>("/type-storage", data);

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
 * Actualiza un tipo de almacenamiento en el catálogo.
 *
 * @param id - El identificador único del tipo de almacenamiento a actualizar.
 * @param data - Un objeto con la información del tipo de almacenamiento a actualizar.
 * @returns Un objeto con una propiedad `data` que contiene el tipo de almacenamiento actualizado,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
export async function updateTypeStorage(
  id: string,
  data: UpdateTypeStorageDto
): Promise<TypeStorageResponse> {
  try {
    const [responseData, error] = await http.patch<TypeStorageResponse>(`/type-storage/${id}`, data);

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
 * Elimina uno o varios tipos de almacenamiento del catálogo.
 *
 * @param data - Un objeto con la información de los tipos de almacenamiento a eliminar.
 * @returns Un objeto con una propiedad `data` que contiene la respuesta del servidor,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
export async function deleteTypeStorage(data: DeleteTypeStorageDto): Promise<TypeStorageResponse> {
  try {
    const [response, error] = await http.delete<BaseApiResponse>("/type-storage/remove/all", data);

    if (error) {
      if (error.statusCode === 401) {
        return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
      }
      return { error: error.message };
    }

    return response;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al eliminar los tipos de almacenamiento" };
  }
}

/**
 * Reactiva uno o varios tipos de almacenamiento en el catálogo.
 *
 * @param data - Un objeto con la información de los tipos de almacenamiento a reactivar.
 * @returns Un objeto con una propiedad `data` que contiene la respuesta del servidor,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
export async function reactivateTypeStorage(data: DeleteTypeStorageDto): Promise<TypeStorageResponse> {
  try {
    const [response, error] = await http.patch<BaseApiResponse>("/type-storage/reactivate/all", data);

    if (error) {
      if (error.statusCode === 401) {
        return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
      }
      return { error: error.message };
    }

    return response;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al reactivar los tipos de almacenamiento" };
  }
}
