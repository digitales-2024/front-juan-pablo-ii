import { Quotation } from "@/types";
import { DollarSign } from "lucide-react";
import React from "react";

interface CostQuotationDescriptionProps {
    quotationById: Quotation;
}

const costFields = [
    {
        label: "Costo Arquitectónico",
        value: (quotation: Quotation) => quotation.architecturalCost,
    },
    {
        label: "Costo Sanitario",
        value: (quotation: Quotation) => quotation.sanitaryCost,
    },
    {
        label: "Costo Eléctrico",
        value: (quotation: Quotation) => quotation.electricCost,
    },
    {
        label: "Costo Estructural",
        value: (quotation: Quotation) => quotation.structuralCost,
    },
];

export default function CostQuotationDescription({
    quotationById,
}: CostQuotationDescriptionProps) {
    return (
        <div className="mb-4 grid grid-cols-2 gap-4 p-4">
            {costFields.map((field, index) => (
                <div key={index} className="flex flex-row items-center">
                    <span className="font-medium">{field.label}:</span>
                    <DollarSign className="h-4 w-4" strokeWidth={1.5} />
                    <span className="font-light">
                        {field.value(quotationById)?.toLocaleString() ?? "N/A"}
                    </span>
                </div>
            ))}
        </div>
    );
}
