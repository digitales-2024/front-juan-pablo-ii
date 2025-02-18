"use server";

import { http } from "@/utils/serverFetch";
import {
  Patient,
  MedicalHistory,
  UpdateMedicalHistoryDto,
  UpdateHistory,
} from "../_interfaces/updateHistory.interface";
import { BaseApiResponse } from "@/types/api/types";

// Tipos de respuesta
export type PatientResponse = Patient | { error: string };

export type MedicalHistoryResponse = MedicalHistory | { error: string };
type UpdateMedicalHistoryResponse =
  | BaseApiResponse<MedicalHistory>
  | { error: string };

export type UpdateHistoryResponse = UpdateHistory | { error: string };

/**
 * Obtiene una historia por Id historia medica
 */
export async function getMedicalHistoryById(
  id: string
): Promise<MedicalHistoryResponse> {
  try {
    const [medicalHistory, error] = await http.get<MedicalHistoryResponse>(
      `/medical-history/${id}`
    );
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener la medicalHistory",
      };
    }
    return medicalHistory;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

/**
 * Obtiene un paciente por su ID
 */
export async function getPatientById(id: string): Promise<PatientResponse> {
  try {
    const [patient, error] = await http.get<PatientResponse>(`/paciente/${id}`);
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener el paciente",
      };
    }
    return patient;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

/**
 * Obtiene una historia por Id historia medica
 */
export async function getUpdateHistoryById(
  id: string
): Promise<UpdateHistoryResponse> {
  try {
    const [patient, error] = await http.get<UpdateHistoryResponse>(
      `/update-history/${id}/with-images`
    );
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener el paciente",
      };
    }
    return patient;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

//funcion para actualizar los antesenes de la historia medica
export async function updateMedicalHistory(
  id: string,
  data: UpdateMedicalHistoryDto
): Promise<UpdateMedicalHistoryResponse> {
  try {
    const [response, error] = await http.patch<BaseApiResponse>(`/medical-history/${id}`, data);
    if (error) return { error: error.message };
    return response;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}
