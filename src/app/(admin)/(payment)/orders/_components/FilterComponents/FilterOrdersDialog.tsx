"use client";
import React, { useCallback, useMemo } from "react";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Filter, Info, LoaderCircle} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
// import SearchProductCombobox from "./SearchPatientCombobox";
import {
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  OrdersFilterType,
  useUnifiedOrders,
} from "../../_hooks/useFilterOrders";
import { toast } from "sonner";
import { FilterOrdersTabCardContent } from "./FilterOrdersTabCardContent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  FilterByStatusSchema,
  FilterByStatus,
  FilterByStatusAndType,
  FilterByStatusAndTypeSchema,
  FilterByType,
  FilterByTypeSchema
} from "../../_interfaces/filter.interface";
import { OrderStatus, orderStatusConfig, orderStatusEnumOptions, OrderType, orderTypeConfig, orderTypeEnumOptions } from "../../_interfaces/order.interface";
import { cn } from "@/lib/utils";

export function FilterOrderDialog() {
  const FILTER_DIALOG_MESSAGES = {
    button: "Opciones de filtrado",
    title: "Filtrar Órdenes",
    description: `Escoge una opción para filtrar las órdenes.`,
    cancel: "Cerrar",
    submitButton: "Aplicar",
  };

  const TAB_OPTIONS = useMemo(
    () => ({
      BY_STATUS: {
        label: "Por Estado",
        value: OrdersFilterType.BY_STATUS,
        description: "Selecciona un estado de órden para filtrarlas",
      },
      BY_TYPE: {
        label: "Por Tipo de Órden",
        value: OrdersFilterType.BY_TYPE,
        description: "Selecciona un tipo de órden para el filtrado",
      },
      BY_STATUS_AND_TYPE: {
        label: "Por Estado y Tipo de Órden",
        value: OrdersFilterType.BY_STATUS_AND_TYPE,
        description:
          "Selecciona un estado y tipo de órden",
      },
      ALL: {
        label: "Ùltimas Órdenes",
        value: OrdersFilterType.ALL,
        description: "Muestra las ùltimas órdenes registradas.",
      },
      BY_ORDER_NUMBER:{
        label: "Por Número de Órden",
        value: OrdersFilterType.BY_ORDER_NUMBER,
        description: "Selecciona un número de órden para filtrarlas"
      }
    }),
    []
  );

  const [open, setOpen] = useState(false);
  //CONTROLA LAS RERENDIRACIONES DE LOS TABS Y SUS CONTENTS
  const [activeTab, setActiveTab] = useState(TAB_OPTIONS.ALL.value);

  const {
    isLoading,
    query: ordersQuery,
    setFilterAllOrders,
    setFilterByStatus,
    setFilterByStatusAndType,
    setFilterByType,
  } = useUnifiedOrders();

  // const { activeStoragesQuery } = useStorages();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const filterByStatusForm = useForm<{
    orderStatus: OrderStatus
  }>({
    resolver: zodResolver(FilterByStatusSchema),

    defaultValues: {
      orderStatus: "DRAFT",
    },
  });

  const filterByTypeForm = useForm<{
    orderType: OrderType
  }>({
    resolver: zodResolver(FilterByTypeSchema),
    defaultValues: {
      orderType: "PRODUCT_SALE_ORDER",
    },
  });

  const filterByStatusAndTypeForm = useForm<{
    orderStatus: OrderStatus,
    orderType: OrderType
  }>({
    resolver: zodResolver(FilterByStatusAndTypeSchema),
    defaultValues: {
      orderStatus: "DRAFT",
      orderType: "PRODUCT_SALE_ORDER",
    },
  });

  const onSubmitAllOrders = useCallback(() => {
    setFilterAllOrders();
    if (ordersQuery.isError) {
      toast.error("Error al filtrar Ordenes");
    }
    if (ordersQuery.data) {
      toast.success("Ordenes filtrado correctamente");
      handleClose();
    }
  }
  , [setFilterAllOrders]);

  const onSubmitStatus = useCallback((input: FilterByStatus) => {
    console.log("Ingresando a handdle submit", input);
    setFilterByStatus(input.orderStatus);
    if (ordersQuery.isError) {
      toast.error("Error al filtrar Ordenes");
    }
    if (ordersQuery.data) {
      filterByStatusForm.reset();
      toast.success("Ordenes filtrado correctamente");
      handleClose();
    }
  }, [setFilterByStatus]);

  const onSubmitType = useCallback((values: FilterByType) => {
    setFilterByType(values.orderType);
    if (ordersQuery.isError) {
      toast.error("Error al filtrar Ordenes");
    }
    if (ordersQuery.data) {
      filterByTypeForm.reset();
      toast.success("Ordenes filtrado correctamente");
      handleClose();
    }
  }, [setFilterByType]);

  const onSubmitStatusAndType = useCallback((input: FilterByStatusAndType) => {
    console.log("Ingresando a handdle submit", input);
    setFilterByStatusAndType({
      orderStatus: input.orderStatus,
      orderType: input.orderType,
    });
    if (ordersQuery.isError) {
      toast.error("Error al filtrar stock");
    }
    if (ordersQuery.data) {
      filterByStatusAndTypeForm.reset();
      toast.success("Stock filtrado correctamente");
      handleClose();
    }
  }, [setFilterByStatusAndType]);

  if (ordersQuery.isError) {
    toast.error("Error al filtrar stock");
  }
  if (ordersQuery.isLoading) {
    toast.success("Filtrando...");
  }

  // if (!activeStoragesQuery.data) {
  //   return <Button variant="default"
  //   size="sm" disabled>
  //     <LoaderCircle className="animate-spin text-primary-foreground" />
  //     Cargando
  //   </Button>;
  // }

  // if (activeStoragesQuery.isLoading) {
  //   return <Button variant="default"
  //   size="sm" disabled>
  //     <LoaderCircle className="animate-spin text-primary-foreground" />
  //     Cargando
  //   </Button>;
  // }

  // if (activeStoragesQuery.isError) {
  //   toast.error("Error al cargar los almacenes, "+activeStoragesQuery.error.message);
  //   return <Button variant="default"
  //   size="sm" disabled>
  //   <X className="text-primary-foreground" />
  //   Error
  // </Button>;
  // }

  const DialogFooterContent = () => (
    <div className="gap-2 sm:space-x-0 flex sm:flex-row-reverse flex-row-reverse w-full">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleClose}
      >
        {FILTER_DIALOG_MESSAGES.cancel}
      </Button>
    </div>
  );

  const TriggerButton = () => (
    <Button
      onClick={() => setOpen(true)}
      variant="default"
      size="sm"
      aria-label="Open menu"
      className="flex p-2 data-[state=open]:bg-muted"
    >
      <Filter />
      {FILTER_DIALOG_MESSAGES.button}
    </Button>
  );

  const SubmitButton = ({
    type = "submit",
    onClick,
    ...rest
  }:React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <Button {...rest} type={type} className="w-full" disabled={isLoading} onClick={onClick}>
      {isLoading ? (
        <div>
          <span className="animate-spin">
            <LoaderCircle></LoaderCircle>
          </span>
          <span>Filtrando...</span>
        </div>
      ) : (
        FILTER_DIALOG_MESSAGES.submitButton
      )}
    </Button>
  );

  // const EnumBadge = ({ value, label }: { value: string; label: string }) => (
  //   <span className="px-2 py-1 bg-primary-foreground text-white rounded-full">
  //     {label}
  //   </span>
  // );

  const FilteringTabs = () => (
    <div>
    <Tabs
      defaultValue={TAB_OPTIONS.ALL.value}
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full flex flex-col space-y-4"
    >
      <TabsList className="grid w-full grid-cols-2 h-fit">
        <TabsTrigger value={TAB_OPTIONS.ALL.value}>
          {TAB_OPTIONS.ALL.label}
        </TabsTrigger>
        <TabsTrigger value={TAB_OPTIONS.BY_STATUS.value}>{TAB_OPTIONS.BY_STATUS.label}</TabsTrigger>
        <TabsTrigger value={TAB_OPTIONS.BY_TYPE.value}>
          {TAB_OPTIONS.BY_TYPE.label}
        </TabsTrigger>
        <TabsTrigger value={TAB_OPTIONS.BY_STATUS_AND_TYPE.value}>{TAB_OPTIONS.BY_STATUS_AND_TYPE.label}</TabsTrigger>
      </TabsList>

      <FilterOrdersTabCardContent
        value={TAB_OPTIONS.ALL.value}
        title={TAB_OPTIONS.ALL.label}
        description={TAB_OPTIONS.ALL.description}
      >
        <section className="space-y-4">
          {/* <Button onClick={onSubmitAllStorages} className="w-full">
            {FILTER_DIALOG_MESSAGES.submitButton}
          </Button> */}
          <header className="flex flex-col space-y-2 justify-center items-center">
            <Info className="size-8"></Info>
            <CardDescription className="text-center">
              Este es el filtro por defecto
            </CardDescription>
          </header>
          <SubmitButton type="button" onClick={onSubmitAllOrders} className="w-full">
            {FILTER_DIALOG_MESSAGES.submitButton}
          </SubmitButton>
        </section>
      </FilterOrdersTabCardContent>

      <FilterOrdersTabCardContent
        value={TAB_OPTIONS.BY_STATUS.value}
        title={TAB_OPTIONS.BY_STATUS.label}
        description={TAB_OPTIONS.BY_STATUS.description}
      >
        <Form {...filterByStatusForm}>
          <form
            onSubmit={filterByStatusForm.handleSubmit(onSubmitStatus)}
            className="space-y-4 flex flex-col items-center"
          >
            <FormField
              control={filterByStatusForm.control}
              name="orderStatus"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Seleccionar Estado de Órden</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una órden" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {
                        orderStatusEnumOptions.map((orderStatus) => {
                          const {backgroundColor, hoverBgColor, icon: Icon, textColor} = orderStatusConfig[orderStatus.value];
                          return (
                          <SelectItem key={orderStatus.value} value={orderStatus.value} className={cn(backgroundColor, textColor, hoverBgColor, "mb-2 ")}>
                            <div className="flex space-x-1 items-center justify-center">
                              <Icon className="size-4"></Icon>
                              <span>
                                {orderStatus.label}
                              </span>
                            </div>
                          </SelectItem>
                        )})
                      }
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  {/* <FormDescription>
                    El estado de órden es fijo.
                  </FormDescription> */}
                </FormItem>
              )}
            ></FormField>
            <SubmitButton></SubmitButton>
          </form>
        </Form>
      </FilterOrdersTabCardContent>

      <FilterOrdersTabCardContent
        value={TAB_OPTIONS.BY_TYPE.value}
        title={TAB_OPTIONS.BY_TYPE.label}
        description={TAB_OPTIONS.BY_TYPE.description}
      >
        <Form {...filterByTypeForm}>
          <form
            onSubmit={filterByTypeForm.handleSubmit(
              onSubmitType
            )}
            className="space-y-4 flex flex-col items-center"
          >
            <FormField
              control={filterByTypeForm.control}
              name="orderType"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Seleccionar Tipo de Órden</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo de Órden" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {
                        orderTypeEnumOptions.map((orderType) => {
                          const {backgroundColor, hoverBgColor, icon: Icon, textColor} = orderTypeConfig[orderType.value];
                          return (
                          <SelectItem key={orderType.value} value={orderType.value} className={cn(backgroundColor, textColor, hoverBgColor, "mb-2 ")}>
                            <div className="flex space-x-1 items-center justify-center">
                              <Icon className="size-4"></Icon>
                              <span>
                                {orderType.label}
                              </span>
                            </div>
                          </SelectItem>
                        )})
                      }
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  {/* <FormDescription>
                    Solo visualizará almacenes activos
                  </FormDescription> */}
                </FormItem>
              )}
            />
            <SubmitButton></SubmitButton>
          </form>
        </Form>
      </FilterOrdersTabCardContent>

      <FilterOrdersTabCardContent
        value={TAB_OPTIONS.BY_STATUS_AND_TYPE.value}
        title={TAB_OPTIONS.BY_STATUS_AND_TYPE.label}
        description={TAB_OPTIONS.BY_STATUS_AND_TYPE.description}
      >
        <Form {...filterByStatusAndTypeForm}>
          <form
            onSubmit={filterByStatusAndTypeForm.handleSubmit(
              onSubmitStatusAndType
            )}
            className="space-y-4 flex flex-col items-center"
          >
            <FormField
              control={filterByStatusAndTypeForm.control}
              name="orderStatus"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Seleccionar Estado de Órden</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estado de Órden" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {
                        orderStatusEnumOptions.map((orderStatus) => {
                          const {backgroundColor, hoverBgColor, icon: Icon, textColor} = orderStatusConfig[orderStatus.value];
                          return (
                          <SelectItem key={orderStatus.value} value={orderStatus.value} className={cn(backgroundColor, textColor, hoverBgColor, "mb-2 ")}>
                            <div className="flex space-x-1 items-center justify-center">
                              <Icon className="size-4"></Icon>
                              <span>
                                {orderStatus.label}
                              </span>
                            </div>
                          </SelectItem>
                        )})
                      }
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  {/* <FormDescription>
                    Solo visualizará almacenes activos
                  </FormDescription> */}
                </FormItem>
              )}
            />
            <FormField
              control={filterByStatusAndTypeForm.control}
              name="orderType"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Seleccionar Tipo de Órden</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo de órden" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {
                        orderTypeEnumOptions.map((orderType) => {
                          const {backgroundColor, hoverBgColor, icon: Icon, textColor} = orderTypeConfig[orderType.value];
                          return (
                          <SelectItem key={orderType.value} value={orderType.value} className={cn(backgroundColor, textColor, hoverBgColor, "mb-2 ")}>
                            <div className="flex space-x-1 items-center justify-center">
                              <Icon className="size-4"></Icon>
                              <span>
                                {orderType.label}
                              </span>
                            </div>
                          </SelectItem>
                        )})
                      }
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  {/* <FormDescription>
                    Solo visualizará productos activos
                  </FormDescription> */}
                </FormItem>
              )}
            ></FormField>
            <SubmitButton></SubmitButton>
          </form>
        </Form>
      </FilterOrdersTabCardContent>
    </Tabs>
  </div>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <TriggerButton />
        </DialogTrigger>
        <DialogContent className="min-w-[calc(384px-2rem)] max-h-[calc(100vh-4rem)] w-s">
          <DialogHeader>
            <DialogTitle>{FILTER_DIALOG_MESSAGES.title}</DialogTitle>
            <DialogDescription>
              {FILTER_DIALOG_MESSAGES.description}
            </DialogDescription>
          </DialogHeader>
            <FilteringTabs></FilteringTabs>
          <DialogFooter>
            <DialogFooterContent />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <TriggerButton />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{FILTER_DIALOG_MESSAGES.title}</DrawerTitle>
          <DrawerDescription>
            {FILTER_DIALOG_MESSAGES.description}
          </DrawerDescription>
        </DrawerHeader>
          <div className="px-2">
            <FilteringTabs></FilteringTabs>
          </div>
        <DrawerFooter>
          <DialogFooterContent />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
