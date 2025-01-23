"use client";

import { useObservation } from "@/hooks/use-observation";
import { useProjectCharter } from "@/hooks/use-project-charter";
import { UpdateObservationSchema, updateObservationSchema } from "@/schemas";
import { Observation, ProjectCharter } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { parse, format } from "date-fns";
import { useEffect, useState } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import { Card, CardContent } from "../ui/card";
import DatePicker from "../ui/date-time-picker";
import { Textarea } from "../ui/textarea";
import { DeleteObservationDialog } from "./DeleteObservationDialog";
import { ObservationInformationUpdate } from "./ObservationInformationUpdate";

const infoSheet = {
    title: "Observaciones del Proyecto",
    description:
        "Gestiona las observaciones registradas del acta del proyecto.",
};

interface ObservationProjectCharterSheetProps
    extends Omit<
        React.ComponentPropsWithRef<typeof Sheet>,
        "open" | "onOpenChange"
    > {
    projectCharter: ProjectCharter;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ObservationProjectCharterSheet({
    projectCharter,
    open,
    onOpenChange,
}: ObservationProjectCharterSheetProps) {
    const { observationByProjectCharter } = useObservation({
        idProjectCharter: projectCharter.id,
    });
    const { onUpdateObservation, isLoadingUpdateObservation } =
        useObservation();
    const { refetch } = useProjectCharter();

    const [editingId, setEditingId] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const form = useForm<UpdateObservationSchema>({
        resolver: zodResolver(updateObservationSchema),
        defaultValues: {
            observation: "",
            meetingDate: "",
        },
    });

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedObservation, setSelectedObservation] =
        useState<Observation | null>(null);

    const startEditing = (obs: Observation) => {
        setEditingId(obs.id);
        form.reset({
            observation: obs.observation,
            meetingDate: obs.meetingDate,
        });
    };

    const deleteObservation = (obs: Observation) => {
        setSelectedObservation(obs);
        setShowDeleteDialog(true);
    };

    const cancelEditing = () => {
        setEditingId(null);
        form.reset();
    };

    const onSubmit = async (input: UpdateObservationSchema) => {
        if (editingId) {
            await onUpdateObservation({
                id: editingId,
                ...input,
            });
        }
        setEditingId(null);
    };

    useEffect(() => {
        if (!isLoadingUpdateObservation && editingId === null) {
            form.reset();
        }
    }, [isLoadingUpdateObservation, editingId, form]);

    const handleToggle = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleDeleteSuccess = () => {
        // Manejar el éxito de la eliminación
        setShowDeleteDialog(false);
        setSelectedObservation(null);

        if (observationByProjectCharter?.length === 1) {
            onOpenChange(false);
            refetch();
        }
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
                            {projectCharter.designProject.code}
                        </Badge>
                    </SheetTitle>
                    <SheetDescription>{infoSheet.description}</SheetDescription>
                </SheetHeader>
                <ScrollArea className="w-full gap-4 rounded-md border p-4">
                    <div className="space-y-4">
                        <h3 className="text-sm font-normal">
                            Observaciones Existentes
                        </h3>
                        {observationByProjectCharter &&
                            observationByProjectCharter.map((obs) => (
                                <Card key={obs.id}>
                                    <CardContent className="p-4">
                                        {editingId === obs.id ? (
                                            <Form {...form}>
                                                <form
                                                    onSubmit={form.handleSubmit(
                                                        onSubmit,
                                                    )}
                                                    className="space-y-4"
                                                >
                                                    <FormField
                                                        control={form.control}
                                                        name="meetingDate"
                                                        render={({ field }) => (
                                                            <FormItem className="flex flex-col">
                                                                <FormLabel>
                                                                    Fecha de
                                                                    Reunión
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
                                                                        onChange={(
                                                                            date,
                                                                        ) => {
                                                                            if (
                                                                                date
                                                                            ) {
                                                                                const formattedDate =
                                                                                    format(
                                                                                        date,
                                                                                        "yyyy-MM-dd",
                                                                                    );
                                                                                field.onChange(
                                                                                    formattedDate,
                                                                                );
                                                                            } else {
                                                                                field.onChange(
                                                                                    "",
                                                                                );
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
                                                        name="observation"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Observación
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Textarea
                                                                        {...field}
                                                                        placeholder="Ingrese la observación"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <div className="flex flex-col items-center justify-end space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={
                                                                cancelEditing
                                                            }
                                                        >
                                                            Cancelar
                                                        </Button>
                                                        <Button type="submit">
                                                            Guardar
                                                        </Button>
                                                    </div>
                                                </form>
                                            </Form>
                                        ) : (
                                            <ObservationInformationUpdate
                                                obs={{
                                                    ...obs,
                                                    projectCharterId:
                                                        projectCharter.id,
                                                }}
                                                projectCharter={projectCharter}
                                                expandido={
                                                    expandedId === obs.id
                                                }
                                                handleToggle={() =>
                                                    handleToggle(obs.id)
                                                }
                                                startEditing={startEditing}
                                                deleteObservation={
                                                    deleteObservation
                                                }
                                            />
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                    </div>
                </ScrollArea>
                <SheetFooter className="justify-end">
                    <div className="flex flex-row-reverse gap-2">
                        <SheetClose asChild>
                            <Button>Guardar</Button>
                        </SheetClose>
                        <SheetTrigger asChild>
                            <Button variant="outline">Cerrar</Button>
                        </SheetTrigger>
                    </div>
                </SheetFooter>
            </SheetContent>
            {selectedObservation && (
                <DeleteObservationDialog
                    open={showDeleteDialog}
                    onOpenChange={setShowDeleteDialog}
                    observation={selectedObservation}
                    onSuccess={handleDeleteSuccess}
                />
            )}
        </Sheet>
    );
}
