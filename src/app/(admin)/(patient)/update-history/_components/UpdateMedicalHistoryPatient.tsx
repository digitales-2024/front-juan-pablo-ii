import { useState, /* useEffect */ } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, /* DialogClose */ } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
//import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  User,
  MapPin,
  FileText,
  //Calendar,
  //AlertTriangle,
  Stethoscope,
  ImageIcon,
  ChevronDown,
  ChevronUp,
  Eye,
  //X,
} from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Branch, PrescriptionResponse, Product, Service, Staff, UpdateHistoryResponseImage } from "../_interfaces/updateHistory.interface"


// ... otros imports

interface UpdateMedicalHistoryPatientProps {
  updateHistories: UpdateHistoryResponseImage[];//id para la receta medica
  prescriptions: PrescriptionResponse[];
  services: Service[];
  staff: Staff[];
  branches: Branch[];
  products: Product[];
  patientId?: string;

}

export function UpdateMedicalHistoryPatient({
  updateHistories,
  //prescriptions,
  services,
  staff,
  branches,
  //products,
  //patientId,
}: UpdateMedicalHistoryPatientProps) {
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  console.log("🚀 ~ isHistoryModalOpen:", isHistoryModalOpen)
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Función para obtener nombres a partir de IDs
  const getBranchName = (branchId: string) => 
    branches.find(branch => branch.id === branchId)?.name ?? 'N/A';
  
  const getServiceName = (serviceId: string) => 
    services.find(service => service.id === serviceId)?.name ?? 'N/A';
  
  const getStaffName = (staffId: string) => {
    const staffMember = staff.find(s => s.id === staffId);
    return staffMember ? `${staffMember.name} ${staffMember.lastName}` : 'N/A';
  };

  return (
    <Card className="border-t-4 border-t-primary">
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 p-6">
        <div className="flex items-center gap-3">
          <Stethoscope className="w-8 h-8 md:w-6 md:h-6 text-primary flex-shrink-0" />
          <CardTitle className="text-xl md:text-2xl">
            Historial Médico de Consultas, Servicios y Tratamientos
          </CardTitle>
        </div>
        <Button 
          className="w-full md:w-auto" 
          onClick={() => setIsHistoryModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" /> Agregar Historia
        </Button>
      </CardHeader>

      <CardContent className="p-4 md:p-6">
        {updateHistories.slice().reverse().map((update) => (
          <Card key={update.id} className="mb-6 overflow-hidden border-t-2 border-t-primary">
            <CardHeader
              className="bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 cursor-pointer space-y-3 sm:space-y-0"
              onClick={() => setExpandedService(expandedService === update.id ? null : update.id)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <Badge variant="outline" className="text-base px-3 py-1.5">
                  {getServiceName(update.serviceId)}
                </Badge>
              </div>
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                <span className="text-base text-muted-foreground">
                  {new Date(update.createdAt).toLocaleDateString()}
                </span>
                <Button variant="ghost" size="sm">
                  <Eye className="w-5 h-5" />
                  {expandedService === update.id ? 
                    <ChevronUp className="w-5 h-5" /> : 
                    <ChevronDown className="w-5 h-5" />
                  }
                </Button>
              </div>
            </CardHeader>

            {expandedService === update.id && (
              <CardContent className="p-4 md:p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-base">
                        <strong>Médico: </strong>
                        {getStaffName(update.staffId)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-base">
                        <strong>Sucursal: </strong>
                        {getBranchName(update.branchId)}
                      </span>
                    </div>
                  </div>
                  
                  {update.description && (
                    <div className="col-span-1 md:col-span-2">
                      <div className="flex items-start space-x-3">
                        <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                        <div className="flex-grow">
                          <strong className="text-base block mb-2">Descripción:</strong>
                          <p className="p-4 bg-gray-50 border rounded-md">
                            {update.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Imágenes */}
                {update.images && update.images.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center text-base">
                      <ImageIcon className="w-5 h-5 mr-3 text-primary" />
                      Evidencia Médica Fotográfica:
                    </h4>
                    <Carousel className="w-full max-w-4xl mx-auto">
                      <CarouselContent>
                        {update.images.map((image) => (
                          <CarouselItem key={image.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                            <div className="p-2">
                              <img
                                src={image.url}
                                alt="Evidencia médica"
                                className="w-full aspect-square object-cover rounded-lg cursor-pointer"
                                onClick={() => setSelectedImage(image.url)}
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  </div>
                )}

                {/* Licencia Médica */}
                {update.medicalLeave && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-4">Licencia Médica</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <strong>Fecha Inicio:</strong> {update.medicalLeaveStartDate}
                      </div>
                      <div>
                        <strong>Fecha Fin:</strong> {update.medicalLeaveEndDate}
                      </div>
                      <div>
                        <strong>Días:</strong> {update.medicalLeaveDays}
                      </div>
                      {update.leaveDescription && (
                        <div className="col-span-2">
                          <strong>Descripción:</strong>
                          <p className="mt-2 p-3 bg-gray-50 rounded">
                            {update.leaveDescription}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </CardContent>

      {/* Modal de imagen */}
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
