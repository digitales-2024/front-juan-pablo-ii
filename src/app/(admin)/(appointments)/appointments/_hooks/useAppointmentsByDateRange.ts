import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAppointmentsByDateRange } from '../_actions/appointments.action';

export const useAppointmentsByDateRange = (
    defaultPage = 1,
    defaultLimit = 10
) => {
    // Estado para el rango de fechas - sin valores por defecto
    const [dateRange, setDateRange] = useState<{
        startDate: string | null;
        endDate: string | null;
    }>({
        startDate: null,
        endDate: null
    });

    // Estado para la paginación
    const [pagination, setPagination] = useState({
        page: defaultPage,
        limit: defaultLimit,
    });

    // Query para obtener las citas por rango de fechas
    const appointmentsByDateRangeQuery = useQuery({
        queryKey: [
            "appointments",
            "date-range",
            dateRange.startDate,
            dateRange.endDate,
            pagination.page,
            pagination.limit,
        ],
        queryFn: async () => {
            if (!dateRange.startDate || !dateRange.endDate) {
                console.log(`⚠️ No se ejecuta la consulta porque faltan fechas: inicio=${dateRange.startDate}, fin=${dateRange.endDate}`);
                return null;
            }

            console.log(`🔍 Ejecutando consulta de citas por rango de fechas: ${dateRange.startDate} - ${dateRange.endDate}, página ${pagination.page}`);

            const result = await getAppointmentsByDateRange({
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
                page: pagination.page,
                limit: pagination.limit,
            });

            if (result?.error) {
                console.error(`💥 Error en consulta de fechas:`, result.error);
                throw new Error(result.error);
            }

            console.log(`✅ Consulta exitosa:`, result?.data?.appointments?.length ?? 0, 'citas encontradas');
            return result?.data ?? null;
        },
        enabled: !!(dateRange.startDate && dateRange.endDate),
        staleTime: 5 * 60 * 1000, // 5 minutos
        retry: 3,
    });

    // Función para establecer el rango de fechas
    const setDateRangeFilter = useCallback(
        (startDate: string | null, endDate: string | null) => {
            console.log(`📊 Estableciendo filtro de fechas: ${startDate} - ${endDate}`);
            setDateRange({ startDate, endDate });
            // Resetear la paginación cuando cambia el filtro
            setPagination({ page: 1, limit: pagination.limit });
        },
        [pagination.limit]
    );

    // Función para limpiar el filtro de fechas (eliminar fechas seleccionadas)
    const clearDateRangeFilter = useCallback(() => {
        setDateRange({ 
            startDate: null, 
            endDate: null 
        });
        setPagination({ page: defaultPage, limit: defaultLimit });
    }, [defaultPage, defaultLimit]);

    // Función para cambiar página
    const setPage = useCallback(
        (page: number) => {
            setPagination((prev) => ({ ...prev, page }));
        },
        []
    );

    // Función para cambiar límite
    const setLimit = useCallback(
        (limit: number) => {
            setPagination({ page: 1, limit });
        },
        []
    );

    return {
        // Estado
        dateRange,
        pagination,
        
        // Query
        appointmentsByDateRangeQuery,
        
        // Computed values
        isLoading: appointmentsByDateRangeQuery.isLoading,
        isFetching: appointmentsByDateRangeQuery.isFetching,
        isError: appointmentsByDateRangeQuery.isError,
        error: appointmentsByDateRangeQuery.error,
        data: appointmentsByDateRangeQuery.data,
        hasDateRange: !!(dateRange.startDate && dateRange.endDate),
        
        // Actions
        setDateRangeFilter,
        clearDateRangeFilter,
        setPagination,
        setPage,
        setLimit,
        
        // Refetch
        refetch: appointmentsByDateRangeQuery.refetch,
    };
};
