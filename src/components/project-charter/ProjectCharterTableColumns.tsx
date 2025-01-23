"use client";

import { useObservation } from "@/hooks/use-observation";
import { ProjectCharter } from "@/types";
import { type ColumnDef } from "@tanstack/react-table";
import {
    Contact,
    DraftingCompass,
    Ellipsis,
    FileDown,
    Plus,
    Trash,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DataTableColumnHeader } from "../data-table/DataTableColumnHeader";
import { Badge } from "../ui/badge";
import { CreateObservationDialog } from "./CreateObservationDialog";
import { DeleteAllObservationsDialog } from "./DeleteAllObservationsDialog";
import { ObservationProjectCharterSheet } from "./ObservationProjectCharterSheet";

export const projectsChartersColumns = (
    isSuperAdmin: boolean,
    exportProjectCharterToPdf: (id: string, codeProject: string) => void,
): ColumnDef<ProjectCharter>[] => {
    const columns: ColumnDef<ProjectCharter>[] = [
        {
            id: "select",
            size: 10,
            header: ({ table }) => (
                <div className="px-2">
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() &&
                                "indeterminate")
                        }
                        onCheckedChange={(value) =>
                            table.toggleAllPageRowsSelected(!!value)
                        }
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
            id: "proyecto",
            accessorKey: "designProject.code",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Proyecto" />
            ),
            cell: ({ row }) => (
                <div className="flex min-w-40 items-center truncate capitalize">
                    <span className="text-xs font-light">
                        {row.getValue("proyecto") as string}
                    </span>
                </div>
            ),
        },

        {
            id: "cliente",
            accessorKey: "designProject.client.name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Cliente" />
            ),
            cell: ({ row }) => {
                const clientName = row.getValue("cliente") as string;
                return (
                    <div className="flex items-center">
                        <Badge
                            variant="outline"
                            className="truncate border-gray-500 capitalize text-gray-700"
                        >
                            <Contact
                                size={14}
                                className="mr-2"
                                strokeWidth={1.5}
                            />
                            <span className="text-xs font-light">
                                {clientName}
                            </span>
                        </Badge>
                    </div>
                );
            },
        },

        {
            id: "responsable",
            accessorKey: "designProject.designer.name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Responsable" />
            ),
            cell: ({ row }) => {
                const userName = row.getValue("responsable") as string;
                return (
                    <div className="flex items-center">
                        <Badge
                            variant="outline"
                            className="truncate border-blue-500 capitalize text-blue-700"
                        >
                            <DraftingCompass
                                size={14}
                                className="mr-2"
                                strokeWidth={1.5}
                            />
                            <span className="text-xs font-light">
                                {userName}
                            </span>
                        </Badge>
                    </div>
                );
            },
        },

        {
            id: "estado",
            accessorKey: "designProject.status",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Estado" />
            ),
            cell: ({ row }) => {
                const status = row.getValue("estado");
                let badgeProps: { className: string; label: string } = {
                    className: "",
                    label: "",
                };

                switch (status) {
                    case "APPROVED":
                        badgeProps = {
                            className: "bg-emerald-100 text-emerald-500",
                            label: "Aprobado",
                        };
                        break;
                    case "ENGINEERING":
                        badgeProps = {
                            className: "bg-blue-100 text-blue-500",
                            label: "Ingeniería",
                        };
                        break;
                    case "CONFIRMATION":
                        badgeProps = {
                            className: "bg-yellow-100 text-yellow-500",
                            label: "Confirmación",
                        };
                        break;
                    case "PRESENTATION":
                        badgeProps = {
                            className: "bg-purple-100 text-purple-500",
                            label: "Presentación",
                        };
                        break;
                    case "COMPLETED":
                        badgeProps = {
                            className: "bg-gray-100 text-gray-500",
                            label: "Completado",
                        };
                        break;
                    default:
                        badgeProps = {
                            className: "bg-red-100 text-red-500",
                            label: "Inactivo",
                        };
                        break;
                }

                return (
                    <Badge variant="secondary" className={badgeProps.className}>
                        {badgeProps.label}
                    </Badge>
                );
            },
        },

        {
            id: "actions",
            size: 5,
            cell: function Cell({ row }) {
                const { amountOfObservations, designProject, id } =
                    row.original;
                const { observationByProjectCharter } = useObservation({
                    idProjectCharter: id,
                });
                const [showEditDialog, setShowEditDialog] = useState(false);
                const [showObservationDialog, setShowObservationDialog] =
                    useState(false);
                const [showDeleteDialog, setShowDeleteDialog] = useState(false);
                const downloadPdfProjectCharter = () => {
                    exportProjectCharterToPdf(
                        designProject.id,
                        designProject.code,
                    );
                };

                return (
                    <div>
                        <div>
                            <CreateObservationDialog
                                open={showObservationDialog}
                                onOpenChange={setShowObservationDialog}
                                projectCharter={row?.original}
                                amountOfObservations={amountOfObservations ?? 0}
                            />
                            <ObservationProjectCharterSheet
                                open={showEditDialog}
                                onOpenChange={setShowEditDialog}
                                projectCharter={row?.original}
                            />
                            <DeleteAllObservationsDialog
                                open={showDeleteDialog}
                                onOpenChange={setShowDeleteDialog}
                                projectCharter={[row?.original]}
                                showTrigger={false}
                                onSuccess={() => {}}
                            />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    aria-label="Open menu"
                                    variant="ghost"
                                    className="flex size-8 p-0 data-[state=open]:bg-muted"
                                >
                                    <Ellipsis
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem
                                    onSelect={() => setShowEditDialog(true)}
                                    disabled={
                                        observationByProjectCharter?.length ===
                                        0
                                    }
                                >
                                    Gestionar observaciones
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onSelect={() =>
                                        setShowObservationDialog(true)
                                    }
                                >
                                    Añadir observación
                                    <DropdownMenuShortcut>
                                        <Plus
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onSelect={() => downloadPdfProjectCharter()}
                                    disabled={
                                        observationByProjectCharter?.length ===
                                        0
                                    }
                                >
                                    Descargar
                                    <DropdownMenuShortcut>
                                        <FileDown
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onSelect={() => setShowDeleteDialog(true)}
                                    disabled={
                                        observationByProjectCharter?.length ===
                                        0
                                    }
                                >
                                    Eliminar observaciones
                                    <DropdownMenuShortcut>
                                        <Trash
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            enablePinning: true,
        },
    ];

    return columns;
};
