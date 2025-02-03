import { PageMetadata } from "@/types/statics/pageMetadata";
import { PackagePlus } from "lucide-react";

export const METADATA:PageMetadata = {
	title: "Entradas",
	description: "Gestiona las entradas a tu inventario de productos.",
    Icon: PackagePlus,
	dataDependencies: [
		{
			dependencyName: "Almacenes",
			dependencyUrl: "/product/category"
		}
	]
} as const;