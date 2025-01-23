"use client";

import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { CreateProductInput } from "../types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AutoComplete, Option } from "@/components/ui/autocomplete";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { getAllCategories } from "../../categorys/actions";
import { getAllTypeProducts } from "../../product-types/actions";

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
    const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
    const [typeProductOptions, setTypeProductOptions] = useState<Option[]>([]);

    useEffect(() => {
        // Obtener opciones de categorías
        const fetchCategories = async () => {
            const categories = await getAllCategories();
            const options = categories.map((category) => ({
                value: category.id.toString(),
                label: category.name,
            }));
            setCategoryOptions(options);
        };

        // Obtener opciones de tipos de productos
        const fetchTypeProducts = async () => {
            const typeProducts = await getAllTypeProducts();
            const options = typeProducts.map((typeProduct) => ({
                value: typeProduct.id.toString(),
                label: typeProduct.name,
            }));
            setTypeProductOptions(options);
        };

        fetchCategories();
        fetchTypeProducts();
    }, []);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 p-1"
            >
                <div className="flex flex-col gap-6 p-4 sm:p-0">
                    {/* Campo de categoría */}
                    <FormField
                        control={form.control}
                        name="categoriaId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="categoryId">
                                    Categoría
                                </FormLabel>
                                <FormControl>
                                    <AutoComplete
                                        options={categoryOptions}
                                        placeholder="Selecciona una categoría"
                                        emptyMessage="No se encontraron categorías"
                                        value={
                                            categoryOptions.find(
                                                (option) =>
                                                    option.value === field.value,
                                            ) || undefined
                                        }
                                        onValueChange={(option) => {
                                            field.onChange(option?.value || "");
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Campo de tipo de producto */}
                    <FormField
                        control={form.control}
                        name="tipoProductoId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="typeProductId">
                                    Tipo de Producto
                                </FormLabel>
                                <FormControl>
                                    <AutoComplete
                                        options={typeProductOptions}
                                        placeholder="Selecciona un tipo de producto"
                                        emptyMessage="No se encontraron tipos de productos"
                                        value={
                                            typeProductOptions.find(
                                                (option) =>
                                                    option.value === field.value,
                                            ) || undefined
                                        }
                                        onValueChange={(option) => {
                                            field.onChange(option?.value || "");
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                    {/* Campo de Código de Producto */}
                    <FormField
                        control={form.control}
                        name="codigoProducto"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="codigoProducto">
                                    Código del Producto
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        id="codigoProducto"
                                        placeholder="Ingrese el código del producto"
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
								<FormLabel htmlFor="price">
									Precio del Producto
								</FormLabel>
								<FormControl>
									<Input
										placeholder="Ingrese el precio del producto"
										type="number"
										{...field}
										onChange={(e) => field.onChange(Number(e.target.value))}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
                    {/* Campo de Unidad de Medida */}
                    <FormField
                        control={form.control}
                        name="unidadMedida"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="unidadMedida">
                                    Unidad de Medida
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        id="unidadMedida"
                                        placeholder="Ingrese la unidad de medida"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Campo de Descuento */}
                  					<FormField
						control={form.control}
						name="descuento"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor="descuento">
									Descuento
								</FormLabel>
								<FormControl>
									<Input
										id="descuento"
										placeholder="Ingrese el descuento"
										type="number"
										{...field}
										onChange={(e) => field.onChange(Number(e.target.value))}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
                    {/* Campo de Proveedor */}
                    <FormField
                        control={form.control}
                        name="proveedor"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="proveedor">
                                    Proveedor
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        id="proveedor"
                                        placeholder="Ingrese el proveedor"
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