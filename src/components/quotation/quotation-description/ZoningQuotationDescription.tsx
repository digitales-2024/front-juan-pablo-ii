import { useZoning } from "@/hooks/use-zoning";
import { MapPin, Building2, TreePine } from "lucide-react";
import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CircularProgress } from "./CircularProgressQuotationDescription";

interface ZoningQuotationDescriptionProps {
    id: string;
}

export default function ZoningQuotationDescription({
    id,
}: ZoningQuotationDescriptionProps) {
    const { zoningById } = useZoning({ id });
    return (
        <div className="p-4">
            <Card className="mx-auto w-full max-w-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">
                        Zonificación: {zoningById?.zoneCode}
                    </CardTitle>
                    <MapPin
                        className="h-6 w-6 text-muted-foreground"
                        strokeWidth={1.5}
                    />
                </CardHeader>
                <CardContent>
                    <div className="mt-4 flex flex-col items-center justify-around space-y-4 font-light sm:flex-row sm:space-x-4 sm:space-y-0">
                        <CircularProgress
                            percentage={zoningById?.buildableArea ?? 0}
                            color="text-primary"
                            icon={
                                <Building2
                                    className="mb-2 h-8 w-8 text-primary"
                                    strokeWidth={1.5}
                                />
                            }
                        />
                        <CircularProgress
                            percentage={zoningById?.openArea ?? 0}
                            color="text-green-500"
                            icon={
                                <TreePine
                                    className="mb-2 h-8 w-8 text-green-500"
                                    strokeWidth={1.5}
                                />
                            }
                        />
                    </div>
                    <div className="mt-4 flex justify-around text-sm text-muted-foreground">
                        <span className="font-light">Área Construible</span>
                        <span className="font-light">Área Libre</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
