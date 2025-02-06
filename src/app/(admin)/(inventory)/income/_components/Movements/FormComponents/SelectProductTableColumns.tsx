"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
// import { format } from "date-fns";
// import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { es } from "date-fns/locale";
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
import { format } from "date-fns";
import { ActiveProduct } from "@/app/(admin)/(catalog)/product/products/_interfaces/products.interface";
import { Checkbox } from "@/components/ui/checkbox";
// import Image from "next/image";

//   name        String?
//   description String?
//   Storage.name Storage  @relation(fields: [storageId], references: [id])
//   date        DateTime @default(now()) @db.Timestamptz(6)
//   state       Boolean  @default(false) // Estado que indica si el ingreso es concreto (true) o está en proceso (false)
//   isActive    Boolean  @default(true) // Campo para controlar si está activo o no
//   createdAt   DateTime @default(now()) @db.Timestamptz(6)
// const STATE_OPTIONS = {
//   true: "Concretado",
//   false: "En proceso",
// };
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
    },
    {
        accessorKey: "",
        id: "Total",
        header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total" />
        ),
        cell: ({ row }) => (
        <span>
            {String(row.original.Producto.precio * row.original.quantity).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
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
            {row.original.date
            ? format(new Date(row.original.date), "PPp", { locale: es })
            : "Fecha no disponible"}
        </span>
        ),
    },
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
            {row.original.state ? STATE_OPTIONS.true : STATE_OPTIONS.false}
        </Badge>
        ),
    }
];
