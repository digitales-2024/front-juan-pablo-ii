"use client";
"use memo";

import { useClients } from "@/hooks/use-client";

import { ClientsTable } from "@/components/clients/ClientsTable";
import { ErrorPage } from "@/components/common/ErrorPage";
import { HeaderPage } from "@/components/common/HeaderPage";
import { Shell } from "@/components/common/Shell";
import { DataTableSkeleton } from "@/components/data-table/DataTableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClientsPage() {
    const { dataClientsAll, isLoading } = useClients();

    if (isLoading) {
        return (
            <Shell className="gap-2">
                <HeaderPage
                    title="Clientes"
                    description="Lista de clientes registrados en el sistema."
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
    if (!dataClientsAll) {
        return (
            <Shell className="gap-6">
                <HeaderPage
                    title="Clientes"
                    description="Lista de clientes registrados en el sistema."
                />
                <ErrorPage />
            </Shell>
        );
    }
    return (
        <Shell className="gap-6">
            <HeaderPage
                title="Clientes"
                description="Lista de clientes registrados en el sistema."
            />
            <ClientsTable data={dataClientsAll} />
        </Shell>
    );
}
