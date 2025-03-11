"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { AppointmentResponse } from "../_interfaces/apoointments-medical.inteface";
import { useMemo } from "react";
import { getAppointmentColumns } from "./ApoointmentTableColumns";

interface UserRole {
  isSuperAdmin: boolean;
  isDoctor: boolean;
  isReceptionist: boolean;
}

interface AppointmentTableProps {
  data: AppointmentResponse[];
  userRole: UserRole;
  userId?: string;
  onRefresh: () => void;
}

export function AppointmentTable({
  data,
  userRole,
  userId,
  onRefresh,
}: AppointmentTableProps) {
  // Generar columnas basadas en el rol del usuario
  const columns = useMemo(
    () => getAppointmentColumns(userRole, userId, onRefresh),
    [userRole, userId, onRefresh]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      placeholder="Buscar por paciente..."
      columnVisibilityConfig={{
        id: true,
        staff: true,
        service: true,
        branch: true,
        patient: true,
        start: true,
        end: true,
        status: true,
        medicalHistoryId: false, // Ocultamos el ID pero lo usamos para navegación
        actions: true,
      }}
    />
  );
}
