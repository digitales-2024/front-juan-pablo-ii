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
  X,
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

const SERVICIOS_OPCIONES = [
  "Tratamiento Dermatológico",
  "Consulta General",
  "Tratamiento Dental",
];

const PERSONAL_MEDICO = "Alex Flores Valdez DR001";
const SUCURSAL = "Sede Central";

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
      serviceId: ": Tratamiento Dermatologico",
      staffId: "Alex Flores Valdez DR001",
      branchId: "Sede Central",
      prescription: true,
      prescriptionId: "RX001",
      prescriptionTitle: "Tratamiento para hipertensión",
      prescriptionDescription:
        "Medicación diaria para controlar la presión arterial",
      prescriptionItems: [
        { nombre: "Losartan", dosis: "50mg", frecuencia: "Una vez al día" },
        { nombre: "Amlodipino", dosis: "5mg", frecuencia: "Una vez al día" },
      ],
      description: "el pacciente presenta una erupcion en la piel en la zona de la espalda y cuello se le receta un tratamiento dermatologico para tratar la erupcion en la piel en la zona de la espalda y cuello  ", 
      medicalLeave: false,
      newImages: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxbgoMzx7izKzehJBf1248szuAVwH8-F-crA&s",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-unksKExUrmuNTnD4pSfPAfPVrHVKOf9stg&s",
      ],
    },
  ]);

  const [nuevoServicio, setNuevoServicio] = useState<Servicio>({
    serviceId: "",
    staffId: PERSONAL_MEDICO,
    branchId: SUCURSAL,
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
      staffId: PERSONAL_MEDICO,
      branchId: SUCURSAL,
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
          <CardTitle>Historial de Antecedentes Médicos</CardTitle>
          <Button onClick={() => setIsHistorialModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Agregar Antecedente Médico
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
            <DialogTitle>Agregar Antecendetes Medicos</DialogTitle>
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
          <CardTitle>Historial Medico de Consutlas, Servicios y Tratamientos</CardTitle>
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
                <form
                  onSubmit={handleAddServicio}
                  className="space-y-4 min-h-[] p-3"
                >
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
                        <h3 className="font-semibold text-lg mb-2">Detalles del Descanso Médico</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="medicalLeaveStartDate">Fecha de Inicio</Label>
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
                                    ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
                                    : 0
                                });
                              }}
                            />
                          </div>
                          <div>
                            <Label htmlFor="medicalLeaveEndDate">Fecha de Fin</Label>
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
                                    ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
                                    : 0
                                });
                              }}
                            />
                          </div>
                          <div>
                            <Label htmlFor="medicalLeaveDays">Días de Descanso</Label>
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
                          <Label htmlFor="leaveDescription">Descripción del Descanso Médico</Label>
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
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="newImages" className="flex items-center cursor-pointer hover:text-blue-500">
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
                          <Label className="block mb-2">Imágenes Seleccionadas:</Label>
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
                                      newImages: prev.newImages.filter((_, i) => i !== index),
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
                        <h3 className="font-semibold text-lg mb-2">Detalles de Receta Médica</h3>
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
                                      const updatedItems = nuevoServicio.prescriptionItems.filter(
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
                    <h4 className="font-semibold mb-2">Evidencia medica Fotografica:</h4>
                    <div className="flex items-center justify-center">
                      <Carousel className="w-full max-w-5xl">
                        <CarouselContent className="-ml-1">
                          {servicio.newImages.map((image, imageIndex) => (
                            <CarouselItem key={imageIndex} className="pl-1 basis-1/3">
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
      </Card>

      <Dialog
        open={isPrescriptionModalOpen}
        onOpenChange={setIsPrescriptionModalOpen}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Receta Médica</DialogTitle>
          </DialogHeader>
          {selectedPrescription && (
            <div className="space-y-6 p-4">
              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div className="flex items-start space-x-4">
                  <img
                    src="/logo-hospital.png"
                    alt="Logo Hospital"
                    className="w-16 h-16 object-contain"
                  />
                  <div>
                    <h3 className="font-bold text-lg">Juan Pablo II</h3>
                    <p className="text-sm text-gray-600">Av. Principal 123, Lima</p>
                    <p className="text-sm text-gray-600">Tel: (01) 123-4567</p>
                    <p className="text-sm text-gray-600">Email: contacto@juanpablo.com</p>
                  </div>
                </div>
                <div className="text-right">
                  <h4 className="font-semibold">Médico Tratante</h4>
                  <p className="text-sm">Dr. Alex Flores Valdez</p>
                  <p className="text-sm text-gray-600">Especialidad: Dermatología</p>
                  <p className="text-sm text-gray-600">CMP: 12345</p>
                  <p className="text-sm text-gray-600">Código: DR001</p>
                </div>
              </div>

              <div className="border-b pb-4">
                <h4 className="font-semibold mb-2">Datos del Paciente</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Nombre: </span>
                      {paciente.nombre} {paciente.apellido}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">DNI: </span>
                      {paciente.dni}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Teléfono: </span>
                      {paciente.telefono}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Dirección: </span>
                      {paciente.direccion}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Diagnóstico</h4>
                  <p className="text-sm bg-gray-50 p-3 rounded">
                    {selectedPrescription.prescriptionDescription}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Medicamentos Recetados</h4>
                  <div className="bg-gray-50 p-3 rounded">
                    <table className="w-full">
                      <thead>
                        <tr className="text-sm text-gray-600 border-b">
                          <th className="text-left py-2">Medicamento</th>
                          <th className="text-left py-2">Dosis</th>
                          <th className="text-left py-2">Frecuencia</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPrescription.prescriptionItems.map((item, index) => (
                          <tr key={index} className="border-b last:border-0">
                            <td className="py-2">{item.nombre}</td>
                            <td className="py-2">{item.dosis}</td>
                            <td className="py-2">{item.frecuencia}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Fecha de emisión: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button
                  onClick={() => handlePrintPrescription(selectedPrescription)}
                  className="w-full sm:w-auto"
                >
                  <Printer className="w-4 h-4 mr-2" /> Imprimir Receta
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
    </div>
  );
}
