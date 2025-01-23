"use client";

import { useDesignProject } from "@/hooks/use-design-project";

import { ErrorPage } from "@/components/common/ErrorPage";
import { HeaderPage } from "@/components/common/HeaderPage";
import { Shell } from "@/components/common/Shell";
import { DataTableSkeleton } from "@/components/data-table/DataTableSkeleton";
import { DesignProjectTable } from "@/components/design-project/DesignProjectTable";

export default function Project() {
    const { data, isLoading } = useDesignProject();

    if (isLoading) {
        return (
            <Shell>
                <HeaderPage
                    title="Proyectos de Diseño"
                    description="Lista de proyectos almacenados en el sistema"
                />
                <DataTableSkeleton
                    columnCount={5}
                    searchableColumnCount={1}
                    filterableColumnCount={0}
                    cellWidths={["1rem", "15rem", "12rem", "12rem", "8rem"]}
                    shrinkZero
                />
            </Shell>
        );
    }

    if (!data) {
        return (
            <Shell>
                <HeaderPage
                    title="Proyectos de Diseño"
                    description="Lista de proyectos almacenados en el sistema"
                />
                <ErrorPage />
            </Shell>
        );
    }

    return (
        <Shell>
            <HeaderPage
                title="Proyectos de Diseño"
                description="Lista de proyectos almacenados en el sistema"
            />
            <DesignProjectTable data={data} />
        </Shell>
    );
}
