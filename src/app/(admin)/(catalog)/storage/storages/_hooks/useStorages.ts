import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createStorage,
  updateStorage,
  deleteStorage,
  reactivateStorage,
  getStorages,
  getDetailedStorages,
  getStorageById,
  StorageResponse
} from "../_actions/storages.actions";
import { toast } from "sonner";
import {
  Storage, CreateStorageDto, DeleteStorageDto, UpdateStorageDto,
  DetailedStorage,
} from "../_interfaces/storage.interface";
import { BaseApiResponse } from "@/types/api/types";

interface UpdateStorageVariables {
  id: string;
  data: UpdateStorageDto;
}

export const useStorages = () => {
  const queryClient = useQueryClient();

  // Query para obtener los almacenes
  const storagesQuery = useQuery({
    queryKey: ["storages"],
    queryFn: async () => {
      const response = await getStorages({});
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

  const detailedStoragesQuery = useQuery({
    queryKey: ["detailed-storages"],
    queryFn: async () => {
      const response = await getDetailedStorages({});
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

  const oneStorageQuery = useQuery({
    queryKey: ["storage", "some-storage-id"], // replace "some-storage-id" with the actual storage id
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey;
      try{
        const response: StorageResponse = await getStorageById(id);
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

  // Mutación para crear almacén
  const createMutation = useMutation<BaseApiResponse<Storage>, Error, CreateStorageDto>({
    mutationFn: async (data) => {
      const response = await createStorage(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      // Retornamos directamente la respuesta ya que viene en el formato correcto
      return response;
    },
    onSuccess: (res) => {
      queryClient.setQueryData<DetailedStorage[] | undefined>(
        ["detailed-storages"], (oldStorages) => {
          if (!oldStorages) return [res.data as DetailedStorage];
          return [...oldStorages, res.data as DetailedStorage];
      });
      toast.success(res.message);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  // Mutación para actualizar almacén
  const updateMutation = useMutation<BaseApiResponse<Storage>, Error, UpdateStorageVariables>({
    mutationFn: async ({ id, data }) => {
      const response = await updateStorage(id, data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res) => {
      queryClient.setQueryData<DetailedStorage[] | undefined>(["detailed-storages"], (oldStorages) => {
        if (!oldStorages) return undefined;
        return oldStorages.map((storage) =>
          storage.id === res.data.id ? {...storage, ...res.data} : storage
        );
      });
      toast.success("Almacén actualizado exitosamente");
    },
    onError: (error) => {
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al actualizar el almacén");
      }
    },
  });

  // Mutación para eliminar almacenes
  const deleteMutation = useMutation<BaseApiResponse<Storage>, Error, DeleteStorageDto>({
    mutationFn: async (data) => {
      const response = await deleteStorage(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<DetailedStorage[]>(["detailed-storages"], (oldStorages) => {
        if (!oldStorages) {
          return [];
        }
        const updatedStorages = oldStorages.map((storage) => {
          if (variables.ids.includes(storage.id)) {
            return { ...storage, isActive: false };
          }
          return storage;
        });
        return updatedStorages;
      });

      toast.success(
        variables.ids.length === 1
          ? "Almacén desactivado exitosamente"
          : "Almacenes desactivados exitosamente"
      );
    },
    onError: (error) => {
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al desactivar el/los almacén(es)");
      }
    },
  });

  // Mutación para reactivar almacenes
  const reactivateMutation = useMutation<BaseApiResponse<Storage>, Error, DeleteStorageDto>({
    mutationFn: async (data) => {
      const response = await reactivateStorage(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<DetailedStorage[]>(["detailed-storages"], (oldStorages) => {
        if (!oldStorages) {
          return [];
        }
        const updatedStorages = oldStorages.map((storage) => {
          if (variables.ids.includes(storage.id)) {
            return { ...storage, isActive: true };
          }
          return storage;
        });
        return updatedStorages;
      });

      toast.success(
        variables.ids.length === 1
          ? "Almacén reactivado exitosamente"
          : "Almacenes reactivados exitosamente"
      );
    },
    onError: (error) => {
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al reactivar el/los almacén(es)");
      }
    },
  });

  return {
    storagesQuery,
    detailedStoragesQuery,
    storages: storagesQuery.data,
    oneStorageQuery,
    createMutation,
    updateMutation,
    deleteMutation,
    reactivateMutation,
  };
};
