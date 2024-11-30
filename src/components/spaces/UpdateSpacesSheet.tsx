"use client";

import { useSpaces } from "@/hooks/use-space";
import {
    CreateSpacesSchema,
    spacesSchema,
} from "@/schemas/spaces/createSpacesSchema";
import { Spaces } from "@/types";
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
    title: "Actualizar ambiente",
    description: "Actualiza la información del ambiente y guarda los cambios",
};

interface UpdateSpacesSheetProps
    extends Omit<
        React.ComponentPropsWithRef<typeof Sheet>,
        "open" | "onOpenChange"
    > {
    space: Spaces;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UpdateSpacesSheet({
    space,
    open,
    onOpenChange,
}: UpdateSpacesSheetProps) {
    const { onUpdateSpace, isSuccessUpdateSpace, isLoadingUpdateSpace } =
        useSpaces();

    const form = useForm<CreateSpacesSchema>({
        resolver: zodResolver(spacesSchema),
        defaultValues: {
            name: space.name ?? "",
            description: space.description ?? "",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                name: space.name ?? "",
                description: space.description ?? "",
            });
        }
    }, [open, space, form]);

    const onSubmit = async (input: CreateSpacesSchema) => {
        onUpdateSpace({
            ...input,
            id: space.id,
        });
    };

    useEffect(() => {
        if (isSuccessUpdateSpace) {
            form.reset();
            onOpenChange(false);
        }
    }, [isSuccessUpdateSpace, form, onOpenChange]);

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
                            {space.name}
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
                                            Nombre del ambiente
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ingrese el nombre del ambiente"
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
                                                placeholder="Ingrese la descripción del ambiente"
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
                                        disabled={isLoadingUpdateSpace}
                                    >
                                        {isLoadingUpdateSpace && (
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
