"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import type { HistorialItem } from "../_interfaces/types"

interface MedicalBackgroundProps {
  historialMedico: HistorialItem[]
  setHistorialMedico: (historial: HistorialItem[]) => void
}

const antecedentesPreDefinidos = [
  { value: "otro", label: "Otro Antecedente", icon: PenTool },
  { value: "alergias", label: "Alergias", icon: AlertCircle },
  { value: "cirugias", label: "Cirugías Previas", icon: Stethoscope },
  { value: "medicamentos", label: "Medicamentos Actuales", icon: Pills },
  { value: "vacunas", label: "Historial de Vacunación", icon: Syringe },
  { value: "cardiacos", label: "Antecedentes Cardíacos", icon: Heart },
  { value: "neurologicos", label: "Antecedentes Neurológicos", icon: Brain },
  { value: "traumatologicos", label: "Antecedentes Traumatológicos", icon: Bone },
  { value: "familiares", label: "Antecedentes Familiares", icon: Baby },
  { value: "habitos", label: "Hábitos y Estilo de Vida", icon: Dumbbell },
  { value: "tabaquismo", label: "Tabaquismo", icon: Cigarette },
  { value: "alcohol", label: "Consumo de Alcohol", icon: Wine },
  { value: "cronicas", label: "Enfermedades Crónicas", icon: Activity },

]

export function MedicalBackground({ historialMedico, setHistorialMedico }: MedicalBackgroundProps) {
  const [isHistorialModalOpen, setIsHistorialModalOpen] = useState(false)
  const [nuevoHistorial, setNuevoHistorial] = useState({
    titulo: "",
    contenido: "",
    tipo: "",
    customTitulo: "",
  })

  const handleAddHistorialItem = () => {
    const tituloFinal =
      nuevoHistorial.tipo === "otro"
        ? nuevoHistorial.customTitulo
        : antecedentesPreDefinidos.find((a) => a.value === nuevoHistorial.tipo)?.label ?? nuevoHistorial.customTitulo

    setHistorialMedico([
      ...historialMedico,
      {
        titulo: tituloFinal,
        contenido: nuevoHistorial.contenido,
        tipo: nuevoHistorial.tipo,
      },
    ])
    setNuevoHistorial({ titulo: "", contenido: "", tipo: "", customTitulo: "" })
    setIsHistorialModalOpen(false)
  }

  const getIconForType = (tipo: string) => {
    const antecedente = antecedentesPreDefinidos.find((a) => a.value === tipo)
    return antecedente?.icon ?? FileText
  }

  return (
    <>
      <Card className="border-t-4 border-t-primary">
                <CardHeader className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <BookHeart className="w-5 h-5 text-primary" />
            <CardTitle>Historial de Antecedentes Médicos</CardTitle>
          </div>
          <Button className="mt-4 md:mt-0 w-full md:w-auto" onClick={() => setIsHistorialModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Agregar Antecedente
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {historialMedico.map((item, index) => {
              const Icon = getIconForType(item.tipo)
              return (
                <Card key={index} className="bg-gray-50/50 hover:bg-gray-50/80 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg font-medium">{item.titulo}</CardTitle>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        {antecedentesPreDefinidos.find((a) => a.value === item.tipo)?.label ?? "Personalizado"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.contenido}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isHistorialModalOpen} onOpenChange={setIsHistorialModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Agregar Antecedente Médico</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tipo de Antecedente</Label>
              <Select
                value={nuevoHistorial.tipo}
                onValueChange={(value) =>
                  setNuevoHistorial({
                    ...nuevoHistorial,
                    tipo: value,
                    titulo:
                      value !== "otro" ? antecedentesPreDefinidos.find((a) => a.value === value)?.label ?? "" : "",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un tipo de antecedente" />
                </SelectTrigger>
                <SelectContent>
                  {antecedentesPreDefinidos.map((antecedente) => (
                    <SelectItem key={antecedente.value} value={antecedente.value}>
                      <div className="flex items-center gap-2">
                        <antecedente.icon className="w-4 h-4" />
                        {antecedente.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {nuevoHistorial.tipo === "otro" && (
              <div className="space-y-2">
                <Label htmlFor="customTitulo">Agregar Ancedene</Label>
                <Input
                  id="customTitulo"
                  placeholder="Ingrese un Antecedente Medico"
                  value={nuevoHistorial.customTitulo}
                  onChange={(e) =>
                    setNuevoHistorial({
                      ...nuevoHistorial,
                      customTitulo: e.target.value,
                    })
                  }
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="contenido">Descripción</Label>
              <Textarea
                id="contenido"
                placeholder="Ingrese los detalles del antecedente médico"
                value={nuevoHistorial.contenido}
                onChange={(e) =>
                  setNuevoHistorial({
                    ...nuevoHistorial,
                    contenido: e.target.value,
                  })
                }
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsHistorialModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAddHistorialItem}
              disabled={
                !nuevoHistorial.tipo ||
                (nuevoHistorial.tipo === "otro" && !nuevoHistorial.customTitulo) ||
                !nuevoHistorial.contenido
              }
            >
              Agregar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

