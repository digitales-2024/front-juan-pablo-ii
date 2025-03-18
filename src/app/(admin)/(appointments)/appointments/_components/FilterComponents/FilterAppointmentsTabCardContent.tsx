"use client";

import { PropsWithChildren } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { AppointmentsFilterType } from "../../_interfaces/filter.interface";

interface FilterAppointmentsTabCardContentProps extends PropsWithChildren {
    value: AppointmentsFilterType;
    title: string;
    description: string;
}

export function FilterAppointmentsTabCardContent({
    value,
    title,
    description,
    children,
}: FilterAppointmentsTabCardContentProps) {
    return (
        <TabsContent value={value} className="mt-4">
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>{children}</CardContent>
            </Card>
        </TabsContent>
    );
} 