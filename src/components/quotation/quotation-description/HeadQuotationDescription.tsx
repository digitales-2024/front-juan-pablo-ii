import { Quotation } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface HeadQuotationDescriptionProps {
    quotationById: Quotation;
}

const fields = [
    { label: "Nombre", value: (quotation: Quotation) => quotation.name },
    {
        label: "Descripción",
        value: (quotation: Quotation) => quotation.description,
    },
    {
        label: "Cliente",
        value: (quotation: Quotation) => quotation.client.name,
        className: "capitalize",
    },
    {
        label: "Área del terreno",
        value: (quotation: Quotation) => `${quotation.landArea} m²`,
    },
    {
        label: "Plazo de Propuesta",
        value: (quotation: Quotation) => `${quotation.deliveryTime} meses`,
    },
    {
        label: "Fecha de Cotización",
        value: (quotation: Quotation) =>
            quotation.createdAt &&
            format(new Date(quotation.createdAt), "d 'de' MMMM 'del' yyyy", {
                locale: es,
            }),
    },
];

export default function HeadQuotationDescription({
    quotationById,
}: HeadQuotationDescriptionProps) {
    return (
        <div className="flex flex-col gap-4 p-4">
            {fields.map((field, index) => (
                <div key={index}>
                    <span className="font-medium">{field.label}:</span>{" "}
                    <span className={`font-light ${field.className || ""}`}>
                        {field.value(quotationById)}
                    </span>
                </div>
            ))}
        </div>
    );
}
