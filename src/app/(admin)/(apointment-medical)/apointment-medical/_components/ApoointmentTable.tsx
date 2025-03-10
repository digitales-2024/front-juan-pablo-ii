"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { Patient } from "../_interfaces/patient.interface";

import { columns } from "./ApoointmentTableColumns";

interface PatientTableProps {
  data: Patient[];
}

export function PatientTable({ data }: PatientTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      placeholder="Buscar por nombre ..."

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
