"use client";

import React from 'react'
import { useZoning } from "@/hooks/use-zoning";
import { ErrorPage } from "@/components/common/ErrorPage";
import { HeaderPage } from "@/components/common/HeaderPage";
import { Shell } from "@/components/common/Shell";
import { DataTableSkeleton } from "@/components/data-table/DataTableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { ZoningTable } from "@/components/zoning/ZoningTable";

export default function ProductsPage() {
    const { dataZoningAll, isLoading } = useZoning();

    if (isLoading) {
        return (
            <Shell className="gap-2">
                <HeaderPage
                    title="Servicios"
                    description="Lista de servicios registradas en el sistema."
                />
                <div className="flex flex-col items-end justify-center gap-4">
                    <Skeleton className="h-7 w-52 justify-end" />
                    <DataTableSkeleton
                        columnCount={5}
                        searchableColumnCount={1}
                        filterableColumnCount={0}
                        cellWidths={["1rem", "15rem", "12rem", "12rem", "8rem"]}
                        shrinkZero
                    />
                </div>
            </Shell>
        );
    }
    if (!dataZoningAll) {
        return (
            <Shell className="gap-6">
                 <HeaderPage
                    title="Servicios"
                    description="Lista de servicios registradas en el sistema."
                />
                <ErrorPage />
            </Shell>
        );
    }
    return (
        <Shell className="gap-6">
                 <HeaderPage
                    title="Servicios"
                    description="Lista de servicios registradas en el sistema."
                />
            <ZoningTable data={dataZoningAll} />
        </Shell>
    );
}
