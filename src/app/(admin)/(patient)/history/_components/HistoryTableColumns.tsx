"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { DetailedProduct } from "../_interfaces/history.interface";
// import { format } from "date-fns";
// import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { UpdateProductSheet } from "./UpdateHistorySheet";
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
import { ReactivateProductDialog } from "./ReactivateHistoryDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { DeactivateProductDialog } from "./DeactivateHistoryDialog";
// import Image from "next/image";

// declare module '@tanstack/react-table' {
//   interface ColumnMeta<TData extends RowData, TValue> {
//     title: string
//   }
// }

export const columns: ColumnDef<DetailedProduct>[] = [
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
    //id: "Nombre",
    meta: {
      title: "Nombre"
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
  },
  {
    accessorKey: "unidadMedida",
    meta: {
      title: "Unidad de Medida"
    },
    //id: "Unidad de Medida",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Unidad de Medida" />
    ),
  },
  {
    accessorKey: "codigoProducto",
    //id: "Código",
    meta: {
      title: "Código"
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Código" />
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
    accessorKey: "categoria",
    //id: "Categoría",
    meta:{
      title: "Categoría"
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Categoría" />
    ),
    cell: ({ row }) => (
      <span>
        {row.original.categoria?.name || "Sin Categoría"}
      </span>
    ),
  },
  {
    accessorKey: "tipoProducto",
    meta:{
      title: "Subcategoría"
    },
    //id: "Subcategoría",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subcategoría" />
    ),
    cell: ({ row }) => (
      <span>
        {row.original.tipoProducto?.name || "Sin subcategoría"}
      </span>
    ),
  },
  {
    accessorKey: "precio",
    meta:{
      title: "Precio"
    },
    //id: "Precio",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Precio" />
    ),
    cell: ({ row }) => (
      <span>
        {row.original.precio.toLocaleString("es-PE", {
          style: "currency",
          currency: "PEN",
        })}
      </span>
    ),
  },
  {
    accessorKey: "descuento",
    meta: {
      title: "Descuento"
    },
    //id: "Descuento",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descuento" />
    ),
    cell: ({ row }) => (
      <span>
        {/* The discounts have been stored in the DB as a porcentage, so we need to convert it to a percentage by dividing by 100*/}
        {(row.original.descuento / 100)?.toLocaleString("es-PE", {
          style: "percent",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) || "Sin descuento"}
      </span>
    ),
  },
  {
    accessorKey: "description",
    meta: {
      title: "Descripción"
    },
    //id: "Descripción",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descripción" />
    ),
  },
  {
    accessorKey: "observaciones",
    meta:{
      title: "Observaciones"
    },
    //id: "Observaciones",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Observaciones" />
    ),
  },
  {
    accessorKey: "condicionesAlmacenamiento",
    //id: "Condiciones de almacenamiento",
    meta: {
      title: "Condiciones de almacenamiento"
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Condiciones de almacenamiento" />
    ),
  },
  {
    accessorKey: "usoProducto",
    meta: {
      title: "Ámbito de uso"
    },
    //id: "Uso",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ámbito de uso" />
    ),
  },
  {
    accessorKey: "isActive",
    meta: {
      title: "Estado"
    },
    //id: "Estado",
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
    accessorKey: "actions",
    //id: "Acciones",
    meta: {
      title: "Acciones"
    },
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
            <UpdateProductSheet
              product={product}
              open={showEditSheet}
              onOpenChange={setShowEditSheet}
              showTrigger={false}
            />
            <DeactivateProductDialog
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
