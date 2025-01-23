"use client";
import { DataTable } from "@/components/data-table/DataTable";
import { useMemo } from "react";
import { typeColumns } from "./TypeTableColumns";
import { TypeTableToolbarActions } from "./TypeTableToolbarActions";
import { TypeProductResponse } from "../types";

interface TData {
  data: TypeProductResponse[];
}

export function TypeTable({ data }: TData) {
  const columns = useMemo(() => typeColumns(), []);
//
  return (
    <DataTable
      data={data ?? []}
      columns={columns}
      toolbarActions={(table) => <TypeTableToolbarActions table={table} />}
      placeholder="Buscar tipos de productos..."
    />
  );
}
