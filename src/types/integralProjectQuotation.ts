export interface IntegralProjectItem {
    description: string;
    unit: string;
}

export interface Costs {
    architecturalCost: number;
    structuralCost: number;
    electricCost: number;
    sanitaryCost: number;
}

export type IntegralProjectDesign = {
    project: string;
    items: IntegralProjectItem[];
    area: number;
    cost: number;
};
