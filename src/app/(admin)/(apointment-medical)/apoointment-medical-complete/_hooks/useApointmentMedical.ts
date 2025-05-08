import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getDoctorCompletedAppointments,
  getAllCompletedAppointments,
  getBranchCompletedAppointments,
  updateAppointmentStatus,
  // Importaciones de Confirmed no necesarias para este contexto
} from "../_actions/appoointmentMedical.actions";
import { toast } from "sonner";
import {
  AppointmentResponse,
  UpdateAppointmentUserDto,
} from "../_interfaces/apoointments-medical.inteface";
import { BaseApiResponse } from "@/types/api/types";
import { useAuth } from "@/app/(auth)/sign-in/_hooks/useAuth";

/**
 * Hook personalizado para gestionar citas médicas en la aplicación
 * Proporciona funciones para consultar y actualizar citas médicas
 * 
 * @returns Conjunto de funciones y hooks para gestionar las citas médicas
 */
export const useAppointmentComplete = () => {
  // Hooks existentes...

  /**
   * Obtiene las citas completadas según el rol del usuario
   * Este hook determina automáticamente qué consulta realizar basándose en el rol
   * 
   * @returns Hook de query con los datos de citas completadas según el rol del usuario
   */
  const useRoleBasedCompletedAppointments = () => {
    const { user } = useAuth();
    
    // Determinar el rol del usuario
    const isSuperAdmin = user?.isSuperAdmin === true;
    const isSuperAdminRole = user?.roles?.some(role => role.name === "SUPER_ADMIN") ?? false;
    const isDoctor = user?.roles?.some(role => role.name === "MEDICO") ?? false;
    const isReceptionist = user?.roles?.some(role => role.name === "ADMINISTRATIVO") ?? false;
    const isAdmin = isSuperAdmin || isSuperAdminRole;
    
    // Determinar la función y key de query según el rol
    let queryFn;
    let queryKey;
    let enabled = true;
    
    if (isDoctor && user?.id) {
      queryFn = async () => {
        const response = await getDoctorCompletedAppointments(user.id);
        if (!response || "error" in response) {
          throw new Error(response?.error || "No se encontraron citas completadas");
        }
        return response;
      };
      queryKey = ["doctor-completed-appointments", user.id];
    } else if (isReceptionist && user?.id) {
      queryFn = async () => {
        const response = await getBranchCompletedAppointments(user.id);
        if (!response || "error" in response) {
          throw new Error(response?.error || "No se encontraron citas completadas de la sucursal");
        }
        return response;
      };
      queryKey = ["branch-completed-appointments", user.id];
    } else if (isAdmin) {
      queryFn = async () => {
        const response = await getAllCompletedAppointments();
        if (!response || "error" in response) {
          throw new Error(response?.error || "No se encontraron citas completadas");
        }
        return response;
      };
      queryKey = ["all-completed-appointments"];
    } else {
      // Usuario sin rol definido
      queryFn = () => Promise.resolve([]);
      queryKey = ["no-appointments"];
      enabled = false;
    }
    
    return {
      ...useQuery<AppointmentResponse[], Error>({
        queryKey,
        queryFn,
        enabled,
      }),
      userRole: { isAdmin, isDoctor, isReceptionist },
      userId: user?.id
    };
  };

  /**
   * Obtiene las citas completadas para un médico específico
   * 
   * @param doctorId - ID del médico para consultar sus citas
   * @returns Hook de query con los datos de citas completadas, estado de carga y posibles errores
   * @example
   * ```tsx
   * const { data, isLoading, error } = useDoctorCompletedAppointments("123");
   * ```
   */
  const useDoctorCompletedAppointments = (doctorId: string) =>
    useQuery<AppointmentResponse[], Error>({
      queryKey: ["doctor-completed-appointments", doctorId],
      queryFn: async () => {
        const response = await getDoctorCompletedAppointments(doctorId);
        if (!response || "error" in response) {
          throw new Error(
            response?.error || "No se encontraron citas completadas"
          );
        }
        return response;
      },
      enabled: !!doctorId,
    });

  /**
   * Obtiene todas las citas completadas (acceso administrativo)
   * 
   * @returns Hook de query con los datos de todas las citas completadas, estado de carga y posibles errores
   * @example
   * ```tsx
   * const { data, isLoading, error } = useAllCompletedAppointments();
   * ```
   */
  const useAllCompletedAppointments = () =>
    useQuery<AppointmentResponse[], Error>({
      queryKey: ["all-completed-appointments"],
      queryFn: async () => {
        const response = await getAllCompletedAppointments();
        if (!response || "error" in response) {
          throw new Error(
            response?.error || "No se encontraron citas completadas"
          );
        }
        return response;
      },
    });

  /**
   * Obtiene citas completadas para la sucursal asociada a un usuario específico
   * 
   * @param userId - ID del usuario de mesón para consultar citas de su sucursal
   * @returns Hook de query con los datos de citas completadas de la sucursal, estado de carga y posibles errores
   * @example
   * ```tsx
   * const { data, isLoading, error } = useBranchCompletedAppointments("456");
   * ```
   */
  const useBranchCompletedAppointments = (userId: string) =>
    useQuery<AppointmentResponse[], Error>({
      queryKey: ["branch-completed-appointments", userId],
      queryFn: async () => {
        const response = await getBranchCompletedAppointments(userId);
        if (!response || "error" in response) {
          throw new Error(
            response?.error ||
              "No se encontraron citas completadas de la sucursal"
          );
        }
        return response;
      },
      enabled: !!userId,
    });

  /**
   * Interfaz para actualizar el estado de una cita
   */
  interface UpdateAppointmentStatus {
    /**
     * ID de la cita a actualizar
     */
    id: string;
    /**
     * Datos para la actualización, incluye el nuevo estado
     */
    data: UpdateAppointmentUserDto;
  }

  /**
   * Mutación para actualizar el estado de una cita médica
   * 
   * @remarks
   * Después de actualizar el estado, se debe recargar manualmente los datos
   * usando refetch() en el hook de consulta correspondiente
   * 
   * @example
   * ```tsx
   * const { updateStatusMutation } = useAppointment();
   * const { refetch } = useDoctorConfirmedAppointments(doctorId);
   * 
   * const handleComplete = (id) => {
   *   updateStatusMutation.mutate(
   *     { id, data: { status: "COMPLETED" } },
   *     {
   *       onSuccess: () => {
   *         refetch(); // Recargar datos manualmente
   *       }
   *     }
   *   );
   * };
   * ```
   */
  const updateStatusMutation = useMutation<
    BaseApiResponse<AppointmentResponse>,
    Error,
    UpdateAppointmentStatus
  >({
    mutationFn: async ({ id, data }: UpdateAppointmentStatus) => {
      const response = await updateAppointmentStatus(id, data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (response) => {
      toast.success(response.message || "Estado de cita actualizado con éxito");
    },
    onError: (error) => {
      toast.error(error.message || "Error al actualizar el estado de la cita");
    },
  });

  return {
    // Queries para citas de médicos específicos
    useDoctorCompletedAppointments,

    // Queries para administradores
    useAllCompletedAppointments,

    // Queries para citas de una sucursal específica
    useBranchCompletedAppointments,

    // Agregamos el nuevo hook integrado
    useRoleBasedCompletedAppointments,
    
    // Mutación para actualizar estado
    updateStatusMutation,
  };
};