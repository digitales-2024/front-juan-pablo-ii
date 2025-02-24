"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useMemo, useState, useCallback, useEffect, JSX, useRef } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DetailedOutgoing,
  UpdateOutgoingStorageInput,
  updateOutgoingStorageSchema,
  UpdateOutgoingStorageDto,
} from "../_interfaces/outgoing.interface";
import {
  AlertCircle,
  CalendarIcon,
  PencilIcon,
  RefreshCcw,
} from "lucide-react";
import { useOutgoing } from "../_hooks/useOutgoing";
import { AutoComplete } from "@/components/ui/autocomplete";
import LoadingDialogForm from "./LoadingDialogForm";
import GeneralErrorMessage from "./errorComponents/GeneralErrorMessage";
import { Textarea } from "@/components/ui/textarea";
import { Option } from "@/types/statics/forms";
import { UPDATEFORMSTATICS as FORMSTATICS } from "../_statics/forms";
import { CustomFormDescription } from "@/components/ui/custom/CustomFormDescription";
import { METADATA } from "../_statics/metadata";
import { useStorages } from "@/app/(admin)/(catalog)/storage/storages/_hooks/useStorages";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Alert } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import {
  useSelectedProducts,
  useSelectProductDispatch,
} from "../_hooks/useSelectProducts";
import { toast } from "sonner";
import { useProducts } from "@/app/(admin)/(catalog)/product/products/_hooks/useProduct";
import { OutgoingProducStockForm } from "../../stock/_interfaces/stock.interface";
// import { SelectProductDialog } from "./Movements/FormComponents/SelectMovementDialog";
import { UpdateOutgoingSelectProductDialog } from "./Movements/FormComponents/UpdateOutgoingSelectMovementDialog";
import { useStockByStorage } from "../../stock/_hooks/useProductStock";

interface UpdateOutgoingSheetProps {
  outgoing: DetailedOutgoing;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}

type AlertMessagesType = {
  title: string;
  bullets: (string | JSX.Element)[];
};

export function UpdateOutgoingSheet({
  outgoing,
  open: controlledOpen,
  onOpenChange,
  showTrigger = true,
}: UpdateOutgoingSheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { updateOutgoingStorageMutation } = useOutgoing();
  const { activeStoragesQuery: responseStorages } = useStorages();
  const { activeProductsQuery: responseProducts } = useProducts();
  const stockByStorageQuery = useStockByStorage(outgoing.storageId);
  
  const selectedProducts = useSelectedProducts();
  const dispatch = useSelectProductDispatch();

  const STATEPROP_OPTIONS = useMemo(() => {
    return [
      {
        label: "En Proceso",
        value: false,
      },
      {
        label: "Concretado",
        value: true,
      },
    ];
  }, []);

  // Use controlled state if props are provided, otherwise use internal state
  const isOpen = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  const bulletClassnames = "font-semibold";
  const paragraphClassnames = "inline";

  const ALERT_MESSAGES: AlertMessagesType = useMemo<AlertMessagesType>(
    () => ({
      title: "¡Riesgo de Corrupción de Integridad de Stock!",
      bullets: [
        <span className={cn(paragraphClassnames)}>
          Le desaconsejamos <span>encarecidamente</span> alterar los datos de la{" "}
          {METADATA.entityName.toLowerCase()} directamente.
        </span>,
        <span className={cn(paragraphClassnames)}>
          Si <span className={cn(bulletClassnames)}>elimina</span>,{" "}
          <span className={cn(bulletClassnames)}>agrega</span> o{" "}
          <span className={cn(bulletClassnames)}>cambia</span> la lista de
          movimientos/productos o cambia la cantidad, se generararán{" "}
          <span className={cn(bulletClassnames)}>negativos</span> y{" "}
          <span className={cn(bulletClassnames)}>excedentes</span> en el stock.
        </span>,
        <span className={cn(paragraphClassnames)}>
          Si desea alterar cualquier dato de la{" "}
          {METADATA.entityName.toLowerCase()}, se recomienda realizar una{" "}
          <span className={cn(bulletClassnames)}>salida</span> quitando los
          movimientos y luego crear una{" "}
          <span className={cn(bulletClassnames)}>entrada</span> con los datos
          correctos.
        </span>,
      ],
    }),
    []
  );

  const movements =
    outgoing.Movement.map((mv) => {
      return {
        id: mv.id,
        productName: mv.Producto.name,
        productId: mv.Producto.id,
        quantity: mv.quantity,
        buyingPrice: mv.buyingPrice,
        date: mv.date,
        state: mv.state,
      };
    }) ?? [];

  const form = useForm<UpdateOutgoingStorageInput>({
    resolver: zodResolver(updateOutgoingStorageSchema),
    defaultValues: {
      name: outgoing.name ?? FORMSTATICS.name.defaultValue,
      storageId: outgoing.storageId ?? FORMSTATICS.storageId.defaultValue,
      date: outgoing.date ?? FORMSTATICS.date.defaultValue,
      state: outgoing.state ?? FORMSTATICS.state.defaultValue,
      description: outgoing.description ?? FORMSTATICS.description.defaultValue,
      referenceId: outgoing.referenceId ?? FORMSTATICS.referenceId.defaultValue,
      movement: [],
    },
  });

  const {
    control,
    register,
    watch,
    //formState: { errors },,
  } = form;

  const watchFieldArray = watch("movement");
  const fieldArray = useFieldArray({
    control: control,
    name: "movement",
    rules: {
      minLength: 1,
    },
  });

  const { fields, append, remove } = fieldArray;

  const controlledFields = fields.map((field, index) => {
    const watchItem = watchFieldArray?.[index];
    return {
      ...field,
      ...(watchItem ?? {}),
    };
  });

  const originalMovementsIds = movements.map((mv) => mv.id);
  const originalMovementProductsIds = movements.map((mv) => mv.productId);
  const mappedOriginalQuantities: Record<string, number> = {};
  outgoing.Movement.forEach((mv) => {
    mappedOriginalQuantities[mv.id] = mv.quantity;
  });
  const originalQuantitiesRef = useRef<Record<string, number>>(mappedOriginalQuantities);

  const syncProducts = useCallback(() => {
    remove();
    const localSelectedProducts = selectedProducts.filter(
      (product) => !originalMovementProductsIds.includes(product.id)
    );

    movements.forEach((mv) => {
      append({
        id: mv.id,
        productId: mv.productId,
        quantity: mv.quantity,
      });
    });

    localSelectedProducts.forEach((product) => {
      append({
        productId: product.id,
        quantity: 1,
      });
    });
  }, [selectedProducts, append, remove, outgoing.Movement]);

  useEffect(() => {
    syncProducts();
  }, [syncProducts]);

  const handleClearProductList = useCallback(() => {
    dispatch({ type: "clear" });
    remove();
  }, [dispatch, remove]);

  useEffect(() => {
    if (!isOpen) {
      handleClearProductList();
    }
  }, [isOpen, handleClearProductList]);

  const handleRemoveProduct = (index: number) => {
    // this removes from the tanstack state management
    dispatch({
      type: "remove",
      payload: {
        productId: fields[index].productId!,
      },
    });

    //THis removes from the react-hook-form arraylist
    remove(index);
  };

  const handleOnOpenChange = (open: boolean) => {
    handleClearProductList();
    setOpen(open);
  };

  const onSubmit = async (data: UpdateOutgoingStorageDto) => {
    if (updateOutgoingStorageMutation.isPending) return;

    try {
      await updateOutgoingStorageMutation.mutateAsync(
        {
          id: outgoing.id,
          data: {
            ...data,
            isTransference: outgoing.isTransference,
            referenceId: outgoing.referenceId,
            incomingId: outgoing.incomingId,
            movement: data.movement.map((mv) => ({
              ...mv,
              id: mv.id ?? undefined,
            })),
          },
        },
        {
          onSuccess: () => {
            console.log('Entrando a on success en update')
            handleClearProductList();
            form.reset();
            setOpen(false);
          },
          onError: (error) => {
            toast.error(
              `Error al actualizar ${METADATA.entityName.toLowerCase()}:` +
                error.message
            );
            if (error.message.includes("No autorizado")) {
              setTimeout(() => {
                form.reset();
              }, 1000);
            }
          },
        }
      );
      if (data.isTransference){
        toast.success('Transferencia realizada exitosamente')
      }
    } catch (error) {
      toast.error("Error in onSubmit" + (error as Error).message);
    }
  };

  if (responseStorages.isLoading && responseProducts.isLoading && stockByStorageQuery.isLoading) {
    return <LoadingDialogForm />;
  } else {
    if (responseStorages.isError) {
      return (
        <GeneralErrorMessage
          error={responseStorages.error}
          reset={responseStorages.refetch}
        />
      );
    }
    if (!responseStorages.data) {
      return <LoadingDialogForm />;
    }
    if (responseProducts.isError) {
      return responseProducts.error ? (
        <GeneralErrorMessage
          error={responseProducts.error}
          reset={responseProducts.refetch}
        />
      ) : null;
    }
    if (!responseProducts.data) {
      return <LoadingDialogForm />;
    }
    if (stockByStorageQuery.isError) {
      return stockByStorageQuery.error ? (
        <GeneralErrorMessage
          error={stockByStorageQuery.error}
          reset={stockByStorageQuery.refetch}
        />
      ) : null;
    }
    if (!stockByStorageQuery.data) {
      return <LoadingDialogForm />;
    }
  }

  const storageOptions: Option[] = responseStorages.data.map((storage) => ({
    label: `${storage.name} - ${storage.branch.name}`,
    value: storage.id,
  }));

  return (
    <Sheet open={isOpen} onOpenChange={handleOnOpenChange}>
      {showTrigger && (
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <PencilIcon className="size-4" aria-hidden="true" />
          </Button>
        </SheetTrigger>
      )}
      <SheetContent className="overflow-auto">
        <SheetHeader>
          <SheetTitle>
            Actualizar {METADATA.entityName.toLowerCase()}
          </SheetTitle>
          <div>
            <Alert className="bg-yellow-100/70 text-yellow-600 border-none !mb-2">
              <div className="flex space-x-2 items-center mb-2 justify-center sm:justify-start">
                <AlertCircle className="h-4 w-4" />
                <div className="font-semibold !mb-0">
                  {ALERT_MESSAGES.title}
                </div>
              </div>
              <div className="w-full px-5">
                <ul className="space-y-1 list-disc text-start">
                  {ALERT_MESSAGES.bullets.map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              </div>
            </Alert>
          </div>
        </SheetHeader>
        <div className="mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              { showForm && <div className="p-2 sm:p-1 overflow-auto scrollbar-thin max-h-[calc(80dvh-4rem)] grid md:grid-cols-4 gap-4 animate-fade-left animate-ease-in-out">
                <div className="col-span-4">
                  <FormItem>
                    <FormLabel>{FORMSTATICS.name.label}</FormLabel>
                    <Input
                      {...register(FORMSTATICS.name.name)}
                      placeholder={FORMSTATICS.name.placeholder}
                      type={FORMSTATICS.name.type}
                    />
                    <CustomFormDescription
                      required={FORMSTATICS.name.required}
                    />
                    <FormMessage />
                    {form.formState.errors.name && (
                      <FormMessage className="text-destructive">
                        {form.formState.errors.name.message}
                      </FormMessage>
                    )}
                  </FormItem>
                </div>

                <div className="col-span-4">
                  <FormField
                    control={form.control}
                    name={FORMSTATICS.date.name}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>{FORMSTATICS.date.placeholder}</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  typeof field.value === "string" ? (
                                    format(new Date(field.value), "PPP", {
                                      locale: es,
                                    })
                                  ) : (
                                    <span>Escoja una fecha</span>
                                  )
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
                                  : undefined
                              }
                              onSelect={(val) =>
                                field.onChange(val?.toISOString() ?? "")
                              }
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <CustomFormDescription
                          required={FORMSTATICS.date.required}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={control}
                  name={FORMSTATICS.storageId.name}
                  render={({ field }) => (
                    <FormItem className="col-span-4">
                      <FormLabel>{FORMSTATICS.storageId.label}</FormLabel>
                      <AutoComplete
                        disabled
                        options={storageOptions}
                        placeholder={FORMSTATICS.storageId.placeholder}
                        emptyMessage={FORMSTATICS.storageId.emptyMessage!}
                        value={storageOptions.find(
                          (option) => option.value === field.value
                        )}
                        onValueChange={(option) =>
                          field.onChange(option?.value || "")
                        }
                      />
                      <CustomFormDescription
                        required={FORMSTATICS.storageId.required}
                      />
                      <FormDescription className="text-primary">
                        Si desea cambiar el almacén, cree una nueva salida de
                        tipo transferencia hacia el almacén deseado.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Campos movimientos */}
                <div className="flex flex-col gap-4 col-span-4">
                  <FormLabel>{FORMSTATICS.movement.label}</FormLabel>
                  <Table className="w-full">
                    <TableCaption className="space-y-1">
                      <span className="inline-block">
                        Lista de productos seleccionados.
                      </span>
                      <span className="inline-block">
                        Se asigna el precio de venta como referencia en los
                        nuevos productos que agregue.
                      </span>
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Nombre</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead className="text-center">
                          Stock Almacén
                        </TableHead>
                        <TableHead className="text-center">Suma general stock</TableHead>
                        <TableHead className="text-center">Opciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {controlledFields.map((field, index) => {
                        const data = selectedProducts.find(
                          (p) => p.id === field.productId
                        );

                        //In case is movement to be updated
                        const existentProduct = field.id ? stockByStorageQuery.data.find((p)=>{
                          return p.id === field.productId
                        }) : null;

                        const transformedExistentProduct: Partial<OutgoingProducStockForm> | null = existentProduct ? {
                          id: existentProduct.id,
                          name: existentProduct.name,
                          precio: existentProduct.precio,
                          codigoProducto: existentProduct.codigoProducto,
                          unidadMedida: existentProduct.unidadMedida,
                          Stock: existentProduct.Stock ?? [],
                          storageId: form.watch('storageId'),
                        } : null;

                        const safeData: Partial<OutgoingProducStockForm> = existentProduct ? (transformedExistentProduct ?? {}) : (data ?? {});
                        console.log(safeData)
                        const safeWatch = watchFieldArray?.[index] ?? {};
                        const storageSafeWatch = form.watch(FORMSTATICS.storageId.name);
                        const stockStorage = safeData.Stock?.find((stock) => stock.Storage.id === storageSafeWatch);
                        const totalStock = safeData.Stock?.reduce((acc, stock) => acc + stock.stock, 0) ?? 0;
                        
                        
                        const dynamicStock = isNaN((stockStorage?.stock ?? 0) - (safeWatch.quantity ?? 0)) ? (stockStorage?.stock ?? 0) : (stockStorage?.stock ?? 0) - (safeWatch.quantity ?? 0);

                        const originalQuantityRef = existentProduct ? originalQuantitiesRef.current[field.id] ?? 0 : 0;

                        const existentProductOriginalStock = existentProduct
                          ? originalQuantityRef + (stockStorage?.stock ?? 0)
                          : 0;

                        const existentDynamicStock = isNaN((existentProductOriginalStock ?? 0) - (safeWatch.quantity ?? 0)) ? (existentProductOriginalStock ?? 0) : (existentProductOriginalStock ?? 0) - (safeWatch.quantity ?? 0);

                        const extsitentTotalStock = existentProduct ? totalStock + existentProductOriginalStock : 0;

                        //Se obtiene el nombre de los productos originales y los futuros
                        const name =
                          (originalMovementsIds.includes(field.id ?? "")
                            ? movements.find((mv) => mv.id === field.id)
                                ?.productName
                            : safeData.name) ?? "Desconocido";

                        // const price = safeData.precio ?? 0;
                        // const buyingPrice = safeWatch.buyingPrice ?? 0;
                        // const quantity = safeWatch.quantity ?? 0;

                        // const total = isNaN(buyingPrice * quantity)
                        //   ? 0
                        //   : buyingPrice * quantity;

                        return (
                          <TableRow
                            key={field.id}
                            className="animate-fade-down"
                          >
                            <TableCell>
                              <FormItem>
                                <div>
                                  <span>{name ?? "Desconocido"}</span>
                                </div>
                                <Input
                                  disabled
                                  {...register(
                                    `movement.${index}.productId` as const
                                  )}
                                  type="hidden"
                                />
                                <FormMessage />
                              </FormItem>
                            </TableCell>
                            <TableCell>
                              <FormItem>
                                <Input
                                  {...register(`movement.${index}.quantity`, {
                                    valueAsNumber: true,
                                    validate: (value) => value >= 0,
                                  })}
                                  type="number"
                                  min="0"
                                  onInput={(e) => {
                                    const target = e.target as HTMLInputElement;
                                    if (target.valueAsNumber < 0) {
                                      target.value = "0";
                                    }
                                    //Take a look if this validation is necessay
                                    if (target.valueAsNumber > (stockStorage?.stock ?? 0)) {
                                        target.value = (stockStorage?.stock ?? 0).toString();
                                      }
                                  }}
                                />
                                <FormMessage />
                              </FormItem>
                            </TableCell>
                            <TableCell>
                              <div>
                                {/* <FormLabel>Stock almacén</FormLabel> */}
                                <p className="block text-center">{`Alm. "${stockStorage?.Storage.name}" `}{"("}<span className="text-primary font-bold">
                                  {
                                    `${existentProduct ? existentDynamicStock : dynamicStock}`
                                  }
                                  </span>{')'}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                                <div>
                                    {/* <FormLabel>Stock total</FormLabel> */}
                                    <span className="block text-center">
                                    {
                                        existentProduct ? extsitentTotalStock : totalStock
                                    }
                                    </span>
                                </div>
                            </TableCell>
                            {/* <TableCell>
                              <div>
                                <FormItem className="flex gap-1 items-center">
                                  <span>S/</span>
                                  <Input
                                    className="!m-0 min-w-14"
                                    defaultValue={price}
                                    {...register(
                                      `movement.${index}.buyingPrice` as const,
                                      {
                                        valueAsNumber: true,
                                        validate: (value) =>
                                          (value ?? 0) >= 0 ||
                                          "La cantidad no puede ser negativa",
                                      }
                                    )}
                                    type="number"
                                    min="0"
                                    step="any"
                                    onInput={(e) => {
                                      const target =
                                        e.target as HTMLInputElement;
                                      if (target.valueAsNumber < 0) {
                                        target.value = "0";
                                      }
                                    }}
                                  />
                                </FormItem>
                              </div>
                            </TableCell> */}
                            {/* <TableCell>
                              <div>
                                <span className="block text-center">
                                  {total.toLocaleString("es-PE", {
                                    style: "currency",
                                    currency: "PEN",
                                  })}
                                </span>
                              </div>
                            </TableCell> */}
                            <TableCell className="flex justify-center items-center">
                              <Button
                                type="button"
                                variant="outline"
                                className="hover:bg-destructive hover:text-white"
                                onClick={() => handleRemoveProduct(index)}
                              >
                                <Trash2 />
                                Eliminar
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  <div className="col-span-2 w-full flex flex-col gap-2 justify-center items-center py-4">
                      <UpdateOutgoingSelectProductDialog
                        form={form}
                        storageId={form.watch('storageId')}
                      ></UpdateOutgoingSelectProductDialog>
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

                <FormField
                  control={form.control}
                  name={FORMSTATICS.state.name}
                  render={({ field }) => (
                    <FormItem className="space-y-3 col-span-4">
                      <FormLabel className="overflow-hidden text-ellipsis">
                        {FORMSTATICS.state.label}
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(val) =>
                            field.onChange(val === "true")
                          }
                          value={field.value ? "true" : "false"}
                          className="flex flex-col space-y-1"
                        >
                          {STATEPROP_OPTIONS.map(({ label, value }, idx) => (
                            <FormItem
                              key={idx}
                              className="flex items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <RadioGroupItem value={value.toString()} />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {label}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>

                <div className="col-span-4">
                  <FormItem>
                    <FormLabel>{FORMSTATICS.description.label}</FormLabel>
                    <Textarea
                      {...register(FORMSTATICS.description.name)}
                      placeholder={FORMSTATICS.description.placeholder}
                    />
                    <CustomFormDescription
                      required={FORMSTATICS.description.required}
                    />
                    {form.formState.errors.description && (
                      <FormMessage className="text-destructive">
                        {form.formState.errors.description.message}
                      </FormMessage>
                    )}
                  </FormItem>
                </div>
              </div>}

              <SheetFooter>
                <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end flex-wrap">
                  <SheetClose asChild className={cn(
                      buttonVariants({
                        variant: "default",
                      }),
                      "animate-jump animate-twice animate-duration-1000 animate-ease-linear hover:text-white hover:scale-105 hover:transition-all"
                    )}>
                    <span>Conservar stock y salir</span>
                  </SheetClose>
                  {!showForm && (
                    <Button
                      variant="outline"
                      className="text-destructive hover:text-white hover:bg-destructive"
                      onClick={() => setShowForm(true)}
                    >
                      Continuar
                    </Button>
                  )}
                  {showForm && (
                    <Button
                      variant="outline"
                      className="text-destructive hover:text-white hover:bg-destructive"
                      type="submit"
                      disabled={updateOutgoingStorageMutation.isPending}
                    >
                      {updateOutgoingStorageMutation.isPending ? (
                        <>
                          <RefreshCcw className="mr-2 size-4 animate-spin" />
                          Actualizando...
                        </>
                      ) : (
                        "Actualizar de todos modos"
                      )}
                    </Button>
                  )}
                </div>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
