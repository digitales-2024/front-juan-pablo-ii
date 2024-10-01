"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserIcon, DownloadIcon } from "lucide-react";
import RolDataTable from "@/components/user/roles/RolDataTable";
import UserDataTable from "@/components/user/UserDataTable";
import { CreateUserDialog } from "@/components/user/CreateUserDialog";
import { LogoutDialog } from "@/components/user/LogoutDialog";

export default function Component() {
  const [showRolesModal, setShowRolesModal] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  const handleExport = () => {
    console.log("Exportando usuarios...");
    setShowExportDialog(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-8">
      <Card className="bg-black bg-opacity-50 text-white shadow-xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">
              Gestión de Usuarios y Roles
            </CardTitle>
            <LogoutDialog /> {/* Agrega el componente LogoutDialog */}
          </div>
          <div className="flex space-x-4 mt-4">
            <CreateUserDialog /> {/* Agrega el componente CreateUserDialog */}
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
                <RolDataTable />
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
                <Button
                  onClick={handleExport}
                  className="bg-yellow-600 hover:bg-yellow-700 mt-4"
                >
                  OK
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <UserDataTable />
        </CardContent>
      </Card>
    </div>
  );
}
