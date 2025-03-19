"use client";

// import { AppointmentTable } from "./_components/AppointmentTable";
import { PageHeader } from "@/components/PageHeader";
import { notFound } from "next/navigation";
import { AppointmentTable } from "./_components/AppointmentTable";
import { useFilterAppointments } from "./_hooks/useFilterAppointments";
import { FilterAppointmentsDialog } from "./_components/FilterComponents/FilterAppointmentsDialog";
import { FilterStatusBadge } from "./_components/FilterComponents/FilterStatusBadge";

export default function PageAppointments() {
    // Usamos solamente el hook de filtros para obtener todos los datos necesarios
    const {
        query: activeQuery,
        statusFilter,
        pagination,
        setPagination,
        filterType
    } = useFilterAppointments();

    const handlePaginationChange = (page: number, limit: number) => {
        setPagination({ page, limit });
    };

    // Verificamos si la query está cargando o tiene error
    const isLoading = activeQuery.isLoading;
    const isError = activeQuery.isError;
    const error = activeQuery.error;

    if (isLoading && !activeQuery.data) {
        return <div>Cargando...</div>;
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
                    data={[]} // Ya no usamos la data sin paginar
                    paginatedData={activeQuery.data}
                    onPaginationChange={handlePaginationChange}
                />
            </div>
        </>
    );
}
