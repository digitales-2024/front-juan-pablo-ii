"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { DetailedOutgoing } from "../_interfaces/outgoing.interface";
// import { format } from "date-fns";
// import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { UpdateOutgoingSheet } from "./UpdateOutgoingSheet";
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
import { ReactivateOutgoingDialog } from "./ReactivateProductDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { DeactivateOutgoingDialog } from "./DeactivateOutgoingDialog";
import { ShowMovementsDialog } from "./Movements/ShowMovementsDialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { StorageMovementDetail } from "./Movements/StorageMovementDetail";
// import Image from "next/image";

const STATE_OPTIONS = {
  true: "Concretado",
  false: "En proceso",
};

const TRANSFERENCE_OPTIONS = {
  true: "SI",
  false: "NO",
};
export const columns: ColumnDef<DetailedOutgoing>[] = [
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
    accessorKey: "name",
    meta: {
      title: "Nombre",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => (
      <span>
        {!row.original.name || row.original.name.length == 0
          ? ""
          : row.original.name}
      </span>
    ),
  },
  {
    accessorKey: "movements",
    size: 10,
    meta: {
      title: "Movimientos",
    },
    header: () => <div>Movimientos</div>,
    cell: ({ row }) => (
      <div>
        <ShowMovementsDialog
          data={row.original.Movement}
          incomingName={row.original.name ?? row.original.id}
        ></ShowMovementsDialog>
      </div>
    ),
  },
  {
    accessorKey: "description",
    meta: {
      title: "Descripción",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descripción" />
    ),
    cell: ({ row }) => (
      <span>{row.original.description || "Sin descripción"}</span>
    ),
  },
  {
    accessorKey: "Storage.name",
    meta: {
      title: "Almacén Origen",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Almacén Origen" />
    ),
    cell: ({ row }) => (
      <span>{row.original.Storage.name ?? "Sin Almacen"}</span>
    ),
  },
  {
    accessorKey: "Storage.TypeStorage.name",
    meta: {
      title: "Tipo de almacén",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo de almacén" />
    ),
    cell: ({ row }) => (
      <span>
        {row.original.Storage.TypeStorage.name ?? "Sin tipo de almacén"}
      </span>
    ),
  },
  {
    accessorKey: "Storage.TypeStorage.branch.name",
    meta: {
      title: "Sucursal",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sucursal" />
    ),
    cell: ({ row }) => (
      <span>
        {row.original.Storage.TypeStorage.branch?.name ?? "Sin sucursal"}
      </span>
    ),
  },
  {
    accessorKey: "date",
    meta: {
      title: "Fecha de egreso",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de egreso" />
    ),
    cell: ({ row }) => (
      <span>
        {row.original.date
          ? format(new Date(row.original.date), "PP", { locale: es })
          : "Fecha no disponible"}
      </span>
    ),
  },
    {
      accessorKey: "isTransference",
      meta: {
        title: "Transferencia",
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="¿Es transferencia?" />
      ),
      cell: ({ row }) => (
        // <span>
        //   {row.original.state}
        // </span>
        <div className="flex items-center space-x-2">
          <Badge variant={row.original.isTransference ? "default" : "secondary"}>
            {row.original.isTransference ? TRANSFERENCE_OPTIONS.true : TRANSFERENCE_OPTIONS.false}
          </Badge>
          {(row.original.isTransference && row.original.referenceId && (row.original.referenceId.length>0)) && <StorageMovementDetail storageId={row.original.referenceId}></StorageMovementDetail>}
        </div>
      ),
    },
  {
    accessorKey: "state",
    meta: {
      title: "Estado",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => (
      // <span>
      //   {row.original.state}
      // </span>
      <Badge variant={row.original.state ? "default" : "secondary"}>
        {row.original.state ? STATE_OPTIONS.true : STATE_OPTIONS.false}
      </Badge>
    ),
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
      const outgoing = row.original;
      const { isActive } = outgoing;
      const isSuperAdmin = true;

      return (
        <div>
          <div>
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
