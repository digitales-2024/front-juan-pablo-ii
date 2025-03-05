import { PageMetadata } from "@/types/statics/pageMetadata";
import { Pill } from "lucide-react";

// FileText
// DollarSign
export const METADATA:PageMetadata = {
	title: "Recetas Médicas",
	entityName: "Receta",
	entityPluralName: "Recetas",
	description: "Gestiona las recetas de tu negocio. También puedes generar ordenes directas a partir de tus recetas.",
    Icon: Pill,
	// dataDependencies: [
	// 	{
	// 		dependencyName: "Tipos de Almacén",
	// 		dependencyUrl: "/storage/storage-types",
	// 	},
	// ]
} as const;