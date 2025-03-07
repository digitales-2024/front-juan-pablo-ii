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
  const [originalProductsStock, setOriginalProductsStock] = useState<OutgoingProducStockForm[]>([]);
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
  // const storageSafeWatch = watch("storageId");

  const { activeStoragesQuery: responseStorage } = useStorages();
  const { activeProductsQuery: reponseProducts } = useProducts();
  const { activeBranchesQuery: responseBranches } = useBranches();
  
  const selectedProducts = useSelectedProducts();
  const dispatch = useSelectProductDispatch();

  useEffect(() => {
    if (didInitializeRef.current) return;
    didInitializeRef.current = true;
    
    remove();
    
    selectedProducts.forEach((product) => {
      append({
        productId: product.id,
        quantity: 1,
        storageId: undefined
      });
    });
    
    setTimeout(() => calculateTotalsWithDebounce(), 500);
  }, [append, remove, selectedProducts, calculateTotalsWithDebounce]);

  const handleRemoveProduct = useCallback((index: number) => {
    if (fields[index]) {
      dispatch({
        type: "remove",
        payload: { productId: fields[index].productId },
      });
    }
    remove(index);
    calculateTotalsWithDebounce();
  }, [fields, dispatch, remove, calculateTotalsWithDebounce]);

  const calculateTotalsWithDebounce = useCallback(() => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    updateTimeoutRef.current = setTimeout(() => {
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
        
        let total = 0;
        let totalIGV = 0;
        let totalSubtotal = 0;
        let totalQuantity = 0;
        let totalProducts = 0;
        const IGV_RATE = 0.18;
        
        products.forEach((field) => {
          const productData = selectedProducts.find(
            (p) => p.id === field.productId
          );
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
        isCalculatingRef.current = false;
      }
    }, 200);
  }, [form, selectedProducts, calculateTotalsWithDebounce]);

  const isLoading = 
    responseStorage.isLoading ||
    reponseProducts.isLoading ||
    responseBranches.isLoading;

  if (isLoading) {
    return <LoadingDialogForm />;
  }

  if (responseStorage.isError) {
    return <GeneralErrorMessage error={responseStorage.error} reset={responseStorage.refetch} />;
  }
  if (!responseStorage.data) {
    return <LoadingDialogForm />;
  }

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
                  setShowTotals(false);
                }}
              />
            </FormControl>
          </FormItem>

          {showServicesFields && <Separator className="col-span-4" />}
          {showProductFields && <Separator className="col-span-4" />}

          <div className="col-span-3">
            <FormField
              control={form.control}
              name="storageId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{FORMSTATICS.storageId.label}</FormLabel>
                  <SelectProductDialog 
                  form={}
                    onSelect={(product) => {
                      dispatch({ type: "add", payload: product });
                      append({ productId: product.id, quantity: 1 });
                    }}
                  />
                </FormItem>
              )}
            />
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
                              {...register(`products.${index}.quantity`, { valueAsNumber: true })}
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
