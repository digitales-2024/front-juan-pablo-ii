import { PageMetadata } from "@/types/statics/pageMetadata";
import { HousePlus } from "lucide-react";

export const METADATA:PageMetadata = {
	title: "Tipos de almacénes",
	description: "Administra los tipos de almacén que tienes en tu empresa. Como Farmacia, Material Médico, Equipamiento, Material de Laboratorio, Suministros de Esterilización, Ropa e Indumentaria Médica, Almacén de Insumos Administrativos, etc.",
    Icon: HousePlus,
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