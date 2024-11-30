import { PaymentSchedule } from "@/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentScheduleQuotationDescription({
    name,
    percentage,
    cost,
    description,
}: PaymentSchedule) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-center text-base">{name}</CardTitle>
            </CardHeader>
            <CardContent className="items-center">
                <div className="mb-2 flex items-center justify-center">
                    <div className="mr-4 flex size-16 items-center justify-center rounded-full bg-gray-200 text-lg font-bold">
                        {percentage}%
                    </div>
                    <p className="text-lg">
                        S/.{" "}
                        <span className="font-medium">
                            {cost?.toLocaleString() ?? "N/A"}
                        </span>
                    </p>
                </div>
                <div className="mt-4 text-center">
                    <span className="text-sm">{description}</span>
                </div>
            </CardContent>
        </Card>
    );
}
