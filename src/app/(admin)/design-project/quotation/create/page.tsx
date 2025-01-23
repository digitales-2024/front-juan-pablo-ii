"use client";

import { HeaderPage } from "@/components/common/HeaderPage";
import { Shell } from "@/components/common/Shell";
import CreateQuotation from "@/components/quotation/create-quotation/CreateQuotation";

export default function CreateQuotationPage() {
    return (
        <Shell className="gap-6">
            <HeaderPage
                title="Crear Cotización"
                description="Complete todos los campos para crear una cotización."
            />
            <CreateQuotation />
        </Shell>
    );
}
