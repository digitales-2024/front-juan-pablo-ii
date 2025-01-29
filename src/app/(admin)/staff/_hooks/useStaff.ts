import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createStaff,
  updateStaff,
  deleteStaff,
  getStaff,
  reactivateStaff,
} from "../_actions/staff.actions";
import { toast } from "sonner";
import {
  Staff,
  CreateStaffDto,
  UpdateStaffDto,
  DeleteStaffDto,
} from "../_interfaces/staff.interface";
import { BaseApiResponse } from "@/types/api/types";

interface UpdateStaffVariables {
  id: string;
  data: UpdateStaffDto;
}

export const useStaff = () => {
  const queryClient = useQueryClient();

  // Query para obtener el personal
  const staffQuery = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const response = await getStaff({});
      
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

  // Mutación para crear personal
  const createMutation = useMutation<BaseApiResponse<Staff>, Error, CreateStaffDto>({
    mutationFn: async (data) => {
      const response = await createStaff(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res) => {
      queryClient.setQueryData<Staff[]>(["staff"], (oldStaff) => {
        if (!oldStaff) return [res.data];
        return [...oldStaff, res.data];
      });
      toast.success(res.message);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  // Mutación para actualizar personal
  const updateMutation = useMutation<BaseApiResponse<Staff>, Error, UpdateStaffVariables>({
    mutationFn: async ({ id, data }) => {
      const response = await updateStaff(id, data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res) => {
      queryClient.setQueryData<Staff[]>(["staff"], (oldStaff) => {
        if (!oldStaff) return [res.data];
        return oldStaff.map((staff) =>
          staff.id === res.data.id ? res.data : staff
        );
      });
      toast.success("Personal actualizado exitosamente");
    },
    onError: (error) => {
      console.error("💥 Error en la mutación:", error);
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al actualizar el personal");
      }
    },
  });

  // Mutación para eliminar personal
  const deleteMutation = useMutation<BaseApiResponse<Staff>, Error, DeleteStaffDto>({
    mutationFn: async (data) => {
      const response = await deleteStaff(data);
      
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<Staff[]>(["staff"], (oldStaff) => {
        if (!oldStaff) return [];
        return oldStaff.map((staff) => {
          if (variables.ids.includes(staff.id)) {
            return { ...staff, isActive: false };
          }
          return staff;
        });
      });

      toast.success(
        variables.ids.length === 1
          ? "Personal desactivado exitosamente"
          : "Personal desactivado exitosamente"
      );
    },
    onError: (error) => {
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al desactivar el personal");
      }
    },
  });

  // Mutación para reactivar personal
  const reactivateMutation = useMutation<BaseApiResponse<Staff>, Error, DeleteStaffDto>({
    mutationFn: async (data) => {
      const response = await reactivateStaff(data);
      
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<Staff[]>(["staff"], (oldStaff) => {
        if (!oldStaff) return [];
        return oldStaff.map((staff) => {
          if (variables.ids.includes(staff.id)) {
            return { ...staff, isActive: true };
          }
          return staff;
        });
      });

      toast.success(
        variables.ids.length === 1
          ? "Personal reactivado exitosamente"
          : "Personal reactivado exitosamente"
      );
    },
    onError: (error) => {
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al reactivar el personal");
      }
    },
  });

  return {
    staffQuery,
    staff: staffQuery.data,
    createMutation,
    updateMutation,
    deleteMutation,
    reactivateMutation,
  };
};