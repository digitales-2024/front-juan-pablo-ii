"use server";

import { http } from "@/utils/serverFetch";
import {
  Patient,
  DeletePatientDto,
  CreatePatientWithImage,
  UpdatePatientWithImage,
} from "../_interfaces/patient.interface";
import { BaseApiResponse } from "@/types/api/types";
import { z } from "zod";
import { createSafeAction } from "@/utils/createSafeAction";

// Tipos de respuesta
export type PatientResponse = BaseApiResponse<Patient> | { error: string };
export type ListPatientResponse = Patient[] | { error: string };

const GetPatientSchema = z.object({});

/**
 * Obtiene todos los pacientes.
 */
const getPatientsHandler = async () => {
  try {
    const [patients, error] = await http.get<ListPatientResponse>("/paciente");
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener los pacientes",
      };
    }
    if (!Array.isArray(patients)) {
      return { error: "Respuesta inválida del servidor" };
    }
    return { data: patients };
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
};

export const getPatients = await createSafeAction(
  GetPatientSchema,
  getPatientsHandler
);

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
 * Crea un nuevo paciente con imagen opcional.
 *
 * @param data - Datos del paciente e imagen opcional
 * @returns Respuesta con el paciente creado o error
 */
export async function createPatient(
  data: CreatePatientWithImage
): Promise<PatientResponse> {
  try {
    const formData = new FormData();

    // Procesamos la imagen si existe
    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    // Procesamos el resto de datos, excluyendo la imagen
    const { image, ...patientData } = data;
    console.log("patientData", image);
    Object.entries(patientData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const [responseData, error] = await http.post<PatientResponse>(
      "/paciente/create-with-image",
      formData,
      {
        headers: {
          Accept: "multipart/form-data",
        },
      }
    );

    if (error) {
      return { error: error.message };
    }

    return responseData;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al crear el paciente" };
  }
}

/**
 * Actualiza un paciente existente con imagen opcional.
 *
 * @param id - ID del paciente a actualizar
 * @param data - Datos del paciente e imagen opcional
 * @returns Respuesta con el paciente actualizado o error
 */
export async function updatePatient(
  id: string,
  data: UpdatePatientWithImage
): Promise<PatientResponse> {
  try {
    const formData = new FormData();

    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    const { image, ...patientData } = data;
    console.log("patientData", image);
    Object.entries(patientData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const [responseData, error] = await http.patch<PatientResponse>(
      `/paciente/${id}/update-with-image`,
      formData,
      {
        headers: {
          Accept: "multipart/form-data",
        },
      }
    );

    if (error) {
      return { error: error.message };
    }

    return responseData;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al actualizar el paciente" };
  }
}

/**
 * Elimina (desactiva) uno o varios pacientes.
 *
 * @param data - DTO con los IDs de los pacientes a eliminar
 * @returns Respuesta con el resultado de la operación o error
 */
export async function deletePatient(
  data: DeletePatientDto
): Promise<PatientResponse> {
  try {
    const [response, error] = await http.delete<BaseApiResponse>(
      "/paciente/remove/all",
      data
    );

    if (error) {
      if (error.statusCode === 401) {
        return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
      }
      return { error: error.message };
    }

    return response;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al eliminar los pacientes" };
  }
}

/**
 * Reactiva uno o varios pacientes.
 *
 * @param data - DTO con los IDs de los pacientes a reactivar
 * @returns Respuesta con el resultado de la operación o error
 */
export async function reactivatePatient(
  data: DeletePatientDto
): Promise<PatientResponse> {
  try {
    const [response, error] = await http.patch<BaseApiResponse>(
      "/paciente/reactivate/all",
      data
    );

    if (error) {
      if (error.statusCode === 401) {
        return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
      }
      return { error: error.message };
    }

    return response;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al reactivar los pacientes" };
  }
}
