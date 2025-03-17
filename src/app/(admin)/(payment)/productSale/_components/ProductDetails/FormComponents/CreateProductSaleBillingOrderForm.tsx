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
import { CustomFormDescription } from "@/components/ui/custom/CustomFormDescription";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import {
  CreateProductSaleBillingInput,
  paymentMethodConfig,
  paymentMethodOptions,
} from "@/app/(admin)/(payment)/orders/_interfaces/order.interface";
import { useProductsStockByUse } from "@/app/(admin)/(inventory)/stock/_hooks/useProductStock";
import {
  useSelectedProducts,
  useSelectProductDispatch,
} from "../../../_hooks/useSelectProducts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBranches } from "@/app/(admin)/branches/_hooks/useBranches";
import { OutgoingProducStockForm } from "@/app/(admin)/(inventory)/stock/_interfaces/stock.interface";
import { SelectProductDialog } from "./SelectProductDialog";
import LoadingDialogForm from "../../LoadingDialogForm";
import GeneralErrorMessage from "../../errorComponents/GeneralErrorMessage";
import { usePatients } from "@/app/(admin)/(patient)/patient/_hooks/usePatient";
import SearchPatientCombobox from "../../FilterComponents/SearchPatientCombobox";
import { toast } from "sonner";

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

  const isCalculatingProductsRef = useRef(false);

  const [showProductTotals, setShowProductTotals] = useState(false);
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
      append({
        productId: product.id,
        quantity: product.Stock[0].stock == 0 ? 0 : 1, //THis is the default value for quantity
        storageId: product.Stock[0].Storage.id,
      });
    });
  }, [selectedProducts, append, remove]);

  useEffect(() => {
    syncProducts();
  }, [syncProducts]);

  // const removeAllProductStockStateDataState = useCallback((productId: string) => {
  //   setProductStockState((prev) => prev.filter((item) => item.id !== productId));
  // }, []);

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

  const calculateProductTotals = useCallback(() => {
    if (isCalculatingProductsRef.current) return;
    isCalculatingProductsRef.current = true;

    try {
      if (selectedProducts.length === 0 || !watchFieldArray) {
        setProductTotals({
          total: 0,
          totalIGV: 0,
          totalSubtotal: 0,
          totalQuantity: 0,
          totalProducts: 0,
        });
        setShowProductTotals(false);
        return;
      }

      let total = 0;
      let totalIGV = 0;
      let totalSubtotal = 0;
      let totalQuantity = 0;
      let totalProducts = 0;
      const IGV_RATE = 0.18;

      selectedProducts.forEach((product) => {
        const productData = watchFieldArray.find(
          (p) => p?.productId === product.id
        );
        if (!productData) return;

        const price = product.precio ?? 0;
        // Ensure quantity is a valid number
        const quantityValue = productData.quantity;
        const quantity = typeof quantityValue === 'number' && !isNaN(quantityValue) ? quantityValue : 0;
        
        // Calculate values only if both price and quantity are valid
        if (price > 0 && quantity > 0) {
          const totalWithIGV = price * quantity;
          const igv = totalWithIGV * (IGV_RATE / (1 + IGV_RATE));
          const subtotal = totalWithIGV - igv;

          total += totalWithIGV;
          totalIGV += igv;
          totalSubtotal += subtotal;
          totalQuantity += quantity;
          totalProducts++;
        }
      });

      // Ensure all calculated values are finite numbers
      setProductTotals({
        total: isFinite(total) ? total : 0,
        totalIGV: isFinite(totalIGV) ? totalIGV : 0,
        totalSubtotal: isFinite(totalSubtotal) ? totalSubtotal : 0,
        totalQuantity: isFinite(totalQuantity) ? totalQuantity : 0,
        totalProducts,
      });

      setShowProductTotals(totalProducts > 0);
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Error calculando totales de productos: " + error.message);
      } else {
        toast.error("Error calculando totales de productos");
      }
    } finally {
      isCalculatingProductsRef.current = false;
    }
  }, [selectedProducts, watchFieldArray]);

  useEffect(() => {
    calculateProductTotals();
  }, [calculateProductTotals]);

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
          <div className="col-span-4 sm:col-span-2">
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
          <div className="col-span-4 sm:col-span-2">
            <FormItem className="w-full">
              <FormLabel>{FORMSTATICS.patientId.label}</FormLabel>
              <SearchPatientCombobox
                onValueChange={(val) => {
                  onSubmitPatient(val);
                }}
              />
              {form.formState.errors.patientId && (
                <FormMessage className="text-destructive">
                  {form.formState.errors.patientId.message}
                </FormMessage>
              )}
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
                  <TableHead>Precio</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-center">Stock restante</TableHead>
                  <TableHead className="text-center">Stock General</TableHead>
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
                      label: (
                        <div>
                          {stock.Storage.name} {"(Stock "}{" "}
                          <span className="text-primary font-bold">
                            {stock.stock}
                          </span>
                          {")"}
                        </div>
                      ),
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
                  const total = isNaN(price * (safeWatch.quantity ?? 0))
                    ? 0
                    : price * (safeWatch.quantity ?? 0);
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
                            defaultValue={field.storageId}
                            onValueChange={(val) => {
                              form.setValue(`products.${index}.storageId`, val);
                              calculateProductTotals();
                            }}
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
                        <span className="block text-center">
                          {price.toLocaleString("es-PE", {
                            style: "currency",
                            currency: "PEN",
                          })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <FormItem>
                          {/* <FormLabel>Cantidad</FormLabel> */}
                          <Input
                            className="font-bold"
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
                            min={1}
                            placeholder="0"
                            onInput={(e) => {
                              const target = e.target as HTMLInputElement;
                              if (target.value === "") {
                                return;
                              }
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
                              setTimeout(() => calculateProductTotals(), 0);
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
                        <span className="block text-center font-semibold">
                          {total.toLocaleString("es-PE", {
                            style: "currency",
                            currency: "PEN",
                          })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="block text-center text-primary font-bold">
                          {dynamicStock}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="block text-center">{totalStock}</span>
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
                {showProductTotals && selectedProducts.length > 0 && (
                  <TableRow className="bg-muted/30 font-medium animate-fade-down">
                    <TableCell colSpan={4} className="font-bold">
                      TOTALES ({productTotals.totalProducts} productos):
                    </TableCell>
                    {/* <TableCell className="font-semibold">
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
                    </TableCell> */}
                    <TableCell
                      colSpan={1}
                      className="text-lg text-primary font-bold"
                    >
                      {productTotals.total.toLocaleString("es-PE", {
                        style: "currency",
                        currency: "PEN",
                      })}
                    </TableCell>
                    <TableCell colSpan={3}></TableCell>
                  </TableRow>
                )}
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
              {form.formState.errors.products && (
                <FormMessage className="text-destructive">
                  {form.formState.errors.products.message}
                </FormMessage>
              )}
            </div>
          </div>

          <Separator className="col-span-4" />

          <div className="col-span-2">
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
