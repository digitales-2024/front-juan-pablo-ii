"use server";

import { http } from "@/utils/serverFetch";
import {
  Patient,
  MedicalHistory,
  MedicalHistoryResponse,
  UpdateMedicalHistoryDto,
  UpdateHistory,
  UpdateHistoryResponseImage,
  CreateUpdateHistoryFormData,
  UpdateUpdateHistoryFormData,
  PrescriptionResponse,
} from "../_interfaces/updateHistory.interface";
import { BaseApiResponse } from "@/types/api/types";

// Tipos de respuesta
export type PatientResponse = Patient | { error: string };

export type PrescriptionResponseBase = PrescriptionResponse | { error: string };

export type MedicalHistoryResponseBase = MedicalHistoryResponse | { error: string };

type UpdateMedicalHistoryResponse =
  | BaseApiResponse<MedicalHistory>
  | { error: string };

export type UpdateHistoryResponseBase = UpdateHistory | { error: string };
export type UpdateHistoryResponseImageResponse = UpdateHistoryResponseImage | { error: string };

export type UpdateHistoryResponseData = MedicalHistoryResponse | { error: string };

/**
 * Obtiene una historia por Id historia medica
 */
export async function getMedicalHistoryById(
  id: string
): Promise<MedicalHistoryResponseBase> {
  try {
    const [medicalHistory, error] = await http.get<MedicalHistoryResponse>(
      `/medical-history/${id}/complete`
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

//funcion para actualizar los antesenes de la historia medica
export async function updateMedicalHistory(
  id: string,
  data: UpdateMedicalHistoryDto
): Promise<UpdateMedicalHistoryResponse> {
  try {
    const [response, error] = await http.patch<BaseApiResponse>(
      `/medical-history/${id}`,
      data
    );
    if (error) return { error: error.message };
    return response;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}


  //funcion para obtener la actualizacion de historia medica por id
  /**
 * Obtiene una actualizacion de historia por Id actualizacion historia medica
 */
export async function getUpdateHistoryById(
  id: string
): Promise<UpdateHistoryResponseImageResponse> {
  try {
    const [updatelHistory, error] = await http.get<UpdateHistoryResponseImageResponse>(
      `/medical-history/${id}/complete`
    );
    console.log("🚀 ~ updatelHistory en el frontend:", updatelHistory)
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener la updatelHistory",
      };
    }
    return updatelHistory;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

export async function getPrescriptionById(
  id: string
): Promise<PrescriptionResponseBase> {
  try {
    const [updatelHistory, error] = await http.get<PrescriptionResponseBase>(
      `/medical-history/${id}/complete`
    );
    console.log("🚀 ~ updatelHistory en el frontend:", updatelHistory)
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener la updatelHistory",
      };
    }
    return updatelHistory;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

//funcion para crear una actualizacion de historia medica con imagen

export async function createUpdateHistory(
  formData: CreateUpdateHistoryFormData
): Promise<UpdateHistoryResponseBase> {
  try {
    const serverFormData = new FormData();

    // Procesar los datos del paciente
    Object.entries(formData.data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        serverFormData.append(
          key,
          typeof value === "object" ? JSON.stringify(value) : String(value)
        );
      } else {
        serverFormData.append(key, ""); // Asegurarse de que los campos vacíos se envíen como cadenas vacías
      }
    });

    // Procesar la imagen si existe
    if (formData.image instanceof File) {
      serverFormData.append("image", formData.image);
    }

    // Log para verificar los datos antes de enviarlos
    console.log(
      "Datos enviados al servidor:",
      Object.fromEntries(serverFormData.entries())
    );

    const [response, error] = await http.multipartPost<UpdateHistoryResponseBase>(
      "/update-history/create-with-images",
      serverFormData
    );

    if (error) {
      return { error: error.message };
    }

    return response;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al crear el paciente" };
  }
}

//funcion para adctualizar una actualizacion de historia medica con imagen
export async function updateUpdateHistory(
  id: string,
  formData: UpdateUpdateHistoryFormData
): Promise<UpdateHistoryResponseBase> {
  try {
    const serverFormData = new FormData();

    // Procesar los datos del paciente
    Object.entries(formData.data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        serverFormData.append(
          key,
          typeof value === "object" ? JSON.stringify(value) : String(value)
        );
      } else {
        serverFormData.append(key, ""); // Asegurarse de que los campos vacíos se envíen como cadenas vacías
      }
    });

    // Procesar la imagen si existe
    if (formData.image instanceof File) {
      serverFormData.append("image", formData.image);
    }

    // Log para verificar los datos antes de enviarlos
    console.log(
      "Datos enviados al servidor:",
      Object.fromEntries(serverFormData.entries())
    );

    const [response, error] = await http.multipartPatch<UpdateHistoryResponseBase>(
      `/update-history/${id}/with-images`,
      serverFormData
    );

    if (error) {
      return { error: error.message };
    }

    return response;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al crear el paciente" };
  }
}
