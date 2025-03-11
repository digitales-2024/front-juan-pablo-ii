"use client";

import { ColumnDef } from "@tanstack/react-table";
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
import { PencilIcon, BanIcon, ActivityIcon } from "lucide-react";
import { DeactivateAppointmentDialog } from "./DeactivateAppointmentDialog"; // Asegúrate de que este componente exista
import { ReactivateAppointmentDialog } from "./ReactivateAppointmentDialog"; // Asegúrate de que este componente exista
import { Checkbox } from "@/components/ui/checkbox";
import { Appointment, appointmentStatusConfig, AppointmentStatus } from "../_interfaces/appointments.interface";
import { cn } from "@/lib/utils";

export const columns: ColumnDef<Appointment>[] = [
    {
        id: "select",
        size: 10,
        header: ({ table }) => (
            <div className="px-2">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className="translate-y-0.5"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="px-2">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="translate-y-0.5"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
        enablePinning: true,
    },
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
            const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
            const [showReactivateDialog, setShowReactivateDialog] = useState(false);
            const [showEditSheet, setShowEditSheet] = useState(false);
            const appointment = row.original;
            const isActive = appointment.isActive;

            return (
                <div>
                    {isActive ? (
                        <DeactivateAppointmentDialog
                            appointment={appointment}
                            open={showDeactivateDialog}
                            onOpenChange={setShowDeactivateDialog}
                            showTrigger={false}
                        />
                    ) : (
                        <ReactivateAppointmentDialog
                            appointment={appointment}
                            open={showReactivateDialog}
                            onOpenChange={setShowReactivateDialog}
                            showTrigger={false}
                        />
                    )}
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
                                onSelect={() => setShowEditSheet(true)}
                                disabled={!isActive}
                            >
                                Editar
                                <DropdownMenuShortcut>
                                    <PencilIcon className="size-4" aria-hidden="true" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {isActive ? (
                                <DropdownMenuItem
                                    onSelect={() => setShowDeactivateDialog(true)}
                                    className="text-destructive"
                                >
                                    Desactivar
                                    <DropdownMenuShortcut>
                                        <BanIcon className="size-4" aria-hidden="true" />
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem
                                    onSelect={() => setShowReactivateDialog(true)}
                                    className="text-green-600"
                                >
                                    Reactivar
                                    <DropdownMenuShortcut>
                                        <ActivityIcon className="size-4" aria-hidden="true" />
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                            )}
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
