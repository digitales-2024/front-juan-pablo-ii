import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateHistory } from "../_hook/useUpdateHistory";
import {
  Plus,
  Stethoscope,
  PillIcon as Pills,
  Syringe,
  Heart,
  Brain,
  Bone,
  Activity,
  AlertCircle,
  PenTool,
  Baby,
  Cigarette,
  Wine,
  Dumbbell,
  FileText,
  BookHeart,
  Pencil,
} from "lucide-react";
import { MedicalHistory, UpdateMedicalHistoryDto } from "../_interfaces/updateHistory.interface";

const antecedentesPreDefinidos = [
  { value: "alergias", label: "Alergias", icon: AlertCircle },
  { value: "antecedentes", label: "Antecedentes", icon: FileText },
  { value: "cirugiasPrevias", label: "Cirugías Previas", icon: Stethoscope },
  {
    value: "enfermedadesCronicas",
    label: "Enfermedades Crónicas",
    icon: Activity,
  },
  { value: "medicamentos", label: "Medicamentos Actuales", icon: Pills },
  { value: "vacunas", label: "Historial de Vacunación", icon: Syringe },
  { value: "cardiacos", label: "Antecedentes Cardíacos", icon: Heart },
  { value: "neurologicos", label: "Antecedentes Neurológicos", icon: Brain },
  {
    value: "traumatologicos",
    label: "Antecedentes Traumatológicos",
    icon: Bone,
  },
  { value: "familiares", label: "Antecedentes Familiares", icon: Baby },
  { value: "habitos", label: "Hábitos y Estilo de Vida", icon: Dumbbell },
  { value: "tabaquismo", label: "Tabaquismo", icon: Cigarette },
  { value: "alcohol", label: "Consumo de Alcohol", icon: Wine },
  { value: "otro", label: "Otro Antecedente", icon: PenTool },
];

interface MedicalBackgroundProps {
  historialMedico: MedicalHistory;
}

export function MedicalBackground({ historialMedico }: MedicalBackgroundProps) {
  const { updateMutation } = useUpdateHistory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [formData, setFormData] = useState({
    tipo: "",
    contenido: "",
    customTitulo: "",
  });

  const handleOpenModal = (key?: string, value?: string) => {
    if (key && value) {
      setIsEditing(true);
      setEditingKey(key);
      setFormData({
        tipo: key,
        contenido: value,
        customTitulo: "",
      });
    } else {
      setIsEditing(false);
      setEditingKey("");
      setFormData({
        tipo: "",
        contenido: "",
        customTitulo: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    const key = isEditing
      ? editingKey
      : formData.tipo === "otro"
      ? formData.customTitulo
      : formData.tipo;

    const updatedHistory : UpdateMedicalHistoryDto = {
      patientId:historialMedico.patientId,
      description:historialMedico.description,
      medicalHistory: {
        ...historialMedico.medicalHistory,
        [key]: formData.contenido,
      },
    };

    /*     alias) type MedicalHistory = {
      id: string;
      patientId: string;
      medicalHistory: Record<string, never>;
      description: string;
      isActive: boolean;
  } */

    updateMutation.mutate({
      id: historialMedico.id,
      data: updatedHistory,
    });

    setIsModalOpen(false);
    setFormData({ tipo: "", contenido: "", customTitulo: "" });
  };

  const historialArray = Object.entries(
    historialMedico.medicalHistory || {}
  ).map(([key, value]) => ({
    key,
    value,
    tipo: key,
  }));

  const getIconForType = (tipo: string) => {
    const antecedente = antecedentesPreDefinidos.find((a) => a.value === tipo);
    return antecedente?.icon ?? FileText;
  };

  return (
    <Card className="border-t-4 border-t-primary">
      <CardHeader className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <BookHeart className="w-5 h-5 text-primary" />
          <CardTitle>Historial de Antecedentes Médicos</CardTitle>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" /> Agregar Antecedente
        </Button>
      </CardHeader>
      <CardContent>
        {historialArray.length === 0 ? (
          <h3 className="text-center text-gray-500 py-8">
            Paciente sin antecedentes médicos registrados
          </h3>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {historialArray.map(({ key, value, tipo }) => {
              const Icon = getIconForType(tipo);
              return (
                <Card key={key} className="relative bg-gray-50/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg font-medium">
                          {antecedentesPreDefinidos.find(
                            (a) => a.value === tipo
                          )?.label ?? key}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-8">{value}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute bottom-2 right-2"
                      onClick={() => handleOpenModal(key, value)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing
                ? "Editar Antecedente Médico"
                : "Agregar Antecedente Médico"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!isEditing && (
              <div className="space-y-2">
                <Label>Tipo de Antecedente</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      tipo: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un tipo de antecedente" />
                  </SelectTrigger>
                  <SelectContent>
                    {antecedentesPreDefinidos.map((antecedente) => (
                      <SelectItem
                        key={antecedente.value}
                        value={antecedente.value}
                      >
                        <div className="flex items-center gap-2">
                          <antecedente.icon className="w-4 h-4" />
                          {antecedente.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.tipo === "otro" && !isEditing && (
              <div className="space-y-2">
                <Label>Título Personalizado</Label>
                <Input
                  value={formData.customTitulo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customTitulo: e.target.value,
                    })
                  }
                  placeholder="Ingrese un título personalizado"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea
                value={formData.contenido}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contenido: e.target.value,
                  })
                }
                placeholder="Ingrese los detalles del antecedente médico"
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                (!isEditing && !formData.tipo) ||
                (formData.tipo === "otro" && !formData.customTitulo) ||
                !formData.contenido
              }
            >
              {isEditing ? "Actualizar" : "Agregar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
