"use client";
"use memo";

import { useProfile } from "@/hooks/use-profile";
import { Zoning } from "@/types";
import { useMemo } from "react";

import { DataTable } from "../data-table/DataTable";
import { zoningColumns } from "./ZoningTableColumns";
import { ZoningTableToolbarActions } from "./ZoningTableToolbarActions";

export function ZoningTable({ data }: { data: Zoning[] }) {
    const { user } = useProfile();

    const columns = useMemo(
        () => zoningColumns(user?.isSuperAdmin || false),
        [user],
    );

    return (
        <DataTable
            data={data}
            columns={columns}
            toolbarActions={<ZoningTableToolbarActions />}
            placeholder="Buscar zonificaciones..."
        />
    );
}
