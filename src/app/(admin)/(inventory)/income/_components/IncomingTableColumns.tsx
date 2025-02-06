"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { DetailedIncoming } from "../_interfaces/income.interface";
// import { format } from "date-fns";
// import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { es } from "date-fns/locale";
import { UpdateProductSheet } from "./UpdateProductSheet";
import { Button } from "@/components/ui/button";
import { Ellipsis, RefreshCcwDot, TableProperties, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { DropdownMenuShortcut } from "@/components/ui/dropdown-menu";
import { ReactivateIncomingDialog } from "./ReactivateIncomingDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { DeactivateIncomingDialog } from "./DeactivateIncomingDialog";
import { format } from "date-fns";
import { ShowMovementsDialog } from "./Movements/ShowMovementsDialog";
// import Image from "next/image";

//   name        String?
//   description String?
//   Storage.name Storage  @relation(fields: [storageId], references: [id])
//   date        DateTime @default(now()) @db.Timestamptz(6)
//   state       Boolean  @default(false) // Estado que indica si el ingreso es concreto (true) o está en proceso (false)
//   isActive    Boolean  @default(true) // Campo para controlar si está activo o no
//   createdAt   DateTime @default(now()) @db.Timestamptz(6)
const STATE_OPTIONS = {
  true: "Concretado",
  false: "En proceso",
}
export const columns: ColumnDef<DetailedIncoming>[] = [
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
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(!!value)
          }
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
    id: "Nombre",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => (
      <span>
        {!row.original.name || (row.original.name.length == 0)? "" : row.original.name}
      </span>
    ),
  },
  {
    accessorKey: "description",
    id: "Descripción",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descripción" />
    ),
    cell: ({ row }) => (
      <span>
        {row.original.description || "Sin descripción"}
      </span>
    ),
  },
  {
    accessorKey: "storageId",
    id: "Almacén",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Almacén" />
    ),
    cell: ({ row }) => (
      <span>
        {(row.original.Storage as { name: string })?.name ?? "Sin Almacen"}
      </span>
    ),
  },
  {
    accessorKey: "date",
    id: "Fecha de ingreso",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de ingreso" />
    ),
    cell: ({ row }) => (
      <span>
        {row.original.date ? format(new Date(row.original.date), "PPp", { locale: es }) : "Fecha no disponible"}
      </span>
    ),
  },
  // NO usamos por el momento
  // {
  //   accessorKey: "imagenUrl",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Imágen" />
  //   ),
  //   cell: ({ row }) => (
  //     // <Image
  //     //   src={row.original.imagenUrl}
  //     //   alt={row.original.name}
  //     //   width={24}
  //     //   height={24}
  //     //   className="w-6 h-6 rounded-md object-cover"
  //     // />
  //     <img src={row.original.imagenUrl}
  //         alt={row.original.name}
  //         className="w-6 h-6 rounded-md object-cover"
  //       />
  //   ),
  // },
  {
    accessorKey: "state",
    id: "Consumación",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Consumación" />
    ),
    cell: ({ row }) => (
      // <span>
      //   {row.original.state}
      // </span>
      <Badge variant={row.original.state ? "default" : "secondary"}>
        {row.original.state? STATE_OPTIONS.true : STATE_OPTIONS.false}
      </Badge>
    ),
  },
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
  // {
  //   accessorKey: "createdAt",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Fecha de creación" />
  //   ),
  //   cell: ({ row }) =>
  //     format(new Date(row.original.createdAt), "PPp", { locale: es }),
  // },
  {
    id: "Movimientos",
    accessorKey: "movements",
    size: 10,
    header: () => (
      <div>Movimientos</div>
    ),
    cell: ({ row }) => (
      <div>
        <ShowMovementsDialog data={row.original.Movement} incomingName={row.original.name??row.original.id}></ShowMovementsDialog>
      </div>
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
      const product = row.original;
      const { isActive } = product;
      const isSuperAdmin = true;

      return (
        <div>
          <div>
            {/* <UpdateProductSheet
              product={product}
              open={showEditSheet}
              onOpenChange={setShowEditSheet}
              showTrigger={false}
            /> */}
            {/* <DeactivateProductDialog
              product={product}
              open={showDeleteDialog}
              onOpenChange={setShowDeleteDialog}
              showTrigger={false}
            />
            <ReactivateProductDialog
              product={product}
              open={showReactivateDialog}
              onOpenChange={setShowReactivateDialog}
              showTrigger={false}
            /> */}
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
