"use client";

import { useStaffSchedules } from "./_hooks/useStaffSchedules";
import { StaffSchedulesTable } from "./_components/StaffSchedulesTable";
import Loading from "./loading";
// import { notFound } from "next/navigation";

export default function StaffSchedulesPage() {
  const { allStaffSchedulesQuery, schedules } = useStaffSchedules({});
  
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
