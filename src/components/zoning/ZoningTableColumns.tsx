"use client";

import { Zoning } from "@/types";
import { type ColumnDef } from "@tanstack/react-table";
import {
    Building,
    Ellipsis,
    Grid3X3,
    Percent,
    RefreshCcwDot,
    Trash,
    Trees,
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
import { DeleteZoningDialog } from "./DeleteZoningDialog";
import { ReactivateZoningDialog } from "./ReactivateZoningDialog";
import { UpdateZoningSheet } from "./UpdateZoningSheet";

export const zoningColumns = (isSuperAdmin: boolean): ColumnDef<Zoning>[] => {
    const columns: ColumnDef<Zoning>[] = [
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
            id: "Código",
            accessorKey: "zoneCode",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Código" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex items-center space-x-2 truncate">
                        <Grid3X3
                            size={16}
                            className="text-slate-700"
                            strokeWidth={1.5}
                        />
                        <div className="flex flex-col leading-tight">
                            <span className="text-xs font-normal">
                                {row.getValue("Código")}
                            </span>
                        </div>
                    </div>
                );
            },
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
                            "w-72 cursor-pointer truncate",
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
            id: "Área Construible",
            accessorKey: "buildableArea",
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="Área Construible"
                />
            ),
            cell: ({ row }) => (
                <div className="flex min-w-40 items-center truncate capitalize">
                    <Badge
                        className="border-yellow-500 bg-yellow-50 text-xs font-light text-yellow-800"
                        variant={"outline"}
                    >
                        <Building
                            size={16}
                            strokeWidth={1.5}
                            className="mr-2 text-yellow-500"
                        />
                        <div className="mr-2">
                            <span className="font-normal">Porcentaje:</span>
                        </div>
                        <div className="flex flex-row items-center font-semibold">
                            <span className="text-xs font-light">
                                {row.getValue("Área Construible") as string}
                            </span>
                            <Percent size={12} strokeWidth={1.5} />
                        </div>
                    </Badge>
                </div>
            ),
        },

        {
            id: "Área Libre",
            accessorKey: "openArea",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Área Libre" />
            ),
            cell: ({ row }) => (
                <div className="flex min-w-40 items-center truncate capitalize">
                    <Badge
                        className="border-green-500 bg-green-50 text-xs font-light text-green-800"
                        variant={"outline"}
                    >
                        <Trees
                            size={16}
                            strokeWidth={1.5}
                            className="mr-2 text-green-500"
                        />
                        <div className="mr-2">
                            <span className="font-normal">Porcentaje:</span>
                        </div>
                        <div className="flex flex-row items-center font-semibold text-emerald-700">
                            <span className="text-xs font-light">
                                {row.getValue("Área Libre") as string}
                            </span>
                            <Percent size={12} strokeWidth={1.5} />
                        </div>
                    </Badge>
                </div>
            ),
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
                            <UpdateZoningSheet
                                open={showEditDialog}
                                onOpenChange={setShowEditDialog}
                                zoning={row?.original}
                            />
                            <DeleteZoningDialog
                                open={showDeleteDialog}
                                onOpenChange={setShowDeleteDialog}
                                zoning={[row?.original]}
                                showTrigger={false}
                                onSuccess={() => {
                                    row.toggleSelected(false);
                                }}
                            />
                            <ReactivateZoningDialog
                                open={showReactivateDialog}
                                onOpenChange={setShowReactivateDialog}
                                zoning={[row?.original]}
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
