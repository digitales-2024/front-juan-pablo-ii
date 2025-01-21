"use client";
import { DataTable } from "@/components/data-table/DataTable";
import { useMemo } from "react";
import { typeColumns } from "./TypeTableColumns";
import { TypeTableToolbarActions } from "./TypeTableToolbarActions";
import { CreateTypeProductDto } from "../types";

interface TData {
    data: CreateTypeProductDto[];
}

export function TypeTable({ data }: TData) {
const columns = useMemo(() => typeColumns(), []);
  
    return (
        <DataTable
            data={data|| []}
            columns={columns}
            toolbarActions={<TypeTableToolbarActions />}
        />
    );
};
