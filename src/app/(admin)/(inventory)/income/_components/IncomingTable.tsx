"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "./IncomingTableColumns";
import { IncomingTableToolbarActions } from "./IncomingTableToolbarActions";
// import { ListCategoryResponse } from "../_actions/category.actions";
import { DetailedIncoming } from "../_interfaces/income.interface";

interface IncomingTableProps {
  data: DetailedIncoming[];
}

//   name        String?
//   description String?
//   Storage.name Storage  @relation(fields: [storageId], references: [id])
//   date        DateTime @default(now()) @db.Timestamptz(6)
//   state       Boolean  @default(false) // Estado que indica si el ingreso es concreto (true) o está en proceso (false)
//   isActive    Boolean  @default(true) // Campo para controlar si está activo o no
//   createdAt   DateTime @default(now()) @db.Timestamptz(6)

export function IncomingTable({ data }: IncomingTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      placeholder="Buscar por nombre ..."
      toolbarActions={(table) => <IncomingTableToolbarActions table={table} />}
    />
  );
}
