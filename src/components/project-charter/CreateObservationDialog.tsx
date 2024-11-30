"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { useObservation } from "@/hooks/use-observation";
import { useProjectCharter } from "@/hooks/use-project-charter";
import { CreateObservationSchema, observationSchema } from "@/schemas";
import { ProjectCharter } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw } from "lucide-react";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";

import { CreateObservationsForm } from "./CreateObservationForm";

const dataForm = {
    title: "Crear Observación",
    description:
        "Complete los detalles a continuación para crear observaciones.",
};

interface CreateObservationDialogProps
    extends Omit<
        React.ComponentPropsWithRef<typeof Dialog>,
        "open" | "onOpenChange"
    > {
    projectCharter: ProjectCharter;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    amountOfObservations: number;
}

export function CreateObservationDialog({
    projectCharter,
    open,
    onOpenChange,
    amountOfObservations,
}: CreateObservationDialogProps) {
    const [isCreatePending, startCreateTransition] = useTransition();
    const isDesktop = useMediaQuery("(min-width: 640px)");
    const { refetch } = useProjectCharter();

    const { onCreateObservation, isSuccessCreateObservation } =
        useObservation();

    const form = useForm<CreateObservationSchema>({
        resolver: zodResolver(observationSchema),
        defaultValues: {
            observation: "",
            meetingDate: "",
            projectCharterId: projectCharter.id,
        },
    });

    const onSubmit = async (input: CreateObservationSchema) => {
        try {
            startCreateTransition(() => {
                onCreateObservation({
                    projectCharterId: projectCharter.id,
                    observation: input.observation,
                    meetingDate: input.meetingDate,
                });
            });
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        if (isSuccessCreateObservation) {
            form.reset();
            onOpenChange(false);
            if (amountOfObservations === 0) {
                refetch();
            }
        }
    }, [
        isSuccessCreateObservation,
        form,
        onOpenChange,
        amountOfObservations,
        refetch,
    ]);

    const handleClose = () => {
        form.reset();
        onOpenChange(false);
    };

    if (isDesktop)
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent tabIndex={undefined}>
                    <DialogHeader>
                        <DialogTitle>{dataForm.title}</DialogTitle>
                        <DialogDescription>
                            {dataForm.description}
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-full max-h-[80vh] w-full justify-center gap-4">
                        <CreateObservationsForm form={form} onSubmit={onSubmit}>
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
                                    {/* Eliminamos DialogClose y usamos el botón directamente */}
                                    <Button
                                        onClick={handleClose}
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </DialogFooter>
                        </CreateObservationsForm>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        );

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="h-[90vh]">
                <DrawerHeader>
                    <DrawerTitle>{dataForm.title}</DrawerTitle>
                    <DrawerDescription>
                        {dataForm.description}
                    </DrawerDescription>
                </DrawerHeader>
                <ScrollArea className="mt-4 max-h-full w-full gap-4 pr-4">
                    <CreateObservationsForm form={form} onSubmit={onSubmit}>
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
                            {/* Eliminamos DrawerClose y usamos el botón directamente */}
                            <Button
                                onClick={handleClose}
                                type="button"
                                variant="outline"
                            >
                                Cancelar
                            </Button>
                        </DrawerFooter>
                    </CreateObservationsForm>
                </ScrollArea>
            </DrawerContent>
        </Drawer>
    );
}
