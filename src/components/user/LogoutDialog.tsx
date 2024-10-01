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
          <Button
            onClick={() => setShowLogoutDialog(false)}
            className="bg-red-600 hover:bg-red-700"
            variant="outline"
          >
            No
          </Button>
          <Button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700"
          >
            Sí
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
