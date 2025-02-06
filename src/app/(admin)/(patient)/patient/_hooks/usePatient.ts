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
 
  UpdatePatientWithImage,
  DeletePatientDto,
  CreatePatientFormData,
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
  // Schema de validación para crear paciente
/* tipado del backen */
/*   type CreatePatientWithImage = CreatePatientDto; */

/* export const createPatientSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().optional(),
  dni: z.string().min(8, "El DNI debe tener 8 caracteres"),
  birthDate: z.string().min(1, "La fecha de nacimiento es requerida"),
  gender: z.string().min(1, "El género es requerido"),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  healthInsurance: z.string().optional(),
  maritalStatus: z.string().optional(),
  occupation: z.string().optional(),
  workplace: z.string().optional(),
  bloodType: z.string().optional(),
  primaryDoctor: z.string().optional(),
  language: z.string().optional(),
  notes: z.string().optional(),
  patientPhoto: z.string().optional(),
  // No incluimos image en el schema porque Zod no maneja bien File
}) satisfies z.ZodType<CreatePatientWithImage>;*/
 
// Tipos inferidos de los schemas más el campo image
/* export type CreatePatientInput = z.infer<typeof createPatientSchema> */

// Tipos para manejar la creación y actualización con imagen
/* export interface CreatePatientFormData {
  data: CreatePatientInput;
  image?: File | null;
}
 */
/* datos del formulario  que se enviar por el dialog para crear un paciente  */
/* const form = useForm<CreatePatientFormData>({
    resolver: zodResolver(createPatientSchema),
    defaultValues: {
      data: {
        name: "",
        lastName: "",
        dni: "",
        birthDate: "",
        gender: "",
        address: "",
        phone: "",
        email: "",
        emergencyContact: "",
        emergencyPhone: "",
        healthInsurance: "",
        maritalStatus: "",
        occupation: "",
        workplace: "",
        bloodType: "",
        primaryDoctor: "",
        language: "",
        notes: "",
        patientPhoto: "", // Este campo se mantiene vacío
      },
      image: null, // Inicializamos el campo de imagen como null
    },
  }); */
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