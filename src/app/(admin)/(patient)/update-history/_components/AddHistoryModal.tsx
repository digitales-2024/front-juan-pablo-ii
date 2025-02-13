import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DialogClose } from "@radix-ui/react-dialog";
import { Image as ImageIcon, X } from "lucide-react";
import { SERVICIOS_OPCIONES, PERSONAL_MEDICO, SUCURSAL } from "../_interfaces/constants";
import type { Servicio } from "../_interfaces/types";
import { AddMedicalLeaveModal } from "./AddMedicalLeaveModal";
import { AddPrescriptionModal } from "./AddPrescriptionModal";

interface AddHistoryModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (servicio: Servicio) => void;
  initialData?: Servicio;
}

export function AddHistoryModal({
  isOpen,
  setIsOpen,
  onSave,
  initialData
}: AddHistoryModalProps) {
  const [nuevoServicio, setNuevoServicio] = useState<Servicio>(initialData || {
    serviceId: "",
    staffId: PERSONAL_MEDICO,
    branchId: SUCURSAL,
    prescription: false,
    prescriptionItems: [],
    description: "",
    medicalLeave: false,
    newImages: [],
  });

  // Estados para controlar los submodales
  const [showMedicalLeaveModal, setShowMedicalLeaveModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newImages = files.map(file => URL.createObjectURL(file));
      setNuevoServicio(prev => ({
        ...prev,
        newImages: [...prev.newImages, ...newImages]
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(nuevoServicio);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] h-full">
        <ScrollArea className="max-h-[calc(100vh-6rem)]">
          <DialogHeader>
            <DialogTitle>Agregar Historia Médica</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 p-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="serviceId">Servicio</Label>
                <select
                  id="serviceId"
                  value={nuevoServicio.serviceId}
                  onChange={(e) => setNuevoServicio(prev => ({ ...prev, serviceId: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Seleccione un servicio</option>
                  {SERVICIOS_OPCIONES.map(servicio => (
                    <option key={servicio} value={servicio}>{servicio}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="staffId">Personal</Label>
                <Input
                  id="staffId"
                  value={PERSONAL_MEDICO}
                  disabled
                  className="bg-gray-100"
                />
              </div>
              <div>
                <Label htmlFor="branchId">Sucursal</Label>
                <Input
                  id="branchId"
                  value={SUCURSAL}
                  disabled
                  className="bg-gray-100"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={nuevoServicio.description}
                onChange={(e) => setNuevoServicio(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label>Evidencia Fotográfica</Label>
              <div className="mt-2">
                <input
                  type="file"
                  id="images"
                  multiple
                  onChange={handleAddImage}
                  className="hidden"
                />
                <label
                  htmlFor="images"
                  className="inline-flex items-center justify-center px-4 py-2 border border-dashed rounded-md cursor-pointer hover:bg-gray-50"
                >
                  <ImageIcon className="w-5 h-5 mr-2" />
                  <span>Agregar Imágenes</span>
                </label>
              </div>
              
              {nuevoServicio.newImages.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {nuevoServicio.newImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Imagen ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setNuevoServicio(prev => ({
                          ...prev,
                          newImages: prev.newImages.filter((_, i) => i !== index)
                        }))}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowMedicalLeaveModal(true)}
              >
                Gestionar Descanso Médico
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPrescriptionModal(true)}
              >
                Gestionar Receta Médica
              </Button>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Guardar Historia</Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>

      {/* Submodales */}
      <AddMedicalLeaveModal
        isOpen={showMedicalLeaveModal}
        setIsOpen={setShowMedicalLeaveModal}
        onSave={(data) => {
          setNuevoServicio(prev => ({ ...prev, ...data }));
        }}
        initialData={{
          medicalLeave: nuevoServicio.medicalLeave,
          medicalLeaveStartDate: nuevoServicio.medicalLeaveStartDate,
          medicalLeaveEndDate: nuevoServicio.medicalLeaveEndDate,
          medicalLeaveDays: nuevoServicio.medicalLeaveDays,
          leaveDescription: nuevoServicio.leaveDescription,
        }}
      />

      <AddPrescriptionModal
        isOpen={showPrescriptionModal}
        setIsOpen={setShowPrescriptionModal}
        onSave={(data) => {
          setNuevoServicio(prev => ({
            ...prev,
            ...data,
            prescription: true
          }));
        }}
        initialData={{
          prescription: nuevoServicio.prescription,
          prescriptionTitle: nuevoServicio.prescriptionTitle,
          prescriptionDescription: nuevoServicio.prescriptionDescription,
          prescriptionItems: nuevoServicio.prescriptionItems,
          services: nuevoServicio.services || [],
        }}
      />
    </Dialog>
  );
}