"use client";
"use memo";

import { useProfile } from "@/hooks/use-profile";
import { useQuotations } from "@/hooks/use-quotation";
import { QuotationSummary } from "@/types";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

import { DataTable } from "../data-table/DataTable";
import { quotationsColumns } from "./QuotationTableColumns";
import { QuotationTableToolbarActions } from "./QuotationTableToolbarActions";

export function QuotationsTable({ data }: { data: QuotationSummary[] }) {
    const { user } = useProfile();

    const { exportQuotationToPdf } = useQuotations();
    const router = useRouter();
    const handleEditClick = useCallback(
        (id: string) => {
            router.push(`/design-project/quotation/update?id=${id}`);
        },
        [router],
    );
    const columns = useMemo(
        () =>
            quotationsColumns(
                user?.isSuperAdmin || false,
                exportQuotationToPdf,
                handleEditClick,
            ),
        [user, exportQuotationToPdf, handleEditClick],
    );

    return (
        <DataTable
            data={data}
            columns={columns}
            toolbarActions={<QuotationTableToolbarActions />}
            placeholder="Buscar cotizaciones..."
        />
    );
}
