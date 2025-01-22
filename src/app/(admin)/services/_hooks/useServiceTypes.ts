import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createServiceType,
  updateServiceType,
  deleteServiceTypes,
  getServiceTypes,
  reactivateServiceTypes,
} from "../_actions/service-type.actions";
import { toast } from "sonner";
import {
  ServiceType,
  CreateServiceTypeDto,
  UpdateServiceTypeDto,
  DeleteServiceTypesDto,
} from "../_interfaces/service-type.interface";
import { BaseApiResponse } from "@/types/api/types";

interface UpdateServiceTypeVariables {
  id: string;
  data: UpdateServiceTypeDto;
}

export const useServiceTypes = () => {
  const queryClient = useQueryClient();

  // Query para obtener los tipos de servicio
  const serviceTypesQuery = useQuery({
    queryKey: ["serviceTypes"],
    queryFn: async () => {
      console.log("🔄 Iniciando serviceTypesQuery");
      const response = await getServiceTypes({});
      console.log("📥 Respuesta raw de getServiceTypes:", response);
      
      if (!response) {
        console.error("❌ No hay respuesta de getServiceTypes");
        throw new Error("No se recibió respuesta del servidor");
      }

      if (response.error || !response.data) {
        console.error("❌ Error en serviceTypesQuery:", { error: response.error, data: response.data });
        throw new Error(response.error ?? "Error desconocido");
      }

      console.log("✅ Datos procesados correctamente:", response.data);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Mutación para crear tipo de servicio
  const createMutation = useMutation<BaseApiResponse<ServiceType>, Error, CreateServiceTypeDto>({
    mutationFn: async (data) => {
      const response = await createServiceType(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res) => {
      queryClient.setQueryData<ServiceType[]>(["serviceTypes"], (oldTypes) => {
        if (!oldTypes) return [res.data];
        return [...oldTypes, res.data];
      });
      toast.success(res.message);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  // Mutación para actualizar tipo de servicio
  const updateMutation = useMutation<BaseApiResponse<ServiceType>, Error, UpdateServiceTypeVariables>({
    mutationFn: async ({ id, data }) => {
      const response = await updateServiceType(id, data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res) => {
      queryClient.setQueryData<ServiceType[]>(["serviceTypes"], (oldTypes) => {
        if (!oldTypes) return [res.data];
        return oldTypes.map((type) =>
          type.id === res.data.id ? res.data : type
        );
      });
      toast.success("Tipo de servicio actualizado exitosamente");
    },
    onError: (error) => {
      console.error("💥 Error en la mutación:", error);
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al actualizar el tipo de servicio");
      }
    },
  });

  // Mutación para eliminar tipos de servicio
  const deleteMutation = useMutation<BaseApiResponse<ServiceType>, Error, DeleteServiceTypesDto>({
    mutationFn: async (data) => {
      console.log("🚀 Iniciando deleteMutation con:", data);
      const response = await deleteServiceTypes(data);
      console.log("📥 Respuesta de deleteServiceTypes:", response);
      
      if ("error" in response) {
        console.error("❌ Error en deleteServiceTypes:", response.error);
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<ServiceType[]>(["serviceTypes"], (oldTypes) => {
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
          ? "Tipo de servicio desactivado exitosamente"
          : "Tipos de servicio desactivados exitosamente"
      );
    },
    onError: (error) => {
      console.error("💥 Error en la mutación:", error);
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al desactivar el/los tipo(s) de servicio");
      }
    },
  });

  // Mutación para reactivar tipos de servicio
  const reactivateMutation = useMutation<BaseApiResponse<ServiceType>, Error, DeleteServiceTypesDto>({
    mutationFn: async (data) => {
      console.log("🚀 Iniciando reactivateMutation con:", data);
      const response = await reactivateServiceTypes(data);
      console.log("📥 Respuesta de reactivateServiceTypes:", response);
      
      if ("error" in response) {
        console.error("❌ Error en reactivateServiceTypes:", response.error);
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<ServiceType[]>(["serviceTypes"], (oldTypes) => {
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
          ? "Tipo de servicio reactivado exitosamente"
          : "Tipos de servicio reactivados exitosamente"
      );
    },
    onError: (error) => {
      console.error("💥 Error en la mutación:", error);
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al reactivar el/los tipo(s) de servicio");
      }
    },
  });

  return {
    serviceTypesQuery,
    serviceTypes: serviceTypesQuery.data,
    createMutation,
    updateMutation,
    deleteMutation,
    reactivateMutation,
  };
}; 