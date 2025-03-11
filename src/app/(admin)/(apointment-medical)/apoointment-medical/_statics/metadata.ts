import { PageMetadata } from "@/types/statics/pageMetadata";
import { User } from "lucide-react";

export const METADATA: PageMetadata = {
  title: "Citas medicas activas",
  entityName: "Paciente",
  entityPluralName: "Pacientes",
  description: "Administracion medica de todas las citas del sistema.",
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