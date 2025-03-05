"use server";

import { http } from "@/utils/serverFetch";
import {
  Patient,
  DeletePatientDto,
  CreatePatientFormData,
  UpdatePatientFormData,
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

export async function getPatientByDni (dni:string) {
  try {
    const [patient, error] = await http.get<ListPatientResponse>(`/paciente/dni/${dni}`);
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener el stock por producto",
      };
    }
    return patient;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
};

/* export type PatientResponse = BaseApiResponse<Patient> | { error: string }; */
/**
 * Crea un nuevo paciente con imagen opcional.
 *
 * @param data - Datos del paciente e imagen opcional
 * @returns Respuesta con el paciente creado o error
 */

/* FormData: FormData {
  name: 'alx',
  lastName: 'xxzvzxvsdaf',
  dni: '78945641',
  birthDate: '2025-02-05',
  gender: 'Masculino',
  address: '',
  phone: '',
  email: '',
  emergencyContact: '',
  emergencyPhone: '',
  healthInsurance: '',
  maritalStatus: '',
  occupation: '',
  workplace: '',
  bloodType: '',
  primaryDoctor: '',
  sucursal: '',
  notes: '',
  image: File {
    size: 3239,
    type: 'image/png',
    name: 'usuarioFoto.png',
    lastModified: 1738787505222
  }
} */
/**
 * Crea un nuevo paciente con imagen opcional.
 *
 * @param formData - Datos del paciente e imagen opcional
 * @returns Respuesta con el paciente creado o error
 */
export async function createPatient(
  formData: CreatePatientFormData
): Promise<PatientResponse> {
  try {
    const serverFormData = new FormData();

    // Procesar los datos del paciente
    Object.entries(formData.data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        serverFormData.append(key, typeof value === "object" ? JSON.stringify(value) : String(value));
        
      } else {
        serverFormData.append(key, ""); // Asegurarse de que los campos vacíos se envíen como cadenas vacías
      }
    });

    // Procesar la imagen si existe
    if (formData.image instanceof File || typeof formData.image === 'string') {
      serverFormData.append("image", formData.image);
    }

    // Log para verificar los datos antes de enviarlos
    console.log(
      "Datos enviados al servidor:",
      Object.fromEntries(serverFormData.entries())
    );

    const [response, error] = await http.multipartPost<PatientResponse>(
      "/paciente/create-with-image",
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

/**
 * Actualiza un paciente existente con imagen opcional.
 *
 * @param id - ID del paciente a actualizar
 * @param formData - Datos del paciente e imagen opcional
 * @returns Respuesta con el paciente actualizado o error
 */
export async function updatePatient(
  id: string,
  formData: UpdatePatientFormData
): Promise<PatientResponse> {
  try {
    const serverFormData = new FormData();

    // Procesar los datos del paciente
    Object.entries(formData.data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === "object" && !(value instanceof File)) {
          serverFormData.append(key, JSON.stringify(value));
        } else {
          serverFormData.append(key, typeof value === "object" ? JSON.stringify(value) : String(value));
        }
        
      }
    });

    // Añadir la URL de la imagen existente como string
    if (
      formData.data.patientPhoto &&
      typeof formData.data.patientPhoto === "string"
    ) {
      serverFormData.append("patientPhoto", formData.data.patientPhoto);
    }

    // Añadir el nuevo archivo de imagen o undefined si es null
  /*   if (formData.image !== null) {
      serverFormData.append("image", formData.image);
    } else {
      serverFormData.append("image", undefined);
    } */

    if (formData.image instanceof File) {
      serverFormData.append("image", formData.image);
    }

    // Añadir el id al FormData
    serverFormData.append("id", id);

    // Log para verificar los datos antes de enviarlos
    console.log(
      "Datos enviados al servidor:",
      Object.fromEntries(serverFormData.entries())
    );

    const [response, error] = await http.multipartPatch<PatientResponse>(
      `/paciente/${id}/update-with-image`,
      serverFormData,
      {
        headers: {
          Accept: "multipart/form-data",
        },
      }
    );

    if (error) {
      return { error: error.message };
    }

    return response;
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
