"use client";

import { UseFormReturn } from "react-hook-form";
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
import { FORMSTATICS as STATIC_FORM } from "../_statics/forms";
import { Option } from "@/types/statics/forms";
import { CustomFormDescription } from "@/components/ui/custom/CustomFormDescription";
import DataDependencyErrorMessage from "./errorComponents/DataDependencyErrorMessage";
import { METADATA } from "../_statics/metadata";
import { useMemo } from "react";
import { useStorages } from "@/app/(admin)/(catalog)/storage/storages/_hooks/useStorages";
import { useProducts } from "@/app/(admin)/(catalog)/product/products/_hooks/useProduct";
import { CreateIncomeInput } from "../_interfaces/income.interface";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface CreateProductFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateIncomeInput>;
  onSubmit: (data: CreateIncomeInput) => void;
}

// export const createIncomeSchema = z.object({
//   name: z.string().min(1, "El nombre es requerido"), //En el back es opcional, pero considero que debe ser requerido
//   description: z.string().optional(),
//   storageId: z.string().min(1, "El tipo de almacenamiento es requerido"),
//   date: z.string().date("La fecha es requerida"),
//   state: z.boolean(),
//   referenceId: z.string().optional(),
//   movement: z.array(
//     z.object({
//       productId: z.string().min(1, "El producto es requerido"),
//       quantity: z.number().min(1, "La cantidad debe ser mayor a 0"),
//       date: z.string().optional(),
//       state: z.boolean().optional(),
//     })
//   ),
// }) satisfies z.ZodType<CreateIncomingDto>;

export function CreateIncomingForm({
  children,
  form,
  onSubmit,
}: CreateProductFormProps) {
  // const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
  // const [productOptions, setproductOptions] = useState<Option[]>([]);
  const STATEPROP_OPTIONS = useMemo(() => {
    return [
      {
        label: "En Proceso",
        value: "false",
      },
      {
        label: "Concretado",
        value: "true",
      },
    ];
  }, []);
  const { activeStoragesQuery: responseStorage } = useStorages();
  const { activeProductsQuery: reponseProducts } = useProducts();
  const FORMSTATICS = useMemo(() => STATIC_FORM, []);

  if (responseStorage.isLoading && reponseProducts.isLoading) {
    return <LoadingDialogForm />;
  } else {
    if (responseStorage.isError) {
      return (
        <GeneralErrorMessage
          error={responseStorage.error}
          reset={responseStorage.refetch}
        />
      );
    }
    if (!responseStorage.data) {
      return (
        <GeneralErrorMessage
          error={new Error("No se encontraron categorías")}
          reset={responseStorage.refetch}
        />
      );
    }
    if (reponseProducts.isError) {
      return reponseProducts.error ? (
        <GeneralErrorMessage
          error={reponseProducts.error}
          reset={reponseProducts.refetch}
        />
      ) : null;
    }
    if (!reponseProducts.data) {
      return (
        <GeneralErrorMessage
          error={new Error("No se encontraron subcategorías")}
          reset={reponseProducts.refetch}
        />
      );
    }
  }

  if (
    METADATA.dataDependencies &&
    (responseStorage.data.length === 0 || reponseProducts.data.length === 0)
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

  const storageOptions: Option[] = responseStorage.data.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const productOptions: Option[] = reponseProducts.data.map((typeProduct) => ({
    label: typeProduct.name,
    value: typeProduct.id,
  }));

  // name
  // description
  // storageId
  // date
  // state
  // referenceId
  // movement
  // {
  // productId
  // quantity
  // date
  // state
  // }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          {/* Campo de Almacén */}
          <FormField
            control={form.control}
            name={FORMSTATICS.storageId.name}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel htmlFor={FORMSTATICS.storageId.name}>
                  {FORMSTATICS.storageId.label}
                </FormLabel>
                <FormControl>
                  <AutoComplete
                    options={storageOptions}
                    placeholder={FORMSTATICS.storageId.placeholder}
                    emptyMessage={FORMSTATICS.storageId.emptyMessage!}
                    value={
                      storageOptions.find(
                        (option) => option.value === field.value
                      ) ?? undefined
                    }
                    onValueChange={(option) => {
                      field.onChange(option?.value || "");
                    }}
                  />
                </FormControl>
                <CustomFormDescription
                  required={FORMSTATICS.storageId.required}
                ></CustomFormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Campo de movimientos */}
          {/* <FormField
            control={form.control}
            name={FORMSTATICS.movement.name}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel htmlFor={FORMSTATICS.storageId.name}>
                  {FORMSTATICS.storageId.label}
                </FormLabel>
                <FormControl>
                  <AutoComplete
                    options={storageOptions}
                    placeholder={FORMSTATICS.storageId.placeholder}
                    emptyMessage={FORMSTATICS.storageId.emptyMessage!}
                    value={
                      storageOptions.find(
                        (option) => option.value === field.value
                      ) ?? undefined
                    }
                    onValueChange={(option) => {
                      field.onChange(option?.value || "");
                    }}
                  />
                </FormControl>
                <CustomFormDescription
                  required={FORMSTATICS.storageId.required}
                ></CustomFormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <FormField
            control={form.control}
            name={FORMSTATICS.state.name}
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="overflow-hidden text-ellipsis">{FORMSTATICS.state.label}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {STATEPROP_OPTIONS.map(({label, value}, idx) => (
                      <FormItem
                        key={idx}
                        className="flex items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={value} />
                        </FormControl>
                        <FormLabel className="font-normal">{label}</FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name={FORMSTATICS.date.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORMSTATICS.date.label}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={FORMSTATICS.date.placeholder}
                    type="date"
                  />
                </FormControl>
                <CustomFormDescription
                  required={FORMSTATICS.date.required}
                ></CustomFormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name={FORMSTATICS.state.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORMSTATICS.state.label}</FormLabel>
                <div className="flex items-center space-x-2">
                  <div className="text-muted-foreground">S/.</div>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={FORMSTATICS.state.placeholder}
                      type={FORMSTATICS.state.type}
                    />
                  </FormControl>
                </div>
                <CustomFormDescription
                  required={FORMSTATICS.state.required}
                ></CustomFormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}
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
        </div>
        {children}
      </form>
    </Form>
  );
}
