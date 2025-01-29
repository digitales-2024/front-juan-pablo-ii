"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { DetailedProduct } from "../_interfaces/products.interface";
// import { format } from "date-fns";
// import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { UpdateProductSheet } from "./UpdateProductSheet";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { PencilIcon } from "lucide-react";
import { DropdownMenuShortcut } from "@/components/ui/dropdown-menu";
import { ReactivateProductDialog } from "./ReactivateProductDialog";
import { BanIcon, ActivityIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { DeactivateProductDialog } from "./DeactivateProductDialog";
// import Image from "next/image";

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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
  },
  {
    accessorKey: "unidadMedida",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Medida" />
    ),
  },
  {
    accessorKey: "codigoProducto",
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descripción" />
    ),
  },
  {
    accessorKey: "observaciones",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Observaciones" />
    ),
  },
  {
    accessorKey: "condicionesAlmacenamiento",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Condiciones de almacenamiento" />
    ),
  },
  {
    accessorKey: "usoProducto",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ámbito de uso" />
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
    id: "Acciones",
    accessorKey: "actions",
    size: 10,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Acciones" />
    ),
    cell: function Cell({ row }) {
      const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
      const [showReactivateDialog, setShowReactivateDialog] = useState(false);
      const [showEditSheet, setShowEditSheet] = useState(false);
      const branch = row.original;
      const isActive = branch.isActive;

      return (
        <div>
          <div>
            <UpdateProductSheet
              product={branch}
              open={showEditSheet}
              onOpenChange={setShowEditSheet}
              showTrigger={false}
            />
            {isActive ? (
              <DeactivateProductDialog
                product={branch}
                open={showDeactivateDialog}
                onOpenChange={setShowDeactivateDialog}
                showTrigger={false}
              />
            ) : (
              <ReactivateProductDialog
                product={branch}
                open={showReactivateDialog}
                onOpenChange={setShowReactivateDialog}
                showTrigger={false}
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
                <DropdownMenuShortcut>
                  <PencilIcon className="size-4" aria-hidden="true" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {isActive ? (
                <DropdownMenuItem 
                  onSelect={() => setShowDeactivateDialog(true)}
                  className="text-destructive"
                >
                  Desactivar
                  <DropdownMenuShortcut>
                    <BanIcon className="size-4" aria-hidden="true" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem 
                  onSelect={() => setShowReactivateDialog(true)}
                  className="text-green-600"
                >
                  Reactivar
                  <DropdownMenuShortcut>
                    <ActivityIcon className="size-4" aria-hidden="true" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              )}
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
