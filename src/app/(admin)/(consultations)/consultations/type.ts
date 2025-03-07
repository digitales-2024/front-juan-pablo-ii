import { z } from "zod";
import { createAppointmentSchema } from "@/app/(admin)/(appointments)/appointments/_interfaces/appointments.interface";

export const consultationsSchema = createAppointmentSchema.extend({
	date: z.string().min(1, "La fecha es requerida"),
	time: z.string().min(1, "La hora es requerida"),
});

export type ConsultationSchema = z.infer<typeof consultationsSchema>;
