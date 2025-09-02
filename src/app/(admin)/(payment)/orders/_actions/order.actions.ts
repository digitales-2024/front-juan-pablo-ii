"use server";

import { http } from "@/utils/serverFetch";
import {
  Order,
  OrderStatus,
  OrderType,
  CreateOrderDto,
  UpdateOrderDto,
  DeleteOrdersDto,
  SubmitDraftOrderDto,
  DetailedOrder,
} from "../_interfaces/order.interface";
import { BaseApiResponse } from "@/types/api/types";
import { z } from "zod";
import { createSafeAction } from "@/utils/createSafeAction";

export type OrderResponse = BaseApiResponse<Order> | { error: string };
export type OneOrderGetResponse = Order | { error: string };
export type OneDetailedOrderGetResponse = DetailedOrder | { error: string };
// export type DetailedOrderResponse = BaseApiResponse<DetailedStorage> | { error: string };
export type ListOrderResponse = Order[] | { error: string };
export type ListDetailedOrderResponse = DetailedOrder[] | { error: string };
// export type ListDetailedOrderResponse = DetailedStorage[] | { error: string };

const GetOrderSchema = z.object({});

/**
 * Obtiene todas las órdenes del catálogo.
 *
 * @returns Un objeto con una propiedad `data` que contiene un array de objetos `Order`,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
export const getOrders = async () => {
  try {
    const [orders, error] = await http.get<ListDetailedOrderResponse>("/order");
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener las órdenes",
      };
    }
    if (!Array.isArray(orders)) {
      return { error: "Respuesta inválida del servidor" };
    }
    //return { data: orders };
    return orders;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
};

const getActiveOrdersHandler = async () => {
  try {
    const [orders, error] = await http.get<ListOrderResponse>("/order/active");
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener las órdenes",
      };
    }
    if (!Array.isArray(orders)) {
      return { error: "Respuesta inválida del servidor" };
    }
    //return orders;
    return { data: orders };
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
};

export const getAllOrdersByType = async ({ type }: { type: OrderType }) => {
  try {
    const [orders, error] = await http.get<ListDetailedOrderResponse>(
      "/order/type/" + type
    );
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener las órdenes",
      };
    }
    if (!Array.isArray(orders)) {
      return { error: "Respuesta inválida del servidor" };
    }
    // return { data: orders };
    return orders;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
};

export const getAllOrdersByStatus = async ({
  status,
}: {
  status: OrderStatus;
}) => {
  try {
    const [orders, error] = await http.get<ListDetailedOrderResponse>(
      "/order/status/" + status
    );
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener las órdenes",
      };
    }
    if (!Array.isArray(orders)) {
      return { error: "Respuesta inválida del servidor" };
    }
    // return { data: orders };
    return orders;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
};

export const getAllOrdersByStatusAndType = async ({
  status,
  type,
}: {
  status: OrderStatus;
  type: OrderType;
}) => {
  try {
    const [orders, error] = await http.get<ListDetailedOrderResponse>(
      `/order/${type}/status/${status}`
    );
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener las órdenes",
      };
    }
    if (!Array.isArray(orders)) {
      return { error: "Respuesta inválida del servidor" };
    }
    // return { data: orders };
    return orders;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
};

export const getAllOrdersByDateRange = async ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => {
  try {
    const [orders, error] = await http.get<ListDetailedOrderResponse>(
      `/order/date-range?startDate=${startDate}&endDate=${endDate}`
    );
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener las órdenes por fecha",
      };
    }
    if (!Array.isArray(orders)) {
      return { error: "Respuesta inválida del servidor" };
    }
    return orders;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
};

export const getActiveOrders = await createSafeAction(
  GetOrderSchema,
  getActiveOrdersHandler
);
// export const getOrders = await createSafeAction(
//   GetOrderSchema,
//   getOrdersHandler
// );
// export const getOrdersByType = await createSafeAction(
//   GetOrderByTypeSchema,
//   getAllOrdersByTypeHandler
// );
// export const getOrdersByStatus = await createSafeAction(
//   GetOrderByStatusSchema,
//   getAllOrdersByStatusHandler
// );
// export const getOrdersByStatusAndType = await createSafeAction(
//   GetOrderByStatusAndTypeSchema,
//   getAllOrdersByStatusAndTypeHandler
// )

// const getDetailedOrdersHandler = async () => {
//   try {
//     const [orders, error] = await http.get<ListDetailedStorageResponse>("/order/detailed");
//     if (error) {
//       return {
//         error:
//           typeof error === "object" && error !== null && "message" in error
//             ? String(error.message)
//             : "Error al obtener las órdenes detalladas",
//       };
//     }
//     if (!Array.isArray(orders)) {
//       return { error: "Respuesta inválida del servidor" };
//     }
//     return { data: orders };
//   } catch (error) {
//     if (error instanceof Error) return { error: error.message };
//     return { error: "Error desconocido" };
//   }
// };

// export const getDetailedOrders = await createSafeAction(GetOrderSchema, getDetailedOrdersHandler);

export async function getOrderById(id: string): Promise<OneOrderGetResponse> {
  try {
    const [order, error] = await http.get<OneOrderGetResponse>(`/order/${id}`);
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener la orden",
      };
    }
    return order;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

export async function getDetailedOrderById(id: string): Promise<OneDetailedOrderGetResponse> {
  try {
    const [order, error] = await http.get<OneDetailedOrderGetResponse>(`/order/detailed/${id}`);
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener la orden",
      };
    }
    return order;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

export async function getDetailedOrderByCode(id: string): Promise<OneDetailedOrderGetResponse> {
  try {
    const [order, error] = await http.get<OneDetailedOrderGetResponse>(`/order/detailed/code/${id}`);
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener la orden",
      };
    }
    return order;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

export async function searchDetailedOrderByCode(code: string): Promise<ListDetailedOrderResponse> {
  try {
    const [order, error] = await http.get<ListDetailedOrderResponse>(`/order/search/detailed/code/${code}`);
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener la orden",
      };
    }
    return order;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}


// export async function getDetailedOrderById(id: string): Promise<ListDetailedStorageResponse> {
//   try {
//     const [order, error] = await http.get<ListDetailedStorageResponse>(`/order/detailed/${id}`);
//     if (error) {
//       return {
//         error:
//           typeof error === "object" && error !== null && "message" in error
//             ? String(error.message)
//             : "Error al obtener la orden",
//       };
//     }
//     return order;
//   } catch (error) {
//     if (error instanceof Error) return { error: error.message };
//     return { error: "Error desconocido" };
//   }
// }

/**
 * Crea una nueva orden en el catálogo.
 *
 * @param data - Un objeto con la información de la orden a crear.
 * @returns Un objeto con una propiedad `data` que contiene la orden creada,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
export async function createOrder(
  data: CreateOrderDto
): Promise<OrderResponse> {
  try {
    const [responseData, error] = await http.post<OrderResponse>(
      "/order",
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
 * Actualiza una orden en el catálogo.
 *
 * @param id - El identificador único de la orden a actualizar.
 * @param data - Un objeto con la información de la orden a actualizar.
 * @returns Un objeto con una propiedad `data` que contiene la orden actualizada,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
export async function updateOrder(
  id: string,
  data: UpdateOrderDto
): Promise<OrderResponse> {
  try {
    const [responseData, error] = await http.patch<OrderResponse>(
      `/order/${id}`,
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
 * Elimina una o varias órdenes del catálogo.
 *
 * @param data - Un objeto con la información de las órdenes a eliminar.
 * @returns Un objeto con una propiedad `data` que contiene la respuesta del servidor,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
export async function deleteOrder(
  data: DeleteOrdersDto
): Promise<OrderResponse> {
  try {
    const [response, error] = await http.delete<BaseApiResponse>(
      "/order/remove/all",
      data
    );

    if (error) {
      if (error.statusCode === 401) {
        return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
      }
      return { error: error.message };
    }

    return response;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al eliminar las órdenes" };
  }
}

/**
 * Reactiva una o varias órdenes en el catálogo.
 *
 * @param data - Un objeto con la información de las órdenes a reactivar.
 * @returns Un objeto con una propiedad `data` que contiene la respuesta del servidor,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
export async function reactivateOrder(
  data: DeleteOrdersDto
): Promise<OrderResponse> {
  try {
    const [response, error] = await http.patch<BaseApiResponse>(
      "/order/reactivate/all",
      data
    );

    if (error) {
      if (error.statusCode === 401) {
        return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
      }
      return { error: error.message };
    }

    return response;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al reactivar las órdenes" };
  }
}

/**
 * Confirmar orden borrador y cambiar a pendiente
 *
 * @param data - Un objeto con la información de la orden a crear.
 * @returns Un objeto con una propiedad `data` que contiene la orden creada,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
export async function submitDraftOrder(
  id: string,
  data: SubmitDraftOrderDto
): Promise<OrderResponse> {
  try {
    const [responseData, error] = await http.post<OrderResponse>(
      `/order/${id}/submit-draft`,
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
