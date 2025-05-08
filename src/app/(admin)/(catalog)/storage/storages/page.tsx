"use client";

import { StorageTable } from "./_components/StorageTable";
import { PageHeader } from "@/components/PageHeader";
import { notFound } from "next/navigation";
import { useStorages } from "./_hooks/useStorages";
import Loading from "./loading";
import { METADATA } from "./_statics/metadata";
import { toast } from "sonner";
import { useEffect } from "react";

export default function PageBranches() {
  const { detailedStoragesQuery: response } = useStorages();

  useEffect(() => {
    // Usamos sessionStorage para detectar si estamos en la carga inicial o después de recarga
    const hasReloaded = sessionStorage.getItem("storagePageReloaded");
    
    if (!hasReloaded) {
      // Marcar que vamos a recargar
      sessionStorage.setItem("storagePageReloaded", "true");
      
      // Recargar inmediatamente (F5)
      window.location.reload();
    } else {
      // Limpiar la bandera después de la recarga para que la próxima navegación
      // a esta página también cause una recarga
      sessionStorage.removeItem("storagePageReloaded");
    }
  }, []);

  if (response.isLoading) {
    return <Loading />;
  }

  if (response.isError) {
    toast.error("Ocurrió un error al cargar los almacenes");
    notFound();
  }

  if (!response.data) {
    return <Loading></Loading>;
  }

  return (
    <>
      <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4">
        <PageHeader title={METADATA.title} description={METADATA.description} />
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <StorageTable data={response.data} />
      </div>
    </>
  );
}
