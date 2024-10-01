"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import FormCreateUser from "./FormCreateUser";
import { useRol } from "@/hooks/use-rol";

export const CreateUserDialog = () => {
  const [showCreateUserDialog, setShowCreateUserDialog] = useState(false);
  const handleCreateUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Crear nuevo usuario");
  };
  const { dataRoles } = useRol();
  return (
    <>
      <Dialog
        open={showCreateUserDialog}
        onOpenChange={setShowCreateUserDialog}
      >
        <DialogTrigger asChild>
          <Button className="bg-green-600 hover:bg-green-700">
            <PlusIcon className="mr-2 h-4 w-4" /> Crear Usuario
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Usuario</DialogTitle>
          </DialogHeader>
          {/* Usamos el componente FormCreateUser y pasamos las props */}
          <FormCreateUser
            handleCreateUser={handleCreateUser}
            dataRoles={dataRoles || []}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
