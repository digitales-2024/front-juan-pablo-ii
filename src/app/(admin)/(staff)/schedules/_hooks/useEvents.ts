import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import {
  createEvent,
  updateEvent,
  deleteEvents,
  reactivateEvents,
  generateEvents,
  getEventsByFilter,
  deleteEventsByScheduleId,
} from '../_actions/event.actions';
import { toast } from 'sonner';
import {
  Event,
  CreateEventDto,
  UpdateEventDto,
  DeleteEventsDto,
  EventStatus,
  EventType,
} from '../_interfaces/event.interface';
import { BaseApiResponse } from '@/types/api/types';
import { useStaff } from '../../staff/_hooks/useStaff';
import { useMemo } from 'react';

interface UpdateEventVariables {
  id: string;
  data: UpdateEventDto;
}


export interface EventFilterParams {
  staffId?: string;
  type: 'TURNO' | 'CITA' | 'OTRO';
  branchId?: string;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  staffScheduleId?: string;
  startDate?: string;
  endDate?: string;
  disablePagination?: boolean;
}

export const useEvents = (filters?: EventFilterParams) => {
  const queryClient = useQueryClient();
  const { staff } = useStaff();

  // Modificar la normalización de filtros
  const normalizedFilters = useMemo(() => ({
    ...filters,
    type: filters?.type ?? 'TURNO',
    status: filters?.status ?? 'CONFIRMED',
    startDate: filters?.startDate,
    endDate: filters?.endDate,
  }), [filters]);

  // Query para obtener eventos con filtros
  const eventsQuery = useQuery({
    queryKey: [
      'events',
      {
        type: normalizedFilters.type,
        status: normalizedFilters.status,
        staffId: normalizedFilters.staffId,
        branchId: normalizedFilters.branchId,
        staffScheduleId: normalizedFilters.staffScheduleId,
        startDate: normalizedFilters.startDate,
        endDate: normalizedFilters.endDate,
      }
    ],
    queryFn: async () => {
      console.log('🚀 [useEvents] Query iniciada con:', {
        filters: JSON.stringify(normalizedFilters, null, 2),
        queryKey: JSON.stringify([
          'events',
          {
            type: normalizedFilters.type,
            status: normalizedFilters.status,
            staffId: normalizedFilters.staffId,
            branchId: normalizedFilters.branchId,
            staffScheduleId: normalizedFilters.staffScheduleId,
            startDate: normalizedFilters.startDate,
            endDate: normalizedFilters.endDate,
          }
        ], null, 2)
      });

      const { data, error } = await getEventsByFilter(normalizedFilters);

      console.log('✅ [useEvents] Respuesta recibida:', {
        success: !error,
        count: data?.length || 0,
        filtersUsed: JSON.stringify(normalizedFilters, null, 2)
      });

      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 30, // Limpiar cache después de 30 minutos
    refetchOnWindowFocus: false, // Evitar recargas automáticas
  });

  // Mutación para crear evento
  const createMutation = useMutation<
    BaseApiResponse<Event>,
    Error,
    CreateEventDto
  >({
    mutationFn: (data) => createEvent(data),
    onSuccess: (res, variables) => {
      // 1. Actualización optimista
      queryClient.setQueryData<Event[]>(
        [
          'events',
          {
            staffId: normalizedFilters.staffId,
            branchId: normalizedFilters.branchId,
            staffScheduleId: normalizedFilters.staffScheduleId,
            startDate: normalizedFilters.startDate,
            endDate: normalizedFilters.endDate,
            type: normalizedFilters.type,
            status: normalizedFilters.status,
          },
        ],
        (oldEvents = []) => {
          const selectedStaff = staff?.find(
            (member) => member.id === variables.staffId
          );

          const newEvent = {
            ...res.data,
            staff: selectedStaff
              ? {
                name: selectedStaff.name,
                lastName: selectedStaff.lastName,
              }
              : undefined,
            branch: variables.branchId
              ? {
                name: 'Sucursal',
              }
              : undefined,
          } as Event;

          return [...oldEvents, newEvent];
        }
      );

      // 2. Invalidar queries relacionadas
      void queryClient.invalidateQueries({
        queryKey: ['events'],
        exact: false,
      });

      toast.success(res.message);
    },
    onError: (error) => {
      // Revertir la actualización optimista en caso de error
      void queryClient.invalidateQueries({
        queryKey: ['events'],
        exact: false,
      });
      toast.error(error.message);
    },
  });

  // Mutación para actualizar evento
  const updateMutation = useMutation<
    BaseApiResponse<Event>,
    Error,
    UpdateEventVariables
  >({
    mutationFn: ({ id, data }) => updateEvent(id, data),
    onSuccess: (res, variables) => {
      // Actualización optimista mejorada
      queryClient.setQueryData<Event[]>(
        [
          'events',
          {
            staffId: normalizedFilters.staffId,
            branchId: normalizedFilters.branchId,
            staffScheduleId: normalizedFilters.staffScheduleId,
            startDate: normalizedFilters.startDate,
            endDate: normalizedFilters.endDate,
            type: normalizedFilters.type,
            status: normalizedFilters.status,
          },
        ],
        (oldEvents = []) =>
          oldEvents.map((event) =>
            event.id === variables.id
              ? {
                ...event,
                ...variables.data,
                type: variables.data.type as EventType,
                status: variables.data.status as EventStatus,
                start: new Date(variables.data.start!),
                end: new Date(variables.data.end!),
              }
              : event
          )
      );

      // Invalidar queries para sincronizar con el servidor
      void queryClient.invalidateQueries({
        queryKey: ['events'],
        exact: false,
      });
    },
    onError: (error) => handleAuthError(error, 'actualizar el evento'),
  });

  // Mutación para eliminar eventos
  const deleteMutation = useMutation<
    BaseApiResponse<Event>,
    Error,
    DeleteEventsDto
  >({
    mutationFn: deleteEvents,
    onSuccess: (res, variables) => {
      queryClient.setQueryData<Event[]>(
        [
          'events',
          {
            staffId: normalizedFilters.staffId,
            branchId: normalizedFilters.branchId,
            staffScheduleId: normalizedFilters.staffScheduleId,
            startDate: normalizedFilters.startDate,
            endDate: normalizedFilters.endDate,
            type: normalizedFilters.type,
            status: normalizedFilters.status,
          },
        ],
        (oldEvents = []) =>
          oldEvents.filter((event) => !variables.ids.includes(event.id))
      );
      void queryClient.invalidateQueries({
        queryKey: ['events'],
        exact: false,
      });
      toast.success(
        variables.ids.length === 1
          ? 'Evento eliminado exitosamente'
          : 'Eventos eliminados exitosamente'
      );
    },
    onError: (error) => {
      void queryClient.invalidateQueries({
        queryKey: ['events'],
        exact: false,
      });
      handleAuthError(error, 'eliminar los eventos');
    },
  });

  // Mutación para reactivar eventos
  const reactivateMutation = useMutation<
    BaseApiResponse<Event>,
    Error,
    DeleteEventsDto
  >({
    mutationFn: reactivateEvents,
    onSuccess: (res, variables) => {
      queryClient.setQueryData<Event[]>(
        [
          'events',
          {
            staffId: normalizedFilters.staffId,
            branchId: normalizedFilters.branchId,
            staffScheduleId: normalizedFilters.staffScheduleId,
            startDate: normalizedFilters.startDate,
            endDate: normalizedFilters.endDate,
            type: normalizedFilters.type,
            status: normalizedFilters.status,
          },
        ],
        (oldEvents = []) =>
          oldEvents.map((event) =>
            variables.ids.includes(event.id)
              ? { ...event, isActive: true }
              : event
          )
      );
      toast.success(
        variables.ids.length === 1
          ? 'Evento reactivado exitosamente'
          : 'Eventos reactivados exitosamente'
      );
    },
    onError: (error) => handleAuthError(error, 'reactivar los eventos'),
  });

  // Mutación para generar eventos recurrentes
  const generateEventsMutation = useMutation<
    BaseApiResponse<Event>,
    Error,
    string
  >({
    mutationFn: (id) => generateEvents(id),
    onSuccess: () => {
      // Invalidar todas las queries de eventos
      void queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Eventos recurrentes generados exitosamente');
    },
    onError: (error) => handleAuthError(error, 'generar eventos recurrentes'),
  });

  // Mutación para eliminar eventos por scheduleId
  const deleteByScheduleIdMutation = useMutation<
    BaseApiResponse<Event>,
    Error,
    string
  >({
    mutationFn: deleteEventsByScheduleId,
    onSuccess: (res, scheduleId) => {
      queryClient.setQueryData<Event[]>(
        [
          'events',
          {
            staffId: normalizedFilters.staffId,
            branchId: normalizedFilters.branchId,
            staffScheduleId: normalizedFilters.staffScheduleId,
            startDate: normalizedFilters.startDate,
            endDate: normalizedFilters.endDate,
            type: normalizedFilters.type,
            status: normalizedFilters.status,
          },
        ],
        (oldEvents = []) =>
          oldEvents.filter((event) => event.staffScheduleId !== scheduleId)
      );
      toast.success('Eventos eliminados exitosamente');
    },
    onError: (error) =>
      handleAuthError(error, 'eliminar eventos por scheduleId'),
  });

  // Manejo de errores de autorización
  const handleAuthError = (error: Error, action: string) => {
    console.error(`Error en ${action}:`, error);
    if (
      error.message.includes('No autorizado') ||
      error.message.includes('Unauthorized')
    ) {
      toast.error(`No tienes permisos para ${action}`);
    } else {
      toast.error(error.message || `Error al ${action}`);
    }
  };

  return {
    eventsQuery,
    events: eventsQuery.data,
    createMutation,
    updateMutation,
    deleteMutation,
    reactivateMutation,
    generateEventsMutation,
    deleteByScheduleIdMutation,
    refetch: eventsQuery.refetch,
  };
};
