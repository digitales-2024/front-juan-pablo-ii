"use client";

import { UseFormReturn } from "react-hook-form";
import { CreateTypeStorageInput } from "../_interfaces/storageTypes.interface";
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
import { AutoComplete } from "@/components/ui/autocomplete";
import LoadingDialogForm from "./LoadingDialogForm";
import GeneralErrorMessage from "./errorComponents/GeneralErrorMessage";
import { useCategories } from "@/app/(admin)/(catalog)/product/category/_hooks/useCategory";
import { useTypeProducts } from "@/app/(admin)/(catalog)/product/product-types/_hooks/useType";
import { FORMSTATICS as STATIC_FORM } from "../_statics/forms";
import { Option } from "@/types/statics/forms";
import { CustomFormDescription } from "@/components/ui/custom/CustomFormDescription";
import DataDependencyErrorMessage from "./errorComponents/DataDependencyErrorMessage";
import { METADATA } from "../_statics/metadata";
import { useMemo } from "react";

interface CreateProductFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateTypeStorageInput>;
  onSubmit: (data: CreateTypeStorageInput) => void;
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
  const FORMSTATICS = useMemo(() => STATIC_FORM, []);

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

  if (
    METADATA.dataDependencies &&
    (responseCategories.data.length === 0 ||
      responseTypeProducts.activeData.length === 0)
  ) {
    return (
      <DataDependencyErrorMessage
        error={
          new Error(
            `No existe la información necesaria. Revisar presencia de información en: ${METADATA.dataDependencies
              .map((dependency) => dependency.dependencyName)
              .join(", ")}`
          )
        }
        dataDependencies={METADATA.dataDependencies}
      />
    );
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="p-2 sm:p-1 overflow-auto max-h-[calc(80dvh-4rem)] grid md:grid-cols-2 gap-4">
          {/* <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingresa el nombre" {...field}/>
                  </FormControl>
                  <CustomFormDescription required={FORMSTATICS.name.required}></CustomFormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
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
          {/* Campo de Sucursal */}
          <FormField
              control={form.control}
              name={FORMSTATICS.branchId.name}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel htmlFor={FORMSTATICS.branchId.name}>{FORMSTATICS.branchId.label}</FormLabel>
                  <FormControl>
                    <AutoComplete
                      options={categoryOptions}
                      placeholder={FORMSTATICS.branchId.placeholder}
                      emptyMessage={FORMSTATICS.branchId.emptyMessage!}
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
                  <CustomFormDescription required={FORMSTATICS.branchId.required}></CustomFormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Campo de tipo de producto */}
            <FormField
              control={form.control}
              name={FORMSTATICS.staffId.name}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>
                    {FORMSTATICS.staffId.label}
                  </FormLabel>
                  <FormControl>
                    <AutoComplete
                      options={typeProductOptions}
                      placeholder={FORMSTATICS.staffId.placeholder}
                      emptyMessage={FORMSTATICS.staffId.emptyMessage!}
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
                  <CustomFormDescription required={FORMSTATICS.staffId.required}></CustomFormDescription>
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
                  <CustomFormDescription required={FORMSTATICS.description.required}></CustomFormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        {children}
      </form>
    </Form>
  );
}
