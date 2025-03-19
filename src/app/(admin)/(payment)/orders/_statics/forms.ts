import { FormStatics } from "@/types/statics/forms";
import { CancelPaymentInput, CreateOrderInput, ProcessPaymentInput, RefundPaymentInput, RejectPaymentInput, UpdateOrderInput, VerifyPaymentInput, } from "../_interfaces/order.interface";

export const FORMSTATICS: FormStatics<CreateOrderInput> = {
    code: {
        required: false,
        label: "Código",
        defaultValue: "",
        type: "text",
        placeholder: "Código de la orden",
        name: "code",
    },
    type: {
        required: true,
        label: "Tipo",
        defaultValue: "",
        type: "text",
        placeholder: "Tipo de orden",
        name: "type",
    },
    movementTypeId: {
        required: true,
        label: "Tipo de movimiento",
        defaultValue: "",
        type: "text",
        placeholder: "Tipo de movimiento",
        name: "movementTypeId",
    },
    referenceId: {
        required: true,
        label: "Referencia",
        defaultValue: "",
        type: "text",
        placeholder: "Referencia de la orden",
        name: "referenceId",
    },
    sourceId: {
        required: false,
        label: "Almacén de origen",
        defaultValue: "",
        type: "text",
        placeholder: "Almacén de origen",
        name: "sourceId",
    },
    targetId: {
        required: false,
        label: "Almacén de destino",
        defaultValue: "",
        type: "text",
        placeholder: "Almacén de destino",
        name: "targetId",
    },
    status: {
        required: true,
        label: "Estado",
        defaultValue: "",
        type: "text",
        placeholder: "Estado de la orden",
        name: "status",
    },
    currency: {
        required: true,
        label: "Moneda",
        defaultValue: "",
        type: "text",
        placeholder: "Moneda de la orden",
        name: "currency",
    },
    subtotal: {
        required: true,
        label: "Subtotal",
        defaultValue: "",
        type: "text",
        placeholder: "Subtotal de la orden",
        name: "subtotal",
    },
    tax: {
        required: true,
        label: "Impuesto",
        defaultValue: "",
        type: "text",
        placeholder: "Impuesto de la orden",
        name: "tax",
    },
    total: {
        required: true,
        label: "Total",
        defaultValue: "",
        type: "text",
        placeholder: "Total de la orden",
        name: "total",
    },
    notes: {
        required: false,
        label: "Notas",
        defaultValue: "",
        type: "text",
        placeholder: "Notas de la orden",
        name: "notes",
    },
    metadata: {
        required: false,
        label: "Metadatos",
        defaultValue: "",
        type: "text",
        placeholder: "Metadatos de la orden",
        name: "metadata",
    },
}

// export const updateOrderSchema = z.object({
//     code: z.string().optional(),
//     type: z.enum(["MEDICAL_PRESCRIPTION_ORDER", "MEDICAL_CONSULTATION_ORDER", "PRODUCT_SALE_ORDER", "PRODUCT_PURCHASE_ORDER"]).optional(),
//     movementTypeId: z.string().optional(),
//     referenceId: z.string().optional(),
//     sourceId: z.string().optional(),
//     targetId: z.string().optional(),
//     status: z.enum(["DRAFT", "PENDING", "PROCESSING", "COMPLETED", "CANCELLED", "REFUNDED", "REQUIRES_ATTENTION"]).optional(),
//     currency: z.string().optional(),
//     subtotal: z.number().optional(),
//     tax: z.number().optional(),
//     total: z.number().optional(),
//     notes: z.string().optional(),
//     metadata: z.record(z.never()).optional(),
//   }) satisfies z.ZodType<UpdateOrderDto>;

export const UPDATEFORMSTATICS: FormStatics<UpdateOrderInput> = {
    code: {
        required: false,
        label: "Código",
        defaultValue: "",
        type: "text",
        placeholder: "Código de la orden",
        name: "code",
    },
    type: {
        required: false,
        label: "Tipo",
        defaultValue: "",
        type: "text",
        placeholder: "Tipo de orden",
        name: "type",
    },
    movementTypeId: {
        required: false,
        label: "Tipo de movimiento",
        defaultValue: "",
        type: "text",
        placeholder: "Tipo de movimiento",
        name: "movementTypeId",
    },
    referenceId: {
        required: false,
        label: "Referencia",
        defaultValue: "",
        type: "text",
        placeholder: "Referencia de la orden",
        name: "referenceId",
    },
    sourceId: {
        required: false,
        label: "Almacén de origen",
        defaultValue: "",
        type: "text",
        placeholder: "Almacén de origen",
        name: "sourceId",
    },
    targetId: {
        required: false,
        label: "Almacén de destino",
        defaultValue: "",
        type: "text",
        placeholder: "Almacén de destino",
        name: "targetId",
    },
    status: {
        required: false,
        label: "Estado",
        defaultValue: "",
        type: "text",
        placeholder: "Estado de la orden",
        name: "status",
    },
    currency: {
        required: false,
        label: "Moneda",
        defaultValue: "",
        type: "text",
        placeholder: "Moneda de la orden",
        name: "currency",
    },
    subtotal: {
        required: false,
        label: "Subtotal",
        defaultValue: "",
        type: "text",
        placeholder: "Subtotal de la orden",
        name: "subtotal",
    },
    tax: {
        required: false,
        label: "Impuesto",
        defaultValue: "",
        type: "text",
        placeholder: "Impuesto de la orden",
        name: "tax",
    },
    total: {
        required: false,
        label: "Total",
        defaultValue: "",
        type: "text",
        placeholder: "Total de la orden",
        name: "total",
    },
    notes: {
        required: false,
        label: "Notas",
        defaultValue: "",
        type: "text",
        placeholder: "Notas de la orden",
        name: "notes",
    },
    metadata: {
        required: false,
        label: "Metadatos",
        defaultValue: "",
        type: "text",
        placeholder: "Metadatos de la orden",
        name: "metadata",
    },
}

// type ProcessPaymentInput = {
//     date: string;
//     paymentMethod: "CASH" | "BANK_TRANSFER" | "YAPE";
//     amount: number;
//     voucherNumber?: string | undefined;
//     description?: string | undefined;
// }
export const PROCESS_PAYMENT_STATICS: FormStatics<ProcessPaymentInput> = {
    date: {
        required: true,
        label: "Fecha",
        defaultValue: undefined,
        type: "text",
        placeholder: "Fecha del pago",
        name: "date",
    },
    paymentMethod: {
        required: true,
        label: "Método de pago",
        defaultValue: 'CASH',
        type: "text",
        placeholder: "Método de pago",
        name: "paymentMethod",
    },
    amount: {
        required: true,
        label: "Monto",
        defaultValue: undefined,
        type: "text",
        placeholder: "Monto del pago",
        name: "amount",
    },
    voucherNumber: {
        required: false,
        label: "Número de voucher",
        defaultValue: undefined,
        type: "text",
        placeholder: "Número de voucher",
        name: "voucherNumber",
    },
    description: {
        required: false,
        label: "Descripción",
        defaultValue: undefined,
        type: "text",
        placeholder: "Descripción del pago",
        name: "description",
    },
}

// type VerifyPaymentInput = {
//     verificationNotes?: string | undefined;
//     verifiedAt?: string | undefined;
// }
export const VERIFY_PAYMENT_STATICS: FormStatics<VerifyPaymentInput> = {
    verificationNotes: {
        required: false,
        label: "Notas de verificación",
        defaultValue: undefined,
        type: "text",
        placeholder: "Notas de verificación",
        name: "verificationNotes",
    },
    verifiedAt: {
        required: false,
        label: "Fecha de verificación",
        defaultValue: undefined,
        type: "text",
        placeholder: "Fecha de verificación",
        name: "verifiedAt",
    },
}

// type CancelPaymentInput = {
//     cancellationReason: string;
// }
export const CANCEL_PAYMENT_STATICS: FormStatics<CancelPaymentInput> = {
    cancellationReason: {
        required: true,
        label: "Motivo de cancelación",
        defaultValue: undefined,
        type: "text",
        placeholder: "Motivo de cancelación",
        name: "cancellationReason",
    },
}

// type RejectPaymentInput = {
//     rejectionReason: string;
// }
export const REJECT_PAYMENT_STATICS: FormStatics<RejectPaymentInput> = {
    rejectionReason: {
        required: true,
        label: "Motivo de rechazo",
        defaultValue: undefined,
        type: "text",
        placeholder: "Motivo de rechazo",
        name: "rejectionReason",
    },
}

// type RefundPaymentInput = {
//     amount: number;
//     reason: string;
//     refundMethod: "CASH" | "BANK_TRANSFER" | "YAPE";
//     notes?: string | undefined;
// }
export const REFUND_PAYMENT_STATICS: FormStatics<RefundPaymentInput> = {
    amount: {
        required: true,
        label: "Monto",
        defaultValue: undefined,
        type: "text",
        placeholder: "Monto de la devolución",
        name: "amount",
    },
    reason: {
        required: true,
        label: "Motivo de la devolución",
        defaultValue: undefined,
        type: "text",
        placeholder: "Motivo de la devolución",
        name: "reason",
    },
    refundMethod: {
        required: true,
        label: "Método de devolución",
        defaultValue: 'BANK_TRANSFER',
        type: "text",
        placeholder: "Método de devolución",
        name: "refundMethod",
    },
    notes: {
        required: false,
        label: "Notas",
        defaultValue: undefined,
        type: "text",
        placeholder: "Notas de la devolución",
        name: "notes",
    },
}