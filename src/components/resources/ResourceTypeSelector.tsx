import { ResourceType } from "@/types/resource";
import { Wrench, Users, Package, HeartHandshake } from "lucide-react";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

interface ResourceTypeSelectorProps {
    selectedType: ResourceType;
    onTypeChange: (type: ResourceType) => void;
}

export function ResourceTypeSelector({
    selectedType,
    onTypeChange,
}: ResourceTypeSelectorProps) {
    const buttons = [
        {
            name: "Herramientas",
            type: ResourceType.TOOLS,
            icon: Wrench,
            tooltipText: "Herramientas",
        },
        {
            name: "Mano de Obra",
            type: ResourceType.LABOR,
            icon: Users,
            tooltipText: "Mano de Obra",
        },
        {
            name: "Suministros",
            type: ResourceType.SUPPLIES,
            icon: Package,
            tooltipText: "Suministros",
        },
        {
            name: "Servicios",
            type: ResourceType.SERVICES,
            icon: HeartHandshake,
            tooltipText: "Servicios",
        },
    ];

    return (
        <div className="flex flex-nowrap gap-2">
            {buttons.map((button) => (
                <Button
                    key={button.type}
                    variant={
                        selectedType === button.type ? "default" : "outline"
                    }
                    size="sm"
                    title={button.tooltipText}
                    onClick={() => onTypeChange(button.type)}
                    className={cn(
                        // Solo mantenemos las clases necesarias para el responsive
                        "sm:max-w-sm",
                        { "w-8": !button.name }, // width cuadrado solo en móvil
                    )}
                >
                    <button.icon />
                    <span className="hidden lg:inline">{button.name}</span>
                </Button>
            ))}
        </div>
    );
}
