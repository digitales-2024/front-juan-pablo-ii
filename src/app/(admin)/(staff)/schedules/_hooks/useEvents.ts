import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createEvent,
  updateEvent,
  deleteEvents,
  reactivateEvents,
  generateEvents,
  getEventsByFilter,
  deleteEventsByScheduleId
} from "../_actions/event.actions";
import { toast } from "sonner";
import {
  Event,
  CreateEventDto,
  UpdateEventDto,
  DeleteEventsDto,
} from "../_interfaces/event.interface";
import { BaseApiResponse } from "@/types/api/types";
import { useStaff } from "../../staff/_hooks/useStaff";
import { useMemo } from "react";

interface UpdateEventVariables {
  id: string;
  data: UpdateEventDto;
}

export interface EventFilterParams {
  staffId?: string;
  type: "TURNO" | "CITA" | "OTRO";
  branchId?: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
  staffScheduleId?: string;
}

export const useEvents = (filters?: EventFilterParams) => {
  const queryClient = useQueryClient();
  const { staff } = useStaff();

  // Normalizar filtros
  const normalizedFilters = useMemo(() => ({
    ...filters,
    staffId: filters?.staffId || undefined,
    staffScheduleId: filters?.staffScheduleId || undefined
  }), [filters]);

  // Query para obtener eventos con filtros
  const eventsQuery = useQuery({
    queryKey: ["events", normalizedFilters],
    queryFn: async () => {
      const response = await getEventsByFilter(normalizedFilters);
      return response.data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Mutación para crear evento
  const createMutation = useMutation<BaseApiResponse<Event>, Error, CreateEventDto>({
    mutationFn: (data) => createEvent(data),
    onSuccess: (res, variables) => {
      queryClient.setQueryData<Event[]>(["events"], (oldSchedules) => {
        const selectedStaff = staff?.find(member => member.id === variables.staffId);
        const newEvent = {
          ...res.data,
          staff: selectedStaff ? {
            name: selectedStaff.name,
            lastName: selectedStaff.lastName
          } : undefined,
          // Asegurar todas las propiedades requeridas de Event
          branch: res.data.branch ? {
            name: res.data.branch.name,
          } : undefined
        } as Event; // Aserción de tipo explícita
        
        if (!oldSchedules) return [newEvent];
        return [...oldSchedules, newEvent];
      });
      toast.success(res.message);
    },
    onError: (error) => toast.error(error.message)
  });

  // Mutación para actualizar evento
  const updateMutation = useMutation<BaseApiResponse<Event>, Error, UpdateEventVariables>({
    mutationFn: ({ id, data }) => updateEvent(id, data),
    onSuccess: (res) => {
      queryClient.setQueryData<Event[]>(["events"], (oldEvents = []) => 
        oldEvents.map(event => 
          event.id === res.data.id ? { 
            ...event, 
            ...res.data,
            staff: event.staff // Mantener datos existentes de staff
          } : event
        )
      );
      toast.success("Evento actualizado exitosamente");
    },
    onError: (error) => handleAuthError(error, "actualizar el evento")
  });

  // Mutación para eliminar eventos
  const deleteMutation = useMutation<BaseApiResponse<Event>, Error, DeleteEventsDto>({
    mutationFn: deleteEvents,
    onSuccess: (res, variables) => {
      queryClient.setQueryData<Event[]>(["events"], (oldEvents = []) => 
        oldEvents.map(event => 
          variables.ids.includes(event.id) 
            ? { ...event, isActive: false } 
            : event
        )
      );
      toast.success(
        variables.ids.length === 1 
          ? "Evento desactivado exitosamente" 
          : "Eventos desactivados exitosamente"
      );
    },
    onError: (error) => handleAuthError(error, "desactivar los eventos")
  });

  // Mutación para reactivar eventos
  const reactivateMutation = useMutation<BaseApiResponse<Event>, Error, DeleteEventsDto>({
    mutationFn: reactivateEvents,
    onSuccess: (res, variables) => {
      queryClient.setQueryData<Event[]>(["events"], (oldEvents = []) => 
        oldEvents.map(event => 
          variables.ids.includes(event.id) 
            ? { ...event, isActive: true } 
            : event
        )
      );
      toast.success(
        variables.ids.length === 1 
          ? "Evento reactivado exitosamente" 
          : "Eventos reactivados exitosamente"
      );
    },
    onError: (error) => handleAuthError(error, "reactivar los eventos")
  });

  // Mutación para generar eventos recurrentes
  const generateEventsMutation = useMutation<BaseApiResponse<Event>, Error, string>({
    mutationFn: (id) => generateEvents(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Eventos recurrentes generados exitosamente");
    },
    onError: (error) => handleAuthError(error, "generar eventos recurrentes")
  });

  // Nueva mutación para eliminar eventos por scheduleId
  const deleteByScheduleIdMutation = useMutation<BaseApiResponse<Event>, Error, string>({
    mutationFn: deleteEventsByScheduleId,
    onSuccess: (res, scheduleId) => {
      // Filtrar los eventos eliminados de la caché
      queryClient.setQueryData<Event[]>(["events"], (oldEvents) => {
        // Asegurarse de que oldEvents no sea undefined
        if (!oldEvents) return [];
        
        // Obtener los IDs de los eventos eliminados desde la respuesta
        const deletedEventIds = res.data ? [res.data.id] : [];

        // Filtrar los eventos que no están en la lista de eliminados
        return oldEvents.filter(event => !deletedEventIds.includes(event.id));
      });

      toast.success("Eventos eliminados exitosamente");
    },
    onError: (error) => handleAuthError(error, "eliminar eventos por scheduleId")
  });

  // Manejo de errores de autorización
  const handleAuthError = (error: Error, action: string) => {
    console.error(`Error en ${action}:`, error);
    if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
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
    refetch: eventsQuery.refetch
  };
}; 