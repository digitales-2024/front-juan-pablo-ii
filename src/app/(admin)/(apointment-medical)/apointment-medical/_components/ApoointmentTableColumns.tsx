"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { Patient } from "../_interfaces/patient.interface";
import { Badge } from "@/components/ui/badge";
import { UpdatePatientSheet } from "./UpdateApoointmentMedicalSheet";
import { Button } from "@/components/ui/button";
import { Ellipsis, RefreshCcwDot, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { DropdownMenuShortcut } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { ReactivatePatientDialog } from "./ReactivatePatientDialog";
import { DeactivatePatientDialog } from "./DeactivatePatientDialog";
import { es } from "date-fns/locale";
import { format } from "date-fns";
// import Image from "next/image";

export const columns: ColumnDef<Patient>[] = [
  {
    id: "select",
    size: 10,
    meta: {
      title: "Seleccionar"
    },
    header: ({ table }) => (
      <div className="px-2">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-2">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    enablePinning: true,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Apellido" />
    ),
  },
  {
    accessorKey: "dni",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="DNI" />
    ),
  },
  {
    accessorKey: "birthDate",
    meta: {
      title: "Fecha de nacimiento"
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de Nacimiento" />
    ),
    cell: ({ row }) => (
      <span>
        {row.original.birthDate
          ? format(new Date(row.original.birthDate), "PP", { locale: es })
          : "Fecha no disponible"}
      </span>
    ),
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Género" />
    ),
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dirección" />
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Teléfono" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "emergencyContact",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contacto de Emergencia" />
    ),
  },
  {
    accessorKey: "emergencyPhone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Teléfono de Emergencia" />
    ),
  },
  {
    accessorKey: "healthInsurance",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Seguro de Salud" />
    ),
  },
  {
    accessorKey: "maritalStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado Civil" />
    ),
  },
  {
    accessorKey: "occupation",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ocupación" />
    ),
  },
  {
    accessorKey: "workplace",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lugar de Trabajo" />
    ),
  },
  {
    accessorKey: "bloodType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo de Sangre" />
    ),
  },
  {
    accessorKey: "primaryDoctor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Médico Principal" />
    ),
  },
  {
    accessorKey: "sucursal",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="sucursal" />
    ),
  },
  {
    accessorKey: "notes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Notas" />
    ),
  },
  /*  {
    accessorKey: "patientPhoto",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Foto del Paciente" />
    ),
    cell: ({ row }) => (
      <img
        src={row.original.patientPhoto}
        alt={row.original.name}
        className="w-6 h-6 rounded-md object-cover"
      />
    ),
  }, */
  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? "success" : "destructive"}>
        {row.original.isActive ? "Activo" : "Inactivo"}
      </Badge>
    ),
  },
  {
    id: "Acciones",
    accessorKey: "actions",
    size: 10,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Acciones" />
    ),
    cell: function Cell({ row }) {
      const [showDeleteDialog, setShowDeleteDialog] = useState(false);
      const [showReactivateDialog, setShowReactivateDialog] = useState(false);
      const [showEditSheet, setShowEditSheet] = useState(false);
      // const [patient, setPatient] = useState<Patient >(row.original);
      // useEffect(() => {
      //   setPatient(row.original);
      //   console.log('paciente dentro usefect', patient)
      // }, [row]);
      // console.log('paciente fiuera', row.original)
      // // const patient = row.original;
      // const { isActive } = patient;
      //const patient = row.original;
      const isSuperAdmin = true;

      return (
        <div>
          <div>
            {/* //actualizar paciente */}
            {showEditSheet && (
              <UpdatePatientSheet
                patient={row.original}
                open={showEditSheet}
                onOpenChange={setShowEditSheet}
                showTrigger={false}
              />
            )}
            <DeactivatePatientDialog
              patient={row.original}
              open={showDeleteDialog}
              onOpenChange={setShowDeleteDialog}
              showTrigger={false}
            />
            <ReactivatePatientDialog
              patient={row.original}
              open={showReactivateDialog}
              onOpenChange={setShowReactivateDialog}
              showTrigger={false}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="flex size-8 p-0 data-[state=open]:bg-muted"
              >
                <Ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onSelect={() => setShowEditSheet(true)}
                disabled={!row.original.isActive}
              >
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {isSuperAdmin && (
                <DropdownMenuItem
                  onSelect={() => setShowReactivateDialog(true)}
                  disabled={!row.original.isActive}
                >
                  Reactivar
                  <DropdownMenuShortcut>
                    <RefreshCcwDot className="size-4" aria-hidden="true" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onSelect={() => setShowDeleteDialog(true)}
                disabled={!row.original.isActive}
              >
                Eliminar
                <DropdownMenuShortcut>
                  <Trash className="size-4" aria-hidden="true" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
    enablePinning: true,
  },
];
