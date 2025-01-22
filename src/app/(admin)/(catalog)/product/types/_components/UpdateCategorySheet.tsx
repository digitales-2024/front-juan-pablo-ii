"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, List, RefreshCcw } from "lucide-react";

import { TypeProductUpdateSchema, UpdateTypeProductDto, TypeProductResponse } from "../types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useTypeProducts } from "../hook/useType";

const infoSheet = {
  title: "Actualizar tipo de producto",
  description:
    "Actualiza la información del tipo de producto y guarda los cambios",
};

interface UpdateTypeSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  typeProduct: TypeProductResponse;
}

export function UpdateTypeSheet({
  typeProduct,
  ...props
}: UpdateTypeSheetProps) {
  const { updateTypeProduct, isUpdating } = useTypeProducts();

  const form = useForm<UpdateTypeProductDto>({
    resolver: zodResolver(TypeProductUpdateSchema),
    defaultValues: {
      name: typeProduct.name ?? "",
      description: typeProduct.description ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      name: typeProduct.name ?? "",
      description: typeProduct.description ?? "",
    });
  }, [typeProduct, form]);

  function onSubmit(input: UpdateTypeProductDto) {
    updateTypeProduct(
      { id: typeProduct.id, data: input },
      {
        onSuccess: () => {
          props.onOpenChange?.(false);
        },
      }
    );
  }

  return (
    <Sheet {...props}>
      <SheetContent
        className="flex flex-col gap-6 sm:max-w-md"
        tabIndex={undefined}
      >
        <SheetHeader className="text-left">
          <SheetTitle className="flex flex-col items-start">
            {infoSheet.title}
            <Badge
              className="bg-emerald-100 capitalize text-emerald-700"
              variant="secondary"
            >
              {typeProduct.name}
            </Badge>
          </SheetTitle>
          <SheetDescription>{infoSheet.description}</SheetDescription>
        </SheetHeader>
        <ScrollArea className="w-full gap-4 rounded-md border p-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4 p-4"
            >
              {/* Nombre */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Tipo de Producto</FormLabel>
                    <FormControl>
                    <div className="relative">
                    {/* icon */}
                    <Box className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                    {/* input */}
                    <Input
                      id="name"
                      placeholder="Ingrese el nombre del tipo de producto"
                      {...field}
                      className="pl-8"
                    />
                  </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Descripción */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                    <div className="relative">
                    {/* icon */}
                    <List className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                    {/* input */}
                    <Textarea
                      id="description"
                      placeholder="Ingrese la descripción del tipo de producto"
                      {...field}
                      className="pl-8"
                    />
                  </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SheetFooter className="gap-2 pt-2 sm:space-x-0">
                <div className="flex flex-row-reverse gap-2">
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating && (
                      <RefreshCcw
                        className="mr-2 h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                    )}
                    Actualizar
                  </Button>
                  <SheetClose asChild>
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </SheetClose>
                </div>
              </SheetFooter>
            </form>
          </Form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}