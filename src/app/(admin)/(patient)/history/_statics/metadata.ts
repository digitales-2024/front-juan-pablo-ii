import { PageMetadata } from "@/types/statics/pageMetadata";
import { FileText } from "lucide-react";

export const METADATA: PageMetadata = {
  title: "Historias Médicas",
  entityName: "Historia Médica",
  entityPluralName: "Historias Médicas",
  description: "Administra todas las historias médicas de tus pacientes.",
  Icon: FileText,
  dataDependencies: [
    /* 
    {
      dependencyName: "Pacientes",
      dependencyUrl: "/patient"
    },
    {
      dependencyName: "Doctores",
      dependencyUrl: "/doctor"
    } 
    */
  ]
} as const;