"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UserIcon, DownloadIcon } from "lucide-react"
import RolDataTable from "@/components/user/roles/RolDataTable"
import UserDataTable from "@/components/user/UserDataTable"
import { CreateUserDialog } from "@/components/user/CreateUserDialog"

export default function Component() {
  const [showRolesModal, setShowRolesModal] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)

  const handleExport = () => {
    console.log("Exportando usuarios...")
    setShowExportDialog(false)
  }

  return (
    <Card className="bg-white shadow-md w-full max-w-5xl mx-auto p-4">
      <CardHeader>
        <div className="flex flex-col items-center md:items-start">
          <CardTitle className="text-2xl font-bold text-gray-800 text-center md:text-left">
            Gestión de Usuarios y Roles
          </CardTitle>
        </div>
        <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
          <CreateUserDialog />
          <Dialog open={showRolesModal} onOpenChange={setShowRolesModal}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white w-full sm:w-auto max-w-xs">
                <UserIcon className="mr-2 h-4 w-4" /> Ver Roles
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white text-gray-800 max-w-4xl">
              <DialogHeader>
                <DialogTitle>Gestión de Roles</DialogTitle>
              </DialogHeader>
              <RolDataTable />
            </DialogContent>
          </Dialog>
          <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white w-full sm:w-auto max-w-xs">
                <DownloadIcon className="mr-2 h-4 w-4" /> Exportar
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white text-gray-800">
              <DialogHeader>
                <DialogTitle>Exportar Datos</DialogTitle>
              </DialogHeader>
              <p>Se va a descargar el reporte de usuarios.</p>
              <Button
                onClick={handleExport}
                className="bg-emerald-500 hover:bg-emerald-600 text-white mt-4"
              >
                OK
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="overflow-auto">
        <div className="min-w-[650px]">
          <UserDataTable />
        </div>
      </CardContent>
    </Card>
  )
}
