// AddMedicalLeaveModal.tsx
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface MedicalLeaveData {
  medicalLeave: boolean;
  medicalLeaveStartDate?: string;
  medicalLeaveEndDate?: string;
  medicalLeaveDays?: number;
  leaveDescription?: string;
}

interface AddMedicalLeaveModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (data: MedicalLeaveData) => void;
  initialData?: MedicalLeaveData;
}

export function AddMedicalLeaveModal({ 
  isOpen, 
  setIsOpen,
  onSave,
  initialData
}: AddMedicalLeaveModalProps) {
  const [formData, setFormData] = useState<MedicalLeaveData>(initialData || {
    medicalLeave: false,
    medicalLeaveDays: 0,
  });

  const calculateDays = (start: string, end: string) => {
    return Math.ceil(
      (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Gestión de Descanso Médico</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.medicalLeave}
              onCheckedChange={(checked) => setFormData(prev => ({
                ...prev,
                medicalLeave: checked
              }))}
            />
            <Label>Activar Descanso Médico</Label>
          </div>

          {formData.medicalLeave && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Fecha Inicio</Label>
                  <Input
                    type="date"
                    value={formData.medicalLeaveStartDate || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      medicalLeaveStartDate: e.target.value,
                      medicalLeaveDays: prev.medicalLeaveEndDate 
                        ? calculateDays(e.target.value, prev.medicalLeaveEndDate)
                        : prev.medicalLeaveDays
                    }))}
                    required
                  />
                </div>
                <div>
                  <Label>Fecha Fin</Label>
                  <Input
                    type="date"
                    value={formData.medicalLeaveEndDate || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      medicalLeaveEndDate: e.target.value,
                      medicalLeaveDays: prev.medicalLeaveStartDate 
                        ? calculateDays(prev.medicalLeaveStartDate, e.target.value)
                        : prev.medicalLeaveDays
                    }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Días de Descanso</Label>
                <Input
                  type="number"
                  value={formData.medicalLeaveDays || 0}
                  disabled
                  className="bg-gray-100"
                />
              </div>

              <div>
                <Label>Descripción</Label>
                <textarea
                  className="w-full p-2 border rounded-md min-h-[100px]"
                  value={formData.leaveDescription || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    leaveDescription: e.target.value
                  }))}
                  required
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}