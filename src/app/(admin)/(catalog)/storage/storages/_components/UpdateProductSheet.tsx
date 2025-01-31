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
import {
  updateProductSchema,
  UpdateProductInput,
  Product,
} from "../_interfaces/products.interface";
import { PencilIcon, RefreshCcw } from "lucide-react";
import { useProducts } from "../_hooks/useProduct";
import { AutoComplete } from "@/components/ui/autocomplete";
import { useCategories } from "@/app/(admin)/(catalog)/product/category/_hooks/useCategory";
import { useTypeProducts } from "@/app/(admin)/(catalog)/product/product-types/_hooks/useType";
import LoadingDialogForm from "./LoadingDialogForm";
import GeneralErrorMessage from "./errorComponents/GeneralErrorMessage";
import { Textarea } from "@/components/ui/textarea";
import { Option } from "@/types/statics/forms";
import { UPDATEFORMSTATICS as FORMSTATICS} from "../_statics/forms";
import { CustomFormDescription } from "@/components/ui/custom/CustomFormDescription";

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
  showTrigger = true,
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
      categoriaId:
        product.categoriaId ?? FORMSTATICS.categoriaId.defaultValue,
      tipoProductoId:
        product.tipoProductoId ?? FORMSTATICS.tipoProductoId.defaultValue,
      name: product.name ?? FORMSTATICS.name.defaultValue,
      precio: product.precio ?? FORMSTATICS.precio.defaultValue,
      unidadMedida:
        product.unidadMedida ?? FORMSTATICS.unidadMedida.defaultValue,
      proveedor: product.proveedor ?? FORMSTATICS.proveedor.defaultValue,
      uso: product.uso ?? FORMSTATICS.uso.defaultValue,
      usoProducto:
        product.usoProducto ?? FORMSTATICS.usoProducto.defaultValue,
      description:
        product.description ?? FORMSTATICS.description.defaultValue,
      codigoProducto:
        product.codigoProducto ?? FORMSTATICS.codigoProducto.defaultValue,
      descuento: product.descuento ?? FORMSTATICS.descuento.defaultValue,
      observaciones:
        product.observaciones ?? FORMSTATICS.observaciones.defaultValue,
      condicionesAlmacenamiento:
        product.condicionesAlmacenamiento ??
        FORMSTATICS.condicionesAlmacenamiento.defaultValue,
      imagenUrl: product.imagenUrl ?? FORMSTATICS.imagenUrl.defaultValue,
    },
  });

  const onSubmit = async (data: UpdateProductInput) => {
    if (updateMutation.isPending) return;

    try {
      await updateMutation.mutateAsync(
        {
          id: product.id,
          data,
        },
        {
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
        }
      );
    } catch (error) {
      // The error is already handled by the mutation
      console.error("Error in onSubmit:", error);
    }
  };

  const { activeCategoriesQuery: responseCategories } = useCategories();
  const responseTypeProducts = useTypeProducts();
  if (responseCategories.isLoading && responseTypeProducts.activeIsLoading) {
    return <LoadingDialogForm />;
  } else {
    if (responseCategories.isError) {
      return (
        <GeneralErrorMessage
          error={responseCategories.error}
          reset={responseCategories.refetch}
        />
      );
    }
    if (!responseCategories.data) {
      return (
        <GeneralErrorMessage
          error={new Error("No se encontraron categorías")}
          reset={responseCategories.refetch}
        />
      );
    }
    if (responseTypeProducts.activeIsError) {
      return responseTypeProducts.activeError ? (
        <GeneralErrorMessage
          error={responseTypeProducts.activeError}
          reset={responseTypeProducts.activeRefetch}
        />
      ) : null;
    }
    if (!responseTypeProducts.activeData) {
      return (
        <GeneralErrorMessage
          error={new Error("No se encontraron subcategorías")}
          reset={responseTypeProducts.activeRefetch}
        />
      );
    }
  }

  const categoryOptions: Option[] = responseCategories.data.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const typeProductOptions: Option[] = responseTypeProducts.activeData.map(
    (typeProduct) => ({
      label: typeProduct.name,
      value: typeProduct.id,
    })
  );

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
                  name={FORMSTATICS.name.name}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{FORMSTATICS.name.label}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={FORMSTATICS.name.placeholder}
                          type={FORMSTATICS.name.type}
                        />
                      </FormControl>
                      <CustomFormDescription
                        required={FORMSTATICS.name.required}
                      ></CustomFormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={FORMSTATICS.codigoProducto.name}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{FORMSTATICS.codigoProducto.label}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={FORMSTATICS.codigoProducto.placeholder}
                        />
                      </FormControl>
                      <CustomFormDescription
                        required={FORMSTATICS.codigoProducto.required}
                      ></CustomFormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="precio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{FORMSTATICS.precio.label}</FormLabel>
                      <div className="flex items-center space-x-2">
                        <div className="text-muted-foreground">S/.</div>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={FORMSTATICS.precio.placeholder}
                            type={FORMSTATICS.precio.type}
                          />
                        </FormControl>
                      </div>
                      <CustomFormDescription
                        required={FORMSTATICS.precio.required}
                      ></CustomFormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={FORMSTATICS.descuento.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{FORMSTATICS.descuento.label}</FormLabel>
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={FORMSTATICS.descuento.placeholder}
                            type={FORMSTATICS.descuento.type}
                          />
                        </FormControl>
                        <div className="text-muted-foreground">%</div>
                      </div>
                      <FormMessage />
                      <CustomFormDescription
                        required={FORMSTATICS.descuento.required}
                      ></CustomFormDescription>
                    </FormItem>
                  )}
                />
                {/* Campo de categoría */}
                <FormField
                  control={form.control}
                  name={FORMSTATICS.categoriaId.name}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel htmlFor={FORMSTATICS.categoriaId.name}>
                        {FORMSTATICS.categoriaId.label}
                      </FormLabel>
                      <FormControl>
                        <AutoComplete
                          options={categoryOptions}
                          placeholder={FORMSTATICS.categoriaId.placeholder}
                          emptyMessage={FORMSTATICS.categoriaId.emptyMessage!}
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
                      <CustomFormDescription
                        required={FORMSTATICS.categoriaId.required}
                      ></CustomFormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Campo de tipo de producto */}
                <FormField
                  control={form.control}
                  name={FORMSTATICS.tipoProductoId.name}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{FORMSTATICS.tipoProductoId.label}</FormLabel>
                      <FormControl>
                        <AutoComplete
                          options={typeProductOptions}
                          placeholder={FORMSTATICS.tipoProductoId.placeholder}
                          emptyMessage={
                            FORMSTATICS.tipoProductoId.emptyMessage!
                          }
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
                      <CustomFormDescription
                        required={FORMSTATICS.tipoProductoId.required}
                      ></CustomFormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={FORMSTATICS.unidadMedida.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{FORMSTATICS.unidadMedida.label}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={FORMSTATICS.unidadMedida.placeholder}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <CustomFormDescription
                        required={FORMSTATICS.unidadMedida.required}
                      ></CustomFormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={FORMSTATICS.proveedor.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{FORMSTATICS.proveedor.label}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={FORMSTATICS.proveedor.placeholder}
                        />
                      </FormControl>
                      <FormMessage />
                      <CustomFormDescription
                        required={FORMSTATICS.proveedor.required}
                      ></CustomFormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={FORMSTATICS.usoProducto.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{FORMSTATICS.usoProducto.label}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={FORMSTATICS.usoProducto.placeholder}
                        />
                      </FormControl>
                      <CustomFormDescription
                        required={FORMSTATICS.usoProducto.required}
                      ></CustomFormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={FORMSTATICS.description.name}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{FORMSTATICS.description.label}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={FORMSTATICS.description.placeholder}
                        />
                      </FormControl>
                      <FormMessage />
                      <CustomFormDescription
                        required={FORMSTATICS.description.required}
                      ></CustomFormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={FORMSTATICS.observaciones.name}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{FORMSTATICS.observaciones.label}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={FORMSTATICS.observaciones.placeholder}
                        />
                      </FormControl>
                      <FormMessage />
                      <CustomFormDescription
                        required={FORMSTATICS.observaciones.required}
                      ></CustomFormDescription>
                      <FormMessage />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={FORMSTATICS.condicionesAlmacenamiento.name}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>
                        {FORMSTATICS.condicionesAlmacenamiento.label}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={
                            FORMSTATICS.condicionesAlmacenamiento.placeholder
                          }
                        />
                      </FormControl>
                      <CustomFormDescription
                        required={
                          FORMSTATICS.condicionesAlmacenamiento.required
                        }
                      ></CustomFormDescription>
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
                  <Button type="submit" disabled={updateMutation.isPending}>
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
