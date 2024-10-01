"use client";
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusIcon, UserIcon, DownloadIcon, Pencil, Trash2, LogOut } from "lucide-react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useLogout } from "@/hooks/use-logout";
import { useUsers } from "@/hooks/use-users";

// Tipos
type User = {
  id: number
  name: string
  email: string
  role: string
  active: boolean
}

type Role = {
  id: number
  name: string
  description: string
  active: boolean
}



// Datos de ejemplo
const initialUsers: User[] = [
  { id: 1, name: "Juan Pérez", email: "juan@ejemplo.com", role: "Admin", active: true },
  { id: 2, name: "María García", email: "maria@ejemplo.com", role: "Editor", active: false },
  { id: 3, name: "Carlos López", email: "carlos@ejemplo.com", role: "Viewer", active: true },
]

const initialRoles: Role[] = [
  { id: 1, name: "Admin", description: "Acceso completo al sistema", active: true },
  { id: 2, name: "Editor", description: "Puede editar contenido", active: true },
  { id: 3, name: "Viewer", description: "Solo puede ver contenido", active: false },
]

export default function Component() {
  const {data} = useUsers();
  
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [roles, setRoles] = useState<Role[]>(initialRoles)
  const [showRolesModal, setShowRolesModal] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showCreateUserDialog, setShowCreateUserDialog] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const handleToggleActive = (id: number, type: 'user' | 'role') => {
    if (type === 'user') {
      setUsers(users.map(user => 
        user.id === id ? { ...user, active: !user.active } : user
      ))
    } else {
      setRoles(roles.map(role => 
        role.id === id ? { ...role, active: !role.active } : role
      ))
    }
  }

  const {signOut} = useLogout();

  const handleEdit = (id: number, type: 'user' | 'role') => {
    console.log(`Editar ${type} con ID: ${id}`)
    // Implementar lógica de edición aquí
  }

  const handleDelete = (id: number, type: 'user' | 'role') => {
    if (type === 'user') {
      setUsers(users.filter(user => user.id !== id))
    } else {
      setRoles(roles.filter(role => role.id !== id))
    }
  }

  const handleCreateUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newUser: User = {
      id: users.length + 1,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as string,
      active: true
    }
    setUsers([...users, newUser])
    setShowCreateUserDialog(false)
  }

  const handleExport = () => {
    console.log("Exportando usuarios...")
    setShowExportDialog(false)
    // Implementar lógica de exportación real aquí
  }

  const handleLogout = () => {
    console.log("Cerrando sesión...")
    setShowLogoutDialog(false)
    signOut();
  }

  const userColumns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Nombre",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Rol",
    },
    {
      accessorKey: "active",
      header: "Activo",
      cell: ({ row }) => (
        <Switch
          checked={row.original.active}
          onCheckedChange={() => handleToggleActive(row.original.id, 'user')}
          className="data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-gray-400"
        />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            onClick={() => handleEdit(row.original.id, 'user')}
            size="sm"
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => handleDelete(row.original.id, 'user')}
            size="sm"
            className="bg-red-500 hover:bg-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

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
      accessorKey: "active",
      header: "Activo",
      cell: ({ row }) => (
        <Switch
          checked={row.original.active}
          onCheckedChange={() => handleToggleActive(row.original.id, 'role')}
          className="data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-gray-400"
        />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            onClick={() => handleEdit(row.original.id, 'role')}
            size="sm"
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => handleDelete(row.original.id, 'role')}
            size="sm"
            className="bg-red-500 hover:bg-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const userTable = useReactTable({
    data: users,
    columns: userColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  const roleTable = useReactTable({
    data: roles,
    columns: roleColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-8">
      <Card className="bg-black bg-opacity-50 text-white shadow-xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Gestión de Usuarios</CardTitle>
            <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700">
                  <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 text-white">
                <DialogHeader>
                  <DialogTitle>Confirmar Cierre de Sesión</DialogTitle>
                </DialogHeader>
                <p>¿Estás seguro de que quieres cerrar sesión?</p>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button onClick={() => setShowLogoutDialog(false)} className="bg-red-600 hover:bg-red-700" variant="outline">No</Button>
                  <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700">Sí</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex space-x-4 mt-4">
            <Dialog open={showCreateUserDialog} onOpenChange={setShowCreateUserDialog}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <PlusIcon className="mr-2 h-4 w-4" /> Crear Usuario
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 text-white">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nombre</Label>
                    <Input id="name" name="name" required className="bg-gray-700 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required className="bg-gray-700 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="role">Rol</Label>
                    <Select name="role" required>
                      <SelectTrigger className="bg-gray-700 text-white">
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 text-white">
                        {roles.map(role => (
                          <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">Crear Usuario</Button>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog open={showRolesModal} onOpenChange={setShowRolesModal}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <UserIcon className="mr-2 h-4 w-4" /> Ver Roles
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 text-white max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Gestión de Roles</DialogTitle>
                </DialogHeader>
                <Table>
                  <TableHeader>
                    {roleTable.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id} className="text-gray-300">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {roleTable.getRowModel().rows?.length ? (
                      roleTable.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={roleColumns.length} className="h-24 text-center">
                          No hay roles.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </DialogContent>
            </Dialog>
            <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
              <DialogTrigger asChild>
                <Button className="bg-yellow-600 hover:bg-yellow-700">
                  <DownloadIcon className="mr-2 h-4 w-4" /> Exportar
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 text-white">
                <DialogHeader>
                  <DialogTitle>Exportar Datos</DialogTitle>
                </DialogHeader>
                <p>Se va a descargar el reporte de usuarios.</p>
                <Button onClick={handleExport} className="bg-yellow-600 hover:bg-yellow-700 mt-4">OK</Button>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              {userTable.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-gray-300">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {userTable.getRowModel().rows?.length ? (
                userTable.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
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
        </CardContent>
      </Card>
    </div>
  )
}