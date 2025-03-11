import { components } from "@/types/api";
import { z } from "zod";
import {
  BriefcaseMedical,
  HeartPulseIcon,
  LucideIcon,
  ScanHeartIcon,
} from "lucide-react";
export type UpdateAppointmentUserDto =
  components["schemas"]["UpdateAppointmentUserDto"];



export type AppointmentResponse = {
  id: string;
  staff: string;
  service: string;
  branch: string;
  patient: string;
  start: string;
  end: string;
  status: string;
  medicalHistoryId: string;
};

export const UpdateAppointmentUserDto = z.object({
  status: z.enum(["COMPLETED", "NO_SHOW"]),
});

export const updateAppointmentSchema = z.object({
  status: z.enum(["COMPLETED", "NO_SHOW"]),
}) satisfies z.ZodType<UpdateAppointmentUserDto>;

export type AppointmentStatus = "COMPLETED" | "NO_SHOW" | "CONFIRMED";
export type EnumConfig = {
  name: string;
  backgroundColor: string;
  textColor: string;
  hoverBgColor: string;
  hoverTextColor?: string;
  importantBgColor?: string;
  importantHoverBgColor?: string;
  importantTextColor?: string;
  importantHoverTextColor?: string;
  icon: LucideIcon;
};

export const orderTypeConfig: Record<AppointmentStatus, EnumConfig> = {
  CONFIRMED: {
    name: "Receta médica",
    backgroundColor: "bg-[#E0F7FA]",
    hoverBgColor: "hover:bg-[#B2EBF2]",
    textColor: "text-[#00796B]",
    icon: HeartPulseIcon,
  },
  COMPLETED: {
    name: "Receta médica",
    backgroundColor: "bg-[#E0F7FA]",
    hoverBgColor: "hover:bg-[#B2EBF2]",
    textColor: "text-[#00796B]",
    icon: ScanHeartIcon,
  },
  NO_SHOW: {
    name: "Receta médica",
    backgroundColor: "bg-[#E0F7FA]",
    hoverBgColor: "hover:bg-[#B2EBF2]",
    textColor: "text-[#00796B]",
    icon: BriefcaseMedical,
  },
};
