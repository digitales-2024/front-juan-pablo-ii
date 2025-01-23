"use client";

import { BusinessUpdateForm } from "@/components/business/BusinessUpdateForm";
import { HeaderPage } from "@/components/common/HeaderPage";
import { Shell } from "@/components/common/Shell";
import { Card, CardContent } from "@/components/ui/card";

export default function BusinessPage() {
    return (
        <Shell className="gap-4">
            <HeaderPage
                title="Negocio"
                description="Gestiona la información del negocio."
            />

            <Card className="pt-6">
                <CardContent>
                    <BusinessUpdateForm />
                </CardContent>
            </Card>
        </Shell>
    );
}
