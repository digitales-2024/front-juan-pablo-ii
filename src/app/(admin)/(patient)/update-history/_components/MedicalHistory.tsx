import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";


import {
  Plus,
  User,
  MapPin,
  FileText,
  Calendar,
  AlertTriangle,
  Image as ImageIcon,
  X,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import type {  Servicio } from "../types";
import { AddHistoryModal } from "./AddHistoryModal";


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
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          Historial Medico de Consultas, Servicios y Tratamientos
        </CardTitle>
        <Button onClick={() => setIsHistoryModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Agregar Historia
        </Button>
      </CardHeader>

      <AddHistoryModal
        isOpen={isHistoryModalOpen}
        setIsOpen={setIsHistoryModalOpen}
        onSave={(servicio) => setServicios([...servicios, servicio])}
      />

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

      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
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
