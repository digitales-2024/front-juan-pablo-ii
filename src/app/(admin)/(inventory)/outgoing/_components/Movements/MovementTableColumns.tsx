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
import { OutgoingMovement } from "../../_interfaces/outgoing.interface";
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
};
export const columns: ColumnDef<OutgoingMovement>[] = [
//   {
//     accessorKey: "id",
//     id: "Número de Movimiento",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Número de Movimiento" />
//     ),
//   },
  {
    accessorKey: "Producto.name",
    size: 5,
    meta:{
      title: "Producto"
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Producto" />
    ),
    cell: ({ row }) => (
      <span>{row.original.Producto.name}</span>
    ),
  },
  {
    accessorKey: "quantity",
    meta:{
      title: "Cantidad"
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cantidad" />
    ),
    cell: ({ row }) => (
      <span className="font-bold">
        {row.original.quantity} 
        {/* {row.original.Producto.unidadMedida?? ""} */}
      </span>
    ),
  },
  {
    accessorKey: "price",
    meta:{
      title: "Precio"
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Precio" />
    ),
    cell: ({ row }) => (
      <span className="font-bold">
        {row.original.Producto.precio.toLocaleString("es-PE", {
          style: "currency",
          currency: "PEN",
        })}
        </span>
    ),
  },
  {
    accessorKey: "total",
    meta:{
      title: "Total"
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    cell: ({ row }) => (
      <span className="font-bold text-primary">
        {Number(row.original.Producto.precio * row.original.quantity).toLocaleString("es-PE", {
          style: "currency",
          currency: "PEN",
        })}
        </span>
    ),
  },
  {
    accessorKey: "date",
    meta:{
      title: "Fecha de ingreso"
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de ingreso" />
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
    accessorKey: "state",
    meta:{
      title: "Consumación"
    },
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
