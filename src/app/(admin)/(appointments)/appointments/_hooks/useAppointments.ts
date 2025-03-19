import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

import { toast } from "sonner";
import {
    Appointment,
    CreateAppointmentDto,
    UpdateAppointmentDto,
    DeleteAppointmentsDto,
    CancelAppointmentDto,
    RefundAppointmentDto,
    RescheduleAppointmentDto,
    AppointmentStatus
} from "../_interfaces/appointments.interface";
import { BaseApiResponse } from "@/types/api/types";
import { createAppointment, deleteAppointments, getActiveAppointments, getAppointments, reactivateAppointments, updateAppointment, getAllAppointments, cancelAppointment, refundAppointment, rescheduleAppointment, getAppointmentById, getAppointmentsByStatus } from "../_actions/appointments.action";
import { useState, useEffect, useCallback } from "react";
import { useSelectedServicesAppointmentsDispatch } from "@/app/(admin)/(payment)/prescriptions/_hooks/useCreateAppointmentForOrder";
import { useEvents } from "@/app/(admin)/(staff)/schedules/_hooks/useEvents";
import { EventType, EventStatus } from "@/app/(admin)/(staff)/schedules/_interfaces/event.interface";
import { getPatientById } from "@/app/(admin)/(patient)/patient/_actions/patient.actions";
import { getStaffById } from "@/app/(admin)/(staff)/staff/_actions/staff.actions";

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

interface RescheduleAppointmentVariables {
    id: string;
    data: RescheduleAppointmentDto;
}

// Definir una constante para la clave de consulta base y una función para construir la clave completa

// Función auxiliar para construir la clave de consulta con los filtros
export const buildAppointmentsQueryKey = (status: AppointmentStatus, page: number, limit: number) =>
    ["appointments-paginated", status, page, limit];

export const useAppointments = () => {
    console.log("🏥 Inicializando useAppointments");

    const queryClient = useQueryClient();
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10
    });

    // Añadir estado para el filtro por estado - inicializar con "all" para mostrar todas las citas por defecto
    const [statusFilter, setStatusFilter] = useState<AppointmentStatus>("all");

    // Construir la clave de consulta actual
    const currentQueryKey = buildAppointmentsQueryKey(statusFilter, pagination.page, pagination.limit);

    // Función para actualizar el filtro y pre-cargar los datos si es necesario
    const updateStatusFilter = useCallback((newStatus: AppointmentStatus) => {
        // Solo actualizar si el estado ha cambiado
        if (newStatus !== statusFilter) {
            console.log('🔃 useAppointments - Actualizando filtro a:', newStatus);

            // Guardar el filtro actual y el nuevo para debug
            const oldFilter = statusFilter;

            // Construir la nueva clave de consulta
            const newQueryKey = buildAppointmentsQueryKey(newStatus, 1, pagination.limit);
            console.log('🔑 useAppointments - Nueva clave de consulta:', newQueryKey);

            // PASO 1: Limpiar TODAS las cachés relacionadas con consultas paginadas
            console.log('🧹 useAppointments - Limpiando TODAS las consultas paginadas');
            queryClient.removeQueries({
                queryKey: ["appointments-paginated"],
                exact: false
            });

            // PASO 2: Actualizar el estado para que cualquier consulta futura use el nuevo filtro
            // CRÍTICO: Esto debe ocurrir antes de cualquier consulta
            setStatusFilter(newStatus);

            // PASO 3: Esperar un breve momento para que React actualice el estado
            setTimeout(() => {
                console.log('⚡ useAppointments - Obteniendo datos para el nuevo filtro:', newStatus);
                // Forzar una nueva consulta con el nuevo estado
                getAppointmentsByStatus({
                    status: newStatus,
                    page: 1,
                    limit: pagination.limit
                }).then(response => {
                    if (response && !response.error && response.data) {
                        console.log('✨ useAppointments - Datos obtenidos para el filtro', newStatus, ':',
                            response.data.appointments?.length || 0, 'citas');

                        // Almacenar los datos en la caché usando la nueva clave
                        queryClient.setQueryData(newQueryKey, response.data);

                        // Notificar a React Query que los datos han cambiado
                        queryClient.invalidateQueries({
                            queryKey: newQueryKey,
                            exact: true,
                            // No ejecutar refetch porque ya tenemos los datos
                            refetchType: 'none'
                        });
                    } else {
                        console.error('❌ useAppointments - Error al obtener datos para el filtro', newStatus);
                        // Si hay un error, intentar refetch
                        queryClient.refetchQueries({
                            queryKey: newQueryKey,
                            exact: true,
                            refetchType: 'active'
                        });
                    }
                });
            }, 100);

            console.log('🔄 useAppointments - Proceso de cambio de filtro completado:', oldFilter, '➡️', newStatus);
        } else {
            console.log('⏭️ useAppointments - Filtro no cambió, omitiendo actualización');
        }
    }, [statusFilter, pagination.limit, queryClient]);

    const dispatch = useSelectedServicesAppointmentsDispatch();
    const { createMutation: createEventMutation } = useEvents();
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

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

    // Query para obtener una cita por ID
    const appointmentByIdQuery = useQuery({
        queryKey: ["appointment", selectedAppointmentId],
        queryFn: async () => {
            if (!selectedAppointmentId) {
                return null;
            }

            const response = await getAppointmentById({ id: selectedAppointmentId });

            if (!response) {
                throw new Error("No se recibió respuesta del servidor");
            }

            if (response.error || !response.data) {
                throw new Error(response.error ?? "Error desconocido");
            }

            return response.data;
        },
        enabled: !!selectedAppointmentId,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });

    // Query para obtener las citas filtradas por estado
    const appointmentsByStatusQuery = useQuery({
        // Usar la clave de consulta construida
        queryKey: currentQueryKey,
        queryFn: async () => {
            console.log("🏥 Ejecutando query appointments-paginated con:", {
                statusFilter,
                page: pagination.page,
                limit: pagination.limit,
                queryKey: currentQueryKey
            });

            // Siempre ejecutar la consulta con los parámetros actuales
            const response = await getAppointmentsByStatus({
                status: statusFilter,
                page: pagination.page,
                limit: pagination.limit
            });

            if (!response) {
                console.error("🏥 No se recibió respuesta del servidor");
                throw new Error("No se recibió respuesta del servidor");
            }

            if (response.error || !response.data) {
                console.error("🏥 Error en la respuesta:", response.error);
                throw new Error(response.error ?? "Error desconocido");
            }

            console.log(`🏥 Respuesta exitosa de citas paginadas:`, {
                total: response.data.total,
                appointments: response.data.appointments?.length || 0,
                firstAppointment: response.data.appointments?.[0]?.id || "N/A",
                filtroAplicado: statusFilter,
                queryKey: currentQueryKey
            });

            return response.data;
        },
        // Siempre habilitado
        enabled: true,
        // Refrescar sólo si el usuario explícitamente hace la acción de refrescar
        refetchOnWindowFocus: false,
        // Reducir el staleTime para asegurar que los datos se refresquen correctamente
        staleTime: 1000 * 60 * 5, // 5 minutos
    });

    // Mutación para crear una cita
    const createMutation = useMutation<BaseApiResponse<Appointment>, Error, CreateAppointmentDto>({
        mutationFn: async (data) => {
            console.log("Datos enviados para crear la cita:", data);

            // 1. Obtener datos del paciente y staff
            let patientName = 'Paciente';
            let patientDni = '';
            let staffName = 'Doctor';

            try {
                const patientResponse = await getPatientById(data.patientId);
                if (patientResponse && !('error' in patientResponse)) {
                    const patient = patientResponse.data || patientResponse;
                    patientName = `${patient.name} ${patient.lastName || ''}`.trim();
                    patientDni = patient.dni || '';
                }

                const staffResponse = await getStaffById(data.staffId);
                if (staffResponse && !('error' in staffResponse)) {
                    const staff = staffResponse;
                    staffName = `${staff.name} ${staff.lastName || ''}`.trim();
                }
            } catch (error) {
                console.error('Error al obtener datos de paciente o staff:', error);
            }

            // 2. Crear el evento
            let eventId = undefined;
            try {
                const eventData = {
                    title: `Cita: ${patientName}${patientDni ? `-${patientDni}` : ''} Doctor: ${staffName}`,
                    color: 'gray',
                    type: EventType.CITA,
                    status: EventStatus.PENDING,
                    start: data.start,
                    end: data.end,
                    staffId: data.staffId,
                    branchId: data.branchId
                };

                console.log('📦 Datos del evento a crear:', eventData);
                const eventResult = await createEventMutation.mutateAsync(eventData);
                console.log('✅ Evento creado exitosamente:', eventResult);
                eventId = eventResult.data?.id;
            } catch (eventError) {
                console.error('❌ Error al crear el evento:', eventError);
            }

            // 3. Crear la cita con el eventId
            const appointmentData = {
                ...data,
                eventId
            };

            console.log('📦 Datos finales de la cita a crear:', appointmentData);
            const response = await createAppointment(appointmentData);
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
            queryClient.invalidateQueries({
                queryKey: ["appointments-paginated"]
            });
            toast.success(res.message);
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const createMutationForOrder = (uniqueIdentifier: string) => {
        const mutationQuery = useMutation<BaseApiResponse<Appointment>, Error, CreateAppointmentDto>({
            mutationFn: async (data) => {
                console.log("Datos enviados para crear la cita:", data);

                // 1. Obtener datos del paciente y staff
                let patientName = 'Paciente';
                let patientDni = '';
                let staffName = 'Doctor';

                try {
                    const patientResponse = await getPatientById(data.patientId);
                    if (patientResponse && !('error' in patientResponse)) {
                        const patient = patientResponse.data || patientResponse;
                        patientName = `${patient.name} ${patient.lastName || ''}`.trim();
                        patientDni = patient.dni || '';
                    }

                    const staffResponse = await getStaffById(data.staffId);
                    if (staffResponse && !('error' in staffResponse)) {
                        const staff = staffResponse;
                        staffName = `${staff.name} ${staff.lastName || ''}`.trim();
                    }
                } catch (error) {
                    console.error('Error al obtener datos de paciente o staff:', error);
                }

                // 2. Crear el evento
                let eventId = undefined;
                try {
                    const eventData = {
                        title: `Cita: ${patientName}${patientDni ? `-${patientDni}` : ''} Doctor: ${staffName}`,
                        color: 'gray',
                        type: EventType.CITA,
                        status: EventStatus.PENDING,
                        start: data.start,
                        end: data.end,
                        staffId: data.staffId,
                        branchId: data.branchId
                    };

                    console.log('📦 Datos del evento a crear:', eventData);
                    const eventResult = await createEventMutation.mutateAsync(eventData);
                    console.log('✅ Evento creado exitosamente:', eventResult);
                    eventId = eventResult.data?.id;
                } catch (eventError) {
                    console.error('❌ Error al crear el evento:', eventError);
                }

                // 3. Crear la cita con el eventId
                const appointmentData = {
                    ...data,
                    eventId
                };

                console.log('📦 Datos finales de la cita a crear:', appointmentData);
                const response = await createAppointment(appointmentData);
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
                queryClient.invalidateQueries({
                    queryKey: ["appointments-paginated"]
                });

                dispatch({
                    type: "append", payload: [{
                        appointmentId: res.data.id,
                        serviceId: res.data.serviceId,
                        uniqueIdentifier: uniqueIdentifier,
                    }]
                });

                toast.success(res.message);
                toast.success("Cita guardada para la orden")
            },
            onError: (error) => {
                dispatch({ type: "clear" });
                toast.error(error.message);
            }
        });

        return mutationQuery;
    }

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
            queryClient.invalidateQueries({
                queryKey: ["appointments-paginated"]
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
        onSuccess: async (res, variables) => {
            // Actualizar las citas en la caché
            await queryClient.invalidateQueries({ queryKey: ["appointments"] });
            await queryClient.invalidateQueries({ queryKey: ["active-appointments"] });
            await queryClient.invalidateQueries({
                queryKey: ["appointments-paginated"]
            });

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
        onSuccess: async (res, variables) => {
            // Actualizar las citas en la caché
            await queryClient.invalidateQueries({ queryKey: ["appointments"] });
            await queryClient.invalidateQueries({ queryKey: ["active-appointments"] });
            await queryClient.invalidateQueries({
                queryKey: ["appointments-paginated"]
            });

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

    // Mutación para reprogramar una cita
    const rescheduleMutation = useMutation<BaseApiResponse<Appointment>, Error, RescheduleAppointmentVariables>({
        mutationFn: async ({ id, data }) => {
            const response = await rescheduleAppointment(id, data);
            if ("error" in response) {
                throw new Error(response.error);
            }
            return response;
        },
        onSuccess: async (res, variables) => {
            // Actualizar las citas en la caché
            await queryClient.invalidateQueries({ queryKey: ["appointments"] });
            await queryClient.invalidateQueries({ queryKey: ["active-appointments"] });
            await queryClient.invalidateQueries({
                queryKey: ["appointments-paginated"]
            });

            toast.success("Cita reprogramada exitosamente");
        },
        onError: (error) => {
            console.error("💥 Error al reprogramar la cita:", error);
            if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
                toast.error("No tienes permisos para realizar esta acción");
            } else {
                toast.error(error.message || "Error al reprogramar la cita");
            }
        },
    });

    return {
        appointmentsQuery,
        activeAppointmentsQuery,
        appointmentByIdQuery,
        appointmentsByStatusQuery,
        statusFilter,
        setStatusFilter: updateStatusFilter,
        appointments: appointmentsQuery.data,
        selectedAppointmentId,
        setSelectedAppointmentId,
        pagination,
        setPagination,
        createMutationForOrder,
        createMutation,
        updateMutation,
        deleteMutation,
        reactivateMutation,
        cancelMutation,
        refundMutation,
        rescheduleMutation,
    };
};
