import { PageMetadata } from "@/types/statics/pageMetadata";
import { HandCoins } from "lucide-react";

// FileText
// DollarSign
export const METADATA: PageMetadata = {
	title: "Venta de Productos",
	entityName: "Venta",
	entityPluralName: "Ventas",
	description: "Gestiona las ventas de productos de tu negocio. Registra transacciones y lleva un control de tus ingresos.",
	Icon: HandCoins,
	// dataDependencies: [
	//   {
	//     dependencyName: "Productos",
	//     dependencyUrl: "/products",
	//   },
	// ]
} as const;