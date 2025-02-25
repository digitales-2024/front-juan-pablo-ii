import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DialogClose } from "@radix-ui/react-dialog";
import {
  ImageIcon,
  X,
  FileText,
  User,
  MapPin,
  Stethoscope,
  ClipboardPlus,
  CalendarHeart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  CreateUpdateHistoryFormData,
  CreateUpdateHistoryDto,
  Service,
  Staff,
  Branch,
  Product,
  CreatePrescriptionDto,
  MedicalLeaveData,
} from "../_interfaces/updateHistory.interface";
import { AddMedicalLeaveModal } from "./AddMedicalLeaveModal";
import { AddPrescriptionModal } from "./AddPrescriptionModal";
import { useUpdateHistory } from "../_hook/useUpdateHistory";

interface AddHistoryModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (data: CreateUpdateHistoryFormData) => void;
  services: Service[];
  staff: Staff[];
  branches: Branch[];
  products: Product[];
  patientId?: string;
  medicalHistoryId?: string;
}

export function AddHistoryModal({
  isOpen,
  setIsOpen,
  onSave,
  services,
  staff,
  branches,
  products,
  patientId,
  medicalHistoryId,
}: AddHistoryModalProps) {
  const { createUpdateHistory, createPrescriptionMutation } =
    useUpdateHistory();

  // Estado inicial para el formulario
  const [formData, setFormData] = useState<CreateUpdateHistoryDto>({
    patientId: patientId ?? "",
    serviceId: "",
    staffId: "",
    branchId: "",
    medicalHistoryId: medicalHistoryId ?? "",
    prescription: false,
    description: "",
    medicalLeave: false,
  });

  // Estado para imágenes
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Estado para modales
  const [showMedicalLeaveModal, setShowMedicalLeaveModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  // Estado para manejar loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Separamos la lógica de creación en funciones independientes

  // Manejador principal del envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Primero crear la actualización de historia
      const updateHistoryResponse = await createUpdateHistory.mutateAsync({
        data: {
          ...formData,
          prescription: Boolean(formData.prescriptionData),
          prescriptionId: "", // Se actualizará después
        },
        image: selectedImages.length > 0 ? selectedImages : null,
      });

      // 2. Si hay receta médica, crearla usando el ID de la historia
      if (formData.prescriptionData && updateHistoryResponse.data.id) {
        const prescriptionResponse =
          await createPrescriptionMutation.mutateAsync({
            ...formData.prescriptionData,
            updateHistoryId: updateHistoryResponse.data.id,
            patientId: formData.patientId,
            branchId: formData.branchId,
            staffId: formData.staffId,
          });

        if (prescriptionResponse) {
          // Actualizar el estado con el ID de la receta
          onSave({
            data: {
              ...formData,
              prescriptionId: prescriptionResponse.data.id,
            },
            image: selectedImages.length > 0 ? selectedImages : null,
          });
        }
      } else {
        onSave({
          data: formData,
          image: selectedImages.length > 0 ? selectedImages : null,
        });
      }

      // Limpiar todo después de guardar exitosamente
      handleReset();
      toast.success("Datos guardados exitosamente");
    } catch (error) {
      console.error("Error en el proceso de creación:", error);
      toast.error("Error al guardar los datos");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Actualizamos el handlePrescriptionSave para manejar mejor el estado
  const handlePrescriptionSave = (prescriptionData: CreatePrescriptionDto) => {
    setFormData((prev) => ({
      ...prev,
      prescription: true,
      prescriptionData: {
        ...prescriptionData,
        updateHistoryId: null, // Lo estableceremos después de crear la historia
      },
    }));
    setShowPrescriptionModal(false);
  };

  const handleMedicalLeaveSubmit = (data: MedicalLeaveData) => {
    setFormData((prev) => ({
      ...prev,
      medicalLeave: data.medicalLeave,
      // Solo añadimos los datos si medicalLeave es true
      ...(data.medicalLeave
        ? {
            medicalLeaveStartDate: data.medicalLeaveStartDate,
            medicalLeaveEndDate: data.medicalLeaveEndDate,
            medicalLeaveDays: data.medicalLeaveDays,
            leaveDescription: data.leaveDescription,
          }
        : {
            // Si no hay descanso médico, limpiamos los campos relacionados
            medicalLeaveStartDate: undefined,
            medicalLeaveEndDate: undefined,
            medicalLeaveDays: undefined,
            leaveDescription: undefined,
          }),
    }));
    setShowMedicalLeaveModal(false);
  };

  // Manejador de imágenes
  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedImages((prev) => [...prev, ...files]);

      // Crear previsualizaciones
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  // Remover imagen
  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      const newPreviews = prev.filter((_, i) => i !== index);
      // Limpiar URL de objeto
      URL.revokeObjectURL(prev[index]);
      return newPreviews;
    });
  };

  // Resetear formulario
  const handleReset = () => {
    setFormData({
      patientId: patientId ?? "",
      serviceId: "",
      staffId: "",
      branchId: "",
      medicalHistoryId: medicalHistoryId ?? "",
      prescription: false,
      description: "",
      medicalLeave: false,
      // Limpiamos también los campos del descanso médico
      medicalLeaveStartDate: undefined,
      medicalLeaveEndDate: undefined,
      medicalLeaveDays: undefined,
      leaveDescription: undefined,
    });
    setSelectedImages([]);
    setImagePreviews((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return [];
    });
    setShowMedicalLeaveModal(false);
    setShowPrescriptionModal(false);
    setIsOpen(false);
  };

  // Agregar función para limpiar receta médica
  const handleRemovePrescription = () => {
    setFormData((prev) => ({
      ...prev,
      prescription: false,
      prescriptionData: undefined,
    }));
  };

  // Agregar función para limpiar descanso médico
  const handleRemoveMedicalLeave = () => {
    setFormData((prev) => ({
      ...prev,
      medicalLeave: false,
      medicalLeaveStartDate: undefined,
      medicalLeaveEndDate: undefined,
      medicalLeaveDays: undefined,
      leaveDescription: undefined,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] h-full border-t-4 border-t-primary">
        <ScrollArea className="max-h-[calc(100vh-8rem)]">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-2xl font-semibold">
                Agregar Historia Médica
              </DialogTitle>
              <DialogClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="serviceId"
                      className="flex items-center gap-2"
                    >
                      <Stethoscope className="h-4 w-4 text-primary" />
                      Servicio
                    </Label>
                    <Select
                      value={formData.serviceId}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, serviceId: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un servicio" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="staffId"
                      className="flex items-center gap-2"
                    >
                      <User className="h-4 w-4 text-primary" />
                      Medico
                    </Label>
                    <Select
                      value={formData.staffId}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, staffId: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un médico" />
                      </SelectTrigger>
                      <SelectContent>
                        {staff.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {`${s.name} ${s.lastName}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="branchId"
                      className="flex items-center gap-2"
                    >
                      <MapPin className="h-4 w-4 text-primary" />
                      Sucursal
                    </Label>
                    <Select
                      value={formData.branchId}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, branchId: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una sucursal" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4 text-primary" />
                    Descripción
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    required
                    className="min-h-[100px]"
                    placeholder="Ingrese la descripción de la consulta o servicio..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <Label className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-primary" />
                  Evidencia Fotográfica
                </Label>
                <div className="mt-2">
                  <input
                    type="file"
                    id="images"
                    multiple
                    onChange={handleAddImage}
                    className="hidden"
                  />
                  <label
                    htmlFor="images"
                    className="inline-flex items-center justify-center px-4 py-2 border border-dashed rounded-md cursor-pointer hover:bg-muted transition-colors"
                  >
                    <ImageIcon className="w-5 h-5 mr-2" />
                    <span>Agregar Imágenes</span>
                  </label>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {imagePreviews.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Imagen ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 p-1 bg-destructive rounded-full text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPrescriptionModal(true)}
                    className="w-full sm:w-auto flex items-center gap-2"
                  >
                    <ClipboardPlus className="w-4 h-4" />
                    Agregar Receta Médica
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowMedicalLeaveModal(true)}
                    className="w-full sm:w-auto flex items-center gap-2"
                  >
                    <CalendarHeart className="w-4 h-4" />
                    Agregar Descanso Médico
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.medicalLeave && (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 hover:bg-green-100 transition-colors px-3 py-1"
                    >
                      Descanso Médico Agregado
                      <button
                        onClick={handleRemoveMedicalLeave}
                        className="ml-2 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {formData.prescription && (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 hover:bg-green-100 transition-colors px-3 py-1"
                    >
                      Receta Médica Agregada
                      <button
                        onClick={handleRemovePrescription}
                        className="ml-2 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar Historia"}
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>

      <AddMedicalLeaveModal
        isOpen={showMedicalLeaveModal}
        setIsOpen={setShowMedicalLeaveModal}
        onSave={handleMedicalLeaveSubmit}
        initialData={{
          medicalLeave: formData.medicalLeave,
          medicalLeaveStartDate: formData.medicalLeaveStartDate,
          medicalLeaveEndDate: formData.medicalLeaveEndDate,
          medicalLeaveDays: formData.medicalLeaveDays,
          leaveDescription: formData.leaveDescription,
        }}
      />

      <AddPrescriptionModal
        isOpen={showPrescriptionModal}
        setIsOpen={setShowPrescriptionModal}
        onSave={handlePrescriptionSave}
        products={products}
        services={services}
        branchId={formData.branchId}
        staffId={formData.staffId}
        patientId={patientId ?? ""}
      />
    </Dialog>
  );
}
