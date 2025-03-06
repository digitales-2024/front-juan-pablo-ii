import { useQuery } from "@tanstack/react-query";
import { getManyProductsStock, getManyProductsStockByStorage, getOneProductStockByStorage, getProductStock, getProductStockByStorage, getProductsStock } from "../_actions/stock.actions";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { OutgoingProducStockForm, OutgoingProductStock } from "../_interfaces/stock.interface";

export function ToOutgoingStockForm( data: OutgoingProductStock[] ): OutgoingProducStockForm[]{
  return data.map((ele)=>{return {...ele, storageId:""}})
}

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

export const useProductStockById = () =>{
  return (productId: string) => {
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
}

export const useOneProductStockByStorage = () =>{
  return (productId: string, storageId: string) => {
    const productStockQuery = useQuery({
      queryKey: ["product-stock", productId, storageId],
      queryFn: async () => {
        try {
          const response = await getOneProductStockByStorage({ productId, storageId });
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
}

export const useManyProductsStockByStorage = () =>{
  return (params: {productId: string, storageId: string}[]) => {
    const productStockQuery = useQuery({
      queryKey: ["products-stock-by-storage"],
      queryFn: async () => {
        try {
          const response = await getManyProductsStockByStorage(params);
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
}

export const useManyProductsStock = () =>{
  return (params: string[], key:string) => {
    const productStockQuery = useQuery({
      queryKey: ["many-products-stock", key],
      queryFn: async () => {
        try {
          const response = await getManyProductsStock(params);
          if (!response || "error" in response) {
            throw new Error(response?.error || "No se recibió respuesta");
          }
          console.log('response many products stock', response);
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
}

export function useProductsStockByStorage() {
  return useQuery({
    queryKey: ["product-stock-by-storage"],
    queryFn: async () => {
      try {
        const response = await getProductsStock();
        if (!response || "error" in response) {
          throw new Error(response?.error || "No se recibió respuesta");
        }
        const data = ToOutgoingStockForm(response);
        return data;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        toast.error(message);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useStockByStorage (storageId: string) {
  return useQuery({
    queryKey: ["stock-by-storage", storageId],
    queryFn: async () => {
      try {
        const response = await getProductStockByStorage({ storageId });
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

export function useUpdateProductStock() {
    const queryClient = useQueryClient();

    const updateProductStock = ({productId, storageId}:{productId: string, storageId: string}) => {
        queryClient.setQueryData(["products-stock"], (oldData: OutgoingProducStockForm[] ) => {
            if (!oldData) return oldData;
            return oldData.map((product: OutgoingProducStockForm) =>
                product.id === productId ? { ...product, storageId} : product
            );
        });
    };

    return { updateProductStock };
}

export function useUpdateProductStockByStorage() {
  const queryClient = useQueryClient();
  const updateProductStock = async ({storageId}:{storageId: string}) => {
      try {
          // Call the action to update the product stock by storage
          const response = await getProductStockByStorage({ storageId });
          if (!response || "error" in response) {
            throw new Error(response?.error || "No se recibió respuesta");
          }
          const newData = ToOutgoingStockForm(response);
          // Update the query data
          queryClient.setQueryData(["product-stock-by-storage"], (oldData: OutgoingProducStockForm[] ) => {
              if (!oldData) return oldData;
              return ToOutgoingStockForm(newData);
              // return oldData.map((product: OutgoingProducStockForm) =>
              //     product.id === productId ? { ...product, storageId} : product
              // );
          });
      } catch (error) {
          const message = error instanceof Error ? error.message : "Error desconocido";
          toast.error(message);
      }
  };

  const cleanProductStock = ()=>{
    queryClient.setQueryData(["product-stock-by-storage"], []);
  }

  return { updateProductStock, cleanProductStock };
}
