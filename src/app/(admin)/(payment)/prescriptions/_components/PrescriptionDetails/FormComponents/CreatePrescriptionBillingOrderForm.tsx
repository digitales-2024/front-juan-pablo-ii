/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { UseFormReturn } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
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
import { CalendarPlus, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  // CreatePrescriptionBillingInput,
  CreatePrescriptionBillingLocalInput,
  paymentMethodConfig,
  paymentMethodOptions,
  ProductSaleItemDto,
  ServiceSaleItemDto,
} from "@/app/(admin)/(payment)/orders/_interfaces/order.interface";
import { useProductsStock } from "@/app/(admin)/(inventory)/stock/_hooks/useProductStock";
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
import {
  OutgoingProducStockForm,
  OutgoingProductStock,
} from "@/app/(admin)/(inventory)/stock/_interfaces/stock.interface";
import { toast } from "sonner";
import LoadingDialogForm from "../../LoadingDialogForm";
import GeneralErrorMessage from "../../errorComponents/GeneralErrorMessage";
import { UseQueryResult } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useSelectedServicesAppointments,
  useSelectedServicesAppointmentsDispatch,
} from "../../../_hooks/useCreateAppointmentForOrder";
import { CreateAppointmentDialog } from "../../appointmentComponents/CreateAppointmentDialog";
type ServiceData = {
  id: string;
  name: string;
  description?: string;
  price: number;
  serviceTypeId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
interface CreatePrescriptionOrderFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  prescription: PrescriptionWithPatient;
  stockDataQuery: UseQueryResult<OutgoingProductStock[], Error>;
  serviceDataQuery: UseQueryResult<ServiceData[], Error>;
  //originalStorageId: string;
  form: UseFormReturn<CreatePrescriptionBillingLocalInput>;
  // controlledProductFieldArray: UseFieldArrayReturn<CreatePrescriptionBillingInput>;
  // controlledServiceFieldArray: UseFieldArrayReturn<CreatePrescriptionBillingInput>;
  onSubmit: (data: CreatePrescriptionBillingLocalInput) => void;
  onDialogClose?: () => void;
  onProductsSaved: () => void;
  onServicesSaved: () => void;
  // openFromParent: boolean;
  // onSaveProductPending : () => void;
  // onSabeServicesPending : () => void;
}

type ProductItem = ProductSaleItemDto & {
  isEditing: boolean;
  hasChanges: boolean;
  selected: boolean;
};
type ServiceItem = ServiceSaleItemDto & {
  hasMadeAppointment: boolean;
  isEditing: boolean;
  hasChanges: boolean;
  selected: boolean;
  uniqueIdentifier: string;
};

export function CreatePrescriptionOrderForm({
  children,
  prescription,
  form,
  onSubmit,
  // controlledProductFieldArray,
  // controlledServiceFieldArray,
  stockDataQuery,
  serviceDataQuery,
  onProductsSaved,
  onServicesSaved,
}: // openFromParent,
CreatePrescriptionOrderFormProps) {
  const IGV = 0.18;
  const FORMSTATICS = useMemo(() => STATIC_FORM, []);

  // Flags de referencia para evitar bucles
  const didInitializeRef = useRef(false);
  // const prevOpenFromParent = useRef(openFromParent);
  const isCalculatingProductsRef = useRef(false);
  const isCalculatingServicesRef = useRef(false);

  // Estados básicos
  const [showProductFields, setShowProductFields] = useState(false);
  const [showServicesFields, setShowServicesFields] = useState(true);

  // const originalProductSaleItems: ProductSaleItemDto[] = prescription.prescriptionMedicaments.map((product) => ({
  //   productId: product.id,
  //   quantity: product.quantity ?? 1,
  //   storageId: undefined,
  // }));

  // const originalServiceSaleItems: ServiceSaleItemDto[] = prescription.prescriptionServices.map((service) => ({
  //   serviceId: service.id,
  //   quantity: service.quantity ?? 1,
  // }));

  const [productTableFormData, setProductTableFormData] = useState<
    ProductItem[]
  >([]);
  const [servicesTableFormData, setServicesTableFormData] = useState<
    ServiceItem[]
  >([]);

  const [wereProductsSaved, setWereProductsSaved] = useState(false);
  const [wereServicesSaved, setWereServicesSaved] = useState(false);

  const [showProductTotals, setShowProductTotals] = useState(false);
  const [productTotals, setProductTotals] = useState({
    total: 0,
    totalIGV: 0,
    totalSubtotal: 0,
    totalQuantity: 0,
    totalProducts: 0,
  });
  // Service totals calculations and states
  const [showServiceTotals, setShowServiceTotals] = useState(false);
  const [serviceTotals, setServiceTotals] = useState({
    total: 0,
    totalIGV: 0,
    totalSubtotal: 0,
    totalQuantity: 0,
    totalServices: 0,
  });

  // Hook de formulario
  const { register } = form;
  // const { fields, remove } = controlledProductFieldArray;

  // Consultas y estados
  const { activeStoragesQuery: responseStorage } = useStorages();
  const { productStockQuery: reponseProductsStock } = useProductsStock();
  const { activeProductsQuery: reponseProducts } = useProducts();
  const { activeBranchesQuery: responseBranches } = useBranches();
  //INITIALIZATION OF STORAGE
  const { dataQuery: selectedServicesAppointmentsData } =
    useSelectedServicesAppointments();
  const dispatch = useSelectedServicesAppointmentsDispatch();

  // useEffect(() => {
  //   // Solo ejecutar cuando openFromParent cambia de false a true
  //   if (openFromParent && !prevOpenFromParent.current) {
  //     didInitializeRef.current = false; // Forzar reinicialización
  //   }

  //   // Actualizar referencia del estado anterior
  //   prevOpenFromParent.current = openFromParent;
  // }, [openFromParent]);

  // Inicializar datos locales desde el formulario
  useEffect(() => {
    // Solo ejecutar cuando el diálogo está abierto
    // if (!openFromParent) return;
    // Solo cargar datos una vez
    if (didInitializeRef.current) return;

    const formProducts = form.getValues("products") ?? [];
    const formServices = form.getValues("services") ?? [];

    setProductTableFormData(
      formProducts.map((product) => ({
        ...product,
        isEditing: false,
        hasChanges: false,
        selected: false,
      }))
    );

    setServicesTableFormData(
      formServices.map((service) => ({
        ...service,
        hasMadeAppointment: false,
        isEditing: false,
        hasChanges: false,
        selected: false,
        uniqueIdentifier: uuidv4(),
      }))
    );

    form.setValue("products", []);
    form.setValue("services", []);

    didInitializeRef.current = true;
    // Calcular totales iniciales
    setTimeout(() => calculateProductTotals(), 100);
  }, [form]);

  // // Efecto de limpieza al cerrar
  // useEffect(() => {
  //   if (!openFromParent) {
  //     // Resetear estados locales
  //     setProductTableFormData([]);
  //     setServicesTableFormData([]);
  //     didInitializeRef.current = false;
  //   }
  // }, [openFromParent]);

  //Mapeo de datos de productos
  const orderProductsDataMap = useMemo(() => {
    const dataMap: Record<string, Omit<OutgoingProductStock, "Stock">> = {};

    if (stockDataQuery.data) {
      stockDataQuery.data.forEach((product) => {
        dataMap[product.id] = product;
      });
    }

    return dataMap;
  }, [stockDataQuery]);

  const orderServicesDataMap = useMemo(() => {
    const dataMap: Record<string, ServiceData> = {};

    if (serviceDataQuery.data)
      serviceDataQuery.data.forEach((service) => {
        dataMap[service.id] = service;
      });

    return dataMap;
  }, [prescription]);

  // Calculate service totals (only selected services)
  const calculateServiceTotals = useCallback(() => {
    if (isCalculatingServicesRef.current) return;
    isCalculatingServicesRef.current = true;

    try {
      // Filter only selected services
      const selectedServices = servicesTableFormData.filter((s) => s.selected);

      if (selectedServices.length === 0) {
        setServiceTotals({
          total: 0,
          totalIGV: 0,
          totalSubtotal: 0,
          totalQuantity: 0,
          totalServices: 0,
        });
        setShowServiceTotals(false);
        return;
      }

      let total = 0;
      let totalIGV = 0;
      let totalSubtotal = 0;
      let totalQuantity = 0;
      let totalServices = 0;
      const IGV_RATE = 0.18;

      selectedServices.forEach((service) => {
        // This would need to be adapted based on your service data structure
        const serviceData = orderServicesDataMap[service.serviceId];
        if (!serviceData) return;

        const price = serviceData.price ?? 0;
        const quantity = service.quantity ?? 0;
        const totalWithIGV = price * quantity;
        const igv = totalWithIGV * (IGV_RATE / (1 + IGV_RATE));
        const subtotal = totalWithIGV - igv;

        total += totalWithIGV;
        totalIGV += igv;
        totalSubtotal += subtotal;
        totalQuantity += quantity;
        totalServices++;
      });

      setServiceTotals({
        total,
        totalIGV,
        totalSubtotal,
        totalQuantity,
        totalServices,
      });

      setShowServiceTotals(totalServices > 0);
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Error calculando totales de servicios: " + error.message);
      } else {
        toast.error("Error calculando totales de servicios.");
      }
    } finally {
      isCalculatingServicesRef.current = false;
    }
  }, [servicesTableFormData, prescription.prescriptionServices]);

  // Handle toggle service selection
  const handleToggleServiceSelection = useCallback((index: number) => {
    setServicesTableFormData((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        selected: !updated[index].selected,
        hasChanges: true,
      };
      return updated;
    });

    // Recalculate totals after changing selection
    setTimeout(() => calculateServiceTotals(), 10);
  }, []);

  // Edit service
  const handleEditService = useCallback(
    (index: number, updatedService: Partial<ServiceItem>) => {
      setServicesTableFormData((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          ...updatedService,
          hasChanges: true,
        };
        return updated;
      });

      // Recalculate totals after changing quantity
      setTimeout(() => calculateServiceTotals(), 10);
    },
    []
  );

  // Save only selected services to form
  const handleSaveServices = useCallback(() => {
    // Filter only selected services
    const selectedServices = servicesTableFormData
      .filter((service) => service.selected)
      .map(({ isEditing, hasChanges, selected, ...service }) => service);

    //Appointmentnt creation validation
    if (
      selectedServices.length !== selectedServicesAppointmentsData.data.length
    ) {
      toast.error("Debe crear una cita para cada servicio antes de guardar");
      return;
    }

    const selectedServicesWithAppointmentId = selectedServices.map(
      (service) => {
        const appointmentReference = selectedServicesAppointmentsData.data.find(
          (s) => s.serviceId === service.serviceId
        );
        return {
          ...service,
          appointmentId: appointmentReference?.appointmentId,
        };
      }
    );

    // Update main form with selected services
    form.setValue("services", selectedServicesWithAppointmentId);

    // Mark that there are no pending changes
    setServicesTableFormData((prev) =>
      prev.map((item) => ({
        ...item,
        hasChanges: false,
        // hasMadeAppointment: true,
      }))
    );

    calculateServiceTotals();

    //Saving state
    setWereServicesSaved(true);
    onServicesSaved(); //Communicate with parent

    toast.success(
      `${selectedServices.length} servicios guardados correctamente`
    );
  }, [servicesTableFormData, form, selectedServicesAppointmentsData]);

  const handleSomeAppointmentCreated = useCallback(() => {
    if (selectedServicesAppointmentsData.data.length === 0) return;

    // Comparar y solo actualizar si hay cambios reales
    setServicesTableFormData((prev) => {
      const updated = prev.map((item) => {
        const appointmentReference = selectedServicesAppointmentsData.data.find(
          (s) =>
            s.serviceId === item.serviceId &&
            s.uniqueIdentifier === item.uniqueIdentifier
        );
        const hasMadeAppointment = !!appointmentReference;

        // Solo actualizar si cambia el estado de la cita
        if (item.hasMadeAppointment !== hasMadeAppointment) {
          return { ...item, hasMadeAppointment };
        }
        return item; // Sin cambios
      });

      // Si no hay cambios reales, devolver el estado anterior
      const hasChanges = updated.some(
        (item, index) =>
          item.hasMadeAppointment !== prev[index].hasMadeAppointment
      );

      return hasChanges ? updated : prev;
    });
  }, [selectedServicesAppointmentsData.data]);

  // 2. Actualizar solo cuando cambia selectedServicesAppointmentsData.data.length
  useEffect(() => {
    // Este efecto solo debe ejecutarse cuando cambie la cantidad de citas
    // no cada vez que cualquier propiedad interna cambie
    handleSomeAppointmentCreated();
  }, [
    selectedServicesAppointmentsData.data,
    //selectedServicesAppointmentsData.data.length,
    handleSomeAppointmentCreated,
  ]);

  // Calcular totales (solo productos seleccionados)
  const calculateProductTotals = useCallback(() => {
    if (isCalculatingProductsRef.current) return;
    isCalculatingProductsRef.current = true;

    try {
      // Filtrar solo productos seleccionados
      const selectedProducts = productTableFormData.filter((p) => p.selected);

      if (selectedProducts.length === 0) {
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
        const productData = orderProductsDataMap[product.productId];
        if (!productData) return;

        const price = productData.precio ?? 0;
        const quantity = product.quantity ?? 0;
        const totalWithIGV = price * quantity;
        const igv = totalWithIGV * (IGV_RATE / (1 + IGV_RATE));
        const subtotal = totalWithIGV - igv;

        total += totalWithIGV;
        totalIGV += igv;
        totalSubtotal += subtotal;
        totalQuantity += quantity;
        totalProducts++;
      });

      setProductTotals({
        total,
        totalIGV,
        totalSubtotal,
        totalQuantity,
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
  }, [productTableFormData, orderProductsDataMap]);

  // Manejar toggle de checkbox
  const handleToggleProductSelection = useCallback((index: number) => {
    setProductTableFormData((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        selected: !updated[index].selected,
        hasChanges: true,
      };
      return updated;
    });

    // Recalcular totales después de cambiar selección
    setTimeout(() => calculateProductTotals(), 10);
  }, []);

  // Editar producto
  const handleEditProduct = useCallback(
    (index: number, updatedProduct: Partial<ProductItem>) => {
      setProductTableFormData((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          ...updatedProduct,
          hasChanges: true,
        };
        return updated;
      });

      // Recalcular totales después de cambiar cantidad
      setTimeout(() => calculateProductTotals(), 10);
    },
    []
  );

  const handleUncheckOneProduct = useCallback((index: number) => {
    setProductTableFormData((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        selected: false,
        hasChanges: true,
      };
      return updated;
    });

    // Recalcular totales después de cambiar cantidad
    setTimeout(() => calculateProductTotals(), 10);
  }, []);

  // Guardar solo los productos seleccionados al formulario
  const handleSaveProducts = useCallback(() => {
    // Filtrar solo los productos seleccionados
    const selectedProducts = productTableFormData
      .filter((product) => product.selected)
      .map(({ isEditing, hasChanges, selected, ...product }) => product);

    // Actualizar formulario principal con los productos seleccionados
    form.setValue("products", selectedProducts);

    // Marcar que no hay cambios pendientes
    setProductTableFormData((prev) =>
      prev.map((item) => ({ ...item, hasChanges: false }))
    );

    calculateProductTotals();

    //Saving States
    setWereProductsSaved(true);
    onProductsSaved(); //Communicate with parent

    toast.success(
      `${selectedProducts.length} productos guardados correctamente`
    );
  }, [productTableFormData, form]);

  useEffect(() => {
    console.log("form watch", form.getValues("products"));
  }, [form, didInitializeRef, showProductFields, handleSaveProducts]);

  // Verificación de carga
  const isLoading =
    responseStorage.isLoading ||
    reponseProductsStock.isLoading ||
    reponseProducts.isLoading ||
    responseBranches.isLoading ||
    stockDataQuery.isLoading ||
    serviceDataQuery.isLoading;

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
  if (serviceDataQuery.isError) {
    return (
      <GeneralErrorMessage
        error={serviceDataQuery.error}
        reset={serviceDataQuery.refetch}
      />
    );
  }
  if (!serviceDataQuery.data) {
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

  const SaveServiceTableButton = () => {
    // Verificar si hay cambios para aplicar animación
    const hasChanges = servicesTableFormData.some((s) => s.hasChanges);

    return (
      <Button
        type="button"
        variant={"outline"}
        onClick={handleSaveServices}
        disabled={!hasChanges}
        className={cn(
          "ml-auto bg-primary/10 text-primary border-none hover:bg-primary/20 hover:text-primary transition-all",
          // Aplicar animación solo cuando hay cambios
          hasChanges &&
            "animate-[pulse_1.5s_ease-in-out_infinite] shadow-md shadow-primary/20"
        )}
      >
        <Save className={cn("mr-2 h-4 w-4", hasChanges && "animate-bounce")} />
        Guardar cambios
      </Button>
    );
  };

  const SaveProductTableButton = () => {
    // Verificar si hay cambios para aplicar animación
    const hasChanges = productTableFormData.some((p) => p.hasChanges);
    return (
      <Button
        type="button"
        variant={"outline"}
        onClick={handleSaveProducts}
        disabled={!hasChanges}
        className={cn(
          "ml-auto mt-2 bg-primary/10 text-primary border-none hover:bg-primary/20 hover:text-primary transition-all",
          // Aplicar animación solo cuando hay cambios
          hasChanges &&
            "animate-[pulse_1.5s_ease-in-out_infinite] shadow-md shadow-primary/20"
        )}
      >
        <Save className={cn("mr-2 h-4 w-4", hasChanges && "animate-bounce")} />
        Guardar cambios
      </Button>
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="p-2 sm:p-1 w-full overflow-x-auto max-h-[calc(80dvh-4rem)] grid md:grid-cols-4 gap-4">
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
                  <CustomFormDescription
                    required={FORMSTATICS.paymentMethod.required}
                  />
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
                  if (value === false) {
                    setShowProductTotals(value);
                  }
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

                {isCalculatingServicesRef.current && (
                  <div className="w-full p-2 text-center">
                    <p className="text-muted-foreground animate-pulse">
                      Actualizando totales...
                    </p>
                  </div>
                )}
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sel.</TableHead>
                      <TableHead className="w-[100px]">Nombre</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>{"IGV(18%)"}</TableHead>
                      <TableHead>Subtotal</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Agendar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {servicesTableFormData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          No hay productos seleccionados
                        </TableCell>
                      </TableRow>
                    ) : (
                      servicesTableFormData.map((field, index) => {
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
                        const safeData: Partial<ServiceData> =
                          serviceDataQuery.data.find(
                            (p) => p.id === field.serviceId
                          ) ?? {};

                        const price = safeData.price ?? 0;

                        const quantity = field.quantity ?? 0;
                        //const priceWithIGV = price; // Since price already includes IGV
                        const totalPriceWithIGV = isNaN(price * quantity)
                          ? 0
                          : price * quantity;
                        const totalIGV = isNaN(
                          totalPriceWithIGV * (IGV / (1 + IGV))
                        )
                          ? 0
                          : totalPriceWithIGV * (IGV / (1 + IGV));
                        const subtotal = isNaN(totalPriceWithIGV - totalIGV)
                          ? 0
                          : totalPriceWithIGV - totalIGV;

                        return (
                          <TableRow
                            key={
                              field?.serviceId ? field.serviceId + index : index
                            }
                            className="animate-fade-down"
                          >
                            {/* <TableCell className="flex justify-center items-center">
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
                            </TableCell> */}
                            <TableCell>
                              <Checkbox
                                checked={field.selected}
                                onCheckedChange={() =>
                                  handleToggleServiceSelection(index)
                                }
                                disabled={
                                  field.hasMadeAppointment || wereServicesSaved
                                }
                                aria-label="Seleccionar servicio"
                              />
                            </TableCell>
                            <TableCell>
                              <FormItem>
                                <div>
                                  <span>{safeData.name ?? "Desconocido"}</span>
                                </div>
                                {/* <Input
                                  disabled
                                  {...register(
                                    `products.${index}.productId` as const
                                  )}
                                  type="hidden"
                                /> */}
                                <FormMessage />
                              </FormItem>
                            </TableCell>
                            <TableCell>
                              <FormItem>
                                <Input
                                  //disabled={ !field.selected || field.hasMadeAppointment }
                                  disabled //Always 1 service per prescription
                                  type="number"
                                  className={cn(
                                    "text-center",
                                    quantity === 0 && "text-muted-foreground"
                                  )}
                                  value={field.quantity}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "") {
                                      handleEditService(index, { quantity: 0 });
                                      return;
                                    }
                                    const numericVal = parseInt(val, 10);
                                    if (numericVal < 0) {
                                      handleEditService(index, { quantity: 0 });
                                      return;
                                    }
                                    handleEditService(index, {
                                      quantity: numericVal,
                                    });
                                  }}
                                  min={1}
                                  placeholder="0"
                                />
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
                            <TableCell>
                              {/* <Button type="button" disabled={ !field.selected || field.hasMadeAppointment } variant={'ghost'} className="bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary">
                                <CalendarPlus></CalendarPlus>
                              </Button> */}

                              <CreateAppointmentDialog
                                uniqueIdentifier={field.uniqueIdentifier}
                                className="bg-secondary-foreground/10 text-secondary-foreground hover:bg-secondary-foreground/20 hover:text-secondary-foreground"
                                patientId={prescription.patientId}
                                serviceId={field.serviceId}
                                disabled={
                                  !field.selected || field.hasMadeAppointment
                                }
                              ></CreateAppointmentDialog>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                    {showServiceTotals && servicesTableFormData.length > 0 && (
                      <TableRow className="bg-muted/30 font-medium animate-fade-down">
                        <TableCell colSpan={3} className="font-bold">
                          TOTALES:
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell className="font-semibold">
                          {serviceTotals.totalIGV.toLocaleString("es-PE", {
                            style: "currency",
                            currency: "PEN",
                          })}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {serviceTotals.totalSubtotal.toLocaleString("es-PE", {
                            style: "currency",
                            currency: "PEN",
                          })}
                        </TableCell>
                        <TableCell className="text-lg text-primary font-bold">
                          {serviceTotals.total.toLocaleString("es-PE", {
                            style: "currency",
                            currency: "PEN",
                          })}
                        </TableCell>
                        <TableCell colSpan={1}></TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                <div className="w-full flex flex-col gap-2 justify-center items-center py-4">
                  {/* <SelectProductDialog form={form} /> */}
                  <SaveServiceTableButton></SaveServiceTableButton>
                  <CustomFormDescription
                    required={FORMSTATICS.services.required}
                  />
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
                      <TableHead className="text-center">Sel.</TableHead>
                      <TableHead className="w-[100px]">Nombre</TableHead>
                      <TableHead>Almacén</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>{"IGV(18%)"}</TableHead>
                      <TableHead>Subtotal</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Filas de productos */}
                    {productTableFormData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center text-muted-foreground"
                        >
                          No hay productos seleccionados
                        </TableCell>
                      </TableRow>
                    ) : (
                      productTableFormData.map((field, index) => {
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
                        const price = safeData.precio ?? 0;
                        const stockStorage =
                          safeData.Stock?.find(
                            (stock) => stock.Storage?.id === field.storageId
                          ) ?? null;

                        if (!stockStorage) {
                          // handleUncheckOneProduct(index);
                          return (
                            <TableRow
                              key={
                                field?.productId
                                  ? field.productId + index
                                  : index
                              }
                              className="animate-fade-down"
                            >
                              <TableCell>
                                <Checkbox
                                  checked={field.selected}
                                  onCheckedChange={() =>
                                    handleToggleProductSelection(index)
                                  }
                                  disabled={true}
                                  aria-label="Seleccionar producto"
                                />
                              </TableCell>
                              <TableCell>
                                <FormItem>
                                  <div>
                                    <span>
                                      {safeData.name ?? "Desconocido"}
                                    </span>
                                  </div>
                                </FormItem>
                              </TableCell>
                              <TableCell>
                                <FormItem>
                                  <Select
                                    value={field.storageId}
                                    onValueChange={(value) =>
                                      handleEditProduct(index, {
                                        storageId: value,
                                      })
                                    }
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
                                </FormItem>
                              </TableCell>
                              <TableCell>
                                <FormItem>
                                  <Input
                                    disabled={true}
                                    type="number"
                                    className={cn(
                                      "text-center",
                                      "text-muted-foreground"
                                    )}
                                    value={0}
                                    placeholder="0"
                                  />
                                  <FormDescription>
                                    Cambie de almacén
                                  </FormDescription>
                                </FormItem>
                              </TableCell>
                              <TableCell colSpan={5} className="text-center">
                                No existe stock para este producto:
                                {` "${safeData.name}" `}
                                en este almacén
                              </TableCell>
                            </TableRow>
                          );
                        }

                        const dynamicStock = isNaN(
                          (stockStorage?.stock ?? 0) - (field.quantity ?? 0)
                        )
                          ? stockStorage?.stock ?? 0
                          : (stockStorage?.stock ?? 0) - (field.quantity ?? 0);

                        const quantity = field.quantity ?? 0;
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
                        const totalIGV = isNaN(
                          totalPriceWithIGV * (IGV / (1 + IGV))
                        )
                          ? 0
                          : totalPriceWithIGV * (IGV / (1 + IGV));
                        const subtotal = isNaN(totalPriceWithIGV - totalIGV)
                          ? 0
                          : totalPriceWithIGV - totalIGV;

                        // console.log(
                        //   "productTableFormData",
                        //   productTableFormData
                        // );
                        // console.log(
                        //   "StockQueryData is success",
                        //   stockDataQuery.isSuccess
                        // );
                        // console.log("StockQueryData", stockDataQuery.data);
                        // console.log("productField", field);
                        // console.log("stockStorage", stockStorage);
                        // console.log("product", safeData);
                        // console.log("productId", field.productId);

                        const allStoragesStock = safeData.Stock?.reduce(
                          (acc, stock) => {
                            return acc + stock.stock;
                          },
                          0
                        );
                        const safeAllStoragesStock = !allStoragesStock
                          ? 0
                          : allStoragesStock;
                        const hasNoStockAnywhere = safeAllStoragesStock <= 0;

                        const currentStockStorage = stockStorage?.stock ?? 0;

                        return (
                          <TableRow
                            key={field.productId ?? index}
                            className={cn(
                              "animate-fade-down",
                              !field.selected ? "opacity-60 bg-muted/40" : ""
                            )}
                          >
                            <TableCell>
                              <Checkbox
                                checked={field.selected}
                                onCheckedChange={() =>
                                  handleToggleProductSelection(index)
                                }
                                disabled={
                                  wereProductsSaved || hasNoStockAnywhere
                                }
                                aria-label="Seleccionar producto"
                              />
                            </TableCell>
                            <TableCell>
                              <FormItem>
                                <div>
                                  <span>{safeData.name ?? "Desconocido"}</span>
                                </div>
                              </FormItem>
                            </TableCell>
                            <TableCell>
                              <FormItem>
                                <Select
                                  value={field.storageId}
                                  onValueChange={(value) =>
                                    handleEditProduct(index, {
                                      storageId: value,
                                    })
                                  }
                                  disabled={!field.selected}
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
                              </FormItem>
                            </TableCell>
                            <TableCell>
                              <FormItem>
                                <Input
                                  disabled={
                                    (stockStorage
                                      ? stockStorage.stock <= 0
                                      : false) || !field.selected
                                  }
                                  type="number"
                                  className={cn(
                                    "text-center",
                                    quantity === 0 && "text-muted-foreground"
                                  )}
                                  value={
                                    currentStockStorage === 0
                                      ? 0
                                      : field.quantity
                                  }
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "") {
                                      handleEditProduct(index, { quantity: 0 });
                                      return;
                                    }
                                    const numericVal = parseInt(val, 10);
                                    if (numericVal < 0) {
                                      handleEditProduct(index, { quantity: 0 });
                                      return;
                                    }
                                    if (
                                      numericVal > (stockStorage?.stock ?? 0)
                                    ) {
                                      handleEditProduct(index, {
                                        quantity: stockStorage?.stock ?? 0,
                                      });
                                      return;
                                    }
                                    handleEditProduct(index, {
                                      quantity: numericVal,
                                    });
                                  }}
                                  min={1}
                                  placeholder="0"
                                />
                                {stockStorage ? (
                                  <FormDescription>
                                    {stockStorage.stock > 0
                                      ? `Stock: ${dynamicStock}`
                                      : `No hay stock disponible`}
                                  </FormDescription>
                                ) : (
                                  <FormDescription>Stock: 0</FormDescription>
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
                          </TableRow>
                        );
                      })
                    )}

                    {/* Fila de totales (siempre visible si hay productos) */}
                    {showProductTotals && productTableFormData.length > 0 && (
                      <TableRow className="bg-muted/30 font-medium animate-fade-down">
                        <TableCell colSpan={5} className="font-bold">
                          TOTALES ({productTotals.totalProducts} productos):
                        </TableCell>
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
                  {/* <SelectProductDialog form={form} /> */}
                  <CustomFormDescription
                    required={FORMSTATICS.products.required}
                  />
                  {
                    <FormDescription>
                      No puede seleccionar productos que no tengan stock en
                      ninguno de los almacenes
                    </FormDescription>
                  }
                  {form.formState.errors.products && (
                    <FormMessage className="text-destructive">
                      {form.formState.errors.products.message}
                    </FormMessage>
                  )}
                  <SaveProductTableButton />
                </div>
              </div>
            </>
          )}

          <Separator className="col-span-4" />

          {/* Campo método de pago */}
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
                  <CustomFormDescription
                    required={FORMSTATICS.paymentMethod.required}
                  />
                </FormItem>
              )}
            />
          </div>

          {/* Campo de notas */}
          <div className="col-span-4">
            <FormItem>
              <FormLabel>{FORMSTATICS.notes.label}</FormLabel>
              <Textarea
                {...register("notes")}
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
