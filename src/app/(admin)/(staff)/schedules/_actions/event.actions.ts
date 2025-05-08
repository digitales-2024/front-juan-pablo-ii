'use server';

import { http } from '@/utils/serverFetch';
import {
  Event,
  CreateEventDto,
  UpdateEventDto,
  DeleteEventsDto,
} from '../_interfaces/event.interface';
import { BaseApiResponse } from '@/types/api/types';
import { createSafeAction } from '@/utils/createSafeAction';
import { z } from 'zod';

export type EventResponse = BaseApiResponse<Event> | { error: string };
export interface EventFilterParams {
  staffId?: string;
  type: 'TURNO' | 'CITA' | 'OTRO';
  branchId?: string;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW' | 'RESCHEDULED';
  staffScheduleId?: string;
  startDate?: string;
  endDate?: string;
  disablePagination?: boolean;
}


// Schema para getEventsByFilter
const GetEventsByFilterSchema = z.object({
  staffId: z.string().optional(),
  type: z.enum(['TURNO', 'CITA', 'OTRO']),
  branchId: z.string().optional(),
  status: z
    .enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW', 'RESCHEDULED'])
    .optional(),
  staffScheduleId: z.string().optional(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

const getEventsByFilterHandler = async (filters: EventFilterParams) => {
  try {
    // Forzar formato YYYY-MM-DD incluso si vienen undefined
    const cleanStartDate = filters.startDate?.split('T')[0] ?? '';
    const cleanEndDate = filters.endDate?.split('T')[0] ?? '';

    const cleanFilters = {
      ...filters,
      startDate: cleanStartDate,
      endDate: cleanEndDate,
    } as Partial<EventFilterParams>;

    // Eliminar fechas vacías
    if (!cleanFilters.startDate) delete cleanFilters.startDate;
    if (!cleanFilters.endDate) delete cleanFilters.endDate;

    console.log('🔍 Filtros finales:', cleanFilters);
    const query = new URLSearchParams(
      Object.entries(cleanFilters).reduce((acc, [key, value]) => {
        if (typeof value === 'string' && value !== '') acc[key] = value;
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    const [response, error] = await http.get<Event[]>(
      `/events/filter?${query}`
    );

    console.log('📥 Respuesta cruda:', { response, error });

    if (error || !response) {
      console.error('❌ Error en la respuesta:', error);
      throw new Error(error?.message ?? 'Error al obtener eventos');
    }

    return {
      data: response,
      message: 'Eventos obtenidos exitosamente',
      success: true,
    };
  } catch (error) {
    console.error('💥 Error completo:', error);
    throw error;
  }
};

export const getEventsByFilter = await createSafeAction(
  GetEventsByFilterSchema,
  getEventsByFilterHandler
);

export async function createEvent(
  data: CreateEventDto
): Promise<BaseApiResponse<Event>> {
  try {
    console.log('📤 Datos recibidos para crear evento:', {
      ...data,
      staffId: data.staffScheduleId,
      branchId: data.staffScheduleId,
    });
    const [event, error] = await http.post<BaseApiResponse<Event>>(
      '/events',
      data
    );

    if (error) {
      throw new Error(error.message);
    }

    return event;
  } catch (error) {
    console.error('💥 Error completo:', error);
    if (error instanceof z.ZodError) {
      console.error('❌ Errores de validación:', error.errors);
    }
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error desconocido al crear el evento');
  }
}

export async function updateEvent(
  id: string,
  data: UpdateEventDto
): Promise<BaseApiResponse<Event>> {
  try {
    const [event, error] = await http.patch<BaseApiResponse<Event>>(
      `/events/${id}`,
      data
    );
    if (error) throw new Error(error.message);
    return event;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Error al actualizar evento'
    );
  }
}

export async function deleteEvents(
  data: DeleteEventsDto
): Promise<BaseApiResponse<Event>> {
  try {
    const [response, error] = await http.delete<BaseApiResponse<Event>>(
      '/events/remove/all',
      data
    );
    if (error) throw new Error(error.message);
    return response;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Error al eliminar eventos'
    );
  }
}

export async function reactivateEvents(
  data: DeleteEventsDto
): Promise<BaseApiResponse<Event>> {
  try {
    const [response, error] = await http.patch<BaseApiResponse<Event>>(
      '/events/reactivate/all',
      data
    );
    if (error) throw new Error(error.message);
    return response;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Error al reactivar eventos'
    );
  }
}

export async function generateEvents(
  id: string
): Promise<BaseApiResponse<Event>> {
  try {
    const [response, error] = await http.post<BaseApiResponse<Event>>(
      `/events/${id}/generate-events`
    );
    if (error) throw new Error(error.message);
    return response;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Error al generar eventos'
    );
  }
}

export async function getEvents(): Promise<BaseApiResponse<Event[]>> {
  try {
    const [response, error] = await http.get<BaseApiResponse<Event[]>>(
      '/events'
    );
    if (error || !response?.data)
      throw new Error(error?.message ?? 'Error al obtener eventos');
    return response;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Error al obtener eventos'
    );
  }
}

// Nueva acción para eliminar eventos por scheduleId
export async function deleteEventsByScheduleId(
  scheduleId: string
): Promise<BaseApiResponse<Event>> {
  try {
    const [response, error] = await http.delete<BaseApiResponse<Event>>(
      `/events/by-schedule/${scheduleId}`
    );
    if (error) throw new Error(error.message);
    return response;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Error al eliminar eventos por scheduleId'
    );
  }
}
