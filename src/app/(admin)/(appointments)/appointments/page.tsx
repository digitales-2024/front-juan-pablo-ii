"use client";

// import { AppointmentTable } from "./_components/AppointmentTable";
import { PageHeader } from "@/components/PageHeader";
import { notFound } from "next/navigation";
import { useAppointments } from "./_hooks/useAppointments";
import { AppointmentTable } from "./_components/AppointmentTable";
import { useFilterAppointments } from "./_hooks/useFilterAppointments";
import { AppointmentsFilterType } from "./_interfaces/filter.interface";
import { FilterAppointmentsDialog } from "./_components/FilterComponents/FilterAppointmentsDialog";
import { FilterStatusBadge } from "./_components/FilterComponents/FilterStatusBadge";

export default function PageAppointments() {
    console.log("🏁 Iniciando PageAppointments");
    const {
        appointmentsQuery: response,
        paginatedAppointmentsQuery,
        pagination,
        setPagination
    } = useAppointments();

    const {
        filterType,
        query: filteredQuery
    } = useFilterAppointments();

    console.log("📊 Estado de la query:", {
        data: response.data,
        isLoading: response.isLoading,
        isError: response.isError,
        error: response.error
    });

    console.log("📊 Estado de la query paginada:", {
        data: paginatedAppointmentsQuery.data,
        isLoading: paginatedAppointmentsQuery.isLoading,
        isError: paginatedAppointmentsQuery.isError,
        error: paginatedAppointmentsQuery.error
    });

    console.log("📊 Estado del filtro:", {
        filterType,
        data: filteredQuery.data,
        isLoading: filteredQuery.isLoading,
        isError: filteredQuery.isError,
        error: filteredQuery.error
    });

    const handlePaginationChange = (page: number, limit: number) => {
        console.log("Cambiando paginación a:", { page, limit });
        setPagination({ page, limit });
    };

    // Determinar qué query utilizar según el filtro activo
    const isFiltered = filterType !== AppointmentsFilterType.ALL;
    const activeQuery = isFiltered ? filteredQuery : paginatedAppointmentsQuery;

    // Usamos la query activa, con fallback a la query normal
    const isLoading = activeQuery.isLoading || response.isLoading;
    const isError = activeQuery.isError && response.isError;
    const error = activeQuery.error || response.error;

    if (isLoading && !activeQuery.data && !response.data) {
        console.log("⏳ Cargando datos...");
        return <div>Cargando...</div>;
    }

    if (isError && !activeQuery.data && !response.data) {
        console.error("💥 Error en la página:", error);
        notFound();
    }

    // Si no hay datos en ninguna query, mostramos error
    const hasAnyData = activeQuery.data || response.data;
    if (!hasAnyData) {
        console.error("❌ No hay datos disponibles");
        notFound();
    }

    console.log("✅ Renderizando página con datos:", isFiltered ? "filtrados" : "paginados");

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
                    data={response.data || []}
                    paginatedData={paginatedAppointmentsQuery.data}
                    onPaginationChange={handlePaginationChange}
                />
            </div>
        </>
    );
}
