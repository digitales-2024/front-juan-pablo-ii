"use client";

import { useZoning } from "@/hooks/use-zoning";
import { CreateZoningSchema, zoningSchema } from "@/schemas";
import { Zoning } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Percent, RefreshCcw } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

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

import { Textarea } from "../ui/textarea";

const infoSheet = {
    title: "Actualizar Zonificación",
    description: "Actualiza la información de la zonificación.",
};

interface UpdateZoningSheetProps
    extends Omit<
        React.ComponentPropsWithRef<typeof Sheet>,
        "open" | "onOpenChange"
    > {
    zoning: Zoning;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UpdateZoningSheet({
    zoning,
    open,
    onOpenChange,
}: UpdateZoningSheetProps) {
    const { onUpdateZoning, isSuccessUpdateZoning, isLoadingUpdateZoning } =
        useZoning();

    const form = useForm<CreateZoningSchema>({
        resolver: zodResolver(zoningSchema),
        defaultValues: {
            zoneCode: zoning.zoneCode ?? "",
            description: zoning.description ?? "",
            buildableArea: zoning.buildableArea ?? 0,
            openArea: zoning.openArea ?? 0,
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                zoneCode: zoning.zoneCode ?? "",
                description: zoning.description ?? "",
                buildableArea: zoning.buildableArea ?? 0,
                openArea: zoning.openArea ?? 0,
            });
        }
    }, [open, zoning, form]);

    const onSubmit = async (input: CreateZoningSchema) => {
        onUpdateZoning({
            ...input,
            id: zoning.id,
        });
    };

    useEffect(() => {
        if (isSuccessUpdateZoning) {
            form.reset();
            onOpenChange(false);
        }
    }, [isSuccessUpdateZoning, form, onOpenChange]);

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
                            {zoning.zoneCode}
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
                            <FormField
                                control={form.control}
                                name="zoneCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="name">
                                            Codigo de la Zonificación
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="name"
                                                placeholder="Ingrese el codigo de la zonificación"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="description">
                                            Descripcion del ambiente
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                id="description"
                                                placeholder="Ingrese el nombre del ambiente"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="buildableArea"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="buildableArea">
                                            Porcentaje de área construible
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    id="buildableArea"
                                                    type="number"
                                                    placeholder="Ingrese el porcentaje de área construible"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            Number(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                    className="pr-10"
                                                />
                                                <Percent className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-slate-500" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="openArea"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="openArea">
                                            Porcentaje de área libre
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    id="openArea"
                                                    type="number"
                                                    placeholder="Ingrese el porcentaje de área libre"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            Number(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                    className="pr-10"
                                                />
                                                <Percent className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-slate-500" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <SheetFooter className="gap-2 pt-2 sm:space-x-0">
                                <div className="flex flex-row-reverse gap-2">
                                    <Button
                                        type="submit"
                                        disabled={isLoadingUpdateZoning}
                                    >
                                        {isLoadingUpdateZoning && (
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
