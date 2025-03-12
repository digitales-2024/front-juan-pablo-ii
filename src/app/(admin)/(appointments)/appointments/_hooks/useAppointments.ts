import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

import { toast } from "sonner";
import {
    Appointment,
    CreateAppointmentDto,
    UpdateAppointmentDto,
    DeleteAppointmentsDto,
    PaginatedAppointmentsResponse,
    CancelAppointmentDto,
    RefundAppointmentDto
} from "../_interfaces/appointments.interface";
import { BaseApiResponse } from "@/types/api/types";
import { createAppointment, deleteAppointments, getActiveAppointments, getAppointments, reactivateAppointments, updateAppointment, getAllAppointments, cancelAppointment, refundAppointment } from "../_actions/appointments.action";
import { useState } from "react";

interface UpdateAppointmentVariables {
    id: string;
    data: UpdateAppointmentDto;
}

interface CancelAppointmentVariables {
    id: string;
    data: CancelAppointmentDto;
}

interface RefundAppointmentVariables {
    id: string;
    data: RefundAppointmentDto;
}

export const useAppointments = () => {
    const queryClient = useQueryClient();
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10
    });

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

    // Query para obtener las citas paginadas
    const paginatedAppointmentsQuery = useQuery({
        queryKey: ["paginated-appointments", pagination.page, pagination.limit],
        queryFn: async () => {
            const response = await getAllAppointments({
                page: pagination.page,
                limit: pagination.limit
            });

            if (!response) {
                throw new Error("No se recibió respuesta del servidor");
            }

            if (response.error || !response.data) {
                throw new Error(response.error ?? "Error desconocido");
            }

            console.log("Respuesta paginada recibida:", response.data);
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutos
    });

    // Mutación para crear una cita
    const createMutation = useMutation<BaseApiResponse<Appointment>, Error, CreateAppointmentDto>({
        mutationFn: async (data) => {
            console.log("Datos enviados para crear la cita:", data);
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

    // Mutación para cancelar una cita
    const cancelMutation = useMutation<BaseApiResponse<Appointment>, Error, CancelAppointmentVariables>({
        mutationFn: async ({ id, data }) => {
            const response = await cancelAppointment(id, data);
            if ("error" in response) {
                throw new Error(response.error);
            }
            return response;
        },
        onSuccess: (res, variables) => {
            // Actualizar las citas en la caché
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            queryClient.invalidateQueries({ queryKey: ["active-appointments"] });
            queryClient.invalidateQueries({ queryKey: ["paginated-appointments"] });

            toast.success("Cita cancelada exitosamente");
        },
        onError: (error) => {
            console.error("💥 Error al cancelar la cita:", error);
            if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
                toast.error("No tienes permisos para realizar esta acción");
            } else {
                toast.error(error.message || "Error al cancelar la cita");
            }
        },
    });

    // Mutación para reembolsar una cita
    const refundMutation = useMutation<BaseApiResponse<Appointment>, Error, RefundAppointmentVariables>({
        mutationFn: async ({ id, data }) => {
            const response = await refundAppointment(id, data);
            if ("error" in response) {
                throw new Error(response.error);
            }
            return response;
        },
        onSuccess: (res, variables) => {
            // Actualizar las citas en la caché
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            queryClient.invalidateQueries({ queryKey: ["active-appointments"] });
            queryClient.invalidateQueries({ queryKey: ["paginated-appointments"] });

            toast.success("Cita reembolsada exitosamente");
        },
        onError: (error) => {
            console.error("💥 Error al reembolsar la cita:", error);
            if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
                toast.error("No tienes permisos para realizar esta acción");
            } else {
                toast.error(error.message || "Error al reembolsar la cita");
            }
        },
    });

    return {
        appointmentsQuery,
        activeAppointmentsQuery,
        paginatedAppointmentsQuery,
        appointments: appointmentsQuery.data,
        paginatedAppointments: paginatedAppointmentsQuery.data,
        pagination,
        setPagination,
        createMutation,
        updateMutation,
        deleteMutation,
        reactivateMutation,
        cancelMutation,
        refundMutation,
    };
};
