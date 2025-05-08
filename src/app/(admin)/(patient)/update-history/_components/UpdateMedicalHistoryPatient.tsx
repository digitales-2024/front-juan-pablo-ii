import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  User,
  MapPin,
  FileText,
  Stethoscope,
  ImageIcon,
  ChevronDown,
  ChevronUp,
  Eye,
  X,
  CalendarRange,
  CalendarCheck,
  Clock,
  BedDouble,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Branch,
  CreateUpdateHistoryFormData,
  Patient,
  PrescriptionResponse,
  Product,
  Service,
  Staff,
  UpdateHistoryResponseImage,
  UpdateUpdateHistoryFormData,
} from "../_interfaces/updateHistory.interface";
import { AddHistoryModal } from "./AddHistoryModal";
import { useUpdateHistory } from "../_hook/useUpdateHistory";
import { v4 as uuidv4 } from "uuid";

/* import { PrescriptionModal } from "./PrescriptionModal"; */

interface UpdateMedicalHistoryPatientProps {
  updateHistories: UpdateHistoryResponseImage[];
  prescriptions: PrescriptionResponse[];
  services: Service[];
  staff: Staff[];
  branches: Branch[];
  products: Product[];
  patientId?: string;
  patient?: Patient;
  medicalHistoryId?: string;
  onPrescriptionView: (updateId: string) => void; // Nuevo prop
  onHistoryUpdate: () => Promise<void>; // Nuevo prop
}

export function UpdateMedicalHistoryPatient({
  updateHistories,
  services,
  staff,
  branches,
  products,
  patientId,
  medicalHistoryId,
  onPrescriptionView,
  onHistoryUpdate,
}: UpdateMedicalHistoryPatientProps) {
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Agregar estos estados
  /*  export interface UpdateUpdateHistoryFormData {
      data: UpdateUpdateHistoryDto;
      image?: File[] | null;
    } */
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedUpdateForImages, setSelectedUpdateForImages] = useState<
    string | null
  >(null);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Agregar nuevo estado para el modal de descanso médico
  const [showMedicalLeaveModal, setShowMedicalLeaveModal] = useState(false);
  const [selectedMedicalLeave, setSelectedMedicalLeave] =
    useState<UpdateHistoryResponseImage | null>(null);
// Añade este estado para los mensajes de error
const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Simplificamos este manejador
  const handleAddNewHistory = async (formData: CreateUpdateHistoryFormData) => {
    try {
      // Aquí iría tu lógica de creación
      console.log("🚀 ~ handleAddNewHistory agregada ex ~ formData:", formData);

      // Cerrar el modal
      setIsHistoryModalOpen(false);

      // Llamar a la función del padre para refrescar datos
      await onHistoryUpdate();

      // Opcional: Mostrar toast de éxito
    } catch (error) {
      console.error("Error al crear historia:", error);
    }
  };

  // Función mejorada de formato de fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString.replace(" ", "T"));

    const formatoFecha = date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const formatoHora = date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${formatoFecha} ${formatoHora}`;
  };

  // Aseguramos que el primer elemento esté expandido al inicio
  const [expandedService, setExpandedService] = useState<string | null>(() => {
    if (updateHistories.length > 0) {
      // Ordenar de la misma manera que en el render
      const sortedHistories = [...updateHistories].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return sortedHistories[0].id;
    }
    return null;
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Función para obtener nombres a partir de IDs
  const getBranchName = (branchId: string) =>
    branches.find((branch) => branch.id === branchId)?.name ?? "N/A";

  const getServiceName = (serviceId: string) =>
    services.find((service) => service.id === serviceId)?.name ?? "N/A";

  const getStaffName = (staffId: string) => {
    const staffMember = staff.find((s) => s.id === staffId);
    return staffMember ? `${staffMember.name} ${staffMember.lastName}` : "N/A";
  };

  // Función para manejar la visualización de la receta
  const handleShowPrescription = (update: UpdateHistoryResponseImage) => {
    if (update.prescription && update.prescriptionId) {
      onPrescriptionView(update.id);
    }
  };

  // Agregar estas funciones
  /* export interface UpdateUpdateHistoryFormData {
      data: UpdateUpdateHistoryDto;
      image?: File[] | null;
    } */
      const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
          const files = Array.from(e.target.files);
          
          // Filtrar solo los archivos que son imágenes
          const validFiles: File[] = [];
          const invalidFiles: string[] = [];
          
          files.forEach(file => {
            if (file.type.startsWith('image/')) {
              validFiles.push(file);
            } else {
              invalidFiles.push(file.name);
            }
          });
          
          // Mostrar mensaje de error si hay archivos inválidos
          if (invalidFiles.length > 0) {
            setErrorMessage(`Los siguientes archivos no son imágenes y fueron eliminados: ${invalidFiles.join(', ')}`);
            
            // Limpiar el mensaje después de 5 segundos
            setTimeout(() => setErrorMessage(null), 5000);
          }
          
          if (validFiles.length === 0) return; // No seguir si no hay archivos válidos
          
          // Solo agregar archivos válidos
          setNewImages((prev) => [...prev, ...validFiles]);
          
          // Crear previsualizaciones solo para archivos válidos
          const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
          setImagesPreviews((prev) => [...prev, ...newPreviews]);
        }
      };

  const handleRemoveNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setImagesPreviews((prev) => {
      const newPreviews = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index]);
      return newPreviews;
    });
  };

  const { updateUpdateHistoryMutation } = useUpdateHistory();

  const handleSaveImages = async () => {
    if (!selectedUpdateForImages || newImages.length === 0 || isSaving) return;
    setIsSaving(true);
    
    // Encontrar el objeto de update usando el ID
    const selectedUpdate = updateHistories.find(
      (update) => update.id === selectedUpdateForImages
    );

    if (!selectedUpdate) {
      setIsSaving(false);
      return;
    }

    try {
      // Generar ID aleatorio
      const valRandom = uuidv4();

      // Crear el objeto de datos según la interfaz que espera
      const formDataToSend: UpdateUpdateHistoryFormData = {
        data: {
          // Aquí van todos los datos necesarios
          patientId: patientId ?? "",
          serviceId: selectedUpdate.serviceId,
          staffId: selectedUpdate.staffId,
          branchId: selectedUpdate.branchId,
          medicalHistoryId: medicalHistoryId ?? "",
          updateHistory: { randomId: valRandom },
        },
        newImages: newImages, // Usamos newImages directamente
      };

      // Llamar a la mutación con los datos estructurados
      await updateUpdateHistoryMutation.mutateAsync({
        id: selectedUpdateForImages,
        formData: formDataToSend,
      });

      // Limpiar estados
      setNewImages([]);
      setImagesPreviews([]);
      setIsImageModalOpen(false);
      setSelectedUpdateForImages(null);

      // Refrescar datos
      await onHistoryUpdate();
    } catch (error) {
      console.error("Error al guardar imágenes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Agregar función para manejar la visualización del descanso médico
  const handleShowMedicalLeave = (update: UpdateHistoryResponseImage) => {
    setSelectedMedicalLeave(update);
    setShowMedicalLeaveModal(true);
  };

  return (
    <>
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

        <AddHistoryModal
          isOpen={isHistoryModalOpen}
          setIsOpen={setIsHistoryModalOpen}
          onSave={handleAddNewHistory}
          services={services}
          staff={staff}
          branches={branches}
          products={products}
          patientId={patientId}
          medicalHistoryId={medicalHistoryId}
        />

        <CardContent className="p-4 md:p-6">
          {[...updateHistories]
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((update) => (
              <Card
                key={update.id}
                className="mb-6 overflow-hidden border-t-2 border-t-primary"
              >
                <CardHeader
                  className="bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 cursor-pointer space-y-3 sm:space-y-0"
                  onClick={() =>
                    setExpandedService(
                      expandedService === update.id ? null : update.id
                    )
                  }
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <Badge variant="outline" className="text-base px-3 py-1.5">
                      {getServiceName(update.serviceId)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                    <span className="text-base text-muted-foreground">
                      {formatDate(update.createdAt)}
                    </span>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-5 h-5" />
                      {expandedService === update.id ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
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
                              <strong className="text-base block mb-2">
                                Descripción:
                              </strong>
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
                              <CarouselItem
                                key={image.id}
                                className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                              >
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

                    {/* Botón para ver receta */}
                    <div className="flex flex-wrap gap-2">
                      {update.prescription && (
                        <Button
                          className="w-full md:w-auto"
                          onClick={() => handleShowPrescription(update)}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Ver Receta
                        </Button>
                      )}

                      {update.medicalLeave && (
                        <Button
                          className="w-full md:w-auto"
                          variant="outline"
                          onClick={() => handleShowMedicalLeave(update)}
                        >
                          <BedDouble className="w-4 h-4 mr-2" />
                          Ver Descanso Médico
                        </Button>
                      )}

                      <Button
                        className="w-full md:w-auto"
                        variant="outline"
                        onClick={() => {
                          setSelectedUpdateForImages(update.id);
                          setIsImageModalOpen(true);
                        }}
                      >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Agregar Imágenes
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
        </CardContent>

        {/* Modal de imagen */}
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
 {/* Añadir mensaje de error aquí */}
 {errorMessage && (
      <div className="p-3 mb-4 bg-destructive/15 text-destructive border border-destructive/30 rounded-md flex items-center">
        <X className="w-4 h-4 mr-2 flex-shrink-0" />
        <span className="text-sm">{errorMessage}</span>
      </div>
    )}
        {/* Agregar el modal de imágenes */}
        <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Agregar Imágenes</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <input
                  type="file"
                  id="newImages"
                  multiple
                  accept="image/*"
                  onChange={handleAddImages}
                  className="hidden"
                />
                <label
                  htmlFor="newImages"
                  className="inline-flex items-center justify-center px-4 py-2 border border-dashed rounded-md cursor-pointer hover:bg-muted transition-colors"
                >
                  <ImageIcon className="w-5 h-5 mr-2" />
                  <span>Seleccionar Imágenes</span>
                </label>
              </div>

              {imagesPreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {imagesPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(index)}
                        className="absolute -top-2 -right-2 p-1 bg-destructive rounded-full text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-2">
              <Button
  type="button"
  variant="outline"
  onClick={() => {
    setIsImageModalOpen(false);
    setNewImages([]);
    setImagesPreviews([]);
    setSelectedUpdateForImages(null);
    setErrorMessage(null); // Limpiar el mensaje de error
  }}
>
  Cancelar
</Button>
                <Button
                  type="button"
                  onClick={handleSaveImages}
                  disabled={newImages.length === 0 || isSaving}
                >
                  {isSaving ? "Guardando..." : "Guardar Imágenes"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Descanso Médico */}
        <Dialog
          open={showMedicalLeaveModal}
          onOpenChange={setShowMedicalLeaveModal}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-primary" />
                Descanso Médico
              </DialogTitle>
            </DialogHeader>

            {selectedMedicalLeave && selectedMedicalLeave.medicalLeave && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <CalendarCheck className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-sm text-muted-foreground">
                        Fecha de Inicio
                      </p>
                      <p className="text-base">
                        {formatDate(
                          selectedMedicalLeave.medicalLeaveStartDate || ""
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CalendarRange className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-sm text-muted-foreground">
                        Fecha de Fin
                      </p>
                      <p className="text-base">
                        {formatDate(
                          selectedMedicalLeave.medicalLeaveEndDate || ""
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-sm text-muted-foreground">
                        Duración
                      </p>
                      <p className="text-base">
                        {selectedMedicalLeave.medicalLeaveDays}{" "}
                        {selectedMedicalLeave.medicalLeaveDays === 1
                          ? "día"
                          : "días"}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedMedicalLeave.leaveDescription && (
                  <div className="col-span-full">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-muted-foreground mb-1">
                          Motivo del Descanso
                        </p>
                        <p className="p-4 bg-muted border rounded-md text-sm">
                          {selectedMedicalLeave.leaveDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </Card>
    </>
  );
}
