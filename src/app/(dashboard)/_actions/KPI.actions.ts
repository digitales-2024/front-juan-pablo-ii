"use server";

import { http } from "@/utils/serverFetch";
import {
  PacientesPorSucursalData,
  ApiResponse,
} from "../_interfaces/KPI.interface";

/**
 * Obtiene los datos de pacientes registrados por mes y sucursal
 * @param params Parámetros opcionales como el año (year)
 * @returns Datos formateados o un objeto de error
 */
export async function getPatientsSucursalKPI(params?: {
  year?: number;
}): Promise<ApiResponse<PacientesPorSucursalData>> {
  try {
    // Construir la URL y realizar la petición
    const url = params?.year
      ? `/paciente/dashboard/pacientes-por-sucursal?year=${params.year}`
      : "/paciente/dashboard/pacientes-por-sucursal";

    const [response, error] = await http.get(url);
    // Si hay error, retornarlo
    if (error) {
      return { error: "Error al obtener datos de pacientes por sucursal" };
    }
    // Si todo está bien, retornar los datos
    return { data: (response as { data: PacientesPorSucursalData }).data };
  } catch (error) {
    console.error("Error fetching patient data:", error);
    return { error: "Error inesperado al obtener datos" };
  }
}

/**
 * Obtiene los datos de citas por sucursal para el KPI
 * @returns Datos formateados o un objeto de error
 */
export async function getCitasPorSucursalKPI(): Promise<
  ApiResponse<PacientesPorSucursalData>
> {
  try {
    // Realizar la petición al backend
    const url = "/dashboard/citas-por-sucursal";

    const [response, error] = await http.get(url);

    /*   console.log("🚀 ~ response kip citas :", response) */

    // Si hay error, retornarlo
    if (error) {
      return { error: "Error al obtener datos de citas por sucursal" };
    }

    // Si todo está bien, retornar los datos
    return { data: (response as { data: PacientesPorSucursalData }).data };
  } catch (error) {
    console.error("Error fetching patient data:", error);
    return { error: "Error inesperado al obtener datos" };
  }
}

// Añadir esta interfaz a tu archivo de interfaces
// filepath: /home/userdev/Documentos/userDev/proyectoJPii/front-juan-pablo-ii/src/app/(dashboard)/_interfaces/KPI.interface.ts
export interface TopServiciosData {
  serviceName: string;
  JLBYR: number;
  Yanahuara: number;
}

// Añadir esta función al archivo de acciones
/**
 * Obtiene los datos de los 12 servicios más demandados por sucursal
 * @returns Datos formateados o un objeto de error
 */
export async function getTopServicesBySucursalKPI(): Promise<
  ApiResponse<TopServiciosData[]>
> {
  try {
    // Realizar la petición al backend
    const url = "/dashboard/top-servicios-por-sucursal";

    const [response, error] = await http.get(url);
    console.log("🚀 ~ response:", response)

    // Si hay error, retornarlo
    if (error) {
      return { error: "Error al obtener datos de top servicios por sucursal" };
    }

    // Si todo está bien, retornar los datos
    return { data: (response as { data: TopServiciosData[] }).data };
  } catch (error) {
    console.error("Error fetching patient data:", error);
    return { error: "Error inesperado al obtener datos" };
  }
}
