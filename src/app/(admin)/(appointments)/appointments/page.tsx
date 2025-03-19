"use client";

// import { AppointmentTable } from "./_components/AppointmentTable";
import { PageHeader } from "@/components/PageHeader";
import { notFound } from "next/navigation";
import { AppointmentTable } from "./_components/AppointmentTable";
import { useFilterAppointments } from "./_hooks/useFilterAppointments";
import { FilterAppointmentsDialog } from "./_components/FilterComponents/FilterAppointmentsDialog";
import { FilterStatusBadge } from "./_components/FilterComponents/FilterStatusBadge";
import { useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PageAppointments() {
    // Usamos solamente el hook de filtros para obtener todos los datos necesarios
    const {
        query: activeQuery,
        statusFilter,
        pagination,
        setPagination,
        filterType
    } = useFilterAppointments();

    const handlePaginationChange = useCallback((page: number, limit: number) => {
        setPagination({ page, limit });
    }, [setPagination]);

    // Verificamos si la query está cargando o tiene error
    const isLoading = activeQuery.isLoading;
    const isError = activeQuery.isError;
    const error = activeQuery.error;

    // Si está cargando, mostrar un esqueleto
    if (isLoading && !activeQuery.data) {
        return (
            <>
                <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4">
                    <PageHeader
                        title="Citas"
                        description="Administra las citas de tus pacientes"
                    />
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
                <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                    <Skeleton className="h-8 w-full mb-4" />
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-[500px] w-full" />
                    </div>
                </div>
            </>
        );
    }

    if (isError) {
        console.error("💥 Error en la página:", error);
        notFound();
    }

    // Si no hay datos disponibles, mostramos error
    if (!activeQuery.data) {
        console.error("❌ No hay datos disponibles");
        notFound();
    }

    return (
        <>
            <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4">
                <PageHeader
                    title="Citas"
                    description="Administra las citas de tus pacientes"
                />
                <div className="flex items-center space-x-2">
                    <FilterAppointmentsDialog />
                </div>
            </div>
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <FilterStatusBadge />
                <AppointmentTable
                    data={[]} // No usamos data sin paginar en esta vista
                    paginatedData={activeQuery.data}
                    onPaginationChange={handlePaginationChange}
                />
            </div>
        </>
    );
}
