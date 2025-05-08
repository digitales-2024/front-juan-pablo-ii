"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { ProductStock } from "../../_interfaces/stock.interface";

export const columns: ColumnDef<ProductStock>[] = [
  {
    accessorKey: "name",
    meta:{
      title: "Producto"
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Producto" />
    ),
    cell: ({ row }) => (
      <span>{row.original.name}</span>
    ),
  },
  {
    accessorKey: "unit",
    meta:{
      title: "Unidad"
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Unidad" />
    ),
    cell: ({ row }) => (
      <span>
        {row.original.unit?? ""}
      </span>
    ),
  },
  {
    accessorKey: "stock",
    meta: {
      title: "Stock",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
    cell: ({ row }) => (
      <span>
        {row.original.stock?? ""}
      </span>
    ),
  },
  {
    accessorKey: "price",
    meta: {
      title: "Precio de venta",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Precio venta" />
    ),
    cell: ({ row }) => (
      <span>
        {row.original.price.toLocaleString("es-PE", {
          style: "currency",
          currency: "PEN",
        })}
        </span>
    ),
  },
  {
    accessorKey: "totalPrice",
    meta: {
      title: "Total",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    cell: ({ row }) => (
      <span>
        {Number(row.original.totalPrice).toLocaleString("es-PE", {
          style: "currency",
          currency: "PEN",
        })}
        </span>
    ),
  },
];
