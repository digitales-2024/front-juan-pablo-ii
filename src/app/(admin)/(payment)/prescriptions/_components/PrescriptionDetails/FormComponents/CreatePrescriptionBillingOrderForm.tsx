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
import { Product } from "@/app/(admin)/(patient)/update-history/_interfaces/updateHistory.interface";
interface CreatePrescriptionOrderFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  prescription: PrescriptionWithPatient;
  form: UseFormReturn<CreateProductSaleBillingInput>;
  controlledFieldArray: UseFieldArrayReturn<CreateProductSaleBillingInput>;
  onSubmit: (data: CreateProductSaleBillingInput) => void;
  onDialogClose?: () => void;
}

export function CreatePrescriptionOrderForm({
  children,
  prescription,
  form,
  onSubmit,
  controlledFieldArray,
}: CreatePrescriptionOrderFormProps) {
  const FORMSTATICS = useMemo(() => STATIC_FORM, []);
  
  // Flags de referencia para evitar bucles
  const didInitializeRef = useRef(false);
  const isCalculatingRef = useRef(false);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Estados básicos
  const [showProductFields, setShowProductFields] = useState(false);
  const [showServicesFields, setShowServicesFields] = useState(true);
  const [showTotals, setShowTotals] = useState(false);
  const [productTotals, setProductTotals] = useState({
    total: 0,
    totalIGV: 0,
    totalSubtotal: 0,
    totalQuantity: 0,
    totalProducts: 0,
  });
  
  // Hook de formulario
  const { register, watch } = form;
  const { fields, append, remove } = controlledFieldArray;
  const watchFieldArray = watch("products");
  const storageSafeWatch = watch("storageId");

  // Consultas y estados
  const { activeStoragesQuery: responseStorage } = useStorages();
  const { productStockQuery: reponseProductsStock } = useProductsStock();
  const { activeProductsQuery: reponseProducts, productsByIdQueries } = useProducts();
  const { activeBranchesQuery: responseBranches } = useBranches();
  const productStockById = useProductStockById();
  const selectedProducts = useSelectedProducts();
  const dispatch = useSelectProductDispatch();

  const originalProducts = prescription.prescriptionMedicaments;
  const orginalProductsIds = originalProducts.map((product) => product.id);
  
  // Mapeo de productos originales con su stock
  const originalProductsStock: OutgoingProducStockForm[] =
    originalProducts.flatMap((product) => {
      if (!product.id) return [];

      const { productStockQuery: response } = productStockById(product.id);

      if (response.isError) {
        toast.error(response.error?.message ?? "Error desconocido");
        return [];
      }

      if (response.data?.length === 1) {
        return [{
          ...response.data[0],
          storageId: storageSafeWatch,
        }];
      }
      return [];
    });

  // Obtener datos de productos por ID seleccionados - solamente para los productos que ya están en fields
  const productIds = fields.map(field => field.productId).filter(Boolean);
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
  const [localQuantities, setLocalQuantities] = useState<Record<string, string>>({});
  const previousValuesRef = useRef<Record<string, number>>({});
  
  // Función para manejar el inicio de edición de cantidad
  const handleQuantityFocus = useCallback((index: number, currentValue: number) => {
    setEditingIndex(index);
    // Guardar el valor actual antes de la edición
    previousValuesRef.current[index] = currentValue;
    // Establecer el valor local para la edición
    setLocalQuantities(prev => ({
      ...prev,
      [index]: currentValue > 0 ? String(currentValue) : ''
    }));
  }, []);
  
  // Función para manejar cambios locales en la cantidad
  const handleQuantityChange = useCallback((index: number, value: string) => {
    // Actualizar el valor local inmediatamente
    setLocalQuantities(prev => ({
      ...prev,
      [index]: value
    }));
    
    // Convertir a número y validar
    const numValue = value === '' ? previousValuesRef.current[index] || 0 : Number(value);
    
    // Actualizar el valor en el formulario solo si es un número válido
    if (!isNaN(numValue)) {
      form.setValue(`products.${index}.quantity`, numValue, { shouldValidate: false });
    }
  }, [form]);
  
  // Función para calcular totales con debounce integrado
  const calculateTotalsWithDebounce = useCallback(() => {
    // Limpiar cualquier cálculo pendiente
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    // Programar nuevo cálculo con un pequeño retraso
    updateTimeoutRef.current = setTimeout(() => {
      // Evitar cálculos múltiples
      if (isCalculatingRef.current) return;
      isCalculatingRef.current = true;
      
      try {
        const products = form.getValues("products") || [];
        
        if (products.length === 0) {
          setProductTotals({
            total: 0,
            totalIGV: 0,
            totalSubtotal: 0,
            totalQuantity: 0,
            totalProducts: 0
          });
          setShowTotals(false);
          return;
        }
        
        // Calcular totales
        let total = 0;
        let totalIGV = 0;
        let totalSubtotal = 0;
        let totalQuantity = 0;
        let totalProducts = 0;
        const IGV_RATE = 0.18;
        
        products.forEach((field) => {
          const productData = orderProductsDataMap[field.productId];
          if (!productData) return;
          
          const price = productData.precio ?? 0;
          const quantity = field.quantity ?? 0;
          const subtotal = price * quantity;
          const igvAmount = subtotal * IGV_RATE;
          
          total += subtotal + igvAmount;
          totalIGV += igvAmount;
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
          totalProducts
        });
        
        setShowTotals(true);
      } catch (error) {
        console.error("Error calculando totales:", error);
      } finally {
        // Importante: marcar como finalizado
        isCalculatingRef.current = false;
      }
    }, 200); // Reducido a 200ms para sentirse más responsivo
  }, [form, orderProductsDataMap]);
  
  // Función para finalizar la edición - CORREGIDA PARA EVITAR RESETEO A 0
  const handleQuantityBlur = useCallback((index: number, maxStock: number) => {
    const currentValue = localQuantities[index];
    const previousValue = previousValuesRef.current[index] || 0;
    
    try {
      // Si el campo está vacío, restaurar el valor anterior
      if (currentValue === '' || currentValue === undefined) {
        form.setValue(`products.${index}.quantity`, previousValue, { shouldValidate: true });
      } else {
        // Hay un valor, convertirlo a número y validar límites
        let numValue = Number(currentValue);
        
        if (isNaN(numValue)) {
          // Si no es un número válido, usar el valor anterior
          numValue = previousValue;
        } else if (numValue < 0) {
          numValue = 0;
        } else if (numValue > maxStock) {
          numValue = maxStock;
          toast.info(`Cantidad ajustada al máximo disponible (${maxStock})`);
        }
        
        // Actualizar el formulario con el valor validado
        form.setValue(`products.${index}.quantity`, numValue, { shouldValidate: true });
      }
    } catch (error) {
      console.error("Error al procesar cantidad:", error);
      // En caso de error, mantener el valor anterior
      form.setValue(`products.${index}.quantity`, previousValue, { shouldValidate: true });
    } finally {
      // Salir del modo de edición
      setEditingIndex(null);
      
      // Programar cálculo de totales después de actualizar cantidad
      setTimeout(() => calculateTotalsWithDebounce(), 10);
    }
  }, [form, localQuantities, calculateTotalsWithDebounce]);

  // Inicialización de productos (solo una vez)
  useEffect(() => {
    // Usar una referencia para evitar múltiples inicializaciones
    if (didInitializeRef.current) return;
    didInitializeRef.current = true;
    
    // Limpiar fields existentes
    remove();
    
    // Añadir productos originales de la receta
    originalProducts.forEach((product) => {
      if (product.id) {
        append({
          productId: product.id,
          quantity: product.quantity ?? 1,
        });
      }
    });

    // Agregar productos seleccionados que no están en la receta
    selectedProducts
      .filter((product) => !orginalProductsIds.includes(product.id))
      .forEach((product) => {
        append({
          productId: product.id,
          quantity: 1,
        });
      });
      
    // Calcular totales iniciales después de una pequeña espera
    setTimeout(() => calculateTotalsWithDebounce(), 500);
  }, [append, remove, originalProducts, selectedProducts, orginalProductsIds, calculateTotalsWithDebounce]);

  // Manejar eliminación de productos
  const handleRemoveProduct = useCallback((index: number) => {
    // Limpiar estado global
    if (fields[index]) {
      dispatch({
        type: "remove",
        payload: { productId: fields[index].productId },
      });
    }

    // Quitar del formulario
    remove(index);
    
    // Recalcular automáticamente los totales
    calculateTotalsWithDebounce();
  }, [fields, dispatch, remove, calculateTotalsWithDebounce]);

  // Efecto para recalcular cuando cambian los productos o sus cantidades
  useEffect(() => {
    // Solo calcular si ya se inicializó y no estamos editando activamente
    if (didInitializeRef.current && editingIndex === null) {
      calculateTotalsWithDebounce();
    }
  }, [watchFieldArray, calculateTotalsWithDebounce, editingIndex]);

  // Efecto para recalcular cuando cambia el almacén
  useEffect(() => {
    if (didInitializeRef.current && showProductFields) {
      calculateTotalsWithDebounce();
    }
  }, [storageSafeWatch, showProductFields, calculateTotalsWithDebounce]);

  // Efecto de limpieza
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  // Error handling - sin efectos secundarios
  useEffect(() => {
    const hasError = productsQueries.some(q => q.isError);
    if (hasError) {
      toast.error("Error al obtener los productos", { id: "product-error" });
    }
  }, [productsQueries]);

  // Verificación de carga
  const isLoading = 
    responseStorage.isLoading ||
    reponseProductsStock.isLoading ||
    reponseProducts.isLoading ||
    responseBranches.isLoading;

  if (isLoading) {
    return <LoadingDialogForm />;
  }

  // Verificación de errores
  if (responseStorage.isError) {
    return <GeneralErrorMessage error={responseStorage.error} reset={responseStorage.refetch} />;
  }
  if (!responseStorage.data) {
    return <LoadingDialogForm />;
  }
  if (reponseProductsStock.isError) {
    return <GeneralErrorMessage error={reponseProductsStock.error} reset={reponseProductsStock.refetch} />;
  }
  if (!reponseProductsStock.data) {
    return <LoadingDialogForm />;
  }
  if (reponseProducts.isError) {
    return <GeneralErrorMessage error={reponseProducts.error} reset={reponseProducts.refetch} />;
  }
  if (!reponseProducts.data) {
    return <LoadingDialogForm />;
  }
  if (responseBranches.isError) {
    return <GeneralErrorMessage error={responseBranches.error} reset={responseBranches.refetch} />;
  }
  if (!responseBranches.data) {
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
                  setShowTotals(false);
                }}
              />
            </FormControl>
          </FormItem>

          {showServicesFields && <Separator className="col-span-4" />}
          {showProductFields && <Separator className="col-span-4" />}

          {/* Sección de productos */}
          {showProductFields && (
            <>
              {/* Selector de almacén */}
              <div className="col-span-3">
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
                
                {/* Ya no necesitamos el botón para calcular */}
                {isCalculatingRef.current && (
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
                        const data = selectedProducts.find(
                          (p) => p.id === field.productId
                        );
                        const existentProduct = originalProductsStock.find(
                          (p) => p.id === field.productId
                        );
                        const safeData: Partial<OutgoingProducStockForm> =
                          existentProduct ?? data ?? {};
                        const safeWatch = watchFieldArray?.[index] ?? {};
                        const price = safeData.precio ?? 0;
                        const stockStorage = safeData.Stock?.find(
                          (stock) => stock.Storage.id === storageSafeWatch
                        );
                        
                        const dynamicStock = isNaN(
                          (stockStorage?.stock ?? 0) - (safeWatch.quantity ?? 0)
                        )
                          ? stockStorage?.stock ?? 0
                          : (stockStorage?.stock ?? 0) -
                            (safeWatch.quantity ?? 0);
                            
                        const quantity = safeWatch.quantity ?? 0;
                        const priceWithIGV = price * (1 + IGV);
                        const subtotal = isNaN(price * quantity)
                          ? 0
                          : price * quantity;
                        const totalPriceWithIGV = isNaN(priceWithIGV * quantity)
                          ? 0
                          : priceWithIGV * quantity;
                        const totalIGV = isNaN(price * quantity * IGV)
                          ? 0
                          : price * quantity * IGV;
                          
                        const isEditing = editingIndex === index;
                        const maxStock = stockStorage?.stock ?? 0;
                          
                        return (
                          <TableRow key={field.id} className="animate-fade-down">
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
                                    stockStorage ? stockStorage.stock <= 0 : false
                                  }
                                  type="text"
                                  // Siempre mostrar el valor actual, sea 0 o positivo
                                  value={isEditing ? localQuantities[index] || '' : quantity ? quantity.toString() : '0'}
                                  onFocus={() => handleQuantityFocus(index, quantity)}
                                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                                  onBlur={() => handleQuantityBlur(index, maxStock)}
                                  onClick={(e) => {
                                    // Seleccionar todo el texto al hacer click y activar edición
                                    handleQuantityFocus(index, quantity);
                                    (e.target as HTMLInputElement).select();
                                  }}
                                  className={cn(
                                    "text-center",
                                    isEditing && "border-primary",
                                    quantity === 0 && !isEditing && "text-muted-foreground"
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
                    {showTotals && fields.length > 0 && (
                      <TableRow className="bg-muted/30 font-medium animate-fade-down">
                        <TableCell colSpan={2} className="font-bold">TOTALES:</TableCell>
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
                        <TableCell colSpan={2} className="text-lg text-primary font-bold">
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
        {/* Contenido adicional (botones de acción) */}
        {children}
      </form>
    </Form>
  );
}
