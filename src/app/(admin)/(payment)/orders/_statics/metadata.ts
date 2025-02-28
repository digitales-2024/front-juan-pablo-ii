import { PageMetadata } from "@/types/statics/pageMetadata";
import { FileText } from "lucide-react";

// FileText
// DollarSign
export const METADATA:PageMetadata = {
	title: "Órdenes",
	entityName: "Órden",
	entityPluralName: "Órdenes",
	description: "Gestiona las órdenes de tu negocio.",
    Icon: FileText,
	// dataDependencies: [
	// 	{
	// 		dependencyName: "Tipos de Almacén",
	// 		dependencyUrl: "/storage/storage-types",
	// 	},
	// ]
} as const;