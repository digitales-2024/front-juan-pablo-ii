import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createPatient,
  updatePatient,
  deletePatient,
  reactivatePatient,
  getPatients,
  getPatientById,
} from "../_actions/patient.actions";
import { toast } from "sonner";
import {
  Patient,
  CreatePatientWithImage,
  UpdatePatientWithImage,
  DeletePatientDto,
} from "../_interfaces/patient.interface";
import { BaseApiResponse } from "@/types/api/types";

export const usePatients = () => {
  const queryClient = useQueryClient();

  // Query para obtener todos los pacientes
  const patientsQuery = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const response = await getPatients({});
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

  // Query para obtener un paciente específico
  const usePatientById = (id: string) =>
    useQuery<Patient, Error>({
      queryKey: ["patient", id],
      queryFn: async () => {
        const response = await getPatientById(id);
        if ("error" in response) {
          throw new Error(response.error);
        }
        if (!response.data) {
          throw new Error("No se encontró el paciente");
        }
        return response.data;
      },
      enabled: !!id,
    });

  // Mutación para crear paciente
  const createMutation = useMutation<
    BaseApiResponse<Patient>,
    Error,
    CreatePatientWithImage
  >({
    mutationFn: async (data) => {
      const response = await createPatient(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res) => {
      queryClient.setQueryData<Patient[] | undefined>(
        ["patients"],
        (oldPatients) => {
          if (!oldPatients) return [res.data];
          return [...oldPatients, res.data];
        }
      );
      toast.success(res.message || "Paciente creado exitosamente");
    },
    onError: (error) => {
      toast.error(error.message || "Error al crear el paciente");
    },
  });

  // Mutación para actualizar paciente
  const updateMutation = useMutation<
    BaseApiResponse<Patient>,
    Error,
    { id: string; data: UpdatePatientWithImage }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await updatePatient(id, data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res) => {
      queryClient.setQueryData<Patient[] | undefined>(
        ["patients"], (oldPatients) => {
          if (!oldPatients) return [res.data];
          return oldPatients.map((patient) =>
            patient.id === res.data.id ? res.data : patient
          );
      });
      toast.success(res.message || "Paciente actualizado exitosamente");
    },
    onError: (error) => {
      toast.error(error.message || "Error al actualizar el paciente");
    },
  });

  // Mutación para eliminar pacientes
  const deleteMutation = useMutation<
    BaseApiResponse<Patient>,
    Error,
    DeletePatientDto
  >({
    mutationFn: async (data) => {
      const response = await deletePatient(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.setQueryData<Patient[]>(["patients"], (oldPatients) => {
        if (!oldPatients) return [];
        return oldPatients.map((patient) => {
          if (variables.ids.includes(patient.id)) {
            return { ...patient, isActive: false };
          }
          return patient;
        });
      });

      toast.success(
        variables.ids.length === 1
          ? "Paciente desactivado exitosamente"
          : "Pacientes desactivados exitosamente"
      );
    },
    onError: (error) => {
      if (error.message.includes("No autorizado")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al desactivar el/los paciente(s)");
      }
    },
  });

  // Mutación para reactivar pacientes
  const reactivateMutation = useMutation<
    BaseApiResponse<Patient>,
    Error,
    DeletePatientDto
  >({
    mutationFn: async (data) => {
      const response = await reactivatePatient(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.setQueryData<Patient[]>(["patients"], (oldPatients) => {
        if (!oldPatients) return [];
        return oldPatients.map((patient) => {
          if (variables.ids.includes(patient.id)) {
            return { ...patient, isActive: true };
          }
          return patient;
        });
      });

      toast.success(
        variables.ids.length === 1
          ? "Paciente reactivado exitosamente"
          : "Pacientes reactivados exitosamente"
      );
    },
    onError: (error) => {
      if (error.message.includes("No autorizado")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al reactivar el/los paciente(s)");
      }
    },
  });

  return {
    // Queries
    patientsQuery,
    usePatientById,
    patients: patientsQuery.data,

    // Mutations
    createMutation,
    updateMutation,
    deleteMutation,
    reactivateMutation,

    // Loading states
    isLoading: patientsQuery.isLoading,
    isError: patientsQuery.isError,
    error: patientsQuery.error,
  };
};
