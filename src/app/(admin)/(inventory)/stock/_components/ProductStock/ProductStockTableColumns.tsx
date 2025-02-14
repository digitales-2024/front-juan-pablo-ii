"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
// import { Badge } from "@/components/ui/badge";
// import { es } from "date-fns/locale";
// import { format } from "date-fns";
import { ProductStock } from "../../_interfaces/stock.interface";
// import Image from "next/image";

// type ProductStock = {
//   idProduct: string;
//   name: string;
//   unit: string;
//   price: number;
//   stock: number;
//   totalPrice: number;
// }
// const STATE_OPTIONS = {
//   true: "Concretado",
//   false: "En proceso",
// };
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
    accessorKey: "price",
    meta: {
      title: "Precio",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Precio" />
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
  // {
  //   accessorKey: "date",
  //   id: "Fecha de ingreso",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Fecha de ingreso" />
  //   ),
  //   cell: ({ row }) => (
  //     <span>
  //       {row.original.date
  //         ? format(new Date(row.original.date), "PPp", { locale: es })
  //         : "Fecha no disponible"}
  //     </span>
  //   ),
  // },
];
