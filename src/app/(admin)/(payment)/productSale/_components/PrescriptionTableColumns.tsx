"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
// import { DetailedOutgoing } from "../_interfaces/outgoing.interface";
// import { format } from "date-fns";
// import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
// import { UpdateOutgoingSheet } from "./UpdateOutgoingSheet";
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
// import { ReactivateOutgoingDialog } from "./ReactivateOutgoingDialog";
// import { DeactivateOutgoingDialog } from "./DeactivateOutgoingDialog";
// import { ShowMovementsDialog } from "./Movements/ShowMovementsDialog";
// import { format } from "date-fns";
// import { es } from "date-fns/locale";
// import { StorageMovementDetail } from "./Movements/StorageMovementDetail";
import { PrescriptionWithPatient } from "../_interfaces/prescription.interface";
import { useStaff } from "@/app/(admin)/(staff)/staff/_hooks/useStaff";
import { ShowPrescriptionDetailsDialog } from "./PrescriptionDetails/ShowsPDetailsDialog";
import { CreatePrescriptionBillingProcessDialog } from "./PrescriptionDetails/FormComponents/CreatePrescriptionBillingOrderDialog";
// import Image from "next/image";

// const STATE_OPTIONS = {
//   true: "Concretado",
//   false: "En proceso",
// };

// const TRANSFERENCE_OPTIONS = {
//   true: "SI",
//   false: "NO",
// };

export const columns: ColumnDef<PrescriptionWithPatient>[] = [
  {
    id: "select",
    size: 10,
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
    accessorKey: "patient.dni",
    meta: {
      title: "DNI",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="DNI" />
    ),
    cell: ({ row }) => (
      <span>{row.original.patient.dni}</span>
    ),
  },
  {
    accessorKey: "patient.name",
    meta: {
      title: "Paciente",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Paciente" />
    ),
    cell: ({ row }) => {
      return (
      <span className="capitalize">
        {`${row.original.patient.name} ${row.original.patient.lastName ?? ''}`}
      </span>
    )}
  },
  {
    accessorKey: "prescriptionServices",
    size: 10,
    meta: {
      title: "Nota Médica",
    },
    header: () => <div>Nota Médica</div>,
    cell: ({ row }) => (
      <div>
        <ShowPrescriptionDetailsDialog data={row.original}></ShowPrescriptionDetailsDialog>
      </div>
    ),
  },
  {
    accessorKey: "purchaseOrderId",
    size: 10,
    meta: {
      title: "Procesar órden",
    },
    header: () => <div>Procesar órden</div>,
    cell: ({ row }) => (
      <div>
        {/* <ShowMovementsDialog
          data={row.original.prescriptionServices}
        ></ShowMovementsDialog> */}
        <CreatePrescriptionBillingProcessDialog
          prescription={row.original}
        ></CreatePrescriptionBillingProcessDialog>
      </div>
    ),
  },
  {
    accessorKey: "patient.phone",
    meta: {
      title: "Teléfono",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Teléfono" />
    ),
    cell: ({ row }) => (
      <span>{row.original.patient.phone ?? '---'}</span>
    ),
  },
  {
    accessorKey: "patient.email",
    meta: {
      title: "e-mail",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <span>
        {row.original.patient.email ?? "---"}
      </span>
    ),
  },
  {
    accessorKey: "staffId",
    meta: {
      title: "Personal tratante",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Personal tratante" />
    ),
    cell: ({ row }) => {
      const {
        oneStaffQuery
      } = useStaff()
      const { data:staff, isLoading, isError } = oneStaffQuery(row.original.staffId)
      if (isLoading) return <span>Cargando...</span>
      if (isError) return <span>Error al cargar</span>
      return (
      <span>
        {staff ? `${staff.name} ${staff.lastName}` : "No disponible"}
      </span>
    )},
  },
  {
    accessorKey: "isActive",
    meta: {
      title: "Eliminación lógica",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Eliminación lógica" />
    ),
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? "success" : "destructive"}>
        {row.original.isActive ? "Activo" : "Desactivado"}
      </Badge>
    ),
  },
  // {
  //   accessorKey: "createdAt",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Fecha de creación" />
  //   ),
  //   cell: ({ row }) =>
  //     format(new Date(row.original.createdAt), "PPp", { locale: es }),
  // },
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
      // const {} = useProductStockById(row.original.Movement)
      // const productExistent: OutgoingProducStockForm = 
      const outgoing = row.original;
      const { isActive } = outgoing;
      const isSuperAdmin = true;

      return (
        <div>
          {/* <div>
            {showEditSheet && (
              <UpdateOutgoingSheet
                outgoing={outgoing}
                open={showEditSheet}
                onOpenChange={setShowEditSheet}
                showTrigger={false}
              />
            )}
            {showDeleteDialog && (
              <DeactivateOutgoingDialog
                outgoing={outgoing}
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                showTrigger={false}
              />
            )}
            {showReactivateDialog && (
              <ReactivateOutgoingDialog
                outgoing={outgoing}
                open={showReactivateDialog}
                onOpenChange={setShowReactivateDialog}
              />
            )}
          </div> */}
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
                disabled={!isActive}
              >
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {isSuperAdmin && (
                <DropdownMenuItem
                  onSelect={() => setShowReactivateDialog(true)}
                  disabled={isActive}
                >
                  Reactivar
                  <DropdownMenuShortcut>
                    <RefreshCcwDot className="size-4" aria-hidden="true" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onSelect={() => setShowDeleteDialog(true)}
                disabled={!isActive}
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
