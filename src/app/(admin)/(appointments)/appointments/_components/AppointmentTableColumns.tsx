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
import { Appointment } from "../_interfaces/appointments.interface";

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
            <DataTableColumnHeader column={column} title="Inicio" />
        ),
        cell: ({ row }) => format(new Date(row.original.start), "PPp", { locale: es }),
    },
    {
        accessorKey: "end",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Fin" />
        ),
        cell: ({ row }) => format(new Date(row.original.end), "PPp", { locale: es }),
    },
    {
        accessorKey: "patientId",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ID del Paciente" />
        ),
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Estado" />
        ),
        cell: ({ row }) => (
            <Badge variant={row.original.status === "PENDING" ? "secondary" : "success"}>
                {row.original.status}
            </Badge>
        ),
    },
    {
        accessorKey: "isActive",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Activo" />
        ),
        cell: ({ row }) => (
            <Badge variant={row.original.isActive ? "success" : "destructive"}>
                {row.original.isActive ? "Sí" : "No"}
            </Badge>
        ),
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
