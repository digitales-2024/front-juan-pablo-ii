import { useState, useEffect } from "react";
import { useAuth } from "@/app/(auth)/sign-in/_hooks/useAuth"; // Importar hook de autenticación
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
  Check,
  ChevronsUpDown,
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
import { cn } from "@/lib/utils";

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
  // Obtener usuario logueado
  const { user } = useAuth();
  const { createUpdateHistory, createPrescriptionMutation } =
    useUpdateHistory();

  // Determinar si el usuario es médico
  const isUserDoctor =
    user?.roles?.some((role) => role.name === "MEDICO") ?? false;

  // Filtrar solo personal médico (con campo cmp no nulo)
  const medicalStaff = staff.filter(
    (staffMember) =>
      staffMember?.cmp !== null &&
      staffMember?.cmp !== undefined &&
      staffMember?.cmp !== ""
  );

  // Buscar al médico logueado en el array de médicos por el campo userId
  const loggedInDoctor = isUserDoctor
    ? medicalStaff.find((doctor) => doctor.userId === user?.id)
    : undefined;

  /*   console.log("Usuario autenticado:", user?.id);
  console.log("Staff disponible:", medicalStaff.map(s => ({ id: s.id, userId: s.userId, name: `${s.name} ${s.lastName}` })));
  console.log("Médico encontrado:", loggedInDoctor);
 */
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

  // Añadir estado para los errores de validación
  const [formErrors, setFormErrors] = useState({
    serviceId: false,
    branchId: false,
  });

  // Efecto para establecer automáticamente el médico si el usuario logueado es médico
  useEffect(() => {
    if (isUserDoctor && loggedInDoctor) {
      setFormData((prev) => ({
        ...prev,
        staffId: loggedInDoctor.id, // Usamos el ID del staff, no el userId
      }));
    }
  }, [isUserDoctor, loggedInDoctor, isOpen]);

  // Estado para imágenes
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Estado para modales
  const [showMedicalLeaveModal, setShowMedicalLeaveModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  // Estado para manejar loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado separado para la receta médica
  const [prescriptionData, setPrescriptionData] =
    useState<CreatePrescriptionDto | null>(null);

  const [prescriptionResetKey, setPrescriptionResetKey] = useState(0);
  const [medicalLeaveResetKey, setMedicalLeaveResetKey] = useState(0); // Nuevo estado para descanso médico
  // Separamos la lógica de creación en funciones independientes

  // Manejador principal del envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar los campos requeridos
    const newErrors = {
      serviceId: !formData.serviceId,
      branchId: !formData.branchId,
    };

    // Si hay errores, actualizar estado y detener el envío
    if (newErrors.serviceId || newErrors.branchId) {
      setFormErrors(newErrors);
      return;
    }

    // Continuar con el envío si no hay errores
    setIsSubmitting(true);

    try {
      // 1. Primero crear la actualización de historia
      const updateHistoryResponse = await createUpdateHistory.mutateAsync({
        data: formData, // Aquí solo va la data básica
        image: selectedImages.length > 0 ? selectedImages : null,
      });

      // 2. Si hay receta médica, crearla usando el ID de la historia
      if (
        formData.prescription &&
        prescriptionData &&
        updateHistoryResponse.data.id
      ) {
        const prescriptionResponse =
          await createPrescriptionMutation.mutateAsync({
            ...prescriptionData,
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
    } catch (error) {
      console.error("Error en el proceso de creación:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Actualizamos el handlePrescriptionSave para manejar mejor el estado
  const handlePrescriptionSave = (data: CreatePrescriptionDto) => {
    setPrescriptionData(data);
    setFormData((prev) => ({
      ...prev,
      prescription: true, // Solo marcamos que existe una receta
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
    setPrescriptionData(null); // Limpiar datos de receta
    setSelectedImages([]);
    setImagePreviews((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return [];
    });
    setShowMedicalLeaveModal(false);
    setShowPrescriptionModal(false);
    setIsOpen(false);
    setPrescriptionResetKey((prev) => prev + 1); // Incrementar para forzar reseteo
    setMedicalLeaveResetKey((prev) => prev + 1); // Incrementar también el reset key del descanso médico
  };

  // Agregar función para limpiar receta médica
  const handleRemovePrescription = () => {
    // Solo limpiamos los datos de prescripción
    setPrescriptionData(null);
    setFormData((prev) => ({
      ...prev,
      prescription: false,
      // No tocamos los campos de descanso médico aquí
    }));
    // Incrementar SOLO el resetKey de prescripción
    setPrescriptionResetKey((prev) => prev + 1);
  };

  // Agregar función para limpiar descanso médico
  const handleRemoveMedicalLeave = () => {
    // Solo limpiamos los campos de descanso médico
    setFormData((prev) => ({
      ...prev,
      medicalLeave: false,
      medicalLeaveStartDate: undefined,
      medicalLeaveEndDate: undefined,
      medicalLeaveDays: undefined,
      leaveDescription: undefined,
      // No tocamos prescription ni prescriptionData aquí
    }));
    // Incrementar SOLO el resetKey de descanso médico
    setMedicalLeaveResetKey((prev) => prev + 1);
  };

  // Funciones para limpiar errores cuando el usuario interactúa
  const clearServiceError = (serviceId: string) => {
    setFormData((prev) => ({ ...prev, serviceId }));
    setFormErrors((prev) => ({ ...prev, serviceId: false }));
  };

  const clearBranchError = (branchId: string) => {
    setFormData((prev) => ({ ...prev, branchId }));
    setFormErrors((prev) => ({ ...prev, branchId: false }));
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
                      Servicio <span className="text-destructive">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="serviceId"
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between w-full",
                            !formData.serviceId && "text-muted-foreground",
                            formErrors.serviceId && "border-destructive"
                          )}
                        >
                          {formData.serviceId
                            ? services.find(
                                (service) => service.id === formData.serviceId
                              )?.name
                            : "Seleccione un servicio"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-full max-w-[300px]">
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
                                    clearServiceError(service.id);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      formData.serviceId === service.id
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
                    {formErrors.serviceId && (
                      <p className="text-destructive text-xs mt-1">
                        Este campo es obligatorio
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="staffId"
                      className="flex items-center gap-2"
                    >
                      <User className="h-4 w-4 text-primary" />
                      Médico{" "}
                      {isUserDoctor && loggedInDoctor ? " (Tu usuario)" : ""}
                    </Label>
                    <Select
                      value={formData.staffId}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, staffId: value }))
                      }
                      disabled={isUserDoctor && !!loggedInDoctor}
                    >
                      <SelectTrigger
                        className={
                          isUserDoctor && loggedInDoctor
                            ? "bg-blue-50 border-blue-200"
                            : ""
                        }
                      >
                        {isUserDoctor && loggedInDoctor ? (
                          <span className="text-primary font-medium">{`${loggedInDoctor.name} ${loggedInDoctor.lastName}`}</span>
                        ) : (
                          <SelectValue placeholder="Seleccione un médico" />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        {medicalStaff.map((s) => (
                          <SelectItem
                            key={s.id}
                            value={s.id}
                            className={
                              s.userId === user?.id
                                ? "bg-blue-100 font-medium"
                                : ""
                            }
                          >
                            {`${s.name} ${s.lastName}`}
                            {s.userId === user?.id ? " (Tu usuario)" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isUserDoctor && loggedInDoctor && (
                      <p className="text-xs text-blue-600 mt-1">
                        Como médico, solo puedes crear historias a tu nombre
                      </p>
                    )}
                    {isUserDoctor && !loggedInDoctor && (
                      <p className="text-xs text-yellow-600 mt-1">
                        Tu usuario tiene rol de médico pero no se encuentra en
                        el sistema. Contacta a soporte técnico.
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="branchId"
                      className="flex items-center gap-2"
                    >
                      <MapPin className="h-4 w-4 text-primary" />
                      Sucursal <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.branchId}
                      onValueChange={(value) => clearBranchError(value)}
                    >
                      <SelectTrigger
                        className={
                          formErrors.branchId ? "border-destructive" : ""
                        }
                      >
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
                    {formErrors.branchId && (
                      <p className="text-destructive text-xs mt-1">
                        Este campo es obligatorio
                      </p>
                    )}
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
                      className="bg-green-50 text-yellow-700 hover:bg-green-100 transition-colors px-3 py-1"
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
              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "relative",
                  (formErrors.serviceId || formErrors.branchId) &&
                    "animate-shake"
                )}
              >
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
        resetKey={medicalLeaveResetKey} // Nueva prop para resetear el componente
      />

      <AddPrescriptionModal
        isOpen={showPrescriptionModal}
        setIsOpen={setShowPrescriptionModal}
        onSave={handlePrescriptionSave} // Esta función recibe los datos
        products={products}
        services={services}
        branchId={formData.branchId}
        staffId={formData.staffId}
        patientId={patientId ?? ""}
        resetKey={prescriptionResetKey}
      />
    </Dialog>
  );
}
