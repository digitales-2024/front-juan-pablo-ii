import { Quotation } from "@/types";

interface FooterQuotationDescriptionProps {
    quotationById: Quotation;
}

export default function FooterQuotationDescription({
    quotationById,
}: FooterQuotationDescriptionProps) {
    const totalAmount = quotationById?.totalAmount;
    const exchangeRate = quotationById?.exchangeRate;
    const totalAmountUSD =
        totalAmount && exchangeRate
            ? (totalAmount / exchangeRate).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
              })
            : "N/A";

    const financialSummary = [
        {
            label: "Monto Total",
            value: totalAmount?.toLocaleString() ?? "N/A",
            prefix: "S/. ",
        },
        {
            label: "Tasa de Cambio (1 USD)",
            value: exchangeRate ?? "N/A",
            prefix: "S/. ",
        },
        {
            label: "Monto Total (USD)",
            value: totalAmountUSD,
            prefix: "$",
        },
    ];

    return (
        <div className="mt-8">
            <span className="mb-4 text-xl font-medium text-gray-800">
                Resumen Financiero
            </span>
            <div className="grid gap-6 md:grid-cols-3">
                {financialSummary.map((item, index) => (
                    <div key={index} className="flex flex-col">
                        <span className="text-lg font-normal text-emerald-500">
                            {item.prefix}
                            {item.value}
                        </span>
                        <span className="text-gray-600">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
