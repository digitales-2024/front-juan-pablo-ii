import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createPatient,
  updatePatient,
  deletePatient,
  reactivatePatient,
  getPatients,
  getPatientById,
  getPatientByDni,
} from "../_actions/patient.actions";
import { toast } from "sonner";
import {
  Patient,
  DeletePatientDto,
  CreatePatientFormData,
  UpdatePatientFormData,
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

    // Query para obtener un paciente específico
    const usePatientByDNI = (dni: string) =>
      useQuery<Patient[], Error>({
        queryKey: ["patient-by-dni", dni],
        queryFn: async () => {
          const response = await getPatientByDni(dni);
          if ("error" in response) {
            throw new Error(response.error);
          }
          return response
        },
        enabled: !!dni,
      });

  // Nueva función para buscar pacientes
  const searchPatients = (query: string) => {
    if (!patientsQuery.data) return [];
    return patientsQuery.data.filter(patient =>
      patient.name.toLowerCase().includes(query.toLowerCase()) ||
      patient.dni.includes(query)
    ).map(patient => ({
      value: patient.id,
      label: `${patient.name} ${patient.lastName ?? ''}`.trim(), // Mostrar nombre y apellido
    }));
  };

  // Mutación para crear paciente

  const createMutation = useMutation<
    BaseApiResponse<Patient>,
    Error,
    CreatePatientFormData
  >({
    mutationFn: async (formData) => {
      // Ver los datos antes de pasarlos a la función createPatient
      console.log("Datos pasados a la mutación:", formData);
      const response = await createPatient(formData);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (res) => {
      queryClient.setQueryData<Patient[]>(["patients"], (old) => {
        return old ? [...old, res.data] : [res.data];
      });

      toast.success("Paciente creado exitosamente");

      // Llamar a la función de historia médica para actualizarla
      void queryClient.invalidateQueries({ queryKey: ["medical-histories"] });

    },
    onError: (error) => {
      toast.error(error.message || "Error al crear el paciente");
    },
  });

  // Mutación para actualizar paciente
  const updateMutation = useMutation<
    BaseApiResponse<Patient>,
    Error,
    { id: string; formData: UpdatePatientFormData }
  >({
    mutationFn: async ({ id, formData }) => {
      console.log("Datos en la mutación:", formData);

      const response = await updatePatient(id, formData);
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
          return oldPatients.map((patient) =>
            patient.id === res.data.id ? res.data : patient
          );
        }
      );
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
    usePatientByDNI,
    searchPatients,

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
