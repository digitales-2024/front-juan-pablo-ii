"use server";

import { http } from "@/utils/serverFetch";
import { BaseApiResponse } from "@/types/api/types";
import { z } from "zod";
import { createSafeAction } from "@/utils/createSafeAction";
import {
  MedicalHistory,
  UpdateMedicalHistoryDto,
  DeleteMedicalHistoryDto,
  CompleteMedicalHistory,
} from "../_interfaces/history.interface";

type MedicalHistoryResponse =
  | BaseApiResponse<MedicalHistory>
  | { error: string };
type ListMedicalHistoryResponse = MedicalHistory[] | { error: string };
type PacientMedicalHistoryResponse =
  | BaseApiResponse<CompleteMedicalHistory>
  | { error: string };

const ROUTES = {
  getHistories: "/medical-history",
  getComplete: (id: string) => `/medical-history/${id}/complete`,
  updateHistory: (id: string) => `/medical-history/${id}`,
  deleteHistories: "/medical-history/remove/all",
  reactivateHistories: "/medical-history/reactivate/all",
};

/**
 * Obtiene todas las historias médicas del sistema
 * @returns Lista de historias médicas o mensaje de error
 */
const getMedicalHistoriesHandler = async () => {
  try {
    const [histories, error] = await http.get<ListMedicalHistoryResponse>(
      ROUTES.getHistories
    );
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener las historias médicas",
      };
    }

    if (!Array.isArray(histories)) {
      return { error: "Respuesta inválida del servidor" };
    }
    return { data: histories };
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
};

// validacion de datos del back
const GetMedicalHistoriesSchema = z.object({});

export const getMedicalHistories = await createSafeAction(
  GetMedicalHistoriesSchema,
  getMedicalHistoriesHandler
);

/**
 * Obtiene una historia médica completa por ID incluyendo actualizaciones e imágenes
 * @param id - Identificador único de la historia médica
 * @returns Historia médica con sus detalles completos o mensaje de error
 */
/* export type CompleteMedicalHistory = {
  data: MedicalHistory & {
    updates: Record<
      string,
      {
        service: string;
        staff: string;
        branch: string;
        images: {
          id: string;
          url: string;
        }[];
      }
    >;
  };
}; */

/* 

 BaseApiResponse: {
            /**
             * @description Estado de la operación
             * @example true
             */
//success: boolean;
/**
 * @description Mensaje descriptivo
 * @example Operación realizada con éxito
 */
//message: string;
/** @description Datos de la respuesta */
//data: Record<string, never> | null;
//};

/* export type BaseApiResponse<T = any> = Omit<
  components["schemas"]["BaseApiResponse"],
  "data"
> & {
  data: T;
}; 
 */

//type PacientMedicalHistoryResponse = BaseApiResponse<CompleteMedicalHistory> | { error: string };
/**
 * Obtiene una historia médica completa por ID incluyendo actualizaciones e imágenes
 * @param id - Identificador único de la historia médica
 * @returns Historia médica con sus detalles completos o mensaje de error
 */
const getCompleteMedicalHistoryHandler = async (id: string): Promise<PacientMedicalHistoryResponse> => {
  console.log(`Enviando solicitud para obtener la historia médica completa del paciente con ID: ${id}`);
  try {
    const [history, error] = await http.get<PacientMedicalHistoryResponse>(
      ROUTES.getComplete(id)
    );
    console.log('Respuesta recibida:', history);
    console.log('Error recibido:', error);

    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener la historia médica",
      };
    }

    if (!history || typeof history !== "object" || Array.isArray(history)) {
      return { error: "Respuesta inválida del servidor" };
    }
    return history;
  } catch (error) {
    console.log('Excepción capturada:', error);
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
};

// Validación de datos del backend
const GetIdCompleteMedicalHistoriesSchema = z.string();

export async function getCompleteMedicalHistory(id: string): Promise<PacientMedicalHistoryResponse> {
  // Validar el ID
  const validation = GetIdCompleteMedicalHistoriesSchema.safeParse(id);
  if (!validation.success) {
    return { error: "ID inválido" };
  }

  // Llamar al handler
  return await getCompleteMedicalHistoryHandler(id);
}

/**
 * Actualiza una historia médica existente
 * @param id - Identificador único de la historia médica
 * @param data - Datos actualizados de la historia médica
 * @returns Historia médica actualizada o mensaje de error
 */
export async function updateMedicalHistory(
  id: string,
  data: UpdateMedicalHistoryDto
): Promise<MedicalHistoryResponse> {
  try {
    const [response, error] = await http.patch<MedicalHistoryResponse>(
      ROUTES.updateHistory(id),
      data
    );
    if (error) return { error: error.message };
    return response;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

/**
 * Desactiva múltiples historias médicas
 * @param data - DTO con los IDs de las historias médicas a desactivar
 * @returns Historias médicas desactivadas o mensaje de error
 */
export async function deleteMedicalHistories(
  data: DeleteMedicalHistoryDto
): Promise<MedicalHistoryResponse> {
  try {
    const [response, error] = await http.delete<BaseApiResponse>(
      ROUTES.deleteHistories,
      data
    );
    if (error) {
      if (error.statusCode === 401) {
        return { error: "No autorizado para realizar esta operación" };
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
 * Reactiva múltiples historias médicas
 * @param data - DTO con los IDs de las historias médicas a reactivar
 * @returns Historias médicas reactivadas o mensaje de error
 */
export async function reactivateMedicalHistories(
  data: DeleteMedicalHistoryDto
): Promise<MedicalHistoryResponse> {
  try {
    const [response, error] = await http.patch<BaseApiResponse>(
      ROUTES.reactivateHistories,
      data
    );
    if (error) {
      if (error.statusCode === 401) {
        return { error: "No autorizado para realizar esta operación" };
      }
      return { error: error.message };
    }
    return response;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al reactivar los productos" };
  }
}
