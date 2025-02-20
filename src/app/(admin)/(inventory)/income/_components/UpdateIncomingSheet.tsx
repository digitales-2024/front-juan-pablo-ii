"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { JSX, useCallback, useEffect, useMemo, useState } from "react";
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
  UpdateIncomeInput,
  updateIncomeSchema,
  DetailedIncoming,
  UpdateIncomingStorageInput,
} from "../_interfaces/income.interface";
import {
  AlertCircle,
  CalendarIcon,
  PencilIcon,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import { useIncoming } from "../_hooks/useIncoming";
import { AutoComplete } from "@/components/ui/autocomplete";
import LoadingDialogForm from "./LoadingDialogForm";
import GeneralErrorMessage from "./errorComponents/GeneralErrorMessage";
import { Textarea } from "@/components/ui/textarea";
import { Option } from "@/types/statics/forms";
import { UPDATEFORMSTATICS as FORMSTATICS } from "../_statics/forms";
import { CustomFormDescription } from "@/components/ui/custom/CustomFormDescription";
import { METADATA } from "../_statics/metadata";
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
import { useStorages } from "@/app/(admin)/(catalog)/storage/storages/_hooks/useStorages";
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
import { SelectProductDialog } from "./Movements/FormComponents/SelectMovementDialog";
import {
  useSelectedProducts,
  useSelectProductDispatch,
} from "../_hooks/useSelectProducts";
import { toast } from "sonner";
import { useProducts } from "@/app/(admin)/(catalog)/product/products/_hooks/useProduct";
import { ActiveProduct } from "@/app/(admin)/(catalog)/product/products/_interfaces/products.interface";

interface UpdateIncomeSheetProps {
  incoming: DetailedIncoming;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}

type AlertMessagesType = {
  title: string;
  bullets: (string | JSX.Element)[];
};

export function UpdateIncomingSheet({
  incoming,
  open: controlledOpen,
  onOpenChange,
  showTrigger = true,
}: UpdateIncomeSheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { updateMutation } = useIncoming();
  const { activeStoragesQuery: responseStorages } = useStorages();
  const { activeProductsQuery: reponseProducts } = useProducts();
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
    incoming.Movement.map((mv) => {
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

  const form = useForm<UpdateIncomingStorageInput>({
    resolver: zodResolver(updateIncomeSchema),
    // values:{
    //   movement: incoming.Movement.map((mv) => {return {
    //     id: mv.id,
    //     productId: mv.Producto.id,
    //     quantity: mv.quantity,
    //     buyingPrice: mv.buyingPrice,
    //     date: mv.date,
    //     state: mv.state,
    //   }})
    // },
    defaultValues: {
      name: incoming.name ?? FORMSTATICS.name.defaultValue,
      storageId: incoming.storageId ?? FORMSTATICS.storageId.defaultValue,
      date: incoming.date ?? FORMSTATICS.date.defaultValue,
      state: incoming.state ?? FORMSTATICS.state.defaultValue,
      description: incoming.description ?? FORMSTATICS.description.defaultValue,
      referenceId: incoming.referenceId ?? FORMSTATICS.referenceId.defaultValue,
      isTransference: incoming.isTransference ?? false,
      movement: [],
    },
  });

  // const watchedArray = useWatch<UpdateIncomingStorageDto>({
  //   control: form.control,
  //   name: "movement",
  //   defaultValue: movements,
  // })
  // console.log('watchedArray', watchedArray);

  const {
    control,
    register,
    watch,
    //formState: { errors },,
  } = form;

  // useEffect(() => {
  //   form.setValue('movement', incoming.Movement.map((mv) => {
  //     return {
  //       id: mv.id,
  //       productId: mv.Producto.id,
  //       quantity: mv.quantity,
  //       buyingPrice: mv.buyingPrice,
  //       date: mv.date,
  //       state: mv.state,
  //     }
  //   }
  //   ));
  // }, []);

  const watchFieldArray = watch("movement");
  console.log("watch movement", watchFieldArray);

  const formControl = form.control;
  const fieldArray = useFieldArray({
    control: formControl,
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
  const syncProducts = useCallback(() => {
    // Limpiar fields existentes
    remove(); //Without parameters it removes all fields
    const localSelectedProducts = selectedProducts.filter(
      (product) => !originalMovementProductsIds.includes(product.id)
    );

    movements.forEach((mv) => {
      append({
        id: mv.id,
        productId: mv.productId,
        quantity: mv.quantity,
        buyingPrice: mv.buyingPrice,
      });
    });

    // Agregar nuevos productos
    localSelectedProducts.forEach((product) => {
      append({
        productId: product.id,
        quantity: 1, //THis is the default value for quantity
      });
    });
  }, [selectedProducts, append, remove]);

  useEffect(() => {
    // Evita la limpieza en la primera renderización
    syncProducts();
  }, [syncProducts]);

  const handleClearProductList = useCallback(() => {
    // this removes from the tanstack state management
    dispatch({
      type: "clear",
    });
    //THis removes from the react-hook-form arraylist
    remove();
  }, [dispatch, remove]);

  useEffect(() => {
    if (!open) {
      handleClearProductList();
    }
  }, [open, handleClearProductList]);

  const onSubmit = async (data: UpdateIncomeInput) => {
    if (updateMutation.isPending) return;

    try {
      await updateMutation.mutateAsync(
        {
          id: incoming.id,
          data,
        },
        {
          onSuccess: () => {
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
    } catch (error) {
      // The error is already handled by the mutation
      toast.error("Error in onSubmit" + (error as Error).message);
    }
  };

  if (responseStorages.isLoading && reponseProducts.isLoading) {
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
    if (reponseProducts.isError) {
      toast.error(
        "Error al cargar los productos, " + reponseProducts.error.message,
        {
          action: {
            label: "Recargar",
            onClick: async () => {
              await reponseProducts.refetch();
            },
          },
        }
      );
      return reponseProducts.error ? (
        <GeneralErrorMessage
          error={reponseProducts.error}
          reset={reponseProducts.refetch}
        />
      ) : null;
    }
    if (!reponseProducts.data) {
      return <LoadingDialogForm />;
    }
    // if (responseTypeProducts.activeIsError) {
    //   return responseTypeProducts.activeError ? (
    //     <GeneralErrorMessage
    //       error={responseTypeProducts.activeError}
    //       reset={responseTypeProducts.activeRefetch}
    //     />
    //   ) : null;
    // }
    // if (!responseTypeProducts.activeData) {
    //   return (
    //     <GeneralErrorMessage
    //       error={new Error("No se encontraron subcategorías")}
    //       reset={responseTypeProducts.activeRefetch}
    //     />
    //   );
    // }
  }

  const storageOptions: Option[] = responseStorages.data.map((category) => ({
    label: category.name,
    value: category.id,
  }));

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

  // const typeProductOptions: Option[] = responseTypeProducts.activeData.map(
  //   (typeProduct) => ({
  //     label: typeProduct.name,
  //     value: typeProduct.id,
  //   })
  // );

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
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
              {showForm && (
                <div className="p-2 sm:p-1 overflow-auto scrollbar-thin max-h-[calc(80dvh-4rem)] grid md:grid-cols-2 gap-4 animate-fade-left animate-ease-in-out">
                  <div className="col-span-2">
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

                  {/* Campo Storage - Mantener como controlled porque es un AutoComplete */}
                  <FormField
                    control={control}
                    name={FORMSTATICS.storageId.name}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
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
                        {
                          <FormDescription className="text-primary">
                            Si desea cambiar el almacén realice una salida de
                            tipo transferencia al almacén deseado
                          </FormDescription>
                        }
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Movements Section */}
                  <div className="flex flex-col gap-4 col-span-2">
                    <FormLabel>{FORMSTATICS.movement.label}</FormLabel>
                    <Table className="w-full">
                      <TableCaption>
                        Lista de productos seleccionados
                      </TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Nombre</TableHead>
                          <TableHead>Cantidad</TableHead>
                          <TableHead className="text-center">Precio</TableHead>
                          <TableHead className="text-center">Total</TableHead>
                          <TableHead className="text-center">
                            Opciones
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {controlledFields.map((field, index) => {
                          const data = selectedProducts.find(
                            (p) => p.id === field.productId
                          );
                          const safeData: Partial<ActiveProduct> = data ?? {};

                          //Se obtiene el nombre de los productos originales y los futuros
                          const name =
                            (originalMovementsIds.includes(field.id ?? "")
                              ? movements.find(
                                  (mv) => mv.id === field.id
                                )?.productName
                              : safeData.name) ?? "Desconocido";

                          const safeWatch = watchFieldArray?.[index] ?? {};

                          const price = safeData.precio ?? 0;
                          const buyingPrice = safeWatch.buyingPrice ?? 0;
                          const quantity = safeWatch.quantity ?? 0;

                          const total = isNaN(buyingPrice * quantity) ? 0 : buyingPrice * quantity;

                          return (
                            <TableRow key={field.id}>
                              <TableCell>
                                <FormItem>
                                  <div>
                                    <span>
                                      {name ?? "Desconocido"}
                                    </span>
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
                                    {...register(
                                      `movement.${index}.quantity` as const,
                                      {
                                        valueAsNumber: true,
                                        validate: value => (value) >= 0 || "La cantidad no puede ser negativa"
                                      }
                                    )}
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
                              {/* <TableCell>
                                <div>
                                  <span className="block text-center">
                                    {price.toLocaleString("es-PE", {
                                      style: "currency",
                                      currency: "PEN",
                                    })}
                                  </span>
                                </div>
                              </TableCell> */}
                              <TableCell>
                                <div>
                                  {/* <FormLabel>Precio</FormLabel> */}
                                  <FormItem className="flex gap-1 items-center">
                                    <span>S/</span>
                                    <Input
                                      className="!m-0 min-w-14"
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
                                  <span className="block text-center">
                                    {total.toLocaleString("es-PE", {
                                      style: "currency",
                                      currency: "PEN",
                                    })}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="flex justify-center">
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="hover:bg-destructive hover:text-white"
                                  size="sm"
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
                      <SelectProductDialog
                        data={reponseProducts.data}
                      ></SelectProductDialog>
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
                  <FormField
                    control={form.control}
                    name={FORMSTATICS.state.name}
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="overflow-hidden text-ellipsis">
                          {FORMSTATICS.state.label}
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(val) =>
                              field.onChange(val === "true")
                            }
                            value={field.value ? "true" : "false"}
                            //defaultValue={field.value}
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

                  {/* Fecha */}
                  <div>
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
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    // Verifica si es string
                                    typeof field.value === "string" ? (
                                      format(new Date(field.value), "PP", {
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
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

                  {/* Descripción */}
                  <div className="col-span-2">
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
                </div>
              )}

              <SheetFooter>
                <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end flex-wrap">
                  <SheetClose
                    asChild
                    className={cn(
                      buttonVariants({
                        variant: "default",
                      }),
                      "animate-jump animate-twice animate-duration-1000 animate-ease-linear hover:text-white hover:scale-105 hover:transition-all"
                    )}
                  >
                    <span>Conservar stock y salir</span>
                  </SheetClose>
                  {!showForm && (
                    <Button
                      variant={"outline"}
                      className={cn(
                        "text-destructive hover:text-white hover:bg-destructive border border-destructive"
                      )}
                      type="button"
                      onClick={() => setShowForm(true)}
                    >
                      Continuar
                    </Button>
                  )}
                  {showForm && (
                    <Button
                      variant={"outline"}
                      className={cn(
                        "text-destructive hover:text-white hover:bg-destructive border border-destructive"
                      )}
                      type="submit"
                      disabled={updateMutation.isPending}
                    >
                      {updateMutation.isPending ? (
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
