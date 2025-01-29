"use client";

import { UseFormReturn } from "react-hook-form";
import { CreateProductInput } from "../_interfaces/products.interface";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AutoComplete, Option } from "@/components/ui/autocomplete";
import LoadingDialogForm from "./LoadingDialogForm";
import { useCategories } from "../../category/_hooks/useCategory";
import GeneralErrorMessage from "./GeneralErrorMessage";
import { useTypeProducts } from "../../product-types/hook/useType";

interface CreateProductFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateProductInput>;
  onSubmit: (data: CreateProductInput) => void;
}

// export const createProductSchema = z.object({
//   categoriaId: z.string().min(1, "La categoría es requerida"),
//   tipoProductoId: z.string().min(1, "El tipo de producto es requerido"),
//   name: z.string().min(1, "El nombre es requerido"),
//   precio: z.number().min(0, "El precio no puede ser negativo"),
//   unidadMedida: z.string().optional(),
//   proveedor: z.string().optional(),
//   uso: z.string().optional(),
//   usoProducto: z.string().optional(),
//   description: z.string().optional(),
//   codigoProducto: z.string().optional(),
//   descuento: z.number().optional(),
//   observaciones: z.string().optional(),
//   condicionesAlmacenamiento: z.string().optional(),
//   imagenUrl: z.string().optional(),
// }) satisfies z.ZodType<CreateProductDto>;

export function CreateProductForm({
  children,
  form,
  onSubmit,
}: CreateProductFormProps) {
  // const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
  // const [typeProductOptions, setTypeProductOptions] = useState<Option[]>([]);

  const { activeCategoriesQuery: responseCategories } = useCategories();
  const responseTypeProducts = useTypeProducts();

  if (responseCategories.isLoading && responseTypeProducts.activeIsLoading) {
    return <LoadingDialogForm />;
  } else{
    if (responseCategories.isError) {
      return (<GeneralErrorMessage error={responseCategories.error} reset={responseCategories.refetch} />);
    }
    if (!responseCategories.data) {
      return <GeneralErrorMessage error={new Error("No se encontraron categorías")} reset={responseCategories.refetch} />;
    }
    if (responseTypeProducts.activeIsError) {
      return responseTypeProducts.activeError ? (<GeneralErrorMessage error={responseTypeProducts.activeError} reset={responseTypeProducts.activeRefetch} />) : null;
    }
    if (!responseTypeProducts.activeData) {
      return <GeneralErrorMessage error={new Error("No se encontraron subcategorías")} reset={responseTypeProducts.activeRefetch} />;
    }
  }

  const categoryOptions:Option[] = responseCategories.data.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const typeProductOptions:Option[] = responseTypeProducts.activeData.map((typeProduct) => ({
    label: typeProduct.name,
    value: typeProduct.id,
  }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {
          (<div className="p-2 sm:p-1 overflow-auto max-h-[calc(80dvh-4rem)] grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del producto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="codigoProducto"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Código del producto</FormLabel>
                  <FormControl>
                    <Input placeholder="Código del producto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="precio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <Input placeholder="Precio sin descuentos" {...field} type="number"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descuento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descuento</FormLabel>
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Input placeholder="Descuento del producto" {...field} type="number"/>
                    </FormControl>
                    <div className="text-muted-foreground">%</div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo de categoría */}
            <FormField
              control={form.control}
              name="categoriaId"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel htmlFor="categoryId">Categoría</FormLabel>
                  <FormControl>
                    <AutoComplete
                      options={categoryOptions}
                      placeholder="Selecciona una categoría"
                      emptyMessage="No se encontraron categorías"
                      value={
                        categoryOptions.find(
                          (option) => option.value === field.value
                        ) ?? undefined
                      }
                      onValueChange={(option) => {
                        field.onChange(option?.value || "");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Campo de tipo de producto */}
            <FormField
              control={form.control}
              name="tipoProductoId"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel htmlFor="typeProductId">
                    Tipo de Producto
                  </FormLabel>
                  <FormControl>
                    <AutoComplete
                      options={typeProductOptions}
                      placeholder="Selecciona un tipo de producto"
                      emptyMessage="No se encontraron tipos de productos"
                      value={
                        typeProductOptions.find(
                          (option) => option.value === field.value
                        ) ?? undefined
                      }
                      onValueChange={(option) => {
                        field.onChange(option?.value || "");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unidadMedida"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidad de medida</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Unidad de medida (ml, kg, caja, etc.)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="proveedor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proveedor</FormLabel>
                  <FormControl>
                    <Input placeholder="Proveedor del producto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="uso"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>¿Para quién?</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Paciente, cliente, personal, etc."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="usoProducto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ámbito de uso</FormLabel>
                  <FormControl>
                    <Input placeholder="Venta, uso interno, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imagenUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de la imagen</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="URL de la imagen del producto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción del producto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observaciones"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Observaciones</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observaciones del producto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="condicionesAlmacenamiento"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Condiciones de almacenamiento</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Condiciones de almacenamiento del producto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>)
        }
        {children}
      </form>
    </Form>
  );
}
