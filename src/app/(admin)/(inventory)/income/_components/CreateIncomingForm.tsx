"use client";

import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";
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
import { useCallback, useEffect, useMemo } from "react";
import { useStorages } from "@/app/(admin)/(catalog)/storage/storages/_hooks/useStorages";
import { useProducts } from "@/app/(admin)/(catalog)/product/products/_hooks/useProduct";
import { CreateIncomeInput } from "../_interfaces/income.interface";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectProductDialog } from "./Movements/FormComponents/SelectMovementDialog";
import { Button } from "@/components/ui/button";
import { useSelectedProducts, useSelectProductDispatch } from "../_hooks/useSelectProducts";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarIcon, Trash2 } from "lucide-react";
import { ActiveProduct } from "@/app/(admin)/(catalog)/product/products/_interfaces/products.interface";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { es } from "date-fns/locale";
import { toast } from "sonner";

interface CreateProductFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateIncomeInput>;
  controlledFieldArray: UseFieldArrayReturn<CreateIncomeInput>;
  onSubmit: (data: CreateIncomeInput) => void;
  onDialogClose?: () => void;
}

export function CreateIncomingForm({
  children,
  form,
  onSubmit,
  controlledFieldArray
}: CreateProductFormProps) {
  const { register, control, watch } = form;
  const { fields, append, remove } = controlledFieldArray;
  const watchFieldArray = watch("movement");
  const controlledFields = fields.map((field, index) => {
    const watchItem = watchFieldArray?.[index];
    return {
      ...field,
      ...(watchItem ?? {})
    };
  });
  const { activeStoragesQuery: responseStorage } = useStorages();
  const { activeProductsQuery: reponseProducts } = useProducts();
  const selectedProducts = useSelectedProducts();
  const dispatch = useSelectProductDispatch();

  const syncProducts = useCallback(() => {
    // Limpiar fields existentes
    remove(); //Without parameters it removes all fields
    
    // Agregar nuevos productos
    selectedProducts.forEach(product => {
      append({
        productId: product.id,
        quantity: 1, //THis is the default value for quantity
      });
    });
  }, [selectedProducts, append, remove]);

  useEffect(() => {
    syncProducts();
  }, [syncProducts]);

  const FORMSTATICS = useMemo(() => STATIC_FORM, []);

  if (responseStorage.isLoading && reponseProducts.isLoading) {
    return <LoadingDialogForm />;
  } else {
    if (responseStorage.isError) {
      toast.error("Error al cargar los almacenes, "+responseStorage.error.message, {
        action: {
          label: "Recargar",
          onClick: async () => {
            await responseStorage.refetch();
          }
        }
      });
      return (
        <GeneralErrorMessage
          error={responseStorage.error}
          reset={responseStorage.refetch}
        />
      );
    }
    if (!responseStorage.data) {
      return (
        <LoadingDialogForm />
      );
    }
    if (reponseProducts.isError) {
      toast.error("Error al cargar los productos, "+reponseProducts.error.message, {
        action: {
          label: "Recargar",
          onClick: async () => {
            await reponseProducts.refetch();
          }
        }
      });
      return reponseProducts.error ? (
        <GeneralErrorMessage
          error={reponseProducts.error}
          reset={reponseProducts.refetch}
        />
      ) : null;
    }
    if (!reponseProducts.data) {
      return (
        <LoadingDialogForm />
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

  // const handleRemoveAllProducts = () => {
  //   dispatch(
  //     {
  //       type: "clear"
  //     }
  //   )
  //   remove();
  // }

  const handleRemoveProduct = (index: number) => {
    // this removes from the tanstack state management
    dispatch(
      {
        type: "remove",
        payload: {
          productId: fields[index].productId
        }
      }
    )

    //THis removes from the react-hook-form arraylist
    remove(index);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="p-2 sm:p-1 overflow-auto max-h-[calc(80dvh-4rem)] grid md:grid-cols-4 gap-4">
          {/* Campo Nombre */}
          <div className="col-span-3">
            <FormItem>
              <FormLabel>{FORMSTATICS.name.label}</FormLabel>
              <Input
              {...register(FORMSTATICS.name.name)}
              placeholder={FORMSTATICS.name.placeholder}
              type={FORMSTATICS.name.type}
              />
              <CustomFormDescription required={FORMSTATICS.name.required} />
              <FormMessage />
              {form.formState.errors.name && (
              <FormMessage className="text-destructive">
                {form.formState.errors.name.message}
              </FormMessage>
              )}
            </FormItem>
          </div>

          {/* Fecha */}
          <div className="col-span-1">
            <FormField
              control={form.control}
              name={FORMSTATICS.date.name}
              render={({ field }) => (
                <FormItem className="flex flex-col justify-between h-full">
                  <FormLabel>{FORMSTATICS.date.placeholder}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                              // Verifica si es string
                              typeof field.value === "string"
                                ? format(new Date(field.value), "PPP", { locale: es })
                                : field.value instanceof Date
                                  ? format(field.value, "PPP", { locale: es })
                                  : <span>Escoja una fecha</span>
                            ) : (
                              <span>Escoja una fecha</span>
                            )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          typeof field.value === "string"
                            ? new Date(field.value)
                            : field.value instanceof Date
                            ? field.value
                            : undefined
                        }
                        onSelect={(val) => field.onChange(val?.toISOString() ?? "")}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <CustomFormDescription required={FORMSTATICS.date.required} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Campo Storage - Mantener como controlled porque es un AutoComplete */}
          <FormField
            control={control}
            name={FORMSTATICS.storageId.name}
            render={({ field }) => (
              <FormItem className="col-span-4">
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
          <div className="flex flex-col gap-4 col-span-4">
            <FormLabel>{FORMSTATICS.movement.label}</FormLabel>
            <Table className="w-full">
              <TableCaption>Lista de productos seleccionados</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Nombre</TableHead>
                    <TableHead className="text-center">Cantidad</TableHead>
                    <TableHead className="text-center">Precio de compra</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">Opciones</TableHead>
                  </TableRow>
                </TableHeader>
            <TableBody>
              {controlledFields.map((field, index) => {
                const data = selectedProducts.find((p) => p.id === field.productId);
                const safeData: Partial<ActiveProduct> = data ?? {};
                const safeWatch = watchFieldArray?.[index] ?? {};

                const price = safeData.precio ?? 0;
                const buyingPrice = safeWatch.buyingPrice ?? 0;
                const quantity = safeWatch.quantity ?? 0;

                // Manejar NaN o valores inexistentes
                // const total = isNaN(price * quantity) ? 0 : price * quantity;
                const total = isNaN(buyingPrice * quantity) ? 0 : buyingPrice * quantity;
                return <TableRow key={field.id} className="animate-fade-down duration-500">
                <TableCell>
                  <FormItem>
                    {/* <FormLabel>Producto</FormLabel> */}
                    <div>
                      {/* <FormLabel>Nombre</FormLabel> */}
                      <span>{safeData.name ?? 'Desconocido'}</span>
                    </div>
                    <Input
                      disabled
                      {...register(`movement.${index}.productId` as const)}
                      type="hidden"
                    />
                    <FormMessage />
                  </FormItem>
                </TableCell>
                <TableCell>
                    <FormItem>
                      {/* <FormLabel>Cantidad</FormLabel> */}
                      <Input
                        className="m-0"
                        {...register(`movement.${index}.quantity` as const, {
                          valueAsNumber: true,
                          validate: value => (value) >= 0 || "La cantidad no puede ser negativa"
                        })}
                        type="number"
                        min="0"
                      onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        if (target.valueAsNumber < 0) {
                          target.value = "0";
                        }
                      }}
                    />
                    <FormMessage />
                    </FormItem>
                </TableCell>
                <TableCell>
                  <div>
                    {/* <FormLabel>Precio</FormLabel> */}
                    <FormItem className="flex gap-1 items-center">
                      <span>S/</span>
                      <Input
                        className="!m-0"
                        defaultValue={price}
                        {...register(`movement.${index}.buyingPrice` as const, {
                          valueAsNumber: true,
                          validate: (value) =>
                            (value ?? 0) >= 0 || "La cantidad no puede ser negativa",
                        })}
                        type="number"
                        min="0"
                        step="any"
                        onInput={(e) => {
                          const target = e.target as HTMLInputElement;
                          if (target.valueAsNumber < 0) {
                            target.value = "0";
                          }
                        }}
                      />
                    </FormItem>
                      
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    {/* <FormLabel>Total</FormLabel> */}
                    <span className="block text-center font-bold text-primary">
                      {
                        total.toLocaleString("es-PE",
                          {
                            style: "currency",
                            currency: "PEN"
                          })
                      }
                    </span>
                  </div>
                </TableCell>
                <TableCell className="flex justify-center items-center">
                  <Button
                    type="button"
                    variant="outline"
                    className="hover:bg-destructive hover:text-white"
                    size="sm"
                    onClick={()=>handleRemoveProduct(index)}
                  >
                    <Trash2/>
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
              })}
            </TableBody>
            </Table>
            <div className="col-span-4 w-full flex flex-col gap-2 justify-center items-center py-4">
              <SelectProductDialog data={reponseProducts.data}>
              </SelectProductDialog>
              <CustomFormDescription
                required={true}
              ></CustomFormDescription>
              {form.formState.errors.movement && (
                <FormMessage className="text-destructive">
                  {form.formState.errors.movement.message}
                </FormMessage>
              )}
            </div>
          </div>
          
          {/* Descripción */}
          <div className="col-span-4">
            <FormItem>
              <FormLabel>{FORMSTATICS.description.label}</FormLabel>
              <Textarea
                {...register(FORMSTATICS.description.name)}
                placeholder={FORMSTATICS.description.placeholder}
              />
              <CustomFormDescription required={FORMSTATICS.description.required} />
              {form.formState.errors.description && (
              <FormMessage className="text-destructive">
                {form.formState.errors.description.message}
              </FormMessage>
              )}
            </FormItem>
          </div>
        </div>
        {children}
      </form>
    </Form>
  );
}