import { PageMetadata } from "@/types/statics/pageMetadata";
import { Box } from "lucide-react";

export const METADATA:PageMetadata = {
	title: "Productos",
	description: "Administra todos los productos de tu catálogo.",
    Icon: Box,
	dataDependencies: [
		{
			dependencyName: "Categorías",
			dependencyUrl: "/product/category"
		},
		{
			dependencyName: "Subcategorías",
			dependencyUrl: "/product/product-types"
		}
	]
} as const;