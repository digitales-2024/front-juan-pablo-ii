import { PageMetadata } from "@/types/statics/pageMetadata";
import { FileText } from "lucide-react";

export const METADATA:PageMetadata = {
	title: "Órdenes",
	entityName: "Órden",
	entityPluralName: "Órdenes",
	description: "Gestiona las órdenes de tu negocio.",
    Icon: FileText,
} as const;