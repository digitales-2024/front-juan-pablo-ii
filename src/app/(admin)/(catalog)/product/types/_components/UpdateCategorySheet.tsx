"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw } from "lucide-react";

import { updateTypeProduct } from "../actions";
import { TypeProduct, UpdateTypeProductInput, TypeProductSchema } from "../types";

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
    title: "Actualizar tipo de producto",
    description: "Actualiza la información del tipo de producto y guarda los cambios",
};

interface UpdateTypeSheetProps
    extends Omit<
        React.ComponentPropsWithRef<typeof Sheet>,
        "open" | "onOpenChange"
    > {
    typeProduct: TypeProduct;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UpdateTypeSheet({
    typeProduct,
    open,
    onOpenChange,
}: UpdateTypeSheetProps) {
    const form = useForm<UpdateTypeProductInput>({
        resolver: zodResolver(TypeProductSchema),
        defaultValues: {
            name: typeProduct.name ?? "",
            description: typeProduct.description ?? "",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                name: typeProduct.name ?? "",
                description: typeProduct.description ?? "",
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, typeProduct]);

    const onSubmit = async (input: UpdateTypeProductInput) => {
        await updateTypeProduct(typeProduct.id, input);
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
                                        <FormLabel>
                                            Nombre del Tipo de Producto
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ingrese el nombre del tipo de producto"
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
                                                placeholder="Ingrese la descripción del tipo de producto"
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