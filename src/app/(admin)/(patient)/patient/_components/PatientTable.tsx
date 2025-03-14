"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { Patient } from "../_interfaces/patient.interface";
import { PatientTableToolbarActions } from "./PatientTableToolbarActions";
import { columns } from "./PatientTableColumns";

interface PatientTableProps {
  data: Patient[];
}

export function PatientTable({ data }: PatientTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      placeholder="Buscar por nombre ..."
      toolbarActions={(table) => <PatientTableToolbarActions table={table} />}
      columnVisibilityConfig={{
        name: true,
        lastName: true,
        dni: true,
        birthDate: true,
        gender: true,
        address: false,
        phone: true,
        email: false,
        emergencyContact: false,
        emergencyPhone: true,
        healthInsurance: false,
        maritalStatus: false,
        occupation: false,
        workplace: false,
        bloodType: false,
        primaryDoctor: false,
        sucursal: false,
        notes: false,
        patientPhoto: false,
        isActive: true,
      }}
    />
  );
}
