"use client";

import { useStaffSchedules } from "./_hooks/useStaffSchedules";
import { StaffSchedulesTable } from "./_components/StaffSchedulesTable";
import Loading from "./loading";
import { useEffect } from "react";
// import { notFound } from "next/navigation";

export default function StaffSchedulesPage() {
  const { allStaffSchedulesQuery, schedules } = useStaffSchedules({});

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
  
  if (allStaffSchedulesQuery.isLoading) {
    return <Loading />;
  }

  if (allStaffSchedulesQuery.error) {
    console.error("Error en horarios:", allStaffSchedulesQuery.error);
    // notFound();
  }

  if (!allStaffSchedulesQuery.data) {
    console.error("Datos no disponibles");
    // notFound();
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Horarios del Personal</h1>
      </div>
      
      <StaffSchedulesTable data={schedules || []} />
    </div>
  );
}
