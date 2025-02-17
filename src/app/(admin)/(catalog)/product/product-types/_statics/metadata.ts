import { PageMetadata } from "@/types/statics/pageMetadata";
import { Box } from "lucide-react";

export const METADATA:PageMetadata = {
	title: "Subcategorías",
	entityName: "Subcategoría",
	entityPluralName: "Subcategorías",
	description: "Administra las subcategorías de tu catálogo de productos.",
    Icon: Box,
} as const;