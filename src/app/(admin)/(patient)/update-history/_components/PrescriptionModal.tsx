import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import type { Servicio, Paciente } from "../types";

interface PrescriptionModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  prescription: Servicio | null;
  paciente: Paciente;
}

export function PrescriptionModal({
  isOpen,
  setIsOpen,
  prescription,
  paciente,
}: PrescriptionModalProps) {
  const handlePrintPrescription = (prescription: Servicio) => {
    console.log("Imprimiendo receta:", prescription);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Receta Médica</DialogTitle>
        </DialogHeader>
        {prescription && (
          <div className="space-y-6 p-4">
            {/* Encabezado de la Receta */}
            <div className="grid grid-cols-2 gap-4 border-b pb-4">
              <div className="flex items-start space-x-4">
                <img
                  src="https://pub-c8a9c1f826c540b981f5cfb49c3a55ea.r2.dev/1fb4f92d-ff2d-4b39-a3da-9c3139a9c2d0.webp"
                  alt="Logo Hospital"
                  className="w-32 h-32 object-contain"
                />
                <div>
                  <h3 className="font-bold text-lg">Juan Pablo II</h3>
                  <p className="text-sm text-gray-600">Av. Principal 123, Lima</p>
                  <p className="text-sm text-gray-600">Tel: (01) 123-4567</p>
                  <p className="text-sm text-gray-600">Email: contacto@juanpablo.com</p>
                </div>
              </div>
              <div className="text-right">
                <h4 className="font-semibold">Médico Tratante</h4>
                <p className="text-sm">Dr. Alex Flores Valdez</p>
                <p className="text-sm text-gray-600">Especialidad: Dermatología</p>
                <p className="text-sm text-gray-600">CMP: 12345</p>
                <p className="text-sm text-gray-600">Código: DR001</p>
              </div>
            </div>

            {/* Datos del Paciente */}
            <div className="border-b pb-4">
              <h4 className="font-semibold mb-2">Datos del Paciente</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Nombre: </span>
                    {paciente.nombre} {paciente.apellido}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">DNI: </span>
                    {paciente.dni}
                  </p>
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Teléfono: </span>
                    {paciente.telefono}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Dirección: </span>
                    {paciente.direccion}
                  </p>
                </div>
              </div>
            </div>

            {/* Diagnóstico y Medicamentos */}
            <div className="space-y-4">
              {/* Diagnóstico */}
              <div>
                <h4 className="font-semibold mb-2">Diagnóstico</h4>
                <p className="text-sm bg-gray-50 p-3 rounded">
                  {prescription.prescriptionDescription}
                </p>
              </div>

              {/* Medicamentos Recetados */}
              <div>
                <h4 className="font-semibold mb-2">Medicamentos Recetados</h4>
                <div className="bg-gray-50 p-3 rounded">
                  <table className="w-full">
                    <thead>
                      <tr className="text-sm text-gray-600 border-b">
                        <th className="text-left py-2">Medicamento</th>
                        <th className="text-left py-2">Dosis</th>
                        <th className="text-left py-2">Frecuencia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prescription.prescriptionItems.map((item, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="py-2">{item.nombre}</td>
                          <td className="py-2">{item.dosis}</td>
                          <td className="py-2">{item.frecuencia}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Indicaciones Adicionales */}
              {prescription.prescriptionTitle && (
                <div>
                  <h4 className="font-semibold mb-2">Indicaciones Adicionales</h4>
                  <p className="text-sm bg-gray-50 p-3 rounded">
                    {prescription.prescriptionTitle}
                  </p>
                </div>
              )}

              {/* Fecha y Firma */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                <div>
                  <p className="text-sm text-gray-600">
                    Fecha de emisión: {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="border-t border-black mt-16 pt-2 inline-block">
                    <p className="text-sm font-medium">Firma del Médico</p>
                    <p className="text-xs text-gray-600">Dr. Alex Flores Valdez</p>
                    <p className="text-xs text-gray-600">CMP: 12345</p>
                  </div>
                </div>
              </div>

              {/* Notas y Advertencias */}
              <div className="text-xs text-gray-500 border-t pt-4 mt-6">
                <p>Notas:</p>
                <ul className="list-disc list-inside">
                  <li>Esta receta tiene validez de 7 días desde su emisión</li>
                  <li>Conserve este documento para futuras consultas</li>
                  <li>Siga estrictamente las indicaciones médicas</li>
                </ul>
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={() => handlePrintPrescription(prescription)}
                className="w-full sm:w-auto"
              >
                <Printer className="w-4 h-4 mr-2" /> Imprimir Receta
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}