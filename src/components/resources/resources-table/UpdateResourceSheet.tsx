"use client";

import { useResource } from "@/hooks/use-resource";
import { CreateResourceSchema, resourceSchema } from "@/schemas";
import { Resource, ResourceType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw } from "lucide-react";
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

const typesResources = {
    [ResourceType.TOOLS]: "Herramientas",
    [ResourceType.LABOR]: "Mano de obra",
    [ResourceType.SUPPLIES]: "Insumos",
    [ResourceType.SERVICES]: "Servicios",
};
const infoSheet = {
    title: "Actualizar Recurso",
    description: "Actualiza la información del recurso.",
};

interface UpdateResourceSheetProps
    extends Omit<
        React.ComponentPropsWithRef<typeof Sheet>,
        "open" | "onOpenChange"
    > {
    resource: Resource;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UpdateResourceSheet({
    resource,
    open,
    onOpenChange,
}: UpdateResourceSheetProps) {
    const {
        onUpdateResource,
        isSuccessUpdateResource,
        isLoadingUpdateResource,
    } = useResource();

    const form = useForm<CreateResourceSchema>({
        resolver: zodResolver(resourceSchema),
        defaultValues: {
            type: resource.type ?? "",
            name: resource.name ?? "",
            unit: resource.unit ?? 0,
            unitCost: resource.unitCost ?? 0,
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                type: resource.type ?? "",
                name: resource.name ?? "",
                unit: resource.unit ?? 0,
                unitCost: resource.unitCost ?? 0,
            });
        }
    }, [open, resource, form]);

    const onSubmit = async (input: CreateResourceSchema) => {
        onUpdateResource({
            ...input,
            id: resource.id,
        });
    };

    useEffect(() => {
        if (isSuccessUpdateResource) {
            form.reset();
            onOpenChange(false);
        }
    }, [isSuccessUpdateResource, form, onOpenChange]);

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
                            {resource.name}
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
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="name">
                                            Nombre del recurso
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="name"
                                                placeholder="Ingrese el nombre del recurso"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="type">
                                            Tipo de recurso
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione un tipo de recurso" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.entries(
                                                    typesResources,
                                                ).map(([value, label]) => (
                                                    <SelectItem
                                                        key={value}
                                                        value={value}
                                                    >
                                                        {label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="unit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="unit">
                                            Unidad del recurso
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="unit"
                                                placeholder="Ingrese el nombre del recurso"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="unitCost"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="unitCost">
                                            Costo unitario
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    id="unitCost"
                                                    type="number"
                                                    placeholder="Ingrese costo unitario"
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
                                        disabled={isLoadingUpdateResource}
                                    >
                                        {isLoadingUpdateResource && (
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
