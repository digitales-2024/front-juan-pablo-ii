// "use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getPatientPrescriptionsByDni,
  getPrescriptionsWithPatient,
  ListPrescriptionsWithPatientResponse,
} from "../_actions/prescriptions.actions";

export type ProductsStockFilter =
  | { type: "ALL"; limit?: number; offset?: number }
  | { type: "BY_BRANCH"; branch: string };

export const productsStockFilterType = {
  ALL: "ALL",
  BY_DNI: "BY_BRANCH",
};

export type ProductsStockFilterType = keyof typeof productsStockFilterType;

const PRODUCTSTOCK_QUERY_KEY = ["products-with-stock-for-sale"] as const;

export function useUnifiedProductsStock() {
  // Filtro por defecto: "ALL" (todos los almacenes)
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<ProductsStockFilter>({ type: "ALL" });
  // const [success, setSuccess] = useState(false);

  // Referencia para bloquear la invalidación de caché en el primer render
  const firstRenderRef = useRef(true);

  // useQuery principal
  const unifiedQuery = useQuery({
    // El queryKey varía según el tipo y parámetros
    //queryKey: ["stock", filter],
    queryKey: PRODUCTSTOCK_QUERY_KEY,
    queryFn: async () => {
      try {
        let response: ListPrescriptionsWithPatientResponse;
        switch (filter.type) {
          case "ALL": {
            response = await getPrescriptionsWithPatient(
              filter.limit,
              filter.offset
            );
            if ("error" in response) {
              toast.error(response.error);
            }
            break;
          }
          case "BY_BRANCH": {
            response = await getPatientPrescriptionsByDni(filter.branch);
            if ("error" in response) {
              toast.error(response.error);
            }
            break;
          }
          default: {
            response = await getPrescriptionsWithPatient();
            if ("error" in response) {
              toast.error(response.error);
            }
            break;
          }
        }
        if (!response || "error" in response) {
          throw new Error(response?.error || "No se recibió respuesta");
        }
        return response;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Error desconocido";
        toast.error(message);
        return []; // Retornamos un array vacío si sucede un error
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    queryClient
      .invalidateQueries({ queryKey: PRESCRIPTION_QUERY_KEY })
      .catch(() => toast.error("Error al actualizar"));
  }, [filter, queryClient]);

  // Helpers para actualizar el filtro
  function setFilterAllPrescriptions(limit = 10, offset = 0) {
    setFilter({ type: "ALL", limit, offset });
  }
  function setFilterByDni(dni: string) {
    setFilter({ type: "BY_DNI", dni });
  }
  // function setFilterByType(orderType: OrderType) {
  //   setFilter({ type: "BY_TYPE", orderType });
  // }
  // function setFilterByStatusAndType({orderStatus, orderType}:{orderStatus: OrderStatus, orderType: OrderType}) {
  //   setFilter({ type: "BY_STATUS_AND_TYPE", orderStatus, orderType });
  // }

  return {
    data: unifiedQuery.data,
    isLoading: unifiedQuery.isLoading,
    isError: unifiedQuery.isError,
    query: unifiedQuery,
    filter, // Por si quieres leer el tipo de filtro actual
    setFilterAllPrescriptions,
    setFilterByDni
  };
}
