import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import type { HistorialItem } from "../types";

interface MedicalBackgroundProps {
  historialMedico: HistorialItem[];
  setHistorialMedico: (historial: HistorialItem[]) => void;
}

export function MedicalBackground({ historialMedico, setHistorialMedico }: MedicalBackgroundProps) {
  const [isHistorialModalOpen, setIsHistorialModalOpen] = useState(false);
  const [nuevoHistorial, setNuevoHistorial] = useState({
    titulo: "",
    contenido: "",
  });

  const handleAddHistorialItem = () => {
    setHistorialMedico([...historialMedico, nuevoHistorial]);
    setNuevoHistorial({ titulo: "", contenido: "" });
    setIsHistorialModalOpen(false);
  };

  return (
    <>
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

      <Dialog open={isHistorialModalOpen} onOpenChange={setIsHistorialModalOpen}>
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
    </>
  );
}