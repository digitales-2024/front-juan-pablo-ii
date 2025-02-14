import { PageMetadata } from "@/types/statics/pageMetadata";
import { PackageMinus } from "lucide-react";

export const METADATA:PageMetadata = {
	title: "Salidas",
	description: "Administra todos las salidas de productos.",
	entityName: "Salida",
	entityPluralName: "Salidas",
    Icon: PackageMinus,
	dataDependencies: [
		{
			dependencyName: "Almacenes",
			dependencyUrl: "/storage/storages"
		}
	]
} as const;