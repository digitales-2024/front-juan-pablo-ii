// StateManager/index.tsx
import { useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
//import { MovementDto } from "../_interfaces/income.interface";
// import { ActiveProduct } from "@/app/(admin)/(catalog)/product/products/_interfaces/products.interface";
import { type StockByStorage as Stock} from "../_interfaces/stock.interface";
//import { useStock } from "./useStock";
import { getStockByProduct, getStockByStorage, getStockByStorageProduct, getStockForAllStorages } from "../_actions/stock.actions";
import { toast } from "sonner";
// type MovementDto = {
//     productId: string;
//     quantity: number;
//     date?: string;
//     state?: boolean;
// }
// interface ProductSelected extends MovementDto {
//   name: string;
// }

// type State = Stock[];
type Action =
  | { type: "ALL_STORAGES" }
  | { type: "BY_STORAGE"; payload: { storageId: string }}
  | { type: "BY_PRODUCT"; payload: { productId: string }}
  | { type: "BY_STORAGE_N_PRODUCT"; payload: { productId: string, storageId: string }}
  | { type: "clear" };

// function reducer(state: State, action: Action): Stock[] {
//     const {stockAllStoragesQuery, stockByProductQuery, stockByStorageNProductQuery, stockByStorageQuery} = useStock();
//   switch (action.type) {
//     case "BY_STORAGE": {
//         const data = stockByStorageQuery(action.payload.storageId).data;
//         if(data){
//             return data;
//         }
//         return [];
//     }
//     case "BY_PRODUCT":{
//         const data = stockByProductQuery(action.payload.productId).data;
//         if(data){
//             return data;
//         }
//         return [];
//     }
//     case "BY_STORAGE_N_PRODUCT":{
//         const data = stockByStorageNProductQuery({
//             productId: action.payload.productId,
//             storageId: action.payload.storageId
//         }).data;
//         if(data){
//             return data;
//         }
//         return [];
//     }
//     case "ALL_STORAGES":{
//         const data = stockAllStoragesQuery.data;
//         if(data){
//             return data;
//         }
//         return [];
//     }
//     default:{
//         const data = stockAllStoragesQuery.data;
//         if(data){
//             return data;
//         }
//         return [];
//     }
//   }
// }

  // Query para obtener los productos
  const stockAllStoragesQuery = useQuery({
    queryKey: ["stock-storages"],
    queryFn: async () => {
      try {
        const response = await getStockForAllStorages();
        if ("error" in response) {
          throw new Error(response.error);
        }
        if (!response) {
          throw new Error("No se recibió respuesta del servidor");
        }
        return response;
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
        toast.error("Error desconocido");
        ;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const stockByProductQuery = (productId: string)=>{
    return useQuery({
      queryKey: ["stock-by-product", productId], // replace "product-id" with the actual product id
      queryFn: async () => {
        try {
          const response = await getStockByProduct(productId);
          if ("error" in response) {
            throw new Error(response.error);
          }
          if (!response) {
            throw new Error("No se recibió respuesta del servidor");
          }
          return response;
        } catch (error) {
          if (error instanceof Error) toast.error(error.message);
          toast.error("Error desconocido");
          ;
        }
      },
      staleTime: 1000 * 60 * 5, // 5 minutos
    });
  }

  const stockByStorageQuery = (storageId: string)=>{
    return useQuery({
      queryKey: ["stock-by-storage", storageId], // replace "product-id" with the actual product id
      queryFn: async () => {
        try {
          const response = await getStockByStorage(storageId);
          if ("error" in response) {
            throw new Error(response.error);
          }
          if (!response) {
            throw new Error("No se recibió respuesta del servidor");
          }
          return response;
        } catch (error) {
          if (error instanceof Error) toast.error(error.message);
          toast.error("Error desconocido");
          ;
        }
      },
      staleTime: 1000 * 60 * 5, // 5 minutos
    });
  }

  const stockByStorageNProductQuery = ({storageId, productId}: {storageId:string, productId:string})=>{
    return useQuery({
      queryKey: ["stock-by-storage-n-product", {storageId, productId}], // replace "product-id" with the actual product id
      queryFn: async () => {
        try {
          const response = await getStockByStorageProduct({storageId, productId});
          if ("error" in response) {
            throw new Error(response.error);
          }
          if (!response) {
            throw new Error("No se recibió respuesta del servidor");
          }
          return response;
        } catch (error) {
          if (error instanceof Error) toast.error(error.message);
          toast.error("Error desconocido");
          ;
        }
      },
      staleTime: 1000 * 60 * 5, // 5 minutos
    });
  }


function reducer( action: Action): UseQueryResult<Stock[] | undefined, Error> {
    //const {stockAllStoragesQuery, stockByProductQuery, stockByStorageNProductQuery, stockByStorageQuery} = useStock();
  switch (action.type) {
    case "BY_STORAGE": {
        return stockByStorageQuery(action.payload.storageId);
    }
    case "BY_PRODUCT":{
        return stockByProductQuery(action.payload.productId);
    }
    case "BY_STORAGE_N_PRODUCT":{
        return stockByStorageNProductQuery({
            productId: action.payload.productId,
            storageId: action.payload.storageId
        });
    }
    case "ALL_STORAGES":{
        return stockAllStoragesQuery;
    }
    default:{
        return stockAllStoragesQuery;
    }
  }
}

const useFilteredStock = () => {
  const serverFilteredStock = useQuery<Stock[]>({
    queryKey: ["stock-server-filtered"],
    initialData: [],
  });

  return serverFilteredStock.data ?? [];
};

// const useFilterStockDispatch = () => {
//   const client = useQueryClient();
//   const dispatch = (action: Action) => {
//     client.setQueryData<Stock[]>(["stock-server-filtered"], () => {
//       const query = reducer(action);
//       // console.log('updatedData', newData);
//       return query.data;
//     });
//   };
//   return dispatch;
// };

const useFilterStockDispatch = () => {
  const dispatch = (action: Action) => {
    const query = reducer(action);
    return query;
  };
  return dispatch;
};

const updatedFilteredStock = (data: Stock[]) => {
    const client = useQueryClient();
    client.setQueryData<Stock[]>(["stock-server-filtered"], () => {
        return data;
    });
}

const useStock = () => {
    return {stockAllStoragesQuery, stockByProductQuery, stockByStorageNProductQuery, stockByStorageQuery};
}

export { useFilteredStock, useFilterStockDispatch, updatedFilteredStock, useStock };
