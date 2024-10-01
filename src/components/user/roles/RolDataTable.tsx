// RolDataTable.tsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRol } from "@/hooks/use-rol";
import { Role } from "@/types";

export default function RolDataTable() {
  const { dataRoles } = useRol();
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    if (dataRoles) {
      const mappedRoles: Role[] = dataRoles.map((role) => ({
        id: role.id,
        name: role.name,
        description: role.description,
        isActive: role.isActive,
        rolPermissions: role.rolPermissions.map((rolPermission) => ({
          id: rolPermission.id,
          module: {
            id: rolPermission.module.id,
            cod: rolPermission.module.cod,
            name: rolPermission.module.name,
            description: rolPermission.module.description,
          },
          permissions: rolPermission.permissions.map((permission) => ({
            id: permission.id,
            cod: permission.cod,
            name: permission.name,
            description: permission.description,
            idModulePermission: permission.idModulePermission,
          })),
        })),
      }));
      setRoles(mappedRoles);
    }
  }, [dataRoles]);

  const roleColumns: ColumnDef<Role>[] = [
    {
      accessorKey: "name",
      header: "Nombre",
    },
    {
      accessorKey: "description",
      header: "Descripción",
    },
    {
      accessorKey: "isActive",
      header: "Activo",
      cell: ({ row }) => <span>{row.original.isActive ? "Sí" : "No"}</span>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            onClick={() => console.log(`Editar rol: ${row.original.id}`)}
            size="sm"
            className="bg-blue-500 hover:bg-blue-600"
          >
            Editar
          </Button>
          <Button
            onClick={() => console.log(`Eliminar rol: ${row.original.id}`)}
            size="sm"
            className="bg-red-500 hover:bg-red-600"
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  const roleTable = useReactTable({
    data: roles,
    columns: roleColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {roleTable.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id} className="text-gray-300">
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {roleTable.getRowModel().rows.length ? (
          roleTable.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={roleColumns.length}
              className="h-24 text-center"
            >
              No hay roles.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
