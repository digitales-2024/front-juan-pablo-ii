import { components } from "@/types/api";
import { z } from "zod";

export type UpdateAppointmentUserDto =
  components["schemas"]["UpdateAppointmentUserDto"];

export type AppointmentStatus = "COMPLETED" | "NO_SHOW";

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

