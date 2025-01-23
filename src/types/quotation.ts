import { IntegralProjectDesign } from "./integralProjectQuotation";

export type Quotation = {
    id: string;
    name: string;
    code: string;
    publicCode: number;
    description: string;
    client: Client;
    zoning: Zoning;
    status: string;
    discount: number;
    totalAmount: number;
    deliveryTime: number;
    exchangeRate: number;
    landArea: number;
    paymentSchedule: string;
    integratedProjectDetails: string;
    architecturalCost: number;
    structuralCost: number;
    electricCost: number;
    sanitaryCost: number;
    metering: number;
    levels: LevelQuotation[];
    createdAt: string;
    updatedAt: string;
};

export type QuotationSummary = {
    id: string;
    name: string;
    publicCode: number;
    client: Client;
    zoning: Zoning;
    status: string;
    totalAmount: number;
    metering: number;
};

export type Client = {
    id: string;
    name: string;
};

export type Zoning = {
    id: string;
    zoneCode: string;
};

export enum QuotationStatusType {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

export type HeadQuotation = {
    name: string;
    description: string;
    deliveryTime: number;
    landArea: number;
    idClient: string;
    idZoning: string;
};

export type QuotationStructure = {
    name: string;
    code?: string;
    description: string;
    discount: number;
    totalAmount: number;
    deliveryTime: number;
    exchangeRate: number;
    landArea: number;
    paymentSchedule?: PaymentSchedule[];
    integratedProjectDetails?: IntegralProjectDesign[];
    architecturalCost: number;
    structuralCost: number;
    electricCost: number;
    sanitaryCost: number;
    metering?: number;
    levels?: LevelQuotation[];
    clientId: string;
    zoningId: string;
    buildableArea?: number;
    openArea?: number;
};

export type LevelQuotation = {
    name: string;
    spaces: SpaceQuotation[];
};

export type SpaceQuotation = {
    amount: number;
    area: number;
    spaceId: string;
    name?: string;
    id?: string;
};
export type PaymentSchedule = {
    name: string;
    percentage: number;
    cost: number;
    description?: string;
};
