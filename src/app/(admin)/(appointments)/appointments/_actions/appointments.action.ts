"use server";

import { http } from "@/utils/serverFetch";
import {
    Appointment,
    CreateAppointmentDto,
    UpdateAppointmentDto,
    DeleteAppointmentsDto
} from "../_interfaces/appointments.interface";
import { BaseApiResponse } from "@/types/api/types";
import { createSafeAction } from '@/utils/createSafeAction';
import { z } from 'zod';

type CreateAppointmentResponse = BaseApiResponse | { error: string };
type UpdateAppointmentResponse = BaseApiResponse | { error: string };
type DeleteAppointmentResponse = BaseApiResponse | { error: string };

// Definir el esquema correctamente
const GetAppointmentsSchema = z.object({
});

// Definir un nuevo esquema para obtener todas las citas
const GetAllAppointmentsSchema = z.object({
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

        const [appointments, error] = await http.get<Appointment[]>(url);

        if (error) {
            return {
                error: typeof error === 'object' && error !== null && 'message' in error
                    ? String(error.message)
                    : 'Error al obtener todas las citas médicas'
            };
        }

        if (!Array.isArray(appointments)) {
            return { error: 'Respuesta inválida del servidor' };
        }

        return { data: appointments };
    } catch (error) {
        console.error("💥 Error en getAllAppointmentsHandler:", error);
        return { error: "Error al obtener todas las citas médicas" };
    }
}

export const getAppointments = await createSafeAction(GetAppointmentsSchema, getAppointmentsHandler);
export const getActiveAppointments = await createSafeAction(GetAppointmentsSchema, getActiveAppointmentsHandler);
export const getAllAppointments = await createSafeAction(GetAllAppointmentsSchema, getAllAppointmentsHandler);

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