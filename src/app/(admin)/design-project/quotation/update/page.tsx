"use client";

import { useQuotations } from "@/hooks/use-quotation";
import { useSearchParams } from "next/navigation";

import { HeaderPage } from "@/components/common/HeaderPage";
import { Shell } from "@/components/common/Shell";
import UpdateQuotation from "@/components/quotation/update-quotation/UpdateQuotation";

export default function UpdateQuotationPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const { quotationById } = useQuotations({ id: id ?? "" });
    return (
        <Shell className="gap-6">
            <HeaderPage
                title="Actualizar Cotización"
                description="Complete todos los campos para actualizar la cotización."
                badgeContent={quotationById?.name ?? ""}
            />
            {quotationById && <UpdateQuotation quotationById={quotationById} />}
        </Shell>
    );
}
