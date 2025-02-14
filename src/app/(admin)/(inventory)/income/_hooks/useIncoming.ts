import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createIncoming,
  deleteIncoming,
  getDetailedIncomings,
  getIncomings,
  reactivateIncoming,
  updateIncoming,
  ListUpdatedDetailedIncomingResponse,
} from "../_actions/income.actions";
import { toast } from "sonner";
import {
  CreateIncomingDto,
  DeleteIncomingDto,
  UpdateIncomingDto,
  DetailedIncoming,
} from "../_interfaces/income.interface";
import { BaseApiResponse } from "@/types/api/types";

interface UpdateIncomingVariables {
  id: string;
  data: UpdateIncomingDto;
}

export const useIncoming = () => {
  const queryClient = useQueryClient();

  // Query para obtener los ingresos detallados
  const detailedIncomingsQuery = useQuery({
    queryKey: ["detailed-incomings"],
    queryFn: async () => {
      const response = await getDetailedIncomings({});
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

  // Query para obtener los ingresos
  const incomingsQuery = useQuery({
    queryKey: ["incomings"],
    queryFn: async () => {
      const response = await getIncomings({});
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

  // Mutación para crear ingreso
  const createMutation = useMutation<
    BaseApiResponse<DetailedIncoming>,
    Error,
    CreateIncomingDto
  >({
    mutationFn: async (data) => {
      const response = await createIncoming(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      // Retornamos directamente la respuesta ya que viene en el formato correcto
      return response;
    },
    onSuccess: (res) => {
      queryClient.setQueryData<DetailedIncoming[] | undefined>(
        ["detailed-incomings"],
        (oldIncomings) => {
          if (!oldIncomings) return [res.data];
          return [...oldIncomings, res.data];
        }
      );
      toast.success(res.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Mutación para actualizar ingreso
  const updateMutation = useMutation<
    BaseApiResponse<DetailedIncoming>,
    Error,
    UpdateIncomingVariables
  >({
    mutationFn: async ({ id, data }) => {
      const response = await updateIncoming(id, data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: async (res) => {
      queryClient.setQueryData<DetailedIncoming[] | undefined>(
        ["detailed-incomings"],
        (oldIncomings) => {
          if (!oldIncomings) return undefined;
          return oldIncomings.map((incoming) =>
            incoming.id === res.data.id ? { ...incoming, ...res.data } : incoming
          );
        }
      );
      await queryClient.invalidateQueries({ queryKey: ["stock-storages"] });
      toast.success("Ingreso actualizado exitosamente");
    },
    onError: (error) => {
      if (
        error.message.includes("No autorizado") ||
        error.message.includes("Unauthorized")
      ) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al actualizar el ingreso");
      }
    },
  });

  // Mutación para eliminar ingresos
  const deleteMutation = useMutation<
    ListUpdatedDetailedIncomingResponse,
    Error,
    DeleteIncomingDto
  >({
    mutationFn: async (data) => {
      const response = await deleteIncoming(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<DetailedIncoming[]>(
        ["detailed-incomings"],
        (oldIncomings) => {
          if (!oldIncomings) {
            return [];
          }
          const updatedIncomings = oldIncomings.map((incoming) => {
            if (variables.ids.includes(incoming.id)) {
              return { ...incoming, isActive: false };
            }
            return incoming;
          });
          return updatedIncomings;
        }
      );

      toast.success(
        variables.ids.length === 1
          ? "Ingreso desactivado exitosamente"
          : "Ingresos desactivados exitosamente"
      );
    },
    onError: (error) => {
      if (
        error.message.includes("No autorizado") ||
        error.message.includes("Unauthorized")
      ) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al desactivar el/los ingreso(s)");
      }
    },
  });

  // Mutación para reactivar ingresos
  const reactivateMutation = useMutation<
    ListUpdatedDetailedIncomingResponse,
    Error,
    DeleteIncomingDto
  >({
    mutationFn: async (data) => {
      const response = await reactivateIncoming(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<DetailedIncoming[]>(
        ["detailed-incomings"],
        (oldIncomings) => {
          if (!oldIncomings) {
            return [];
          }
          const updatedIncomings = oldIncomings.map((incoming) => {
            if (variables.ids.includes(incoming.id)) {
              return { ...incoming, isActive: true };
            }
            return incoming;
          });
          return updatedIncomings;
        }
      );

      toast.success(
        variables.ids.length === 1
          ? "Ingreso reactivado exitosamente"
          : "Ingresos reactivados exitosamente"
      );
    },
    onError: (error) => {
      if (
        error.message.includes("No autorizado") ||
        error.message.includes("Unauthorized")
      ) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al reactivar el/los ingreso(s)");
      }
    },
  });

  return {
    detailedIncomingsQuery,
    incomingsQuery,
    createMutation,
    updateMutation,
    deleteMutation,
    reactivateMutation,
  };
};
