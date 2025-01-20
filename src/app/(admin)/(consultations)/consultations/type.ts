import { z } from "zod";

export const consultationsSchema = z.object({
	time: z.string().min(1, { message: "" }),
	date: z.date(),
});

export type ConsultationSchema = z.infer<typeof consultationsSchema>;
