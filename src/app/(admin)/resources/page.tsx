"use client";
import { ResourceType } from "@/types/resource";
import { useState } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { Shell } from "@/components/common/Shell";
import { ResourceDisplay } from "@/components/resources/ResourceDisplay";
import { CreateResourceDialog } from "@/components/resources/resources-table/CreateResourceDialog";
import { ResourceTypeSelector } from "@/components/resources/ResourceTypeSelector";

const getTitleForType = (type: ResourceType) => {
    const titles = {
        [ResourceType.TOOLS]: "Herramientas",
        [ResourceType.LABOR]: "Mano de Obra",
        [ResourceType.SUPPLIES]: "Suministros",
        [ResourceType.SERVICES]: "Servicios",
    };
    return titles[type];
};

const getDescriptionForType = (type: ResourceType) => {
    const descriptions = {
        [ResourceType.TOOLS]: "Lista de herramientas registradas en el sistema",
        [ResourceType.LABOR]:
            "Lista de recursos de mano de obra registrados en el sistema",
        [ResourceType.SUPPLIES]:
            "Lista de suministros registrados en el sistema",
        [ResourceType.SERVICES]: "Lista de servicios registrados en el sistema",
    };
    return descriptions[type];
};

export default function ResourcesPage() {
    const [selectedType, setSelectedType] = useState<ResourceType>(
        ResourceType.TOOLS,
    );

    return (
        <Shell className="gap-6">
            <HeaderPage
                title={getTitleForType(selectedType)}
                description={getDescriptionForType(selectedType)}
            />

            <div className="flex flex-row items-center gap-4 overflow-x-auto py-4">
                <CreateResourceDialog />
                <ResourceTypeSelector
                    selectedType={selectedType}
                    onTypeChange={setSelectedType}
                />
            </div>

            <ResourceDisplay resourceType={selectedType} />
        </Shell>
    );
}
