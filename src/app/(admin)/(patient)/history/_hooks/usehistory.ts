import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  getMedicalHistories,
  updateMedicalHistory,
  getCompleteMedicalHistory,
  deleteMedicalHistories,
  reactivateMedicalHistories,
} from "../_actions/history.actions";
import { toast } from "sonner";
import {
  MedicalHistory,
  UpdateMedicalHistoryDto,
  DeleteMedicalHistoryDto,
  CompleteMedicalHistory,
} from "../_interfaces/history.interface";
import { BaseApiResponse } from "@/types/api/types";

interface UpdateMedicalHistoryVariables {
  id: string;
  data: UpdateMedicalHistoryDto;
}

export const useMedicalHistories = () => {
  const queryClient = useQueryClient();

  // Query para obtener todas las historias médicas
  const medicalHistoriesQuery = useQuery({
    queryKey: ["medical-histories"],
    queryFn: async () => {
      const response = await getMedicalHistories({});
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

  // Query para obtener la información completa de una historia médica por ID

  /*   export type CompleteMedicalHistory = {
    data: MedicalHistory & {
      updates: Record<
        string,
        {
          service: string;
          staff: string;
          branch: string;
          images: {
            id: string;
            url: string;
          }[];
        }
      >;
    };
  }; */
  // Query para obtener la información completa de una historia médica por ID
  const completeMedicalHistoryQuery = (id: string) =>
    useQuery<CompleteMedicalHistory>({
      queryKey: ["complete-medical-history", id],
      queryFn: async () => {
        const response = await getCompleteMedicalHistory(id);
        if (!response) {
          throw new Error("No se recibió respuesta del servidor");
        }

        if ("error" in response) {
          throw new Error(response.error ?? "Error desconocido");
        }
        return response.data;
      },
      staleTime: 1000 * 60 * 5, // 5 minutos
    });

  // Mutación para actualizar una historia médica
  const updateMedicalHistoryMutation = useMutation<
    BaseApiResponse<MedicalHistory>,
    Error,
    UpdateMedicalHistoryVariables
  >({
    mutationFn: async ({ id, data }) => {
      const response = await updateMedicalHistory(id, data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res) => {
      queryClient.setQueryData<MedicalHistory[]>(
        ["medical-histories"],
        (oldHistories) => {
          if (!oldHistories) {
            return [res.data];
          }
          const updatedHistories = oldHistories.map((history) =>
            history.id === res.data.id ? res.data : history
          );
          return updatedHistories;
        }
      );
      toast.success("Historia médica actualizada exitosamente");
    },
    onError: (error) => {
      toast.error(error.message || "Error al actualizar la historia médica");
    },
  });

  // Mutación para desactivar historias médicas
  const deleteMedicalHistoryMutation = useMutation<
    BaseApiResponse<MedicalHistory>,
    Error,
    DeleteMedicalHistoryDto
  >({
    mutationFn: async (data) => {
      const response = await deleteMedicalHistories(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<MedicalHistory[]>(
        ["medical-histories"],
        (oldHistories) => {
          if (!oldHistories) {
            return [];
          }
          const updatedHistories = oldHistories.map((history) => {
            if (variables.ids.includes(history.id)) {
              return { ...history, isActive: false };
            }
            return history;
          });
          return updatedHistories;
        }
      );

      toast.success(
        variables.ids.length === 1
          ? "Historia médica desactivada exitosamente"
          : "Historias médicas desactivadas exitosamente"
      );
    },
    onError: (error) => {
      toast.error(
        error.message || "Error al desactivar la(s) historia(s) médica(s)"
      );
    },
  });

  // Mutación para reactivar historias médicas
  const reactivateMedicalHistoryMutation = useMutation<
    BaseApiResponse<MedicalHistory>,
    Error,
    DeleteMedicalHistoryDto
  >({
    mutationFn: async (data) => {
      const response = await reactivateMedicalHistories(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res, variables) => {
      queryClient.setQueryData<MedicalHistory[]>(
        ["medical-histories"],
        (oldHistories) => {
          if (!oldHistories) {
            return [];
          }
          const updatedHistories = oldHistories.map((history) => {
            if (variables.ids.includes(history.id)) {
              return { ...history, isActive: true };
            }
            return history;
          });
          return updatedHistories;
        }
      );

      toast.success(
        variables.ids.length === 1
          ? "Historia médica reactivada exitosamente"
          : "Historias médicas reactivadas exitosamente"
      );
    },
    onError: (error) => {
      toast.error(
        error.message || "Error al reactivar la(s) historia(s) médica(s)"
      );
    },
  });

  return {
    medicalHistoriesQuery,
    updateMedicalHistoryMutation,
    completeMedicalHistoryQuery,
    deleteMedicalHistoryMutation,
    reactivateMedicalHistoryMutation,

    isLoading: medicalHistoriesQuery.isLoading,
    isError: medicalHistoriesQuery.isError,
    error: medicalHistoriesQuery.error,
  };
};
