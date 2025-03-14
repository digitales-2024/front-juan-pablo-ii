"use client";

// import { AppointmentTable } from "./_components/AppointmentTable";
import { PageHeader } from "@/components/PageHeader";
import { notFound } from "next/navigation";
import { useAppointments } from "./_hooks/useAppointments";
import { AppointmentTable } from "./_components/AppointmentTable";

export default function PageAppointments() {
    console.log("🏁 Iniciando PageAppointments");
    const {
        appointmentsQuery: response,
        paginatedAppointmentsQuery,
        pagination,
        setPagination
    } = useAppointments();

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

    const handlePaginationChange = (page: number, limit: number) => {
        console.log("Cambiando paginación a:", { page, limit });
        setPagination({ page, limit });
    };

    // Usamos la query paginada como principal, pero mantenemos la original como fallback
    const isLoading = paginatedAppointmentsQuery.isLoading || response.isLoading;
    const isError = paginatedAppointmentsQuery.isError && response.isError;
    const error = paginatedAppointmentsQuery.error || response.error;

    if (isLoading) {
        console.log("⏳ Cargando datos...");
        return <div>Cargando...</div>;
    }

    if (isError) {
        console.error("💥 Error en la página:", error);
        notFound();
    }

    // Si no hay datos paginados pero hay datos normales, usamos esos
    const hasData = paginatedAppointmentsQuery.data || response.data;
    if (!hasData) {
        console.error("❌ No hay datos disponibles");
        notFound();
    }

    console.log("✅ Renderizando página con datos paginados:", paginatedAppointmentsQuery.data);

    return (
        <>
            <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4">
                <PageHeader
                    title="Citas"
                    description="Administra las citas de tus pacientes"
                />
            </div>
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <AppointmentTable
                    data={response.data || []}
                    paginatedData={paginatedAppointmentsQuery.data}
                    onPaginationChange={handlePaginationChange}
                />
            </div>
        </>
    );
}
