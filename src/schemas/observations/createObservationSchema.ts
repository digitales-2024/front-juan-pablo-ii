import * as z from "zod";

export const observationSchema = z.object({
    projectCharterId: z.string({
        required_error: "El id de acta de proyecto es obligatorio",
    }),
    observation: z.string({
        required_error: "La observación es obligatoria",
    }),
    meetingDate: z
        .string({
            required_error: "La fecha de reunión es obligatoria",
        })
        .regex(/^\d{4}-\d{2}-\d{2}$/, {
            message: "La fecha de reunión es obligatoria",
        }),
});

export type CreateObservationSchema = z.infer<typeof observationSchema>;

export const updateObservationSchema = observationSchema.omit({
    projectCharterId: true,
});

export type UpdateObservationSchema = z.infer<typeof updateObservationSchema>;
