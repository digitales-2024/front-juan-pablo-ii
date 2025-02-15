import { useQuery } from "@tanstack/react-query";
import { ToOutgoingStockForm, getProductStock, getProductsStock } from "../_actions/stock.actions";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { OutgoingProducStockForm } from "../_interfaces/stock.interface";

export function useProductsStock() {
  const productStockQuery = useQuery({
    queryKey: ["products-stock"],
    queryFn: async () => {
      try {
        const response = await getProductsStock();
        if (!response || "error" in response) {
          throw new Error(response?.error || "No se recibió respuesta");
        }
        // console.log('response', response);
        const data = ToOutgoingStockForm(response);
        return data
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Error desconocido";
        toast.error(message);
        return []; // Retornamos un array vacío si sucede un error
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  return { productStockQuery };
}

export function useProductStockById(productId: string) {
  const productStockQuery = useQuery({
    queryKey: ["product-stock", productId],
    queryFn: async () => {
      try {
        const response = await getProductStock({ productId });
        if (!response || "error" in response) {
          throw new Error(response?.error || "No se recibió respuesta");
        }
        return response;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Error desconocido";
        toast.error(message);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  return { productStockQuery };
}

export function useUpdateProductStock() {
    const queryClient = useQueryClient();

    const updateProductStock = (productId: string, storageId: string) => {
        queryClient.setQueryData(["products-stock"], (oldData: OutgoingProducStockForm[] ) => {
            if (!oldData) return oldData;
            return oldData.map((product: OutgoingProducStockForm) =>
                product.id === productId ? { ...product, storageId} : product
            );
        });
    };

    return { updateProductStock };
}
