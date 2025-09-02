import { z } from "zod";
import { OrderStatus, OrderType } from "./order.interface";

export type FilterByStatus = {
    orderStatus: OrderStatus;
}

export type FilterByType = {
    orderType: OrderType;
}

export type FilterByStatusAndType = FilterByStatus & FilterByType;

export type FilterByDateRange = {
    startDate: string; // formato YYYY-MM-DD
    endDate: string;   // formato YYYY-MM-DD
}

export const FilterByStatusSchema = z.object({
    orderStatus: z.enum(["DRAFT", "PENDING", "PROCESSING", "COMPLETED", "CANCELLED", "REFUNDED", "REQUIRES_ATTENTION"])
}) satisfies z.ZodType<FilterByStatus>;

export const FilterByTypeSchema = z.object({
    orderType: z.enum(["MEDICAL_PRESCRIPTION_ORDER", "MEDICAL_APPOINTMENT_ORDER", "PRODUCT_SALE_ORDER", "PRODUCT_PURCHASE_ORDER"]),
}) satisfies z.ZodType<FilterByType>;

export const FilterByStatusAndTypeSchema = z.object({
    orderStatus: z.enum(["DRAFT", "PENDING", "PROCESSING", "COMPLETED", "CANCELLED", "REFUNDED", "REQUIRES_ATTENTION"]),
    orderType: z.enum(["MEDICAL_PRESCRIPTION_ORDER", "MEDICAL_APPOINTMENT_ORDER", "PRODUCT_SALE_ORDER", "PRODUCT_PURCHASE_ORDER"]),
}) satisfies z.ZodType<FilterByStatusAndType>;

export const FilterByDateRangeSchema = z.object({
    startDate: z.string().min(1, "La fecha de inicio es requerida"),
    endDate: z.string().min(1, "La fecha de fin es requerida"),
}).refine((data) => {
    return new Date(data.startDate) <= new Date(data.endDate);
}, {
    message: "La fecha de inicio debe ser anterior o igual a la fecha de fin",
    path: ["endDate"],
}) satisfies z.ZodType<FilterByDateRange>;