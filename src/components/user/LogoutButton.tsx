'use client'


import { Button } from "@/components/ui/button"
import { useLogout } from '@/hooks/use-logout';
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const { signOut } = useLogout();
  const handleLogout = () => {
    console.log("Cerrando sesión...");
    signOut();
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-start text-sm px-4 py-2"
      onClick={handleLogout}
    >
      <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
    </Button>
  )
}