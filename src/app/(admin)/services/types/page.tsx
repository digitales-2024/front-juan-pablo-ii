"use client";

import { PageHeader } from "@/components/PageHeader";
import { notFound } from "next/navigation";
import { useServiceTypes } from "../_hooks/useServiceTypes";
import { ServiceTypeTable } from "../_components/ServiceTypeTable";

export default function PageServiceTypes() {
  console.log("🏁 Iniciando PageServiceTypes");
  const { serviceTypesQuery: response } = useServiceTypes();
  
  console.log("📊 Estado de la query:", {
    data: response.data,
    isLoading: response.isLoading,
    isError: response.isError,
    error: response.error
  });

  if (response.isLoading) {
    console.log("⏳ Cargando datos...");
    return <div>Cargando...</div>;
  }

  if (response.isError) {
    console.error("💥 Error en la página:", response.error);
    notFound();
  }

  if (!response.data) {
    console.error("❌ No hay datos disponibles");
    notFound();
  }

  console.log("✅ Renderizando página con datos:", response.data);

  return (
    <>
      <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4">
        <PageHeader
          title="Tipos de Servicio"
          description="Administra los tipos de servicio de tu empresa"
        />
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <ServiceTypeTable data={response.data} />
      </div>
    </>
  );
} 