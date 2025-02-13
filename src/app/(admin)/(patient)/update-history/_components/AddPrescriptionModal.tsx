import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, FileText, Pill, Stethoscope, DollarSign, Trash2 } from "lucide-react"
import { useState } from "react"
import { Service, PrescriptionItem, PrescriptionData } from "../_interfaces/types"


interface AddPrescriptionModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  onSave: (data: PrescriptionData) => void
  initialData?: PrescriptionData
}

export function AddPrescriptionModal({ isOpen, setIsOpen, onSave, initialData }: AddPrescriptionModalProps) {
  const [formData, setFormData] = useState<PrescriptionData>(
    initialData ?? {
      prescription: false,
      prescriptionItems: [],
      services: [],
    },
  )

  const [newPrescriptionItem, setNewPrescriptionItem] = useState<PrescriptionItem>({
    nombre: "",
    dosis: "",
    frecuencia: "",
  })

  const [newService, setNewService] = useState<Service>({
    nombre: "",
    descripcion: "",
    precio: 0,
  })

  const handleAddPrescriptionItem = () => {
    if (newPrescriptionItem.nombre && newPrescriptionItem.dosis && newPrescriptionItem.frecuencia) {
      setFormData((prev) => ({
        ...prev,
        prescriptionItems: [...prev.prescriptionItems, newPrescriptionItem],
      }))
      setNewPrescriptionItem({ nombre: "", dosis: "", frecuencia: "" })
    }
  }

  const handleAddService = () => {
    if (newService.nombre && newService.descripcion) {
      setFormData((prev) => ({
        ...prev,
        services: [...prev.services, newService],
      }))
      setNewService({ nombre: "", descripcion: "", precio: 0 })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-xl border-t-4 border-t-primary">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Gestión de Receta Médica
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <ScrollArea className="max-h-[60vh] overflow-y-auto pr-4">
            <div className="space-y-6">
              <div className="space-y-4">
{/*                 <div>
                  <Label htmlFor="prescriptionTitle" className="text-base font-medium">
                    Título de la Receta
                  </Label>
                  <Input
                    id="prescriptionTitle"
                    value={formData.prescriptionTitle ?? ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        prescriptionTitle: e.target.value,
                      }))
                    }
                    required
                    className="mt-1"
                  />
                </div> */}
                <div>
                  <Label htmlFor="prescriptionDescription" className="text-base font-medium">
                    Descripción General e indicaciones
                  </Label>
                  <Textarea
                    id="prescriptionDescription"
                    value={formData.prescriptionDescription ?? ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        prescriptionDescription: e.target.value,
                      }))
                    }
                    
                    className="mt-1 min-h-[100px]"
                  />
                </div>
              </div>

              <Card>
                <CardContent className="p-4 space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-primary" />
                    Servicios Adicionales
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Input
                      placeholder="Nombre del servicio"
                      value={newService.nombre}
                      onChange={(e) => setNewService((prev) => ({ ...prev, nombre: e.target.value }))}
                    />
                    <Input
                      placeholder="Descripción"
                      value={newService.descripcion}
                      onChange={(e) => setNewService((prev) => ({ ...prev, descripcion: e.target.value }))}
                    />
                    <Input
                      type="number"
                      placeholder="Precio"
                      value={newService.precio}
                      onChange={(e) => setNewService((prev) => ({ ...prev, precio: Number(e.target.value) }))}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddService}
                    className="w-full"
                    disabled={!newService.nombre || !newService.descripcion}
                  >
                    <Plus className="w-4 h-4 mr-2" /> Agregar Servicio
                  </Button>
                  {formData.services.map((service, index) => (
                    <div key={index} className="flex justify-between items-center border p-3 rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium flex items-center gap-2">
                          <Stethoscope className="w-4 h-4 text-primary" />
                          {service.nombre}
                        </p>
                        <p className="text-sm text-muted-foreground">{service.descripcion}</p>
                        <p className="text-sm flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          Precio: S/.{service.precio}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            services: prev.services.filter((_, i) => i !== index),
                          }))
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Pill className="w-5 h-5 text-primary" />
                    Medicamentos
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <Input
                      placeholder="Nombre"
                      value={newPrescriptionItem.nombre}
                      onChange={(e) => setNewPrescriptionItem((prev) => ({ ...prev, nombre: e.target.value }))}
                    />
                    <Input
                      placeholder="Dosis"
                      value={newPrescriptionItem.dosis}
                      onChange={(e) => setNewPrescriptionItem((prev) => ({ ...prev, dosis: e.target.value }))}
                    />
                    <Input
                      placeholder="Frecuencia"
                      value={newPrescriptionItem.frecuencia}
                      onChange={(e) => setNewPrescriptionItem((prev) => ({ ...prev, frecuencia: e.target.value }))}
                    />
                    <Button
                      type="button"
                      onClick={handleAddPrescriptionItem}
                      className="w-full"
                      disabled={
                        !newPrescriptionItem.nombre || !newPrescriptionItem.dosis || !newPrescriptionItem.frecuencia
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" /> Agregar
                    </Button>
                  </div>
                  {formData.prescriptionItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-muted/50 p-3 rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{item.nombre}</p>
                        <p className="text-sm text-muted-foreground">Dosis: {item.dosis}</p>
                        <p className="text-sm text-muted-foreground">Frecuencia: {item.frecuencia}</p>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            prescriptionItems: prev.prescriptionItems.filter((_, i) => i !== index),
                          }))
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

            </div>
          </ScrollArea>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              Guardar Receta
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}