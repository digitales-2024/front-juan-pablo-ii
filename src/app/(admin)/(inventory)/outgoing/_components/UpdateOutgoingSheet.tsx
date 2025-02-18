"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMemo, useState } from "react";
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
  updateOutgoingSchema,
  UpdateOutgoingInput,
  DetailedOutgoing,
} from "../_interfaces/outgoing.interface";
import { CalendarIcon, PencilIcon, RefreshCcw } from "lucide-react";
import { useOutgoing } from "../_hooks/useOutgoing";
import { AutoComplete } from "@/components/ui/autocomplete";
import { useTypeProducts } from "@/app/(admin)/(catalog)/product/product-types/_hooks/useType";
import LoadingDialogForm from "./LoadingDialogForm";
import GeneralErrorMessage from "./errorComponents/GeneralErrorMessage";
import { Textarea } from "@/components/ui/textarea";
import { Option } from "@/types/statics/forms";
import { UPDATEFORMSTATICS as FORMSTATICS } from "../_statics/forms";
import { CustomFormDescription } from "@/components/ui/custom/CustomFormDescription";
import { METADATA } from "../_statics/metadata";
import { useStorages } from "@/app/(admin)/(catalog)/storage/storages/_hooks/useStorages";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";

interface UpdateOutgoingSheetProps {
  outgoing: DetailedOutgoing;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}

export function UpdateOutgoingSheet({
  outgoing,
  open: controlledOpen,
  onOpenChange,
  showTrigger = true,
}: UpdateOutgoingSheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const { updateMutation } = useOutgoing();

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

  const form = useForm<UpdateOutgoingInput>({
    resolver: zodResolver(updateOutgoingSchema),
    defaultValues: {
      name: outgoing.name ?? FORMSTATICS.name.defaultValue,
      storageId: outgoing.storageId ?? FORMSTATICS.storageId.defaultValue,
      date: outgoing.date ?? FORMSTATICS.date.defaultValue,
      state: outgoing.state ?? FORMSTATICS.state.defaultValue,
      description: outgoing.description ?? FORMSTATICS.description.defaultValue,
      referenceId: outgoing.referenceId ?? FORMSTATICS.referenceId.defaultValue,
    },
  });

  const {
    control,
    register,
    //watch,
    //formState: { errors },
  } = form

  const onSubmit = async (data: UpdateOutgoingInput) => {
    if (updateMutation.isPending) return;

    try {
      await updateMutation.mutateAsync(
        {
          id: outgoing.id,
          data,
        },
        {
          onSuccess: () => {
            setOpen(false);
            form.reset();
          },
          onError: (error) => {
            console.error(
              `Error al actualizar ${METADATA.entityName.toLowerCase()}:`,
              error
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
      console.error("Error in onSubmit:", error);
    }
  };

  const { activeStoragesQuery: responseStorages } = useStorages();
  const responseTypeProducts = useTypeProducts();
  if (responseStorages.isLoading && responseTypeProducts.activeIsLoading) {
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
      return (
        <GeneralErrorMessage
          error={new Error("No se encontraron categorías")}
          reset={responseStorages.refetch}
        />
      );
    }
  }

  const storageOptions: Option[] = responseStorages.data.map((category) => ({
    label: category.name,
    value: category.id,
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
          <SheetTitle>
            Actualizar {METADATA.entityName.toLowerCase()}
          </SheetTitle>
          <SheetDescription>
            Actualiza la información de este(a){" "}
            {METADATA.entityName.toLowerCase()} y guarda los cambios
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="p-2 sm:p-1 overflow-auto max-h-[calc(80dvh-4rem)] grid md:grid-cols-2 gap-4">
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
                {/* <div className="flex flex-col gap-4 col-span-2">
                  <FormLabel>{FORMSTATICS.movement.label}</FormLabel>
                  <Table className="w-full">
                    <TableCaption>Lista de productos seleccionados</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Nombre</TableHead>
                          <TableHead>Cantidad</TableHead>
                          <TableHead className="text-center">Precio</TableHead>
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
                      const quantity = safeWatch.quantity ?? 0;

                      const total = isNaN(price * quantity) ? 0 : price * quantity;
                      return <TableRow key={field.id}>
                      <TableCell>
                        <FormItem>
                          <div>
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
                          <Input
                            {...register(`movement.${index}.quantity` as const, {
                              valueAsNumber: true
                            })}
                            type="number"
                          />
                          <FormMessage />
                        </FormItem>
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell className="flex justify-center">
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
                  <div className="col-span-2 w-full flex flex-col gap-2 justify-center items-center py-4">
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
                </div> */}
                
                {/* Estado */}
                <FormField
                  control={form.control}
                  name={FORMSTATICS.state.name}
                  render={({ field }) => (
                    <FormItem className="space-y-3">
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
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                    // Verifica si es string
                                    typeof field.value === "string"
                                      ? format(new Date(field.value), "PPP", { locale: es })
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

                {/* Descripción */}
                <div className="col-span-2">
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
