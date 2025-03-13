"use server";

import { http } from "@/utils/serverFetch";
import {
  StaffSchedule,
  CreateStaffScheduleDto,
  UpdateStaffScheduleDto,
  DeleteStaffSchedulesDto
} from "../_interfaces/staff-schedules.interface";
import { BaseApiResponse } from "@/types/api/types";
import { createSafeAction } from '@/utils/createSafeAction';
import { z } from 'zod';

type CreateStaffScheduleResponse = BaseApiResponse | { error: string };
type UpdateStaffScheduleResponse = BaseApiResponse | { error: string };
type DeleteStaffScheduleResponse = BaseApiResponse | { error: string };

// Schema para getStaffSchedules
const GetStaffSchedulesSchema = z.object({});

const getStaffSchedulesHandler = async () => {
  try {
    const [schedules, error] = await http.get<StaffSchedule[]>("/staff-schedule");

    if (error) {
      return {
        error: typeof error === 'object' && error !== null && 'message' in error
          ? String(error.message)
          : 'Error al obtener los horarios'
      };
    }

    if (!Array.isArray(schedules)) {
      return { error: 'Respuesta inválida del servidor' };
    }

    return { data: schedules };
  } catch (error) {
    console.error("💥 Error en getStaffSchedulesHandler:", error);
    return { error: "Error al obtener los horarios" };
  }
}

export const getStaffSchedules = await createSafeAction(GetStaffSchedulesSchema, getStaffSchedulesHandler);

export async function createStaffSchedule(
  data: CreateStaffScheduleDto
): Promise<CreateStaffScheduleResponse> {
  try {
    const [schedule, error] = await http.post<BaseApiResponse>("/staff-schedule", data);

    if (error) {
      if (error.statusCode === 401) {
        return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
      }
      return { error: error.message };
    }

    return schedule;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al crear el horario" };
  }
}

export async function updateStaffSchedule(
  id: string,
  data: UpdateStaffScheduleDto
): Promise<UpdateStaffScheduleResponse> {
  try {
    console.log("Datos enviados al backend:", data);

    const [schedule, error] = await http.patch<BaseApiResponse>(`/staff-schedule/${id}`, data);

    if (error) {
      return { error: error.message };
    }

    return schedule;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

export async function deleteStaffSchedules(
  data: DeleteStaffSchedulesDto
): Promise<DeleteStaffScheduleResponse> {
  try {
    const [response, error] = await http.delete<BaseApiResponse>("/staff-schedule/remove/all", data);

    if (error) {
      if (error.statusCode === 401) {
        return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
      }
      return { error: error.message };
    }

    return response;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al eliminar los horarios" };
  }
}

export async function reactivateStaffSchedules(
  data: DeleteStaffSchedulesDto
): Promise<DeleteStaffScheduleResponse> {
  try {
    const [response, error] = await http.patch<BaseApiResponse>("/staff-schedule/reactivate/all", data);

    if (error) {
      if (error.statusCode === 401) {
        return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
      }
      return { error: error.message };
    }

    return response;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al reactivar los horarios" };
  }
}

// Usar el mismo enfoque que getEventsByFilter
const GetFilteredStaffSchedulesSchema = z.object({
  staffId: z.string().uuid().optional(),
  branchId: z.string().uuid().optional()
});

const getFilteredStaffSchedulesHandler = async (filters: z.infer<typeof GetFilteredStaffSchedulesSchema>) => {
  try {
    const query = new URLSearchParams();
    if (filters.staffId) query.append('staffId', filters.staffId);
    if (filters.branchId) query.append('branchId', filters.branchId);

    const [response, error] = await http.get<StaffSchedule[]>(`/staff-schedule/filter?${query.toString()}`);

    if (error) throw new Error(error.message);
    if (!Array.isArray(response)) throw new Error("Formato de respuesta inválido");

    // Mantener consistencia con la estructura de event.actions.ts
    return {
      data: response,
      message: "Horarios filtrados obtenidos exitosamente",
      success: true
    };
  } catch (error) {
    console.error("💥 Error en getFilteredStaffSchedulesHandler:", error);
    return {
      error: error instanceof Error ? error.message : "Error desconocido",
      success: false
    };
  }
}

export const getFilteredStaffSchedules = await createSafeAction(
  GetFilteredStaffSchedulesSchema,
  getFilteredStaffSchedulesHandler
);
