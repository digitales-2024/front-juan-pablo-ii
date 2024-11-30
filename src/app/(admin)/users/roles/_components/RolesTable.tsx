"use client";

import { Module, Permission, Role } from "@/types";
import { extractUniquePermissions } from "@/utils/extractUniquePermissions";
import { useMemo } from "react";

import { DataTableExpanded } from "@/components/data-table/DataTableExpanded";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { rolesTableColumns } from "./RolesTableColumns";
import { RolesTableToolbarActions } from "./RolesTableToolbarActions";

export const RolesTable = ({ data }: { data: Role[] }) => {
    const columns = useMemo(() => rolesTableColumns(), []);

    return (
        <DataTableExpanded
            data={data}
            columns={columns}
            getSubRows={(row) => row.rolPermissions as unknown as Role[]}
            toolbarActions={<RolesTableToolbarActions />}
            placeholder="Buscar roles..."
            renderExpandedRow={(row) => <RolePermissions row={row} />}
        />
    );
};

const RolePermissions = ({ row }: { row: Role }) => {
    const uniquePermissions = extractUniquePermissions(row);
    const { rolPermissions } = row;
    return (
        <div className="p-4">
            <h5 className="mb-4 text-lg font-bold">
                Permisos del Rol: <span className="capitalize">{row.name}</span>
            </h5>
            <Table>
                <TableCaption>Todos los permisos de este rol</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="uppercase">Módulo</TableHead>
                        {uniquePermissions?.map((permission) => (
                            <TableHead
                                key={permission.id}
                                className="uppercase"
                            >
                                {permission.name}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rolPermissions?.map(
                        ({
                            module,
                            permissions,
                        }: {
                            module: Module;
                            permissions: Permission[];
                        }) => (
                            <TableRow key={module.id}>
                                <TableCell className="font-medium uppercase">
                                    {module.name}
                                </TableCell>
                                {uniquePermissions?.map(
                                    (permission: Permission) => (
                                        <TableCell key={permission.cod}>
                                            {permissions?.some(
                                                (perm) =>
                                                    perm.cod === permission.cod,
                                            ) ? (
                                                <Badge
                                                    variant="default"
                                                    className="bg-green-500 hover:bg-green-600"
                                                >
                                                    ✓
                                                </Badge>
                                            ) : (
                                                <Badge
                                                    variant="outline"
                                                    className="text-gray-400"
                                                >
                                                    -
                                                </Badge>
                                            )}
                                        </TableCell>
                                    ),
                                )}
                            </TableRow>
                        ),
                    )}
                </TableBody>
            </Table>
        </div>
    );
};
