import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

import {
  createOutgoing,
  deleteOutgoing,
  getDetailedOutcomes,
  getOutcomes,
  reactivateOutgoing,
  updateOutgoing,
  ListUpdatedDetailedOutgoingResponse,
  updateOutgoingStorage
} from "../_actions/outgoing.actions";
import { toast } from "sonner";
import {
  CreateOutgoingDto,
  DeleteOutgoingDto,
  UpdateOutgoingDto,
  DetailedOutgoing,
  UpdateOutgoingStorageDto,
} from "../_interfaces/outgoing.interface";
import { BaseApiResponse } from "@/types/api/types";

interface UpdateOutgoingVariables {
  id: string;
  data: UpdateOutgoingDto;
}

interface UpdateOutgoingStorageVariables {
  id: string;
  data: UpdateOutgoingStorageDto;
}

export const useOutgoing = () => {
  const queryClient = useQueryClient();

  // Query para obtener los productos
  const detailedOutcomesQuery = useQuery({
    queryKey: ["detailed-outcomes"],
    queryFn: async () => {
      const response = await getDetailedOutcomes({});
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

  const outcomesQuery = useQuery({
    queryKey: ["outcomes"],
    queryFn: async () => {
      const response = await getOutcomes({});
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

  // Mutación para crear salida
  const createMutation = useMutation<BaseApiResponse<DetailedOutgoing>, Error, CreateOutgoingDto>({
    mutationFn: async (data) => {
      const response = await createOutgoing(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      // Retornamos directamente la respuesta ya que viene en el formato correcto
      return response;
    },
    onSuccess: async (res) => {
      queryClient.setQueryData<DetailedOutgoing[] | undefined>(
        ["detailed-outcomes"], (oldIncomes) => {
          if (!oldIncomes) return [res.data];
          return [...oldIncomes, res.data];
      });
      await queryClient.refetchQueries({ queryKey: ["product-stock-by-storage"] });
      await queryClient.refetchQueries({ queryKey: ["stock"] });
      toast.success(res.message);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  // Mutación para actualizar salida
  const updateMutation = useMutation<BaseApiResponse<DetailedOutgoing>, Error, UpdateOutgoingVariables>({
    mutationFn: async ({ id, data }) => {
      const response = await updateOutgoing(id, data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: async (res) => {
      queryClient.setQueryData<DetailedOutgoing[] | undefined>(["detailed-outcomes"], (oldOutcomes) => {
        if (!oldOutcomes) return undefined;
        return oldOutcomes.map((outcome) =>
          outcome.id === res.data.id ? {...outcome, ...res.data} : outcome
        );
      });
      await queryClient.refetchQueries({ queryKey: ["product-stock-by-storage"] });
      await queryClient.refetchQueries({ queryKey: ["stock-storages"] });
      toast.success("Salida actualizado exitosamente");
    },
    onError: (error) => {
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al actualizar la salida");
      }
    },
  });

  const updateOutgoingStorageMutation = useMutation<
    BaseApiResponse<DetailedOutgoing>,
    Error,
    UpdateOutgoingStorageVariables
  >({
    mutationFn: async ({ id, data }) => {
      const response = await updateOutgoingStorage(id, data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: async (res) => {
      queryClient.setQueryData<DetailedOutgoing[] | undefined>(
        ["detailed-outcomes"],
        (oldOutcomes) => {
          if (!oldOutcomes) return undefined;
          return oldOutcomes.map((outcome) =>
            outcome.id === res.data.id ? { ...outcome, ...res.data } : outcome
          );
        }
      );
      await queryClient.refetchQueries({ queryKey: ["stock-storages"] });
      toast.success("Salida actualizada exitosamente");
    },
    onError: (error) => {
      if (
        error.message.includes("No autorizado") ||
        error.message.includes("Unauthorized")
      ) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al actualizar la salida");
      }
    },
  });

  // Mutación para eliminar productos
  const deleteMutation = useMutation<ListUpdatedDetailedOutgoingResponse, Error, DeleteOutgoingDto>({
    mutationFn: async (data) => {
      const response = await deleteOutgoing(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<DetailedOutgoing[]>(["detailed-outcomes"], (oldOutcomes) => {
        if (!oldOutcomes) {
          return [];
        }
        const updatedOutcomes = oldOutcomes.map((outcome) => {
          if (variables.ids.includes(outcome.id)) {
            return { ...outcome, isActive: false };
          }
          return outcome;
        });
        return updatedOutcomes;
      });

      toast.success(
        variables.ids.length === 1
          ? "Salida desactivada exitosamente"
          : "Salidas desactivadas exitosamente"
      );
    },
    onError: (error) => {
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al desactivar la/las salida(s)");
      }
    },
  });

  // Mutación para reactivar productos
  const reactivateMutation = useMutation<ListUpdatedDetailedOutgoingResponse, Error, DeleteOutgoingDto>({
    mutationFn: async (data) => {
      const response = await reactivateOutgoing(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<DetailedOutgoing[]>(["detailed-outcomes"], (oldOutcomes) => {
        if (!oldOutcomes) {
          return [];
        }
        const updatedOutcomes = oldOutcomes.map((outcome) => {
          if (variables.ids.includes(outcome.id)) {
            return { ...outcome, isActive: true };
          }
          return outcome;
        });
        return updatedOutcomes;
      });

      toast.success(
        variables.ids.length === 1
          ? "Salida reactivada exitosamente"
          : "Salidas reactivadas exitosamente"
      );
    },
    onError: (error) => {
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al reactivar la/las salida(s)");
      }
    },
  });

  return {
    detailedOutcomesQuery,
    outcomesQuery,
    createMutation,
    updateMutation,
    updateOutgoingStorageMutation,
    deleteMutation,
    reactivateMutation,
  };
};
