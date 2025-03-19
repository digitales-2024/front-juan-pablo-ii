"use server";

import { http } from "@/utils/serverFetch";
import {
    Appointment,
    CreateAppointmentDto,
    UpdateAppointmentDto,
    DeleteAppointmentsDto,
    PaginatedAppointmentsResponse,
    CancelAppointmentDto,
    RefundAppointmentDto,
    RescheduleAppointmentDto,
    AppointmentStatus
} from "../_interfaces/appointments.interface";
import { BaseApiResponse } from "@/types/api/types";
import { createSafeAction } from '@/utils/createSafeAction';
import { z } from 'zod';

type CreateAppointmentResponse = BaseApiResponse | { error: string };
type UpdateAppointmentResponse = BaseApiResponse | { error: string };
type DeleteAppointmentResponse = BaseApiResponse | { error: string };
type CancelAppointmentResponse = BaseApiResponse | { error: string };
type RefundAppointmentResponse = BaseApiResponse | { error: string };
type RescheduleAppointmentResponse = BaseApiResponse | { error: string };

// Definir el esquema correctamente
const GetAppointmentsSchema = z.object({
});

// Definir un nuevo esquema para obtener todas las citas
const GetAllAppointmentsSchema = z.object({
    page: z.number().optional(),
    limit: z.number().optional(),
});

// Definir un nuevo esquema para obtener una cita por ID
const GetAppointmentByIdSchema = z.object({
    id: z.string()
});

// Definir un nuevo esquema para obtener citas por estado
const GetAppointmentsByStatusSchema = z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED', 'all']),
    page: z.number().optional(),
    limit: z.number().optional(),
});

const getAppointmentsHandler = async () => {
    try {
        const [appointments, error] = await http.get<Appointment[]>("/appointments");

        if (error) {
            return {
                error: typeof error === 'object' && error !== null && 'message' in error
                    ? String(error.message)
                    : 'Error al obtener las citas'
            };
        }

        if (!Array.isArray(appointments)) {
            return { error: 'Respuesta inválida del servidor' };
        }

        return { data: appointments };
    } catch (error) {
        console.error("💥 Error en getAppointmentsHandler:", error);
        return { error: "Error al obtener las citas" };
    }
}

const getActiveAppointmentsHandler = async () => {
    try {
        const [appointments, error] = await http.get<Appointment[]>("/appointments/active");

        if (error) {
            return {
                error: typeof error === 'object' && error !== null && 'message' in error
                    ? String(error.message)
                    : 'Error al obtener las citas activas'
            };
        }

        if (!Array.isArray(appointments)) {
            return { error: 'Respuesta inválida del servidor' };
        }

        return { data: appointments };
    } catch (error) {
        console.error("💥 Error en getActiveAppointmentsHandler:", error);
        return { error: "Error al obtener las citas activas" };
    }
}

// Actualizar el manejador para obtener todas las citas
const getAllAppointmentsHandler = async (data: { page?: number; limit?: number }) => {
    const { page = 1, limit = 10 } = data; // Desestructurar y establecer valores predeterminados
    try {
        const url = `/appointments/paginated?page=${page}&limit=${limit}`;

        const [response, error] = await http.get<PaginatedAppointmentsResponse>(url);

        if (error) {
            return {
                error: typeof error === 'object' && error !== null && 'message' in error
                    ? String(error.message)
                    : 'Error al obtener todas las citas médicas'
            };
        }

        if (!response || !response.appointments || !Array.isArray(response.appointments)) {
            return { error: 'Respuesta inválida del servidor' };
        }

        return { data: response };
    } catch (error) {
        console.error("💥 Error en getAllAppointmentsHandler:", error);
        return { error: "Error al obtener todas las citas médicas" };
    }
}

// Añadir un nuevo manejador para obtener citas por estado
const getAppointmentsByStatusHandler = async (data: { status: AppointmentStatus; page?: number; limit?: number }) => {
    const { status, page = 1, limit = 10 } = data; // Desestructurar y establecer valores predeterminados
    try {
        // Construir la URL según el estado
        let url = '';
        if (status === 'all') {
            url = `/appointments/status/all/paginated?page=${page}&limit=${limit}`;
        } else {
            url = `/appointments/status/${status}/paginated?page=${page}&limit=${limit}`;
        }
        
        console.log(`🔍 [getAppointmentsByStatusHandler] Haciendo petición a: ${url}`);

        const [response, error] = await http.get<PaginatedAppointmentsResponse>(url);

        if (error) {
            console.error(`🔍 [getAppointmentsByStatusHandler] Error en la petición:`, error);
            return {
                error: typeof error === 'object' && error !== null && 'message' in error
                    ? String(error.message)
                    : `Error al obtener citas con estado ${status}`
            };
        }

        if (!response) {
            console.error(`🔍 [getAppointmentsByStatusHandler] Respuesta vacía para estado ${status}`);
            return { error: 'Respuesta vacía del servidor' };
        }

        if (!response.appointments || !Array.isArray(response.appointments)) {
            console.error(`🔍 [getAppointmentsByStatusHandler] Respuesta inválida:`, response);
            return { error: 'Respuesta inválida del servidor' };
        }

        console.log(`✅ [getAppointmentsByStatusHandler] Respuesta exitosa para estado ${status}:`, {
            total: response.total,
            appointments: response.appointments.length,
            firstAppointment: response.appointments[0]?.id || "N/A"
        });

        return { data: response };
    } catch (error) {
        console.error(`💥 Error en getAppointmentsByStatusHandler para estado ${status}:`, error);
        return { error: `Error al obtener citas con estado ${status}` };
    }
}

export const getAppointments = await createSafeAction(GetAppointmentsSchema, getAppointmentsHandler);
export const getActiveAppointments = await createSafeAction(GetAppointmentsSchema, getActiveAppointmentsHandler);
export const getAllAppointments = await createSafeAction(GetAllAppointmentsSchema, getAllAppointmentsHandler);
export const getAppointmentsByStatus = await createSafeAction(GetAppointmentsByStatusSchema, getAppointmentsByStatusHandler);

// Agregar una acción para obtener una cita por ID
const getAppointmentByIdHandler = async (data: { id: string }) => {
    try {
        const { id } = data;
        const [appointment, error] = await http.get<Appointment>(`/appointments/${id}`);

        if (error) {
            return {
                error: typeof error === 'object' && error !== null && 'message' in error
                    ? String(error.message)
                    : 'Error al obtener la cita médica'
            };
        }

        if (!appointment) {
            return { error: 'Cita médica no encontrada' };
        }

        return { data: appointment };
    } catch (error) {
        console.error("💥 Error en getAppointmentByIdHandler:", error);
        return { error: "Error al obtener la cita médica" };
    }
}

export const getAppointmentById = await createSafeAction(GetAppointmentByIdSchema, getAppointmentByIdHandler);

export async function createAppointment(
    data: CreateAppointmentDto
): Promise<CreateAppointmentResponse> {
    try {
        const [appointment, error] = await http.post<BaseApiResponse>("/appointments", data);

        if (error) {
            if (error.statusCode === 401) {
                return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
            }
            return { error: error.message };
        }

        return appointment;
    } catch (error) {
        if (error instanceof Error) return { error: error.message };
        return { error: "Error desconocido al crear la cita" };
    }
}

export async function updateAppointment(
    id: string,
    data: UpdateAppointmentDto
): Promise<UpdateAppointmentResponse> {
    try {
        const [appointment, error] = await http.patch<BaseApiResponse>(`/appointments/${id}`, data);

        if (error) {
            return { error: error.message };
        }

        return appointment;
    } catch (error) {
        if (error instanceof Error) return { error: error.message };
        return { error: "Error desconocido" };
    }
}

export async function deleteAppointments(data: DeleteAppointmentsDto): Promise<DeleteAppointmentResponse> {
    try {
        const [response, error] = await http.delete<BaseApiResponse>("/appointments/remove/all", data);

        if (error) {
            if (error.statusCode === 401) {
                return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
            }
            return { error: error.message };
        }

        return response;
    } catch (error) {
        if (error instanceof Error) return { error: error.message };
        return { error: "Error desconocido al eliminar las citas" };
    }
}

export async function reactivateAppointments(data: DeleteAppointmentsDto): Promise<DeleteAppointmentResponse> {
    try {
        const [response, error] = await http.patch<BaseApiResponse>("/appointments/reactivate/all", data);

        if (error) {
            if (error.statusCode === 401) {
                return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
            }
            return { error: error.message };
        }

        return response;
    } catch (error) {
        if (error instanceof Error) return { error: error.message };
        return { error: "Error desconocido al reactivar las citas" };
    }
}

export async function cancelAppointment(
    id: string,
    data: CancelAppointmentDto
): Promise<CancelAppointmentResponse> {
    try {
        const [response, error] = await http.patch<BaseApiResponse>(`/appointments/${id}/cancel`, data);

        if (error) {
            if (error.statusCode === 401) {
                return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
            }
            return { error: error.message };
        }

        return response;
    } catch (error) {
        if (error instanceof Error) return { error: error.message };
        return { error: "Error desconocido al cancelar la cita" };
    }
}

export async function refundAppointment(
    id: string,
    data: RefundAppointmentDto
): Promise<RefundAppointmentResponse> {
    try {
        const [response, error] = await http.patch<BaseApiResponse>(`/appointments/${id}/refund`, data);

        if (error) {
            if (error.statusCode === 401) {
                return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
            }
            return { error: error.message };
        }

        return response;
    } catch (error) {
        if (error instanceof Error) return { error: error.message };
        return { error: "Error desconocido al reembolsar la cita" };
    }
}

export async function rescheduleAppointment(
    id: string,
    data: RescheduleAppointmentDto
): Promise<RescheduleAppointmentResponse> {
    try {
        const [response, error] = await http.patch<BaseApiResponse>(`/appointments/${id}/reschedule`, data);

        if (error) {
            if (error.statusCode === 401) {
                return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
            }
            return { error: error.message };
        }

        return response;
    } catch (error) {
        if (error instanceof Error) return { error: error.message };
        return { error: "Error desconocido al reprogramar la cita" };
    }
} 