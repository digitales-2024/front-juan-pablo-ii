"use client";

// import { AppointmentTable } from "./_components/AppointmentTable";
import { PageHeader } from "@/components/PageHeader";
import { notFound } from "next/navigation";
import { useAppointments } from "./_hooks/useAppointments";
import { AppointmentTable } from "./_components/AppointmentTable";
import { useFilterAppointments } from "./_hooks/useFilterAppointments";
import { FilterAppointmentsDialog } from "./_components/FilterComponents/FilterAppointmentsDialog";
import { FilterStatusBadge } from "./_components/FilterComponents/FilterStatusBadge";
import { useEffect } from "react";

export default function PageAppointments() {
    console.log("🏁 Iniciando PageAppointments");
    const {
        appointmentsQuery: response,
        appointmentsByStatusQuery,
        statusFilter,
        pagination,
        setPagination
    } = useAppointments();

    const {
        filterType,
        query: filteredQuery
    } = useFilterAppointments();

    // Log cada vez que cambia el statusFilter o se reciben nuevos datos
    useEffect(() => {
        console.log("🔄 [useEffect] StatusFilter cambió:", statusFilter);
        console.log("🔄 [useEffect] Datos de appointmentsByStatusQuery:", appointmentsByStatusQuery.data);
    }, [statusFilter, appointmentsByStatusQuery.data]);

    console.log("📊 Estado de la query principal:", {
        data: response.data?.length,
        isLoading: response.isLoading,
        isError: response.isError,
        error: response.error
    });

    console.log("�� Estado de la query paginada:", {
        statusFilter,
        dataLength: appointmentsByStatusQuery.data?.appointments?.length,
        isLoading: appointmentsByStatusQuery.isLoading,
        isError: appointmentsByStatusQuery.isError,
        error: appointmentsByStatusQuery.error
    });

    console.log("📊 Estado del filtro activo en página:", {
        filterType,
        statusFilter
    });

    const handlePaginationChange = (page: number, limit: number) => {
        console.log("📄 Cambiando paginación a:", { page, limit });
        setPagination({ page, limit });
    };

    // Usamos la query paginada que filtra según el estado seleccionado pero con una clave fija
    const activeQuery = appointmentsByStatusQuery;
    console.log("🔍 Query activa - estado:", {
        isLoading: activeQuery.isLoading,
        isSuccess: activeQuery.isSuccess,
        dataExists: !!activeQuery.data,
        appointments: activeQuery.data?.appointments?.length || 0,
        filtroAplicado: statusFilter
    });

    // Verificamos si la query está cargando o tiene error
    const isLoading = activeQuery.isLoading;
    const isError = activeQuery.isError;
    const error = activeQuery.error;

    if (isLoading && !activeQuery.data) {
        console.log("⏳ Cargando datos...");
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

    console.log("✅ Renderizando página con datos filtrados por:", statusFilter);
    console.log("✅ Datos a pasar a la tabla:", {
        appointments: activeQuery.data?.appointments?.length || 0,
        total: activeQuery.data?.total || 0,
        estado: statusFilter
    });

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
