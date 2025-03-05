import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

import { toast } from "sonner";
import {
    Appointment,
    CreateAppointmentDto,
    UpdateAppointmentDto,
    DeleteAppointmentsDto,
} from "../_interfaces/appointments.interface";
import { BaseApiResponse } from "@/types/api/types";
import { createAppointment, deleteAppointments, getActiveAppointments, getAppointments, reactivateAppointments, updateAppointment } from "../_actions/appointments.action";

interface UpdateAppointmentVariables {
    id: string;
    data: UpdateAppointmentDto;
}

export const useAppointments = () => {
    const queryClient = useQueryClient();

    // Query para obtener las citas
    const appointmentsQuery = useQuery({
        queryKey: ["appointments"],
        queryFn: async () => {
            const response = await getAppointments({});

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

    // Query para obtener las citas activas
    const activeAppointmentsQuery = useQuery({
        queryKey: ["active-appointments"],
        queryFn: async () => {
            const response = await getActiveAppointments({});

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

    // Mutación para crear una cita
    const createMutation = useMutation<BaseApiResponse<Appointment>, Error, CreateAppointmentDto>({
        mutationFn: async (data) => {
            const response = await createAppointment(data);
            if ("error" in response) {
                throw new Error(response.error);
            }
            return response;
        },
        onSuccess: (res) => {
            queryClient.setQueryData<Appointment[]>(["appointments"], (oldAppointments) => {
                if (!oldAppointments) return [res.data];
                return [...oldAppointments, res.data];
            });
            toast.success(res.message);
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    // Mutación para actualizar una cita
    const updateMutation = useMutation<BaseApiResponse<Appointment>, Error, UpdateAppointmentVariables>({
        mutationFn: async ({ id, data }) => {
            const response = await updateAppointment(id, data);
            if ("error" in response) {
                throw new Error(response.error);
            }
            return response;
        },
        onSuccess: (res) => {
            queryClient.setQueryData<Appointment[]>(["appointments"], (oldAppointments) => {
                if (!oldAppointments) return [res.data];
                return oldAppointments.map((appointment) =>
                    appointment.id === res.data.id ? res.data : appointment
                );
            });
            toast.success("Cita actualizada exitosamente");
        },
        onError: (error) => {
            console.error("💥 Error en la mutación:", error);
            if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
                toast.error("No tienes permisos para realizar esta acción");
            } else {
                toast.error(error.message || "Error al actualizar la cita");
            }
        },
    });

    // Mutación para eliminar citas
    const deleteMutation = useMutation<BaseApiResponse<Appointment>, Error, DeleteAppointmentsDto>({
        mutationFn: async (data) => {
            const response = await deleteAppointments(data);

            if ("error" in response) {
                throw new Error(response.error);
            }
            return response;
        },
        onSuccess: (res, variables) => {
            queryClient.setQueryData<Appointment[]>(["appointments"], (oldAppointments) => {
                if (!oldAppointments) return [];
                return oldAppointments.map((appointment) => {
                    if (variables.ids.includes(appointment.id)) {
                        return { ...appointment, isActive: false };
                    }
                    return appointment;
                });
            });

            toast.success(
                variables.ids.length === 1
                    ? "Cita desactivada exitosamente"
                    : "Citas desactivadas exitosamente"
            );
        },
        onError: (error) => {
            if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
                toast.error("No tienes permisos para realizar esta acción");
            } else {
                toast.error(error.message || "Error al desactivar la cita");
            }
        },
    });

    // Mutación para reactivar citas
    const reactivateMutation = useMutation<BaseApiResponse<Appointment>, Error, DeleteAppointmentsDto>({
        mutationFn: async (data) => {
            const response = await reactivateAppointments(data);

            if ("error" in response) {
                throw new Error(response.error);
            }
            return response;
        },
        onSuccess: (res, variables) => {
            queryClient.setQueryData<Appointment[]>(["appointments"], (oldAppointments) => {
                if (!oldAppointments) return [];
                return oldAppointments.map((appointment) => {
                    if (variables.ids.includes(appointment.id)) {
                        return { ...appointment, isActive: true };
                    }
                    return appointment;
                });
            });

            toast.success(
                variables.ids.length === 1
                    ? "Cita reactivada exitosamente"
                    : "Citas reactivadas exitosamente"
            );
        },
        onError: (error) => {
            if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
                toast.error("No tienes permisos para realizar esta acción");
            } else {
                toast.error(error.message || "Error al reactivar la cita");
            }
        },
    });

    return {
        appointmentsQuery,
        activeAppointmentsQuery,
        appointments: appointmentsQuery.data,
        createMutation,
        updateMutation,
        deleteMutation,
        reactivateMutation,
    };
};
