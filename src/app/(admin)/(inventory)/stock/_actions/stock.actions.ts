"use server";
import { http } from "@/utils/serverFetch";
import { StockByStorage } from "../_interfaces/stock.interface";
// import { BaseApiResponse } from "@/types/api/types";
// import { z } from "zod";
// import { createSafeAction } from "@/utils/createSafeAction";

// export type ProductResponse = BaseApiResponse<Product> | { error: string };
// export type DetailedProductResponse = BaseApiResponse<DetailedProduct> | { error: string };
// export type ListProductResponse = Product[] | { error: string };
// export type ListDetailedProductResponse = DetailedProduct[] | { error: string };
export type GeneralStockResponse = StockByStorage[] | { error: string };
export type StockByProduct = GeneralStockResponse
export type StockForAllStorages = GeneralStockResponse
export type StockByStorageProduct = GeneralStockResponse

// const GetStockSchema = z.object({});

// const GetProductByIdSchema = z.string();

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

// /**
//  * Crea un nuevo producto en el catálogo.
//  *
//  * Crea un nuevo producto en el catálogo.
//  *
//  * @param data - Un objeto con la información del producto a crear.
//  * @returns Un objeto con una propiedad `data` que contiene el producto creado,
//  *          o un objeto con una propiedad `error` que contiene un mensaje de error.
//  */
// export async function createProduct(
//   data: CreateProductDto
// ): Promise<ProductResponse> {
//     try {
//         const [responseData, error] = await http.post<ProductResponse>("/product", data);

//         if (error) {
//             return { error: error.message };
//         }

//         return responseData;
//     } catch (error) {
//         if (error instanceof Error) return { error: error.message };
//         return { error: "Error desconocido" };
//     }
// }

// /**
//  * Actualiza un producto en el catálogo.
//  *
//  * @param id - El identificador único del producto a actualizar.
//  * @param data - Un objeto con la información del producto a actualizar.
//  * @returns Un objeto con una propiedad `data` que contiene el producto actualizado,
//  *          o un objeto con una propiedad `error` que contiene un mensaje de error.
//  */
// export async function updateProduct(
//   id: string,
//   data: UpdateProductDto
// ): Promise<ProductResponse> {
//   try {
//     const [responseData, error] = await http.patch<ProductResponse>(`/product/${id}`, data);

//     if (error) {
//       return { error: error.message };
//     }

//     return responseData;
//   } catch (error) {
//     if (error instanceof Error) return { error: error.message };
//     return { error: "Error desconocido" };
//   }
// }

// /**
//  * Elimina uno o varios productos del catálogo.
//  *
//  * @param data - Un objeto con la información de los productos a eliminar.
//  * @returns Un objeto con una propiedad `data` que contiene la respuesta del servidor,
//  *          o un objeto con una propiedad `error` que contiene un mensaje de error.
//  */
// export async function deleteProduct(data: DeleteProductDto): Promise<ProductResponse> {
//   try {
//     const [response, error] = await http.delete<BaseApiResponse>("/product/remove/all", data);

//     if (error) {
//       if (error.statusCode === 401) {
//         return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
//       }
//       return { error: error.message };
//     }

//     return response;
//   } catch (error) {
//     if (error instanceof Error) return { error: error.message };
//     return { error: "Error desconocido al eliminar los productos" };
//   }
// }

// /**
//  * Reactiva uno o varios productos en el catálogo.
//  *
//  * @param data - Un objeto con la información de los productos a reactivar.
//  * @returns Un objeto con una propiedad `data` que contiene la respuesta del servidor,
//  *          o un objeto con una propiedad `error` que contiene un mensaje de error.
//  */
// export async function reactivateProduct(data: DeleteProductDto): Promise<ProductResponse> {
//   try {
//     const [response, error] = await http.patch<BaseApiResponse>("/product/reactivate/all", data);

//     if (error) {
//       if (error.statusCode === 401) {
//         return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
//       }
//       return { error: error.message };
//     }

//     return response;
//   } catch (error) {
//     if (error instanceof Error) return { error: error.message };
//     return { error: "Error desconocido al reactivar los productos" };
//   }
// }
