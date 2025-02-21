"use client"

import React from "react"
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
import { User, MapPin, CalendarDays, Clock, Pencil, Trash, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { useStaff } from "@/app/(admin)/(staff)/staff/_hooks/useStaff"
import { useBranches } from "@/app/(admin)/branches/_hooks/useBranches"
import { useEvents } from "@/app/(admin)/(staff)/schedules/_hooks/useEvents"

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
  const [isEditing, setIsEditing] = React.useState(false)

  const { deleteMutation, updateMutation } = useEvents()
  const { staff } = useStaff()
  const { branches } = useBranches()

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
    setIsEditing(false)
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedEvent) return

    try {
      await updateMutation.mutateAsync({
        id: selectedEvent.id,
        data: {
          title: values.title,
          start: values.start,
          end: values.end,
          color: values.color
        },
      })
      setIsEditing(false)
      handleClose()
    } catch (error) {
      toast.error("Error al actualizar el evento")
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    form.reset({
      title: selectedEvent?.title,
      start: format(selectedEvent?.start ?? new Date(), "yyyy-MM-dd'T'HH:mm"),
      end: format(selectedEvent?.end ?? new Date(), "yyyy-MM-dd'T'HH:mm"),
      color: selectedEvent?.color,
    })
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
                {isEditing ? (
                  <Input
                    {...form.register("title")}
                    className="text-2xl font-bold"
                    defaultValue={selectedEvent?.title}
                  />
                ) : (
                  <CardTitle className="text-2xl font-bold">{selectedEvent?.title}</CardTitle>
                )}
                {form.formState.errors.title && (
                  <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="capitalize">
                    {selectedEvent?.type.toLowerCase()}
                  </Badge>
                  <span>•</span>
                  <span>Creado: {format(selectedEvent?.createdAt ?? new Date(), "dd/MM/yyyy")}</span>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                {isEditing ? (
                  <>
                    <Button variant="outline" size="sm" onClick={handleCancel} className="flex-1 sm:flex-none">
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      onClick={form.handleSubmit(onSubmit)}
                      disabled={updateMutation.isPending}
                      className="flex-1 sm:flex-none"
                    >
                      {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Guardar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
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
                  </>
                )}
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
                  {isEditing ? (
                    <Input type="datetime-local" {...form.register("start")} className="font-medium" />
                  ) : (
                    <>
                      <p className="font-medium">{format(selectedEvent?.start ?? new Date(), "hh:mm a")}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(selectedEvent?.start ?? new Date(), "dd MMM yyyy")}
                      </p>
                    </>
                  )}
                </div>
                {form.formState.errors.start && (
                  <p className="text-sm text-red-500">{form.formState.errors.start.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Fin
                </Label>
                <div className="p-4 bg-accent rounded-lg">
                  {isEditing ? (
                    <Input type="datetime-local" {...form.register("end")} className="font-medium" />
                  ) : (
                    <>
                      <p className="font-medium">{format(selectedEvent?.end ?? new Date(), "hh:mm a")}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(selectedEvent?.end ?? new Date(), "dd MMM yyyy")}
                      </p>
                    </>
                  )}
                </div>
                {form.formState.errors.end && (
                  <p className="text-sm text-red-500">{form.formState.errors.end.message}</p>
                )}
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

