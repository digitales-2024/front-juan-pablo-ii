import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createService,
  updateService,
  deleteServices,
  getServices,
  reactivateServices,
  getServiceById,
} from "../_actions/service.actions";
import { toast } from "sonner";
import {
  Service,
  CreateServiceDto,
  UpdateServiceDto,
  DeleteServicesDto,
} from "../_interfaces/service.interface";
import { BaseApiResponse } from "@/types/api/types";

interface UpdateServiceVariables {
  id: string;
  data: UpdateServiceDto;
}

export const useServices = () => {
  const queryClient = useQueryClient();

  // Query para obtener los servicios
  const servicesQuery = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      console.log("🔄 Iniciando servicesQuery");
      const response = await getServices({});
      /* console.log("📥 Respuesta raw de getServices:", response); */
      
      if (!response) {
        console.error("❌ No hay respuesta de getServices");
        throw new Error("No se recibió respuesta del servidor");
      }

      if (response.error || !response.data) {
        console.error("❌ Error en servicesQuery:", { error: response.error, data: response.data });
        throw new Error(response.error ?? "Error desconocido");
      }

     /*  console.log("✅ Datos procesados correctamente:", response.data); */
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

    function useOneServiceQuery(serviceId: string) {
      return useQuery({
        queryKey: ["service", serviceId],
        queryFn: async () => {
          try {
            const response = await getServiceById(
              serviceId
            );
            if (!response || "error" in response) {
              throw new Error(response?.error || "No se recibió respuesta");
            }
            return response;
          } catch (error) {
            const message =
              error instanceof Error ? error.message : "Error desconocido";
            toast.error(message);
            return undefined;
          }
        },
        staleTime: 1000 * 60 * 5,
      });
    }

  // Mutación para crear servicio
  const createMutation = useMutation<BaseApiResponse<Service>, Error, CreateServiceDto>({
    mutationFn: async (data) => {
      const response = await createService(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res) => {
      queryClient.setQueryData<Service[]>(["services"], (oldServices) => {
        if (!oldServices) return [res.data];
        return [...oldServices, res.data];
      });
      toast.success(res.message);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  // Mutación para actualizar servicio
  const updateMutation = useMutation<BaseApiResponse<Service>, Error, UpdateServiceVariables>({
    mutationFn: async ({ id, data }) => {
      const response = await updateService(id, data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res) => {
      queryClient.setQueryData<Service[]>(["services"], (oldServices) => {
        if (!oldServices) return [res.data];
        return oldServices.map((service) =>
          service.id === res.data.id ? res.data : service
        );
      });
      toast.success("Servicio actualizado exitosamente");
    },
    onError: (error) => {
      console.error("💥 Error en la mutación:", error);
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al actualizar el servicio");
      }
    },
  });

  // Mutación para eliminar servicios
  const deleteMutation = useMutation<BaseApiResponse<Service>, Error, DeleteServicesDto>({
    mutationFn: async (data) => {
      const response = await deleteServices(data);
      console.log("📥 Respuesta de deleteServices:", response);
      
      if ("error" in response) {
        console.error("❌ Error en deleteServices:", response.error);
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<Service[]>(["services"], (oldServices) => {
        if (!oldServices) return [];
        return oldServices.map((service) => {
          if (variables.ids.includes(service.id)) {
            return { ...service, isActive: false };
          }
          return service;
        });
      });

      toast.success(
        variables.ids.length === 1
          ? "Servicio desactivado exitosamente"
          : "Servicios desactivados exitosamente"
      );
    },
    onError: (error) => {
      console.error("💥 Error en la mutación:", error);
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al desactivar el/los servicio(s)");
      }
    },
  });

  // Mutación para reactivar servicios
  const reactivateMutation = useMutation<BaseApiResponse<Service>, Error, DeleteServicesDto>({
    mutationFn: async (data) => {
      const response = await reactivateServices(data);
      console.log("📥 Respuesta de reactivateServices:", response);
      
      if ("error" in response) {
        console.error("❌ Error en reactivateServices:", response.error);
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<Service[]>(["services"], (oldServices) => {
        if (!oldServices) return [];
        return oldServices.map((service) => {
          if (variables.ids.includes(service.id)) {
            return { ...service, isActive: true };
          }
          return service;
        });
      });

      toast.success(
        variables.ids.length === 1
          ? "Servicio reactivado exitosamente"
          : "Servicios reactivados exitosamente"
      );
    },
    onError: (error) => {
      console.error("💥 Error en la mutación:", error);
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al reactivar el/los servicio(s)");
      }
    },
  });

  return {
    servicesQuery,
    useOneServiceQuery,
    services: servicesQuery.data,
    createMutation,
    updateMutation,
    deleteMutation,
    reactivateMutation,
  };
}; 