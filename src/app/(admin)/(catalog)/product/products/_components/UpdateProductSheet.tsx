"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { updateProductSchema, UpdateProductInput, Product } from "../_interfaces/products.interface";
import { PencilIcon, RefreshCcw } from "lucide-react";
import { useProducts } from "../_hooks/useProduct";
import { AutoComplete, Option } from "@/components/ui/autocomplete";
import { useCategories } from "../../category/_hooks/useCategory";
import { useTypeProducts } from "../../product-types/hook/useType";
import LoadingDialogForm from "./LoadingDialogForm";
import GeneralErrorMessage from "./GeneralErrorMessage";
import { Textarea } from "@/components/ui/textarea";

interface UpdateProductSheetProps {
  product: Product;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}

export function UpdateProductSheet({
  product,
  open: controlledOpen,
  onOpenChange,
  showTrigger = true
}: UpdateProductSheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const { updateMutation } = useProducts();

  // Use controlled state if props are provided, otherwise use internal state
  const isOpen = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  // const { oneProductQuery } = useProducts();
  // if (oneProductQuery.isLoading) {
  //   return <LoadingDialogForm />;
  // } else{
  //   if (oneProductQuery.isError) {
  //     return (<GeneralErrorMessage error={oneProductQuery.error} reset={oneProductQuery.refetch} />);
  //   }
  //   if (!oneProductQuery.data) {
  //     return <GeneralErrorMessage error={new Error("No se encontró el producto")} reset={oneProductQuery.refetch} />;
  //   }
  // }

  // export const updateProductSchema = z.object({
  //   categoriaId: z.string().uuid().optional(),
  //   tipoProductoId: z.string().uuid().optional(),
  //   name: z.string().min(1, "El nombre es requerido").optional(),
  //   precio: z.number().min(0, "El precio no puede ser negativo").optional(),
  //   unidadMedida: z.string().optional(),
  //   proveedor: z.string().optional(),
  //   uso: z.string().optional(),
  //   usoProducto: z.string().optional(),
  //   description: z.string().optional(),
  //   codigoProducto: z.string().optional(),
  //   descuento: z.number().optional(),
  //   observaciones: z.string().optional(),
  //   condicionesAlmacenamiento: z.string().optional(),
  //   imagenUrl: z.string().url().optional(),
  // }) satisfies z.ZodType<UpdateProductDto>;

  const form = useForm<UpdateProductInput>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      categoriaId: product.categoriaId ?? "",
      tipoProductoId: product.tipoProductoId ?? "",
      name: product.name ?? "",
      precio: product.precio ?? 0,
      unidadMedida: product.unidadMedida ?? "",
      proveedor: product.proveedor ?? "",
      uso: product.uso ?? "",
      usoProducto: product.usoProducto ?? "",
      description: product.description ?? "",
      codigoProducto: product.codigoProducto ?? "",
      descuento: product.descuento ?? 0,
      observaciones: product.observaciones ?? "",
      condicionesAlmacenamiento: product.condicionesAlmacenamiento ?? "",
      imagenUrl: product.imagenUrl ?? "",
    },
  });

  const onSubmit = async (data: UpdateProductInput) => {
    if (updateMutation.isPending) return;

    try {
      await updateMutation.mutateAsync({
        id: product.id,
        data,
      }, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
        onError: (error) => {
          console.error("Error al actualizar producto:", error);
          if (error.message.includes("No autorizado")) {
            setTimeout(() => {
              form.reset();
            }, 1000);
          }
        },
      });
    } catch (error) {
      // The error is already handled by the mutation
      console.error("Error in onSubmit:", error);
    }
  };

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
    <Sheet open={isOpen} onOpenChange={setOpen}>
      {showTrigger && (
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <PencilIcon className="size-4" aria-hidden="true" />
          </Button>
        </SheetTrigger>
      )}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Actualizar Producto</SheetTitle>
          <SheetDescription>
            Actualiza la información del producto y guarda los cambios
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="p-2 sm:p-1 overflow-auto max-h-[calc(80dvh-4rem)] grid md:grid-cols-2 gap-4">
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
            </div>

              <SheetFooter>
                <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <SheetClose asChild>
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </SheetClose>
                  <Button 
                    type="submit" 
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? (
                      <>
                        <RefreshCcw className="mr-2 size-4 animate-spin" />
                        Actualizando...
                      </>
                    ) : (
                      "Actualizar"
                    )}
                  </Button>
                </div>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
