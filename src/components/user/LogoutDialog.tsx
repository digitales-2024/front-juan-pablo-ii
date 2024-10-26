"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { useLogout } from "@/hooks/use-logout";
import { useState } from "react";

export const LogoutDialog = () => {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { signOut } = useLogout();

  const handleLogout = () => {
    console.log("Cerrando sesión...");
    setShowLogoutDialog(false);
    signOut();
  };

  return (
    <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
      <DialogTrigger asChild>
        {/* Botón principal con colores del logo */}
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
        </Button>
      </DialogTrigger>
      {/* Contenido del diálogo con el esquema de colores actualizado */}
      <DialogContent className="bg-white text-blue-900 border-blue-600">
        <DialogHeader>
          <DialogTitle className="text-blue-800">Confirmar Cierre de Sesión</DialogTitle>
        </DialogHeader>
        <p>¿Estás seguro de que quieres cerrar sesión?</p>
        <div className="flex justify-end space-x-2 mt-4">
          {/* Botones del diálogo con esquema de colores azul y blanco */}
          <Button
            onClick={() => setShowLogoutDialog(false)}
            className="bg-white text-blue-600 border border-blue-600 hover:bg-blue-100"
            variant="outline"
          >
            No
          </Button>
          <Button
            onClick={handleLogout}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Sí
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
