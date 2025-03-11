import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getDoctorConfirmedAppointments,
  getDoctorCompletedAppointments,
  getAllConfirmedAppointments,
  getAllCompletedAppointments,
  getBranchConfirmedAppointments,
  getBranchCompletedAppointments,
  updateAppointmentStatus,
} from "../_actions/appoointmentMedical.actions";
import { toast } from "sonner";
import {
  AppointmentResponse,
  UpdateAppointmentUserDto,
} from "../_interfaces/apoointments-medical.inteface";
import { BaseApiResponse } from "@/types/api/types";

/**
 * Hook personalizado para gestionar citas médicas en la aplicación
 * Proporciona funciones para consultar y actualizar citas médicas
 * 
 * @returns Conjunto de funciones y hooks para gestionar las citas médicas
 */
export const useAppointment = () => {

  /**
   * Obtiene las citas confirmadas para un médico específico
   * 
   * @param doctorId - ID del médico para consultar sus citas
   * @returns Hook de query con los datos de citas confirmadas, estado de carga y posibles errores
   * @example
   * ```tsx
   * const { data, isLoading, error } = useDoctorConfirmedAppointments("123");
   * ```
   */
  const useDoctorConfirmedAppointments = (doctorId: string) =>
    useQuery<AppointmentResponse[], Error>({
      queryKey: ["doctor-confirmed-appointments", doctorId],
      queryFn: async () => {
        const response = await getDoctorConfirmedAppointments(doctorId);
        if (!response || "error" in response) {
          throw new Error(
            response?.error || "No se encontraron citas confirmadas"
          );
        }
        return response;
      },
      enabled: !!doctorId,
    });

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
   * Obtiene todas las citas confirmadas (acceso administrativo)
   * 
   * @returns Hook de query con los datos de todas las citas confirmadas, estado de carga y posibles errores
   * @example
   * ```tsx
   * const { data, isLoading, error } = useAllConfirmedAppointments();
   * ```
   */
  const useAllConfirmedAppointments = () =>
    useQuery<AppointmentResponse[], Error>({
      queryKey: ["all-confirmed-appointments"],
      queryFn: async () => {
        const response = await getAllConfirmedAppointments();
        if (!response || "error" in response) {
          throw new Error(
            response?.error || "No se encontraron citas confirmadas"
          );
        }
        return response;
      },
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
   * Obtiene citas confirmadas para la sucursal asociada a un usuario específico
   * 
   * @param userId - ID del usuario de mesón para consultar citas de su sucursal
   * @returns Hook de query con los datos de citas confirmadas de la sucursal, estado de carga y posibles errores
   * @example
   * ```tsx
   * const { data, isLoading, error } = useBranchConfirmedAppointments("456");
   * ```
   */
  const useBranchConfirmedAppointments = (userId: string) =>
    useQuery<AppointmentResponse[], Error>({
      queryKey: ["branch-confirmed-appointments", userId],
      queryFn: async () => {
        const response = await getBranchConfirmedAppointments(userId);
        if (!response || "error" in response) {
          throw new Error(
            response?.error ||
              "No se encontraron citas confirmadas de la sucursal"
          );
        }
        return response;
      },
      enabled: !!userId,
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
    useDoctorConfirmedAppointments,
    useDoctorCompletedAppointments,

    // Queries para administradores
    useAllConfirmedAppointments,
    useAllCompletedAppointments,

    // Queries para citas de una sucursal específica
    useBranchConfirmedAppointments,
    useBranchCompletedAppointments,

    // Mutación para actualizar estado
    updateStatusMutation,
  };
};