import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import {
  CreatePrescriptionDto,
  Product,
  Service,
} from "../_interfaces/updateHistory.interface";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trash2,
  Pencil,
  Package,
  Stethoscope,
  Clock,
  FileText,
  ClipboardPenLine,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AddPrescriptionModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (data: CreatePrescriptionDto) => void;
  products: Product[];
  services: Service[];
  branchId: string;
  staffId: string;
  patientId: string;
}

export function AddPrescriptionModal({
  isOpen,
  setIsOpen,
  onSave,
  products,
  services,
  branchId,
  staffId,
  patientId,
}: AddPrescriptionModalProps) {
  // Estado para controlar si la receta está activa
  const [isPrescriptionActive, setIsPrescriptionActive] = useState(false);

  const [formData, setFormData] = useState<CreatePrescriptionDto>({
    updateHistoryId: "",
    branchId,
    staffId,
    patientId,
    registrationDate: new Date().toISOString().split("T")[0],
    prescriptionMedicaments: [],
    prescriptionServices: [],
    description: "",
  });

  // Estados para nuevos items
  const [newMedicament, setNewMedicament] = useState({
    productId: "",
    quantity: 1,
    description: "",
  });

  const [newService, setNewService] = useState({
    serviceId: "",
    quantity: 1,
    description: "",
  });

  // Manejadores para agregar items
  const handleAddMedicament = () => {
    if (newMedicament.productId) {
      const product = products.find((p) => p.id === newMedicament.productId);
      if (product) {
        setFormData((prev) => ({
          ...prev,
          prescriptionMedicaments: [
            ...(prev.prescriptionMedicaments ?? []),
            {
              id: product.id,
              name: product.name,
              quantity: newMedicament.quantity,
              description: newMedicament.description,
            },
          ],
        }));
        setNewMedicament({ productId: "", quantity: 1, description: "" });
      }
    }
  };

  const handleAddService = () => {
    if (newService.serviceId) {
      const service = services.find((s) => s.id === newService.serviceId);
      if (service) {
        setFormData((prev) => ({
          ...prev,
          prescriptionServices: [
            ...(prev.prescriptionServices ?? []),
            {
              id: service.id,
              name: service.name,
              quantity: newService.quantity,
              description: newService.description,
            },
          ],
        }));
        setNewService({ serviceId: "", quantity: 1, description: "" });
      }
    }
  };

  // Modificamos el handleSubmit para incluir el estado activo
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPrescriptionActive) {
      onSave(formData);
      // No limpiamos los datos aquí, se limpiarán cuando se guarde la historia médica
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-xl max-h-[85vh] flex flex-col border-t-4 border-t-primary p-0">
        {/* Header fijo */}
        <div className="px-6 py-4 border-b">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-2xl font-semibold">
                Nota Médica
              </DialogTitle>
            </div>
            {/* Switch control */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg mt-4">
              <div className="flex items-center gap-3">
                <ClipboardPenLine
                  className={`h-5 w-5 ${
                    isPrescriptionActive
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                />
                <span className="font-medium">Nota Médica</span>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={isPrescriptionActive}
                  onCheckedChange={setIsPrescriptionActive}
                />
                <Badge variant={isPrescriptionActive ? "default" : "secondary"}>
                  {isPrescriptionActive ? "Activado" : "Desactivado"}
                </Badge>
              </div>
            </div>
          </DialogHeader>
        </div>

        <ScrollArea className="max-h-[70vh] px-6 py-4 h-full overflow-auto">
          {/* Contenido scrolleable */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-1">
            {isPrescriptionActive && (
              <div className="space-y-6 pr-4">
                {/* Descripción general */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Pencil className="h-4 w-4 text-primary" />
                    Descripción General
                  </Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value, // Corregido: usar description en lugar de prescriptionDescription
                      }))
                    }
                    placeholder="Indicaciones generales..."
                    className="min-h-[100px]"
                  />
                </div>
                {/* Sección de Servicios */}
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <h3 className="font-semibold">Servicios</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <Select
                        value={newService.serviceId}
                        onValueChange={(value) =>
                          setNewService((prev) => ({
                            ...prev,
                            serviceId: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar servicio" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        placeholder="Cantidad"
                        value={newService.quantity}
                        onChange={(e) =>
                          setNewService((prev) => ({
                            ...prev,
                            quantity: parseInt(e.target.value),
                          }))
                        }
                        min={1}
                      />
                      <Input
                        placeholder="Descripción"
                        value={newService.description}
                        onChange={(e) =>
                          setNewService((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                      />
                      <Button
                        type="button"
                        onClick={handleAddService}
                        disabled={!newService.serviceId}
                      >
                        Agregar
                      </Button>
                    </div>

                    {/* Lista de servicios agregados */}
                    <div className="space-y-2">
                      {formData.prescriptionServices?.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 bg-muted/50 rounded-lg border"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Stethoscope className="h-4 w-4 text-primary" />
                              <p className="font-medium">{item.name}</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <p>Cantidad: {item.quantity}</p>
                            </div>
                            {item.description && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <FileText className="h-3 w-3" />
                                <p>{item.description}</p>
                              </div>
                            )}
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                prescriptionServices:
                                  prev.prescriptionServices?.filter(
                                    (_, i) => i !== index
                                  ),
                              }));
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                {/* Sección de Medicamentos */}
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <h3 className="font-semibold">Medicamentos</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <Select
                        value={newMedicament.productId}
                        onValueChange={(value) =>
                          setNewMedicament((prev) => ({
                            ...prev,
                            productId: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar medicamento" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        placeholder="Cantidad"
                        value={newMedicament.quantity}
                        onChange={(e) =>
                          setNewMedicament((prev) => ({
                            ...prev,
                            quantity: parseInt(e.target.value),
                          }))
                        }
                        min={1}
                      />
                      <Input
                        placeholder="Descripción"
                        value={newMedicament.description}
                        onChange={(e) =>
                          setNewMedicament((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                      />
                      <Button
                        type="button"
                        onClick={handleAddMedicament}
                        disabled={!newMedicament.productId}
                      >
                        Agregar
                      </Button>
                    </div>

                    {/* Lista de medicamentos agregados */}
                    <div className="space-y-2">
                      {formData.prescriptionMedicaments?.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 bg-muted/50 rounded-lg border"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-primary" />
                              <p className="font-medium">{item.name}</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <p>Cantidad: {item.quantity}</p>
                            </div>
                            {item.description && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <FileText className="h-3 w-3" />
                                <p>{item.description}</p>
                              </div>
                            )}
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                prescriptionMedicaments:
                                  prev.prescriptionMedicaments?.filter(
                                    (_, i) => i !== index
                                  ),
                              }));
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>{" "}
                {/* //fin */}
              </div>
            )}

            {/* Footer fijo */}
            <div className="border-t p-4 mt-auto bg-background">
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={!isPrescriptionActive}>
                  Guardar Receta
                </Button>
              </DialogFooter>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
