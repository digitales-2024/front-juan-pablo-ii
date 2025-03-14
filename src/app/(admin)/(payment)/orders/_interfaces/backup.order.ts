export type CreateMedicalAppointmentBillingDtoPrototype = components['schemas']['CreateMedicalAppointmentBillingDto'];
export type CreateMedicalAppointmentBillingDto = {
  appointmentId: string;
  paymentMethod: "CASH" | "BANK_TRANSFER" | "DIGITAL_WALLET";
  amountPaid?: number;
  currency: string;
  voucherNumber?: string;
  notes?: string;
  metadata?: Record<string, never>;

  export const createMedicalAppointmentBillingSchema = z.object({
    appointmentId: z.string({
      required_error: "Debe proporcionar el ID de la cita",
    }),
    paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "DIGITAL_WALLET"]),
    amountPaid: z.number().optional(),
    currency: z.string(),
    voucherNumber: z.string().optional(),
    notes: z.string().optional(),
    metadata: z.record(z.never()).optional(),
  }) satisfies z.ZodType<CreateMedicalAppointmentBillingDto>;
  