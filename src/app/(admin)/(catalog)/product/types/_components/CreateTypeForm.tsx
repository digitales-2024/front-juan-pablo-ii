"use client";

import { UseFormReturn } from "react-hook-form";
import { CreateTypeProductDto } from "../types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Box, List } from "lucide-react";

interface CreateTypeFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateTypeProductDto>;
  onSubmit: (data: CreateTypeProductDto) => void;
}

export const CreateTypeForm = ({
  children,
  form,
  onSubmit,
}: CreateTypeFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-1">
        <div className="flex flex-col gap-6 p-4 sm:p-0">
          {/* Campo de Nombre */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="name">
                  Nombre del Tipo de Producto
                </FormLabel>
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
          {/* Campo de Descripción */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="description">
                  Descripción del Tipo de Producto
                </FormLabel>
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
          {/* Agrega más campos según sea necesario */}
        </div>
        {children}
      </form>
    </Form>
  );
};
