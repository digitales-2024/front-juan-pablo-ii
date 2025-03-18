import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createOrder,
  updateOrder,
  deleteOrder,
  reactivateOrder,
  // getDetailedOrders,
  getActiveOrders,
  // getDetailedOrderById,
  getOrderById,
  OneOrderGetResponse,
  OneDetailedOrderGetResponse,
  ListDetailedOrderResponse,
  getDetailedOrderById,
  searchDetailedOrderByCode,
  // ListDetailedOrderResponse
} from "../_actions/order.actions";
import { toast } from "sonner";
import {
  CreateOrderDto,
  UpdateOrderDto,
  DeleteOrdersDto,
  Order,
} from "../_interfaces/order.interface";
import { BaseApiResponse } from "@/types/api/types";

interface UpdateOrderVariables {
  id: string;
  data: UpdateOrderDto;
}

export const useOrders = () => {
  const queryClient = useQueryClient();

  // const ordersQuery = useQuery({
  //   queryKey: ["orders"],
  //   queryFn: async () => {
  //     const response = await getOrders();
  //     if (!response || "error" in response) {
  //       throw new Error(response?.error || "No se recibió respuesta");
  //     }
  //     return response;
  //     // if (response.error || !response.data) {
  //     //   throw new Error(response.error ?? "Error desconocido");
  //     // }
  //     //return response.data;
  //   },
  //   staleTime: 1000 * 60 * 5, // 5 minutos
  // });

  const activeOrdersQuery = useQuery({
    queryKey: ["active-orders"],
    queryFn: async () => {
      const response = await getActiveOrders({});
      if (!response) {
        throw new Error("No se recibió respuesta del servidor");
      }

      if (response.error || !response.data) {
        throw new Error(response.error ?? "Error desconocido");
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  // const detailedOrdersQuery = useQuery({
  //   queryKey: ["detailed-orders"],
  //   queryFn: async () => {
  //     const response = await getDetailedOrders({});
  //     if (!response) {
  //       throw new Error("No se recibió respuesta del servidor");
  //     }

  //     if (response.error || !response.data) {
  //       throw new Error(response.error ?? "Error desconocido");
  //     }
  //     return response.data;
  //   },
  //   staleTime: 1000 * 60 * 5,
  // });

  function useOneOrderQuery(orderId: string) {
    return useQuery({
      queryKey: ["order", orderId],
      queryFn: async () => {
        try {
          const response: OneOrderGetResponse = await getOrderById(orderId);
          if (!response || "error" in response) {
            throw new Error(response?.error || "No se recibió respuesta");
          }
          return response;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Error desconocido";
          toast.error(message);
          return {};
        }
      },
      staleTime: 1000 * 60 * 5,
    });
  }

  function useOneDetailedOrderQuery(id: string) {
    return useQuery({
      queryKey: ["detailed-order", id],
      queryFn: async () => {
        try {
          const response: OneDetailedOrderGetResponse = await getDetailedOrderById(id);
          if (!response || "error" in response) {
            throw new Error(response?.error || "No se recibió respuesta");
          }
          return response;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Error desconocido";
          toast.error(message);
          return {};
        }
      },
      staleTime: 1000 * 60 * 5,
    });
  }

  function useSearchDetailedOrderQuery(orderCode: string) {
    return useQuery({
      queryKey: ["searched-detailed-orders", orderCode],
      queryFn: async () => {
        try {
          const response: ListDetailedOrderResponse = await searchDetailedOrderByCode(orderCode);
          if (!response || "error" in response) {
            throw new Error(response?.error || "No se recibió respuesta");
          }
          return response;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Error desconocido";
          toast.error(message);
          return [];
        }
      },
      staleTime: 1000 * 60 * 5,
    });
  }


  const createMutation = useMutation<BaseApiResponse<Order>, Error, CreateOrderDto>({
    mutationFn: async (data) => {
      const response = await createOrder(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: async (res) => {
      // const detailedOrder = await getDetailedOrderById(res.data.id);
      // if ("error" in detailedOrder) {
      //   throw new Error(detailedOrder.error);
      // }
      // queryClient.setQueryData<DetailedOrder[] | undefined>(
      //   ["detailed-orders"], (oldOrders) => {
      //     if (!oldOrders) return detailedOrder;
      //     return [...oldOrders, ...detailedOrder];
      // });
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success(res.message);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const updateMutation = useMutation<BaseApiResponse<Order>, Error, UpdateOrderVariables>({
    mutationFn: async ({ id, data }) => {
      const response = await updateOrder(id, data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: async(res) => {
      // const detailedOrder = await getDetailedOrderById(res.data.id);
      // if ("error" in detailedOrder) {
      //   throw new Error(detailedOrder.error);
      // }
      // queryClient.setQueryData<DetailedOrder[] | undefined>(["detailed-orders"], (oldOrders) => {
      //   if (!oldOrders) return undefined;
      //   return oldOrders.map((order) =>
      //     order.id === res.data.id ? {...order, ...detailedOrder[0]} : order
      //   );
      // });
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Orden actualizada exitosamente :" + res.message);
    },
    onError: (error) => {
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al actualizar la orden");
      }
    },
  });

  const deleteMutation = useMutation<BaseApiResponse<Order>, Error, DeleteOrdersDto>({
    mutationFn: async (data) => {
      const response = await deleteOrder(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: async (res, variables) => {
      // queryClient.setQueryData<DetailedOrder[]>(["detailed-orders"], (oldOrders) => {
      //   if (!oldOrders) return [];
      //   return oldOrders.map((order) => 
      //     variables.ids.includes(order.id) ? { ...order, status: OrderStatus.CANCELLED } : order
      //   );
      // });
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success(
        variables.ids.length === 1
          ? "Orden desactivada exitosamente"
          : "Órdenes desactivadas exitosamente"
      );
    },
    onError: (error) => {
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al cancelar la(s) orden(es)");
      }
    },
  });

  const reactivateMutation = useMutation<BaseApiResponse<Order>, Error, DeleteOrdersDto>({
    mutationFn: async (data) => {
      const response = await reactivateOrder(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: async (res, variables) => {
      // queryClient.setQueryData<DetailedOrder[]>(["detailed-orders"], (oldOrders) => {
      //   if (!oldOrders) return [];
      //   return oldOrders.map((order) => 
      //     variables.ids.includes(order.id) ? { ...order, status: OrderStatus.PENDING } : order
      //   );
      // });
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success(
        variables.ids.length === 1
          ? "Orden reactivada exitosamente"
          : "Órdenes reactivadas exitosamente"
      );
    },
    onError: (error) => {
      if (error.message.includes("No autorizado") || error.message.includes("Unauthorized")) {
        toast.error("No tienes permisos para realizar esta acción");
      } else {
        toast.error(error.message || "Error al reactivar la(s) orden(es)");
      }
    },
  });

  return {
    activeOrdersQuery,
    // detailedOrdersQuery,
    useOneOrderQuery,
    useOneDetailedOrderQuery,
    useSearchDetailedOrderQuery,
    createMutation,
    updateMutation,
    deleteMutation,
    reactivateMutation,
  };
};
