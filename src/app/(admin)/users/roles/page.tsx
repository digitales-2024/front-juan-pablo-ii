"use client";

("use memo");

import { useRol } from "@/hooks/use-rol";

import { ErrorPage } from "@/components/common/ErrorPage";
import { HeaderPage } from "@/components/common/HeaderPage";
import { Shell } from "@/components/common/Shell";
import { DataTableSkeleton } from "@/components/data-table/DataTableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

import { RolesTable } from "./_components/RolesTable";

export default function RolesPages() {
    const { dataRoles, isLoadingRoles } = useRol();

    if (isLoadingRoles) {
        return (
            <Shell className="gap-2">
                <HeaderPage
                    title="Roles"
                    description="Gestiona los roles de los usuarios de la aplicación."
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

    if (!dataRoles) {
        return (
            <Shell className="gap-6">
                <HeaderPage
                    title="Roles"
                    description="Gestiona los roles de los usuarios de la aplicación."
                />
                <ErrorPage />
            </Shell>
        );
    }
    return (
        <Shell className="gap-6">
            <HeaderPage
                title="Roles"
                description="Gestiona los roles de los usuarios de la aplicación."
            />
            <RolesTable data={dataRoles} />
        </Shell>
    );
}
