"use server";

import { http } from "@/utils/serverFetch";
import {
  CancelPaymentDto,
  ProcessPaymentDto,
  VerifyPaymentDto,
  Payment,
  RefundPaymentDto,
  RejectPaymentDto,
} from "../_interfaces/order.interface";
import { BaseApiResponse } from "@/types/api/types";

export type PaymentResponse = BaseApiResponse<Payment> | { error: string };

/**
 * Inicia el proceso de transacción monetaria para un pago.
 *
 * @param paymentId - El identificador único del pago a procesar.
 * @param data - Un objeto con la información necesaria para procesar el pago.
 * @returns Un objeto con una propiedad `data` que contiene la orden actualizada tras el procesamiento del pago,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
export async function processPayment(
    paymentId: string,
    data: ProcessPaymentDto
): Promise<PaymentResponse> {
  try {
    const [responseData, error] = await http.post<PaymentResponse>(
      `/payment/${paymentId}/process`,
      data
    );

    if (error) {
      return { error: error.message };
    }

    return responseData;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

/**
 * Segunda verificaciòn del pago para generar la salida para un pago. La orden asociada, pasa a estar en estado COMPLETADO
 *
 * @param paymentId - El identificador único del pago a procesar.
 * @param data - Un objeto con la información necesaria para procesar el pago.
 * @returns Un objeto con una propiedad `data` que contiene la orden actualizada tras el procesamiento del pago,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
export async function verifyPayment(
    paymentId: string,
    data: VerifyPaymentDto
): Promise<PaymentResponse> {
  try {
    const [responseData, error] = await http.post<PaymentResponse>(
      `/payment/${paymentId}/verify`,
      data
    );

    if (error) {
      return { error: error.message };
    }

    return responseData;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

/**
 * Cancelar el pago para NO crear un registro del voucher y el monto pagado, y en consecuencia, NO GENERAR la salida para un pago. La orden asociada, pasa a estar en estado CANCELADO
 *
 * @param paymentId - El identificador único del pago a procesar.
 * @param data - Un objeto con la información necesaria para procesar el pago.
 * @returns Un objeto con una propiedad `data` que contiene la orden actualizada tras el procesamiento del pago,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
export async function cancelPayment(
    paymentId: string,
    data: CancelPaymentDto
): Promise<PaymentResponse> {
  try {
    const [responseData, error] = await http.post<PaymentResponse>(
      `/payment/${paymentId}/cancel`,
      data
    );

    if (error) {
      return { error: error.message };
    }

    return responseData;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

/**
 * Rechazar el pago para NO GENERAR la salida para un pago. La orden asociada, pasa a estar en estado CANCELADO
 *
 * @param paymentId - El identificador único del pago a procesar.
 * @param data - Un objeto con la información necesaria para procesar el pago.
 * @returns Un objeto con una propiedad `data` que contiene la orden actualizada tras el procesamiento del pago,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
export async function rejectPayment(
    paymentId: string,
    data: RejectPaymentDto
): Promise<PaymentResponse> {
  try {
    const [responseData, error] = await http.post<PaymentResponse>(
      `/payment/${paymentId}/reject`,
      data
    );

    if (error) {
      return { error: error.message };
    }

    return responseData;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

/**
 * Reembolsar el pago, se gennera un 2do registro de pago asociado a la orden. La orden asociada, pasa a estar en estado REFUNDED
 *
 * @param paymentId - El identificador único del pago a procesar.
 * @param data - Un objeto con la información necesaria para procesar el pago.
 * @returns Un objeto con una propiedad `data` que contiene la orden actualizada tras el procesamiento del pago,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
export async function refundPayment(
    paymentId: string,
    data: RefundPaymentDto
): Promise<PaymentResponse> {
  try {
    const [responseData, error] = await http.post<PaymentResponse>(
      `/payment/${paymentId}/refund`,
      data
    );

    if (error) {
      return { error: error.message };
    }

    return responseData;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}
