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
