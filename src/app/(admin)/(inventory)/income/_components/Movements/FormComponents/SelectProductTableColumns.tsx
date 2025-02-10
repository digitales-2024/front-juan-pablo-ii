"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
// import { format } from "date-fns";
// import { es } from "date-fns/locale";
// import { Button } from "@/components/ui/button";
// import { Ellipsis, RefreshCcwDot, TableProperties, Trash } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useState } from "react";
// import { DropdownMenuShortcut } from "@/components/ui/dropdown-menu";
// import { ReactivateIncomingDialog } from "./ReactivateIncomingDialog";
import { ActiveProduct } from "@/app/(admin)/(catalog)/product/products/_interfaces/products.interface";
import { Checkbox } from "@/components/ui/checkbox";
// import Image from "next/image";
export const columns: ColumnDef<ActiveProduct>[] = [
//   {
//     accessorKey: "id",
//     id: "Número de Movimiento",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Número de Movimiento" />
//     ),
//   },
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
        id: "Producto",
        header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Producto" />
        ),
        cell: ({ row }) => (
        <span>{row.original.name}</span>
        ),
    },
    {
        accessorKey: "codigoProducto",
        id: "Código",
        header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Código" />
        ),
        cell: ({ row }) => (
        <span>{row.original.codigoProducto??""}</span>
        ),
    },
    {
        accessorKey: "unidadMedida",
        id: "Unidad de medida",
        header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Unidad de Medida" />
        ),
        cell: ({ row }) => (
        <span>{row.original.unidadMedida??""}</span>
        ),
    },
    {
        accessorKey: "precio",
        id: "Precio",
        header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Precio" />
        ),
        cell: ({ row }) => (
        <span>{row.original.precio.toLocaleString(
            "es-PE", { style: "currency", currency: "PEN" }
        )}</span>
        ),
    },
    {
        accessorKey: "categoria.name",
        id: "Categoría",
        header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Categoría" />
        ),
        cell: ({ row }) => (
        <span>
            {row.original.categoria.name}
            {/* {row.original.Producto.unidadMedida?? ""} */}
        </span>
        ),
    },
    {
        accessorKey: "tipoProducto.name",
        id: "Subcategoría",
        header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Subcategoría" />
        ),
        cell: ({ row }) => (
        <span>
            {row.original.tipoProducto.name}
            </span>
        ),
    }
];
