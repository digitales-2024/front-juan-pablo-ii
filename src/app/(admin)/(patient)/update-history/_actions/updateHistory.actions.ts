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
  CreatePrescriptionDto
} from "../_interfaces/updateHistory.interface";
import { BaseApiResponse } from "@/types/api/types";

// Tipos de respuesta
export type PatientResponse = Patient | { error: string };

export type PrescriptionResponseBase = PrescriptionResponse | { error: string };

export type PrescriptionResponseBaseApiResponse = BaseApiResponse<PrescriptionResponse> | { error: string };

export type CreatePrescriptionDataDto = CreatePrescriptionDto | { error: string };

export type MedicalHistoryResponseBase =
  | MedicalHistoryResponse
  | { error: string };

type UpdateMedicalHistoryResponse =
  | BaseApiResponse<MedicalHistory>
  | { error: string };

export type UpdateHistoryResponseBase = BaseApiResponse<UpdateHistory> | { error: string };

export type UpdateHistoryResponseImageResponse =
  | UpdateHistoryResponseImage
  | { error: string };

export type UpdateHistoryResponseData =
  | MedicalHistoryResponse
  | { error: string };

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
 * Obtiene una actualizacion de historia por Id actualizacion historia medica con imagenes
 */
export async function getUpdateHistoryById(
  id: string
): Promise<UpdateHistoryResponseImageResponse> {
  try {
    const [updatelHistory, error] =
      await http.get<UpdateHistoryResponseImageResponse>(
        `/update-history/${id}/with-images`
      );
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
//funcion para obtener la prescripción médica asignada a la actualización de historia clínica
export async function getPrescriptionById(
  id: string
): Promise<PrescriptionResponseBase> {
  try {
    const [prescription, error] = await http.get<PrescriptionResponseBase>(
      `/receta/${id}`
    );
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener la updatelHistory",
      };
    }

    return prescription;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}
// crear prescripción médica
export async function createPrescription(
  data: CreatePrescriptionDataDto
): Promise<PrescriptionResponseBaseApiResponse> {
  try {
    const [responseData, error] = await http.post<PrescriptionResponseBaseApiResponse>("/receta", data);

    if (error) {
      return { error: error.message };
    }

    return responseData;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

//funcion para crear una actualizacion de historia medica con imagen

//export type UpdateHistoryResponseBase = BaseApiResponse<UpdateHistory> | { error: string };
/* export interface CreateUpdateHistoryFormData {
  data: CreateUpdateHistoryDto;
  image?: File | null;
} */
export async function createUpdateHistoryAction(
  formData: CreateUpdateHistoryFormData
): Promise<UpdateHistoryResponseBase> {
  try {
    const serverFormData = new FormData();
    console.log('formdata', formData)
    // Procesar los datos del formulario
    Object.entries(formData.data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        serverFormData.append(
          key,
          typeof value === "object" ? JSON.stringify(value) : String(value)
        );
      } else {
        serverFormData.append(key, "");
      }
    });

    // Procesar múltiples imágenes
    if (Array.isArray(formData.image)) {
      formData.image.forEach((file, _index) => {
        serverFormData.append(`images`, file); // Usar 'images' en lugar de 'image'
      });
    }

    // Log para verificar los datos antes de enviarlos
    const formDataEntries = Object.fromEntries(serverFormData.entries());
    console.log("Datos enviados al servidor:", {
      ...formDataEntries,
      images: `${formData.image?.length ?? 0} archivos`, // Log más limpio para las imágenes
    });

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
    return { error: "Error desconocido al crear la actualización" };
  }
}

//funcion para adctualizar una actualizacion de historia medica con imagen
/* export interface UpdateUpdateHistoryFormData {
    data: UpdateUpdateHistoryDto;
    image?: File[] | null;
  } */
export async function updateUpdateHistoryAction(
  id: string,
  formData: UpdateUpdateHistoryFormData
): Promise<UpdateHistoryResponseBase> {
  console.log("🚀 ~ formData datos que se llegan ala ction:", formData)
  try {
    const serverFormData = new FormData();

    // Procesar los datos del formulario (igual que en create)
    Object.entries(formData.data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        serverFormData.append(
          key,
          typeof value === "object" ? JSON.stringify(value) : String(value)
        );
      }
    });

    // Procesar imágenes con el nuevo identificador 'newImages'
    if (Array.isArray(formData.newImages)) {
      formData.newImages.forEach((file) => {
        serverFormData.append('newImages', file); // Cambiado de 'images' a 'newImages'
      });
    }

    // Log mejorado
    const formDataEntries = Object.fromEntries(serverFormData.entries());
    console.log("Datos enviados al servidor:", {
      ...formDataEntries,
      newImages: `${formData.newImages?.length ?? 0} archivos`, // Actualizado a newImages
      id: id
    });

    const [response, error] = await http.multipartPatch<UpdateHistoryResponseBase>(
      `/update-history/${id}/update-with-images`,
      serverFormData
    );

    if (error) {
      return { error: error.message };
    }
    console.log("🚀 ~ response:", response)
    return response;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al actualizar la historia" };
  }
  
}
