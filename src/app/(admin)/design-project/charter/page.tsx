"use client";

import { useProjectCharter } from "@/hooks/use-project-charter";

import { ErrorPage } from "@/components/common/ErrorPage";
import { HeaderPage } from "@/components/common/HeaderPage";
import { Shell } from "@/components/common/Shell";
import { DataTableSkeleton } from "@/components/data-table/DataTableSkeleton";
import { ProjectCharterTable } from "@/components/project-charter/ProjectCharterTable";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectCharterPage() {
    const { dataProjectCharterAll, isLoading } = useProjectCharter();

    if (isLoading) {
        return (
            <Shell className="gap-2">
                <HeaderPage
                    title="Acta de Proyecto"
                    description="Lista de las actas de proyectos registradas en el sistema."
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
    if (!dataProjectCharterAll) {
        return (
            <Shell className="gap-6">
                <HeaderPage
                    title="Acta de Proyecto"
                    description="Lista de las actas de proyectos registradas en el sistema."
                />
                <ErrorPage />
            </Shell>
        );
    }
    return (
        <Shell className="gap-6">
            <HeaderPage
                title="Acta de Proyecto"
                description="Lista de las actas de proyectos registradas en el sistema."
            />
            <ProjectCharterTable data={dataProjectCharterAll} />
        </Shell>
    );
}
