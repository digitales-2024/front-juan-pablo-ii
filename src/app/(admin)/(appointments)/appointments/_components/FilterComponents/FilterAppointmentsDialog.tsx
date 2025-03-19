"use client";
import React, { useCallback, useMemo, useEffect, memo } from "react";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Filter, Info, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    FilterByStatusSchema,
    FilterByStatus,
    AppointmentsFilterType
} from "../../_interfaces/filter.interface";
import {
    AppointmentStatus,
    appointmentStatusConfig,
    appointmentStatusEnumOptions
} from "../../_interfaces/appointments.interface";
import { useFilterAppointments } from "../../_hooks/useFilterAppointments";
import { cn } from "@/lib/utils";
import { FilterAppointmentsTabCardContent } from "./FilterAppointmentsTabCardContent";

// Memoizar el componente principal
export const FilterAppointmentsDialog = memo(() => {
    const FILTER_DIALOG_MESSAGES = useMemo(() => ({
        button: "Opciones de filtrado",
        title: "Filtrar Citas Médicas",
        description: `Escoge una opción para filtrar las citas médicas.`,
        cancel: "Cerrar",
        submitButton: "Aplicar",
    }), []);

    const TAB_OPTIONS = useMemo(
        () => ({
            BY_STATUS: {
                label: "Por Estado",
                value: AppointmentsFilterType.BY_STATUS,
                description: "Selecciona un estado de cita para filtrarlas",
            },
            ALL: {
                label: "Todas las Citas",
                value: AppointmentsFilterType.ALL,
                description: "Muestra todas las citas médicas",
            },
        }),
        []
    );

    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(TAB_OPTIONS.ALL.value);

    const {
        isLoading,
        query: appointmentsQuery,
        statusFilter,
        setFilterAllAppointments,
        setFilterByStatus,
    } = useFilterAppointments();

    const isDesktop = useMediaQuery("(min-width: 640px)");

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    const filterByStatusForm = useForm<{
        appointmentStatus: AppointmentStatus
    }>({
        resolver: zodResolver(FilterByStatusSchema),
        defaultValues: {
            appointmentStatus: statusFilter === "all" ? "all" : statusFilter,
        },
    });

    // Actualizar el valor del formulario cuando cambia el statusFilter
    useEffect(() => {
        filterByStatusForm.setValue("appointmentStatus", statusFilter === "all" ? "all" : statusFilter);
    }, [statusFilter, filterByStatusForm]);

    const onSubmitAllAppointments = useCallback(() => {
        // Solo aplicar el filtro si no estamos ya en "all"
        if (statusFilter !== "all") {
            setFilterAllAppointments();
            
            if (appointmentsQuery.isError) {
                toast.error("Error al filtrar las citas");
            } else {
                toast.success("Filtro aplicado: Todas las citas");
                handleClose();
            }
        } else {
            // Si ya estamos en "all", solo cerramos el diálogo
            handleClose();
        }
    }, [setFilterAllAppointments, appointmentsQuery.isError, handleClose, statusFilter]);

    const onSubmitStatus = useCallback((input: FilterByStatus) => {
        // Solo aplicar el filtro si es diferente al actual
        if (statusFilter !== input.appointmentStatus) {
            setFilterByStatus(input.appointmentStatus);
            
            if (appointmentsQuery.isError) {
                toast.error("Error al filtrar las citas");
            } else {
                // Obtener el nombre legible del estado para el mensaje
                const statusName = appointmentStatusConfig[input.appointmentStatus]?.name || input.appointmentStatus;
                toast.success(`Filtro aplicado: Citas en estado ${statusName}`);
                handleClose();
            }
        } else {
            // Si ya estamos en el mismo estado, solo cerramos el diálogo
            handleClose();
        }
    }, [setFilterByStatus, appointmentsQuery.isError, handleClose, statusFilter]);

    // Componentes de UI memoizados
    const DialogFooterContent = useCallback(() => (
        <div className="gap-2 sm:space-x-0 flex sm:flex-row-reverse flex-row-reverse w-full">
            <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleClose}
            >
                {FILTER_DIALOG_MESSAGES.cancel}
            </Button>
        </div>
    ), [handleClose, FILTER_DIALOG_MESSAGES.cancel]);

    const TriggerButton = useCallback(() => (
        <Button
            onClick={() => setOpen(true)}
            variant="default"
            size="sm"
            aria-label="Abrir filtros"
            className="flex p-2 data-[state=open]:bg-muted"
        >
            <Filter className="mr-2 h-4 w-4" />
            {FILTER_DIALOG_MESSAGES.button}
        </Button>
    ), [FILTER_DIALOG_MESSAGES.button]);

    const SubmitButton = useCallback(({
        type = "submit",
        onClick,
        ...rest
    }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
        <Button
            type={type}
            disabled={isLoading}
            onClick={onClick}
            className="w-full"
            {...rest}
        >
            {isLoading ? (
                <div className="flex items-center space-x-2">
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    <span>Filtrando...</span>
                </div>
            ) : (
                FILTER_DIALOG_MESSAGES.submitButton
            )}
        </Button>
    ), [isLoading, FILTER_DIALOG_MESSAGES.submitButton]);

    const FilteringTabs = useCallback(() => (
        <div>
            <Tabs
                defaultValue={TAB_OPTIONS.ALL.value}
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as AppointmentsFilterType)}
                className="w-full flex flex-col space-y-4"
            >
                <TabsList className="grid w-full grid-cols-2 h-fit">
                    <TabsTrigger value={TAB_OPTIONS.ALL.value}>
                        {TAB_OPTIONS.ALL.label}
                    </TabsTrigger>
                    <TabsTrigger value={TAB_OPTIONS.BY_STATUS.value}>
                        {TAB_OPTIONS.BY_STATUS.label}
                    </TabsTrigger>
                </TabsList>

                <FilterAppointmentsTabCardContent
                    value={TAB_OPTIONS.ALL.value}
                    title={TAB_OPTIONS.ALL.label}
                    description={TAB_OPTIONS.ALL.description}
                >
                    <section className="space-y-4">
                        <header className="flex flex-col space-y-2 justify-center items-center">
                            <Info className="size-8" />
                            <CardDescription className="text-center">
                                Este es el filtro por defecto
                            </CardDescription>
                        </header>
                        <SubmitButton
                            type="button"
                            onClick={onSubmitAllAppointments}
                            className="w-full"
                        >
                            {FILTER_DIALOG_MESSAGES.submitButton}
                        </SubmitButton>
                    </section>
                </FilterAppointmentsTabCardContent>

                <FilterAppointmentsTabCardContent
                    value={TAB_OPTIONS.BY_STATUS.value}
                    title={TAB_OPTIONS.BY_STATUS.label}
                    description={TAB_OPTIONS.BY_STATUS.description}
                >
                    <Form {...filterByStatusForm}>
                        <form
                            onSubmit={filterByStatusForm.handleSubmit(onSubmitStatus)}
                            className="space-y-4 flex flex-col items-center"
                        >
                            <FormField
                                control={filterByStatusForm.control}
                                name="appointmentStatus"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Seleccionar Estado de Cita</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona un estado" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {appointmentStatusEnumOptions.map((option) => {
                                                    const statusConfig = appointmentStatusConfig[option.value];
                                                    const IconComponent = statusConfig.icon;

                                                    return (
                                                        <SelectItem
                                                            key={option.value}
                                                            value={option.value}
                                                            className={cn(
                                                                statusConfig.backgroundColor,
                                                                statusConfig.textColor,
                                                                statusConfig.hoverBgColor,
                                                                "mb-2"
                                                            )}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <IconComponent className="h-4 w-4" />
                                                                <span>{option.label}</span>
                                                            </div>
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <SubmitButton />
                        </form>
                    </Form>
                </FilterAppointmentsTabCardContent>
            </Tabs>
        </div>
    ), [
        TAB_OPTIONS, 
        activeTab, 
        setActiveTab, 
        filterByStatusForm, 
        onSubmitAllAppointments, 
        onSubmitStatus, 
        SubmitButton, 
        FILTER_DIALOG_MESSAGES
    ]);

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <TriggerButton />
                </DialogTrigger>
                <DialogContent className="min-w-[calc(384px-2rem)] max-h-[calc(100vh-4rem)] w-s">
                    <DialogHeader>
                        <DialogTitle>{FILTER_DIALOG_MESSAGES.title}</DialogTitle>
                        <DialogDescription>
                            {FILTER_DIALOG_MESSAGES.description}
                        </DialogDescription>
                    </DialogHeader>
                    <FilteringTabs />
                    <DialogFooter>
                        <DialogFooterContent />
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <TriggerButton />
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>{FILTER_DIALOG_MESSAGES.title}</DrawerTitle>
                    <DrawerDescription>
                        {FILTER_DIALOG_MESSAGES.description}
                    </DrawerDescription>
                </DrawerHeader>
                <div className="px-2">
                    <FilteringTabs />
                </div>
                <DrawerFooter>
                    <DialogFooterContent />
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
});

FilterAppointmentsDialog.displayName = "FilterAppointmentsDialog"; 