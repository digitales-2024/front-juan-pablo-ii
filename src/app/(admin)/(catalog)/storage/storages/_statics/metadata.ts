import { PageMetadata } from "@/types/statics/pageMetadata";
import { Warehouse } from "lucide-react";

export const METADATA:PageMetadata = {
	title: "Almacenes",
	entityName: "Almacén",
	entityPluralName: "Almacenes",
	description: "Administra tus almacénes por más que se encuentren en la misma ubicación.",
    Icon: Warehouse,
	dataDependencies: [
		{
			dependencyName: "Tipos de Almacén",
			dependencyUrl: "/storage/storage-types",
		}
	]
} as const;

// {
// 	title: "Almacenamiento",
// 	icon: Warehouse,
// 	items: [
// 	  {
// 		title: "Almacénes",
// 		url: "/storage/storages",
// 		icon: Warehouse,
// 	  },
// 	  {
// 		title: "Tipos de Almacén",
// 		url: "/storage/storage-types",
// 		icon: HousePlus,
// 	  },
// 	],
//   },