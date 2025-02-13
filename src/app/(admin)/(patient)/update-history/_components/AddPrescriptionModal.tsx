// AddPrescriptionModal.tsx
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface ServiceItem {
  nombre: string;
  descripcion: string;
  precio: number;
}

interface PrescriptionData {
  prescription: boolean;
  prescriptionTitle?: string;
  prescriptionDescription?: string;
  prescriptionItems: Array<{ nombre: string; dosis: string; frecuencia: string }>;
  services: ServiceItem[];
}

interface AddPrescriptionModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (data: PrescriptionData) => void;
  initialData?: PrescriptionData;
}

export function AddPrescriptionModal({
  isOpen,
  setIsOpen,
  onSave,
  initialData
}: AddPrescriptionModalProps) {
  const [formData, setFormData] = useState<PrescriptionData>(initialData || {
    prescription: false,
    prescriptionItems: [],
    services: []
  });

  const [newService, setNewService] = useState<ServiceItem>({
    nombre: '',
    descripcion: '',
    precio: 0
  });

  const handleAddService = () => {
    if (newService.nombre && newService.descripcion) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, newService]
      }));
      setNewService({ nombre: '', descripcion: '', precio: 0 });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Gestión de Receta Médica</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Título de la Receta</Label>
              <Input
                value={formData.prescriptionTitle || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  prescriptionTitle: e.target.value
                }))}
                required
              />
            </div>
            <div>
              <Label>Descripción General</Label>
              <Input
                value={formData.prescriptionDescription || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  prescriptionDescription: e.target.value
                }))}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Medicamentos</h3>
            {formData.prescriptionItems.map((item, index) => (
              <div key={index} className="grid grid-cols-4 gap-2 items-center">
                <Input
                  placeholder="Nombre"
                  value={item.nombre}
                  onChange={(e) => {
                    const newItems = [...formData.prescriptionItems];
                    newItems[index].nombre = e.target.value;
                    setFormData(prev => ({ ...prev, prescriptionItems: newItems }));
                  }}
                />
                <Input
                  placeholder="Dosis"
                  value={item.dosis}
                  onChange={(e) => {
                    const newItems = [...formData.prescriptionItems];
                    newItems[index].dosis = e.target.value;
                    setFormData(prev => ({ ...prev, prescriptionItems: newItems }));
                  }}
                />
                <Input
                  placeholder="Frecuencia"
                  value={item.frecuencia}
                  onChange={(e) => {
                    const newItems = [...formData.prescriptionItems];
                    newItems[index].frecuencia = e.target.value;
                    setFormData(prev => ({ ...prev, prescriptionItems: newItems }));
                  }}
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    prescriptionItems: prev.prescriptionItems.filter((_, i) => i !== index)
                  }))}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => setFormData(prev => ({
                ...prev,
                prescriptionItems: [...prev.prescriptionItems, { nombre: '', dosis: '', frecuencia: '' }]
              }))}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" /> Agregar Medicamento
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Servicios Adicionales</h3>
            <div className="grid grid-cols-3 gap-2">
              <Input
                placeholder="Nombre del servicio"
                value={newService.nombre}
                onChange={(e) => setNewService(prev => ({ ...prev, nombre: e.target.value }))}
              />
              <Input
                placeholder="Descripción"
                value={newService.descripcion}
                onChange={(e) => setNewService(prev => ({ ...prev, descripcion: e.target.value }))}
              />
              <Input
                type="number"
                placeholder="Precio"
                value={newService.precio}
                onChange={(e) => setNewService(prev => ({ ...prev, precio: Number(e.target.value) }))}
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
              <div key={index} className="border p-3 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-medium">{service.nombre}</p>
                  <p className="text-sm text-gray-600">{service.descripcion}</p>
                  <p className="text-sm">Precio: S/.{service.precio}</p>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    services: prev.services.filter((_, i) => i !== index)
                  }))}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar Receta</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}