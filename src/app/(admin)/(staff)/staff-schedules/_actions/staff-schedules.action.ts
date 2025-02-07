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
      return { error: typeof error === 'object' && error !== null && 'message' in error 
        ? String(error.message) 
        : 'Error al obtener los horarios' };
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
