import { components } from "@/types/api";
import { Archive, ArrowDownToDot, ArrowUpFromDot, Banknote, CircleX, Divide, DollarSign, Gift, Hourglass, LucideIcon, NotebookPen, PartyPopper, Pill, RefreshCcwDot, RotateCcw, Sliders, Smartphone, StepForward, Stethoscope, TriangleAlert, Undo2, Wallet } from "lucide-react";
import { z } from "zod";

// Tipos base de la API
// Order: {
//   id: string;
//   code?: string;
//   type: "MEDICAL_PRESCRIPTION_ORDER" | "MEDICAL_CONSULTATION_ORDER" | "PRODUCT_SALE_ORDER" | "PRODUCT_PURCHASE_ORDER";
//   movementTypeId: string;
//   referenceId: string;
//   sourceId?: string;
//   targetId?: string;
//   status: "DRAFT" | "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED" | "REFUNDED" | "REQUIRES_ATTENTION";
//   currency: string;
//   subtotal: number;
//   tax: number;
//   total: number;
//   date: string;
//   notes?: string;
//   metadata?: Record<string, never>;
// };

export type Order = components['schemas']['Order'];
export type DetailedOrderPrototype = components['schemas']['DetailedOrder'];
export type OrderType = components['schemas']['OrderType'];
export type OrderStatus = components['schemas']['OrderStatus'];

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
}

export type EnumOptions<T> = {
  label: string
  value: T
}

export const orderTypeConfig: Record<OrderType, EnumConfig> = {
  MEDICAL_PRESCRIPTION_ORDER: {
    name: "Receta médica",
    backgroundColor: "bg-[#E0F7FA]",
    hoverBgColor: "hover:bg-[#B2EBF2]",
    textColor: "text-[#00796B]",
    icon: Pill,
  },
  MEDICAL_APPOINTMENT_ORDER: {
    name: "Cita médica",
    backgroundColor: "bg-[#E8F5E9]",
    hoverBgColor: "hover:bg-[#C8E6C9]",
    textColor: "text-[#388E3C]",
    icon: Stethoscope,
  },
  PRODUCT_SALE_ORDER: {
    name: "Venta de productos",
    backgroundColor: "bg-[#FFF3E0]",
    hoverBgColor: "hover:bg-[#FFE0B2]",
    textColor: "text-[#F57C00]",
    icon: ArrowUpFromDot,
  },
  PRODUCT_PURCHASE_ORDER: {
    name: "Compra de productos",
    backgroundColor: "bg-[#E3F2FD]",
    hoverBgColor: "hover:bg-[#BBDEFB]",
    textColor: "text-[#1976D2]",
    icon: ArrowDownToDot,
  },
}
export const orderTypeEnumOptions: EnumOptions<OrderType>[] = [
  {
    label: "Receta médica",
    value: "MEDICAL_PRESCRIPTION_ORDER"
  },
  {
    label: "Cita médica",
    value: "MEDICAL_APPOINTMENT_ORDER"
  },
  {
    label: "Venta de productos",
    value: "PRODUCT_SALE_ORDER",
  },
  {
    label: "Compra de productos",
    value: "PRODUCT_PURCHASE_ORDER"
  }
]

export const orderStatusConfig: Record<OrderStatus, EnumConfig> = {
  DRAFT: {
    name: "Borrador",
    backgroundColor: "bg-[#F5F5F5]",
    hoverBgColor: "hover:bg-[#E0E0E0]",
    textColor: "text-[#757575]",
    icon: NotebookPen,
  },
  PENDING: {
    name: "No completado",
    backgroundColor: "bg-[#FFF8E1]",
    hoverBgColor: "hover:bg-[#FFECB3]",
    textColor: "text-[#FFA000]",
    icon: Hourglass,
  },
  PROCESSING: {
    name: "En proceso",
    backgroundColor: "bg-[#E0F2F1]",
    hoverBgColor: "hover:bg-[#B2DFDB]",
    textColor: "text-[#00796B]",
    icon: RefreshCcwDot,
  },
  COMPLETED: {
    name: "Completado",
    backgroundColor: "bg-[#E8F5E9]",
    hoverBgColor: "hover:bg-[#C8E6C9]",
    textColor: "text-[#388E3C]",
    icon: PartyPopper,
  },
  CANCELLED: {
    name: "Cancelado",
    backgroundColor: "bg-[#FFEBEE]",
    hoverBgColor: "hover:bg-[#FFCDD2]",
    textColor: "text-[#D32F2F]",
    icon: CircleX,
  },
  REFUNDED: {
    name: "Reembolsado",
    backgroundColor: "bg-[#F3E5F5]",
    hoverBgColor: "hover:bg-[#CE93D8]",
    textColor: "text-[#8E24AA]",
    icon: Undo2,
  },
  REQUIRES_ATTENTION: {
    name: "Requiere atención",
    backgroundColor: "bg-[#FFF3E0]",
    hoverBgColor: "hover:bg-[#FFE0B2]",
    textColor: "text-[#F57C00]",
    icon: TriangleAlert,
  },
}

export const orderStatusEnumOptions: EnumOptions<OrderStatus>[] = [
  {
    label: "Borrador",
    value: "DRAFT"
  },
  {
    label: "No completado",
    value: "PENDING"
  },
  {
    label: "En proceso",
    value: "PROCESSING"
  },
  {
    label: "Completado",
    value: "COMPLETED"
  },
  {
    label: "Cancelado",
    value: "CANCELLED"
  },
  {
    label: "Reembolsado",
    value: "REFUNDED"
  },
  {
    label: "Requiere atención",
    value: "REQUIRES_ATTENTION"
  }
];

export type CreateOrderDto = components['schemas']['CreateOrderDto'];
export type UpdateOrderDto = components['schemas']['UpdateOrderDto'];
export type DeleteOrdersDto = components['schemas']['DeleteOrdersDto'];
export type SubmitDraftOrderDto = components['schemas']['SubmitDraftOrderDto'];
// Podemos usar el mismo DTO que delete ya que la estructura es idéntica
export type ReactivateOrderDto = DeleteOrdersDto;

// Interfaz para la tabla extendiendo el tipo base
export interface StorageTableItem extends Order {
  selected?: boolean;
}

// CreateOrderDto: {
//   code?: string;
//   type: "MEDICAL_PRESCRIPTION_ORDER" | "MEDICAL_CONSULTATION_ORDER" | "PRODUCT_SALE_ORDER" | "PRODUCT_PURCHASE_ORDER";
//   movementTypeId: string;
//   referenceId: string;
//   sourceId?: string;
//   targetId?: string;
//   status: "DRAFT" | "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED" | "REFUNDED" | "REQUIRES_ATTENTION";
//   currency: string;
//   subtotal: number;
//   tax: number;
//   total: number;
//   notes?: string;
//   metadata?: Record<string, never>;
// };
// Schema de validación para crear/actualizar
export const createOrderSchema = z.object({
  code: z.string().optional(),
  type: z.enum(["MEDICAL_PRESCRIPTION_ORDER", "MEDICAL_APPOINTMENT_ORDER", "PRODUCT_SALE_ORDER", "PRODUCT_PURCHASE_ORDER"]),
  movementTypeId: z.string(),
  referenceId: z.string(),
  sourceId: z.string().optional(), //Es la referencia al storage
  targetId: z.string().optional(),
  status: z.enum(["DRAFT", "PENDING", "PROCESSING", "COMPLETED", "CANCELLED", "REFUNDED", "REQUIRES_ATTENTION"]),
  currency: z.string(),
  subtotal: z.number(),
  tax: z.number(),
  total: z.number(),
  notes: z.string().optional(),
  metadata: z.record(z.never()).optional(),
}) satisfies z.ZodType<CreateOrderDto>;

// UpdateOrderDto: {
//   code?: string;
//   type?: "MEDICAL_PRESCRIPTION_ORDER" | "MEDICAL_CONSULTATION_ORDER" | "PRODUCT_SALE_ORDER" | "PRODUCT_PURCHASE_ORDER";
//   movementTypeId?: string;
//   referenceId?: string;
//   sourceId?: string;
//   targetId?: string;
//   status?: "DRAFT" | "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED" | "REFUNDED" | "REQUIRES_ATTENTION";
//   currency?: string;
//   subtotal?: number;
//   tax?: number;
//   total?: number;
//   notes?: string;
//   metadata?: Record<string, never>;
// };
export const updateOrderSchema = z.object({
  code: z.string().optional(),
  type: z.enum(["MEDICAL_PRESCRIPTION_ORDER", "MEDICAL_APPOINTMENT_ORDER", "PRODUCT_SALE_ORDER", "PRODUCT_PURCHASE_ORDER"]).optional(),
  movementTypeId: z.string().optional(),
  referenceId: z.string().optional(),
  sourceId: z.string().optional(),
  targetId: z.string().optional(),
  status: z.enum(["DRAFT", "PENDING", "PROCESSING", "COMPLETED", "CANCELLED", "REFUNDED", "REQUIRES_ATTENTION"]).optional(),
  currency: z.string().optional(),
  subtotal: z.number().optional(),
  tax: z.number().optional(),
  total: z.number().optional(),
  notes: z.string().optional(),
  metadata: z.record(z.never()).optional(),
}) satisfies z.ZodType<UpdateOrderDto>;

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;

// CreatePaymentDto: {
//   orderId: string;
//   date?: string;
//   status?: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED" | "REFUNDED";
//   type: "REGULAR" | "REFUND" | "PARTIAL" | "ADJUSTMENT" | "COMPENSATION";
//   amount: number;
//   description?: string;
//   paymentMethod?: "CASH" | "BANK_TRANSFER" | "YAPE";
//   voucherNumber?: string;
//   originalPaymentId?: string;
// };
// Payment: {
//   id: string;
//   orderId: string;
//   date: string;
//   status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED" | "REFUNDED";
//   type: "REGULAR" | "REFUND" | "PARTIAL" | "ADJUSTMENT" | "COMPENSATION";
//   amount: number;
//   description?: string;
//   paymentMethod: "CASH" | "BANK_TRANSFER" | "YAPE";
//   voucherNumber?: string;
//   originalPaymentId?: string;
//   verifiedBy?: string;
//   verifiedAt?: string;
//   isActive: boolean;
//   createdAt: string;
//   updatedAt: string;
// };
// UpdatePaymentDto: {
//   orderId?: string;
//   date?: string;
//   status?: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED" | "REFUNDED";
//   type?: "REGULAR" | "REFUND" | "PARTIAL" | "ADJUSTMENT" | "COMPENSATION";
//   amount?: number;
//   description?: string;
//   paymentMethod?: "CASH" | "BANK_TRANSFER" | "YAPE";
//   voucherNumber?: string;
//   originalPaymentId?: string;
// };
export type PaymentStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED" | "REFUNDED";
export type PaymentType = "REGULAR" | "REFUND" | "PARTIAL" | "ADJUSTMENT" | "COMPENSATION";
export type PaymentMethod = "CASH" | "BANK_TRANSFER" | "DIGITAL_WALLET";
export type PaymentPrototype = components['schemas']['Payment'];
export type Payment = {
  id: string;
  orderId: string;
  date: string;
  status: PaymentStatus;
  type: PaymentType;
  amount: number;
  description?: string;
  paymentMethod: PaymentMethod;
  voucherNumber?: string;
  originalPaymentId?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
export type DetailedOrder = {
  id: string;
  code?: string;
  type: OrderType;
  movementTypeId: string;
  referenceId: string;
  sourceId?: string;
  targetId?: string;
  status: OrderStatus
  currency: string;
  subtotal: number;
  tax: number;
  total: number;
  date: string;
  notes?: string;
  isActive: boolean;
  metadata?: Record<string, never>;
  payments: Payment[];
}


export const paymentStatusConfig: Record<PaymentStatus, EnumConfig> = {
  PENDING: {
    name: "No pagado",
    backgroundColor: "bg-[#FFF8E1]",
    hoverBgColor: "hover:bg-[#FFECB3]",
    textColor: "text-[#FFA000]",
    icon: Hourglass,
  },
  PROCESSING: {
    name: "Pagando",
    backgroundColor: "bg-[#E0F2F1]",
    hoverBgColor: "hover:bg-[#B2DFDB]",
    textColor: "text-[#00796B]",
    icon: RefreshCcwDot,
  },
  COMPLETED: {
    name: "Pagado",
    backgroundColor: "bg-[#E8F5E9]",
    hoverBgColor: "hover:bg-[#C8E6C9]",
    textColor: "text-[#388E3C]",
    icon: PartyPopper,
  },
  CANCELLED: {
    name: "Cancelado",
    backgroundColor: "bg-[#FFEBEE]",
    hoverBgColor: "hover:bg-[#FFCDD2]",
    textColor: "text-[#D32F2F]",
    icon: CircleX,
  },
  REFUNDED: {
    name: "Reembolsado",
    backgroundColor: "bg-[#F3E5F5]",
    hoverBgColor: "hover:bg-[#CE93D8]",
    textColor: "text-[#8E24AA]",
    icon: Undo2,
  }
};
export const PaymentTypeConfig: Record<PaymentType, EnumConfig> = {
  REGULAR: {
    name: "Regular",
    backgroundColor: "bg-[#E3F2FD]",
    hoverBgColor: "hover:bg-[#BBDEFB]",
    textColor: "text-[#1976D2]",
    icon: DollarSign,
  },
  REFUND: {
    name: "Reembolso",
    backgroundColor: "bg-[#F3E5F5]",
    hoverBgColor: "hover:bg-[#E1BEE7]",
    textColor: "text-[#8E24AA]",
    icon: RotateCcw,
  },
  PARTIAL: {
    name: "Parcial",
    backgroundColor: "bg-[#FFF8E1]",
    hoverBgColor: "hover:bg-[#FFECB3]",
    textColor: "text-[#FFA000]",
    icon: Divide,
  },
  ADJUSTMENT: {
    name: "Ajuste",
    backgroundColor: "bg-[#E0F2F1]",
    hoverBgColor: "hover:bg-[#B2DFDB]",
    textColor: "text-[#00796B]",
    icon: Sliders,
  },
  COMPENSATION: {
    name: "Compensación",
    backgroundColor: "bg-[#FFF3E0]",
    hoverBgColor: "hover:bg-[#FFE0B2]",
    textColor: "text-[#F57C00]",
    icon: Gift,
  },
};

export const paymentMethodConfig: Record<PaymentMethod, EnumConfig> = {
  CASH: {
    name: "Efectivo",
    backgroundColor: "bg-[#E8F5E9]",
    hoverBgColor: "hover:bg-[#C8E6C9]",
    textColor: "text-[#388E3C]",
    icon: Wallet,
  },
  BANK_TRANSFER: {
    name: "Transferencia bancaria",
    backgroundColor: "bg-[#E3F2FD]",
    hoverBgColor: "hover:bg-[#BBDEFB]",
    textColor: "text-[#1976D2]",
    icon: Banknote,
  },
  DIGITAL_WALLET: {
    name: "Billetera digital",
    backgroundColor: "bg-[#F3E5F5]",
    hoverBgColor: "hover:bg-[#E1BEE7]",
    textColor: "text-[#8E24AA]",
    icon: Smartphone,
  },
};

export type PaymentOptions = 'CANCEL' | 'PROCESS' | 'VERIFY' | 'REJECT' | 'REFUND' | 'CLOSE' | 'RESTORE';
export const paymentOptionButtons: Record<PaymentOptions, EnumConfig> = {
  CANCEL: {
    name: "Cancelar",
    backgroundColor: "bg-[#FFEBEE]",
    hoverBgColor: "hover:bg-[#FFCDD2]",
    textColor: "text-[#D32F2F]",
    icon: CircleX,
  },
  PROCESS: {
    name: "Procesar",
    backgroundColor: "bg-[#E0F2F1]",
    hoverBgColor: "hover:bg-[#B2DFDB]",
    textColor: "text-[#00796B]",
    icon: StepForward,
  },
  VERIFY: {
    name: "Verificar",
    backgroundColor: "bg-[#E8F5E9]",
    hoverBgColor: "hover:bg-[#C8E6C9]",
    textColor: "text-[#388E3C]",
    icon: PartyPopper,
  },
  REJECT: {
    name: "Rechazar",
    backgroundColor: "bg-[#FFEBEE]",
    hoverBgColor: "hover:bg-[#FFCDD2]",
    textColor: "text-[#D32F2F]",
    icon: CircleX,
  },
  REFUND: {
    name: "Reembolsar",
    backgroundColor: "bg-[#F3E5F5]",
    hoverBgColor: "hover:bg-[#CE93D8]",
    textColor: "text-[#8E24AA]",
    icon: Undo2,
  },
  CLOSE: {
    name: "Archivar",
    backgroundColor: "bg-[#FFF3E0]",
    hoverBgColor: "hover:bg-[#FFE0B2]",
    textColor: "text-[#F57C00]",
    icon: Archive,
  },
  RESTORE: {
    name: "Restaurar",
    backgroundColor: "bg-[#FFF8E1]",
    hoverBgColor: "hover:bg-[#FFECB3]",
    textColor: "text-[#FFA000]",
    icon: NotebookPen,
  }
}

export type CreatePaymentDto = components['schemas']['CreatePaymentDto'];
export type UpdatePaymentDto = components['schemas']['UpdatePaymentDto'];
export type DeletePaymentsDto = components['schemas']['DeletePaymentsDto'];
// CancelPaymentDto : {
//   cancellationReason: string;
// }
export type CancelPaymentDto = components['schemas']['CancelPaymentDto'];
// ProcessPaymentDto: {
//   paymentMethod: "CASH" | "BANK_TRANSFER" | "YAPE";
//   amount: number;
//   voucherNumber?: string;
//   date: string;
//   description?: string;
// }
export type ProcessPaymentDto = components['schemas']['ProcessPaymentDto'];
// VerifyPaymentDto: {
//   verificationNotes?: string;
//   verifiedAt?: string;
// }
export type VerifyPaymentDto = components['schemas']['VerifyPaymentDto'];
// RejectPaymentDto: {
//   rejectionReason: string;
// }
export type RejectPaymentDto = components['schemas']['RejectPaymentDto'];
// RefundPaymentDto: {
//   amount: number;
//   reason: string;
//   refundMethod: "CASH" | "BANK_TRANSFER" | "YAPE";
//   notes?: string;
// }
export type RefundPaymentDto = components['schemas']['RefundPaymentDto'];
export type ReactivatePaymentsDto = DeletePaymentsDto;

export const createPaymentSchema = z.object({
  orderId: z.string(),
  date: z.string().optional(),
  status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "CANCELLED", "REFUNDED"]).optional(),
  type: z.enum(["REGULAR", "REFUND", "PARTIAL", "ADJUSTMENT", "COMPENSATION"]),
  amount: z.coerce.number(),
  description: z.string().optional(),
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "DIGITAL_WALLET"]).optional(),
  voucherNumber: z.string().optional(),
  originalPaymentId: z.string().optional(),
}) satisfies z.ZodType<CreatePaymentDto>;

export const updatePaymentSchema = z.object({
  orderId: z.string().optional(),
  date: z.string().optional(),
  status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "CANCELLED", "REFUNDED"]).optional(),
  type: z.enum(["REGULAR", "REFUND", "PARTIAL", "ADJUSTMENT", "COMPENSATION"]).optional(),
  amount: z.coerce.number().optional(),
  description: z.string().optional(),
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "DIGITAL_WALLET"]).optional(),
  voucherNumber: z.string().optional(),
  originalPaymentId: z.string().optional(),
}) satisfies z.ZodType<UpdatePaymentDto>;

export const cancelPaymentSchema = z.object({
  cancellationReason: z.string(),
}) satisfies z.ZodType<CancelPaymentDto>;

export const processPaymentSchema = z.object({
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "DIGITAL_WALLET"]),
  amount: z.coerce.number(),
  voucherNumber: z.string().optional(),
  date: z.string().min(1, "La fecha es requerida").refine((val) => !isNaN(Date.parse(val)), {
    message: "La fecha debe ser una cadena de fecha válida ISO 8601",
  }),
  description: z.string().optional(),
}) satisfies z.ZodType<ProcessPaymentDto>;

export const verifyPaymentSchema = z.object({
  verificationNotes: z.string().optional(),
  verifiedAt: z.string(),
}) satisfies z.ZodType<VerifyPaymentDto>;

export const rejectPaymentSchema = z.object({
  rejectionReason: z.string(),
}) satisfies z.ZodType<RejectPaymentDto>;

export const refundPaymentSchema = z.object({
  amount: z.coerce.number(),
  reason: z.string(),
  refundMethod: z.enum(["CASH", "BANK_TRANSFER", "DIGITAL_WALLET"]),
  notes: z.string().optional(),
}) satisfies z.ZodType<RefundPaymentDto>;

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
export type CancelPaymentInput = z.infer<typeof cancelPaymentSchema>;
export type ProcessPaymentInput = z.infer<typeof processPaymentSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
export type RejectPaymentInput = z.infer<typeof rejectPaymentSchema>;
export type RefundPaymentInput = z.infer<typeof refundPaymentSchema>;

export type ProductSaleItemDtoPrototype = components['schemas']['ProductSaleItemDto'];
export type ProductSaleItemDto = {
  productId: string;
  quantity: number;
  storageId: string;
};
export type CreateProductSaleBillingDtoPrototype = components['schemas']['CreateProductSaleBillingDto'];
export type CreateProductSaleBillingDto = {
  branchId: string;
  patientId: string;
  storageLocation?: string;
  batchNumber?: string;
  referenceId?: string;
  currency: string;
  paymentMethod: "CASH" | "BANK_TRANSFER" | "DIGITAL_WALLET";
  notes?: string;
  products: ProductSaleItemDto[];
  metadata?: Record<string, never>;
};
// export type ProductPurchaseItemDtoPrototype = components['schemas']['ProductPurchaseItemDto'];
export type ProductPurchaseItemDto = {
  productId: string;
  quantity: number;
  unitPrice: number;
};
// export type CreateProductPurchaseBillingDtoPrototype = components['schemas']['CreateProductPurchaseBillingDto'];
export type CreateProductPurchaseBillingDto = {
  products: ProductPurchaseItemDto[];
  storageId: string;
  supplierId: string;
  branchId: string;
  storageLocation?: string;
  batchNumber?: string;
  referenceId?: string;
  currency: string;
  paymentMethod: "CASH" | "BANK_TRANSFER" | "DIGITAL_WALLET";
  notes?: string;
  metadata?: Record<string, never>;
}

//Prototyping
// export type ServiceSaleItemDtoPrototype = components['schemas']['ServiceSaleItemDto'];
export type ServiceSaleItemDto = {
  serviceId: string;
  quantity: number;
};
export type ServiceSaleLocalItemDto = {
  serviceId: string;
  quantity: number;
  appointmentId?: string; //Artificial field
};
export type CreateServiceSaleBillingDtoPrototype =
  components["schemas"]["CreateMedicalPrescriptionBillingDto"];

// {
//   branchId: string;
//   patientId: string;
//   recipeId: string;
//   currency: string;
//   paymentMethod: "CASH" | "BANK_TRANSFER" | "DIGITAL_WALLET";
//   notes?: string;
//   amountPaid?: number; //NO deberia
//   voucherNumber?: string; //NO deberia
//   products: components["schemas"]["PrescriptionProductItemDto"][];
//   appointmentIds: string[];
//   metadata?: Record<string, never>;
// };
export type CreatePrescriptionBillingDto = {
  branchId: string;
  patientId: string;
  storageLocation?: string;
  batchNumber?: string;
  referenceId?: string;
  recipeId: string;
  currency: string;
  paymentMethod: "CASH" | "BANK_TRANSFER" | "DIGITAL_WALLET";
  notes?: string;
  products: ProductSaleItemDto[];
  appointmentIds: string[];
  metadata?: Record<string, never>;
};

export type CreatePrescriptionBillingLocalDto = {
  branchId: string;
  patientId: string;
  recipeId: string;
  currency: string;
  paymentMethod: "CASH" | "BANK_TRANSFER" | "DIGITAL_WALLET";
  notes?: string;
  products: ProductSaleItemDto[];
  services: ServiceSaleLocalItemDto[];
  metadata?: Record<string, never>;
};

export const paymentMethodOptions: EnumOptions<PaymentMethod>[] = [
  {
    label: "Efectivo",
    value: "CASH",
  },
  {
    label: "Transferencia Bancaria",
    value: "BANK_TRANSFER",
  },
  {
    label: "Billetera Digital",
    value: "DIGITAL_WALLET",
  }
];

export const createProductSaleBillingSchema = z.object({
  branchId: z.string({
    required_error: "Debe seleccionar la sucursal que genera la venta",
  }),
  patientId: z.string({
    required_error: "Debe seleccionar un paciente",
  }),
  storageLocation: z.string().optional(),
  batchNumber: z.string().optional(),
  referenceId: z.string().optional(),
  currency: z.string(),
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "DIGITAL_WALLET"]),
  notes: z.string().optional(),
  metadata: z.record(z.never()).optional(),
  products: z.array(z.object({
    productId: z.string(),
    quantity: z.coerce.number().min(1, { message: "La cantidad debe ser mayor a 0" }),
    storageId: z.string({
      required_error: "Debe seleccionar un almacén",
    }),
  })).min(1, { message: "Debe seleccionar al menos un producto" }),
}) satisfies z.ZodType<CreateProductSaleBillingDto>;

export const createPrescriptionBillingLocalSchema = z
  .object({
    branchId: z.string({
      required_error: "Debe seleccionar la sucursal que genera la venta",
    }),
    patientId: z.string({
      required_error: "Debe seleccionar un paciente",
    }),
    recipeId: z.string({
      required_error: "Debe seleccionar una receta",
    }),
    storageLocation: z.string().optional(),
    batchNumber: z.string().optional(),
    referenceId: z.string().optional(),
    currency: z.string(),
    paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "DIGITAL_WALLET"]),
    notes: z.string().optional(),
    metadata: z.record(z.never()).optional(),
    products: z.array(
      z.object({
        productId: z.string(),
        quantity: z.coerce
          .number()
          .min(1, { message: "La cantidad debe ser mayor a 0" }),
        storageId: z.string({
          required_error: "Debe seleccionar un almacén",
        }),
      })
    ),
    services: z.array(
      z.object({
        serviceId: z.string(),
        quantity: z.coerce
          .number()
          .min(1, { message: "La cantidad debe ser mayor a 0" }),
        appointmentId: z.string().optional(),
      })
    ),
  })
  .refine((data) => data.products.length > 0 || data.services.length > 0, {
    message: "Debe agregar al menos un producto o un servicio",
    path: ["products"],
  }) satisfies z.ZodType<CreatePrescriptionBillingLocalDto>;

export const createPrescriptionBillingSchema = z
  .object({
    branchId: z.string({
      required_error: "Debe seleccionar la sucursal que genera la venta",
    }),
    patientId: z.string({
      required_error: "Debe seleccionar un paciente",
    }),
    recipeId: z.string({
      required_error: "Debe seleccionar una receta",
    }),
    currency: z.string(),
    paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "DIGITAL_WALLET"]),
    notes: z.string().optional(),
    metadata: z.record(z.never()).optional(),
    products: z.array(
      z.object({
        productId: z.string(),
        quantity: z.coerce
          .number()
          .min(1, { message: "La cantidad debe ser mayor a 0" }),
        storageId: z.string({
          required_error: "Debe seleccionar un almacén",
        }),
      })
    ),
    appointmentIds: z.array(z.string()),
  })
  .refine(
    (data) => data.products.length > 0 || data.appointmentIds.length > 0,
    {
      message: "Debe agregar al menos un producto o un servicio",
      path: ["products"],
    }
  ) satisfies z.ZodType<CreatePrescriptionBillingDto>;

export const createProductPurchaseBillingSchema = z.object({
  products: z.array(z.object({
    productId: z.string(),
    quantity: z.number(),
    unitPrice: z.number(),
  })),
  storageId: z.string(),
  supplierId: z.string(),
  branchId: z.string(),
  storageLocation: z.string().optional(),
  batchNumber: z.string().optional(),
  referenceId: z.string().optional(),
  currency: z.string(),
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "DIGITAL_WALLET"]),
  notes: z.string().optional(),
  metadata: z.record(z.never()).optional(),
}) satisfies z.ZodType<CreateProductPurchaseBillingDto>;

export type CreateProductSaleBillingInput = z.infer<typeof createProductSaleBillingSchema>;
export type CreatePrescriptionBillingInput = z.infer<typeof createPrescriptionBillingSchema>;
export type CreateProductPurchaseBillingInput = z.infer<typeof createProductPurchaseBillingSchema>;

export type ProductSaleOrderMetadataPrototype =
  components["schemas"]["ProductSaleMetadata"];
export type PatientDetailsPrototype =
  components["schemas"]["PatientDetailsMetadata"];
export type PatientDetailsMetadata = {
  fullName: string;
  dni?: string;
  address?: string;
  phone?: string;
};
export type SaleOrderDetailsPrototype =
  components["schemas"]["SaleOrderDetails"];
export type ProductMovementPrototype = components["schemas"]["ProductMovement"];
export type ProductMovement = {
  id: string;
  storageId: string;
  name: string;
  quantity: number;
  subtotal: number;
  price: number;
};
export type TransactionDetailsPrototype =
  components["schemas"]["TransactionDetails"];

export type TransactionDetails = {
  subtotal: number;
  tax: number;
  total: number;
};
export type SaleOrderDetails = {
  transactionType: "SALE";
  branchId: string;
  products: ProductMovement[];
  transactionDetails: TransactionDetails;
};
export type ProductSaleMetadata = {
  patientDetails: PatientDetailsMetadata;
  orderDetails: SaleOrderDetails;
};

export type MedicalPrescriptionMetadataPrototype =
  components["schemas"]["MedicalPrescriptionMetadata"];
export type BaseServiceItemPrototype =
  components["schemas"]["BaseServiceItem"][];
export type BaseServiceItem = {
  id: string; //AppointmentId
  name: string;
  quantity: number;
  serviceId: string;
  servicePrice: number;
};

export type PrescriptionOrderDetailsPrototype =
  components["schemas"]["PrescriptionOrderDetails"];
export type PrescriptionOrderDetails = {
  transactionType: "PRESCRIPTION";
  branchId: string;
  staffId: string;
  prescriptionDate: string;
  products: ProductMovement[];
  services: BaseServiceItem[];
  transactionDetails: TransactionDetails;
};
export type MedicalPrescriptionMetadata = {
  patientDetails: PatientDetailsMetadata;
  orderDetails: PrescriptionOrderDetails;
};

export type MedicalAppointmentMetadataPrototype =
  components["schemas"]["MedicalAppointmentMetadata"];
export type MedicalAppointmentOrderDetailsPrototype =
  components["schemas"]["MedicalAppointmentOrderDetails"];
export type MedicalAppointmentOrderDetails = {
  transactionType: "MEDICAL_APPOINTMENT";
  branchId: string;
  appointmentId: string;
  staffId?: string;
  serviceId?: string;
  appointmentType?: string;
  appointmentStart?: string;
  appointmentEnd?: string;
  consultationDate: string;
  transactionDetails: TransactionDetails;
};
export type MedicalAppointmentMetadata = {
  patientDetails: PatientDetailsMetadata;
  orderDetails: MedicalAppointmentOrderDetails;
};


export type CreateMedicalAppointmentBillingDtoPrototype = components['schemas']['CreateMedicalAppointmentBillingDto'];
export type CreateMedicalAppointmentBillingDto = {
  appointmentId: string;
  paymentMethod: "CASH" | "BANK_TRANSFER" | "DIGITAL_WALLET";
  amountPaid?: number;
  currency: string;
  voucherNumber?: string;
  notes?: string;
  metadata?: Record<string, never>;
};	

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