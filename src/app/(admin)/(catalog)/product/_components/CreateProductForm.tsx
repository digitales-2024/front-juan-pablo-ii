"use client";

import { UseFormReturn } from "react-hook-form";
import { CreateProductInput } from "../types";
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

interface CreateProductFormProps
    extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
    children: React.ReactNode;
    form: UseFormReturn<CreateProductInput>;
    onSubmit: (data: CreateProductInput) => void;
}

export const CreateProductForm = ({
    children,
    form,
    onSubmit,
}: CreateProductFormProps) => {
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 p-1"
            >
                <div className="flex flex-col gap-6 p-4 sm:p-0">
                    {/* Campo de Nombre */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="name">
                                    Nombre del Producto
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        id="name"
                                        placeholder="Ingrese el nombre del producto"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Campo de Precio */}
                    <FormField
                        control={form.control}
                        name="precio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="precio">
                                    Precio del Producto
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        id="precio"
                                        type="number"
                                        placeholder="Ingrese el precio del producto"
                                        {...field}
                                    />
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
                                    Descripción del Producto
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        id="description"
                                        placeholder="Ingrese la descripción del producto"
                                        {...field}
                                    />
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