"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import {
  Form,
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
import { useCallback, useEffect, useMemo } from "react";
import { useStorages } from "@/app/(admin)/(catalog)/storage/storages/_hooks/useStorages";
import { useProducts } from "@/app/(admin)/(catalog)/product/products/_hooks/useProduct";
import { CreateIncomeInput } from "../_interfaces/income.interface";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectProductDialog } from "./Movements/FormComponents/SelectMovementDialog";
import { Button } from "@/components/ui/button";
import { useSelectedProducts, useSelectProductDispatch } from "../_hooks/useSelectProducts";

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
  const { register, control, watch } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "movement",
    rules: {
      minLength: 1
    }
  });
  const watchFieldArray = watch("movement");
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index]
    };
  });
  // const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
  // const [productOptions, setproductOptions] = useState<Option[]>([]);
  const { activeStoragesQuery: responseStorage } = useStorages();
  const { activeProductsQuery: reponseProducts } = useProducts();
  const selectedProducts = useSelectedProducts();
  const dispatch = useSelectProductDispatch();

  const syncProducts = useCallback(() => {
    // Limpiar fields existentes
    remove();
    
    // Agregar nuevos productos
    selectedProducts.forEach(product => {
      append({
        productId: product.id,
        quantity: 1,
      });
    });
  }, [selectedProducts, append, remove]);

  useEffect(() => {
    syncProducts();
  }, [syncProducts]);

  const FORMSTATICS = useMemo(() => STATIC_FORM, []);
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

  const handleRemoveProduct = (index: number) => {
    dispatch(
      {
        type: "remove",
        payload: {
          productId: fields[index].productId
        }
      }
    )
    remove(index);
  }

  // const productOptions: Option[] = reponseProducts.data.map((typeProduct) => ({
  //   label: typeProduct.name,
  //   value: typeProduct.id,
  // }));

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

  // function totalCal(results) {
  //   let totalValue = 0
  
  //   for (const key in results) {
  //     for (const value in results[key]) {
  //       if (typeof results[key][value] === "string") {
  //         const output = parseInt(results[key][value], 10)
  //         totalValue = totalValue + (Number.isNaN(output) ? 0 : output)
  //       } else {
  //         totalValue = totalValue + totalCal(results[key][value], totalValue)
  //       }
  //     }
  //   }
  
  //   return totalValue
  // }
  
  // const Calc = ({ control, setValue }) => {
  //   const results = useWatch({ control, name: "test" })
  //   const output = totalCal(results)
  
  //   // isolated re-render to calc the result with Field Array
  //   console.log(results)
  
  //   setValue("total", output)
  
  //   return <p>{output}</p>
  // }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="p-2 sm:p-1 overflow-auto max-h-[calc(80dvh-4rem)] grid md:grid-cols-2 gap-4">
          {/* Campo Nombre */}
          <div className="col-span-2">
            <FormItem>
              <FormLabel>{FORMSTATICS.name.label}</FormLabel>
              <Input
                {...register(FORMSTATICS.name.name)}
                placeholder={FORMSTATICS.name.placeholder}
                type={FORMSTATICS.name.type}
              />
              <CustomFormDescription required={FORMSTATICS.name.required} />
              <FormMessage />
            </FormItem>
          </div>

          {/* Campo Storage - Mantener como controlled porque es un AutoComplete */}
          <FormField
            control={control}
            name={FORMSTATICS.storageId.name}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>{FORMSTATICS.storageId.label}</FormLabel>
                <AutoComplete
                  options={storageOptions}
                  placeholder={FORMSTATICS.storageId.placeholder}
                  emptyMessage={FORMSTATICS.storageId.emptyMessage!}
                  value={storageOptions.find((option) => option.value === field.value)}
                  onValueChange={(option) => field.onChange(option?.value || "")}
                />
                <CustomFormDescription required={FORMSTATICS.storageId.required} />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Movements Section */}
          <div className="col-span-2 w-full flex flex-col gap-2 justify-center items-center py-4">
            <SelectProductDialog data={reponseProducts.data}>
            </SelectProductDialog>
            <CustomFormDescription
              required={true}
            ></CustomFormDescription>
          </div>
          <div>
            {
              selectedProducts.map((product) => {
                // const data = selectedProducts.find((p) => p.id === product.id);
                return <div key={product.id} className="flex gap-4">
                  <span>{product.name}</span>
                  <span>{product.precio.toLocaleString(
                    "es-PE",
                    {
                      style: "currency",
                      currency: "PEN"
                    }
                  )}</span>
                </div>
              })
            }
          </div>
          <div className="col-span-2">
            {controlledFields.map((field, index) => {
              const data = selectedProducts.find((p) => p.id === field.productId);
              return <div key={field.id} className="flex gap-4 mb-4">
                <FormItem>
                  {/* <FormLabel>Producto</FormLabel> */}
                  <div>
                    <FormLabel>Nombre</FormLabel>
                    <span>{data?.name}</span>
                  </div>
                  <Input
                    disabled
                    {...register(`movement.${index}.productId` as const)}
                    type="hidden"
                  />
                  <FormMessage />
                </FormItem>
                <FormItem>
                  <FormLabel>Cantidad</FormLabel>
                  <Input
                    {...register(`movement.${index}.quantity` as const, {
                      valueAsNumber: true
                    })}
                    type="number"
                  />
                  <FormMessage />
                </FormItem>
                <div>
                  <FormLabel>Precio</FormLabel>
                  <span>{data?.precio.toLocaleString("es-PE",
                    {
                      style: "currency",
                      currency: "PEN"
                    })}</span>
                </div>
                <div>
                  <FormLabel>Total</FormLabel>
                  <span>{
                    isNaN(data!.precio * watchFieldArray[index].quantity) ? "S/ 0.00" : (data!.precio * watchFieldArray[index].quantity).toLocaleString("es-PE",
                                          {
                                            style: "currency",
                                            currency: "PEN"
                                          })
                    }
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={()=>handleRemoveProduct(index)}
                >
                  Eliminar
                </Button>
              </div>
            })}
            
            {/* <Button
              type="button"
              onClick={() => append({ 
                productId: '', 
                quantity: 0 
              })}
            >
              Agregar Movimiento
            </Button> */}
          </div>

          {/* Estado */}
          <div>
            <FormItem className="space-y-3">
              <FormLabel>{FORMSTATICS.state.label}</FormLabel>
              <RadioGroup className="flex flex-col space-y-1">
                {STATEPROP_OPTIONS.map(({label, value}, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <RadioGroupItem
                      {...register(FORMSTATICS.state.name)}
                      value={value}
                      id={`state-${value}`}
                    />
                    <FormLabel htmlFor={`state-${value}`}>{label}</FormLabel>
                  </div>
                ))}
              </RadioGroup>
              <CustomFormDescription required={FORMSTATICS.state.required} />
              <FormMessage />
            </FormItem>
          </div>

          {/* <FormField
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
          ></FormField> */}

          {/* Fecha */}
          <div>
            <FormItem>
              <FormLabel>{FORMSTATICS.date.label}</FormLabel>
              <Input
                {...register(FORMSTATICS.date.name)}
                type="date"
                placeholder={FORMSTATICS.date.placeholder}
              />
              <CustomFormDescription required={FORMSTATICS.date.required} />
              <FormMessage />
            </FormItem>
          </div>

          {/* Descripción */}
          <div className="col-span-2">
            <FormItem>
              <FormLabel>{FORMSTATICS.description.label}</FormLabel>
              <Textarea
                {...register(FORMSTATICS.description.name)}
                placeholder={FORMSTATICS.description.placeholder}
              />
              <CustomFormDescription required={FORMSTATICS.description.required} />
              <FormMessage />
            </FormItem>
          </div>
        </div>
        {children}
      </form>
    </Form>
  );
}