import { useResource } from "@/hooks/use-resource";
import { ResourceType } from "@/types/resource";

import { ErrorPage } from "../common/ErrorPage";
import { DataTableSkeleton } from "../data-table/DataTableSkeleton";
import { iconMap } from "./iconMap";
import { ResourcesTable } from "./resources-table/ResourcesTable";

interface ResourceDisplayProps {
    resourceType: ResourceType;
}

export function ResourceDisplay({ resourceType }: ResourceDisplayProps) {
    const { resourceByType, isLoadingResourceByType } = useResource({
        type: resourceType,
    });

    if (isLoadingResourceByType) {
        return (
            <DataTableSkeleton
                columnCount={4}
                searchableColumnCount={1}
                filterableColumnCount={0}
                cellWidths={["1rem", "15rem", "12rem", "12rem", "8rem"]}
                shrinkZero
            />
        );
    }

    if (!resourceByType) {
        return <ErrorPage />;
    }

    return (
        <ResourcesTable
            data={resourceByType}
            iconMap={iconMap}
            currentResourceType={resourceType}
        />
    );
}
