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
import { CREATE_PRESCRIPTION_ORDER_FORMSTATICS as STATIC_FORM } from "../../../_statics/forms";
import { Option } from "@/types/statics/forms";
import { CustomFormDescription } from "@/components/ui/custom/CustomFormDescription";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useStorages } from "@/app/(admin)/(catalog)/storage/storages/_hooks/useStorages";
//import { useProducts } from "@/app/(admin)/(catalog)/product/products/_hooks/useProduct";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  CreateProductSaleBillingInput,
  paymentMethodConfig,
  paymentMethodOptions,
} from "@/app/(admin)/(payment)/orders/_interfaces/order.interface";
import {
  useProductsStock,
  useProductStockById,
} from "@/app/(admin)/(inventory)/stock/_hooks/useProductStock";
import {
  useSelectedProducts,
  useSelectProductDispatch,
} from "../../../_hooks/useSelectProducts";
import { useProducts } from "@/app/(admin)/(catalog)/product/products/_hooks/useProduct";
import { PrescriptionWithPatient } from "../../../_interfaces/prescription.interface";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBranches } from "@/app/(admin)/branches/_hooks/useBranches";
import { OutgoingProducStockForm } from "@/app/(admin)/(inventory)/stock/_interfaces/stock.interface";
import { toast } from "sonner";
import { SelectProductDialog } from "./SelectProductDialog";
import LoadingDialogForm from "../../LoadingDialogForm";
import GeneralErrorMessage from "../../errorComponents/GeneralErrorMessage";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
// import { ScrollArea } from "@/components/ui/scroll-area";

interface CreatePrescriptionOrderFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  prescription: PrescriptionWithPatient;
  form: UseFormReturn<CreateProductSaleBillingInput>;
  controlledFieldArray: UseFieldArrayReturn<CreateProductSaleBillingInput>;
  onSubmit: (data: CreateProductSaleBillingInput) => void;
  onDialogClose?: () => void;
}

//Falta el filtrado de productos por ambito de uso
export function CreatePrescriptionOrderForm({
  children,
  prescription,
  form,
  onSubmit,
  controlledFieldArray,
}: CreatePrescriptionOrderFormProps) {
  const FORMSTATICS = useMemo(() => STATIC_FORM, []);
  const [showProductFields, setShowProductFields] = useState(false);
  const [showServicesFields, setShowServicesFields] = useState(false);
  const { register, watch } = form;
  const { fields, append, remove } = controlledFieldArray;
  const watchFieldArray = watch("products");
  const storageSafeWatch = watch("storageId");
  const controlledFields = fields.map((field, index) => {
    const watchItem = watchFieldArray?.[index];
    return {
      ...field,
      ...(watchItem ?? {}),
    };
  });

  const { activeStoragesQuery: responseStorage } = useStorages();
  const { productStockQuery: reponseProductsStock } = useProductsStock();
  const { activeProductsQuery: reponseProducts } = useProducts();
  const { activeBranchesQuery: responseBranches } = useBranches();
  const productStockById = useProductStockById();
  //const stockByStorageQuery = useStockByStorage(outgoing.storageId);
  const selectedProducts = useSelectedProducts();
  const dispatch = useSelectProductDispatch();

  const originalProducts = prescription.prescriptionMedicaments;
  const orginalProductsIds = originalProducts.map((product) => product.id);
  // const mappedOriginalQuantities: Record<string, number> = {};
  // const originalQuantitiesRef = useRef<Record<string, number>>(
  //   mappedOriginalQuantities
  // );

  // export interface OutgoingProducStockForm {
  //   id: string;
  //   name: string;
  //   precio: number;
  //   codigoProducto: string;
  //   unidadMedida: string;
  //   Stock: ProductStockData[];
  //   storageId: string;
  // }

  //SOlo va a alvergar 1
  const originalProductsStock: OutgoingProducStockForm[] =
    originalProducts.flatMap((product) => {
      if (!product.id) {
        return [];
      }

      const { productStockQuery: response } = productStockById(product.id);

      if (response.isError) {
        toast.error(response.error?.message ?? "Error desconocido");
        return [];
      }

      if (response.data?.length === 1) {
        return [
          {
            ...response.data[0],
            storageId: storageSafeWatch,
          },
        ];
      }
      return [];
    });

  const syncProducts = useCallback(() => {
    // Limpiar fields existentes
    remove(); //Without parameters it removes all fields
    const localSelectedProducts = selectedProducts.filter(
      (product) => !orginalProductsIds.includes(product.id)
    );

    originalProducts.forEach((product) => {
      //console.log('product', product);
      if (product.id) {
        append({
          productId: product.id,
          quantity: product.quantity ?? 1,
        });
      }
    });

    // Agregar nuevos productos
    localSelectedProducts.forEach((product) => {
      //console.log('product', product);
      append({
        productId: product.id,
        quantity: 1, //THis is the default value for quantity
      });
    });
  }, [selectedProducts, append, remove]);

  // const handleClearProductList = useCallback(() => {
  //   dispatch({ type: "clear" });
  //   remove();
  // }, [dispatch, remove]);

  useEffect(() => {
    syncProducts();
  }, [syncProducts]);

  if (
    responseStorage.isLoading &&
    reponseProductsStock.isLoading &&
    reponseProducts.isLoading &&
    responseBranches.isLoading
  ) {
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
      return <LoadingDialogForm />;
    }
    if (reponseProductsStock.isError) {
      return reponseProductsStock.error ? (
        <GeneralErrorMessage
          error={reponseProductsStock.error}
          reset={reponseProductsStock.refetch}
        />
      ) : null;
    }
    if (!reponseProductsStock.data) {
      return <LoadingDialogForm />;
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
      return <LoadingDialogForm />;
    }

    if (responseBranches.isError) {
      return responseBranches.error ? (
        <GeneralErrorMessage
          error={responseBranches.error}
          reset={responseBranches.refetch}
        />
      ) : null;
    }

    if (!responseBranches.data) {
      return <LoadingDialogForm />;
    }
  }

  // if (
  //   METADATA.dataDependencies &&
  //   (responseStorage.data.length === 0 || reponseProductsStock.data.length === 0)
  // ) {
  //   return (
  //     <DataDependencyErrorMessage
  //       error={
  //         new Error(
  //           `No existe la información necesaria. Revisar presencia de información en: ${METADATA.dataDependencies
  //             .map((dependency) => dependency.dependencyName)
  //             .join(", ")}`
  //         )
  //       }
  //       dataDependencies={METADATA.dataDependencies}
  //     />
  //   );
  // }

  const storageOptions: Option[] = responseStorage.data.map((storage) => {
    return {
      label: `${storage.name} - ${storage.branch.name}`,
      value: storage.id,
    };
  });

  const branchOptions: Option[] = responseBranches.data.map((branch) => {
    return {
      label: branch.name,
      value: branch.id,
    };
  });

  const handleRemoveProduct = (index: number) => {
    // this removes from the tanstack state management
    dispatch({
      type: "remove",
      payload: {
        productId: fields[index].productId,
      },
    });

    //THis removes from the react-hook-form arraylist
    remove(index);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="p-2 sm:p-1 overflow-auto max-h-[calc(80dvh-4rem)] grid md:grid-cols-4 gap-4">
          <FormItem className="flex flex-row items-end justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Venta de productos</FormLabel>
              <FormDescription>
                Activar esta opción si se va a realizar una venta de productos de la receta o adicionales
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                className="!m-0"
                checked={showProductFields}
                onCheckedChange={setShowProductFields}
              />
            </FormControl>
          </FormItem>
          <FormItem className="flex flex-row items-end justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Contrato de servicios</FormLabel>
              <FormDescription>
                Activar esta opción si se va a agendar y/o contratar servicios de parte del cliente/paciente.
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                className="!m-0"
                checked={showServicesFields}
                onCheckedChange={setShowServicesFields}
              />
            </FormControl>
          </FormItem>

          {/* Campo Sucursal */}
          <div className="col-span-3">
            <FormField
              control={form.control}
              name="branchId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{FORMSTATICS.branchId.label}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={FORMSTATICS.branchId.placeholder}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {branchOptions.map((branch) => (
                        <SelectItem key={branch.value} value={branch.value}>
                          {branch.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  <FormDescription>
                    Solo visualizará sucursales activas
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>

          <Separator></Separator>

          {
            showProductFields && <>
              <div className="col-span-3">
              {/* <FormItem>
                <FormLabel>{FORMSTATICS.branchId.label}</FormLabel>
                <Input
                {...register(FORMSTATICS.branchId.label)}
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
              </FormItem> */}
              <FormField
                control={form.control}
                name="storageId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>{FORMSTATICS.storageId.label}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={FORMSTATICS.storageId.placeholder}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {storageOptions.map((storage) => (
                          <SelectItem key={storage.value} value={storage.value}>
                            {storage.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    <FormDescription>
                      Solo visualizará almacenes activos
                    </FormDescription>
                  </FormItem>
                )}
              />
              </div>
              <div className="flex flex-col gap-4 col-span-4">
                <FormLabel>{FORMSTATICS.products.label}</FormLabel>
                <Table className="w-full">
                  {/* <TableCaption>Si escoges otro almacén se reiniciará la lista de productos seleccionados.</TableCaption> */}
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Nombre</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>{"IGV(18%)"}</TableHead>
                      <TableHead>Precio Total</TableHead>
                      {/* <TableHead className="text-center text-balance max-w-10">
                        Stock Almacén Seleccionado
                      </TableHead>
                      <TableHead className="text-center">Stock General</TableHead> */}
                      <TableHead className="text-center">Opciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {controlledFields.map((field, index) => {
                      const IGV = 0.18;
                      const data = selectedProducts.find(
                        (p) => p.id === field.productId
                      );
                      const existentProduct = originalProductsStock.find(
                        (p) => p.id === field.productId
                      );
                      const safeData: Partial<OutgoingProducStockForm> =
                        existentProduct ? existentProduct ?? {} : data ?? {};
                      const safeWatch = watchFieldArray?.[index] ?? {};
                      // const storageSafeWatch = form.watch(FORMSTATICS.storageId.name);
                      const price = safeData.precio ?? 0;
                      const stockStorage = safeData.Stock?.find(
                        (stock) => stock.Storage.id === storageSafeWatch
                      );
                      // const totalStock =
                      //   safeData.Stock?.reduce(
                      //     (acc, stock) => acc + stock.stock,
                      //     0
                      //   ) ?? 0;
                      const dynamicStock = isNaN(
                        (stockStorage?.stock ?? 0) - (safeWatch.quantity ?? 0)
                      )
                        ? stockStorage?.stock ?? 0
                        : (stockStorage?.stock ?? 0) - (safeWatch.quantity ?? 0);
                      // const originalQuantityRef = existentProduct
                      //   ? originalQuantitiesRef.current[field.id] ?? 0
                      //   : 0;
                      // const existentProductOriginalStock = existentProduct
                      //   ? originalQuantityRef + (stockStorage?.stock ?? 0)
                      //   : 0;
                      const quantity = safeWatch.quantity ?? 0;
                      // Manejar NaN o valores inexistentes
                      //const totalPrice = isNaN(price * quantity) ? 0 : price * quantity;
                      // Calculate price with IGV (18% tax)
                      const priceWithIGV = price * (1 + IGV);
                      const totalPriceWithIGV = isNaN(priceWithIGV * quantity)
                        ? 0
                        : priceWithIGV * quantity;
                      const totalIGV = price * quantity * IGV;
                      // Price to display in the table
                      return (
                        <TableRow
                          key={field.id}
                          className="animate-fade-down duration-500"
                        >
                          <TableCell>
                            <FormItem>
                              {/* <FormLabel>Producto</FormLabel> */}
                              <div>
                                {/* <FormLabel>Nombre</FormLabel> */}
                                <span>{safeData.name ?? "Desconocido"}</span>
                              </div>
                              <Input
                                disabled
                                {...register(
                                  `products.${index}.productId` as const
                                )}
                                type="hidden"
                              />
                              <FormMessage />
                            </FormItem>
                          </TableCell>
                          <TableCell>
                            <FormItem>
                              {/* <FormLabel>Cantidad</FormLabel> */}
                              <Input
                                disabled={
                                  stockStorage ? stockStorage.stock <= 0 : false
                                }
                                {...register(
                                  `products.${index}.quantity` as const,
                                  {
                                    valueAsNumber: true,
                                    validate: (value) =>
                                      value > (stockStorage?.stock ?? 0)
                                        ? "La cantidad supera el stock disponible"
                                        : true,
                                  }
                                )}
                                type="number"
                                min="0"
                                onInput={(e) => {
                                  const target = e.target as HTMLInputElement;
                                  if (target.valueAsNumber < 0) {
                                    target.value = "0";
                                  }
                                  if (
                                    target.valueAsNumber >
                                    (stockStorage?.stock ?? 0)
                                  ) {
                                    target.value = (
                                      stockStorage?.stock ?? 0
                                    ).toString();
                                  }
                                }}
                              />
                              <FormMessage />
                              {stockStorage && (
                                <FormDescription>
                                  {stockStorage.stock <= 0
                                    ? `Stock disponible en Almacén "${
                                        stockStorage?.Storage.name ??
                                        "No seleccionado"
                                      }": ${dynamicStock}.`
                                    : `No hay stock disponible en el almacén "${
                                        stockStorage?.Storage.name ??
                                        "No seleccionado"
                                      }"`}
                                </FormDescription>
                              )}
                            </FormItem>
                          </TableCell>
                          <TableCell>
                            <div>
                              <span className="block text-center">
                                {price.toLocaleString("es-PE", {
                                  style: "currency",
                                  currency: "PEN",
                                })}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <span className="block text-center">
                                {totalIGV.toLocaleString("es-PE", {
                                  style: "currency",
                                  currency: "PEN",
                                })}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <span className="block text-center">
                                {totalPriceWithIGV.toLocaleString("es-PE", {
                                  style: "currency",
                                  currency: "PEN",
                                })}
                              </span>
                            </div>
                          </TableCell>
                          {/* <TableCell>
                            <div>
                              <p className="block text-center">
                                {`Alm. "${stockStorage?.Storage.name}" `}
                                {"("}
                                <span className="text-primary font-bold">
                                  {`${dynamicStock}`}
                                </span>
                                {")"}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <span className="block text-center">
                                {totalStock}
                              </span>
                            </div>
                          </TableCell> */}
                          <TableCell className="flex justify-center items-center">
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
                  {/* <SelectProductDialog data={reponseProductsStock.data}>
                  </SelectProductDialog> */}
                  <SelectProductDialog form={form}></SelectProductDialog>
                  <CustomFormDescription required={true}></CustomFormDescription>
                  {form.formState.errors.products && (
                    <FormMessage className="text-destructive">
                      {form.formState.errors.products.message}
                    </FormMessage>
                  )}
                </div>
              </div>
            </>
          }

          <Separator></Separator>

          {/* Fecha */}
          {/* <div className="col-span-1">
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
          </div> */}

          <div className="col-span-3">
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{FORMSTATICS.paymentMethod.label}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={FORMSTATICS.paymentMethod.placeholder}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentMethodOptions.map((method) => {
                        const {
                          backgroundColor,
                          hoverBgColor,
                          icon: Icon,
                          textColor,
                        } = paymentMethodConfig[method.value];
                        return (
                          <SelectItem
                            key={method.value}
                            value={method.value}
                            className={cn(
                              backgroundColor,
                              textColor,
                              hoverBgColor,
                              "mb-2 "
                            )}
                          >
                            <div className="flex space-x-1 items-center justify-center">
                              <Icon className="size-4"></Icon>
                              <span>{method.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  <FormDescription>
                    Solo visualizará sucursales activas activos
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
          {/* Descripción */}
          <div className="col-span-4">
            <FormItem>
              <FormLabel>{FORMSTATICS.notes.label}</FormLabel>
              <Textarea
                {...register(FORMSTATICS.notes.name)}
                placeholder={FORMSTATICS.notes.placeholder}
              />
              <CustomFormDescription required={FORMSTATICS.notes.required} />
              {form.formState.errors.notes && (
                <FormMessage className="text-destructive">
                  {form.formState.errors.notes.message}
                </FormMessage>
              )}
            </FormItem>
          </div>
          <Separator className="col-span-4"></Separator>

          {/* className="animate-fade-right animate-duration-500 col-span-2 flex items-end */}
        </div>
        {children}
      </form>
    </Form>
  );
}
