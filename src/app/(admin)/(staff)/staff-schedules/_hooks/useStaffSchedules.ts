import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createStaffSchedule,
  updateStaffSchedule,
  deleteStaffSchedules,
  getStaffSchedules,
  reactivateStaffSchedules,
} from "../_actions/staff-schedules.action";
import { toast } from "sonner";
import {
  StaffSchedule,
  CreateStaffScheduleDto,
  UpdateStaffScheduleDto,
  DeleteStaffSchedulesDto,
} from "../_interfaces/staff-schedules.interface";
import { BaseApiResponse } from "@/types/api/types";
import { useStaff } from "../../staff/_hooks/useStaff";

interface UpdateStaffScheduleVariables {
  id: string;
  data: UpdateStaffScheduleDto;
}

export const useStaffSchedules = () => {
  const queryClient = useQueryClient();
  const { staff } = useStaff();

  // Query para obtener los horarios
  const staffSchedulesQuery = useQuery({
    queryKey: ["staff-schedules"],
    queryFn: async () => {
      const response = await getStaffSchedules({});
      
      if (!response) {
        throw new Error("No se recibió respuesta del servidor");
      }

      if (response.error || !response.data) {
        throw new Error(response.error ?? "Error desconocido");
      }

      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
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
      // Obtener el staff seleccionado del formulario
      const selectedStaff = staff?.find(member => member.id === variables.staffId);
      
      queryClient.setQueryData<StaffSchedule[]>(["staff-schedules"], (oldSchedules) => {
        const newSchedule = {
          ...res.data,
          staff: selectedStaff ? {
            name: selectedStaff.name,
            lastName: selectedStaff.lastName
          } : undefined
        };
        
        if (!oldSchedules) return [newSchedule];
        return [...oldSchedules, newSchedule];
      });
      toast.success(res.message);
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
      queryClient.setQueryData<StaffSchedule[]>(["staff-schedules"], (oldSchedules) => {
        if (!oldSchedules) return [res.data];
        
        return oldSchedules.map((schedule) => {
          if (schedule.id === res.data.id) {
            // Mantener los datos del staff existente y combinar con la actualización
            return { 
              ...schedule,  // Mantenemos los datos existentes
              ...res.data,  // Aplicamos la actualización
              staff: schedule.staff // Conservamos la información del staff
            };
          }
          return schedule;
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
      const response = await deleteStaffSchedules(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<StaffSchedule[]>(["staff-schedules"], (oldSchedules) => {
        if (!oldSchedules) return [];
        return oldSchedules.map((schedule) => {
          if (variables.ids.includes(schedule.id)) {
            return { ...schedule, isActive: false };
          }
          return schedule;
        });
      });
      toast.success(
        variables.ids.length === 1
          ? "Horario desactivado exitosamente"
          : "Horarios desactivados exitosamente"
      );
    },
    onError: (error) => {
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al desactivar los horarios");
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
      queryClient.setQueryData<StaffSchedule[]>(["staff-schedules"], (oldSchedules) => {
        if (!oldSchedules) return [];
        return oldSchedules.map((schedule) => {
          if (variables.ids.includes(schedule.id)) {
            return { ...schedule, isActive: true };
          }
          return schedule;
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
    staffSchedulesQuery,
    schedules: staffSchedulesQuery.data,
    createMutation,
    updateMutation,
    deleteMutation,
    reactivateMutation,
  };
};
