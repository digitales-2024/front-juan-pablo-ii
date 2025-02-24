

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, FileText, X, AlertTriangle, CheckCircle2 } from "lucide-react"
import { useState } from "react"

interface MedicalLeaveData {
  medicalLeave: boolean
  medicalLeaveStartDate?: string
  medicalLeaveEndDate?: string
  medicalLeaveDays?: number
  leaveDescription?: string
}

interface AddMedicalLeaveModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  onSave: (data: MedicalLeaveData) => void
  initialData?: MedicalLeaveData
}

export function AddMedicalLeaveModal({ isOpen, setIsOpen, onSave, initialData }: AddMedicalLeaveModalProps) {
  const [formData, setFormData] = useState<MedicalLeaveData>(
    initialData ?? {
      medicalLeave: false,
      medicalLeaveDays: 0,
    },
  )

  const calculateDays = (start: string, end: string) => {
    return Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)) + 1
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-xl border-t-4 border-t-primary">
        <DialogHeader className="space-y-4">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-semibold">Gestión de Descanso Médico</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle
                className={`h-5 w-5 ${formData.medicalLeave ? "text-primary" : "text-muted-foreground"}`}
              />
              <span className="font-medium">Descanso Médico</span>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.medicalLeave}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    medicalLeave: checked,
                  }))
                }
              />
              <Badge variant={formData.medicalLeave ? "default" : "secondary"}>
                {formData.medicalLeave ? "Activado" : "Desactivado"}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {formData.medicalLeave && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      Fecha Inicio
                    </Label>
                    <Input
                      type="date"
                      value={formData.medicalLeaveStartDate ?? ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          medicalLeaveStartDate: e.target.value,
                          medicalLeaveDays: prev.medicalLeaveEndDate
                            ? calculateDays(e.target.value, prev.medicalLeaveEndDate)
                            : prev.medicalLeaveDays,
                        }))
                      }
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      Fecha Fin
                    </Label>
                    <Input
                      type="date"
                      value={formData.medicalLeaveEndDate ?? ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          medicalLeaveEndDate: e.target.value,
                          medicalLeaveDays: prev.medicalLeaveStartDate
                            ? calculateDays(prev.medicalLeaveStartDate, e.target.value)
                            : prev.medicalLeaveDays,
                        }))
                      }
                      required
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Días de Descanso
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={formData.medicalLeaveDays ?? 0}
                      disabled
                      className="bg-muted/50 font-medium"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">días</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Descripción del Descanso Médico
                  </Label>
                  <Textarea
                    value={formData.leaveDescription ?? ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        leaveDescription: e.target.value,
                      }))
                    }
                    placeholder="Ingrese los detalles del descanso médico..."
                    className="min-h-[120px]"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button type="submit" className="w-full sm:w-auto gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Guardar Descanso Médico
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

