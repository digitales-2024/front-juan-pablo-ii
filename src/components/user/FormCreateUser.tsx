// FormCreateUser.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormCreateUserProps {
  handleCreateUser: (event: React.FormEvent<HTMLFormElement>) => void;
  dataRoles: { id: string; name: string }[]; // Asume que dataRoles es una lista de roles
}

export default function FormCreateUser({
  handleCreateUser,
  dataRoles,
}: FormCreateUserProps) {
  return (
    <form onSubmit={handleCreateUser} className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          name="name"
          required
          className="bg-gray-700 text-white"
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          className="bg-gray-700 text-white"
        />
      </div>
      <div>
        <Label htmlFor="name">Celular</Label>
        <Input
          id="phone"
          name="phone"
          required
          className="bg-gray-700 text-white"
        />
      </div>
      <div>
        <Label htmlFor="name">Contraseña</Label>
        <Input
          id="mustChangePassword"
          name="mustChangePassword"
          required
          className="bg-gray-700 text-white"
        />
      </div>
      <div>
        <Label htmlFor="role">Rol</Label>
        <Select name="role" required>
          <SelectTrigger className="bg-gray-700 text-white">
            <SelectValue placeholder="Selecciona un rol" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 text-white">
            {dataRoles.map((rol) => (
              <SelectItem key={rol.id} value={rol.id} className="capitalize">
                {rol.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="bg-green-600 hover:bg-green-700">
        Crear Usuario
      </Button>
    </form>
  );
}
