import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createStaffSchedule,
  updateStaffSchedule,
  deleteStaffSchedules,
  getStaffSchedules,
  reactivateStaffSchedules,
  getFilteredStaffSchedules,
} from "../_actions/staff-schedules.action";
import { toast } from "sonner";
import {
  StaffSchedule,
  CreateStaffScheduleDto,
  UpdateStaffScheduleDto,
  DeleteStaffSchedulesDto,
} from "../_interfaces/staff-schedules.interface";
import { BaseApiResponse } from "@/types/api/types";
import { useEvents } from "../../schedules/_hooks/useEvents";
import { Staff } from "../../staff/_interfaces/staff.interface";
import { useMemo } from "react";

interface UpdateStaffScheduleVariables {
  id: string;
  data: UpdateStaffScheduleDto;
}

export const useStaffSchedules = (filters?: { staffId?: string; branchId?: string }) => {
  const queryClient = useQueryClient();
  const { generateEventsMutation, deleteByScheduleIdMutation } = useEvents();

  // Normalizar filtros igual que en useEvents
  const normalizedFilters = useMemo(() => ({
    staffId: filters?.staffId,
    branchId: filters?.branchId
  }), [filters?.staffId, filters?.branchId]);

  // Query para horarios filtrados
  const filteredSchedulesQuery = useQuery({
    queryKey: ["staff-schedules", normalizedFilters],
    queryFn: async () => {
      const response = await getFilteredStaffSchedules(normalizedFilters);

      if (!response) throw new Error("No se recibió respuesta del servidor");
      if (response.error) throw new Error(response.error);
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Estructura de datos inválida");
      }

      return response.data;
    },
    enabled: !!normalizedFilters.staffId || !!normalizedFilters.branchId,
    staleTime: 1000 * 30,
  });

  // Query original para la tabla (sin filtros)
  const allStaffSchedulesQuery = useQuery({
    queryKey: ["staff-schedules"],
    queryFn: async () => {
      const response = await getStaffSchedules({});

      if (!response) throw new Error("Sin respuesta del servidor");
      if (response.error) throw new Error(response.error);
      if (!response.data) throw new Error("Datos no disponibles");

      return response.data;
    },
    staleTime: 1000 * 60, // 1 minuto
  });

  // Mutación para crear horario
  const createMutation = useMutation<BaseApiResponse<StaffSchedule>, Error, CreateStaffScheduleDto>({
    mutationFn: async (data) => {
      const response = await createStaffSchedule(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      // Obtener el staff desde la queryClient para mayor confiabilidad
      const staffFromCache = queryClient.getQueryData<Staff[]>(["staff"]);
      const selectedStaff = staffFromCache?.find(member => member.id === variables.staffId);

      // Actualizar ambas versiones de la query
      const newSchedule = {
        ...res.data,
        staff: selectedStaff ? {
          name: selectedStaff.name,
          lastName: selectedStaff.lastName
        } : undefined
      };

      // Actualizar query keys correctas
      const queryKeysToUpdate = [
        ["staff-schedules"], // Query principal
        ["staff-schedules", { staffId: variables.staffId }] // Filtro específico
      ];

      queryKeysToUpdate.forEach(queryKey => {
        queryClient.setQueryData<StaffSchedule[]>(queryKey, (oldSchedules) => {
          return oldSchedules ? [...oldSchedules, newSchedule] : [newSchedule];
        });
      });

      toast.success(res.message);

      if (res.data?.id && variables.recurrence?.frequency !== 'YEARLY') {
        generateEventsMutation.mutate(res.data.id);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  // Mutación para actualizar horario
  const updateMutation = useMutation<BaseApiResponse<StaffSchedule>, Error, UpdateStaffScheduleVariables>({
    mutationFn: async ({ id, data }) => {
      const response = await updateStaffSchedule(id, data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res) => {
      const queryKeysToUpdate = [
        ["staff-schedules", null],  // Nombre actualizado
        ["staff-schedules", {}],    // Versión con filtros vacíos
        ["staff-schedules", { staffId: res.data?.staffId }] // Filtro específico
      ];

      queryKeysToUpdate.forEach(queryKey => {
        queryClient.setQueryData<StaffSchedule[]>(queryKey, (oldSchedules) => {
          if (!oldSchedules) return [res.data];

          return oldSchedules.map((schedule) => {
            if (schedule.id === res.data.id) {
              return {
                ...schedule,
                ...res.data,
                staff: schedule.staff // Mantener datos existentes
              };
            }
            return schedule;
          });
        });
      });

      toast.success("Horario actualizado exitosamente");
    },
    onError: (error) => {
      console.error("💥 Error en la mutación:", error);
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al actualizar el horario");
      }
    },
  });

  // Mutación para eliminar horarios
  const deleteMutation = useMutation<BaseApiResponse<StaffSchedule>, Error, DeleteStaffSchedulesDto>({
    mutationFn: async (data) => {
      // 1. ELIMINAR EVENTOS PRIMERO
      for (const scheduleId of data.ids) {
        // Llama a deleteEventsByScheduleId *sincrónicamente* con await.
        // Es importante esperar a que se complete la eliminación de eventos
        // antes de continuar.
        await deleteByScheduleIdMutation.mutateAsync(scheduleId);

      }

      // 2. ELIMINAR STAFFSCHEDULE DESPUÉS
      const response = await deleteStaffSchedules(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      // Obtener staffIds afectados de la cache
      const schedulesToDelete = queryClient.getQueryData<StaffSchedule[]>(["staff-schedules"]) || [];
      const affectedStaffIds = schedulesToDelete
        .filter(s => variables.ids.includes(s.id))
        .map(s => s.staffId);

      // Crear claves únicas para actualizar
      const queryKeysToUpdate = [
        ["staff-schedules"],
        ...Array.from(new Set(affectedStaffIds)).map((staffId: string) => ["staff-schedules", { staffId } as const])
      ];

      // Actualizar cada query key afectada
      queryKeysToUpdate.forEach(queryKey => {
        queryClient.setQueryData<StaffSchedule[]>(queryKey, (oldSchedules) => {
          return oldSchedules?.filter(schedule => !variables.ids.includes(schedule.id)) || [];
        });
      });

      // Invalidar queries para forzar refresco si es necesario
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "staff-schedules" &&
          (query.queryKey[1] === undefined || affectedStaffIds.includes((query.queryKey[1] as any)?.staffId))
      });

      toast.success(
        variables.ids.length === 1
          ? "Horario eliminado exitosamente"
          : "Horarios eliminados exitosamente"
      );
    },
    onError: (error) => {
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al eliminar los horarios");
      }
    },
  });

  // Mutación para reactivar horarios
  const reactivateMutation = useMutation<BaseApiResponse<StaffSchedule>, Error, DeleteStaffSchedulesDto>({
    mutationFn: async (data) => {
      const response = await reactivateStaffSchedules(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      const queryKeysToUpdate = [
        ["staff-schedules", null],  // Nombre actualizado
        ["staff-schedules", {}],    // Versión con filtros vacíos
        ...variables.ids.map(id => ["staff-schedules", { staffId: id }])
      ];

      queryKeysToUpdate.forEach(queryKey => {
        queryClient.setQueryData<StaffSchedule[]>(queryKey, (oldSchedules) => {
          if (!oldSchedules) return [];
          return oldSchedules.map((schedule) => {
            if (variables.ids.includes(schedule.id)) {
              return { ...schedule, isActive: true };
            }
            return schedule;
          });
        });
      });

      toast.success(
        variables.ids.length === 1
          ? "Horario reactivado exitosamente"
          : "Horarios reactivados exitosamente"
      );
    },
    onError: (error) => {
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al reactivar los horarios");
      }
    },
  });

  return {
    allStaffSchedulesQuery,
    filteredSchedulesQuery,
    schedules: allStaffSchedulesQuery.data,
    createMutation,
    updateMutation,
    deleteMutation,
    reactivateMutation,
  };
};
