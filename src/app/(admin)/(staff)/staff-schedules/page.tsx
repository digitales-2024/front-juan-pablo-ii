"use client";

import { PageHeader } from "@/components/PageHeader";
import { notFound } from "next/navigation";
import { useStaffSchedules } from "./_hooks/useStaffSchedules"; // Necesitaremos crear este hook
import { StaffSchedulesTable } from "./_components/StaffSchedulesTable";

export default function PageStaffSchedules() {
  console.log("🏁 Iniciando PageStaffSchedules");
  const { staffSchedulesQuery: response } = useStaffSchedules();

  if (response.isError) {
    if (response.error.message.includes("No autorizado")) {
      notFound();
    }
    return <div>Error: {response.error.message}</div>;
  }

  if (response.isLoading) {
    return <div>Cargando...</div>;
  }

  if (!response.data) {
    return <div>No hay datos disponibles</div>;
  }

  return (
    <>
      <div>
        <PageHeader
          title="Horarios del Personal"
          description="Administra los horarios del personal de tu empresa"
        />
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <StaffSchedulesTable data={response.data} />
      </div>
    </>
  );
}
