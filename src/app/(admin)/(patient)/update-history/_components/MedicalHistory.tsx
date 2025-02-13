"use client"

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

export function MedicalHistory({
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
    setServicios([newService, ...servicios])
    setExpandedService(newService.serviceId)
  }

  return (
    <Card className="border-t-4 border-t-primary">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-6 h-6 text-primary" />
          <CardTitle>Historial Médico de Consultas, Servicios y Tratamientos</CardTitle>
        </div>
        <Button onClick={() => setIsHistoryModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Agregar Historia
        </Button>
      </CardHeader>

      <AddHistoryModal isOpen={isHistoryModalOpen} setIsOpen={setIsHistoryModalOpen} onSave={handleAddNewService} />

      <CardContent>
        {servicios.map((servicio, index) => (
          <Card key={servicio.serviceId} className="mb-4 overflow-hidden border-t-2 border-t-primary">
            <CardHeader
              className="bg-gray-50 flex flex-row items-center justify-between p-4 cursor-pointer"
              onClick={() => toggleServiceExpansion(servicio.serviceId)}
            >
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-base px-2 py-1">{`Servicio ${servicio.serviceId}`}</Badge>
                <CardTitle className="text-lg">Consulta / Servicio</CardTitle>
              </div>
              <div className="flex items-center gap-4">
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
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-primary" />
                    <span className="text-base">
                      <strong>Médico:</strong> {servicio.staffId}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="text-base">
                      <strong>Sucursal:</strong> {servicio.branchId}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-start space-x-2">
                    <FileText className="w-5 h-5 text-primary mt-1" />
                    <div className="flex-grow">
                      <strong className="text-base">Descripción:</strong>
                      <p className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-md text-base">
                        {servicio.description}
                      </p>
                    </div>
                  </div>
                </div>

                {servicio.newImages && servicio.newImages.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 flex items-center text-base">
                      <ImageIcon className="w-5 h-5 mr-2 text-primary" />
                      Evidencia Médica Fotográfica:
                    </h4>
                    <Carousel className="w-full max-w-4xl mx-auto">
                      <CarouselContent>
                        {servicio.newImages.map((image, imageIndex) => (
                          <CarouselItem key={imageIndex} className="basis-1/4 md:basis-1/5">
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
                      <CarouselPrevious className="text-primary" />
                      <CarouselNext className="text-primary" />
                    </Carousel>
                  </div>
                )}

                <Tabs defaultValue="prescription" className="mt-4">
                  <TabsList>
                    {servicio.prescription && <TabsTrigger value="prescription">Receta</TabsTrigger>}
                    {servicio.medicalLeave && <TabsTrigger value="leave">Licencia Médica</TabsTrigger>}
                  </TabsList>

                  {servicio.prescription && (
                    <TabsContent value="prescription" className="mt-2">
                      <Button
                        onClick={() => {
                          setSelectedPrescription(servicio)
                          setIsPrescriptionModalOpen(true)
                        }}
                      >
                        <FileText className="w-4 h-4 mr-2" /> Ver Receta Médica
                      </Button>
                    </TabsContent>
                  )}

                  {servicio.medicalLeave && (
                    <TabsContent value="leave" className="mt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-base">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-5 h-5 text-primary" />
                          <span>
                            <strong>Inicio:</strong> {servicio.medicalLeaveStartDate}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-5 h-5 text-primary" />
                          <span>
                            <strong>Fin:</strong> {servicio.medicalLeaveEndDate}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-5 h-5 text-primary" />
                          <span>
                            <strong>Días:</strong> {servicio.medicalLeaveDays}
                          </span>
                        </div>
                        <div className="col-span-2 flex items-start space-x-2">
                          <FileText className="w-5 h-5 text-primary mt-1" />
                          <div className="flex-grow">
                            <strong>Descripción:</strong>
                            <p className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-md">
                              {servicio.leaveDescription}
                            </p>
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
              {selectedImage && formatDate(servicios.find((s) => s.newImages?.includes(selectedImage))?.date || "")}
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

