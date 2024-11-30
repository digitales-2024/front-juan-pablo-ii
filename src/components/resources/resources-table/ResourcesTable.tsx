"use client";
"use memo";

import { useProfile } from "@/hooks/use-profile";
import { ResourceArray, ResourceType } from "@/types/resource";
import { LucideIcon } from "lucide-react";
import { useMemo } from "react";

import { DataTable } from "@/components/data-table/DataTable";

import { resourceColumns } from "./ResourceTableColumns";
import { ResourceTableToolbarActions } from "./ResourceTableToolbarActions";

interface ResourcesTableProps {
    data: ResourceArray;
    iconMap: Record<ResourceType, LucideIcon>;
    currentResourceType: ResourceType;
}
export function ResourcesTable({
    data,
    iconMap,
    currentResourceType,
}: ResourcesTableProps) {
    const { user } = useProfile();

    const columns = useMemo(
        () =>
            resourceColumns(
                user?.isSuperAdmin || false,
                iconMap,
                currentResourceType,
            ),
        [user, iconMap, currentResourceType],
    );

    return (
        <DataTable
            data={data}
            columns={columns}
            toolbarActions={<ResourceTableToolbarActions />}
            placeholder="Buscar recursos..."
        />
    );
}
