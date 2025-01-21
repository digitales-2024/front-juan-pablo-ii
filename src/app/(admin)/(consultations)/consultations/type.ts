import { z } from "zod";

export const consultationsSchema = z.object({
	time: z.string().min(1, { message: "" }),
	date: z.date(),
	serviceId: z.string().min(1, { message: "Debe seleccionar un servicio" }),
	patientId: z.string().min(1, { message: "Debe seleccionar un paciente" }),
	description: z.string().min(1, { message: "La descripción es requerida" }),
});

export type ConsultationSchema = z.infer<typeof consultationsSchema>;
