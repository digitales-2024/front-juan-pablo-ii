"use client";

import { useEffect } from "react";
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
            name: product.name ?? "",
            precio: product.precio ?? 0,
            unidadMedida: product.unidadMedida ?? "",
            proveedor: product.proveedor ?? "",
            uso: product.uso ?? "",
            usoProducto: product.usoProducto ?? "",
            description: product.description ?? "",
            codigoProducto: product.codigoProducto ?? "",
            descuento: product.descuento ?? 0,
            observaciones: product.observaciones ?? "",
            condicionesAlmacenamiento: product.condicionesAlmacenamiento ?? "",
            isActive: product.isActive ?? true,
            imagenUrl: product.imagenUrl ?? "",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                name: product.name ?? "",
                precio: product.precio ?? 0,
                unidadMedida: product.unidadMedida ?? "",
                proveedor: product.proveedor ?? "",
                uso: product.uso ?? "",
                usoProducto: product.usoProducto ?? "",
                description: product.description ?? "",
                codigoProducto: product.codigoProducto ?? "",
                descuento: product.descuento ?? 0,
                observaciones: product.observaciones ?? "",
                condicionesAlmacenamiento: product.condicionesAlmacenamiento ?? "",
                isActive: product.isActive ?? true,
                imagenUrl: product.imagenUrl ?? "",
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, product]);

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

                            {/* Agrega más campos según sea necesario */}

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