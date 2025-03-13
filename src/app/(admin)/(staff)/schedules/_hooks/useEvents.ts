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
import { format, startOfMonth, endOfMonth, subDays, addDays } from 'date-fns';

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

// Cambiar de string a array constante
export const EVENT_QUERY_KEY = ['calendar-turns'] as const;

// calendarn-turns
// ['calendar-turns']


export const useEvents = (filters?: EventFilterParams) => {
  const queryClient = useQueryClient();
  const { staff } = useStaff();

  // En la normalización de filtros
  const normalizedFilters = useMemo(() => ({
    ...filters,
    type: 'TURNO' as const,
    status: 'CONFIRMED' as const,
    startDate: filters?.startDate || format(subDays(startOfMonth(new Date()), 7), 'yyyy-MM-dd'),
    endDate: filters?.endDate || format(addDays(endOfMonth(new Date()), 7), 'yyyy-MM-dd')
  }), [filters]);

  // Query para obtener eventos con filtros
  const eventsQuery = useQuery({
    queryKey: [EVENT_QUERY_KEY, normalizedFilters],
    queryFn: async () => {
      console.log('📅 [Events] Fetching:', normalizedFilters);
      const res = await getEventsByFilter(normalizedFilters);
      if (!res.data) {
        console.warn('⚠️ [Events] No se encontraron eventos.');
      }
      return res.data || [];
    },
    staleTime: 1000 * 60 * 15, // Aumentar tiempo de frescura
    gcTime: 1000 * 60 * 30, // Eliminar caché más rápido
    refetchOnMount: true, // Cambiar a true para forzar nueva carga al montar
    refetchOnWindowFocus: true, // Cambiar a true para forzar nueva carga al enfocar la ventana
  });



  const EVENT_CITA_QUERY_KEY = ['calendar-appointments'] as const;


  // Filtros normalizados con type: 'CITA' forzado
  const normalizedCitaFilters = useMemo(() => {
    // Crear un objeto base con los filtros
    const baseFilters = {
      ...filters,
      // Solo forzar el tipo a 'CITA' si no viene especificado
      type: filters?.type || 'CITA' as const,
      startDate: filters?.startDate || format(startOfMonth(new Date()), 'yyyy-MM-dd'),
      endDate: filters?.endDate || format(endOfMonth(new Date()), 'yyyy-MM-dd')
    };

    // Si filters.status está definido, usarlo; de lo contrario, no incluir status en los filtros
    if (filters?.status !== undefined) {
      return {
        ...baseFilters,
        status: filters.status
      };
    }

    // Si no hay status definido, devolver los filtros base sin status
    return baseFilters;
  }, [filters]);

  // Query principal
  const eventsCitaQuery = useQuery({
    // Incluir los filtros en la clave de consulta para evitar problemas de caché
    queryKey: [EVENT_CITA_QUERY_KEY, normalizedCitaFilters],
    queryFn: async () => {
      console.log('📅 [EventsCita] Fetching:', normalizedCitaFilters);
      const res = await getEventsByFilter(normalizedCitaFilters);
      if (!res.data) {
        console.warn('⚠️ [EventsCita] No se encontraron eventos.');
      }
      return res.data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 30, // 30 minutos
    refetchOnWindowFocus: true, // Cambiar a true para actualizar al enfocar la ventana
    refetchOnMount: true, // Cambiar a true para actualizar al montar el componente
  });
  // Mutación para crear evento
  const createMutation = useMutation<
    BaseApiResponse<Event>,
    Error,
    CreateEventDto
  >({
    mutationFn: (data) => createEvent(data),
    onSuccess: (res, variables) => {
      queryClient.setQueryData<Event[]>(EVENT_QUERY_KEY, (oldEvents = []) => {
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
      });
      void queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEY });
      toast.success(res.message);
    },
    onError: (error) => {

      void queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEY });
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
      queryClient.setQueryData<Event[]>(EVENT_QUERY_KEY, (oldEvents = []) =>
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
      void queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEY });
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
    onSuccess: async (res, variables) => {
      // Actualizar la caché directamente eliminando el evento
      queryClient.setQueryData<Event[]>(['calendar-turns'], (oldEvents = []) => {
        return oldEvents.filter(event => !variables.ids.includes(event.id));
      });

      toast.success(variables.ids.length === 1 ? 'Evento eliminado' : 'Eventos eliminados');
    },
    onError: (error) => {
      void queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEY });
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
      queryClient.setQueryData<Event[]>(EVENT_QUERY_KEY, (oldEvents = []) =>
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
      void queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEY });
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
      queryClient.setQueryData<Event[]>(EVENT_QUERY_KEY, (oldEvents = []) =>
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
    eventsCitaQuery,
    eventscita: eventsCitaQuery.data,
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
