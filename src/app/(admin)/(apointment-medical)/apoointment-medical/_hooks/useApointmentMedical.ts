import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getDoctorConfirmedAppointments,
  getAllConfirmedAppointments,
  getBranchConfirmedAppointments,
  updateAppointmentStatus,
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
export const useAppointmentConfirmed = () => {
  /**
   * Obtiene las citas confirmadas según el rol del usuario
   * Este hook determina automáticamente qué consulta realizar basándose en el rol
   *
   * @returns Hook de query con los datos de citas confirmadas según el rol del usuario
   */
  const useRoleBasedConfirmedAppointments = () => {
    const { user } = useAuth();

    console.log("🚀 ~ useRoleBasedConfirmedAppointments ~ user:", user);
    // Determinar el rol del usuario
    const isSuperAdmin = user?.isSuperAdmin === true;
    const isSuperAdminRole =
      user?.roles?.some((role) => role.name === "SUPER_ADMIN") ?? false;
    const isDoctor =
      user?.roles?.some((role) => role.name === "MEDICO") ?? false;
    const isReceptionist =
      user?.roles?.some((role) => role.name === "ADMINISTRATIVO") ?? false;
    const isAdmin = isSuperAdmin || isSuperAdminRole;

    // Determinar la función y key de query según el rol
    let queryFn;
    let queryKey;
    let enabled = true;

    if (isDoctor && user?.id) {
      queryFn = async () => {
        const response = await getDoctorConfirmedAppointments(user.id);
        if (!response || "error" in response) {
          throw new Error(
            response?.error || "No se encontraron citas confirmadas"
          );
        }
        return response;
      };
      queryKey = ["doctor-confirmed-appointments", user.id];
    } else if (isReceptionist && user?.id) {
      queryFn = async () => {
        const response = await getBranchConfirmedAppointments(user.id);
        if (!response || "error" in response) {
          throw new Error(
            response?.error ||
              "No se encontraron citas confirmadas de la sucursal"
          );
        }
        return response;
      };
      queryKey = ["branch-confirmed-appointments", user.id];
    } else if (isAdmin) {
      queryFn = async () => {
        const response = await getAllConfirmedAppointments();
        if (!response || "error" in response) {
          throw new Error(
            response?.error || "No se encontraron citas confirmadas"
          );
        }
        return response;
      };
      queryKey = ["all-confirmed-appointments"];
    } else {
      // Usuario sin rol definido
      queryFn = () => [];
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
      userId: user?.id,
    };
  };

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

    // Queries para administradores
    useAllConfirmedAppointments,

    // Queries para citas de una sucursal específica
    useBranchConfirmedAppointments,

    // Hook integrado basado en roles
    useRoleBasedConfirmedAppointments,

    // Mutación para actualizar estado
    updateStatusMutation,
  };
};
