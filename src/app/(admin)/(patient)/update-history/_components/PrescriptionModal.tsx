import { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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
import logoNota from "@/assets/images/logoNota.jpg";
import Image from "next/image";

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
  const prescriptionRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

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

  const handlePrintPrescription = async () => {
    if (!prescriptionRef.current) return;
    setIsGeneratingPDF(true);

    try {
      // Crear una nueva versión del contenido optimizada para PDF
      const clonedContent = prescriptionRef.current.cloneNode(true) as HTMLElement;
      
      // Remover el botón de impresión
      const buttonElement = clonedContent.querySelector("button");
      if (buttonElement) {
        const parentElement = buttonElement.closest(".flex.justify-between");
        if (parentElement) {
          parentElement.removeChild(buttonElement);
        }
      }

      // Configurar el contenedor para captura
      const tempContainer = document.createElement("div");
      tempContainer.appendChild(clonedContent);
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "-9999px";
      tempContainer.style.width = "210mm"; // Ancho A4
      document.body.appendChild(tempContainer);

      // Asegurar que la imagen local se carga correctamente
      const logoImg = clonedContent.querySelector('img[alt="Logo Hospital"]') as HTMLImageElement;
      if (logoImg) {
        logoImg.style.width = "80px";
        logoImg.style.height = "auto";
        
        // Asegurar que la imagen esté cargada
        await new Promise<void>((resolve) => {
          if (logoImg.complete) {
            resolve();
          } else {
            logoImg.onload = () => resolve();
            logoImg.onerror = () => {
              console.error("Error al cargar la imagen del logo");
              resolve();
            };
          }
        });
      }

      // Aplicar estilos mejorados para PDF
      const elementsToStyle = clonedContent.querySelectorAll("div, table, h4, p, th, td");
      elementsToStyle.forEach((el: HTMLElement) => {
        if (el.tagName === "H4") {
          el.style.color = "hsl(216, 92%, 60%)";
          el.style.fontSize = "14px";
          el.style.marginBottom = "5px";
          el.style.borderBottom = "1px solid hsl(216, 92%, 80%)";
          el.style.paddingBottom = "3px";
        } else if (el.classList.contains("bg-gray-50")) {
          el.style.background = "#f0f7ff";
          el.style.borderRadius = "4px";
          el.style.border = "1px solid #d1e5ff";
          el.style.padding = "6px";
        } else if (el.tagName === "TABLE") {
          el.style.borderCollapse = "collapse";
          el.style.width = "100%";
          el.style.fontSize = "10px";
        } else if (el.tagName === "TH") {
          el.style.backgroundColor = "hsl(216, 92%, 95%)";
          el.style.color = "hsl(216, 92%, 40%)";
          el.style.padding = "4px";
          el.style.fontSize = "10px";
        } else if (el.tagName === "TD") {
          el.style.padding = "3px";
          el.style.borderBottom = "1px solid #eee";
          el.style.fontSize = "10px";
        }
      });

      // Agregar título centralizado para la receta
      const header = document.createElement("div");
      header.style.textAlign = "center";
      header.style.marginBottom = "8px";
      header.style.borderBottom = "2px solid hsl(216, 92%, 60%)";
      header.style.paddingBottom = "4px";
      
      const title = document.createElement("h3");
      title.textContent = "NOTA MÉDICA";
      title.style.fontSize = "16px";
      title.style.fontWeight = "bold";
      title.style.color = "hsl(216, 92%, 60%)";
      title.style.margin = "0";
      
      header.appendChild(title);
      clonedContent.insertBefore(header, clonedContent.firstChild);

      // Optimizar contenedor principal
      clonedContent.style.fontFamily = "Arial, sans-serif";
      clonedContent.style.padding = "10mm";
      clonedContent.style.fontSize = "11px";
      clonedContent.style.background = "linear-gradient(to bottom, white, #f8faff)";
      clonedContent.style.width = "190mm";
      clonedContent.style.boxSizing = "border-box";
      clonedContent.style.borderRadius = "0";

      // Capturar como imagen
      const canvas = await html2canvas(clonedContent, {
        scale: 2,
        logging: false,
        backgroundColor: "#ffffff",
      });
      
      document.body.removeChild(tempContainer);
      
      // Generar PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      // Calcular altura proporcional
      const aspectRatio = canvas.height / canvas.width;
      const pdfHeight = pdfWidth * aspectRatio;
      
      // Añadir imagen al PDF
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        0,
        pdfWidth,
        pdfHeight
      );
      
      // Manejar múltiples páginas si es necesario
      if (pdfHeight > 287) {
        let heightLeft = pdfHeight - 287;
        let position = -287;
        
        while (heightLeft > 0) {
          pdf.addPage();
          pdf.addImage(
            canvas.toDataURL("image/png"),
            "PNG",
            0,
            position,
            pdfWidth,
            pdfHeight
          );
          
          position -= 287;
          heightLeft -= 287;
        }
      }
      
      // Añadir borde decorativo en cada página
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setDrawColor(65, 105, 225);
        pdf.setLineWidth(0.5);
        pdf.rect(5, 5, pdfWidth - 10, pdf.internal.pageSize.getHeight() - 10);
        
        // Añadir pie de página
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text(
          `Receta médica generada el ${new Date().toLocaleDateString("es-PE")} - Página ${i} de ${pageCount}`,
          pdfWidth / 2,
          pdf.internal.pageSize.getHeight() - 5,
          { align: "center" }
        );
      }
      
      // Guardar PDF
      pdf.save(`Receta_Medica_${patient?.name}_${patient?.lastName}.pdf`);
      
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Ocurrió un error al generar el PDF. Por favor intente nuevamente.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Agregar función de formato de fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString.replace(" ", "T"));

    const formatoFecha = date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
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
          <div className="space-y-6 p-4" ref={prescriptionRef}>
            {/* Encabezado de la Receta */}
            <div className="grid grid-cols-2 gap-4 border-b pb-4">
              <div className="flex items-start space-x-4">
                <Image
               src={logoNota}
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
                <p className="text-sm text-gray-600">Cod: {staffInfo?.cmp}</p>
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
                <Button
                  onClick={handlePrintPrescription}
                  disabled={isGeneratingPDF}
                  className="ml-auto"
                >
                  {isGeneratingPDF ? (
                    "Generando PDF..."
                  ) : (
                    <>
                      <Printer className="w-4 h-4 mr-2" /> Imprimir Nota Medica
                    </>
                  )}
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
