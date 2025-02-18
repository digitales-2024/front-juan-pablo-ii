// "use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  GeneralStockResponse,
  getStockByProduct,
  getStockByStorage,
  getStockByStorageProduct,
  getStockForAllStorages,
} from "../_actions/stock.actions";

export type StockFilter =
  | { type: "ALL" }
  | { type: "BY_PRODUCT"; productId: string }
  | { type: "BY_STORAGE"; storageId: string }
  | { type: "BY_STORAGE_N_PRODUCT"; productId: string; storageId: string };

  
  export const StockFilterType = {
    ALL: "ALL",
    BY_PRODUCT: "BY_PRODUCT",
    BY_STORAGE: "BY_STORAGE",
    BY_STORAGE_N_PRODUCT: "BY_STORAGE_N_PRODUCT",
  }
  
  export type StockFilterType = keyof typeof StockFilterType;
  
  const STOCK_QUERY_KEY = ['stock'] as const;

export function useUnifiedStock() {
  // Filtro por defecto: "ALL" (todos los almacenes)
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<StockFilter>({ type: "ALL" });
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
        let response: GeneralStockResponse;
        switch (filter.type) {
          case "ALL": {
            response = await getStockForAllStorages();
            if ("error" in response) {
              toast.error(response.error);
            }
            break;
          }
          case "BY_PRODUCT": {
            response = await getStockByProduct(filter.productId);
            if ("error" in response) {
              toast.error(response.error);
            }
            else{
               response = response.filter(stock => stock.stock.length > 0)
            }
            break;
          }
          case "BY_STORAGE": {
            response = await getStockByStorage(filter.storageId);
            if ("error" in response) {
              toast.error(response.error);
            }else{
              response = response.filter(stock => stock.idStorage===filter.storageId)
            }
            break;
          }
          case "BY_STORAGE_N_PRODUCT": {
            response = await getStockByStorageProduct({
              storageId: filter.storageId,
              productId: filter.productId,
            });
            if ("error" in response) {
              toast.error(response.error);
            }
            else{
               response = response.filter(stock => stock.stock.length > 0)
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
  function setFilterAllStorages() {
    setFilter({ type: "ALL" });
  }
  function setFilterByProduct(productId: string) {
    setFilter({ type: "BY_PRODUCT", productId });
  }
  function setFilterByStorage(storageId: string) {
    setFilter({ type: "BY_STORAGE", storageId });
  }
  function setFilterByStorageAndProduct({productId, storageId}:{productId: string, storageId: string}) {
    setFilter({ type: "BY_STORAGE_N_PRODUCT", productId, storageId });
  }

  return {
    data: unifiedQuery.data,
    isLoading: unifiedQuery.isLoading,
    isError: unifiedQuery.isError,
    query: unifiedQuery,
    filter, // Por si quieres leer el tipo de filtro actual
    setFilterAllStorages,
    setFilterByProduct,
    setFilterByStorage,
    setFilterByStorageAndProduct,
  };
}