"use client"

import { useState } from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ClipboardPlus} from "lucide-react"

interface Paciente {
  id: string
  nombre: string
  apellido: string
  dni: string
  telefono: string
  cita: string
}

const columns: ColumnDef<Paciente>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "apellido",
    header: "Apellido",
  },
  {
    accessorKey: "dni",
    header: "DNI",
  },
  {
    accessorKey: "telefono",
    header: "Teléfono",
  },
  {
    accessorKey: "cita",
    header: "Cita / Consulta",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter()
      return (
        <Button onClick={() => router.push(`/medical-records/${row.original.id}`)} className="flex items-center gap-2">
        <ClipboardPlus className="h-4 w-4" />
        Inicar Cita / Consulta
      </Button>
        
      )
    },
  },
]

export function PacientesTable() {
  const [data] = useState<Paciente[]>([
    {
      id: "1",
      nombre: "Juan",
      apellido: "Pérez",
      dni: "12345678",
      telefono: "123-456-7890",
      cita: "6 feb 2025, 09:14",
    },
    {
      id: "2",
      nombre: "María",
      apellido: "González",
      dni: "87654321",
      telefono: "098-765-4321",
      cita: "10 feb 2025, 10:14",
    },
  ])
    //

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Anterior
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Siguiente
        </Button>
      </div>
    </div>
  )
}

