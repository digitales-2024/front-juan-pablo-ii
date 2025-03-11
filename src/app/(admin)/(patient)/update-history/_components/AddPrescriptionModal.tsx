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
import { useState, useEffect } from "react";
import {
  CreatePrescriptionDto,
  Product,
  Service,
} from "../_interfaces/updateHistory.interface";

import {
  Trash2,
  Pencil,
  Package,
  Stethoscope,
  Clock,
  FileText,
  ClipboardPenLine,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
// Nuevas importaciones
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AddPrescriptionModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (data: CreatePrescriptionDto) => void;
  products: Product[];
  services: Service[];
  branchId: string;
  staffId: string;
  patientId: string;
  resetKey?: number; // Nueva prop para forzar el reinicio del componente
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
  resetKey = 0,
}: AddPrescriptionModalProps) {
  // Estado para controlar si la receta está activa
  const [isPrescriptionActive, setIsPrescriptionActive] = useState(false);

  // Filtrar solo productos con 'VENTA' en usoProducto
  const ventaProducts = products.filter(
    (product) => product?.uso?.includes("VENTA")
  );

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

  // Usar useEffect para reiniciar el formulario cuando cambie resetKey
  useEffect(() => {
    if (resetKey > 0) {
      setIsPrescriptionActive(false);
      setFormData({
        updateHistoryId: "",
        branchId,
        staffId,
        patientId,
        registrationDate: new Date().toISOString().split("T")[0],
        prescriptionMedicaments: [],
        prescriptionServices: [],
        description: "",
      });
      // También reiniciar los estados de nuevos items
      setNewMedicament({ productId: "", quantity: 1, description: "" });
      setNewService({ serviceId: "", quantity: 1, description: "" });
    }
  }, [resetKey, branchId, staffId, patientId]);

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
      const product = ventaProducts.find(
        (p) => p.id === newMedicament.productId
      );
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
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col border-t-4 border-t-primary p-0">
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
            {isPrescriptionActive ? (
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
                        description: e.target.value,
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
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="service-selector">Servicio</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="service-selector"
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "justify-between w-full",
                                !newService.serviceId && "text-muted-foreground"
                              )}
                            >
                              {newService.serviceId
                                ? services.find(
                                    (service) =>
                                      service.id === newService.serviceId
                                  )?.name
                                : "Seleccionar servicio"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-0 w-[300px]">
                            <Command>
                              <CommandInput placeholder="Buscar servicio..." />
                              <CommandEmpty>
                                No se encontraron servicios.
                              </CommandEmpty>
                              <CommandList>
                                <CommandGroup>
                                  {services.map((service) => (
                                    <CommandItem
                                      key={service.id}
                                      value={service.name}
                                      onSelect={() => {
                                        setNewService((prev) => ({
                                          ...prev,
                                          serviceId: service.id,
                                        }));
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          newService.serviceId === service.id
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {service.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="service-quantity">Cantidad</Label>
                          <Input
                            id="service-quantity"
                            type="number"
                            placeholder="Cantidad"
                            value={newService.quantity}
                            onChange={(e) =>
                              setNewService((prev) => ({
                                ...prev,
                                quantity: parseInt(e.target.value) || 1,
                              }))
                            }
                            min={1}
                          />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label htmlFor="service-description">
                            Descripción
                          </Label>
                          <div className="flex space-x-2">
                            <Input
                              id="service-description"
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
                        </div>
                      </div>
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
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="medicament-selector">Medicamento</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="medicament-selector"
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "justify-between w-full",
                                !newMedicament.productId &&
                                  "text-muted-foreground"
                              )}
                            >
                              {newMedicament.productId
                                ? ventaProducts.find(
                                    (product) =>
                                      product.id === newMedicament.productId
                                  )?.name
                                : "Seleccionar medicamento"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-0 w-[300px]">
                            <Command>
                              <CommandInput placeholder="Buscar medicamento..." />
                              <CommandEmpty>
                                No se encontraron medicamentos.
                              </CommandEmpty>
                              <CommandList>
                                <CommandGroup>
                                  {ventaProducts.map((product) => (
                                    <CommandItem
                                      key={product.id}
                                      value={product.name}
                                      onSelect={() => {
                                        setNewMedicament((prev) => ({
                                          ...prev,
                                          productId: product.id,
                                        }));
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          newMedicament.productId === product.id
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {product.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="medicament-quantity">Cantidad</Label>
                          <Input
                            id="medicament-quantity"
                            type="number"
                            placeholder="Cantidad"
                            value={newMedicament.quantity}
                            onChange={(e) =>
                              setNewMedicament((prev) => ({
                                ...prev,
                                quantity: parseInt(e.target.value) || 1,
                              }))
                            }
                            min={1}
                          />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label htmlFor="medicament-description">
                            Descripción
                          </Label>
                          <div className="flex space-x-2">
                            <Input
                              id="medicament-description"
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
                        </div>
                      </div>
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
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ClipboardPenLine className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Nota Médica Desactivada
                </h3>
                <p className="text-muted-foreground max-w-md">
                  Active el interruptor arriba para crear una nueva nota médica
                  con medicamentos y servicios.
                </p>
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
                  {isPrescriptionActive
                    ? "Guardar Receta"
                    : "Receta Desactivada"}
                </Button>
              </DialogFooter>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
