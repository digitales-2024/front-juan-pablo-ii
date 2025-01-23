"use client";

import { Resource, ResourceType } from "@/types/resource";
import { type ColumnDef } from "@tanstack/react-table";
import {
    Ellipsis,
    Hexagon,
    LucideIcon,
    RefreshCcwDot,
    Trash,
} from "lucide-react";
import { useState } from "react";

import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
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

import { DeleteResourceDialog } from "./DeleteResourceDialog";
import { ReactivateResourceDialog } from "./ReactivateResourceDialog";
import { UpdateResourceSheet } from "./UpdateResourceSheet";

export const resourceColumns = (
    isSuperAdmin: boolean,
    iconMap: Record<ResourceType, LucideIcon>,
    currentResourceType: ResourceType,
): ColumnDef<Resource>[] => {
    const IconComponent = iconMap[currentResourceType];
    const columns: ColumnDef<Resource>[] = [
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
            id: "Nombre",
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Nombre" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex items-center space-x-2 truncate capitalize">
                        <IconComponent
                            size={16}
                            className="text-slate-700"
                            strokeWidth={1.5}
                        />
                        <div className="flex flex-col leading-tight">
                            <span className="text-xs font-normal">
                                {row.getValue("Nombre")}
                            </span>
                        </div>
                    </div>
                );
            },
        },

        {
            id: "Unit",
            accessorKey: "unit",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Unit" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex items-center space-x-2 truncate">
                        <Hexagon
                            size={16}
                            className="text-slate-700"
                            strokeWidth={1.5}
                        />
                        <div className="flex flex-col leading-tight">
                            <span className="text-xs font-normal">
                                {row.getValue("Unit")}
                            </span>
                        </div>
                    </div>
                );
            },
        },

        {
            id: "Unit Cost",
            accessorKey: "unitCost",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Unit Cost" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex items-center space-x-2 truncate">
                        <Badge variant={"outline"} className="text-emerald-600">
                            <span className="font-light text-emerald-800">
                                S/.
                            </span>

                            <div className="flex flex-col leading-tight">
                                <span className="text-xs font-normal">
                                    {row.getValue("Unit Cost")}
                                </span>
                            </div>
                        </Badge>
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
                            <UpdateResourceSheet
                                open={showEditDialog}
                                onOpenChange={setShowEditDialog}
                                resource={row?.original}
                            />
                            <DeleteResourceDialog
                                open={showDeleteDialog}
                                onOpenChange={setShowDeleteDialog}
                                resource={[row?.original]}
                                showTrigger={false}
                                onSuccess={() => {
                                    row.toggleSelected(false);
                                }}
                            />
                            <ReactivateResourceDialog
                                open={showReactivateDialog}
                                onOpenChange={setShowReactivateDialog}
                                resource={[row?.original]}
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
