import { components } from "@/types/api";
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
export type OrderType = components['schemas']['OrderType'];
export type CreateOrderDto = components['schemas']['CreateOrderDto'];
export type UpdateOrderDto = components['schemas']['UpdateOrderDto'];
export type DeleteOrdersDto = components['schemas']['DeleteOrdersDto'];
export type SubmitDraftOrderDto = components['schemas']['SubmitDraftOrderDto'];
export type OrderStatus = components['schemas']['OrderStatus'];

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
  type: z.enum(["MEDICAL_PRESCRIPTION_ORDER", "MEDICAL_CONSULTATION_ORDER", "PRODUCT_SALE_ORDER", "PRODUCT_PURCHASE_ORDER"]),
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
  type: z.enum(["MEDICAL_PRESCRIPTION_ORDER", "MEDICAL_CONSULTATION_ORDER", "PRODUCT_SALE_ORDER", "PRODUCT_PURCHASE_ORDER"]).optional(),
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
export type Payment = components['schemas']['Payment'];
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
  amount: z.number(),
  description: z.string().optional(),
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "YAPE"]).optional(),
  voucherNumber: z.string().optional(),
  originalPaymentId: z.string().optional(),
}) satisfies z.ZodType<CreatePaymentDto>;

export const updatePaymentSchema = z.object({
  orderId: z.string().optional(),
  date: z.string().optional(),
  status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "CANCELLED", "REFUNDED"]).optional(),
  type: z.enum(["REGULAR", "REFUND", "PARTIAL", "ADJUSTMENT", "COMPENSATION"]).optional(),
  amount: z.number().optional(),
  description: z.string().optional(),
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "YAPE"]).optional(),
  voucherNumber: z.string().optional(),
  originalPaymentId: z.string().optional(),
}) satisfies z.ZodType<UpdatePaymentDto>;

export const cancelPaymentSchema = z.object({
  cancellationReason: z.string(),
}) satisfies z.ZodType<CancelPaymentDto>;

export const processPaymentSchema = z.object({
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "YAPE"]),
  amount: z.number(),
  voucherNumber: z.string().optional(),
  date: z.string(),
  description: z.string().optional(),
}) satisfies z.ZodType<ProcessPaymentDto>;

export const verifyPaymentSchema = z.object({
  verificationNotes: z.string().optional(),
  verifiedAt: z.string().optional(),
}) satisfies z.ZodType<VerifyPaymentDto>;

export const rejectPaymentSchema = z.object({
  rejectionReason: z.string(),
}) satisfies z.ZodType<RejectPaymentDto>;

export const refundPaymentSchema = z.object({
  amount: z.number(),
  reason: z.string(),
  refundMethod: z.enum(["CASH", "BANK_TRANSFER", "YAPE"]),
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
};
export type CreateProductSaleBillingDtoPrototype = components['schemas']['CreateProductSaleBillingDto'];
export type CreateProductSaleBillingDto = {
  products: ProductSaleItemDto[];
  storageId: string;
  branchId: string;
  storageLocation?: string;
  batchNumber?: string;
  referenceId?: string;
  currency: string;
  paymentMethod: "CASH" | "BANK_TRANSFER" | "YAPE";
  notes?: string;
  metadata?: Record<string, never>;
};
export type ProductPurchaseItemDtoPrototype = components['schemas']['ProductPurchaseItemDto'];
export type ProductPurchaseItemDto = {
  productId: string;
  quantity: number;
  unitPrice: number;
};
export type CreateProductPurchaseBillingDtoPrototype = components['schemas']['CreateProductPurchaseBillingDto'];
export type CreateProductPurchaseBillingDto = {
  products: ProductPurchaseItemDto[];
  storageId: string;
  supplierId: string;
  branchId: string;
  storageLocation?: string;
  batchNumber?: string;
  referenceId?: string;
  currency: string;
  paymentMethod: "CASH" | "BANK_TRANSFER" | "YAPE";
  notes?: string;
  metadata?: Record<string, never>;
}

export const createProductSaleBillingSchema = z.object({
  products: z.array(z.object({
    productId: z.string(),
    quantity: z.number(),
  })),
  storageId: z.string(),
  branchId: z.string(),
  storageLocation: z.string().optional(),
  batchNumber: z.string().optional(),
  referenceId: z.string().optional(),
  currency: z.string(),
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "YAPE"]),
  notes: z.string().optional(),
  metadata: z.record(z.never()).optional(),
}) satisfies z.ZodType<CreateProductSaleBillingDto>;

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
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "YAPE"]),
  notes: z.string().optional(),
  metadata: z.record(z.never()).optional(),
}) satisfies z.ZodType<CreateProductPurchaseBillingDto>;

export type CreateProductSaleBillingInput = z.infer<typeof createProductSaleBillingSchema>;
export type CreateProductPurchaseBillingInput = z.infer<typeof createProductPurchaseBillingSchema>;