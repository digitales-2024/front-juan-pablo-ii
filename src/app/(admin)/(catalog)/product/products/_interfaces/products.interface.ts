
import { components } from "@/types/api";
import { Archive, LucideIcon, MoreHorizontal, ShoppingBag } from "lucide-react";
import { z } from "zod";

// Tipos base de la API
// export type ProductUsePrototype = components['schemas']['ProductUse'];
export type ProductUse = "VENTA" | "INTERNO" | "OTRO";
export type EnumConfig = {
  name: string;
  backgroundColor: string;
  textColor: string;
  hoverBgColor: string;
  hoverTextColor?:string
  importantBgColor?: string;
  importantHoverBgColor?: string;
  importantTextColor?: string;
  importantHoverTextColor?: string;
  icon: LucideIcon;
}
export type Product = components['schemas']['Product'];
export type DetailedProduct = components['schemas']['ProductWithRelations'];
export type CreateProductDto = components['schemas']['CreateProductDto'];
export type UpdateProductDto = components['schemas']['UpdateProductDto'];
export type DeleteProductDto = components['schemas']['DeleteProductDto'];
export type ActiveProductPrototype = components['schemas']['ActiveProduct'];
export type ActiveProductCategory = components['schemas']['ActiveProductCategory'];
export type ActiveProductType = components['schemas']['ActiveProductTypeProduct'];

export type ProductSearchPrototype= components['schemas']['ProductSearch'];
export type ProductSearch = {
  id: string;
  name: string;
}

export const productUseOptions: Record<ProductUse, {
  label: string;
  value: ProductUse;
}> = {
  VENTA: {
    label: "Venta",
    value: "VENTA",
  },
  INTERNO: {
    label: "Uso interno",
    value: "INTERNO",
  },
  OTRO: {
    label: "Otro",
    value: "OTRO",
  },
}

export const productUseEnumConfig: Record<ProductUse, EnumConfig> = {
  VENTA: {
    name: "Venta",
    backgroundColor: "bg-[#a7f3d0]",
    textColor: "text-[#065f46]",
    hoverBgColor: "hover:bg-[#86efac]",
    icon: ShoppingBag,
  },
  INTERNO: {
    name: "Uso interno",
    backgroundColor: "bg-[#c7d2fe]",
    textColor: "text-[#3730a3]",
    hoverBgColor: "hover:bg-[#a5b4fc]",
    icon: Archive,
  },
  OTRO: {
    name: "Otro",
    backgroundColor: "bg-[#cbd5e1]",
    textColor: "text-[#334155]",
    hoverBgColor: "hover:bg-[#94a3b8]",
    icon: MoreHorizontal,
  },
}


//Es necesario crear tipos explicitos para tipos anidados autogenerados para evitar errores de compilación y errores en tiempo de ejecución
export type ActiveProduct = {
  id: string;
  name: string;
  precio: number;
  categoriaId: string;
  tipoProductoId: string;
  codigoProducto: string;
  unidadMedida: string;
  uso: "VENTA" | "INTERNO" | "OTRO";
  categoria: ActiveProductCategory;
  tipoProducto: ActiveProductType;
}

// Podemos usar el mismo DTO que delete ya que la estructura es idéntica
export type ReactivateProductDto = DeleteProductDto;

// Interfaz para la tabla extendiendo el tipo base
export interface ProductTableItem extends DetailedProduct {
  selected?: boolean;
}

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
export const createProductSchema = z.object({
  categoriaId: z.string().min(1, "La categoría es requerida").uuid(),
  tipoProductoId: z.string().min(1, "El tipo de producto es requerido").uuid(),
  name: z.string().min(1, "El nombre es requerido"),
  precio: z.coerce.number({
    required_error: "El precio es requerido",
    invalid_type_error: "El precio debe ser un número"
  }).min(0).nonnegative(),
  unidadMedida: z.string().optional(),
  proveedor: z.string().optional(),
  uso: z.enum(["VENTA", "INTERNO", "OTRO"]),
  usoProducto: z.string().optional(),
  description: z.string().optional(),
  codigoProducto: z.string().min(1, "El código de producto es requerido"),
  descuento: z.coerce.number().nonnegative().optional(),
  observaciones: z.string().optional(),
  condicionesAlmacenamiento: z.string().optional(),
  imagenUrl: z.string().url().optional(),
}) satisfies z.ZodType<CreateProductDto>;

// type UpdateProductDto = {
//   categoriaId?: string;
//   tipoProductoId?: string;
//   name?: string;
//   precio?: number;
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

export const updateProductSchema = z.object({
  categoriaId: z.string().uuid().optional(),
  tipoProductoId: z.string().uuid().optional(),
  name: z.string().min(1, "El nombre es requerido").optional(),
  precio: z.coerce.number().min(0, "El precio no puede ser negativo").optional(),
  unidadMedida: z.string().optional(),
  proveedor: z.string().optional(),
  uso: z.enum(["VENTA", "INTERNO", "OTRO"]).optional(),
  usoProducto: z.string().optional(),
  description: z.string().optional(),
  codigoProducto: z.string().optional(),
  descuento: z.coerce.number().nonnegative().optional(),
  observaciones: z.string().optional(),
  condicionesAlmacenamiento: z.string().optional(),
  imagenUrl: z.string().url().optional(),
}) satisfies z.ZodType<UpdateProductDto>;

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
