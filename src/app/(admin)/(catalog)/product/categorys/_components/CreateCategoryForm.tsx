"use client";

import { UseFormReturn } from "react-hook-form";
import { CreateCategoryInput } from "../types";
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

interface CreateCategoryFormProps
    extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
    children: React.ReactNode;
    form: UseFormReturn<CreateCategoryInput>;
    onSubmit: (data: CreateCategoryInput) => void;
}

/**
 * Componente de formulario para crear una nueva categoría de productos.
 *
 * Este componente utiliza react-hook-form para manejar los datos del formulario y
 * zod para la validación de los mismos. El formulario permite ingresar el nombre
 * y la descripción de la categoría, y puede incluir campos adicionales si es necesario.
 *
 * @param {CreateCategoryFormProps} props - Las propiedades del componente.
 * @param {React.ReactNode} props.children - Elementos secundarios que se renderizan dentro del formulario.
 * @param {UseFormReturn<CreateCategoryInput>} props.form - El objeto de formulario de react-hook-form.
 * @param {(data: CreateCategoryInput) => void} props.onSubmit - Función que se llama al enviar el formulario.
 * @returns {JSX.Element} Un elemento JSX que representa el formulario de creación de categoría.
 */

export const CreateCategoryForm = ({
    children,
    form,
    onSubmit,
}: CreateCategoryFormProps) => {
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
                                    Nombre de la Categoría
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        id="name"
                                        placeholder="Ingrese el nombre de la categoría"
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
                                    Descripción de la Categoría
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        id="description"
                                        placeholder="Ingrese la descripción de la categoría"
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