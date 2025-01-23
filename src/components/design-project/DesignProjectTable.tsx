"use client";

import {
    DesignProjectSummaryData,
    DesignProjectStatus,
} from "@/types/designProject";
import { ColumnDef } from "@tanstack/react-table";
import { Contact, Ellipsis, FileDown, MonitorCog, Trash } from "lucide-react";
import { useState } from "react";

import { DataTable } from "@/components/data-table/DataTable";
import { Badge } from "@/components/ui/badge";
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

import { CreateProjectDialog } from "./CreateDesignProjectDialog";
import { DeleteProjectDialog } from "./DeleteProjectDialog";
import { DesignProjectDescriptionDialog } from "./DesignProjectDescriptionDialog";
import { EditDesignProjectSheet } from "./EditDesignProjectSheet";
import { GenerateContractForm } from "./GenerateContractForm";
import { UpdateStatusDialog } from "./UpdateStatusDialog";

export function DesignProjectTable({
    data,
}: {
    data: Array<DesignProjectSummaryData>;
}) {
    const columns: ColumnDef<DesignProjectSummaryData>[] = [
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
            accessorKey: "code",
            header: "Código",
        },
        {
            accessorKey: "name",
            header: "Nombre",
        },
        {
            id: "cliente",
            accessorKey: "client.name",
            header: "Cliente",
            cell: ({ row }) => {
                const clientName = row.getValue("cliente") as string;
                return (
                    <div className="flex items-center">
                        <Badge
                            variant="outline"
                            className="truncate capitalize"
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
            id: "designer",
            accessorKey: "designer.name",
            header: "Diseñador",
            cell: ({ row }) => {
                const designerName = row.getValue("designer") as string;
                return (
                    <div className="flex items-center">
                        <Badge
                            variant="outline"
                            className="truncate capitalize"
                        >
                            <Contact
                                size={14}
                                className="mr-2"
                                strokeWidth={1.5}
                            />
                            <span className="text-xs font-light">
                                {designerName}
                            </span>
                        </Badge>
                    </div>
                );
            },
        },
        {
            id: "estado",
            accessorKey: "status",
            header: "Estado",
            cell: ({ row }) => {
                const estado: DesignProjectStatus = row.getValue("estado");
                let badge = <></>;
                switch (estado) {
                    case "APPROVED":
                        badge = (
                            <Badge
                                variant="secondary"
                                className="bg-yellow-200 text-yellow-600"
                            >
                                Aprobado
                            </Badge>
                        );
                        break;
                    case "COMPLETED":
                        badge = (
                            <Badge
                                variant="secondary"
                                className="bg-green-200 text-green-700"
                            >
                                Completado
                            </Badge>
                        );
                        break;
                    case "ENGINEERING":
                        badge = (
                            <Badge
                                variant="secondary"
                                className="bg-blue-200 text-blue-600"
                            >
                                En ingeniería
                            </Badge>
                        );
                        break;
                    case "CONFIRMATION":
                        badge = (
                            <Badge
                                variant="secondary"
                                className="bg-cyan-200 text-cyan-600"
                            >
                                Confirmado
                            </Badge>
                        );
                        break;
                    case "PRESENTATION":
                        badge = (
                            <Badge
                                variant="secondary"
                                className="bg-teal-200 text-teal-600"
                            >
                                En presentacion
                            </Badge>
                        );
                        break;
                }

                return <div>{badge}</div>;
            },
        },
        {
            id: "actions",
            size: 5,
            cell: function Cell({ row }) {
                const [showContractForm, setShowContractForm] = useState(false);
                const [showEditSheet, setShowEditSheet] = useState(false);
                const [showUpdateStatusDialog, setShowUpdateStatusDialog] =
                    useState(false);
                const [showDescriptionDialog, setShowDescriptionDialog] =
                    useState(false);
                const [showDeleteDialog, setShowDeleteDialog] = useState(false);

                const status = row.original.status;

                return (
                    <div>
                        {/* Componentes que crean paneles flotantes */}
                        <div>
                            <DesignProjectDescriptionDialog
                                open={showDescriptionDialog}
                                onOpenChange={setShowDescriptionDialog}
                                project={row?.original}
                            />
                            <GenerateContractForm
                                id={row.original.id}
                                publicCode={row.original.code}
                                open={showContractForm}
                                onOpenChange={setShowContractForm}
                            />
                            <EditDesignProjectSheet
                                id={row.original.id}
                                open={showEditSheet}
                                onOpenChange={setShowEditSheet}
                                project={row?.original}
                            />
                            <UpdateStatusDialog
                                id={row?.original?.id ?? -1}
                                open={showUpdateStatusDialog}
                                onOpenChange={setShowUpdateStatusDialog}
                                project={row?.original}
                            />
                            <DeleteProjectDialog
                                id={row?.original?.id ?? -1}
                                open={showDeleteDialog}
                                onOpenChange={setShowDeleteDialog}
                                project={row?.original}
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
                                    onSelect={() =>
                                        setShowDescriptionDialog(true)
                                    }
                                >
                                    Ver
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onSelect={() => setShowEditSheet(true)}
                                >
                                    Editar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    onSelect={() =>
                                        setShowUpdateStatusDialog(true)
                                    }
                                    disabled={status === "COMPLETED"}
                                >
                                    Actualizar
                                    <DropdownMenuShortcut>
                                        <MonitorCog
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onSelect={() => setShowContractForm(true)}
                                    disabled={status !== "COMPLETED"}
                                >
                                    Generar contrato
                                    <DropdownMenuShortcut>
                                        <FileDown
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-red-700"
                                    onSelect={() => setShowDeleteDialog(true)}
                                >
                                    Eliminar
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
    return (
        <DataTable
            data={data}
            columns={columns}
            placeholder="Buscar proyectos..."
            toolbarActions={<DesignProjectTableToolbarActions />}
        />
    );
}

function DesignProjectTableToolbarActions() {
    return (
        <div className="flex w-fit flex-wrap items-center gap-2">
            <CreateProjectDialog />
        </div>
    );
}
