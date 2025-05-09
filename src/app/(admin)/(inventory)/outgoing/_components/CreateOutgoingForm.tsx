"use client";

import { UseFormReturn, UseFieldArrayReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// import { CreateProductInput } from "../_interfaces/outgoing.interface";
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
//import { useProducts } from "@/app/(admin)/(catalog)/product/products/_hooks/useProduct";
import { CreateOutgoingInput } from "../_interfaces/outgoing.interface";
import { CreateIncomeInput } from "../../income/_interfaces/income.interface";
import {
  useSelectedProducts,
  useSelectProductDispatch,
} from "../_hooks/useSelectProducts";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Check, ChevronsUpDown, Trash2 } from "lucide-react";
import { SelectProductDialog } from "./Movements/FormComponents/SelectMovementDialog";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { useProductsStock } from "../../stock/_hooks/useProductStock";
import { OutgoingProducStockForm } from "../../stock/_interfaces/stock.interface";
import { Switch } from "@/components/ui/switch";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
// import { ScrollArea } from "@/components/ui/scroll-area";

interface CreateProductFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateOutgoingInput>;
  controlledFieldArray: UseFieldArrayReturn<CreateIncomeInput>;
  onSubmit: (data: CreateOutgoingInput) => void;
  onDialogClose?: () => void;
}

export function CreateOutgoingForm({
  children,
  form,
  onSubmit,
  controlledFieldArray,
}: CreateProductFormProps) {
  const { register, watch } = form;
  const { fields, append, remove } = controlledFieldArray;
  const watchFieldArray = watch("movement");
  const controlledFields = fields.map((field, index) => {
    const watchItem = watchFieldArray?.[index];
    return {
      ...field,
      ...(watchItem ?? {}),
    };
  });
  const { activeStoragesQuery: responseStorage } = useStorages();
  const { productStockQuery: reponseProducts } = useProductsStock();
  const selectedProducts = useSelectedProducts();
  const dispatch = useSelectProductDispatch();

  const syncProducts = useCallback(() => {
    // Limpiar fields existentes
    remove(); //Without parameters it removes all fields

    // Agregar nuevos productos
    selectedProducts.forEach((product) => {
      //console.log('product', product);
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
      return (
        <GeneralErrorMessage
          error={responseStorage.error}
          reset={responseStorage.refetch}
        />
      );
    }
    if (!responseStorage.data) {
      return (
        <LoadingDialogForm/>
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
        <LoadingDialogForm/>
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

  const storageOptions: Option[] = responseStorage.data.map((storage) => {
    return {
      label: `${storage.name} - ${storage.branch.name}`,
      value: storage.id,
    }
  });

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
            {/* <FormItem>
              <FormLabel>{FORMSTATICS.date.label}</FormLabel>
              <Input
                {...register(FORMSTATICS.date.name)}
                type="date"
                placeholder={FORMSTATICS.date.placeholder}
              />
              <CustomFormDescription required={FORMSTATICS.date.required} />
              {form.formState.errors.date && (
              <FormMessage className="text-destructive">
                {form.formState.errors.date.message}
              </FormMessage>
              )}
            </FormItem> */}
            <FormField
              control={form.control}
              name={FORMSTATICS.date.name}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="mb-2">{FORMSTATICS.date.placeholder}</FormLabel>
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
          {/* <FormField
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
          /> */}
            <FormField
            control={form.control}
            name={FORMSTATICS.storageId.name}
            render={({ field }) => (
              <FormItem className="col-span-4">
              <FormLabel>{FORMSTATICS.storageId.label}</FormLabel>
              <AutoComplete
                disabled
                className="disabled:text-primary"
                options={storageOptions}
                placeholder={FORMSTATICS.storageId.placeholder}
                emptyMessage={FORMSTATICS.storageId.emptyMessage!}
                value={storageOptions.find((option) => option.value === field.value)}
                onValueChange={(option) => field.onChange(option?.value || "")}
              />
              <CustomFormDescription required={FORMSTATICS.storageId.required} />
              <FormDescription className="opacity-80">
                {form.watch(FORMSTATICS.storageId.name) ? <span className="text-primary ">Almacén ya seleccionado</span> : <span className="text-destructive">
                  Primero, seleccione un producto</span>}
              </FormDescription>
              <FormMessage />
              </FormItem>
            )}
            />

          {/* Movements Section */}
            {/* id: string;
            name: string;
            precio: number;
            codigoProducto: string;
            unidadMedida: string;
            Stock: ProductStockData[]; */}
          <div className="flex flex-col gap-4 col-span-4">
            <FormLabel>{FORMSTATICS.movement.label}</FormLabel>
            <Table className="w-full">
              <TableCaption>Si escoges otro almacén se reiniciará la lista de productos seleccionados.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Nombre</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead className="text-center text-balance max-w-10">Stock Almacén Seleccionado</TableHead>
                    <TableHead className="text-center">Stock General</TableHead>
                    <TableHead className="text-center">Opciones</TableHead>
                  </TableRow>
                </TableHeader>
            <TableBody>
              {controlledFields.map((field, index) => {
                const data = selectedProducts.find((p) => p.id === field.productId);
                const safeData: Partial<OutgoingProducStockForm> = data ?? {};
                const safeWatch = watchFieldArray?.[index] ?? {};
                //const price = safeData.precio ?? 0;
                const storageSafeWatch = form.watch(FORMSTATICS.storageId.name);
                const stockStorage = safeData.Stock?.find((stock) => stock.Storage.id === storageSafeWatch);
                const totalStock = safeData.Stock?.reduce((acc, stock) => acc + stock.stock, 0) ?? 0;
                const dynamicStock = isNaN((stockStorage?.stock ?? 0) - (safeWatch.quantity ?? 0)) ? (stockStorage?.stock ?? 0) : (stockStorage?.stock ?? 0) - (safeWatch.quantity ?? 0);
                //const quantity = safeWatch.quantity ?? 0;

                // Manejar NaN o valores inexistentes
                //const total = isNaN(price * quantity) ? 0 : price * quantity;
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
                      {...register(`movement.${index}.quantity` as const, {
                      valueAsNumber: true,
                      validate: value => value > (stockStorage?.stock??0) ? "La cantidad supera el stock disponible" : true 
                      })}
                      type="number"
                      min="0"
                      onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        if (target.valueAsNumber < 0) {
                          target.value = "0";
                        }

                        if (target.valueAsNumber > (stockStorage?.stock ?? 0)) {
                          target.value = (stockStorage?.stock ?? 0).toString();
                        }
                      }}
                    />
                    <FormMessage />
                    </FormItem>
                </TableCell>
                {/* <TableCell>
                  <div>
                    <span className="block text-center">{price.toLocaleString("es-PE",
                      {
                        style: "currency",
                        currency: "PEN"
                      })}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <span className="block text-center">
                      {
                        total.toLocaleString("es-PE",
                          {
                            style: "currency",
                            currency: "PEN"
                          })
                      }
                    </span>
                  </div>
                </TableCell> */}
                <TableCell>
                  <div>
                    {/* <FormLabel>Stock almacén</FormLabel> */}
                    <p className="block text-center">{`Alm. "${stockStorage?.Storage.name}" `}{"("}<span className="text-primary font-bold">
                      {
                        `${dynamicStock}`
                      }
                      </span>{')'}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    {/* <FormLabel>Stock total</FormLabel> */}
                    <span className="block text-center">
                      {
                        totalStock
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
            {/* <Button
              type="button"
              onClick={() => append({ 
                productId: '', 
                quantity: 0 
              })}
            >
              Agregar Movimiento
            </Button> */}
            </Table>
            <div className="col-span-2 w-full flex flex-col gap-2 justify-center items-center py-4">
              {/* <SelectProductDialog data={reponseProducts.data}>
              </SelectProductDialog> */}
              <SelectProductDialog form={form}>
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
          {/* Estado */}
          {/* <FormField
            control={form.control}
            name={FORMSTATICS.state.name}
            render={({ field }) => (
              <FormItem className="space-y-3 col-span-2">
                <FormLabel className="overflow-hidden text-ellipsis">{FORMSTATICS.state.label}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(val) => field.onChange(val === "true")}
                    value={field.value ? "true" : "false"}
                    //defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {STATEPROP_OPTIONS.map(({label, value}, idx) => (
                      <FormItem
                        key={idx}
                        className="flex items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={value.toString()} />
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
          <Separator className="col-span-4"></Separator>
          {/* TRANSFERENCIA */}
          <div className="col-span-2">
            <FormField
                control={form.control}
                name='isTransference'
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>{FORMSTATICS.isTransference.label}</FormLabel>
                      <FormDescription>
                        {FORMSTATICS.isTransference.description}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch className="!m-0 "
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <CustomFormDescription required={FORMSTATICS.description.required} />
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              />
          </div>

          {/* Almacen de destino */}
          {
            form.watch('isTransference') && (
              <div className="animate-fade-right animate-duration-500 col-span-2 flex items-end">
              <FormField
              control={form.control}
              name={FORMSTATICS.referenceId.name}
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>{FORMSTATICS.referenceId.label}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? storageOptions.filter((option)=> option.value !== form.watch('storageId')).find(
                                (option) => option.value === field.value
                              )?.label
                            : FORMSTATICS.referenceId.placeholder}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Buscar ..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>{FORMSTATICS.referenceId.emptyMessage}</CommandEmpty>
                          <CommandGroup>
                            {storageOptions.filter((option)=> option.value !== form.watch('storageId')).map((option) => (
                              <CommandItem
                                value={option.label}
                                key={option.value}
                                onSelect={() => {
                                  form.setValue("referenceId", option.value)
                                }}
                              >
                                {option.label}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    option.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <CustomFormDescription required={FORMSTATICS.referenceId.required} />
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            />
            </div>
            )
          }
        </div>
        {children}
      </form>
    </Form>
  );
}
