import { PageMetadata } from "@/types/statics/pageMetadata";
import { User } from "lucide-react";

export const METADATA: PageMetadata = {
  title: "Historia Medica de Paciente",
  entityName: "medicalHistoryPatient",
  entityPluralName: "Patients",
  description: "Administra una paciente especifico del sistema.",
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