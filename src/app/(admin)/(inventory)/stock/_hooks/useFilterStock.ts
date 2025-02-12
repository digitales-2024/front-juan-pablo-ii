import { useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { type StockByStorage as Stock } from "../_interfaces/stock.interface";
import { getStockByProduct, getStockByStorage, getStockByStorageProduct, getStockForAllStorages } from "../_actions/stock.actions";
import { toast } from "sonner";

type Action =
  | { type: "ALL_STORAGES" }
  | { type: "BY_STORAGE"; payload: { storageId: string }}
  | { type: "BY_PRODUCT"; payload: { productId: string }}
  | { type: "BY_STORAGE_N_PRODUCT"; payload: { productId: string, storageId: string }};

/**
 * Hook que encapsula todas las queries relacionadas al stock
 */
const useStock = () => {
  const stockAllStoragesQuery = useQuery({
    queryKey: ["stock-storages"],
    queryFn: async () => {
      try {
        const response = await getStockForAllStorages();
        if (!response || "error" in response) {
          throw new Error(response?.error || "No se recibió respuesta del servidor");
        }
        return response;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Error desconocido");
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  const stockByProductQuery = (productId: string) =>
    useQuery({
      queryKey: ["stock-by-product", productId],
      queryFn: async () => {
        try {
          const response = await getStockByProduct(productId);
          if (!response || "error" in response) {
            throw new Error(response?.error || "No se recibió respuesta del servidor");
          }
          return response;
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Error desconocido");
          return [];
        }
      },
      staleTime: 1000 * 60 * 5,
      enabled: !!productId,
    });

  const stockByStorageQuery = (storageId: string) =>
    useQuery({
      queryKey: ["stock-by-storage", storageId],
      queryFn: async () => {
        try {
          const response = await getStockByStorage(storageId);
          if (!response || "error" in response) {
            throw new Error(response?.error || "No se recibió respuesta del servidor");
          }
          return response;
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Error desconocido");
          return [];
        }
      },
      staleTime: 1000 * 60 * 5,
      enabled: !!storageId,
    });

  const stockByStorageNProductQuery = (storageId: string, productId: string) =>
    useQuery({
      queryKey: ["stock-by-storage-n-product", { storageId, productId }],
      queryFn: async () => {
        try {
          const response = await getStockByStorageProduct({ storageId, productId });
          if (!response || "error" in response) {
            throw new Error(response?.error || "No se recibió respuesta del servidor");
          }
          return response;
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Error desconocido");
          return [];
        }
      },
      staleTime: 1000 * 60 * 5,
      enabled: !!storageId && !!productId,
    });

  return { stockAllStoragesQuery, stockByProductQuery, stockByStorageQuery, stockByStorageNProductQuery };
};

/**
 * Hook para filtrar stock basado en una acción.
 */
const useFilterStock = (action: Action): UseQueryResult<Stock[] | undefined, Error> => {
  const { stockAllStoragesQuery, stockByProductQuery, stockByStorageQuery, stockByStorageNProductQuery } = useStock();

  switch (action.type) {
    case "BY_STORAGE":
      return stockByStorageQuery(action.payload.storageId);
    case "BY_PRODUCT":
      return stockByProductQuery(action.payload.productId);
    case "BY_STORAGE_N_PRODUCT":
      return stockByStorageNProductQuery(action.payload.storageId, action.payload.productId);
    case "ALL_STORAGES":
    default:
      return stockAllStoragesQuery;
  }
};

/**
 * Hook para obtener el stock filtrado desde el cache del cliente.
 */
const useFilteredStock = () => {
  return useQuery<Stock[]>({
    queryKey: ["stock-server-filtered"],
    initialData: [],
  }).data ?? [];
};

/**
 * Hook para actualizar el stock filtrado en cache del cliente.
 */
const useUpdateFilteredStock = () => {
  const client = useQueryClient();
  return (data: Stock[]) => {
    client.setQueryData<Stock[]>(["stock-server-filtered"], () => data);
  };
};

export { useStock, useFilterStock, useFilteredStock, useUpdateFilteredStock };
