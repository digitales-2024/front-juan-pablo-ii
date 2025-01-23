"use client";

import { ClientWithDescription } from "@/types";
import { type ColumnDef } from "@tanstack/react-table";
import {
    ChevronDown,
    ChevronUp,
    Ellipsis,
    MapPin,
    RefreshCcwDot,
    SquareUser,
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

import { cn } from "@/lib/utils";

import { DataTableColumnHeader } from "../data-table/DataTableColumnHeader";
import { Badge } from "../ui/badge";
import { DeleteClientsDialog } from "./DeleteClientDialog";
import { ReactivateClientsDialog } from "./ReactivateClientsDialog";
import { UpdateClientSheet } from "./UpdateClientsSheet";

export const clientsColumns = (
    isSuperAdmin: boolean,
): ColumnDef<ClientWithDescription>[] => {
    const columns: ColumnDef<ClientWithDescription>[] = [
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
            id: "Documento",
            accessorKey: "rucDni",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Documento" />
            ),
            cell: ({ row }) => (
                <div className="flex min-w-40 items-center truncate capitalize">
                    <Badge className="text-xs font-light" variant={"outline"}>
                        <SquareUser
                            size={14}
                            className="mr-2"
                            strokeWidth={1.5}
                        />
                        <span className="text-xs">
                            {row.getValue("Documento") as string}
                        </span>
                    </Badge>
                </div>
            ),
        },

        {
            id: "nombre",
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Nombre" />
            ),
            cell: ({ row }) => (
                <div className="min-w-40 truncate capitalize">
                    <span className="text-xs">
                        {row.getValue("nombre") as string}
                    </span>
                </div>
            ),
        },

        {
            id: "Dirección",
            accessorKey: "address",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Dirección" />
            ),
            cell: function Cell({ row }) {
                const address = row.getValue("Dirección") as string;
                const [expandido, setExpandido] = useState(false);

                const handleToggle = () => {
                    setExpandido(!expandido);
                };

                return (
                    <div
                        className={cn(
                            "w-72 truncate",
                            expandido
                                ? "whitespace-normal"
                                : "whitespace-nowrap",
                        )}
                        onClick={handleToggle}
                    >
                        {address ? (
                            <div className="flex font-normal">
                                <MapPin
                                    size={14}
                                    className="mr-2"
                                    strokeWidth={1.5}
                                />
                                <span className="text-xs">{address}</span>
                            </div>
                        ) : (
                            <span className="text-xs text-slate-300">
                                Sin dirección
                            </span>
                        )}
                    </div>
                );
            },
        },

        {
            id: "estado",
            accessorKey: "isActive",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Estado" />
            ),
            cell: ({ row }) => (
                <div>
                    {row.getValue("estado") ? (
                        <Badge
                            variant="secondary"
                            className="bg-emerald-100 text-emerald-500"
                        >
                            Activo
                        </Badge>
                    ) : (
                        <Badge
                            variant="secondary"
                            className="bg-red-100 text-red-500"
                        >
                            Inactivo
                        </Badge>
                    )}
                </div>
            ),
        },

        {
            id: "descripción",
            size: 10,
            accessorKey: "description",
            header: ({ column }) => {
                return (
                    <DataTableColumnHeader
                        column={column}
                        title="Descripción"
                    />
                );
            },
            cell: ({ row }) => {
                return row.getCanExpand() ? (
                    <Button
                        variant="ghost"
                        {...{
                            onClick: row.getToggleExpandedHandler(),
                        }}
                    >
                        {row.getIsExpanded() ? <ChevronUp /> : <ChevronDown />}
                    </Button>
                ) : null;
            },
            enableSorting: false,
            enableHiding: false,
            enablePinning: true,
        },

        {
            id: "actions",
            size: 5,
            cell: function Cell({ row }) {
                const [showDeleteDialog, setShowDeleteDialog] = useState(false);
                const [showReactivateDialog, setShowReactivateDialog] =
                    useState(false);
                const [showEditDialog, setShowEditDialog] = useState(false);

                const { isActive } = row.original;
                return (
                    <div>
                        <div>
                            <UpdateClientSheet
                                open={showEditDialog}
                                onOpenChange={setShowEditDialog}
                                client={row?.original}
                            />
                            <DeleteClientsDialog
                                open={showDeleteDialog}
                                onOpenChange={setShowDeleteDialog}
                                clients={[row?.original]}
                                showTrigger={false}
                                onSuccess={() => {
                                    row.toggleSelected(false);
                                }}
                            />
                            <ReactivateClientsDialog
                                open={showReactivateDialog}
                                onOpenChange={setShowReactivateDialog}
                                clients={[row?.original]}
                                showTrigger={false}
                                onSuccess={() => {
                                    row.toggleSelected(false);
                                }}
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
                                    disabled={!isActive}
                                >
                                    Editar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {isSuperAdmin && (
                                    <DropdownMenuItem
                                        onSelect={() =>
                                            setShowReactivateDialog(true)
                                        }
                                        disabled={isActive}
                                    >
                                        Reactivar
                                        <DropdownMenuShortcut>
                                            <RefreshCcwDot
                                                className="size-4"
                                                aria-hidden="true"
                                            />
                                        </DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                    onSelect={() => setShowDeleteDialog(true)}
                                    disabled={!isActive}
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

    return columns;
};
