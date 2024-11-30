"use client";

import { Spaces } from "@/types";
import { type ColumnDef } from "@tanstack/react-table";
import { Ellipsis, RefreshCcwDot, Trash } from "lucide-react";
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
import { DeleteSpacesDialog } from "./DeleteSpacesDialog";
import { ReactivateSpacessDialog } from "./ReactivateSpacesDialog";
import { UpdateSpacesSheet } from "./UpdateSpacesSheet";

export const spaceColumns = (isSuperAdmin: boolean): ColumnDef<Spaces>[] => {
    const columns: ColumnDef<Spaces>[] = [
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
            id: "nombre",
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Nombre" />
            ),
            cell: ({ row }) => (
                <div className="w-40 truncate capitalize">
                    {row.getValue("nombre") as string}
                </div>
            ),
        },
        {
            id: "descripción",
            accessorKey: "description",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Descripción" />
            ),

            cell: function Cell({ row }) {
                const description = row.getValue("descripción") as string;
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
                        {description ? (
                            description
                        ) : (
                            <span className="text-xs text-slate-300">
                                Sin descripción
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
            id: "actions",
            size: 10,
            cell: function Cell({ row }) {
                const [showDeleteDialog, setShowDeleteDialog] = useState(false);
                const [showReactivateDialog, setShowReactivateDialog] =
                    useState(false);
                const [showEditDialog, setShowEditDialog] = useState(false);

                const { isActive } = row.original;
                return (
                    <div>
                        <div>
                            <UpdateSpacesSheet
                                open={showEditDialog}
                                onOpenChange={setShowEditDialog}
                                space={row?.original}
                            />
                            <DeleteSpacesDialog
                                open={showDeleteDialog}
                                onOpenChange={setShowDeleteDialog}
                                spaces={[row?.original]}
                                showTrigger={false}
                                onSuccess={() => {
                                    row.toggleSelected(false);
                                }}
                            />
                            <ReactivateSpacessDialog
                                open={showReactivateDialog}
                                onOpenChange={setShowReactivateDialog}
                                spaces={[row?.original]}
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
