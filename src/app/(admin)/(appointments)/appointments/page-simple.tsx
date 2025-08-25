"use client";

import { AppointmentTable } from "./_components/AppointmentTable";
import { PageHeader } from "@/components/PageHeader";
import { notFound } from "next/navigation";
import { useAppointmentsByDateRange } from "./_hooks/useAppointmentsByDateRange";
import { DateRangeFilter } from "./_components/FilterComponents/DateRangeFilter";
import { useCallback, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PageAppointments() {
    // Hook para el filtro de fechas
    const {
        dateRange,
        appointmentsByDateRangeQuery,
        setDateRangeFilter,
        clearDateRangeFilter,
        isLoading,
        isError,
        error,
        data: dateRangeData,
        hasDateRange,
        pagination,
        setPage,
        setLimit,
    } = useAppointmentsByDateRange();

    // Handler para cambios de paginación
    const handlePaginationChange = useCallback((page: number, limit: number) => {
        console.log('📄 Cambiando paginación de fechas a:', page, limit);
        setPage(page);
        if (limit !== pagination.limit) {
            setLimit(limit);
        }
    }, [setPage, setLimit, pagination.limit]);

    // Si hay error, mostrar página de error
    if (isError) {
        console.error("💥 Error en la página:", error);
        notFound();
    }

    // Si está cargando y no hay datos
    if (isLoading && !dateRangeData) {
        return (
            <>
                <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4">
                    <PageHeader
                        title="Citas"
                        description="Administra las citas de tus pacientes"
                    />
                </div>
                <div className="-mx-4 flex-1 overflow-auto px-4 py-1">
                    <div className="mb-4">
                        <DateRangeFilter
                            startDate={dateRange.startDate}
                            endDate={dateRange.endDate}
                            onDateRangeChange={setDateRangeFilter}
                            onClear={clearDateRangeFilter}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="flex items-center justify-center p-8 w-full">
                        <Skeleton className="h-8 w-8 animate-spin" />
                        <span className="ml-2 text-lg text-muted-foreground">
                            Cargando citas...
                        </span>
                    </div>
                </div>
            </>
        );
    }

    // Renderizado principal
    return (
        <>
            <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4">
                <PageHeader
                    title="Citas"
                    description="Administra las citas de tus pacientes"
                />
            </div>
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1">
                {/* Filtro de fechas */}
                <div className="mb-4">
                    <DateRangeFilter
                        startDate={dateRange.startDate}
                        endDate={dateRange.endDate}
                        onDateRangeChange={setDateRangeFilter}
                        onClear={clearDateRangeFilter}
                        disabled={isLoading}
                    />
                </div>
                
                {/* Tabla de citas */}
                <AppointmentTable
                    data={[]} // No usamos data sin paginar
                    paginatedData={dateRangeData as any}
                    onPaginationChange={handlePaginationChange}
                />
            </div>
        </>
    );
}
