"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { PrescriptionItemResponse } from "../../_interfaces/prescription.interface";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const columns: ColumnDef<PrescriptionItemResponse>[] = [
  {
    accessorKey: "name",
    meta: {
      title: "Nombre",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => <span>{row.original.name ?? "N/A"}</span>,
  },
  {
    accessorKey: "quantity",
    meta: {
      title: "Cantidad",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cantidad" />
    ),
    cell: ({ row }) => <span>{row.original.quantity ?? 0}</span>,
  },
  {
    accessorKey: "description",
    meta: {
      title: "Descripción",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descripción" />
    ),
    cell: ({ row }) => <span>{row.original.description ?? "Sin descripción"}</span>,
  },
  {
    accessorKey: "storageId",
    meta: {
      title: "Almacén",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Almacén" />
    ),
    cell: ({ row }) => {
      // Esta parte se debe conectar con los almacenes reales
      const storages = [
        { id: "1", name: "Almacén Principal" },
        { id: "2", name: "Farmacia" },
        { id: "3", name: "Depósito" }
      ];

      return (
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Seleccionar almacén" />
          </SelectTrigger>
          <SelectContent>
            {storages.map((storage) => (
              <SelectItem key={storage.id} value={storage.id}>{storage.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
  },
];
