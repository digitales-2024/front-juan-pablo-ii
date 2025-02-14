import { PageMetadata } from "@/types/statics/pageMetadata";
import { PackageOpen } from "lucide-react";

export const METADATA:PageMetadata = {
	title: "Stock",
	entityName: "Stock",
	entityPluralName: "Stock",
	description: "Administra el stock de productos.",
    Icon: PackageOpen,
	dataDependencies: [
		{
			dependencyName: "Personal",
			dependencyUrl: "/staff"
		},
		{
			dependencyName: "Sucursales",
			dependencyUrl: "/branches"
		},
		{
			dependencyName: "Almacenamiento",
			dependencyUrl: "/storage/storages"
		}
	]
} as const;