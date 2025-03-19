"use server";
import { http } from "@/utils/serverFetch";
import { OutgoingProductStock, StockByStorage } from "../_interfaces/stock.interface";
import { ProductUse } from "@/app/(admin)/(catalog)/product/products/_interfaces/products.interface";

export type GeneralStockResponse = StockByStorage[] | { error: string };
export type StockByProduct = GeneralStockResponse
export type StockForAllStorages = GeneralStockResponse
export type StockByStorageProduct = GeneralStockResponse

export type GeneralOutgoingProductStock = OutgoingProductStock[] | { error: string };

/**
 * Obtiene todos los productos del catálogo.
 *
 * @returns Un objeto con una propiedad `data` que contiene un array de objetos `Product`,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
export async function getStockByProduct (id:string) {
  try {
    const [stockList, error] = await http.get<GeneralStockResponse>(`/stock/product/${id}`);
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener el stock por producto",
      };
    }
    return stockList;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
};

// export const getStockByProducts = await createSafeAction(GetStockSchema, getStockByProductHandler);

export async function getStockForAllStorages() : Promise<GeneralStockResponse> {
  try {
    const [stockList, error] = await http.get<GeneralStockResponse>(`/stock/storages`);
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener el stock de todos los almacenes",
      };
    }
    return stockList;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
};

export async function getStockByStorage(id:string) : Promise<GeneralStockResponse> {
  try {
    const [stockList, error] = await http.get<GeneralStockResponse>(`/stock/storage/${id}`);
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener el stock de todos los almacenes",
      };
    }
    return stockList;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
};

export async function getStockByStorageProduct({ productId, storageId }: {storageId:string, productId:string}) : Promise<GeneralStockResponse> {
  try {
    const [stockList, error] = await http.get<GeneralStockResponse>(`/stock/storage/${storageId}/product/${productId}`);
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener el stock de todos los almacenes",
      };
    }
    return stockList;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
};

export async function getProductStock ({productId}: {productId:string}) : Promise<GeneralOutgoingProductStock> {
  try {
    const [stockList, error] = await http.get<GeneralOutgoingProductStock>(`/stock/availableProduct/${productId}`);
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener el stock de productos",
      };
    }
    return stockList;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

export async function getForSaleProductStock ({productUse}: {productUse:ProductUse}) : Promise<GeneralOutgoingProductStock> {
  try {
    const [stockList, error] = await http.get<GeneralOutgoingProductStock>(`/stock/availableProduct/byUse/${productUse}`);
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener el stock de productos",
      };
    }
    return stockList;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

export async function getForSaleProductStockAndBranch ({productUse, branchId}: {productUse:ProductUse, branchId: string}) : Promise<GeneralOutgoingProductStock> {
  try {
    const [stockList, error] = await http.get<GeneralOutgoingProductStock>(`/stock/availableProduct/byUse/${productUse}/branch/${branchId}`);
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener el stock de productos",
      };
    }
    return stockList;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

export async function getOneProductStockByStorage ({productId, storageId}: {productId:string, storageId: string}) : Promise<GeneralOutgoingProductStock> {
  try {
    const [stockList, error] = await http.get<GeneralOutgoingProductStock>(`/stock/availableProduct/${productId}/storage/${storageId}`);
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener el stock de productos",
      };
    }
    return stockList;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

export async function getManyProductsStockByStorage (params: {productId:string, storageId: string}[]) : Promise<GeneralOutgoingProductStock> {
  try {
    const [stockList, error] = await http.post<GeneralOutgoingProductStock>(`/stock/manyProductsByStorage`, params);
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener el stock de productos",
      };
    }
    return stockList;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

export async function getManyProductsStock (params: string[]) : Promise<GeneralOutgoingProductStock> {
  try {
    const [stockList, error] = await http.post<GeneralOutgoingProductStock>(`/stock/manyProducts`, params);
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener el stock de productos",
      };
    }
    return stockList;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

export async function getProductStockByStorage ({storageId}: {storageId:string}) : Promise<GeneralOutgoingProductStock> {
  try {
    const [stockList, error] = await http.get<GeneralOutgoingProductStock>(`/stock/availableProduct/storage/${storageId}`);
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener el stock de productos",
      };
    }
    return stockList;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

export async function getProductsStock (){
  try {
    const [stockList, error] = await http.get<GeneralOutgoingProductStock>(`/stock/availableProducts`);
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener el stock de productos",
      };
    }
    return stockList;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}
