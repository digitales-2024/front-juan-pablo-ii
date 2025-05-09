import { PageMetadata } from "@/types/statics/pageMetadata";
import { List } from "lucide-react";

export const METADATA: PageMetadata = {
    title: "Categorías",
    entityName: "Categoría",
    entityPluralName: "Categorías",
    description: "Administra las categorías de tu catálogo de productos.",
    Icon: List,
} as const;