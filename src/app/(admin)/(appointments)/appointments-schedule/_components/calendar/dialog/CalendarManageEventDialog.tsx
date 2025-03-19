"use client"

import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"
import { useCalendarContext } from "../CalendarContext"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, MapPin, CalendarDays, Clock } from "lucide-react"
import { useStaff } from "@/app/(admin)/(staff)/staff/_hooks/useStaff"
import { useBranches } from "@/app/(admin)/branches/_hooks/useBranches"

export default function CalendarManageEventDialog() {
  const { manageEventDialogOpen, setManageEventDialogOpen, selectedEvent, setSelectedEvent } = useCalendarContext()
  const { staff } = useStaff()
  const { branches } = useBranches()

  function handleClose() {
    setManageEventDialogOpen(false)
    setSelectedEvent(null)
  }

  // Obtener datos completos del staff y sucursal
  const currentStaff = staff?.find(s => s.id === selectedEvent?.staffId)
  const currentBranch = branches?.find(b => b.id === selectedEvent?.branchId)

  return (
    <Dialog open={manageEventDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CalendarDays className="h-6 w-6" />
            Detalles
          </DialogTitle>
        </DialogHeader>

        <Card className="mt-4">
          <CardHeader className="border-b pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1 w-full">
                <CardTitle className="text-2xl font-bold">{selectedEvent?.title}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="capitalize">
                    {selectedEvent?.type.toLowerCase()}
                  </Badge>
                  <span>•</span>
                  <span>Agendado: {format(selectedEvent?.createdAt ?? new Date(), "dd/MM/yyyy")}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EventDetailItem
                icon={<User className="h-4 w-4" />}
                label="Personal asignado"
                value={`${currentStaff?.name} ${currentStaff?.lastName}`}
                subValue={`${currentStaff?.staffType.name.toUpperCase()}${currentStaff?.cmp ? ` • CMP: ${currentStaff.cmp}` : ''}`}
              />
              <EventDetailItem
                icon={<MapPin className="h-4 w-4" />}
                label="Ubicación"
                value={currentBranch?.name || "Nombre no disponible"}
                subValue={currentBranch?.address || "Dirección no disponible"}
              />
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Inicio
                </Label>
                <div className="p-4 bg-accent rounded-lg">
                  <p className="font-medium">{format(selectedEvent?.start ?? new Date(), "hh:mm a")}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(selectedEvent?.start ?? new Date(), "dd MMM yyyy")}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Fin
                </Label>
                <div className="p-4 bg-accent rounded-lg">
                  <p className="font-medium">{format(selectedEvent?.end ?? new Date(), "hh:mm a")}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(selectedEvent?.end ?? new Date(), "dd MMM yyyy")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

function EventDetailItem({
  icon,
  label,
  value,
  subValue,
}: { icon: React.ReactNode; label: string; value: string; subValue?: string }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium flex items-center gap-2">
        {icon}
        {label}
      </Label>
      <div className="p-4 bg-accent rounded-lg">
        <p className="font-medium capitalize">{value}</p>
        {subValue && <p className="text-sm text-muted-foreground mt-1">{subValue}</p>}
      </div>
    </div>
  )
}

