import { useDesignProject } from "@/hooks/use-design-project";
import {
    DesignProjectChecklistUpdate,
    DesignProjectData,
    DesignProjectStatusUpdate,
    DesignProjectSummaryData,
} from "@/types/designProject";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { MoveRight } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "../ui/button";
import DatePicker from "../ui/date-time-picker";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { StatusBadge } from "./Badges";

interface Props {
    id: string;
    project: DesignProjectSummaryData;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UpdateStatusDialog({ id, project, open, onOpenChange }: Props) {
    const status = project.status;
    const close = () => onOpenChange(false);
    const {
        onStatusUpdate: updateStatus,
        updateStatusLoading,
        updateStatusSuccess,
        designProjectById,
        designProjectByIdLoading,
    } = useDesignProject({ id });

    if (designProjectByIdLoading) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent>Cargando..</DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                {status === "APPROVED" && (
                    <ApprovedStatusContent
                        id={id}
                        close={close}
                        updateStatus={updateStatus}
                        loading={updateStatusLoading}
                        success={updateStatusSuccess}
                    />
                )}
                {status === "ENGINEERING" && (
                    <EngineeringStatusContent
                        id={id}
                        close={close}
                        project={designProjectById!}
                        updateStatus={updateStatus}
                        loading={updateStatusLoading}
                        success={updateStatusSuccess}
                    />
                )}
                {status === "CONFIRMATION" && (
                    <ConfirmationStatusContent
                        id={id}
                        close={close}
                        updateStatus={updateStatus}
                        loading={updateStatusLoading}
                        success={updateStatusSuccess}
                    />
                )}
                {status === "PRESENTATION" && (
                    <PresentationStatusContent
                        id={id}
                        close={close}
                        updateStatus={updateStatus}
                        loading={updateStatusLoading}
                        success={updateStatusSuccess}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}

type PropsT = {
    id: string;
    close: () => void;
    /** Funcion para actualizar el estado de una cotizacion  */
    updateStatus: (data: {
        body: DesignProjectStatusUpdate;
        id: string;
    }) => Promise<string | number>;
    loading: boolean;
    success: boolean;
};

function ApprovedStatusContent({
    id,
    close,
    updateStatus,
    loading,
    success,
}: PropsT) {
    const update = async () => {
        updateStatus({
            body: {
                newStatus: "ENGINEERING",
            },
            id,
        });
    };

    useEffect(() => {
        if (success) {
            close();
        }
    }, [success, close]);

    return (
        <DialogHeader>
            <DialogTitle>Cambiar estado de la cotización</DialogTitle>
            <div className="flex gap-2">
                <StatusBadge status="APPROVED" />
                <MoveRight />
                <StatusBadge status="ENGINEERING" />
            </div>
            <DialogDescription>
                Esta acción cambiará el estado del Proyecto de Diseño a En
                ingeniería. ¿Deseas continuar?
            </DialogDescription>
            <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={close}>
                    Cancelar
                </Button>
                <Button onClick={update} disabled={loading}>
                    Cambiar estado
                </Button>
            </div>
        </DialogHeader>
    );
}

const formSchema = z.object({
    dateArchitectural: z.string().optional(),
    dateStructural: z.string().optional(),
    dateElectrical: z.string().optional(),
    dateSanitary: z.string().optional(),
});

function EngineeringStatusContent({
    id,
    updateStatus,
    success,
    loading,
    project,
    close,
}: PropsT & { project: DesignProjectData }) {
    const checklistFinished =
        !!project.dateSanitary &&
        !!project.dateElectrical &&
        !!project.dateArchitectural &&
        !!project.dateStructural;

    // update checklist mutation
    const {
        onChecklistUpdate,
        updateChecklistLoading,
        updateChecklistSuccess,
    } = useDesignProject();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            dateArchitectural: project.dateArchitectural ?? "",
            dateStructural: project.dateStructural ?? "",
            dateElectrical: project.dateElectrical ?? "",
            dateSanitary: project.dateSanitary ?? "",
        },
    });

    async function onSubmit(body: z.infer<typeof formSchema>) {
        // instead of sending empty string, send only keys with values
        const values: DesignProjectChecklistUpdate = {};

        // send only actual values
        if (!!body.dateArchitectural) {
            values.dateArchitectural = body.dateArchitectural;
        }
        if (!!body.dateStructural) {
            values.dateStructural = body.dateStructural;
        }
        if (!!body.dateElectrical) {
            values.dateElectrical = body.dateElectrical;
        }
        if (!!body.dateSanitary) {
            values.dateSanitary = body.dateSanitary;
        }

        await onChecklistUpdate({
            id,
            body: values,
        });
    }

    useEffect(() => {
        if (updateChecklistSuccess) {
            close();
        }
    }, [updateChecklistSuccess, close]);

    const update = async () => {
        updateStatus({
            body: {
                newStatus: "CONFIRMATION",
            },
            id,
        });
    };

    useEffect(() => {
        if (success) {
            close();
        }
    }, [success, close]);

    return (
        <DialogHeader>
            <DialogTitle>Cambiar estado de la cotización</DialogTitle>
            <div className="flex gap-2">
                <StatusBadge status="ENGINEERING" />
                <MoveRight />
                <StatusBadge status="CONFIRMATION" />
            </div>
            <DialogDescription>
                {checklistFinished
                    ? "Checklist completo. Puedes pasar a estado de Confirmación, o modificar las fechas."
                    : "                Completa el checklist de planos antes de pasar a la siguiente fase."}
            </DialogDescription>
            <div>
                <p className="mt-4 font-bold">
                    Checklist: Fechas de los planos
                </p>
                <p className="mb-4 text-muted-foreground">
                    Puedes dejar fechas en blanco
                </p>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="dateStructural"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Fecha del plano estructural
                                    </FormLabel>
                                    <FormControl>
                                        <DatePicker
                                            value={
                                                field.value
                                                    ? parse(
                                                          field.value,
                                                          "yyyy-MM-dd",
                                                          new Date(),
                                                      )
                                                    : undefined
                                            }
                                            onChange={(date) => {
                                                if (date) {
                                                    const formattedDate =
                                                        format(
                                                            date,
                                                            "yyyy-MM-dd",
                                                        );
                                                    field.onChange(
                                                        formattedDate,
                                                    );
                                                } else {
                                                    field.onChange("");
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="dateArchitectural"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Fecha del plano arquitectónico
                                    </FormLabel>
                                    <FormControl>
                                        <DatePicker
                                            value={
                                                field.value
                                                    ? parse(
                                                          field.value,
                                                          "yyyy-MM-dd",
                                                          new Date(),
                                                      )
                                                    : undefined
                                            }
                                            onChange={(date) => {
                                                if (date) {
                                                    const formattedDate =
                                                        format(
                                                            date,
                                                            "yyyy-MM-dd",
                                                        );
                                                    field.onChange(
                                                        formattedDate,
                                                    );
                                                } else {
                                                    field.onChange("");
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="dateElectrical"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Fecha del plano eléctrico
                                    </FormLabel>
                                    <FormControl>
                                        <DatePicker
                                            value={
                                                field.value
                                                    ? parse(
                                                          field.value,
                                                          "yyyy-MM-dd",
                                                          new Date(),
                                                      )
                                                    : undefined
                                            }
                                            onChange={(date) => {
                                                if (date) {
                                                    const formattedDate =
                                                        format(
                                                            date,
                                                            "yyyy-MM-dd",
                                                        );
                                                    field.onChange(
                                                        formattedDate,
                                                    );
                                                } else {
                                                    field.onChange("");
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="dateSanitary"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Fecha del plano sanitario
                                    </FormLabel>
                                    <FormControl>
                                        <DatePicker
                                            value={
                                                field.value
                                                    ? parse(
                                                          field.value,
                                                          "yyyy-MM-dd",
                                                          new Date(),
                                                      )
                                                    : undefined
                                            }
                                            onChange={(date) => {
                                                if (date) {
                                                    const formattedDate =
                                                        format(
                                                            date,
                                                            "yyyy-MM-dd",
                                                        );
                                                    field.onChange(
                                                        formattedDate,
                                                    );
                                                } else {
                                                    field.onChange("");
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="text-right">
                            <Button
                                type="submit"
                                disabled={
                                    !form.formState.isDirty ||
                                    updateChecklistLoading
                                }
                            >
                                Actualizar fechas
                            </Button>
                        </div>
                    </form>
                </Form>

                {checklistFinished && (
                    <>
                        <p className="mt-4 font-bold">
                            Continuar a fase de Confirmación
                        </p>
                        <p className="mb-4 text-muted-foreground">
                            Presiona el boton para pasar el proyecto a la fase
                            de Confirmación.
                        </p>
                        <div className="flex justify-end gap-2">
                            <Button onClick={update} disabled={loading}>
                                Cambiar estado
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </DialogHeader>
    );
}

function ConfirmationStatusContent({
    id,
    close,
    updateStatus,
    loading,
    success,
}: PropsT) {
    const update = async () => {
        updateStatus({
            body: {
                newStatus: "PRESENTATION",
            },
            id,
        });
    };

    useEffect(() => {
        if (success) {
            close();
        }
    }, [success, close]);

    return (
        <DialogHeader>
            <DialogTitle>Cambiar estado de la cotización</DialogTitle>
            <div className="flex gap-2">
                <StatusBadge status="CONFIRMATION" />
                <MoveRight />
                <StatusBadge status="PRESENTATION" />
            </div>
            <DialogDescription>
                Esta acción cambiará el estado del Proyecto de Diseño a En
                presentación. ¿Deseas continuar?
            </DialogDescription>
            <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={close}>
                    Cancelar
                </Button>
                <Button onClick={update} disabled={loading}>
                    Cambiar estado
                </Button>
            </div>
        </DialogHeader>
    );
}

function PresentationStatusContent({
    id,
    close,
    updateStatus,
    loading,
    success,
}: PropsT) {
    const update = async () => {
        updateStatus({
            body: {
                newStatus: "COMPLETED",
            },
            id,
        });
    };

    useEffect(() => {
        if (success) {
            close();
        }
    }, [success, close]);

    return (
        <DialogHeader>
            <DialogTitle>Cambiar estado de la cotización</DialogTitle>
            <div className="flex gap-2">
                <StatusBadge status="PRESENTATION" />
                <MoveRight />
                <StatusBadge status="COMPLETED" />
            </div>
            <DialogDescription>
                Esta acción cambiará el estado del Proyecto de Diseño a
                Completo. ¿Deseas continuar?
            </DialogDescription>
            <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={close}>
                    Cancelar
                </Button>
                <Button onClick={update} disabled={loading}>
                    Cambiar estado
                </Button>
            </div>
        </DialogHeader>
    );
}
