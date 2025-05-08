"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import { IncomingMovement } from "../../_interfaces/income.interface";

const STATE_OPTIONS = {
  true: "Concretado",
  false: "En proceso",
};
export const columns: ColumnDef<IncomingMovement>[] = [
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
    accessorKey: "Producto.precio",
    meta:{
      title: "Precio de venta"
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Precio Venta" />
    ),
    cell: ({ row }) => (
      <span>
        {row.original.Producto.precio.toLocaleString("es-PE", {
          style: "currency",
          currency: "PEN",
        })}
        </span>
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
    accessorKey: "buyingPrice",
    meta:{
      title: "Precio de compra"
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Precio Compra" />
    ),
    cell: ({ row }) => (
      <span className="font-bold">
        {row.original.buyingPrice
          ? row.original.buyingPrice.toLocaleString("es-PE", {
              style: "currency",
              currency: "PEN",
            })
          : "No disponible"}
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
        {Number((row.original.buyingPrice ?? 0) * row.original.quantity).toLocaleString("es-PE", {
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
      <Badge variant={row.original.state ? "default" : "secondary"}>
        {row.original.state ? STATE_OPTIONS.true : STATE_OPTIONS.false}
      </Badge>
    ),
  }
];
