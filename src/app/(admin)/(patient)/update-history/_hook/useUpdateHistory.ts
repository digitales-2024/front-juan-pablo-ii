import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  getPatientById,
  getMedicalHistoryById,
  getUpdateHistoryById,
  updateMedicalHistory,
  getPrescriptionById,
  createPrescription,
  createUpdateHistoryAction,
} from "../_actions/updateHistory.actions";
//import { toast } from "sonner";
import {
  Patient,
  MedicalHistory,
  UpdateHistory,
  PrescriptionResponse,
  MedicalHistoryResponse,
  UpdateMedicalHistoryDto,
  UpdateHistoryResponseImage,
  CreatePrescriptionDto,
  CreateUpdateHistoryFormData
} from "../_interfaces/updateHistory.interface";
import { useBranches } from "../../../branches/_hooks/useBranches"; // Importa la función useBranches
import { useServices } from "../../../services/_hooks/useServices"; // Importa la función useBranches
import { useStaff } from "../../../(staff)/staff/_hooks/useStaff"; // Importa la función useStaff
import { BaseApiResponse } from "@/types/api/types";
import { toast } from "sonner";
import { useProducts } from "@/app/(admin)/(catalog)/product/products/_hooks/useProduct";

export const useUpdateHistory = () => {
  const queryClient = useQueryClient();

  // Query para obtener una hisotria específica
  const useMedicalHistoryById = (id: string) =>
    useQuery<MedicalHistoryResponse, Error>({
      queryKey: ["medical-history", id],
      queryFn: async () => {
        const response = await getMedicalHistoryById(id);
        if (!response || "error" in response) {
          throw new Error(response?.error || "No se encontró la historia");
        }
        console.log("🚀 ~ queryFn: ~ response:", response);
        return response;
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

  // Query para obtener una actualización de hisotria específica

  const useUpdateHistoryById = (id: string) =>
    useQuery<UpdateHistoryResponseImage, Error>({
      queryKey: ["medical-history", id],
      queryFn: async () => {
        const response = await getUpdateHistoryById(id);
        if (!response || "error" in response) {
          throw new Error(
            response?.error || "No se encontró la actualizacion historia"
          );
        }
        return response;
      },
    });

  // Query para obtener una una receta medica

  const usePrescriptionById = (id: string) =>
    useQuery<PrescriptionResponse, Error>({
      queryKey: ["prescription", id],
      queryFn: async () => {
        const response = await getPrescriptionById(id);
        if (!response || "error" in response) {
          throw new Error(
            response?.error || "No se encontró la actualizacion historia"
          );
        }
        return response;
      },
    });

      // Mutación para crear una receta medica
      const createPrescriptionMutation = useMutation<
        BaseApiResponse<PrescriptionResponse>,
        Error,
        CreatePrescriptionDto
      >({
        mutationFn: async (data) => {
          const response = await createPrescription(data);
          if ("error" in response) {
            throw new Error(response.error);
          }
          // Retornamos directamente la respuesta ya que viene en el formato correcto
          return response;
        },
        onSuccess: (res) => {
          queryClient.setQueryData<PrescriptionResponse[]>(["prescription"], (old) => {
            return old ? [...old, res.data] : [res.data];
          });
          
          toast.success(res.message);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });

  //tipado solo para updates
  /*     export type MeidicalHistoryImage = {
      id: string;
      url: string;
  }
  export type MedicalHistoryData = {
      branch: string;
      service: string;
      staff: string;
      images?: MeidicalHistoryImage[];
  }
  export type MedicalHistoryResponse = {
      id: string;
      patientId: string;
      medicalHistory: Record<string, never>;
      description: string;
      isActive: boolean;
      updates?: MedicalHistoryData[];
  } */

  // Nueva función para obtener toda la data

  /*   🚀 ~ medicalHistory: {
    id: '5d344610-1aa2-46fd-91c8-ef9f97ce89d7',
    patientId: 'f399be91-d00f-496d-b97e-7a0294ce1f1d',
    fullName: 'hola12',
    medicalHistory: {
      fumador: 'si dice que lo controla xd',
      alergias: 'alergico a ...',
      cardiacos: 'TA ENAMORADO',
      antecedentes: 'AWEGASWFASWFAWEF',
      neurologicos: 'MUCHO PIENSA EN ELLA',
      cirugiasPrevias: 'Appendectomy 2018',
      enfermedadesCronicas: 'Hypertension'
    },
    description: 'First patient consultation',
    isActive: true,
    createdAt: '2025-02-14 14:57:48',
    updatedAt: '2025-02-18 12:08:21',
    updates: [
      {
        id: '01c51058-4e4b-4e3b-af1c-b2933825d811',
        service: 'consulta general',
        staff: 'MIguel asdasda',
        branch: 'cede 1',
        images: [Array]
      },
      {
        id: '28057476-efdd-4f5d-9bcf-d7d3278ba116',
        service: 'consulta general',
        staff: 'alx flores valdez',
        branch: 'cede 1',
        images: [Array]=images
: 
Array(2)
0
: 
{id: 'ebf4006f-de65-4bc8-a3b5-ad7c7292abba', url: 'https://pub-c8a9c1f826c540b981f5cfb49c3a55ea.r2.dev/fddee54d-e8a6-4ead-a066-78ed1c12b819.png'}
1
: 
{id: 'd7c885c0-d43b-43f0-8dc5-9aebe7174c53', url: 'https://pub-c8a9c1f826c540b981f5cfb49c3a55ea.r2.dev/2b121f69-1dc7-4d41-b824-f3afd92e7849.png'}
l
      }
    ]
  } */
     const useDataPatientHistoryUpdatePrescription = (id: string) =>
      useQuery<[MedicalHistoryResponse, Patient, UpdateHistoryResponseImage[], PrescriptionResponse[]], Error>({
        queryKey: ["data-patient-history-update-prescription", id],
        queryFn: async () => {
          // 1. Obtener historia médica
          const medicalHistoryResponse = await getMedicalHistoryById(id);
          if (!medicalHistoryResponse || "error" in medicalHistoryResponse) {
            throw new Error(medicalHistoryResponse?.error || "No se encontró la historia");
          }
    
          // 2. Obtener paciente
          const patientResponse = await getPatientById(medicalHistoryResponse.patientId);
          if (!patientResponse || "error" in patientResponse) {
            throw new Error(patientResponse?.error || "No se encontró el paciente");
          }
    
          // 3. Procesar updates si existen
          const updates = medicalHistoryResponse.updates ?? [];
          
          // 4. Obtener actualizaciones y recetas
          const updateHistoryResponses = await Promise.all(
            updates.map(async (update) => {
              try {
                const updateHistoryResponse = await getUpdateHistoryById(update.id);
                
                if (!updateHistoryResponse || "error" in updateHistoryResponse) {
                  return { 
                    updateHistoryResponse: null, 
                    prescriptionResponse: null 
                  };
                }
    
                if (updateHistoryResponse.prescription && updateHistoryResponse.prescriptionId) {
                  console.log("🚀 ~ updates.map ~ prescriptionId:", updateHistoryResponse.prescriptionId)
                  console.log("🚀 ~ updates.map ~ prescription:", updateHistoryResponse.prescription)
                  const prescriptionResponse = await getPrescriptionById(updateHistoryResponse.prescriptionId);
                  return { 
                    updateHistoryResponse, 
                    prescriptionResponse: prescriptionResponse && !("error" in prescriptionResponse) ? prescriptionResponse : null 
                  };
                }
    
                return { 
                  updateHistoryResponse, 
                  prescriptionResponse: null 
                };
              } catch (error) {
                console.error("Error al procesar update:", error);
                return { 
                  updateHistoryResponse: null, 
                  prescriptionResponse: null 
                };
              }
            })
          );
    
          // 5. Filtrar resultados
          const updateHistories = updateHistoryResponses
            .map(res => res.updateHistoryResponse)
            .filter((res): res is UpdateHistoryResponseImage => res !== null);
    
          const prescriptions = updateHistoryResponses
            .map(res => res.prescriptionResponse)
            .filter((res): res is PrescriptionResponse => res !== null);
    
          // 6. Retornar datos
          return [
            medicalHistoryResponse,
            patientResponse,
            updateHistories,
            prescriptions
          ];
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
    onSuccess: async(_, variables) => {
      // Actualizar la caché de la consulta específica
      await queryClient.refetchQueries({
        queryKey: ["data-patient-history-update-prescription", variables.id],
      })

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

    // Nueva función personalizada para obtener el personal
    const useProductData = () => {
      const { productsQuery } = useProducts();
      return {
        data: productsQuery.data,
        error: productsQuery.error,
        isLoading: productsQuery.isLoading,
      };
    };

    // Mutación para crear actualizacion de historia medica
  
    const createUpdateHistory = useMutation<
      BaseApiResponse<UpdateHistory>,
      Error,
      CreateUpdateHistoryFormData
    >({
      mutationFn: async (formData) => {
        // Ver los datos antes de pasarlos a la función createPatient
        //console.log("Datos pasados a la mutación:", formData);
        const response = await createUpdateHistoryAction(formData);
        if ("error" in response) {
          throw new Error(response.error);
        }
        return response;
      },
      onSuccess: (res) => {
        queryClient.setQueryData<UpdateHistory[]>(["updateHistory"], (old) => {
          return old ? [...old, res.data] : [res.data];
        });
  
        toast.success("Actualización creada exitosamente");
  
        
        // Llamar a la función de historia médica para actualizarla
        //void queryClient.invalidateQueries({ queryKey: ["medical-histories"] });
   
      },
      onError: (error) => {
        toast.error(error.message || "Error al crear la actualización");
      },
    });

  return {
    // Queries
    usePatientById, //obtener paciente por id
    useMedicalHistoryById, //obtener historia medica por id
    useUpdateHistoryById, //obtener actualizacion de historia medica por id
    usePrescriptionById, //obtener receta medica por id
    useDataPatientHistoryUpdatePrescription,
    useBranchesData, // obtener todos las sucursales
    useServicesData, // obtener todos los servicios
    useStaffData, // obtener todo el personal
    useProductData, // obtener todos los productos

    // Mutaciones
    updateMutation, // actualizar historia medica antesedentes medicos

    // Mutaciones create
    createPrescriptionMutation,
    createUpdateHistory
  };
};
