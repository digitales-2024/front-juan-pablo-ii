import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FormCreateUserProps {
  handleCreateUser: (event: React.FormEvent<HTMLFormElement>) => void
  dataRoles: { id: string; name: string }[]
}

export default function FormCreateUser({
  handleCreateUser,
  dataRoles,
}: FormCreateUserProps = {
  handleCreateUser: (e) => e.preventDefault(),
  dataRoles: [{ id: "1", name: "User" }],
}) {
  return (
    <form onSubmit={handleCreateUser} className="bg-white p-6 rounded-lg">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Nombre
          </Label>
          <Input
            id="name"
            name="name"
            required
            className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors duration-300"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors duration-300"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Celular
          </Label>
          <Input
            id="phone"
            name="phone"
            required
            className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors duration-300"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            Contraseña
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors duration-300"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role" className="text-sm font-medium text-gray-700">
            Rol
          </Label>
          <Select name="role" required>
            <SelectTrigger className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors duration-300">
              <SelectValue placeholder="Selecciona un rol" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              {dataRoles.map((rol) => (
                <SelectItem key={rol.id} value={rol.id} className="capitalize">
                  {rol.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-300 mt-6"
        >
          Guardar
        </Button>
      </div>
    </form>
  )
}