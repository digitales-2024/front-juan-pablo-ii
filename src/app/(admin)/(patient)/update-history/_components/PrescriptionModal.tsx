import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import {
  Branch,
  Patient,
  PrescriptionResponse,
  Product,
  Service,
  Staff,
} from "../_interfaces/updateHistory.interface";

interface PrescriptionModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  prescriptions: PrescriptionResponse[];
  staff: Staff[];
  branches: Branch[];
  products: Product[];
  services: Service[];
  patient?: Patient;
  updateHistoryId?: string;
}

export function PrescriptionModal({
  isOpen,
  setIsOpen,
  prescriptions,
  staff,
  branches,
  patient,
  updateHistoryId,
}: PrescriptionModalProps) {
  // Encontrar la receta correspondiente
  const prescription = prescriptions.find(
    (p) => p.updateHistoryId === updateHistoryId
  );

  // Encontrar datos del médico
  const getStaffInfo = (staffId: string) => {
    const staffMember = staff.find((s) => s.id === staffId);
    return staffMember
      ? {
          name: `${staffMember.name} ${staffMember.lastName}`,
          cmp: `${staffMember.cmp}`,
        }
      : null;
  };

  // Encontrar datos de la sucursal
  const getBranchInfo = (branchId: string) =>
    branches.find((b) => b.id === branchId);

  const handlePrintPrescription = () => {
    if (prescription) {
      console.log("Imprimiendo receta:", prescription);
      // Implementar lógica de impresión
    }
  };

  // Agregar función de formato de fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString.replace(' ', 'T'));
    
    const formatoFecha = date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });

    return `${formatoFecha}`;
  };

  if (!prescription || !patient) return null;

  const staffInfo = getStaffInfo(prescription.staffId);
  const branchInfo = getBranchInfo(prescription.branchId);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl">
        <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nota Médica</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 p-4">
            {/* Encabezado de la Receta */}
            <div className="grid grid-cols-2 gap-4 border-b pb-4">
              <div className="flex items-start space-x-4">
                <img
                  src="https://pub-c8a9c1f826c540b981f5cfb49c3a55ea.r2.dev/1fb4f92d-ff2d-4b39-a3da-9c3139a9c2d0.webp"
                  alt="Logo Hospital"
                  className="w-32 object-contain"
                />
                <div>
                  <p className="text-sm font-medium">{branchInfo?.name}</p>
                  <p className="text-sm text-gray-600">{branchInfo?.address}</p>
                </div>
              </div>
              <div className="text-right">
                <h4 className="font-semibold">Médico Tratante</h4>
                <p className="text-sm">{staffInfo?.name}</p>
                <p className="text-sm text-gray-600">
                  Cod: {staffInfo?.cmp}
                </p>
              </div>
            </div>

            {/* Datos del Paciente */}
            <div className="border-b pb-4">
              <h4 className="font-semibold mb-2">Datos del Paciente</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Nombre: </span>
                    {patient.name} {patient.lastName}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">DNI: </span>
                    {patient.dni}
                  </p>
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Teléfono: </span>
                    {patient.phone}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Dirección: </span>
                    {patient.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Medicamentos y Servicios */}
            <div className="space-y-4">
              {/* Descripción/Diagnóstico */}
              {prescription.description && (
                <div>
                  <h4 className="font-semibold mb-2">Diagnóstico</h4>
                  <p className="text-sm bg-gray-50 p-3 rounded">
                    {prescription.description}
                  </p>
                </div>
              )}

              {/* Servicios Adicionales */}
              {prescription.prescriptionServices?.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Servicios Recetados</h4>
                  <div className="bg-gray-50 p-3 rounded">
                    <table className="w-full">
                      <thead>
                        <tr className="text-sm text-gray-600 border-b">
                          <th className="text-left py-2">Servicio</th>
                          <th className="text-left py-2">Cantidad</th>
                          <th className="text-left py-2">Descripción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prescription.prescriptionServices.map((item) => (
                          <tr key={item.id} className="border-b last:border-0">
                            <td className="py-2">{item.name}</td>
                            <td className="py-2">{item.quantity} Uni</td>
                            <td className="py-2">{item.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Medicamentos Recetados */}
              {prescription.prescriptionMedicaments?.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Medicamentos Recetados</h4>
                  <div className="bg-gray-50 p-3 rounded">
                    <table className="w-full">
                      <thead>
                        <tr className="text-sm text-gray-600 border-b">
                          <th className="text-left py-2">Medicamento</th>
                          <th className="text-left py-2">Cantidad</th>
                          <th className="text-left py-2">Descripción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prescription.prescriptionMedicaments.map((item) => (
                          <tr key={item.id} className="border-b last:border-0">
                            <td className="py-2">{item.name}</td>
                            <td className="py-2">{item.quantity} Uni</td>
                            <td className="py-2">{item.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Fecha y Firma */}
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-sm text-gray-600">
                    Fecha de emisión:{" "}
                    {formatDate(prescription.registrationDate)}
                  </span>
                </div>
                <Button onClick={handlePrintPrescription}>
                  <Printer className="w-4 h-4 mr-2" /> Imprimir Receta
                </Button>
              </div>

              <div className="text-right">
                <div className="border-t border-black mt-16 pt-2 inline-block">
                  <p className="text-sm font-medium">Firma del Médico</p>
                  <p className="text-xs text-gray-600">{staffInfo?.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
