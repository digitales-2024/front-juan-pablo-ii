"use server";

import { http } from "@/utils/serverFetch";
import {
  AppointmentResponse,
  UpdateAppointmentUserDto,
} from "../_interfaces/apoointments-medical.inteface";
import { BaseApiResponse } from "@/types/api/types";

/**
 * Respuesta base para consultas de citas que devuelve una lista de citas o un error
 *
 * @typedef {AppointmentResponse[] | { error: string }} AppointmentsResponseBase
 */
export type AppointmentsResponseBase =
  | AppointmentResponse[]
  | { error: string };

/**
 * Respuesta base para actualizaciones de citas que devuelve la cita actualizada o un error
 *
 * @typedef {BaseApiResponse<AppointmentResponse> | { error: string }} UpdateAppointmentResponseBase
 */
export type UpdateAppointmentResponseBase =
  | BaseApiResponse<AppointmentResponse>
  | { error: string };

/**
 * Obtiene las citas confirmadas para un médico específico identificado por su ID
 *
 * @param {string} doctorId - ID del médico del cual se quieren obtener las citas confirmadas
 * @returns {Promise<AppointmentsResponseBase>} Lista de citas confirmadas o un objeto de error
 *
 * @example
 * ```typescript
 * // Obtener citas confirmadas de un médico
 * const appointments = await getDoctorConfirmedAppointments("doctor-123");
 *
 * if ("error" in appointments) {
 *   console.error(appointments.error);
 * } else {
 *   // Procesar la lista de citas
 *   appointments.forEach(appointment => console.log(appointment.patient));
 * }
 * ```
 */
export async function getDoctorConfirmedAppointments(
  doctorId: string
): Promise<AppointmentsResponseBase> {
  try {
    const [appointments, error] = await http.get<AppointmentResponse[]>(
      `/appointments-user/doctor/${doctorId}/confirmed`
    );

    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener citas confirmadas del médico",
      };
    }

    return appointments;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

/**
 * Obtiene las citas completadas para un médico específico identificado por su ID
 *
 * @param {string} doctorId - ID del médico del cual se quieren obtener las citas completadas
 * @returns {Promise<AppointmentsResponseBase>} Lista de citas completadas o un objeto de error
 *
 * @example
 * ```typescript
 * // Obtener citas completadas de un médico
 * const appointments = await getDoctorCompletedAppointments("doctor-123");
 *
 * if ("error" in appointments) {
 *   console.error(appointments.error);
 * } else {
 *   // Procesar la lista de citas
 *   appointments.forEach(appointment => console.log(appointment.patient));
 * }
 * ```
 */
export async function getDoctorCompletedAppointments(
  doctorId: string
): Promise<AppointmentsResponseBase> {
  try {
    const [appointments, error] = await http.get<AppointmentResponse[]>(
      `/appointments-user/doctor/${doctorId}/completed`
    );

    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener citas completadas del médico",
      };
    }

    return appointments;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

/**
 * Obtiene todas las citas confirmadas del sistema (acceso administrativo)
 *
 * @returns {Promise<AppointmentsResponseBase>} Lista de todas las citas confirmadas o un objeto de error
 *
 * @example
 * ```typescript
 * // Obtener todas las citas confirmadas (admin)
 * const allConfirmedAppointments = await getAllConfirmedAppointments();
 *
 * if ("error" in allConfirmedAppointments) {
 *   console.error(allConfirmedAppointments.error);
 * } else {
 *   console.log(`Total de citas confirmadas: ${allConfirmedAppointments.length}`);
 * }
 * ```
 */
export async function getAllConfirmedAppointments(): Promise<AppointmentsResponseBase> {
  try {
    const [appointments, error] = await http.get<AppointmentResponse[]>(
      `/appointments-user/admin/confirmed`
    );

    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener todas las citas confirmadas",
      };
    }

    return appointments;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

/**
 * Obtiene todas las citas completadas del sistema (acceso administrativo)
 *
 * @returns {Promise<AppointmentsResponseBase>} Lista de todas las citas completadas o un objeto de error
 *
 * @example
 * ```typescript
 * // Obtener todas las citas completadas (admin)
 * const allCompletedAppointments = await getAllCompletedAppointments();
 *
 * if ("error" in allCompletedAppointments) {
 *   console.error(allCompletedAppointments.error);
 * } else {
 *   console.log(`Total de citas completadas: ${allCompletedAppointments.length}`);
 * }
 * ```
 */
export async function getAllCompletedAppointments(): Promise<AppointmentsResponseBase> {
  try {
    const [appointments, error] = await http.get<AppointmentResponse[]>(
      `/appointments-user/admin/completed`
    );

    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener todas las citas completadas",
      };
    }

    return appointments;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

/**
 * Obtiene citas confirmadas para la sucursal asociada a un usuario específico (personal de mesón)
 *
 * @param {string} userId - ID del usuario de mesón para consultar citas de su sucursal
 * @returns {Promise<AppointmentsResponseBase>} Lista de citas confirmadas de la sucursal o un objeto de error
 *
 * @example
 * ```typescript
 * // Obtener citas confirmadas de una sucursal
 * const branchAppointments = await getBranchConfirmedAppointments("user-456");
 *
 * if ("error" in branchAppointments) {
 *   console.error(branchAppointments.error);
 * } else {
 *   // Organizar citas por servicio
 *   const appointmentsByService = branchAppointments.reduce((acc, current) => {
 *     acc[current.service] = [...(acc[current.service] || []), current];
 *     return acc;
 *   }, {});
 * }
 * ```
 */
export async function getBranchConfirmedAppointments(
  userId: string
): Promise<AppointmentsResponseBase> {
  try {
    const [appointments, error] = await http.get<AppointmentResponse[]>(
      `/appointments-user/branch/${userId}/confirmed`
    );

    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener citas confirmadas de la sucursal",
      };
    }

    return appointments;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

/**
 * Obtiene citas completadas para la sucursal asociada a un usuario específico (personal de mesón)
 *
 * @param {string} userId - ID del usuario de mesón para consultar citas de su sucursal
 * @returns {Promise<AppointmentsResponseBase>} Lista de citas completadas de la sucursal o un objeto de error
 *
 * @example
 * ```typescript
 * // Obtener citas completadas de una sucursal
 * const branchAppointments = await getBranchCompletedAppointments("user-456");
 *
 * if ("error" in branchAppointments) {
 *   console.error(branchAppointments.error);
 * } else {
 *   // Filtrar citas por fecha
 *   const today = new Date();
 *   const todayAppointments = branchAppointments.filter(appointment =>
 *     new Date(appointment.end).toDateString() === today.toDateString()
 *   );
 * }
 * ```
 */
export async function getBranchCompletedAppointments(
  userId: string
): Promise<AppointmentsResponseBase> {
  try {
    const [appointments, error] = await http.get<AppointmentResponse[]>(
      `/appointments-user/branch/${userId}/completed`
    );

    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener citas completadas de la sucursal",
      };
    }

    return appointments;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

/**
 * Actualiza el estado de una cita médica a COMPLETED o NO_SHOW
 *
 * @param {string} id - ID de la cita a actualizar
 * @param {UpdateAppointmentUserDto} data - Datos para actualizar la cita, incluye el nuevo estado
 * @returns {Promise<UpdateAppointmentResponseBase>} Respuesta con la cita actualizada o un objeto de error
 *
 * @example
 * ```typescript
 * // Marcar una cita como completada
 * const result = await updateAppointmentStatus("appointment-789", { status: "COMPLETED" });
 *
 * if ("error" in result) {
 *   console.error(`Error al actualizar: ${result.error}`);
 * } else {
 *   console.log(`Cita actualizada: ${result.data.id} - ${result.data.status}`);
 *   console.log(`Mensaje: ${result.message}`);
 * }
 *
 * // Marcar una cita como no asistida
 * const noShowResult = await updateAppointmentStatus("appointment-789", { status: "NO_SHOW" });
 * ```
 */
export async function updateAppointmentStatus(
  id: string,
  data: UpdateAppointmentUserDto
): Promise<UpdateAppointmentResponseBase> {
  try {
    const [response, error] = await http.patch<
      BaseApiResponse<AppointmentResponse>
    >(`/appointments-user/${id}/status`, data);

    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al actualizar el estado de la cita",
      };
    }

    return response;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}
