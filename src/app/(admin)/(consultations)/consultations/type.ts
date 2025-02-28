import { z } from "zod";

export const consultationsSchema = z.object({
	time: z.string().min(1, { message: "" }),
	date: z.date(),
	serviceId: z.string().min(1, { message: "Debe seleccionar un servicio" }),
	branchId: z.string().min(1, { message: "Debe seleccionar una sucursal" }),
	description: z.string().min(1, { message: "La descripción es requerida" }),
	staffId: z.string().min(1, { message: "Debe seleccionar un médico" }),
	patientId: z.string().min(1, { message: "Debe seleccionar un paciente" }),

});

export type ConsultationSchema = z.infer<typeof consultationsSchema>;
