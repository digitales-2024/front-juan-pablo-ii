import { components } from "@/types/api";
// import { z } from "zod";

// Tipos para el modulo stock
export type StockByStoragePrototype = components['schemas']['StockByStorage'];
export type ProductStockResponsePrototype = components['schemas']['ProductStockResponse'];
export type ProductStock = {
  idProduct: string;
  name: string;
  unit: string;
  price: number;
  stock: number;
  totalPrice: number;
}
export type StockByStorage = {
  idStorage: string;
  name: string;
  location: string;
  address: string;
  staff: string;
  description: string;
  stock: ProductStock[];
}

// Tipos para el modulo Outgoing
export type StorageStockPrototype = components['schemas']['StockStorage']
export type StockStorage = {
  id: string;
  name: string;
}
export type ProductStockDataPrototype = components['schemas']['StockProduct']
export type ProductStockData = {
  stock: number;
  isActive: boolean;
  Storage: StockStorage;
}
export type OutgoingProductStockPrototype = components['schemas']['ProductStock']
export type OutgoingProductStock = {
  id: string;
  name: string;
  precio: number;
  codigoProducto: string;
  unidadMedida: string;
  Stock: ProductStockData[];
}

export interface OutgoingProducStockForm extends OutgoingProductStock{
  storageId: string;
}


// export type CreateProductDto = components['schemas']['CreateProductDto'];
// export type UpdateProductDto = components['schemas']['UpdateProductDto'];
// export type DeleteProductDto = components['schemas']['DeleteProductDto'];

// // Podemos usar el mismo DTO que delete ya que la estructura es idéntica
// export type ReactivateProductDto = DeleteProductDto;

// // Interfaz para la tabla extendiendo el tipo base
// export interface ProductTableItem extends DetailedProduct {
//   selected?: boolean;
// }

// Schema de validación para crear/actualizar producto
// type CreateProductDto = {
//   categoriaId: string;
//   tipoProductoId: string;
//   name: string;
//   precio: number;
//   unidadMedida?: string;
//   proveedor?: string;
//   uso?: string;
//   usoProducto?: string;
//   description?: string;
//   codigoProducto?: string;
//   descuento?: number;
//   observaciones?: string;
//   condicionesAlmacenamiento?: string;
//   imagenUrl?: string;
// }
// export const createProductSchema = z.object({
//   categoriaId: z.string().min(1, "La categoría es requerida").uuid(),
//   tipoProductoId: z.string().min(1, "El tipo de producto es requerido").uuid(),
//   name: z.string().min(1, "El nombre es requerido"),
//   precio: z.coerce.number({
//     required_error: "El precio es requerido",
//     invalid_type_error: "El precio debe ser un número"
//   }).min(0).nonnegative(),
//   unidadMedida: z.string().optional(),
//   proveedor: z.string().optional(),
//   uso: z.string().optional(),
//   usoProducto: z.string().optional(),
//   description: z.string().optional(),
//   codigoProducto: z.string().min(1, "El código de producto es requerido"),
//   descuento: z.coerce.number().nonnegative().optional(),
//   observaciones: z.string().optional(),
//   condicionesAlmacenamiento: z.string().optional(),
//   imagenUrl: z.string().url().optional(),
// }) satisfies z.ZodType<CreateProductDto>;

// // type UpdateProductDto = {
// //   categoriaId?: string;
// //   tipoProductoId?: string;
// //   name?: string;
// //   precio?: number;
// //   unidadMedida?: string;
// //   proveedor?: string;
// //   uso?: string;
// //   usoProducto?: string;
// //   description?: string;
// //   codigoProducto?: string;
// //   descuento?: number;
// //   observaciones?: string;
// //   condicionesAlmacenamiento?: string;
// //   imagenUrl?: string;
// // }

// export const updateProductSchema = z.object({
//   categoriaId: z.string().uuid().optional(),
//   tipoProductoId: z.string().uuid().optional(),
//   name: z.string().min(1, "El nombre es requerido").optional(),
//   precio: z.coerce.number().min(0, "El precio no puede ser negativo").optional(),
//   unidadMedida: z.string().optional(),
//   proveedor: z.string().optional(),
//   uso: z.string().optional(),
//   usoProducto: z.string().optional(),
//   description: z.string().optional(),
//   codigoProducto: z.string().optional(),
//   descuento: z.coerce.number().nonnegative().optional(),
//   observaciones: z.string().optional(),
//   condicionesAlmacenamiento: z.string().optional(),
//   imagenUrl: z.string().url().optional(),
// }) satisfies z.ZodType<UpdateProductDto>;

// export type CreateProductInput = z.infer<typeof createProductSchema>;
// export type UpdateProductInput = z.infer<typeof updateProductSchema>;
