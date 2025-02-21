"use server";

import { http } from "@/utils/serverFetch";
import { Storage, DetailedStorage, CreateStorageDto, UpdateStorageDto, DeleteStorageDto } from "../_interfaces/storage.interface";
import { BaseApiResponse } from "@/types/api/types";
import { z } from "zod";
import { createSafeAction } from "@/utils/createSafeAction";

export type StorageResponse = BaseApiResponse<Storage> | { error: string };
export type DetailedStorageResponse = BaseApiResponse<DetailedStorage> | { error: string };
export type ListStorageResponse = Storage[] | { error: string };
export type ListDetailedStorageResponse = DetailedStorage[] | { error: string };

const GetStorageSchema = z.object({});

/**
 * Obtiene todos los almacenes del catálogo.
 *
 * @returns Un objeto con una propiedad `data` que contiene un array de objetos `Storage`,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
const getStoragesHandler = async () => {
  try {
    const [storages, error] = await http.get<ListStorageResponse>("/storage");
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener los almacenes",
      };
    }
    if (!Array.isArray(storages)) {
      return { error: "Respuesta inválida del servidor" };
    }
    return { data: storages };
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
};

const getActiveStoragesHandler = async () => {
  try {
    const [storages, error] = await http.get<ListDetailedStorageResponse>("/storage/active");
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener los almacenes",
      };
    }
    if (!Array.isArray(storages)) {
      return { error: "Respuesta inválida del servidor" };
    }
    return { data: storages };
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
};

export const getStorages = await createSafeAction(GetStorageSchema, getStoragesHandler);
export const getActiveStorages = await createSafeAction(GetStorageSchema, getActiveStoragesHandler);

const getDetailedStoragesHandler = async () => {
  try {
    const [storages, error] = await http.get<ListDetailedStorageResponse>("/storage/detailed");
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener los almacenes detallados",
      };
    }
    if (!Array.isArray(storages)) {
      return { error: "Respuesta inválida del servidor" };
    }
    return { data: storages };
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
};

export const getDetailedStorages = await createSafeAction(GetStorageSchema, getDetailedStoragesHandler);

export async function getStorageById (id: string) : Promise<ListDetailedStorageResponse> {
  try {
    const [storage, error] = await http.get<ListDetailedStorageResponse>(`/storage/detailed/${id}`);
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener el almacén",
      };
    }
    return storage;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
};

export async function getDetailedStorageById (id: string) : Promise<ListDetailedStorageResponse> {
  try {
    const [storage, error] = await http.get<ListDetailedStorageResponse>(`/storage/detailed/${id}`);
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener el almacén",
      };
    }
    return storage;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
};

/**
 * Crea un nuevo almacén en el catálogo.
 *
 * @param data - Un objeto con la información del almacén a crear.
 * @returns Un objeto con una propiedad `data` que contiene el almacén creado,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
export async function createStorage(
  data: CreateStorageDto
): Promise<StorageResponse> {
    try {
        const [responseData, error] = await http.post<StorageResponse>("/storage", data);

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
 * Actualiza un almacén en el catálogo.
 *
 * @param id - El identificador único del almacén a actualizar.
 * @param data - Un objeto con la información del almacén a actualizar.
 * @returns Un objeto con una propiedad `data` que contiene el almacén actualizado,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
export async function updateStorage(
  id: string,
  data: UpdateStorageDto
): Promise<StorageResponse> {
  try {
    const [responseData, error] = await http.patch<StorageResponse>(`/storage/${id}`, data);

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
 * Elimina uno o varios almacenes del catálogo.
 *
 * @param data - Un objeto con la información de los almacenes a eliminar.
 * @returns Un objeto con una propiedad `data` que contiene la respuesta del servidor,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
export async function deleteStorage(data: DeleteStorageDto): Promise<StorageResponse> {
  try {
    const [response, error] = await http.delete<BaseApiResponse>("/storage/remove/all", data);

    if (error) {
      if (error.statusCode === 401) {
        return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
      }
      return { error: error.message };
    }

    return response;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al eliminar los almacenes" };
  }
}

/**
 * Reactiva uno o varios almacenes en el catálogo.
 *
 * @param data - Un objeto con la información de los almacenes a reactivar.
 * @returns Un objeto con una propiedad `data` que contiene la respuesta del servidor,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
export async function reactivateStorage(data: DeleteStorageDto): Promise<StorageResponse> {
  try {
    const [response, error] = await http.patch<BaseApiResponse>("/storage/reactivate/all", data);

    if (error) {
      if (error.statusCode === 401) {
        return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
      }
      return { error: error.message };
    }

    return response;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al reactivar los almacenes" };
  }
}
