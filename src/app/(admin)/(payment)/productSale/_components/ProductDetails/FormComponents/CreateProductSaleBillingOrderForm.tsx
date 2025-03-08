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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CREATE_PRESCRIPTION_ORDER_FORMSTATICS as STATIC_FORM } from "../../../_statics/forms";
import { Option } from "@/types/statics/forms";
import { CustomFormDescription } from "@/components/ui/custom/CustomFormDescription";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useStorages } from "@/app/(admin)/(catalog)/storage/storages/_hooks/useStorages";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
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
  useProductsStockByUse,
  useProductStockById,
} from "@/app/(admin)/(inventory)/stock/_hooks/useProductStock";
import {
  useSelectedProducts,
  useSelectProductDispatch,
} from "../../../_hooks/useSelectProducts";
import { useProducts } from "@/app/(admin)/(catalog)/product/products/_hooks/useProduct";
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
import { Product } from "@/app/(admin)/(patient)/update-history/_interfaces/updateHistory.interface";
import { usePatients } from "@/app/(admin)/(patient)/patient/_hooks/usePatient";
import SearchPatientCombobox from "@/app/(admin)/(payment)/prescriptions/_components/FilterComponents/SearchPatientCombobox";

interface CreateProductSaleFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateProductSaleBillingInput>;
  controlledFieldArray: UseFieldArrayReturn<CreateProductSaleBillingInput>;
  onSubmit: (data: CreateProductSaleBillingInput) => void;
}

export function CreateProductSaleBillingOrderForm({
  children,
  form,
  onSubmit,
  controlledFieldArray,
}: CreateProductSaleFormProps) {
  const FORMSTATICS = useMemo(() => STATIC_FORM, []);

  const didInitializeRef = useRef(false);
  const isCalculatingRef = useRef(false);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [showProductFields, setShowProductFields] = useState(false);
  const [showServicesFields, setShowServicesFields] = useState(true);
  const [originalProductsStock, setOriginalProductsStock] = useState<
    OutgoingProducStockForm[]
  >([]);
  const [showTotals, setShowTotals] = useState(false);
  const [productTotals, setProductTotals] = useState({
    total: 0,
    totalIGV: 0,
    totalSubtotal: 0,
    totalQuantity: 0,
    totalProducts: 0,
  });

  const { register, watch } = form;
  const { fields, append, remove } = controlledFieldArray;
  const watchFieldArray = watch("products");
  const controlledFields = fields.map((field, index) => {
    const watchItem = watchFieldArray?.[index];
    return {
      ...field,
      ...(watchItem ?? {}),
    };
  });
  // const storageSafeWatch = watch("storageId");

  // const { activeStoragesQuery: responseStorage } = useStorages();
  // const { activeProductsQuery: reponseProducts } = useProducts();
  const { activeBranchesQuery: responseBranches } = useBranches();
  const { patientsQuery: responsePatients, usePatientByDNI } = usePatients();
  const forSaleProductStockQuery = useProductsStockByUse();
  const { productStockQuery } = forSaleProductStockQuery("VENTA");

  const selectedProducts = useSelectedProducts();
  const dispatch = useSelectProductDispatch();

  const onSubmitPatient = useCallback(
    (value: string) => {
      form.setValue("patientId", value);
      // if (response.data) {
      //   toast.success("Stock filtrado correctamente");
      // }
    },
    [usePatientByDNI]
  );

  const syncProducts = useCallback(() => {
    // Limpiar fields existentes
    remove(); //Without parameters it removes all fields

    // Agregar nuevos productos
    selectedProducts.forEach((product) => {
      //console.log('product', product);
      append({
        productId: product.id,
        quantity: 1, //THis is the default value for quantity
        storageId: product.storageId,
      });
    });
  }, [selectedProducts, append, remove]);

  useEffect(() => {
    syncProducts();
  }, [syncProducts]);

  // useEffect(() => {
  //   if (didInitializeRef.current) return;
  //   didInitializeRef.current = true;

  //   remove();

  //   selectedProducts.forEach((product) => {
  //     append({
  //       productId: product.id,
  //       quantity: 1,
  //       storageId: undefined,
  //     });
  //   });

  //   setTimeout(() => calculateTotalsWithDebounce(), 500);
  // }, [append, remove, selectedProducts, calculateTotalsWithDebounce]);

  // const handleRemoveProduct = useCallback(
  //   (index: number) => {
  //     if (fields[index]) {
  //       dispatch({
  //         type: "remove",
  //         payload: { productId: fields[index].productId },
  //       });
  //     }
  //     remove(index);
  //     calculateTotalsWithDebounce();
  //   },
  //   [fields, dispatch, remove, calculateTotalsWithDebounce]
  // );

  // const calculateTotalsWithDebounce = useCallback(() => {
  //   if (updateTimeoutRef.current) {
  //     clearTimeout(updateTimeoutRef.current);
  //   }

  //   updateTimeoutRef.current = setTimeout(() => {
  //     if (isCalculatingRef.current) return;
  //     isCalculatingRef.current = true;

  //     try {
  //       const products = form.getValues("products") || [];

  //       if (products.length === 0) {
  //         setProductTotals({
  //           total: 0,
  //           totalIGV: 0,
  //           totalSubtotal: 0,
  //           totalQuantity: 0,
  //           totalProducts: 0,
  //         });
  //         setShowTotals(false);
  //         return;
  //       }

  //       let total = 0;
  //       let totalIGV = 0;
  //       let totalSubtotal = 0;
  //       let totalQuantity = 0;
  //       let totalProducts = 0;
  //       const IGV_RATE = 0.18;

  //       products.forEach((field) => {
  //         const productData = selectedProducts.find(
  //           (p) => p.id === field.productId
  //         );
  //         if (!productData) return;

  //         const price = productData.precio ?? 0;
  //         const quantity = field.quantity ?? 0;
  //         const subtotal = price * quantity;
  //         const igvAmount = subtotal * IGV_RATE;

  //         total += subtotal + igvAmount;
  //         totalIGV += igvAmount;
  //         totalSubtotal += subtotal;
  //         totalQuantity += quantity;
  //         totalProducts++;
  //       });

  //       setProductTotals({
  //         total,
  //         totalIGV,
  //         totalSubtotal,
  //         totalQuantity,
  //         totalProducts,
  //       });

  //       setShowTotals(true);
  //     } catch (error) {
  //       console.error("Error calculando totales:", error);
  //     } finally {
  //       isCalculatingRef.current = false;
  //     }
  //   }, 200);
  // }, [form, selectedProducts, calculateTotalsWithDebounce]);

  const isLoading =
    productStockQuery.isLoading ||
    responseBranches.isLoading ||
    responsePatients.isLoading;

  if (isLoading) {
    return <LoadingDialogForm />;
  }

  if (productStockQuery.isError) {
    return (
      <GeneralErrorMessage
        error={productStockQuery.error}
        reset={productStockQuery.refetch}
      />
    );
  }
  if (!productStockQuery.data) {
    return <LoadingDialogForm />;
  }
  if (responseBranches.isError) {
    return (
      <GeneralErrorMessage
        error={responseBranches.error}
        reset={responseBranches.refetch}
      />
    );
  }
  if (!responseBranches.data) {
    return <LoadingDialogForm />;
  }
  if (responsePatients.isError) {
    return (
      <GeneralErrorMessage
        error={responsePatients.error}
        reset={responsePatients.refetch}
      />
    );
  }
  if (!responsePatients.data) {
    return <LoadingDialogForm />;
  }

  // const patientOptions = responseStorage.data.map((storage) => ({
  //   label: `${storage.name} - ${storage.branch.name}`,
  //   value: storage.id,
  // }));

  const branchOptions = responseBranches.data.map((branch) => ({
    label: branch.name,
    value: branch.id,
  }));

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
          <div className="col-span-4">
            <FormField
              control={form.control}
              name="branchId"
              render={({ field }) => (
                <FormItem className="w-full sm:w-1/2">
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
                  <CustomFormDescription
                    required={FORMSTATICS.branchId.required}
                  />
                  <FormDescription>
                    Solo visualizará sucursales activas
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormItem className="w-full sm:w-1/2">
              <FormLabel>{FORMSTATICS.patientId.label}</FormLabel>
              <SearchPatientCombobox
                onValueChange={(val) => {
                  onSubmitPatient(val);
                }}
              />
              <FormMessage />
              <CustomFormDescription
                required={FORMSTATICS.patientId.required}
              />
              <FormDescription>
                Solo visualizará pacientes activos
              </FormDescription>
            </FormItem>
          </div>

          {<Separator className="col-span-4" />}

          <div className="flex flex-col gap-4 col-span-4">
            <FormLabel>{FORMSTATICS.products.label}</FormLabel>
            <Table className="w-full">
              {/* <TableCaption>Si escoges otro almacén se reiniciará la lista de productos seleccionados.</TableCaption> */}
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Nombre</TableHead>
                  <TableHead className="text-center text-balance max-w-10">
                    Almacén
                  </TableHead>
                  <TableHead className="text-center">Stock General</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-center">Opciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {controlledFields.map((field, index) => {
                  const data = selectedProducts.find(
                    (p) => p.id === field.productId
                  );
                  const safeData: Partial<OutgoingProducStockForm> = data ?? {};
                  const safeWatch = watchFieldArray?.[index] ?? {};
                  //const price = safeData.precio ?? 0;
                  const safeStorages =
                    safeData.Stock?.map((stock) => ({
                      label: `${stock.Storage.name} (Stock. ${stock.stock})`,
                      value: stock.Storage.id,
                    })) ?? [];
                  const stockStorage = safeData.Stock?.find(
                    (stock) => stock.Storage.id === safeWatch.storageId
                  );
                  // const stockStorage = safeData.Stock?.find((stock) => stock.Storage.id === storageSafeWatch);
                  const totalStock =
                    safeData.Stock?.reduce(
                      (acc, stock) => acc + stock.stock,
                      0
                    ) ?? 0;
                  const dynamicStock = isNaN(
                    (stockStorage?.stock ?? 0) - (safeWatch.quantity ?? 0)
                  )
                    ? stockStorage?.stock ?? 0
                    : (stockStorage?.stock ?? 0) - (safeWatch.quantity ?? 0);

                  const price = safeData.precio ?? 0;
                  const total = price * (safeWatch.quantity ?? 0);
                  //const quantity = safeWatch.quantity ?? 0;

                  // Manejar NaN o valores inexistentes
                  //const total = isNaN(price * quantity) ? 0 : price * quantity;
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
                          <Select
                            {...register(
                              `products.${index}.storageId` as const
                            )}	
                            value={field.storageId}
                            // onValueChange={(value) =>
                            //   handleEditProduct(index, {
                            //     storageId: value,
                            //   })
                            // }
                            // disabled={!field.selected}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleccionar almacén" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {safeStorages.map((storage) => (
                                <SelectItem
                                  key={storage.value}
                                  value={storage.value}
                                >
                                  {storage.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      </TableCell>
                      <TableCell>
                        <FormItem>
                          {/* <FormLabel>Cantidad</FormLabel> */}
                          <Input
                            {...register(
                              `movement.${index}.quantity` as const,
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
                          {/* <FormLabel>Stock total</FormLabel> */}
                          <span className="block text-center">
                            {totalStock}
                          </span>
                        </div>
                      </TableCell>
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
              {/* <SelectProductDialog data={reponseProducts.data}>
              </SelectProductDialog> */}
              <SelectProductDialog form={form}></SelectProductDialog>
              <CustomFormDescription required={true}></CustomFormDescription>
              {form.formState.errors.movement && (
                <FormMessage className="text-destructive">
                  {form.formState.errors.movement.message}
                </FormMessage>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 col-span-4">
            <FormLabel>{FORMSTATICS.products.label}</FormLabel>

            {isCalculatingRef.current && (
              <div className="w-full p-2 text-center">
                <p className="text-muted-foreground animate-pulse">
                  Actualizando totales...
                </p>
              </div>
            )}

            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Nombre</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>{"IGV(18%)"}</TableHead>
                  <TableHead>Subtotal</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-center">Opciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No hay productos seleccionados
                    </TableCell>
                  </TableRow>
                ) : (
                  fields.map((field, index) => {
                    const IGV = 0.18;
                    const data = selectedProducts.find(
                      (p) => p.id === field.productId
                    );
                    const price = data?.precio ?? 0;
                    const quantity = field.quantity ?? 0;
                    const subtotal = price * quantity;
                    const priceWithIGV = price * (1 + IGV);
                    const totalPriceWithIGV = priceWithIGV * quantity;
                    const totalIGV = price * quantity * IGV;

                    return (
                      <TableRow key={field.id} className="animate-fade-down">
                        <TableCell>
                          <FormItem>
                            <div>
                              <span>{data?.name ?? "Desconocido"}</span>
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
                            <Input
                              type="number"
                              {...register(`products.${index}.quantity`, {
                                valueAsNumber: true,
                              })}
                              className={cn(
                                "text-center",
                                quantity === 0 && "text-muted-foreground"
                              )}
                              placeholder="0"
                            />
                            <FormMessage />
                          </FormItem>
                        </TableCell>
                        <TableCell>
                          <span className="block text-center">
                            {price.toLocaleString("es-PE", {
                              style: "currency",
                              currency: "PEN",
                            })}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="block text-center">
                            {totalIGV.toLocaleString("es-PE", {
                              style: "currency",
                              currency: "PEN",
                            })}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="block text-center">
                            {subtotal.toLocaleString("es-PE", {
                              style: "currency",
                              currency: "PEN",
                            })}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="block text-center font-semibold text-base">
                            {totalPriceWithIGV.toLocaleString("es-PE", {
                              style: "currency",
                              currency: "PEN",
                            })}
                          </span>
                        </TableCell>
                        <TableCell className="flex justify-center items-center">
                          <Button
                            type="button"
                            variant="outline"
                            className="hover:bg-destructive hover:text-white"
                            size="sm"
                            onClick={() => handleRemoveProduct(index)}
                          >
                            <Trash2 className="mr-1 size-4" />
                            Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}

                {showTotals && fields.length > 0 && (
                  <TableRow className="bg-muted/30 font-medium animate-fade-down">
                    <TableCell colSpan={2} className="font-bold">
                      TOTALES:
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell className="font-semibold">
                      {productTotals.totalIGV.toLocaleString("es-PE", {
                        style: "currency",
                        currency: "PEN",
                      })}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {productTotals.totalSubtotal.toLocaleString("es-PE", {
                        style: "currency",
                        currency: "PEN",
                      })}
                    </TableCell>
                    <TableCell
                      colSpan={2}
                      className="text-lg text-primary font-bold"
                    >
                      {productTotals.total.toLocaleString("es-PE", {
                        style: "currency",
                        currency: "PEN",
                      })}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="w-full flex flex-col gap-2 justify-center items-center py-4">
              <CustomFormDescription required={true} />
              {form.formState.errors.products && (
                <FormMessage className="text-destructive">
                  {form.formState.errors.products.message}
                </FormMessage>
              )}
            </div>
          </div>

          <Separator className="col-span-4" />

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
                              "mb-2"
                            )}
                          >
                            <div className="flex space-x-1 items-center justify-center">
                              <Icon className="size-4" />
                              <span>{method.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  <FormDescription>
                    Solo visualizará métodos de pago activos
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>

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

          <Separator className="col-span-4" />
        </div>
        {children}
      </form>
    </Form>
  );
}
