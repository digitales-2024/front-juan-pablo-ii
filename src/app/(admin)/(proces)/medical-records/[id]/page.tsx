"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  AlertTriangle,
  Plus,
  Printer,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DialogClose } from "@radix-ui/react-dialog";

interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  correo: string;
  direccion: string;
  foto: string;
}

interface PrescriptionItem {
  nombre: string;
  dosis: string;
  frecuencia: string;
}

interface Servicio {
  serviceId: string;
  staffId: string;
  branchId: string;
  prescription: boolean;
  prescriptionId?: string;
  prescriptionTitle?: string;
  prescriptionDescription?: string;
  prescriptionItems: PrescriptionItem[];
  description: string;
  medicalLeave: boolean;
  medicalLeaveStartDate?: string;
  medicalLeaveEndDate?: string;
  medicalLeaveDays?: number;
  leaveDescription?: string;
  newImages: string[];
}

interface HistorialItem {
  titulo: string;
  contenido: string;
}

export default function PacienteHistoria() {
  const { id } = useParams();
  const [paciente, _setPaciente] = useState<Paciente>({
    id: id as string,
    nombre: "Juan",
    apellido: "Pérez",
    dni: "12345678",
    telefono: "123-456-7890",
    correo: "juan@example.com",
    direccion: "Calle Principal 123",
    foto: "https://pub-c8a9c1f826c540b981f5cfb49c3a55ea.r2.dev/c39396cb-84bd-4f08-b56e-356107809ba9.png",
  });

  const [historialMedico, setHistorialMedico] = useState<HistorialItem[]>([
    { titulo: "Antecedentes", contenido: "No relevant history" },
    { titulo: "Alergias", contenido: "None known" },
    { titulo: "Enfermedades Crónicas", contenido: "Hypertension" },
    { titulo: "Cirugías Previas", contenido: "Appendectomy 2018" },
  ]);

  const [servicios, setServicios] = useState<Servicio[]>([
    {
      serviceId: "1",
      staffId: "DR001",
      branchId: "B001",
      prescription: true,
      prescriptionId: "RX001",
      prescriptionTitle: "Tratamiento para hipertensión",
      prescriptionDescription:
        "Medicación diaria para controlar la presión arterial",
      prescriptionItems: [
        { nombre: "Losartan", dosis: "50mg", frecuencia: "Una vez al día" },
        { nombre: "Amlodipino", dosis: "5mg", frecuencia: "Una vez al día" },
      ],
      description: "Consulta general",
      medicalLeave: false,
      newImages: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxbgoMzx7izKzehJBf1248szuAVwH8-F-crA&s",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-unksKExUrmuNTnD4pSfPAfPVrHVKOf9stg&s",
      ],
    },
  ]);

  const [nuevoServicio, setNuevoServicio] = useState<Servicio>({
    serviceId: "",
    staffId: "",
    branchId: "",
    prescription: false,
    prescriptionId: "",
    prescriptionTitle: "",
    prescriptionDescription: "",
    prescriptionItems: [],
    description: "",
    medicalLeave: false,
    medicalLeaveStartDate: "",
    medicalLeaveEndDate: "",
    medicalLeaveDays: 0,
    leaveDescription: "",
    newImages: [],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistorialModalOpen, setIsHistorialModalOpen] = useState(false);
  const [nuevoHistorial, setNuevoHistorial] = useState({
    titulo: "",
    contenido: "",
  });
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] =
    useState<Servicio | null>(null);

  const handleAddHistorialItem = () => {
    setHistorialMedico([...historialMedico, nuevoHistorial]);
    setNuevoHistorial({ titulo: "", contenido: "" });
    setIsHistorialModalOpen(false);
  };

  const handleAddServicio = (e: React.FormEvent) => {
    e.preventDefault();
    setServicios([...servicios, nuevoServicio]);
    setNuevoServicio({
      serviceId: "",
      staffId: "",
      branchId: "",
      prescription: false,
      prescriptionId: "",
      prescriptionTitle: "",
      prescriptionDescription: "",
      prescriptionItems: [],
      description: "",
      medicalLeave: false,
      medicalLeaveStartDate: "",
      medicalLeaveEndDate: "",
      medicalLeaveDays: 0,
      leaveDescription: "",
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

  const handlePrintPrescription = (prescription: Servicio) => {
    // Implementar la lógica de impresión aquí
    console.log("Imprimiendo receta:", prescription);
  };


  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Historia Médica</CardTitle>
          <Avatar className="w-32 h-32 mx-auto mt-4">
            <AvatarImage
              src={paciente.foto}
              alt={`${paciente.nombre} ${paciente.apellido}`}
            />
            <AvatarFallback>
              <User className="w-16 h-16" />
            </AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-gray-500" />
            <span>{`${paciente.nombre} ${paciente.apellido}`}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-gray-500" />
            <span>{paciente.dni}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="w-5 h-5 text-gray-500" />
            <span>{paciente.telefono}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-gray-500" />
            <span>{paciente.correo}</span>
          </div>
          <div className="flex items-center space-x-2 col-span-2 md:col-span-1">
            <MapPin className="w-5 h-5 text-gray-500" />
            <span>{paciente.direccion}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Historial Médico</CardTitle>
          <Button onClick={() => setIsHistorialModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Agregar Historial
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {historialMedico.map((item, index) => (
            <Card key={index} className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-lg">{item.titulo}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{item.contenido}</p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Dialog
        open={isHistorialModalOpen}
        onOpenChange={setIsHistorialModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Historial</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={nuevoHistorial.titulo}
                onChange={(e) =>
                  setNuevoHistorial({
                    ...nuevoHistorial,
                    titulo: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="contenido">Contenido</Label>
              <Textarea
                id="contenido"
                value={nuevoHistorial.contenido}
                onChange={(e) =>
                  setNuevoHistorial({
                    ...nuevoHistorial,
                    contenido: e.target.value,
                  })
                }
              />
            </div>
            <Button onClick={handleAddHistorialItem}>Agregar</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Servicios y Tratamientos</CardTitle>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Agregar Servicio
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] h-full">
              <ScrollArea className="max-h-[calc(100vh-6rem)]">
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Servicio</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={handleAddServicio}
                  className="space-y-4 min-h-[] p-3"
                >
                  <div className="h-full space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="serviceId">ID del Servicio</Label>
                        <Input
                          id="serviceId"
                          value={nuevoServicio.serviceId}
                          onChange={(e) =>
                            setNuevoServicio({
                              ...nuevoServicio,
                              serviceId: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="staffId">ID del Personal</Label>
                        <Input
                          id="staffId"
                          value={nuevoServicio.staffId}
                          onChange={(e) =>
                            setNuevoServicio({
                              ...nuevoServicio,
                              staffId: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="branchId">ID de la Sucursal</Label>
                        <Input
                          id="branchId"
                          value={nuevoServicio.branchId}
                          onChange={(e) =>
                            setNuevoServicio({
                              ...nuevoServicio,
                              branchId: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
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
                    </div>
                    {nuevoServicio.prescription && (
                      <div className="space-y-4">
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
                          {nuevoServicio.prescriptionItems.map(
                            (item, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-3 gap-2 mt-2"
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
                              </div>
                            )
                          )}
                          <Button
                            type="button"
                            onClick={handleAddPrescriptionItem}
                            className="mt-2"
                          >
                            <Plus className="w-4 h-4 mr-2" /> Agregar
                            Medicamento
                          </Button>
                        </div>
                      </div>
                    )}
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
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="medicalLeave"
                        checked={nuevoServicio.medicalLeave}
                        onCheckedChange={(checked) =>
                          setNuevoServicio({
                            ...nuevoServicio,
                            medicalLeave: checked,
                          })
                        }
                      />
                      <Label htmlFor="medicalLeave">Licencia Médica</Label>
                    </div>
                    {nuevoServicio.medicalLeave && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="medicalLeaveStartDate">
                            Fecha de Inicio
                          </Label>
                          <Input
                            id="medicalLeaveStartDate"
                            type="date"
                            value={nuevoServicio.medicalLeaveStartDate}
                            onChange={(e) =>
                              setNuevoServicio({
                                ...nuevoServicio,
                                medicalLeaveStartDate: e.target.value,
                              })
                            }
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
                            onChange={(e) =>
                              setNuevoServicio({
                                ...nuevoServicio,
                                medicalLeaveEndDate: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="medicalLeaveDays">
                            Días de Licencia
                          </Label>
                          <Input
                            id="medicalLeaveDays"
                            type="number"
                            value={nuevoServicio.medicalLeaveDays}
                            onChange={(e) =>
                              setNuevoServicio({
                                ...nuevoServicio,
                                medicalLeaveDays: Number.parseInt(
                                  e.target.value
                                ),
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="leaveDescription">
                            Descripción de la Licencia
                          </Label>
                          <Input
                            id="leaveDescription"
                            value={nuevoServicio.leaveDescription}
                            onChange={(e) =>
                              setNuevoServicio({
                                ...nuevoServicio,
                                leaveDescription: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    )}
                    <div>
                      <Label htmlFor="newImages">Nuevas Imágenes</Label>
                      {nuevoServicio.newImages.length > 0 && (
                        <div className="mt-2 mb-4">
                          <img
                            src={
                              nuevoServicio.newImages[0] || "/placeholder.svg"
                            }
                            alt="Imagen seleccionada"
                            className="w-full max-w-xs h-auto"
                          />
                        </div>
                      )}
                      <Input
                        id="newImages"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const imageUrl = URL.createObjectURL(file);
                            setNuevoServicio((prev) => ({
                              ...prev,
                              newImages: [imageUrl, ...prev.newImages],
                            }));
                          }
                        }}
                      />
                    </div>
                    {nuevoServicio.newImages.length > 0 && (
                      <div className="mt-4">
                        <Label htmlFor="additionalImages">
                          Imágenes Adicionales
                        </Label>
                        <Input
                          id="additionalImages"
                          type="file"
                          accept="image/*"
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
                    )}
                  </div>
                  <DialogFooter className="mt-4">
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Cancelar
                      </Button>
                    </DialogClose>
                    <Button type="submit">Guardar Servicio</Button>
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
                <CardTitle>Servicio {servicio.serviceId}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-gray-500" />
                    <span>
                      <strong>Personal:</strong> {servicio.staffId}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span>
                      <strong>Sucursal:</strong> {servicio.branchId}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-start space-x-2">
                    <FileText className="w-5 h-5 text-gray-500 mt-1" />
                    <span>
                      <strong>Descripción:</strong> {servicio.description}
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
                    <h4 className="font-semibold mb-2">Imágenes:</h4>
                    <div className="flex items-center justify-center">
                      <Carousel className="w-full max-w-xs">
                        <CarouselContent>
                          {servicio.newImages.map((image, imageIndex) => (
                            <CarouselItem key={imageIndex}>
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`Imagen ${imageIndex + 1}`}
                                className="w-full h-auto"
                              />
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
      </Card>

      <Dialog
        open={isPrescriptionModalOpen}
        onOpenChange={setIsPrescriptionModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Receta Médica</DialogTitle>
          </DialogHeader>
          {selectedPrescription && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">
                {selectedPrescription.prescriptionTitle}
              </h3>
              <p>{selectedPrescription.prescriptionDescription}</p>
              <div className="space-y-2">
                <h4 className="font-semibold">Medicamentos:</h4>
                {selectedPrescription.prescriptionItems.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.nombre}</span>
                    <span>{item.dosis}</span>
                    <span>{item.frecuencia}</span>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => handlePrintPrescription(selectedPrescription)}
              >
                <Printer className="w-4 h-4 mr-2" /> Imprimir Receta
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
