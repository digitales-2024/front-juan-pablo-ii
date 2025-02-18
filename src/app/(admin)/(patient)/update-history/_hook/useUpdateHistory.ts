import {
  useMutation,
  useQueryClient, useQuery,
} from "@tanstack/react-query";
import {
  getPatientById,
  getMedicalHistoryById,
  //getUpdateHistoryById,
  updateMedicalHistory,
} from "../_actions/updateHistory.actions";
//import { toast } from "sonner";
import {
  Patient,
  MedicalHistory,
  UpdateMedicalHistoryDto,
  //UpdateHistory,
} from "../_interfaces/updateHistory.interface";
import { useBranches } from "../../../branches/_hooks/useBranches"; // Importa la función useBranches
import { useServices } from "../../../services/_hooks/useServices"; // Importa la función useBranches
import { useStaff } from "../../../(staff)/staff/_hooks/useStaff"; // Importa la función useStaff
import { BaseApiResponse } from "@/types/api/types";
import { toast } from "sonner";

export const useUpdateHistory = () => {
  const queryClient = useQueryClient();

  // Query para obtener una hisotria específica
  const useMedicalHistoryById = (id: string) =>
    useQuery<MedicalHistory, Error>({
      queryKey: ["medical-history", id],
      queryFn: async () => {
        const response = await getMedicalHistoryById(id);
        if (!response || "error" in response) {
          throw new Error(response?.error || "No se encontró la historia");
        }
        return response;
      },
    });

    // Mutación para actualizar historia médica
  interface UpdateMedicalHistory {
    id: string;
    data: UpdateMedicalHistoryDto;
  }

  const updateMutation = useMutation<
    BaseApiResponse<MedicalHistory>, // Tipo de respuesta exitosa
    Error, // Tipo de error
    UpdateMedicalHistory // Tipo de variables de entrada
  >({
    mutationFn: async ({ id, data }: UpdateMedicalHistory) => {
      const response = await updateMedicalHistory(id, data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (response, variables) => {
      // Actualizar la caché de la consulta específica
      queryClient.setQueryData(
        ["medical-history", variables.id],
        response.data
      );

      toast.success("Historia médica actualizada exitosamente");
    },
    onError: (error: Error) => {
      console.error("Error al actualizar historia médica:", error);

      if (
        error.message.includes("No autorizado") ||
        error.message.includes("Unauthorized")
      ) {
        toast.error("No tienes permisos para realizar esta acción");
        return;
      }

      toast.error(error.message || "Error al actualizar la historia médica");
    },
  });

  // Query para obtener un paciente específico
  const usePatientById = (id: string) =>
    useQuery<Patient, Error>({
      queryKey: ["patient", id],
      queryFn: async () => {
        const response = await getPatientById(id);
        if (!response || "error" in response) {
          throw new Error(response?.error || "No se encontró el paciente");
        }
        //console.log("patient regresando a su componente", response);
        return response;
      },
    });

  // Query para obtener una Actualización de historia específica
/*   const useUpdateHistoryById = (id: string) =>
    useQuery<UpdateHistory, Error>({
      queryKey: ["medical-history", id],
      queryFn: async () => {
        const response = await getUpdateHistoryById(id);
        if ("error" in response) {
          throw new Error(response.error);
        }
        if (!response) {
          throw new Error("No se encontró el paciente");
        }
        return response;
      },
      enabled: !!id,
    }); */

  // Nueva función personalizada para obtener las branches
  const useBranchesData = () => {
    const { branchesQuery } = useBranches();
    return {
      data: branchesQuery.data,
      error: branchesQuery.error,
      isLoading: branchesQuery.isLoading,
    };
  };

  // Nueva función personalizada para obtener los servicios
  const useServicesData = () => {
    const { servicesQuery } = useServices();
    return {
      data: servicesQuery.data,
      error: servicesQuery.error,
      isLoading: servicesQuery.isLoading,
      
    };
  };

  // Nueva función personalizada para obtener el personal
  const useStaffData = () => {
    const { staffQuery } = useStaff();
    return {
      data: staffQuery.data,
      error: staffQuery.error,
      isLoading: staffQuery.isLoading,
    };
  };

  return {
    // Queries
    usePatientById, //
    useMedicalHistoryById,
    //useUpdateHistoryById,
    useBranchesData, // Añade la nueva función personalizada del retorno de la función
    useServicesData, // Añade la nueva función personalizada al retorno
    useStaffData, // Añade la nueva función personalizada al retorno

    // Mutaciones
    updateMutation,
  };
};
