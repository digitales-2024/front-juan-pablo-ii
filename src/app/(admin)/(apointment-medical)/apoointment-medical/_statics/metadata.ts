import { PageMetadata } from "@/types/statics/pageMetadata";
import { User } from "lucide-react";

export const METADATA: PageMetadata = {
  title: "Pacientes",
  entityName: "Paciente",
  entityPluralName: "Pacientes",
  description: "Administra todos los pacientes de tu sistema.",
  Icon: User,
  /* dataDependencies: [
    {
      dependencyName: "Paciente",
      dependencyUrl: "/patient/patient"
    },
    {
      dependencyName: "Subcategorías",
      dependencyUrl: "/product/product-types"
    }
  ] */
} as const;