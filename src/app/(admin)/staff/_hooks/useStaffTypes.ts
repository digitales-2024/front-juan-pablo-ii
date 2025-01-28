import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createStaffType,
  updateStaffType,
  deleteStaffTypes,
  getStaffTypes,
  reactivateStaffTypes,
} from "../_actions/staff-type.actions";
import { toast } from "sonner";
import {
  StaffType,
  CreateStaffTypeDto,
  UpdateStaffTypeDto,
  DeleteStaffTypeDto,
} from "../_interfaces/staff-type.interface";
import { BaseApiResponse } from "@/types/api/types";

interface UpdateStaffTypeVariables {
  id: string;
  data: UpdateStaffTypeDto;
}

export const useStaffTypes = () => {
  const queryClient = useQueryClient();

  // Query para obtener los tipos de personal
  const staffTypesQuery = useQuery({
    queryKey: ["staffTypes"],
    queryFn: async () => {
      const response = await getStaffTypes({});
      
      if (!response) {
        throw new Error("No se recibió respuesta del servidor");
      }

      if (response.error || !response.data) {
        throw new Error(response.error ?? "Error desconocido");
      }

      console.log("✅ Datos procesados correctamente:", response.data);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Mutación para crear tipo de personal
  const createMutation = useMutation<BaseApiResponse<StaffType>, Error, CreateStaffTypeDto>({
    mutationFn: async (data) => {
      const response = await createStaffType(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res) => {
      queryClient.setQueryData<StaffType[]>(["staffTypes"], (oldTypes) => {
        if (!oldTypes) return [res.data];
        return [...oldTypes, res.data];
      });
      toast.success(res.message);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  // Mutación para actualizar tipo de personal
  const updateMutation = useMutation<BaseApiResponse<StaffType>, Error, UpdateStaffTypeVariables>({
    mutationFn: async ({ id, data }) => {
      const response = await updateStaffType(id, data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res) => {
      queryClient.setQueryData<StaffType[]>(["staffTypes"], (oldTypes) => {
        if (!oldTypes) return [res.data];
        return oldTypes.map((type) =>
          type.id === res.data.id ? res.data : type
        );
      });
      toast.success("Tipo de personal actualizado exitosamente");
    },
    onError: (error) => {
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al actualizar el tipo de personal");
      }
    },
  });

  // Mutación para eliminar tipos de personal
  const deleteMutation = useMutation<BaseApiResponse<StaffType>, Error, DeleteStaffTypeDto>({
    mutationFn: async (data) => {
      const response = await deleteStaffTypes(data);
      
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<StaffType[]>(["staffTypes"], (oldTypes) => {
        if (!oldTypes) return [];
        return oldTypes.map((type) => {
          if (variables.ids.includes(type.id)) {
            return { ...type, isActive: false };
          }
          return type;
        });
      });
      toast.success(
        variables.ids.length === 1
          ? "Tipo de personal desactivado exitosamente"
          : "Tipos de personal desactivados exitosamente"
      );
    },
    onError: (error) => {
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al desactivar el/los tipo(s) de personal");
      }
    },
  });

  // Mutación para reactivar tipos de personal
  const reactivateMutation = useMutation<BaseApiResponse<StaffType>, Error, DeleteStaffTypeDto>({
    mutationFn: async (data) => {
      const response = await reactivateStaffTypes(data);
      
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<StaffType[]>(["staffTypes"], (oldTypes) => {
        if (!oldTypes) return [];
        return oldTypes.map((type) => {
          if (variables.ids.includes(type.id)) {
            return { ...type, isActive: true };
          }
          return type;
        });
      });
      toast.success(
        variables.ids.length === 1
          ? "Tipo de personal reactivado exitosamente"
          : "Tipos de personal reactivados exitosamente"
      );
    },
    onError: (error) => {
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al reactivar el/los tipo(s) de personal");
      }
    },
  });

  return {
    staffTypesQuery,
    staffTypes: staffTypesQuery.data,
    createMutation,
    updateMutation,
    deleteMutation,
    reactivateMutation,
  };
}; 