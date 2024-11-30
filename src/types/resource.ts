export interface Resource {
    id: string;
    type: ResourceType;
    name: string;
    unit: string;
    unitCost: number;
    isActive: boolean;
}

export type ResourceArray = Resource[];

export interface CreateResourceDto {
    type: ResourceType;
    name: string;
    unit: string;
    unitCost: number;
}

export enum ResourceType {
    TOOLS = "TOOLS",
    LABOR = "LABOR",
    SUPPLIES = "SUPPLIES",
    SERVICES = "SERVICES",
}
// DTO para actualizar un recurso
export interface UpdateResourceDto extends Partial<CreateResourceDto> {
    id: string;
}

// DTO para eliminar/reactivar recursos
export interface DeleteResourcesDto {
    ids: string[];
}
