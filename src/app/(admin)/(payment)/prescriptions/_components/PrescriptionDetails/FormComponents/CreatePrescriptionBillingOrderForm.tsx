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
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
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
  CreatePrescriptionBillingInput,
  CreateProductSaleBillingInput,
  paymentMethodConfig,
  paymentMethodOptions,
  ProductSaleItemDto,
} from "@/app/(admin)/(payment)/orders/_interfaces/order.interface";
import {
  useManyProductsStockByStorage,
  useProductsStock,
  useProductStockById,
} from "@/app/(admin)/(inventory)/stock/_hooks/useProductStock";
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
import { OutgoingProducStockForm, OutgoingProductStock } from "@/app/(admin)/(inventory)/stock/_interfaces/stock.interface";
import { toast } from "sonner";
import { SelectProductDialog } from "./SelectProductDialog";
import LoadingDialogForm from "../../LoadingDialogForm";
import GeneralErrorMessage from "../../errorComponents/GeneralErrorMessage";
import { Product } from "@/app/(admin)/(patient)/update-history/_interfaces/updateHistory.interface";
import { getManyProductsStockByStorage } from "@/app/(admin)/(inventory)/stock/_actions/stock.actions";
import { UseQueryResult } from "@tanstack/react-query";
interface CreatePrescriptionOrderFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  prescription: PrescriptionWithPatient;
  stockDataQuery: UseQueryResult<OutgoingProductStock[], Error>
  //originalStorageId: string;
  form: UseFormReturn<CreatePrescriptionBillingInput>;
  controlledProductFieldArray: UseFieldArrayReturn<CreatePrescriptionBillingInput>;
  controlledServiceFieldArray: UseFieldArrayReturn<CreatePrescriptionBillingInput>;
  onSubmit: (data: CreatePrescriptionBillingInput) => void;
  onDialogClose?: () => void;
}

type StockParams = {
  productId: string;
  storageId: string;
}[]

export function CreatePrescriptionOrderForm({
  children,
  prescription,
  form,
  onSubmit,
  controlledProductFieldArray,
  controlledServiceFieldArray,
  stockDataQuery,
}: CreatePrescriptionOrderFormProps) {
  const FORMSTATICS = useMemo(() => STATIC_FORM, []);

  // Flags de referencia para evitar bucles
  const didInitializeRef = useRef(false);
  const isCalculatingProductsRef = useRef(false);
  const isCalculatingServicesRef = useRef(false);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Estados básicos
  const [showProductFields, setShowProductFields] = useState(false);
  const [showServicesFields, setShowServicesFields] = useState(true);
  // const [originalProductsStock, setOriginalProductsStock] = useState<
  // OutgoingProducStockForm[]
  // >([]);
  const [showProductTotals, setShowProductTotals] = useState(false);
  const [productTotals, setProductTotals] = useState({
    total: 0,
    totalIGV: 0,
    totalSubtotal: 0,
    totalQuantity: 0,
    totalProducts: 0,
  });
  const originalProductArrayRef = useRef<ProductSaleItemDto[]>(form.getValues("products"));
  const productsStockRef = useRef<StockParams>([]);
  const [productsStock, setProductsStock] = useState<OutgoingProducStockForm[]>(
    []
  );

  // Hook de formulario
  const { register, watch } = form;
  const { fields, remove } = controlledProductFieldArray;
  const watchFieldArray = watch("products");
  // const storageSafeWatch = watch("storageId");

  // Consultas y estados
  const { activeStoragesQuery: responseStorage } = useStorages();
  const { productStockQuery: reponseProductsStock } = useProductsStock();
  const { activeProductsQuery: reponseProducts, productsByIdQueries } =
    useProducts();
  const { activeBranchesQuery: responseBranches } = useBranches();
  const productStockById = useProductStockById();

  const originalProducts = prescription.prescriptionMedicaments;
  // const orginalProductsIds = originalProducts.map((product) => product.id);
  // const [isStockPending, startTransition] = useTransition();

  // const getProductStockByStorage = useCallback(
  //   async (params: StockParams) => {

  //     if (params.length === 0) {
  //       return [];
  //     }
      
  //     params.forEach((param)=>{
  //       if (!param.productId || !param.storageId) {
  //         toast.error("Se requiere producto y almacén para obtener el stock");
  //         return;
  //       }
  //     })

  //     return new Promise((resolve) => {
  //       startTransition(async () => {
  //         try {
  //           const response = await getManyProductsStockByStorage(params);
  //           if (!response || "error" in response) {
  //             throw new Error(response?.error || "No se recibió respuesta");
  //           }
  //           resolve(response);
  //         } catch (error) {
  //           const message =
  //             error instanceof Error ? error.message : "Error desconocido";
  //           toast.error(message);
  //           resolve([]);
  //         }
  //       });
  //     });
  //   },
  //   []
  // );

  // Obtener datos de productos por ID seleccionados - solamente para los productos que ya están en fields
  const productIds = fields.map((field) => field.productId).filter(Boolean);
  const productsQueries = productsByIdQueries(productIds);

  // Mapeo de datos de productos
  const orderProductsDataMap = useMemo(() => {
    const dataMap: Record<string, Product> = {};

    productsQueries.forEach((query) => {
      if (query.isSuccess && query.data) {
        const product = query.data;
        if ("error" in product) return;
        dataMap[product.id] = product;
      }
    });

    return dataMap;
  }, [productsQueries]);

  // Estados para gestionar la edición de cantidades
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Función para calcular totales con debounce integrado
  const calculateTotalsWithDebounce = useCallback(() => {
    // Limpiar cualquier cálculo pendiente
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    // Programar nuevo cálculo con un pequeño retraso
    updateTimeoutRef.current = setTimeout(() => {
      // Evitar cálculos múltiples
      if (isCalculatingProductsRef.current) return;
      isCalculatingProductsRef.current = true;

      try {
        const products = form.getValues("products") || [];

        if (products.length === 0) {
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

        products.forEach((field) => {
          const productData = orderProductsDataMap[field.productId];
          if (!productData) return;

          const price = productData.precio ?? 0; // price includes IGV
          const quantity = field.quantity ?? 0;
          const totalWithIGV = isNaN(price * quantity) ? 0 : price * quantity;
          const igv = isNaN(totalWithIGV * (IGV_RATE / (1 + IGV_RATE))) ? 0 : totalWithIGV * (IGV_RATE / (1 + IGV_RATE));
          const subtotal = isNaN(totalWithIGV - igv) ? 0 : totalWithIGV - igv;

          total += totalWithIGV;
          totalIGV += igv;
          totalSubtotal += subtotal;
          totalQuantity += quantity;
          totalProducts++;
        });

        // Solo actualizar estado una vez al final
        setProductTotals({
          total,
          totalIGV,
          totalSubtotal,
          totalQuantity,
          totalProducts,
        });

        setShowProductTotals(true);
      } catch (error) {
        console.error("Error calculando totales:", error);
      } finally {
        // Importante: marcar como finalizado
        isCalculatingProductsRef.current = false;
      }
    }, 200); // Reducido a 200ms para sentirse más responsivo
  }, [form, orderProductsDataMap]);

  // Inicialización de productos (solo una vez)
  // const syncProducts = useCallback(() => {
  //   if(showProductFields && !isStockPending) {
  //     const stockParams = fields.map((field) => ({
  //       productId: field.productId,
  //       storageId: ,
  //     }));
  //     productsStockRef.current = stockParams;
  //     // getProductStockByStorage(stockParams).then((response) => {
  //     //   setProductsStock(response);
  //     // });
  //     // Usar una referencia para evitar múltiples inicializaciones
  //     if (didInitializeRef.current) return;
  //     didInitializeRef.current = true;

  //     // Limpiar fields existentes
  //     handleCleanProducts();

  //     // Añadir productos originales de la receta
  //     originalProducts.forEach((product) => {
  //       if (product.id) {
  //         append({
  //           productId: product.id,
  //           quantity: product.quantity ?? 1,
  //           storageId: 
  //         });
  //       }
  //     });

  //     // // Agregar productos seleccionados que no están en la receta
  //     // selectedProducts
  //     //   .filter((product) => !orginalProductsIds.includes(product.id))
  //     //   .forEach((product) => {
  //     //     append({
  //     //       productId: product.id,
  //     //       quantity: 1,
  //     //     });
  //     //   });

  //     // Calcular totales iniciales después de una pequeña espera
  //     setTimeout(() => calculateTotalsWithDebounce(), 500);
  //   }
  // }, [
  //   append,
  //   remove,
  //   originalProducts,
  //   // showProductFields,
  //   // selectedProducts,
  //   orginalProductsIds,
  //   calculateTotalsWithDebounce,
  // ]);

  // useEffect(() => {
  //   syncProducts();
  // }, [syncProducts, showProductFields]);

  // useEffect(()=>{
  //   if (!showProductFields) {
  //     handleCleanProducts();
  //   }
  // }, [showProductFields])

  const handleCleanProducts = useCallback(() => {
    remove();
    setProductTotals({
      total: 0,
      totalIGV: 0,
      totalSubtotal: 0,
      totalQuantity: 0,
      totalProducts: 0,
    });
    setShowProductTotals(false);
  }, [remove]);

  // Manejar eliminación de productos
  const handleRemoveProduct = useCallback(
    (index: number) => {
      // Limpiar estado global
      // if (fields[index]) {
      //   dispatch({
      //     type: "remove",
      //     payload: { productId: fields[index].productId },
      //   });
      // }

      // Quitar del formulario
      remove(index);

      // Recalcular automáticamente los totales
      calculateTotalsWithDebounce();
    },
    [fields, remove, calculateTotalsWithDebounce]
  );

  // Efecto para recalcular cuando cambian los productos o sus cantidades
  useEffect(() => {
    // Solo calcular si ya se inicializó y no estamos editando activamente
    if (didInitializeRef.current && editingIndex === null) {
      calculateTotalsWithDebounce();
    }
  }, [watchFieldArray, calculateTotalsWithDebounce, editingIndex]);

  // // Efecto para recalcular cuando cambia el almacén
  // useEffect(() => {
  //   if (didInitializeRef.current && showProductFields) {
  //     calculateTotalsWithDebounce();
  //   }
  // }, [storageSafeWatch, showProductFields, calculateTotalsWithDebounce]);

  // // Efecto de limpieza
  // useEffect(() => {
  //   return () => {
  //     if (updateTimeoutRef.current) {
  //       clearTimeout(updateTimeoutRef.current);
  //     }
  //   };
  // }, []);

  // // Error handling - sin efectos secundarios
  // useEffect(() => {
  //   const hasError = productsQueries.some((q) => q.isError);
  //   if (hasError) {
  //     toast.error("Error al obtener los productos", { id: "product-error" });
  //   }
  // }, [productsQueries]);

  // Verificación de carga
  const isLoading =
    responseStorage.isLoading ||
    reponseProductsStock.isLoading ||
    reponseProducts.isLoading ||
    responseBranches.isLoading ||
    stockDataQuery.isLoading;

  if (isLoading) {
    return <LoadingDialogForm />;
  }

  // Verificación de errores
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
    return (
      <GeneralErrorMessage
        error={reponseProductsStock.error}
        reset={reponseProductsStock.refetch}
      />
    );
  }
  if (!reponseProductsStock.data) {
    return <LoadingDialogForm />;
  }
  if (reponseProducts.isError) {
    return (
      <GeneralErrorMessage
        error={reponseProducts.error}
        reset={reponseProducts.refetch}
      />
    );
  }
  if (!reponseProducts.data) {
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
  if (stockDataQuery.isError) {
    return (
      <GeneralErrorMessage
        error={stockDataQuery.error}
        reset={stockDataQuery.refetch}
      />
    );
  }
  if (!stockDataQuery.data) {
    return <LoadingDialogForm />;
  }

  // Opciones para selectores
  const storageOptions = responseStorage.data.map((storage) => ({
    label: `${storage.name} - ${storage.branch.name}`,
    value: storage.id,
  }));

  const branchOptions = responseBranches.data.map((branch) => ({
    label: branch.name,
    value: branch.id,
  }));

  // useEffect(() => {
  //   if (didInitializeRef.current && showProductFields && !isLoading) {
  //     // Recalcular totales cuando llegan los datos de producto/stock
  //     calculateTotalsWithDebounce();
  //   }
  // }, [
  //   reponseProductsStock.data,
  //   reponseProducts.data,
  //   showProductFields,
  //   isLoading,
  //   calculateTotalsWithDebounce,
  // ]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="p-2 sm:p-1 overflow-auto max-h-[calc(80dvh-4rem)] grid md:grid-cols-4 gap-4">
          {/* Campo Sucursal */}
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
                  <FormDescription>
                    Solo visualizará sucursales activas
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>

          {/* Switches para opciones */}
          <FormItem className="flex flex-row items-end justify-between rounded-lg border p-3 shadow-sm col-span-4 sm:col-span-2">
            <div className="space-y-0.5">
              <FormLabel>Contrato de servicios</FormLabel>
              <FormDescription>
                Activar esta opción si se va a agendar y/o contratar servicios
                de parte del cliente/paciente.
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

          <FormItem className="flex flex-row items-end justify-between rounded-lg border p-3 shadow-sm col-span-4 sm:col-span-2">
            <div className="space-y-0.5">
              <FormLabel>Venta de productos</FormLabel>
              <FormDescription>
                Activar esta opción si se va a realizar una venta de productos
                de la receta o adicionales
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                className="!m-0"
                checked={showProductFields}
                onCheckedChange={(value) => {
                  setShowProductFields(value);
                  // Ocultar totales cuando cambia este switch
                  setShowProductTotals(false);
                }}
              />
            </FormControl>
          </FormItem>

          {showServicesFields && <Separator className="col-span-4" />}

          {/* Sección de servicios */}
          {showServicesFields && (
            <>
              <div className="flex flex-col gap-4 col-span-4">
                <FormLabel>{FORMSTATICS.services.label}</FormLabel>

                {/* Ya no necesitamos el botón para calcular */}
                {isCalculatingServicesRef.current && (
                  <div className="w-full p-2 text-center">
                    <p className="text-muted-foreground animate-pulse">
                      Actualizando totales...
                    </p>
                  </div>
                )}

                {/* Tabla de productos */}
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
                    {/* Filas de productos */}
                    {fields.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          No hay productos seleccionados
                        </TableCell>
                      </TableRow>
                    ) : (
                      fields.map((field, index) => {
                        const IGV = 0.18;
                        // const data = selectedProducts.find(
                        //   (p) => p.id === field.productId
                        // );
                        // const existentProduct = originalProductsStock.find(
                        //   (p) => p.id === field.productId
                        // );
                        // const safeData: Partial<OutgoingProducStockForm> =
                        //   existentProduct ?? data ?? {};
                        // const safeData: Partial<OutgoingProducStockForm> =
                        // existentProduct ?? data ?? {};
                        const safeData: Partial<OutgoingProducStockForm> =
                          stockDataQuery.data.find(
                            (p) => p.id === field.productId
                          ) ?? {};
                        const safeWatch = watchFieldArray?.[index] ?? {};
                        const price = safeData.precio ?? 0;
                        const stockStorage = safeData.Stock?.find(
                          (stock) => stock.Storage.id === field.storageId
                        );

                        const dynamicStock = isNaN(
                          (stockStorage?.stock ?? 0) - (safeWatch.quantity ?? 0)
                        )
                          ? stockStorage?.stock ?? 0
                          : (stockStorage?.stock ?? 0) -
                            (safeWatch.quantity ?? 0);

                        const quantity = safeWatch.quantity ?? 0;
                        //const priceWithIGV = price; // Since price already includes IGV
                        const totalPriceWithIGV = isNaN(price * quantity)
                          ? 0
                          : price * quantity;
                        const totalIGV = isNaN(totalPriceWithIGV * (IGV / (1 + IGV)))
                          ? 0
                          : totalPriceWithIGV * (IGV / (1 + IGV));
                        const subtotal = isNaN(totalPriceWithIGV - totalIGV)
                          ? 0
                          : totalPriceWithIGV - totalIGV;

                        const maxStock = stockStorage?.stock ?? 0;
                        console.log('product', safeData)
                        console.log('productId', field.productId)
                        console.log('')

                        return (
                          <TableRow
                            key={field.id}
                            className="animate-fade-down"
                          >
                            <TableCell>
                              <FormItem>
                                <div>
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
                                <Input
                                  disabled={
                                    stockStorage
                                      ? stockStorage.stock <= 0
                                      : false
                                  }
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
                                {stockStorage && (
                                  <FormDescription>
                                    {stockStorage.stock > 0
                                      ? `Stock disponible: ${dynamicStock}`
                                      : `No hay stock disponible`}
                                  </FormDescription>
                                )}
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

                    {/* Fila de totales (siempre visible si hay productos) */}
                    {showProductTotals && fields.length > 0 && (
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

                {/* Dialog para seleccionar productos */}
                <div className="w-full flex flex-col gap-2 justify-center items-center py-4">
                  <SelectProductDialog form={form} />
                  <CustomFormDescription required={true} />
                  {form.formState.errors.services && (
                    <FormMessage className="text-destructive">
                      {form.formState.errors.services.message}
                    </FormMessage>
                  )}
                </div>
              </div>
            </>
          )}

          {showProductFields && <Separator className="col-span-4" />}

          {/* Sección de productos */}
          {showProductFields && (
            <>
              {/* Selector de almacén */}
              {/* <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="storageId"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>{FORMSTATICS.storageId.label}</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Ocultar totales cuando cambia el almacén
                          setShowTotals(false);
                        }}
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
                            <SelectItem
                              key={storage.value}
                              value={storage.value}
                            >
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
              </div> */}

              <div className="flex flex-col gap-4 col-span-4">
                <FormLabel>{FORMSTATICS.products.label}</FormLabel>

                {/* Ya no necesitamos el botón para calcular */}
                {isCalculatingProductsRef.current && (
                  <div className="w-full p-2 text-center">
                    <p className="text-muted-foreground animate-pulse">
                      Actualizando totales...
                    </p>
                  </div>
                )}

                {/* Tabla de productos */}
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Nombre</TableHead>
                      <TableHead>Almacén</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>{"IGV(18%)"}</TableHead>
                      <TableHead>Subtotal</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead className="text-center">Opciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Filas de productos */}
                    {fields.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          No hay productos seleccionados
                        </TableCell>
                      </TableRow>
                    ) : (
                      fields.map((field, index) => {
                        const IGV = 0.18;
                        // const data = selectedProducts.find(
                        //   (p) => p.id === field.productId
                        // );
                        // const existentProduct = originalProductsStock.find(
                        //   (p) => p.id === field.productId
                        // );
                        // const safeData: Partial<OutgoingProducStockForm> =
                        //   existentProduct ?? data ?? {};
                        // const safeData: Partial<OutgoingProducStockForm> =
                        // existentProduct ?? data ?? {};
                        const safeData: Partial<OutgoingProducStockForm> =
                          stockDataQuery.data.find(
                            (p) => p.id === field.productId
                          ) ?? {};
                        const safeWatch = watchFieldArray?.[index] ?? {};
                        const price = safeData.precio ?? 0;
                        const stockStorage = safeData.Stock?.find(
                          (stock) => stock.Storage.id === field.storageId
                        );

                        const dynamicStock = isNaN(
                          (stockStorage?.stock ?? 0) - (safeWatch.quantity ?? 0)
                        )
                          ? stockStorage?.stock ?? 0
                          : (stockStorage?.stock ?? 0) -
                            (safeWatch.quantity ?? 0);

                        const quantity = safeWatch.quantity ?? 0;
                        // const priceWithIGV = price * (1 + IGV);
                        // const subtotal = isNaN(price * quantity)
                        //   ? 0
                        //   : price * quantity;
                        // const totalPriceWithIGV = isNaN(priceWithIGV * quantity)
                        //   ? 0
                        //   : priceWithIGV * quantity;
                        // const totalIGV = isNaN(price * quantity * IGV)
                        //   ? 0
                        //   : price * quantity * IGV;

                        //const priceWithIGV = price; // Since price already includes IGV
                        const totalPriceWithIGV = isNaN(price * quantity)
                          ? 0
                          : price * quantity;
                        const totalIGV = isNaN(totalPriceWithIGV * (IGV / (1 + IGV)))
                          ? 0
                          : totalPriceWithIGV * (IGV / (1 + IGV));
                        const subtotal = isNaN(totalPriceWithIGV - totalIGV)
                          ? 0
                          : totalPriceWithIGV - totalIGV;

                        const maxStock = stockStorage?.stock ?? 0;
                        console.log('product', safeData)
                        console.log('productId', field.productId)
                        console.log('')

                        return (
                          <TableRow
                            key={field.id}
                            className="animate-fade-down"
                          >
                            <TableCell>
                              <FormItem>
                                <div>
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
                                <FormField
                                  control={form.control}
                                  name={`products.${index}.storageId`}
                                  render={({ field }) => (
                                    <Select
                                      onValueChange={field.onChange}
                                      value={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger className="w-full">
                                          <SelectValue placeholder="Seleccionar almacén" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {storageOptions.map((storage) => (
                                          <SelectItem
                                            key={storage.value}
                                            value={storage.value}
                                          >
                                            {storage.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  )}
                                />
                                <FormMessage />
                              </FormItem>
                            </TableCell>
                            <TableCell>
                              <FormItem>
                                <Input
                                  disabled={
                                    stockStorage
                                      ? stockStorage.stock <= 0
                                      : false
                                  }
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
                                {stockStorage && (
                                  <FormDescription>
                                    {stockStorage.stock > 0
                                      ? `Stock disponible: ${dynamicStock}`
                                      : `No hay stock disponible`}
                                  </FormDescription>
                                )}
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

                    {/* Fila de totales (siempre visible si hay productos) */}
                    {showProductTotals && fields.length > 0 && (
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

                {/* Dialog para seleccionar productos */}
                <div className="w-full flex flex-col gap-2 justify-center items-center py-4">
                  {/* <SelectProductDialog form={form} /> */}
                  <CustomFormDescription required={true} />
                  {form.formState.errors.products && (
                    <FormMessage className="text-destructive">
                      {form.formState.errors.products.message}
                    </FormMessage>
                  )}
                </div>
              </div>
            </>
          )}

          <Separator className="col-span-4" />

          {/* Campo método de pago */}
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

          {/* Campo de notas */}
          <div className="col-span-4">
            <FormItem>
              <FormLabel>{FORMSTATICS.notes.label}</FormLabel>
              <Textarea
                {...register('notes')}
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
        {/* Contenido adicional (botones de acción) */}
        {children}
      </form>
    </Form>
  );
}
