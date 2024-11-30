import { IntegralProjectDesign } from "@/types";
import { DollarSign } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function IntegralProjectQuotationDescription({
    project,
    area,
    cost,
    items,
}: IntegralProjectDesign) {
    if (cost === 0) {
        return null;
    }

    return (
        <Card className="mb-4 p-6">
            <CardHeader>
                <CardTitle className="text-xl font-light">{project}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col">
                    <div className="flex flex-row items-center">
                        <span className="font-medium">Área:</span>{" "}
                        <span className="font-light">{area} m²</span>
                    </div>
                    <div className="flex flex-row items-center">
                        <span className="font-medium">Costo:</span>
                        <DollarSign className="h-4 w-4" strokeWidth={1.5} />
                        <span className="font-light">
                            {cost?.toLocaleString() ?? "N/A"}
                        </span>
                    </div>
                </div>
                <ul className="mt-3 list-inside list-disc">
                    {items?.map((item, index) => (
                        <li key={index} className="mb-1">
                            <span className="font-medium">
                                {item.description}
                                {item.unit ? ":" : ""}
                            </span>{" "}
                            <span className="font-light">{item.unit}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
