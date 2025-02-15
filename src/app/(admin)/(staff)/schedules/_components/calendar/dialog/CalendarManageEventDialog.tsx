"use client"

import type React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"
import { useCalendarContext } from "../CalendarContext"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, MapPin, CalendarDays, Clock, Pencil, Trash, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useEvents } from "../../../_hooks/useEvents"

const formSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    start: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid start date",
    }),
    end: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid end date",
    }),
    color: z.string(),
  })
  .refine(
    (data) => {
      try {
        const start = new Date(data.start)
        const end = new Date(data.end)
        return end >= start
      } catch {
        return false
      }
    },
    {
      message: "End time must be after start time",
      path: ["end"],
    },
  )

export default function CalendarManageEventDialog() {
  const { manageEventDialogOpen, setManageEventDialogOpen, selectedEvent, setSelectedEvent } = useCalendarContext()

  const { deleteMutation } = useEvents()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      start: "",
      end: "",
      color: "blue",
    },
  })

  useEffect(() => {
    if (selectedEvent) {
      form.reset({
        title: selectedEvent.title,
        start: format(selectedEvent.start, "yyyy-MM-dd'T'HH:mm"),
        end: format(selectedEvent.end, "yyyy-MM-dd'T'HH:mm"),
        color: selectedEvent.color,
      })
    }
  }, [selectedEvent, form])

  function handleClose() {
    setManageEventDialogOpen(false)
    setSelectedEvent(null)
    form.reset()
  }

  const handleDelete = () => {
    if (!selectedEvent) return

    deleteMutation.mutate(
      { ids: [selectedEvent.id] },
      {
        onSuccess: () => {
          handleClose()
        },
        onError: (error) => {
          toast.error(error.message)
        },
      },
    )
  }

  return (
    <Dialog open={manageEventDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CalendarDays className="h-6 w-6" />
            Detalles del evento
          </DialogTitle>
        </DialogHeader>

        <Card className="mt-4">
          <CardHeader className="border-b pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold">{selectedEvent?.title}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="capitalize">
                    {selectedEvent?.type.toLowerCase()}
                  </Badge>
                  <span>•</span>
                  <span>Creado: {format(selectedEvent?.createdAt ?? new Date(), "dd/MM/yyyy")}</span>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => console.log("Editar click")}
                  className="flex-1 sm:flex-none"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="flex-1 sm:flex-none"
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Trash className="h-4 w-4 mr-2" />
                  )}
                  {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EventDetailItem
                icon={<User className="h-4 w-4" />}
                label="Personal asignado"
                value={`${selectedEvent?.staff.name} ${selectedEvent?.staff.lastName}`}
                subValue={`ID: ${selectedEvent?.staffId}`}
              />
              <EventDetailItem
              icon={<MapPin className="h-4 w-4" />}
			  label="Ubicación"
			  value={selectedEvent?.branch?.name ?? 'Nombre no disponible'}
			  subValue={`ID: ${selectedEvent?.branchId ?? 'N/A'}`}
              />
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Inicio
                </Label>
                <div className="p-4 bg-accent rounded-lg">
                  <p className="font-medium">
                    {format(selectedEvent?.start ?? new Date(), "hh:mm a")}
                  </p>
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
                  <p className="font-medium">
                    {format(selectedEvent?.end ?? new Date(), "hh:mm a")}
                  </p>
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

