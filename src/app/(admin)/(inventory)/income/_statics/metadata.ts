import { PageMetadata } from "@/types/statics/pageMetadata";
import { PackagePlus } from "lucide-react";

export const METADATA:PageMetadata = {
	title: "Entradas",
	entityName: "Entrada",
	entityPluralName: "Entradas",
	description: "Gestiona las entradas a tu inventario de productos.",
    Icon: PackagePlus,
	dataDependencies: [
		{
			dependencyName: "Almacenes",
			dependencyUrl: "/storage/storages"
		},
		{
			dependencyName: "Productos",
			dependencyUrl: "/product/products"
		}
	]
} as const;