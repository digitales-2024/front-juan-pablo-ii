"use client";

import { useClients } from "@/hooks/use-client";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
    clientsSchema,
    CreateClientsSchema,
} from "@/schemas/clients/createClientSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, RefreshCcw, UserPlus } from "lucide-react";
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

import { CreateClientsForm } from "./CreateClientForm";

const dataForm = {
    button: "Crear cliente",
    title: "Crear Cliente",
    description:
        "Complete los detalles a continuación para crear nuevos clientes.",
};

interface CreateClientDialogSheetProps {
    diferentPage?: boolean;
}

export function CreateClientDialog({
    diferentPage,
}: CreateClientDialogSheetProps) {
    const [open, setOpen] = useState(false);
    const [isCreatePending, startCreateTransition] = useTransition();
    const isDesktop = useMediaQuery("(min-width: 640px)");

    const { onCreateClient, isSuccessCreateClient } = useClients();

    const form = useForm<CreateClientsSchema>({
        resolver: zodResolver(clientsSchema),
        defaultValues: {
            name: "",
            rucDni: "",
            address: "",
            department: "",
            province: "",
            phone: "",
        },
    });

    const onSubmit = async (input: CreateClientsSchema) => {
        try {
            startCreateTransition(() => {
                onCreateClient({
                    ...input,
                });
            });
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        if (isSuccessCreateClient) {
            form.reset();
            setOpen(false);
        }
    }, [isSuccessCreateClient, form]);

    const handleClose = () => {
        form.reset();
    };
    if (isDesktop)
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                        {diferentPage ? (
                            <UserPlus
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
                        <CreateClientsForm form={form} onSubmit={onSubmit}>
                            <DialogFooter>
                                <div className="flex w-full flex-row-reverse gap-2">
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
                        </CreateClientsForm>
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
                    <CreateClientsForm form={form} onSubmit={onSubmit}>
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
                    </CreateClientsForm>
                </ScrollArea>
            </DrawerContent>
        </Drawer>
    );
}
