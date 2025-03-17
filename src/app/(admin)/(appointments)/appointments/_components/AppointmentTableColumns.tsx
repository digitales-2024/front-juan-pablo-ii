"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { CalendarIcon, XIcon, RefreshCcw, CreditCard } from "lucide-react";
import { CancelAppointmentDialog } from "./CancelAppointmentDialog";
import { RefundAppointmentDialog } from "./RefundAppointmentDialog";
import { RescheduleAppointmentDialog } from "./RescheduleAppointmentDialog";
import type { Appointment, AppointmentStatus } from "../_interfaces/appointments.interface";
import { appointmentStatusConfig } from "../_interfaces/appointments.interface";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export const columns: ColumnDef<Appointment>[] = [
    {
        accessorKey: "start",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Fecha y Hora" />
        ),
        cell: ({ row }) => {
            const startDate = new Date(row.original.start);
            const endDate = new Date(row.original.end);
            return (
                <div className="flex flex-col">
                    <span className="font-medium">
                        {format(startDate, "PPP", { locale: es })}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {format(startDate, "HH:mm", { locale: es })} - {format(endDate, "HH:mm", { locale: es })}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "patient",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Paciente" />
        ),
        cell: ({ row }) => {
            const patient = row.original.patient;
            return patient ? `${patient.name} ${patient.lastName}` : "N/A";
        },
    },
    {
        accessorKey: "patientDni",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="DNI" />
        ),
        cell: ({ row }) => {
            const patient = row.original.patient;
            return patient?.dni || "N/A";
        },
    },
    {
        accessorKey: "staff",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Doctor" />
        ),
        cell: ({ row }) => {
            const staff = row.original.staff;
            return staff ? `${staff.name} ${staff.lastName}` : "N/A";
        },
    },
    {
        accessorKey: "service",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Servicio" />
        ),
        cell: ({ row }) => {
            const service = row.original.service;
            return service ? service.name : "N/A";
        },
    },
    {
        accessorKey: "branch",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Sucursal" />
        ),
        cell: ({ row }) => {
            const branch = row.original.branch;
            return branch ? branch.name : "N/A";
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Estado" />
        ),
        cell: ({ row }) => {
            const status = row.original.status as AppointmentStatus;
            const statusConfig = appointmentStatusConfig[status];

            if (!statusConfig) {
                return <Badge variant="outline">{status}</Badge>;
            }

            const StatusIcon = statusConfig.icon;

            return (
                <Badge
                    className={cn(
                        statusConfig.backgroundColor,
                        statusConfig.textColor,
                        statusConfig.hoverBgColor,
                        "flex space-x-1 items-center justify-center text-sm"
                    )}
                >
                    <StatusIcon className="size-4" />
                    <span>{statusConfig.name}</span>
                </Badge>
            );
        },
    },
    {
        id: "Acciones",
        size: 10,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Acciones" />
        ),
        cell: function Cell({ row }) {
            const [showCancelDialog, setShowCancelDialog] = useState(false);
            const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
            const [showRefundDialog, setShowRefundDialog] = useState(false);
            const appointment = row.original;
            const isActive = appointment.isActive;
            const isPending = appointment.status === "PENDING";
            const isConfirmed = appointment.status === "CONFIRMED";
            const router = useRouter();

            return (
                <div>
                    <CancelAppointmentDialog
                        appointment={appointment}
                        open={showCancelDialog}
                        onOpenChange={setShowCancelDialog}
                        showTrigger={false}
                    />
                    <RefundAppointmentDialog
                        appointment={appointment}
                        open={showRefundDialog}
                        onOpenChange={setShowRefundDialog}
                        showTrigger={false}
                    />
                    <RescheduleAppointmentDialog
                        appointment={appointment}
                        open={showRescheduleDialog}
                        onOpenChange={setShowRescheduleDialog}
                        showTrigger={false}
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                aria-label="Open menu"
                                variant="ghost"
                                className="flex size-8 p-0 data-[state=open]:bg-muted"
                            >
                                <Ellipsis className="size-4" aria-hidden="true" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                                onSelect={() => setShowRescheduleDialog(true)}
                                disabled={!isActive || !isConfirmed}
                            >
                                Reprogramar
                                <DropdownMenuShortcut>
                                    <CalendarIcon className="size-4" aria-hidden="true" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onSelect={() => router.push('/orders')}
                                disabled={!isActive || isConfirmed}
                                className="text-emerald-600"
                            >
                                Pagar
                                <DropdownMenuShortcut>
                                    <CreditCard className="size-4" aria-hidden="true" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onSelect={() => setShowRefundDialog(true)}
                                disabled={!isActive || !isConfirmed}
                                className="text-amber-600"
                            >
                                Reembolsar
                                <DropdownMenuShortcut>
                                    <RefreshCcw className="size-4" aria-hidden="true" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onSelect={() => setShowCancelDialog(true)}
                                disabled={!isActive || !isPending}
                                className="text-destructive"
                            >
                                Cancelar
                                <DropdownMenuShortcut>
                                    <XIcon className="size-4" aria-hidden="true" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
        enableSorting: false,
        enableHiding: false,
        enablePinning: true,
    },
];
