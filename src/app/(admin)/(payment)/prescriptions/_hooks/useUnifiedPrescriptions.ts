// "use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getPatientPrescriptionsByDni,
  getPrescriptionsWithPatient,
  ListPrescriptionsWithPatientResponse,
} from "../_actions/prescriptions.actions";

export type PrescriptionsFilter =
  | { type: "ALL"; limit?: number; offset?: number }
  | { type: "BY_DNI"; dni: string };

export const PrescriptionsFilterType = {
  ALL: "ALL",
  BY_DNI: "BY_DNI",
};

export type PrescriptionsFilterType = keyof typeof PrescriptionsFilterType;

const PRESCRIPTION_QUERY_KEY = ["prescriptions"] as const;

export function useUnifiedPrescriptions() {
  // Filtro por defecto: "ALL" (todos los almacenes)
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<PrescriptionsFilter>({ type: "ALL" });
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
    queryKey: PRESCRIPTION_QUERY_KEY,
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
          case "BY_DNI": {
            response = await getPatientPrescriptionsByDni(filter.dni);
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
    console.log("filter hook", filter);
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
