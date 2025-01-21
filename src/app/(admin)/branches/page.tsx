"use client";

import { BranchesTable } from "./_components/BranchesTable";
import { PageHeader } from "@/components/PageHeader";
// import { getBranches } from "./_actions/branch.actions";
import { notFound } from "next/navigation";
import { useBranches } from "./_hooks/useBranches";

export default function PageBranches() {
  console.log("🏁 Iniciando PageBranches");
  const {branchesQuery: response} = useBranches();
  
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
          title="Sucursales"
          description="Administra las sucursales de tu empresa"
        />
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <BranchesTable data={response.data} />
      </div>
    </>
  );
}
