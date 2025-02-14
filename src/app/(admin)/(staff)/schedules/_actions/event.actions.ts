"use server";

import { http } from "@/utils/serverFetch";
import {
  Event,
  CreateEventDto,
  UpdateEventDto,
  DeleteEventsDto
} from "../_interfaces/event.interface";
import { BaseApiResponse } from "@/types/api/types";
import { createSafeAction } from '@/utils/createSafeAction';
import { z } from 'zod';

export type EventResponse = BaseApiResponse<Event> | { error: string };
type EventFilterParams = {
  staffId?: string;
  type?: "TURNO" | "CITA" | "OTRO";
  branchId?: string;
  status?: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
};

// Schema para getEventsByFilter
const GetEventsByFilterSchema = z.object({
  staffId: z.string().optional(),
  type: z.enum(["TURNO", "CITA", "OTRO"]).optional(),
  branchId: z.string().optional(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"]).optional(),
  staffScheduleId: z.string().optional()
});

const getEventsByFilterHandler = async (filters: EventFilterParams) => {
  try {
    // Limpiar parámetros undefined antes de enviar
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined)
    );

    console.log("🔍 Filtros limpios para /events/filter:", cleanFilters);
    const query = new URLSearchParams(cleanFilters).toString();

    const [response, error] = await http.get<Event[]>(`/events/filter?${query}`);

    if (error || !response) {
      throw new Error(error?.message || 'Error al obtener eventos');
    }

    // Envolver la respuesta en estructura BaseApiResponse
    return {
      data: response,
      message: "Eventos obtenidos exitosamente",
      success: true
    };
  } catch (error) {
    console.error("💥 Error en getEventsByFilterHandler:", error);
    throw error;
  }
}

export const getEventsByFilter = await createSafeAction(GetEventsByFilterSchema, getEventsByFilterHandler);

export async function createEvent(data: CreateEventDto): Promise<BaseApiResponse<Event>> {
  try {
    const [event, error] = await http.post<BaseApiResponse<Event>>("/events", data);

    if (error) {
      throw new Error(error.message);
    }

    return event;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Error desconocido al crear el evento");
  }
}

export async function updateEvent(
  id: string,
  data: UpdateEventDto
): Promise<BaseApiResponse<Event>> {
  try {
    const [event, error] = await http.patch<BaseApiResponse<Event>>(`/events/${id}`, data);
    if (error) throw new Error(error.message);
    return event;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Error al actualizar evento");
  }
}

export async function deleteEvents(data: DeleteEventsDto): Promise<BaseApiResponse<Event>> {
  try {
    const [response, error] = await http.delete<BaseApiResponse<Event>>("/events/remove/all", data);
    if (error) throw new Error(error.message);
    return response;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Error al eliminar eventos");
  }
}

export async function reactivateEvents(data: DeleteEventsDto): Promise<BaseApiResponse<Event>> {
  try {
    const [response, error] = await http.patch<BaseApiResponse<Event>>("/events/reactivate/all", data);
    if (error) throw new Error(error.message);
    return response;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Error al reactivar eventos");
  }
}

export async function generateEvents(id: string): Promise<BaseApiResponse<Event>> {
  try {
    const [response, error] = await http.post<BaseApiResponse<Event>>(`/events/${id}/generate-events`);
    if (error) throw new Error(error.message);
    return response;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Error al generar eventos");
  }
}

export async function getEvents(): Promise<BaseApiResponse<Event[]>> {
  try {
    const [response, error] = await http.get<BaseApiResponse<Event[]>>("/events");
    if (error || !response?.data) throw new Error(error?.message || 'Error al obtener eventos');
    return response;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Error al obtener eventos");
  }
}

// Nueva acción para eliminar eventos por scheduleId
export async function deleteEventsByScheduleId(scheduleId: string): Promise<BaseApiResponse<Event>> {
  try {
    const [response, error] = await http.delete<BaseApiResponse<Event>>(`/events/by-schedule/${scheduleId}`);
    if (error) throw new Error(error.message);
    return response;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Error al eliminar eventos por scheduleId");
  }
}
