import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  User,
  MapPin,
  FileText,
  Calendar,
  AlertTriangle,
  Stethoscope,
  ImageIcon,
  ChevronDown,
  ChevronUp,
  Eye,
  X,
} from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

import type { Servicio } from "../_interfaces/types"
import { AddHistoryModal } from "./AddHistoryModal"

interface MedicalHistoryProps {
  servicios: Servicio[]
  setServicios: (servicios: Servicio[]) => void
  setSelectedPrescription: (prescription: Servicio | null) => void
  setIsPrescriptionModalOpen: (isOpen: boolean) => void
  selectedImage: string | null
  setSelectedImage: (image: string | null) => void
}

export function UpdateMedicalHistoryPatient({
  servicios,
  setServicios,
  setSelectedPrescription,
  setIsPrescriptionModalOpen,
  selectedImage,
  setSelectedImage,
}: MedicalHistoryProps) {
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [expandedService, setExpandedService] = useState<string | null>(null)

  useEffect(() => {
    if (servicios.length > 0) {
      setExpandedService(servicios[0].serviceId)
    }
  }, [servicios])

  const toggleServiceExpansion = (serviceId: string) => {
    setExpandedService(expandedService === serviceId ? null : serviceId)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })
  }

  const handleAddNewService = (newService: Servicio) => {
    const currentDate = new Date().toISOString(); // Obtén la fecha actual en formato ISO
    const newServiceWithDate = { ...newService, date: currentDate }; // Añade la fecha al nuevo servicio
    setServicios([newServiceWithDate, ...servicios]);
    setExpandedService(newServiceWithDate.serviceId);
  }
  return (
    <Card className="border-t-4 border-t-primary">
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 p-6">
        <div className="flex items-center gap-3">
          <Stethoscope className="w-8 h-8 md:w-6 md:h-6 text-primary flex-shrink-0" />
          <CardTitle className="text-xl md:text-2xl">Historial Médico de Consultas, Servicios y Tratamientos</CardTitle>
        </div>
        <Button className="w-full md:w-auto" onClick={() => setIsHistoryModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Agregar Historia
        </Button>
      </CardHeader>

      <AddHistoryModal isOpen={isHistoryModalOpen} setIsOpen={setIsHistoryModalOpen} onSave={handleAddNewService} />

      <CardContent className="p-4 md:p-6">
        {servicios.map((servicio, index) => (
          <Card key={servicio.serviceId} className="mb-6 overflow-hidden border-t-2 border-t-primary">
            <CardHeader
              className="bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 cursor-pointer space-y-3 sm:space-y-0"
              onClick={() => toggleServiceExpansion(servicio.serviceId)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <Badge variant="outline" className="text-base px-3 py-1.5">{`Servicio ${servicio.serviceId}`}</Badge>
      
              </div>
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                <span className="text-base text-muted-foreground">{formatDate(servicio.date)}</span>
                <Button variant="ghost" size="sm" className="flex items-center gap-1 text-primary">
                  <Eye className="w-5 h-5" />
                  {expandedService === servicio.serviceId ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </CardHeader>
            {expandedService === servicio.serviceId && (
              <CardContent className="p-4 md:p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-base">
                        <strong className="block sm:inline">Médico:</strong>{" "}
                        <span className="block sm:inline mt-1 sm:mt-0">{servicio.staffId}</span>
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-base">
                        <strong className="block sm:inline">Sucursal:</strong>{" "}
                        <span className="block sm:inline mt-1 sm:mt-0">{servicio.branchId}</span>
                      </span>
                    </div>
                  </div>
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <div className="flex items-start space-x-3">
                      <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div className="flex-grow">
                        <strong className="text-base block mb-2">Descripción:</strong>
                        <p className="p-4 bg-gray-50 border border-gray-200 rounded-md text-base">
                          {servicio.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {servicio.newImages && servicio.newImages.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center text-base">
                      <ImageIcon className="w-5 h-5 mr-3 text-primary" />
                      Evidencia Médica Fotográfica:
                    </h4>
                    <Carousel className="w-full max-w-4xl mx-auto">
                      <CarouselContent>
                        {servicio.newImages.map((image, imageIndex) => (
                          <CarouselItem key={imageIndex} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                            <div className="p-2">
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`Imagen ${imageIndex + 1}`}
                                className="w-full aspect-square object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => setSelectedImage(image)}
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="text-primary" />
                      <CarouselNext className="text-primary" />
                    </Carousel>
                  </div>
                )}

                <Tabs defaultValue="prescription" className="mt-6">
                  <TabsList className="flex flex-wrap gap-2">
                    {servicio.prescription && (
                      <TabsTrigger value="prescription" className="flex-1 sm:flex-none">
                        Receta
                      </TabsTrigger>
                    )}
                    {servicio.medicalLeave && (
                      <TabsTrigger value="leave" className="flex-1 sm:flex-none">
                        Licencia Médica
                      </TabsTrigger>
                    )}
                  </TabsList>

                  {servicio.prescription && (
                    <TabsContent value="prescription" className="mt-4">
                      <Button
                        onClick={() => {
                          setSelectedPrescription(servicio)
                          setIsPrescriptionModalOpen(true)
                        }}
                        className="w-full sm:w-auto"
                      >
                        <FileText className="w-4 h-4 mr-2" /> Ver Receta Médica
                      </Button>
                    </TabsContent>
                  )}

                  {servicio.medicalLeave && (
                    <TabsContent value="leave" className="mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                            <span className="text-base">
                              <strong className="block sm:inline">Inicio:</strong>{" "}
                              <span className="block sm:inline mt-1 sm:mt-0">{servicio.medicalLeaveStartDate}</span>
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                            <span className="text-base">
                              <strong className="block sm:inline">Fin:</strong>{" "}
                              <span className="block sm:inline mt-1 sm:mt-0">{servicio.medicalLeaveEndDate}</span>
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <AlertTriangle className="w-5 h-5 text-primary flex-shrink-0" />
                            <span className="text-base">
                              <strong className="block sm:inline">Días:</strong>{" "}
                              <span className="block sm:inline mt-1 sm:mt-0">{servicio.medicalLeaveDays}</span>
                            </span>
                          </div>
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-2">
                          <div className="flex items-start space-x-3">
                            <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                            <div className="flex-grow">
                              <strong className="text-base block mb-2">Descripción:</strong>
                              <p className="p-4 bg-gray-50 border border-gray-200 rounded-md text-base">
                                {servicio.leaveDescription}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  )}
                </Tabs>
              </CardContent>
            )}
          </Card>
        ))}
      </CardContent>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl border-t-4 border-t-primary">
          <DialogHeader className="flex flex-col items-center">
            <DialogTitle className="text-center mb-2">Vista Detallada</DialogTitle>
            <span className="text-base text-muted-foreground">
              {selectedImage && formatDate(servicios.find((s) => s.newImages?.includes(selectedImage))?.date ?? "")}
            </span>
          </DialogHeader>
          {selectedImage && (
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Vista detallada"
              className="w-full object-contain max-h-[70vh] rounded-lg"
            />
          )}
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="absolute right-4 top-4">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </Card>
  )
}