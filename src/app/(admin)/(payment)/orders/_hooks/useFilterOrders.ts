// "use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    getOrders,
    getAllOrdersByStatus,
    getAllOrdersByStatusAndType,
    getAllOrdersByType,
    ListDetailedOrderResponse,
} from "../_actions//order.actions";
import { OrderStatus, OrderType } from "../_interfaces/order.interface";

export type OrdersFilter =
  | { type: "ALL" }
  | { type: "BY_STATUS"; orderStatus: OrderStatus }
  | { type: "BY_TYPE"; orderType: OrderType }
  | { type: "BY_STATUS_AND_TYPE"; orderStatus: OrderStatus; orderType: OrderType };

  
  export const OrdersFilterType = {
    ALL: "ALL",
    BY_STATUS: "BY_STATUS",
    BY_TYPE: "BY_TYPE",
    BY_STATUS_AND_TYPE: "BY_STATUS_AND_TYPE",
  }

  export type OrdersFilterType = keyof typeof OrdersFilterType;
  
  const STOCK_QUERY_KEY = ['orders'] as const;

export function useUnifiedOrders() {
  // Filtro por defecto: "ALL" (todos los almacenes)
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<OrdersFilter>({ type: "ALL" });
  // const [success, setSuccess] = useState(false);

    // Referencia para bloquear la invalidación de caché en el primer render
    const firstRenderRef = useRef(true);

  // const handleNotifications = () => {
  //     toast.success("Stock filtrado y actualizado correctamente");
  // }
  // useQuery principal
  const unifiedQuery = useQuery({
    // El queryKey varía según el tipo y parámetros
    //queryKey: ["stock", filter],
    queryKey: STOCK_QUERY_KEY,
    queryFn: async () => {
      try {
        let response: ListDetailedOrderResponse;
        switch (filter.type) {
          case "ALL": {
            response = await getOrders();
            if ("error" in response) {
              toast.error(response.error);
            }
            break;
          }
          case "BY_STATUS": {
            response = await getAllOrdersByStatus({
                status: filter.orderStatus,
            });
            if ("error" in response) {
              toast.error(response.error);
            }
            break;
          }
          case "BY_TYPE": {
            response = await getAllOrdersByType({ type: filter.orderType });
            if ("error" in response) {
              toast.error(response.error);
            }
            break;
          }
          case "BY_STATUS_AND_TYPE": {
            response = await getAllOrdersByStatusAndType({
              status: filter.orderStatus,
              type: filter.orderType,
            });
            if ("error" in response) {
              toast.error(response.error);
            }
            break;
          }
          default:{
            response = await getOrders();
            if ("error" in response) {
              toast.error(response.error);
            }
            break;
          }
        }
        if (!response || "error" in response) {
          throw new Error(response?.error || "No se recibió respuesta");
        }
        // console.log('response', response);
        return response;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        toast.error(message);
        return []; // Retornamos un array vacío si sucede un error
      }
    },
    // Podrías considerar enabled: false si quisieras no hacer fetch por defecto
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    queryClient
      .invalidateQueries({ queryKey: STOCK_QUERY_KEY })
      .catch(() => toast.error("Error al actualizar"));
    console.log('filter hook', filter);
  }, [filter, queryClient]);

  // Helpers para actualizar el filtro
  function setFilterAllOrders() {
    setFilter({ type: "ALL" });
  }
  function setFilterByStatus(orderStatus: OrderStatus) {
    setFilter({ type: "BY_STATUS", orderStatus });
  }
  function setFilterByType(orderType: OrderType) {
    setFilter({ type: "BY_TYPE", orderType });
  }
  function setFilterByStatusAndType({orderStatus, orderType}:{orderStatus: OrderStatus, orderType: OrderType}) {
    setFilter({ type: "BY_STATUS_AND_TYPE", orderStatus, orderType });
  }

  return {
    data: unifiedQuery.data,
    isLoading: unifiedQuery.isLoading,
    isError: unifiedQuery.isError,
    query: unifiedQuery,
    filter, // Por si quieres leer el tipo de filtro actual
    setFilterAllOrders,
    setFilterByStatus,
    setFilterByType,
    setFilterByStatusAndType,
  };
}