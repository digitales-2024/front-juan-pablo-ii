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
import { useAuth } from "@/app/(auth)/sign-in/_hooks/useAuth";

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
  form: UseFormReturn<CreatePrescriptionBillingLocalInput>;
  onSubmit: (data: CreatePrescriptionBillingLocalInput) => void;
  onDialogClose?: () => void;
  onProductsSaved: () => void;
  onServicesSaved: () => void;
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
  stockDataQuery,
  serviceDataQuery,
  onProductsSaved,
  onServicesSaved,
}: CreatePrescriptionOrderFormProps) {
  const IGV = 0.18;
  const FORMSTATICS = useMemo(() => STATIC_FORM, []);

  // Flags de referencia para evitar bucles
  const didInitializeRef = useRef(false);
  const isCalculatingProductsRef = useRef(false);
  const isCalculatingServicesRef = useRef(false);

  // Estados básicos
  const [showProductFields, setShowProductFields] = useState(false);
  const [showServicesFields, setShowServicesFields] = useState(true);

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

  // Consultas y estados
  const { activeStoragesQuery: responseStorage } = useStorages();
  const { productStockQuery: reponseProductsStock } = useProductsStock();
  const { activeProductsQuery: reponseProducts } = useProducts();
  const { activeBranchesQuery: responseBranches } = useBranches();
  const { dataQuery: selectedServicesAppointmentsData } =
    useSelectedServicesAppointments();
  const dispatch = useSelectedServicesAppointmentsDispatch();

  // Obtener datos del usuario autenticado
  const { user } = useAuth();

  // Filtrar sucursales según la sucursal del usuario
  const filteredBranches = useMemo(() => {
    if (!responseBranches.data) return [];

    if (user?.isSuperAdmin) {
      return responseBranches.data;
    }

    if (user?.branchId) {
      return responseBranches.data.filter(
        (branch) => branch.id === user.branchId
      );
    }

    return responseBranches.data;
  }, [responseBranches.data, user]);

  // Establecer automáticamente la sucursal del usuario
  useEffect(() => {
    if (user?.branchId && !user?.isSuperAdmin && !form.getValues("branchId")) {
      form.setValue("branchId", user.branchId);
    }
  }, [user, form]);

  useEffect(() => {
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
    setTimeout(() => calculateProductTotals(), 100);
  }, [form]);

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

  const calculateServiceTotals = useCallback(() => {
    if (isCalculatingServicesRef.current) return;
    isCalculatingServicesRef.current = true;

    try {
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

    setTimeout(() => calculateServiceTotals(), 10);
  }, []);

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

      setTimeout(() => calculateServiceTotals(), 10);
    },
    []
  );

  const handleSaveServices = useCallback(() => {
    const selectedServices = servicesTableFormData
      .filter((service) => service.selected)
      .map(({ isEditing, hasChanges, selected, ...service }) => service);

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

    form.setValue("services", selectedServicesWithAppointmentId);

    setServicesTableFormData((prev) =>
      prev.map((item) => ({
        ...item,
        hasChanges: false,
      }))
    );

    calculateServiceTotals();

    setWereServicesSaved(true);
    onServicesSaved();

    toast.success(
      `${selectedServices.length} servicios guardados correctamente`
    );
  }, [servicesTableFormData, form, selectedServicesAppointmentsData]);

  const handleSomeAppointmentCreated = useCallback(() => {
    if (selectedServicesAppointmentsData.data.length === 0) return;

    setServicesTableFormData((prev) => {
      const updated = prev.map((item) => {
        const appointmentReference = selectedServicesAppointmentsData.data.find(
          (s) =>
            s.serviceId === item.serviceId &&
            s.uniqueIdentifier === item.uniqueIdentifier
        );
        const hasMadeAppointment = !!appointmentReference;

        if (item.hasMadeAppointment !== hasMadeAppointment) {
          return { ...item, hasMadeAppointment };
        }
        return item;
      });

      const hasChanges = updated.some(
        (item, index) =>
          item.hasMadeAppointment !== prev[index].hasMadeAppointment
      );

      return hasChanges ? updated : prev;
    });
  }, [selectedServicesAppointmentsData.data]);

  useEffect(() => {
    handleSomeAppointmentCreated();
  }, [selectedServicesAppointmentsData.data, handleSomeAppointmentCreated]);

  const calculateProductTotals = useCallback(() => {
    if (isCalculatingProductsRef.current) return;
    isCalculatingProductsRef.current = true;

    try {
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

    setTimeout(() => calculateProductTotals(), 10);
  }, []);

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

    setTimeout(() => calculateProductTotals(), 10);
  }, []);

  const handleSaveProducts = useCallback(() => {
    const selectedProducts = productTableFormData
      .filter((product) => product.selected)
      .map(({ isEditing, hasChanges, selected, ...product }) => product);

    form.setValue("products", selectedProducts);

    setProductTableFormData((prev) =>
      prev.map((item) => ({ ...item, hasChanges: false }))
    );

    calculateProductTotals();

    setWereProductsSaved(true);
    onProductsSaved();

    toast.success(
      `${selectedProducts.length} productos guardados correctamente`
    );
  }, [productTableFormData, form]);

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

  const storageOptions = responseStorage.data.map((storage) => ({
    label: `${storage.name} - ${storage.branch.name}`,
    value: storage.id,
  }));

  const branchOptions = filteredBranches.map((branch) => ({
    label: branch.name,
    value: branch.id,
  }));

  const SaveServiceTableButton = () => {
    const hasChanges = servicesTableFormData.some((s) => s.hasChanges);

    return (
      <Button
        type="button"
        variant={"outline"}
        onClick={handleSaveServices}
        disabled={!hasChanges}
        className={cn(
          "ml-auto bg-primary/10 text-primary border-none hover:bg-primary/20 hover:text-primary transition-all",
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
    const hasChanges = productTableFormData.some((p) => p.hasChanges);
    return (
      <Button
        type="button"
        variant={"outline"}
        onClick={handleSaveProducts}
        disabled={!hasChanges}
        className={cn(
          "ml-auto mt-2 bg-primary/10 text-primary border-none hover:bg-primary/20 hover:text-primary transition-all",
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
                    disabled={!!user?.branchId && !user?.isSuperAdmin}
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
                    {user?.branchId && !user?.isSuperAdmin
                      ? "Sucursal asignada a tu usuario"
                      : "Solo visualizará sucursales activas"}
                  </FormDescription>
                  <CustomFormDescription
                    required={FORMSTATICS.paymentMethod.required}
                  />
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
                  if (value === false) {
                    setShowProductTotals(value);
                  }
                }}
              />
            </FormControl>
          </FormItem>

          {showServicesFields && <Separator className="col-span-4" />}

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
                        const safeData: Partial<ServiceData> =
                          serviceDataQuery.data.find(
                            (p) => p.id === field.serviceId
                          ) ?? {};

                        const price = safeData.price ?? 0;

                        const quantity = field.quantity ?? 0;
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
                                <FormMessage />
                              </FormItem>
                            </TableCell>
                            <TableCell>
                              <FormItem>
                                <Input
                                  disabled
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

          {showProductFields && (
            <>
              <div className="flex flex-col gap-4 col-span-4">
                <FormLabel>{FORMSTATICS.products.label}</FormLabel>

                {isCalculatingProductsRef.current && (
                  <div className="w-full p-2 text-center">
                    <p className="text-muted-foreground animate-pulse">
                      Actualizando totales...
                    </p>
                  </div>
                )}

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
        {children}
      </form>
    </Form>
  );
}
