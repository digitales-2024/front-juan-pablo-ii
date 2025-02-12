"use client";
import React, { useMemo } from "react";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { TableProperties } from "lucide-react";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilterByStorageSchema, FilterByProductSchema, FilterByStorageAndProductSchema, FilterByStorage, FilterByProduct, FilterByStorageAndProduct } from "../../_interfaces/filter.interface";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useUpdateFilteredStock, useFilterStock } from "../../_hooks/useFilterStock";
import { toast } from "sonner";
import { useHandleFilterByProductSubmit } from "../../_hooks/useFilterStockHandlers";

export function FilterStockDialog() {
  const SHOW_MOVEMENTS_MESSAGES = useMemo(
    () => ({
      button: "Opciones de filtrado",
      title: "Filtrar Stock",
      description: `Escoge una opción para filtrar el stock.`,
      cancel: "Cerrar",
    }),
    []
  );

  const TAB_OPTIONS = useMemo(
    () => ({
      BY_STORAGE: {
        label: "Por Almacén",
        value: "BY_STORAGE",
      },
      BY_PRODUCT: {
        label: "Por Producto",
        value: "BY_PRODUCT",
      },
      BY_STORAGE_N_PRODUCT: {
        label: "Por Almacén y Producto",
        value: "BY_STORAGE_N_PRODUCT",
      },
      ALL_STORAGES: {
        label: "Todos los almacenes",
        value: "ALL_STORAGES",
      },
    }),
    []
  );

  const [open, setOpen] = useState(false);
  //   const [isCreatePending, startCreateTransition] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const updateStockData = useUpdateFilteredStock()
  const handleFilterByProductSubmit = useHandleFilterByProductSubmit();

  const handleClose = () => {
    setOpen(false);
  };

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
  })

  const filterByStorageAndProductForm = useForm({
    resolver: zodResolver(FilterByStorageAndProductSchema),
    defaultValues: {
      storageId: "",
      productId: "",
    },
  })

  function handleFilterByStorageSubmit(input: FilterByStorage) {
    console.log('Ingresando a handdle submit', input);
  }

  // function handleFilterByProductSubmit(input: FilterByProduct) {
  //   console.log('Ingresando a handle submit de producto', input);
  //   const stockData = useFilterStock({
  //     type: "BY_PRODUCT",
  //     payload: { productId: input.productId }
  //   })
  //   if (stockData.isError){
  //     toast.error("Error al filtrar stock")
  //   }
  //   if (stockData.data) {
  //     toast.success("Stock filtrado correctamente")
  //     updateStockData(stockData.data)
  //   }
  // }

  function handleFilterByStorageAndProductSubmit(input: FilterByStorageAndProduct) {
    console.log('Ingresando a handdle submit', input);
    // const stockData = useFilterStock({
    //   type: "BY_PRODUCT",
    //   payload: { productId: input.productId }
    // })
    // if (stockData.isError){
    //   toast.error("Error al filtrar stock")
    // }
    // if (stockData.data) {
    //   toast.success("Stock filtrado correctamente")
    //   updateStockData(stockData.data)
    // }
  }

  const DialogFooterContent = () => (
    <div className="gap-2 sm:space-x-0 flex sm:flex-row-reverse flex-row-reverse w-full">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleClose}
      >
        {SHOW_MOVEMENTS_MESSAGES.cancel}
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
      <TableProperties />
      {SHOW_MOVEMENTS_MESSAGES.button}
    </Button>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <TriggerButton />
        </DialogTrigger>
        <DialogContent className="min-w-[calc(384px-2rem)] max-h-[calc(100vh-4rem)] w-s">
          <DialogHeader>
            <DialogTitle>{SHOW_MOVEMENTS_MESSAGES.title}</DialogTitle>
            <DialogDescription>
              {SHOW_MOVEMENTS_MESSAGES.description}
            </DialogDescription>
          </DialogHeader>
          <div>
            <Tabs
              defaultValue={TAB_OPTIONS.ALL_STORAGES.value}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value={TAB_OPTIONS.ALL_STORAGES.value}>
                  {TAB_OPTIONS.ALL_STORAGES.label}
                </TabsTrigger>
                {/* <TabsTrigger value={TAB_OPTIONS.BY_STORAGE.value}>{TAB_OPTIONS.BY_STORAGE.label}</TabsTrigger> */}
                <TabsTrigger value={TAB_OPTIONS.BY_PRODUCT.value}>
                  {TAB_OPTIONS.BY_PRODUCT.label}
                </TabsTrigger>
                {/* <TabsTrigger value={TAB_OPTIONS.BY_STORAGE_N_PRODUCT.value}>{TAB_OPTIONS.BY_STORAGE_N_PRODUCT.label}</TabsTrigger> */}
              </TabsList>
              <TabsContent value={TAB_OPTIONS.ALL_STORAGES.value}>
                <Card>
                  <CardHeader>
                    <CardTitle>Account</CardTitle>
                    <CardDescription>
                      Make changes to your account here. Click save when you're
                      done.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" defaultValue="Pedro Duarte" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" defaultValue="@peduarte" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value={TAB_OPTIONS.BY_PRODUCT.value}>
                <Card>
                  <CardHeader className="space-y-4">
                    <CardTitle className="block text-center">Password</CardTitle>
                    <CardDescription>
                      Change your password here. After saving, you'll be logged
                      out.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {/* <div className="space-y-1">
                      <Label htmlFor="current">Current password</Label>
                      <Input id="current" type="password" />
                    </div> */}
                    <Form {...filterByProductForm}>
                      <form onSubmit={filterByProductForm.handleSubmit(handleFilterByProductSubmit)} className="space-y-4 flex flex-col items-center">
                        <FormField
                          control= {filterByProductForm.control}
                          name="productId"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              {/* <FormLabel>Producto Seleccionado</FormLabel> */}
                              <SearchProductCombobox
                                onValueChange={(val) => {
                                  field.onChange(val);
                                }}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        ></FormField>
                        <Button type="submit" className="w-full">Aplicar</Button>
                        {/* <CardFooter>
                          <Button type="submit">Aplicar</Button>
                        </CardFooter> */}
                      </form>
                    </Form>
                    {/* <div className="space-y-1">
                      <Label htmlFor="new">New password</Label>
                      <Input id="new" type="password" />
                    </div> */}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
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
          <DrawerTitle>{SHOW_MOVEMENTS_MESSAGES.title}</DrawerTitle>
          <DrawerDescription>
            {SHOW_MOVEMENTS_MESSAGES.description}
          </DrawerDescription>
        </DrawerHeader>

        <DrawerFooter>
          <DialogFooterContent />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export function FilteByStorageNStockDialog() {
  return <div>FilteByStorageNStockDialog</div>;
}
