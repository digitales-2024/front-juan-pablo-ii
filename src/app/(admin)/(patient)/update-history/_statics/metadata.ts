import { PageMetadata } from "@/types/statics/pageMetadata";
import { User } from "lucide-react";

export const METADATA: PageMetadata = {
  title: "Historia Clínica de Paciente",
  entityName: "medicalHistoryPatient",
  entityPluralName: "Patients",
  description: "Administra la historia clínica de un paciente específico del sistema.",
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