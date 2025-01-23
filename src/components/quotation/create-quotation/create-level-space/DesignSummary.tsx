import { Floor } from "@/types";
import { Building2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DesignSummaryProps {
    floors: Floor[];
    calculateTotalMeters: (floor: Floor) => number;
    calculateTotalBuildingMeters: () => number;
}

export function DesignSummary({
    floors,
    calculateTotalMeters,
    calculateTotalBuildingMeters,
}: DesignSummaryProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Resumen del Diseño</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4 flex items-center justify-center">
                    <Building2 size={100} strokeWidth={1} />
                </div>
                <div className="space-y-4">
                    {floors.map((floor) => (
                        <div key={floor.number}>
                            <h3 className="font-semibold">
                                {floor.name}: {calculateTotalMeters(floor)} m²
                            </h3>
                            <ul className="list-inside list-disc pl-4">
                                {floor.spaces.map((space, index) => (
                                    <li key={index}>
                                        {space.amount} {space.name}:{" "}
                                        {space.meters} m²
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    <div className="mt-2 border-t pt-2">
                        <strong>
                            Total: {calculateTotalBuildingMeters()} m²
                        </strong>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
