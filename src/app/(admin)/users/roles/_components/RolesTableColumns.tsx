import { useProfile } from "@/hooks/use-profile";
import { Role } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import {
    ChevronDown,
    ChevronUp,
    Ellipsis,
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

import { DeleteRolesDialog } from "./DeleteRolesDialog";
import { ReactivateRolesDialog } from "./ReactivateRolesDialog";
import { UpdateRoleSheet } from "./UpdateRoleSheet";

export const rolesTableColumns = (): ColumnDef<Role>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <div className="px-2">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
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
        size: 10,
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
            <div className="min-w-40 truncate capitalize">
                {row.getValue("nombre")}
            </div>
        ),
    },
    {
        id: "descripcion",
        accessorKey: "description",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Description" />
        ),
        cell: ({ row }) => (
            <div className="min-w-40 truncate lowercase">
                {row.getValue("descripcion")}
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
        id: "permisos",
        size: 10,
        accessorKey: "permissions",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Permisos" />
        ),
        cell: ({ row }) =>
            row.getCanExpand() ? (
                <Button
                    variant="ghost"
                    {...{
                        onClick: row.getToggleExpandedHandler(),
                    }}
                >
                    {row.getIsExpanded() ? <ChevronUp /> : <ChevronDown />}
                </Button>
            ) : null,
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

            const { user } = useProfile();

            return (
                <div>
                    <div>
                        <UpdateRoleSheet
                            open={showEditDialog}
                            onOpenChange={setShowEditDialog}
                            rol={row?.original}
                        />
                        <DeleteRolesDialog
                            open={showDeleteDialog}
                            onOpenChange={setShowDeleteDialog}
                            roles={[row?.original]}
                            showTrigger={false}
                            onSuccess={() => {
                                row.toggleSelected(false);
                            }}
                        />
                        <ReactivateRolesDialog
                            open={showReactivateDialog}
                            onOpenChange={setShowReactivateDialog}
                            roles={[row?.original]}
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
                            >
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user?.isSuperAdmin && (
                                <DropdownMenuItem
                                    onSelect={() =>
                                        setShowReactivateDialog(true)
                                    }
                                    disabled={row.original.isActive}
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
