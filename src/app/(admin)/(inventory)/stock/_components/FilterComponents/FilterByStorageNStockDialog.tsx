"use client";
import React, { useCallback, useMemo } from "react";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Filter, Info, LoaderCircle, X } from "lucide-react";
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
import SearchProductCombobox from "./SearchProductCombobox";
import {
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FilterByStorageSchema,
  FilterByProductSchema,
  FilterByStorageAndProductSchema,
  FilterByStorage,
  FilterByProduct,
  FilterByStorageAndProduct,
} from "../../_interfaces/filter.interface";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  useUnifiedStock,
} from "../../_hooks/useFilterStock";
import { toast } from "sonner";
import { FilterStockTabCardContent } from "./FilterStockTabCardContent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStorages } from "@/app/(admin)/(catalog)/storage/storages/_hooks/useStorages";

export function FilterStockDialog() {
  const FILTER_DIALOG_MESSAGES = {
    button: "Opciones de filtrado",
    title: "Filtrar Stock",
    description: `Escoge una opción para filtrar el stock.`,
    cancel: "Cerrar",
    submitButton: "Aplicar",
  };

  const TAB_OPTIONS = useMemo(
    () => ({
      BY_STORAGE: {
        label: "Por Almacén",
        value: "BY_STORAGE",
        description: "Selecciona un almacén para filtrar el stock",
      },
      BY_PRODUCT: {
        label: "Por Producto",
        value: "BY_PRODUCT",
        description: "Selecciona un producto para filtrar el stock",
      },
      BY_STORAGE_N_PRODUCT: {
        label: "Por Almacén y Producto",
        value: "BY_STORAGE_N_PRODUCT",
        description:
          "Selecciona un almacén y un producto para filtrar el stock",
      },
      ALL_STORAGES: {
        label: "Todos los almacenes",
        value: "ALL_STORAGES",
        description: "Muestra todo el stock disponible",
      },
    }),
    []
  );

  const [open, setOpen] = useState(false);

  const {
    isLoading,
    query: stockQuery,
    setFilterAllStorages,
    setFilterByProduct,
    setFilterByStorage,
    setFilterByStorageAndProduct,
  } = useUnifiedStock();

  const { activeStoragesQuery } = useStorages();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const filterByStorageForm = useForm({
    resolver: zodResolver(FilterByStorageSchema),
    defaultValues: {
      storageId: "",
    },
  });

  const filterByProductForm = useForm({
    resolver: zodResolver(FilterByProductSchema),
    defaultValues: {
      productId: "",
    },
  });

  const filterByStorageAndProductForm = useForm({
    resolver: zodResolver(FilterByStorageAndProductSchema),
    defaultValues: {
      storageId: "",
      productId: "",
    },
  });

  const onSubmitAllStorages = useCallback(() => {
    setFilterAllStorages();
    if (stockQuery.isError) {
      toast.error("Error al filtrar stock");
    }
    if (stockQuery.data) {
      toast.success("Stock filtrado correctamente");
      handleClose();
    }
  }
  , [setFilterAllStorages]);

  const onSubmitStorage = useCallback((input: FilterByStorage) => {
    console.log("Ingresando a handdle submit", input);
    setFilterByStorage(input.storageId);
    if (stockQuery.isError) {
      toast.error("Error al filtrar stock");
    }
    if (stockQuery.data) {
      filterByStorageForm.reset();
      toast.success("Stock filtrado correctamente");
      handleClose();
    }
  }, [setFilterByStorage]);

  const onSubmitProduct = useCallback((values: FilterByProduct) => {
    setFilterByProduct(values.productId);
    if (stockQuery.isError) {
      toast.error("Error al filtrar stock");
    }
    if (stockQuery.data) {
      filterByProductForm.reset();
      toast.success("Stock filtrado correctamente");
      handleClose();
    }
  }, [setFilterByProduct]);

  const onSubmitStorageAndProduct = useCallback((input: FilterByStorageAndProduct) => {
    console.log("Ingresando a handdle submit", input);
    setFilterByStorageAndProduct({
      storageId: input.storageId,
      productId: input.productId,
    });
    if (stockQuery.isError) {
      toast.error("Error al filtrar stock");
    }
    if (stockQuery.data) {
      filterByStorageAndProductForm.reset();
      toast.success("Stock filtrado correctamente");
      handleClose();
    }
  }, [setFilterByStorageAndProduct]);

  if (stockQuery.isError) {
    toast.error("Error al filtrar stock");
  }
  if (stockQuery.isLoading) {
    toast.success("Filtrando...");
  }

  if (!activeStoragesQuery.data) {
    return <Button variant="default"
    size="sm" disabled>
      <LoaderCircle className="animate-spin text-primary-foreground" />
      Cargando
    </Button>;
  }

  if (activeStoragesQuery.isLoading) {
    return <Button variant="default"
    size="sm" disabled>
      <LoaderCircle className="animate-spin text-primary-foreground" />
      Cargando
    </Button>;
  }

  if (activeStoragesQuery.isError) {
    toast.error("Error al cargar los almacenes, "+activeStoragesQuery.error.message);
    return <Button variant="default"
    size="sm" disabled>
    <X className="text-primary-foreground" />
    Error
  </Button>;
  }

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


  const FilteringTabs = () => (
    <div>
    <Tabs
      defaultValue={TAB_OPTIONS.ALL_STORAGES.value}
      className="w-full flex flex-col space-y-4"
    >
      <TabsList className="grid w-full grid-cols-2 h-fit">
        <TabsTrigger value={TAB_OPTIONS.ALL_STORAGES.value}>
          {TAB_OPTIONS.ALL_STORAGES.label}
        </TabsTrigger>
        <TabsTrigger value={TAB_OPTIONS.BY_STORAGE.value}>{TAB_OPTIONS.BY_STORAGE.label}</TabsTrigger>
        <TabsTrigger value={TAB_OPTIONS.BY_PRODUCT.value}>
          {TAB_OPTIONS.BY_PRODUCT.label}
        </TabsTrigger>
        <TabsTrigger value={TAB_OPTIONS.BY_STORAGE_N_PRODUCT.value}>{TAB_OPTIONS.BY_STORAGE_N_PRODUCT.label}</TabsTrigger>
      </TabsList>

      <FilterStockTabCardContent
        value={TAB_OPTIONS.ALL_STORAGES.value}
        title={TAB_OPTIONS.ALL_STORAGES.label}
        description={TAB_OPTIONS.ALL_STORAGES.description}
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
          <SubmitButton type="button" onClick={onSubmitAllStorages} className="w-full">
            {FILTER_DIALOG_MESSAGES.submitButton}
          </SubmitButton>
        </section>
      </FilterStockTabCardContent>

      <FilterStockTabCardContent
        value={TAB_OPTIONS.BY_PRODUCT.value}
        title={TAB_OPTIONS.BY_PRODUCT.label}
        description={TAB_OPTIONS.BY_PRODUCT.description}
      >
        <Form {...filterByProductForm}>
          <form
            onSubmit={filterByProductForm.handleSubmit(onSubmitProduct)}
            className="space-y-4 flex flex-col items-center"
          >
            <FormField
              control={filterByProductForm.control}
              name="productId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Seleccionar producto</FormLabel>
                  <SearchProductCombobox
                    onValueChange={(val) => {
                      field.onChange(val);
                    }}
                  />
                  <FormMessage />
                  <FormDescription>
                    Solo visualizará almacenes activos
                  </FormDescription>
                </FormItem>
              )}
            ></FormField>
            <SubmitButton></SubmitButton>
          </form>
        </Form>
      </FilterStockTabCardContent>

      <FilterStockTabCardContent
        value={TAB_OPTIONS.BY_STORAGE.value}
        title={TAB_OPTIONS.BY_STORAGE.label}
        description={TAB_OPTIONS.BY_STORAGE.description}
      >
        <Form {...filterByStorageForm}>
          <form
            onSubmit={filterByStorageForm.handleSubmit(
              onSubmitStorage
            )}
            className="space-y-4 flex flex-col items-center"
          >
            <FormField
              control={filterByStorageForm.control}
              name="storageId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Escoger almacén</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un almacén" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {
                        activeStoragesQuery.data.map((storage) => (
                          <SelectItem key={storage.id} value={storage.id}>
                            {storage.name}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  <FormDescription>
                    Solo visualizará almacenes activos
                  </FormDescription>
                </FormItem>
              )}
            />
            <SubmitButton></SubmitButton>
          </form>
        </Form>
      </FilterStockTabCardContent>

      <FilterStockTabCardContent
        value={TAB_OPTIONS.BY_STORAGE_N_PRODUCT.value}
        title={TAB_OPTIONS.BY_STORAGE_N_PRODUCT.label}
        description={TAB_OPTIONS.BY_STORAGE_N_PRODUCT.description}
      >
        <Form {...filterByStorageAndProductForm}>
          <form
            onSubmit={filterByStorageAndProductForm.handleSubmit(
              onSubmitStorageAndProduct
            )}
            className="space-y-4 flex flex-col items-center"
          >
            <FormField
              control={filterByStorageAndProductForm.control}
              name="storageId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Escoger almacén</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un almacén" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {
                        activeStoragesQuery.data.map((storage) => (
                          <SelectItem key={storage.id} value={storage.id}>
                            {storage.name}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  <FormDescription>
                    Solo visualizará almacenes activos
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={filterByStorageAndProductForm.control}
              name="productId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Seleccionar producto</FormLabel>
                  <SearchProductCombobox
                    onValueChange={(val) => {
                      field.onChange(val);
                    }}
                  />
                  <FormMessage />
                  <FormDescription>
                    Solo visualizará productos activos
                  </FormDescription>
                </FormItem>
              )}
            ></FormField>
            <SubmitButton></SubmitButton>
          </form>
        </Form>
      </FilterStockTabCardContent>
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
