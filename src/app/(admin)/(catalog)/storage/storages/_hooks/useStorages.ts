import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createStorage,
  updateStorage,
  deleteStorage,
  reactivateStorage,
  getStorages,
  getDetailedStorages,
  getStorageById,
  getActiveStorages,
  getDetailedStorageById,
  ListDetailedStorageResponse,
  getActiveStoragesByBranch,
} from "../_actions/storages.actions";
import { toast } from "sonner";
import {
  Storage,
  CreateStorageDto,
  DeleteStorageDto,
  UpdateStorageDto,
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

  const activeStoragesQuery = useQuery({
    queryKey: ["active-storages"],
    queryFn: async () => {
      const response = await getActiveStorages({});
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

  // Almacenes con detalled de su tipo de almacén
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

  function useOneStorageQuery(storageId: string) {
    return useQuery({
      queryKey: ["storage", storageId],
      queryFn: async () => {
        try {
          const response: ListDetailedStorageResponse = await getStorageById(
            storageId
          );
          if (!response || "error" in response) {
            throw new Error(response?.error || "No se recibió respuesta");
          }
          return response;
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Error desconocido";
          toast.error(message);
          return [];
        }
      },
      staleTime: 1000 * 60 * 5,
    });
  }

  function useStorageByBranchQuery(branchId: string) {
    return useQuery({
      queryKey: ["storage-by-branch", branchId],
      queryFn: async () => {
        try {
          const response: ListDetailedStorageResponse = await getActiveStoragesByBranch(branchId);
          if (!response || "error" in response) {
            throw new Error(response?.error || "No se recibió respuesta");
          }
          return response;
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Error desconocido";
          toast.error(message);
          return [];
        }
      },
      staleTime: 1000 * 60 * 5,
    });
  }

  // Mutación para crear almacén
  const createMutation = useMutation<
    BaseApiResponse<Storage>,
    Error,
    CreateStorageDto
  >({
    mutationFn: async (data) => {
      const response = await createStorage(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      // Retornamos directamente la respuesta ya que viene en el formato correcto
      return response;
    },
    onSuccess: async (res) => {
      const detailedStorage = await getDetailedStorageById(res.data.id);
      if ("error" in detailedStorage) {
        throw new Error(detailedStorage.error);
      }
      queryClient.setQueryData<DetailedStorage[] | undefined>(
        ["detailed-storages"],
        (oldStorages) => {
          if (!oldStorages) return detailedStorage;
          return [...oldStorages, ...detailedStorage];
        }
      );
      await queryClient.invalidateQueries({
        queryKey: ["active-storages"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["storages"],
      });
      await queryClient.invalidateQueries({ queryKey: ["products-stock-by-use"] });
      await queryClient.invalidateQueries({ queryKey: ["products-stock"] });
      toast.success(res.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Mutación para actualizar almacén
  const updateMutation = useMutation<
    BaseApiResponse<Storage>,
    Error,
    UpdateStorageVariables
  >({
    mutationFn: async ({ id, data }) => {
      const response = await updateStorage(id, data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: async (res) => {
      //Actualiza los datos con las relaciones que tenga
      const detailedStorage = await getDetailedStorageById(res.data.id);
      if ("error" in detailedStorage) {
        throw new Error(detailedStorage.error);
      }
      queryClient.setQueryData<DetailedStorage[] | undefined>(
        ["detailed-storages"],
        (oldStorages) => {
          if (!oldStorages) return undefined;
          return oldStorages.map((storage) =>
            storage.id === res.data.id
              ? { ...storage, ...detailedStorage[0] }
              : storage
          );
        }
      );
      await queryClient.invalidateQueries({
        queryKey: ["active-storages"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["storages"],
      });
      await queryClient.invalidateQueries({ queryKey: ["products-stock-by-use"] });
      await queryClient.invalidateQueries({ queryKey: ["products-stock"] });
      toast.success(res.message);
      toast.success("Almacén actualizado exitosamente");
    },
    onError: (error) => {
      if (
        error.message.includes("No autorizado") ||
        error.message.includes("Unauthorized")
      ) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al actualizar el almacén");
      }
    },
  });

  // Mutación para eliminar almacenes
  const deleteMutation = useMutation<
    BaseApiResponse<Storage>,
    Error,
    DeleteStorageDto
  >({
    mutationFn: async (data) => {
      const response = await deleteStorage(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<DetailedStorage[]>(
        ["detailed-storages"],
        (oldStorages) => {
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
        }
      );

      toast.success(
        variables.ids.length === 1
          ? "Almacén desactivado exitosamente"
          : "Almacenes desactivados exitosamente"
      );
    },
    onError: (error) => {
      if (
        error.message.includes("No autorizado") ||
        error.message.includes("Unauthorized")
      ) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al desactivar el/los almacén(es)");
      }
    },
  });

  // Mutación para reactivar almacenes
  const reactivateMutation = useMutation<
    BaseApiResponse<Storage>,
    Error,
    DeleteStorageDto
  >({
    mutationFn: async (data) => {
      const response = await reactivateStorage(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<DetailedStorage[]>(
        ["detailed-storages"],
        (oldStorages) => {
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
        }
      );

      toast.success(
        variables.ids.length === 1
          ? "Almacén reactivado exitosamente"
          : "Almacenes reactivados exitosamente"
      );
    },
    onError: (error) => {
      if (
        error.message.includes("No autorizado") ||
        error.message.includes("Unauthorized")
      ) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al reactivar el/los almacén(es)");
      }
    },
  });

  return {
    storagesQuery,
    activeStoragesQuery,
    detailedStoragesQuery,
    storages: storagesQuery.data,
    useOneStorageQuery,
    useStorageByBranchQuery,
    createMutation,
    updateMutation,
    deleteMutation,
    reactivateMutation,
  };
};
