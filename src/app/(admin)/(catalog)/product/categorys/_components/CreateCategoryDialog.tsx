"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { createCategory } from "../actions";
import { CategorySchema, CreateCategoryInput } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, RefreshCcw, SquarePlus } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";

import { CreateCategoryForm } from "./CreateCategoryForm";

const dataForm = {
    button: "Crear categoría",
    title: "Crear categoría",
    description:
        "Complete los detalles a continuación para crear una nueva categoría.",
};

interface CreateCategoryDialogProps {
    diferentPage?: boolean;
}

export function CreateCategoryDialog({
    diferentPage,
}: CreateCategoryDialogProps) {
    const [open, setOpen] = useState(false);
    const [isCreatePending, startCreateTransition] = useTransition();
    const isDesktop = useMediaQuery("(min-width: 640px)");

    const form = useForm<CreateCategoryInput>({
        resolver: zodResolver(CategorySchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    const onSubmit = async (input: CreateCategoryInput) => {
        try {
            startCreateTransition(() => {
                createCategory(input);
            });
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        if (isCreatePending) {
            form.reset();
            setOpen(false);
        }
    }, [isCreatePending]);

    const handleClose = () => {
        form.reset();
    };

    if (isDesktop)
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                        {diferentPage ? (
                            <SquarePlus
                                className="mr-2 size-4"
                                aria-hidden="true"
                            />
                        ) : (
                            <Plus className="mr-2 size-4" aria-hidden="true" />
                        )}
                        {dataForm.button}
                    </Button>
                </DialogTrigger>
                <DialogContent tabIndex={undefined}>
                    <DialogHeader>
                        <DialogTitle>{dataForm.title}</DialogTitle>
                        <DialogDescription>
                            {dataForm.description}
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-full max-h-[80vh] w-full justify-center gap-4">
                        <CreateCategoryForm form={form} onSubmit={onSubmit}>
                            <DialogFooter>
                                <div className="flex w-full flex-row-reverse gap-2">
                                    <Button
                                        type="submit"
                                        disabled={isCreatePending}
                                        className="w-full"
                                    >
                                        {isCreatePending && (
                                            <RefreshCcw
                                                className="mr-2 size-4 animate-spin"
                                                aria-hidden="true"
                                            />
                                        )}
                                        Registrar
                                    </Button>
                                    <DialogClose asChild>
                                        <Button
                                            onClick={handleClose}
                                            type="button"
                                            variant="outline"
                                            className="w-full"
                                        >
                                            Cancelar
                                        </Button>
                                    </DialogClose>
                                </div>
                            </DialogFooter>
                        </CreateCategoryForm>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        );

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline" size="sm">
                    <Plus className="mr-2 size-4" aria-hidden="true" />
                    {dataForm.button}
                </Button>
            </DrawerTrigger>

            <DrawerContent className="h-[90vh]">
                <DrawerHeader>
                    <DrawerTitle>{dataForm.title}</DrawerTitle>
                    <DrawerDescription>
                        {dataForm.description}
                    </DrawerDescription>
                </DrawerHeader>
                <ScrollArea className="mt-4 max-h-full w-full gap-4 pr-4">
                    <CreateCategoryForm form={form} onSubmit={onSubmit}>
                        <DrawerFooter className="gap-2 sm:space-x-0">
                            <Button disabled={isCreatePending}>
                                {isCreatePending && (
                                    <RefreshCcw
                                        className="mr-2 size-4 animate-spin"
                                        aria-hidden="true"
                                    />
                                )}
                                Registrar
                            </Button>
                            <DrawerClose asChild>
                                <Button variant="outline">Cancelar</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </CreateCategoryForm>
                </ScrollArea>
            </DrawerContent>
        </Drawer>
    );
}