import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DialogClose } from "@radix-ui/react-dialog";
import { Plus, X, User, MapPin, FileText, Calendar, AlertTriangle } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { SERVICIOS_OPCIONES, PERSONAL_MEDICO, SUCURSAL } from "../constants";
import type { PrescriptionItem, Servicio } from "../types";

interface MedicalHistoryProps {
  servicios: Servicio[];
  setServicios: (servicios: Servicio[]) => void;
  setSelectedPrescription: (prescription: Servicio | null) => void;
  setIsPrescriptionModalOpen: (isOpen: boolean) => void;
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
}

export function MedicalHistory({
  servicios,
  setServicios,
  setSelectedPrescription,
  setIsPrescriptionModalOpen,
  selectedImage,
  setSelectedImage,
}: MedicalHistoryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevoServicio, setNuevoServicio] = useState<Servicio>({
    serviceId: "",
    staffId: PERSONAL_MEDICO,
    branchId: SUCURSAL,
    prescription: false,
    prescriptionItems: [],
    description: "",
    medicalLeave: false,
    newImages: [],
  });

  const handleAddServicio = (e: React.FormEvent) => {
    e.preventDefault();
    setServicios([...servicios, nuevoServicio]);
    setNuevoServicio({
      serviceId: "",
      staffId: PERSONAL_MEDICO,
      branchId: SUCURSAL,
      prescription: false,
      prescriptionItems: [],
      description: "",
      medicalLeave: false,
      newImages: [],
    });
    setIsModalOpen(false);
  };

  const handleAddPrescriptionItem = () => {
    setNuevoServicio({
      ...nuevoServicio,
      prescriptionItems: [
        ...nuevoServicio.prescriptionItems,
        { nombre: "", dosis: "", frecuencia: "" },
      ],
    });
  };

  const handlePrescriptionItemChange = (
    index: number,
    field: keyof PrescriptionItem,
    value: string
  ) => {
    const updatedItems = nuevoServicio.prescriptionItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setNuevoServicio({ ...nuevoServicio, prescriptionItems: updatedItems });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Historial Medico de Consultas, Servicios y Tratamientos</CardTitle>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Agregar Historia
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] h-full">
            <ScrollArea className="max-h-[calc(100vh-6rem)]">
              <DialogHeader>
                <DialogTitle>Agregar Historia Médica</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddServicio} className="space-y-4 min-h-[] p-3">
                <div className="h-full space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="serviceId">Servicio</Label>
                      <select
                        id="serviceId"
                        value={nuevoServicio.serviceId}
                        onChange={(e) =>
                          setNuevoServicio({
                            ...nuevoServicio,
                            serviceId: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded-md"
                        required
                      >
                        <option value="">Seleccione un servicio</option>
                        {SERVICIOS_OPCIONES.map((servicio) => (
                          <option key={servicio} value={servicio}>
                            {servicio}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="staffId">Personal</Label>
                      <Input
                        id="staffId"
                        value={PERSONAL_MEDICO}
                        disabled
                        className="bg-gray-100 text-gray-900 font-medium"
                      />
                    </div>
                    <div>
                      <Label htmlFor="branchId">Sucursal</Label>
                      <Input
                        id="branchId"
                        value={SUCURSAL}
                        disabled
                        className="bg-gray-100 text-gray-900 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={nuevoServicio.description}
                      onChange={(e) =>
                        setNuevoServicio({
                          ...nuevoServicio,
                          description: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  {/* Sección de Descanso Médico */}
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="medicalLeave"
                      checked={nuevoServicio.medicalLeave}
                      onCheckedChange={(checked) =>
                        setNuevoServicio({
                          ...nuevoServicio,
                          medicalLeave: checked,
                          medicalLeaveDays: 0,
                          medicalLeaveStartDate: "",
                          medicalLeaveEndDate: "",
                        })
                      }
                    />
                    <Label htmlFor="medicalLeave">Descanso Médico</Label>
                  </div>

                  {nuevoServicio.medicalLeave && (
                    <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
                      <h3 className="font-semibold text-lg mb-2">
                        Detalles del Descanso Médico
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="medicalLeaveStartDate">
                            Fecha de Inicio
                          </Label>
                          <Input
                            id="medicalLeaveStartDate"
                            type="date"
                            value={nuevoServicio.medicalLeaveStartDate}
                            onChange={(e) => {
                              const startDate = e.target.value;
                              const endDate = nuevoServicio.medicalLeaveEndDate;
                              setNuevoServicio({
                                ...nuevoServicio,
                                medicalLeaveStartDate: startDate,
                                medicalLeaveDays: endDate
                                  ? Math.ceil(
                                      (new Date(endDate).getTime() -
                                        new Date(startDate).getTime()) /
                                        (1000 * 60 * 60 * 24)
                                    ) + 1
                                  : 0,
                              });
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor="medicalLeaveEndDate">
                            Fecha de Fin
                          </Label>
                          <Input
                            id="medicalLeaveEndDate"
                            type="date"
                            value={nuevoServicio.medicalLeaveEndDate}
                            onChange={(e) => {
                              const endDate = e.target.value;
                              const startDate = nuevoServicio.medicalLeaveStartDate;
                              setNuevoServicio({
                                ...nuevoServicio,
                                medicalLeaveEndDate: endDate,
                                medicalLeaveDays: startDate
                                  ? Math.ceil(
                                      (new Date(endDate).getTime() -
                                        new Date(startDate).getTime()) /
                                        (1000 * 60 * 60 * 24)
                                    ) + 1
                                  : 0,
                              });
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor="medicalLeaveDays">
                            Días de Descanso
                          </Label>
                          <Input
                            id="medicalLeaveDays"
                            type="number"
                            value={nuevoServicio.medicalLeaveDays}
                            disabled
                            className="bg-gray-100 text-gray-900 font-medium"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Label htmlFor="leaveDescription">
                          Descripción del Descanso Médico
                        </Label>
                        <Textarea
                          id="leaveDescription"
                          value={nuevoServicio.leaveDescription}
                          onChange={(e) =>
                            setNuevoServicio({
                              ...nuevoServicio,
                              leaveDescription: e.target.value,
                            })
                          }
                          className="min-h-[120px]"
                          placeholder="Ingrese la descripción detallada del descanso médico..."
                        />
                      </div>
                    </div>
                  )}

                  {/* Sección de Imágenes */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Label
                        htmlFor="newImages"
                        className="flex items-center cursor-pointer hover:text-blue-500"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Agregar Imágenes
                      </Label>
                      <Input
                        id="newImages"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const imageUrl = URL.createObjectURL(file);
                            setNuevoServicio((prev) => ({
                              ...prev,
                              newImages: [...prev.newImages, imageUrl],
                            }));
                          }
                        }}
                      />
                    </div>

                    {nuevoServicio.newImages.length > 0 && (
                      <div>
                        <Label className="block mb-2">
                          Imágenes Seleccionadas:
                        </Label>
                        <div className="grid grid-cols-3 gap-4">
                          {nuevoServicio.newImages.map((imageUrl, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={imageUrl}
                                alt={`Imagen ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                              />
                              <button
                                onClick={() => {
                                  setNuevoServicio((prev) => ({
                                    ...prev,
                                    newImages: prev.newImages.filter(
                                      (_, i) => i !== index
                                    ),
                                  }));
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 
                                           opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sección de Receta Médica */}
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="prescription"
                      checked={nuevoServicio.prescription}
                      onCheckedChange={(checked) =>
                        setNuevoServicio({
                          ...nuevoServicio,
                          prescription: checked,
                        })
                      }
                    />
                    <Label htmlFor="prescription">Receta Médica</Label>
                  </div>

                  {nuevoServicio.prescription && (
                    <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
                      <h3 className="font-semibold text-lg mb-2">
                        Detalles de Receta Médica
                      </h3>
                      <div>
                        <Label htmlFor="prescriptionTitle">
                          Título de la Receta
                        </Label>
                        <Input
                          id="prescriptionTitle"
                          value={nuevoServicio.prescriptionTitle}
                          onChange={(e) =>
                            setNuevoServicio({
                              ...nuevoServicio,
                              prescriptionTitle: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="prescriptionDescription">
                          Descripción de la Receta
                        </Label>
                        <Textarea
                          id="prescriptionDescription"
                          value={nuevoServicio.prescriptionDescription}
                          onChange={(e) =>
                            setNuevoServicio({
                              ...nuevoServicio,
                              prescriptionDescription: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Medicamentos</Label>
                        <div className="space-y-2">
                          {nuevoServicio.prescriptionItems.map((item, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-3 gap-2 relative group"
                            >
                              <Input
                                placeholder="Nombre"
                                value={item.nombre}
                                onChange={(e) =>
                                  handlePrescriptionItemChange(
                                    index,
                                    "nombre",
                                    e.target.value
                                  )
                                }
                              />
                              <Input
                                placeholder="Dosis"
                                value={item.dosis}
                                onChange={(e) =>
                                  handlePrescriptionItemChange(
                                    index,
                                    "dosis",
                                    e.target.value
                                  )
                                }
                              />
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Frecuencia"
                                  value={item.frecuencia}
                                  onChange={(e) =>
                                    handlePrescriptionItemChange(
                                      index,
                                      "frecuencia",
                                      e.target.value
                                    )
                                  }
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => {
                                    const updatedItems =
                                      nuevoServicio.prescriptionItems.filter(
                                        (_, i) => i !== index
                                      );
                                    setNuevoServicio({
                                      ...nuevoServicio,
                                      prescriptionItems: updatedItems,
                                    });
                                  }}
                                  className="h-10 w-10"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="sticky bottom-0 bg-gray-50 pt-2">
                          <Button
                            type="button"
                            onClick={handleAddPrescriptionItem}
                            className="w-full"
                          >
                            <Plus className="w-4 h-4 mr-2" /> Agregar Medicamento
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter className="mt-4">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button type="submit">Registrar Historia</Button>
                </DialogFooter>
              </form>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        {servicios.map((servicio, index) => (
          <Card key={index} className="mb-4">
            <CardHeader>
              <CardTitle>Servicio/ Consulta {servicio.serviceId}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <span>
                    <strong>Medico:</strong> {servicio.staffId}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span>
                    <strong>Sucursal de Atencion:</strong> {servicio.branchId}
                  </span>
                </div>
                <div className="col-span-2 flex items-start space-x-2">
                  <FileText className="w-5 h-5 text-gray-500 mt-1" />
                  <span>
                    <strong>Descripción de la Consulta/ Servicio:</strong>
                    <div className="mt-2 p-2 bg-gray-100 border border-gray-300 rounded">
                      {servicio.description}
                    </div>
                  </span>
                </div>
              </div>

              {servicio.prescription && (
                <div className="mt-4">
                  <Button
                    onClick={() => {
                      setSelectedPrescription(servicio);
                      setIsPrescriptionModalOpen(true);
                    }}
                  >
                    <FileText className="w-4 h-4 mr-2" /> Ver Receta Médica
                  </Button>
                </div>
              )}

              {servicio.medicalLeave && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <span>
                      <strong>Inicio de Licencia:</strong>{" "}
                      {servicio.medicalLeaveStartDate}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <span>
                      <strong>Fin de Licencia:</strong>{" "}
                      {servicio.medicalLeaveEndDate}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-gray-500" />
                    <span>
                      <strong>Días de Licencia:</strong>{" "}
                      {servicio.medicalLeaveDays}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-start space-x-2">
                    <FileText className="w-5 h-5 text-gray-500 mt-1" />
                    <span>
                      <strong>Descripción de la Licencia:</strong>{" "}
                      {servicio.leaveDescription}
                    </span>
                  </div>
                </div>
              )}

              {servicio.newImages && servicio.newImages.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">
                    Evidencia medica Fotografica:
                  </h4>
                  <div className="flex items-center justify-center">
                    <Carousel className="w-full max-w-5xl">
                      <CarouselContent className="-ml-1">
                        {servicio.newImages.map((image, imageIndex) => (
                          <CarouselItem
                            key={imageIndex}
                            className="pl-1 basis-1/3"
                          >
                            <div className="p-1">
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`Imagen ${imageIndex + 1}`}
                                className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => setSelectedImage(image)}
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </CardContent>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Vista Detallada</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Vista detallada"
              className="w-full object-contain max-h-[70vh] rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}