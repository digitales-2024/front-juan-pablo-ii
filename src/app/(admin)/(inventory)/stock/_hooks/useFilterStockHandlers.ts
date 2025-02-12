import { toast } from "sonner";
import { FilterByProduct, FilterByStorage, FilterByStorageAndProduct } from "../_interfaces/filter.interface";
import { useFilterStock, useUpdateFilteredStock } from "./useFilterStock";

export function useHandleFilterByProductSubmit() {
    const updateStockData = useUpdateFilteredStock();
  
    return (input: FilterByProduct) => {
      console.log('Ingresando a handle submit de producto', input);
      const stockData = useFilterStock({
        type: "BY_PRODUCT",
        payload: { productId: input.productId }
      });
      if (stockData.isError) {
        toast.error("Error al filtrar stock");
      }
      if (stockData.data) {
        toast.success("Stock filtrado correctamente");
        updateStockData(stockData.data);
      }
    };
  }

 export function useHandleFilterByStorageSubmit() {
    const updateStockData = useUpdateFilteredStock();
  
    return (input: FilterByStorage) => {
      console.log('Ingresando a handle submit de almacenamiento', input);
      const stockData = useFilterStock({
        type: "BY_STORAGE",
        payload: { storageId: input.storageId }
      });
      if (stockData.isError) {
        toast.error("Error al filtrar stock");
      }
      if (stockData.data) {
        toast.success("Stock filtrado correctamente");
        updateStockData(stockData.data);
      }
    };
  }

export function useHandleFilterByStorageAndProductSubmit() {
    const updateStockData = useUpdateFilteredStock();
  
    return (input: FilterByStorageAndProduct) => {
      console.log('Ingresando a handle submit de almacenamiento y producto', input);
      const stockData = useFilterStock({
        type: "BY_STORAGE_N_PRODUCT",
        payload: { storageId: input.storageId, productId: input.productId }
      });
      if (stockData.isError) {
        toast.error("Error al filtrar stock");
      }
      if (stockData.data) {
        toast.success("Stock filtrado correctamente");
        updateStockData(stockData.data);
      }
    };
  }
