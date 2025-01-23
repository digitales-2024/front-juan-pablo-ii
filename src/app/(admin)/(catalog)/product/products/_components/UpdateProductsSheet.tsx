"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw } from "lucide-react";

import { updateProduct } from "../actions";
import { Product, UpdateProductInput, productSchema } from "../types";

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
import { AutoComplete, Option } from "@/components/ui/autocomplete";
import { getAllCategories } from "../../categorys/actions";
import { getAllTypeProducts } from "../../product-types/actions";

const infoSheet = {
    title: "Actualizar producto",
    description: "Actualiza la información del producto y guarda los cambios",
};

interface UpdateProductsSheetProps
    extends Omit<
        React.ComponentPropsWithRef<typeof Sheet>,
        "open" | "onOpenChange"
    > {
    product: Product;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UpdateProductsSheet({
    product,
    open,
    onOpenChange,
}: UpdateProductsSheetProps) {
    const form = useForm<UpdateProductInput>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            categoriaId: product.categoriaId ?? "",
            tipoProductoId: product.tipoProductoId ?? "",
            name: product.name ?? "",
            codigoProducto: product.codigoProducto ?? "",
            precio: product.precio ?? 0,
            unidadMedida: product.unidadMedida ?? "",
            descuento: product.descuento ?? 0,
            proveedor: product.proveedor ?? "",
            description: product.description ?? "",
        },
    });

    const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
    const [typeProductOptions, setTypeProductOptions] = useState<Option[]>([]);

    useEffect(() => {
        if (open) {
            form.reset({
                categoriaId: product.categoriaId ?? "",
                tipoProductoId: product.tipoProductoId ?? "",
                name: product.name ?? "",
                codigoProducto: product.codigoProducto ?? "",
                precio: product.precio ?? 0,
                unidadMedida: product.unidadMedida ?? "",
                descuento: product.descuento ?? 0,
                proveedor: product.proveedor ?? "",
                description: product.description ?? "",
            });

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
        }
    }, [open, product, form]);

    const onSubmit = async (input: UpdateProductInput) => {
        await updateProduct(product.id, input);
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
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
                            {product.name}
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
                            {/* Campo de categoría */}
                            <FormField
                                control={form.control}
                                name="categoriaId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="categoriaId">
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
                                        <FormLabel htmlFor="tipoProductoId">
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
                            {/* Nombre */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Nombre del Producto
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ingrese el nombre del producto"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Código del Producto */}
                            <FormField
                                control={form.control}
                                name="codigoProducto"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Código del Producto
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ingrese el código del producto"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Precio */}
                            <FormField
                                control={form.control}
                                name="precio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Precio del Producto
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Ingrese el precio del producto"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Unidad de Medida */}
                            <FormField
                                control={form.control}
                                name="unidadMedida"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Unidad de Medida
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ingrese la unidad de medida del producto"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Descuento */}
                            <FormField
                                control={form.control}
                                name="descuento"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Descuento
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Ingrese el descuento del producto"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Proveedor */}
                            <FormField
                                control={form.control}
                                name="proveedor"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Proveedor
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ingrese el proveedor del producto"
                                                {...field}
                                            />
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
                                            <Textarea
                                                placeholder="Ingrese la descripción del producto"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <SheetFooter className="gap-2 pt-2 sm:space-x-0">
                                <div className="flex flex-row-reverse gap-2">
                                    <Button
                                        type="submit"
                                        disabled={form.formState.isSubmitting}
                                    >
                                        {form.formState.isSubmitting && (
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