import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createTypeStorage,
  updateTypeStorage,
  deleteTypeStorage,
  reactivateTypeStorage,
  getTypeStorages,
  //getDetailedTypeStorages,
  getTypeStorageById,
  TypeStorageResponse
} from "../_actions/storageTypes.actions";
import { toast } from "sonner";
import {
  TypeStorage, CreateTypeStorageDto, DeleteTypeStorageDto, UpdateTypeStorageDto,
} from "../_interfaces/storageTypes.interface";
import { BaseApiResponse } from "@/types/api/types";

interface UpdateTypeStorageVariables {
  id: string;
  data: UpdateTypeStorageDto;
}

export const useTypeStorages = () => {
  const queryClient = useQueryClient();

  // Query para obtener los tipos de almacenamiento
  const typeStoragesQuery = useQuery({
    queryKey: ["typeStorages"],
    queryFn: async () => {
      const response = await getTypeStorages({});
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

  // const detailedTypeStoragesQuery = useQuery({
  //   queryKey: ["detailed-typeStorages"],
  //   queryFn: async () => {
  //     const response = await getDetailedTypeStorages({});
  //     if (!response) {
  //       throw new Error("No se recibió respuesta del servidor");
  //     }

  //     if (response.error || !response.data) {
  //       throw new Error(response.error ?? "Error desconocido");
  //     }
  //     return response.data;
  //   },
  //   staleTime: 1000 * 60 * 5, // 5 minutos
  // });

  const oneTypeStorageQuery = useQuery({
    queryKey: ["typeStorage", "some-typeStorage-id"], // replace "some-typeStorage-id" with the actual type storage id
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey;
      try{
        const response: TypeStorageResponse = await getTypeStorageById(id);
        if (!response) {
          throw new Error("No se recibió respuesta del servidor");
        }
        if ('error' in response) {
          throw new Error(response.error);
        }
        if ('data' in response) {
          return response.data;
        }
      } catch (error) {
        if (error instanceof Error) return { error: error.message };
        return { error: "Error desconocido" };
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Mutación para crear tipo de almacenamiento
  const createMutation = useMutation<BaseApiResponse<TypeStorage>, Error, CreateTypeStorageDto>({
    mutationFn: async (data) => {
      const response = await createTypeStorage(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      // Retornamos directamente la respuesta ya que viene en el formato correcto
      return response;
    },
    onSuccess: (res) => {
      queryClient.setQueryData<TypeStorage[] | undefined>(
        ["typeStorages"], (oldTypeStorages) => {
          if (!oldTypeStorages) return [res.data];
          return [...oldTypeStorages, res.data];
      });
      toast.success(res.message);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  // Mutación para actualizar tipo de almacenamiento
  const updateMutation = useMutation<BaseApiResponse<TypeStorage>, Error, UpdateTypeStorageVariables>({
    mutationFn: async ({ id, data }) => {
      const response = await updateTypeStorage(id, data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res) => {
      queryClient.setQueryData<TypeStorage[] | undefined>(["typeStorages"], (oldTypeStorages) => {
        if (!oldTypeStorages) return undefined;
        return oldTypeStorages.map((typeStorage) =>
          typeStorage.id === res.data.id ? {...typeStorage, ...res.data} : typeStorage
        );
      });
      toast.success("Tipo de almacenamiento actualizado exitosamente");
    },
    onError: (error) => {
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al actualizar el tipo de almacenamiento");
      }
    },
  });

  // Mutación para eliminar tipos de almacenamiento
  const deleteMutation = useMutation<BaseApiResponse<TypeStorage>, Error, DeleteTypeStorageDto>({
    mutationFn: async (data) => {
      const response = await deleteTypeStorage(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<TypeStorage[]>(["typeStorages"], (oldTypeStorages) => {
        console.log("🔄 Cache actual:", oldTypeStorages);
        if (!oldTypeStorages) {
          console.log("⚠️ No hay tipos de almacenamiento en caché");
          return [];
        }
        const updatedTypeStorages = oldTypeStorages.map((typeStorage) => {
          if (variables.ids.includes(typeStorage.id)) {
            return { ...typeStorage, isActive: false };
          }
          return typeStorage;
        });
        console.log("📦 Nueva caché:", updatedTypeStorages);
        return updatedTypeStorages;
      });

      toast.success(
        variables.ids.length === 1
          ? "Tipo de almacenamiento desactivado exitosamente"
          : "Tipos de almacenamiento desactivados exitosamente"
      );
    },
    onError: (error) => {
      console.error("💥 Error en la mutación:", error);
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al desactivar el/los tipo(s) de almacenamiento");
      }
    },
  });

  // Mutación para reactivar tipos de almacenamiento
  const reactivateMutation = useMutation<BaseApiResponse<TypeStorage>, Error, DeleteTypeStorageDto>({
    mutationFn: async (data) => {
      const response = await reactivateTypeStorage(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<TypeStorage[]>(["typeStorages"], (oldTypeStorages) => {
        if (!oldTypeStorages) {
          return [];
        }
        const updatedTypeStorages = oldTypeStorages.map((typeStorage) => {
          if (variables.ids.includes(typeStorage.id)) {
            return { ...typeStorage, isActive: true };
          }
          return typeStorage;
        });
        return updatedTypeStorages;
      });

      toast.success(
        variables.ids.length === 1
          ? "Tipo de almacenamiento reactivado exitosamente"
          : "Tipos de almacenamiento reactivados exitosamente"
      );
    },
    onError: (error) => {
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al reactivar el/los tipo(s) de almacenamiento");
      }
    },
  });

  return {
    typeStoragesQuery,
    //detailedTypeStoragesQuery,
    typeStorages: typeStoragesQuery.data,
    oneTypeStorageQuery,
    createMutation,
    updateMutation,
    deleteMutation,
    reactivateMutation,
  };
};
