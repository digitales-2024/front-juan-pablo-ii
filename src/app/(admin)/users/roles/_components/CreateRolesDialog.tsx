"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { useRol } from "@/hooks/use-rol";
import { createRolesSchema, CreateRolesSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, RefreshCcw } from "lucide-react";
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

import { CreateRolesForm } from "./CreateRolesForm";

const dataForm = {
    button: "Crear rol",
    title: "Crear Rol",
    description: "Complete los detalles a continuación para crear un nuevo rol",
};

export function CreateRolesDialog() {
    const [open, setOpen] = useState(false);
    const [isCreatePending, startCreateTransition] = useTransition();
    const isDesktop = useMediaQuery("(min-width: 640px)");

    const { onCreateRole, isSuccessCreateRole } = useRol();

    const form = useForm<CreateRolesSchema>({
        resolver: zodResolver(createRolesSchema),
        defaultValues: {
            name: "",
            description: "",
            rolPermissions: [],
        },
    });
    const onSubmit = async (input: CreateRolesSchema) => {
        startCreateTransition(async () => {
            await onCreateRole(input);
        });
    };
    useEffect(() => {
        if (isSuccessCreateRole) {
            form.reset();
            setOpen(false);
        }
    }, [isSuccessCreateRole, form]);

    const handleClose = () => {
        form.reset();
    };

    if (isDesktop)
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Plus className="mr-2 size-4" aria-hidden="true" />
                        {dataForm.button}
                    </Button>
                </DialogTrigger>
                <DialogContent
                    className="max-h-[95vh] overflow-auto"
                    tabIndex={undefined}
                >
                    <ScrollArea className="max-h-[95vh]">
                        <DialogHeader>
                            <DialogTitle>{dataForm.title}</DialogTitle>
                            <DialogDescription>
                                {dataForm.description}
                            </DialogDescription>
                        </DialogHeader>
                        <CreateRolesForm form={form} onSubmit={onSubmit}>
                            <DialogFooter className="gap-2 sm:space-x-0">
                                <div className="inline-flex w-full flex-row-reverse gap-2">
                                    <Button
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
                        </CreateRolesForm>
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

            <DrawerContent tabIndex={undefined}>
                <DrawerHeader>
                    <DrawerTitle>{dataForm.title}</DrawerTitle>
                    <DrawerDescription>
                        {dataForm.description}
                    </DrawerDescription>
                </DrawerHeader>
                <CreateRolesForm form={form} onSubmit={onSubmit}>
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
                </CreateRolesForm>
            </DrawerContent>
        </Drawer>
    );
}
