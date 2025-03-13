import { z } from "zod";
import { OrderStatus, OrderType } from "./order.interface";

export type FilterByStatus = {
    orderStatus: OrderStatus;
}

export type FilterByType = {
    orderType: OrderType;
}

export type FilterByStatusAndType = FilterByStatus & FilterByType;

export const FilterByStatusSchema = z.object({
    orderStatus: z.enum(["DRAFT", "PENDING", "PROCESSING", "COMPLETED", "CANCELLED", "REFUNDED", "REQUIRES_ATTENTION"])
}) satisfies z.ZodType<FilterByStatus>;

export const FilterByTypeSchema = z.object({
    orderType: z.enum(["MEDICAL_PRESCRIPTION_ORDER", "MEDICAL_CONSULTATION_ORDER", "PRODUCT_SALE_ORDER", "PRODUCT_PURCHASE_ORDER"]),
}) satisfies z.ZodType<FilterByType>;

export const FilterByStatusAndTypeSchema = z.object({
    orderStatus: z.enum(["DRAFT", "PENDING", "PROCESSING", "COMPLETED", "CANCELLED", "REFUNDED", "REQUIRES_ATTENTION"]),
    orderType: z.enum(["MEDICAL_PRESCRIPTION_ORDER", "MEDICAL_CONSULTATION_ORDER", "PRODUCT_SALE_ORDER", "PRODUCT_PURCHASE_ORDER"]),
}) satisfies z.ZodType<FilterByStatusAndType>;