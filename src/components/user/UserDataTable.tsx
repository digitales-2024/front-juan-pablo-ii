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
import { useUsers } from "@/hooks/use-users";
import { User } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function UserDataTable() {
  const { data } = useUsers();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (data) {
      const mappedUsers: User[] = data.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isActive: user.isActive,
        isSuperAdmin: user.isSuperAdmin,
        mustChangePassword: user.mustChangePassword,
        lastLogin: user.lastLogin,
        roles: user.roles.map((role) => ({
          id: role.id,
          name: role.name,
        })),
      }));
      setUsers(mappedUsers);
    }
  }, [data]);

  const userColumns: ColumnDef<User>[] = [
    { accessorKey: "name", header: "Nombre" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Teléfono" },
    {
      accessorKey: "roles",
      header: "Roles",
      cell: ({ row }) => (
        <div>
          {row.original.roles.map((role) => (
            <span key={role.id} className="mr-2">
              {role.name}
            </span>
          ))}
        </div>
      ),
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
            onClick={() => console.log(`Editar usuario: ${row.original.id}`)}
            size="sm"
            className="bg-blue-500 hover:bg-blue-600"
          >
            Editar
          </Button>
          <Button
            onClick={() => console.log(`Eliminar usuario: ${row.original.id}`)}
            size="sm"
            className="bg-red-500 hover:bg-red-600"
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  const userTable = useReactTable({
    data: users,
    columns: userColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <ScrollArea className="max-h-[70vh] overflow-auto">
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[600px]">
          <TableHeader>
            {userTable.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-black">
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
            {userTable.getRowModel().rows.length ? (
              userTable.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap px-2 py-1">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={userColumns.length} className="h-24 text-center">
                  No hay usuarios.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </ScrollArea>
  );
}