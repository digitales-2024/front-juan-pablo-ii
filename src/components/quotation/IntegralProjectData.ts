import { Costs, IntegralProjectItem } from "@/types";

// projectData.ts
export const projectNames: { [key in keyof Costs]: string } = {
    architecturalCost: "Proyecto Arquitectónico",
    structuralCost: "Proyecto Estructural",
    electricCost: "Proyecto de Instalaciones Eléctricas",
    sanitaryCost: "Proyecto de Instalaciones Sanitarias",
};

export const projects: { [key: string]: IntegralProjectItem[] } = {
    "Proyecto Arquitectónico": [
        {
            description: "Plano de Ubicación y Localización",
            unit: "escala 1/1000",
        },
        { description: "Plano de Diferentes Niveles", unit: "escala 1/50" },
        { description: "Plano de Elevaciones", unit: "escala 1/50" },
        { description: "Plano de Cortes", unit: "escala 1/50" },
        { description: "Memoria Descriptiva", unit: "" },
    ],
    "Proyecto Estructural": [
        { description: "Plano de Cimentación", unit: "escala 1/50" },
        {
            description: "Plano de Detalles Constructivos",
            unit: "escala 1/50",
        },
        {
            description: "Plano de Aligerado de Niveles",
            unit: "escala 1/50",
        },
        { description: "Memoria Descriptiva", unit: "" },
    ],
    "Proyecto de Instalaciones Eléctricas": [
        { description: "Planos de Tendido Eléctrico", unit: "escala 1/50" },
        { description: "Cálculo Eléctrico", unit: "" },
        { description: "Memoria Justificativa", unit: "" },
    ],
    "Proyecto de Instalaciones Sanitarias": [
        { description: "Planos de Tendido Sanitario", unit: "escala 1/50" },
        { description: "Planos de Agua y Desagüe", unit: "escala 1/50" },
        { description: "Memoria Justificativa", unit: "" },
    ],
};
