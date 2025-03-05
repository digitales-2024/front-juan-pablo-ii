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
        logoImg.style.width = "140px"; // Logo más grande
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

      // Aplicar estilos mejorados para PDF - Más profesional y compacto
      const elementsToStyle = clonedContent.querySelectorAll("div, table, h4, p, th, td");
      elementsToStyle.forEach((el: HTMLElement) => {
        if (el.tagName === "H4") {
          el.style.color = "hsl(197, 99%, 45%)"; // Color específico
          el.style.fontSize = "14px";
          el.style.marginBottom = "6px"; // Menos espacio
          el.style.borderBottom = "none"; 
          el.style.paddingBottom = "3px";
          el.style.fontWeight = "600";
        } else if (el.classList.contains("bg-gray-50")) {
          el.style.background = "#f8faff"; // Azul muy suave
          el.style.borderRadius = "4px";
          el.style.border = "none"; 
          el.style.padding = "8px"; // Menos padding
        } else if (el.tagName === "TABLE") {
          el.style.borderCollapse = "collapse"; // Más compacto
          el.style.width = "100%";
          el.style.fontSize = "10px"; // Más pequeña para compactar
        } else if (el.tagName === "TH") {
          el.style.backgroundColor = "hsl(197, 85%, 96%)"; // Color más suave
          el.style.color = "hsl(197, 99%, 35%)"; // Color oscuro para contraste
          el.style.padding = "6px 4px"; // Menos padding
          el.style.fontSize = "10px";
          el.style.fontWeight = "500"; 
        } else if (el.tagName === "TD") {
          el.style.padding = "4px";
          el.style.borderBottom = "1px solid #f0f7ff"; // Borde muy sutil
          el.style.fontSize = "10px";
        }
      });

      // Eliminar bordes agresivos
      const borderElements = clonedContent.querySelectorAll(".border-b, .border-t");
      borderElements.forEach((el: HTMLElement) => {
        el.classList.remove("border-b", "border-t");
        el.style.borderBottom = "none";
        el.style.borderTop = "none";
        el.style.paddingBottom = "10px"; // Menos espacio
        el.style.marginBottom = "10px"; // Menos margen
      });

      // Agregar título centralizado para la receta - Más arriba y compacto
      const header = document.createElement("div");
      header.style.textAlign = "center";
      header.style.marginBottom = "8px"; // Menos espacio
      header.style.paddingBottom = "0";
      header.style.marginTop = "-10px"; // Moverlo más arriba
      
      const title = document.createElement("h2"); 
      title.textContent = "NOTA MÉDICA";
      title.style.fontSize = "18px"; // Más pequeño
      title.style.fontWeight = "bold";
      title.style.color = "hsl(197, 99%, 45%)"; // Color específico
      title.style.margin = "0";
      title.style.fontFamily = "Arial, sans-serif";
      
      header.appendChild(title);
      clonedContent.insertBefore(header, clonedContent.firstChild);

      // Mejorar la sección del médico tratante
      const doctorInfo = clonedContent.querySelector('.text-right');
      if (doctorInfo) {
        const doctorTitle = doctorInfo.querySelector('h4');
        if (doctorTitle) {
          doctorTitle.textContent = "Médico"; // Más simple
          doctorTitle.style.fontSize = "11px";
          doctorTitle.style.color = "hsl(197, 99%, 45%)";
          doctorTitle.style.fontWeight = "500";
          doctorTitle.style.marginBottom = "2px";
        }
      }

      // Limpiar los textos de los encabezados (quitar los iconos)
      const sectionTitles = clonedContent.querySelectorAll('h4');
      sectionTitles.forEach((title) => {
        if (title.textContent?.includes("👤")) {
          title.textContent = "Datos del Paciente";
        } else if (title.textContent?.includes("🔍")) {
          title.textContent = "Diagnóstico";
        } else if (title.textContent?.includes("⚕️")) {
          title.textContent = "Servicios Recetados";
        } else if (title.textContent?.includes("📝")) {
          title.textContent = "Medicamentos Recetados";
        }
      });

      // Optimizar contenedor principal - Más compacto
      clonedContent.style.fontFamily = "Arial, sans-serif";
      clonedContent.style.padding = "10mm"; // Menos padding
      clonedContent.style.fontSize = "10px"; // Más pequeño
      clonedContent.style.background = "#ffffff"; // Sin gradiente
      clonedContent.style.width = "190mm"; // Un poco más ancho
      clonedContent.style.boxSizing = "border-box";
      clonedContent.style.borderRadius = "0";

      // Ajustar espaciado entre secciones principales
      const mainSections = clonedContent.querySelectorAll('.space-y-6, .space-y-4');
      mainSections.forEach((section: HTMLElement) => {
        section.classList.remove('space-y-6', 'space-y-4');
        section.classList.add('space-y-3'); // Menos espacio
        section.style.gap = "8px";
      });

      // Ajustar espacios en el grid
      const gridDivs = clonedContent.querySelectorAll('.grid.gap-4');
      gridDivs.forEach((grid: HTMLElement) => {
        grid.classList.remove('gap-4');
        grid.classList.add('gap-2'); // Menos gap
      });

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
      
      // Añadir borde decorativo más delicado en cada página
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        
        // Borde más sutil con color personalizado
        pdf.setDrawColor(0, 157, 209); // Equivalente a hsl(197, 99%, 45%) en RGB
        pdf.setLineWidth(0.3); // Línea más fina
        
        // Borde completo pero sutil
        pdf.rect(5, 5, pdfWidth - 10, pdf.internal.pageSize.getHeight() - 10);
        
        // Añadir pie de página
        pdf.setFontSize(7); // Más pequeño
        pdf.setTextColor(120, 120, 120);
        pdf.text(
          `Nota médica generada el ${new Date().toLocaleDateString("es-PE")}`,
          pdfWidth / 2,
          pdf.internal.pageSize.getHeight() - 5,
          { align: "center" }
        );
        
        // Si hay más de una página, añadir indicador
        if (pageCount > 1) {
          pdf.text(
            `Página ${i} de ${pageCount}`,
            pdfWidth / 2,
            pdf.internal.pageSize.getHeight() - 8,
            { align: "center" }
          );
        }
      }
      
      // Guardar PDF
      pdf.save(`Nota_Medica_${patient?.name}_${patient?.lastName}.pdf`);
      
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="max-h-[calc(100dvh-8rem)] overflow-y-auto p-2 sm:p-4">
          <DialogHeader>
            <DialogTitle>Nota Médica</DialogTitle>
          </DialogHeader>
          <div className="space-y-6" ref={prescriptionRef}>
            {/* Encabezado de la Receta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b pb-4">
              <div className="flex items-start space-x-2 sm:space-x-4">
                <div className="w-24 sm:w-32 flex-shrink-0">
                  <Image
                    src={logoNota}
                    alt="Logo Hospital"
                    className="w-full h-auto object-contain"
                    width={140}
                    height={70}
                  />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium">{branchInfo?.name}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{branchInfo?.address}</p>
                </div>
              </div>
              
              <div className="text-right mt-2 sm:mt-0">
                <h4 className="font-semibold">Médico Tratante</h4>
                <p className="text-xs sm:text-sm">{staffInfo?.name}</p>
                <p className="text-xs sm:text-sm text-gray-600">Cod: {staffInfo?.cmp}</p>
              </div>
            </div>

            {/* Datos del Paciente */}
            <div className="border-b pb-4">
              <h4 className="font-semibold mb-2">👤 Datos del Paciente</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs sm:text-sm">
                    <span className="font-medium">Nombre: </span>
                    {patient.name} {patient.lastName}
                  </p>
                  <p className="text-xs sm:text-sm">
                    <span className="font-medium">DNI: </span>
                    {patient.dni}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm">
                    <span className="font-medium">Teléfono: </span>
                    {patient.phone}
                  </p>
                  <p className="text-xs sm:text-sm">
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
                  <h4 className="font-semibold mb-2">🔍 Diagnóstico</h4>
                  <p className="text-xs sm:text-sm bg-gray-50 p-3 rounded">
                    {prescription.description}
                  </p>
                </div>
              )}

              {/* Servicios Adicionales */}
              {prescription.prescriptionServices?.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">⚕️ Servicios Recetados</h4>
                  <div className="bg-gray-50 p-2 sm:p-3 rounded overflow-x-auto">
                    <table className="w-full min-w-[300px]">
                      <thead>
                        <tr className="text-xs sm:text-sm text-gray-600 border-b">
                          <th className="text-left py-2">Servicio</th>
                          <th className="text-left py-2">Cantidad</th>
                          <th className="text-left py-2">Descripción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prescription.prescriptionServices.map((item) => (
                          <tr key={item.id} className="border-b last:border-0">
                            <td className="py-2 text-xs sm:text-sm">{item.name}</td>
                            <td className="py-2 text-xs sm:text-sm">{item.quantity} Uni</td>
                            <td className="py-2 text-xs sm:text-sm">{item.description}</td>
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
                  <h4 className="font-semibold mb-2">📝 Medicamentos Recetados</h4>
                  <div className="bg-gray-50 p-2 sm:p-3 rounded overflow-x-auto">
                    <table className="w-full min-w-[300px]">
                      <thead>
                        <tr className="text-xs sm:text-sm text-gray-600 border-b">
                          <th className="text-left py-2">Medicamento</th>
                          <th className="text-left py-2">Cantidad</th>
                          <th className="text-left py-2">Descripción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prescription.prescriptionMedicaments.map((item) => (
                          <tr key={item.id} className="border-b last:border-0">
                            <td className="py-2 text-xs sm:text-sm">{item.name}</td>
                            <td className="py-2 text-xs sm:text-sm">{item.quantity} Uni</td>
                            <td className="py-2 text-xs sm:text-sm">{item.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Fecha y Firma */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mt-4">
                <div className="mb-3 sm:mb-0">
                  <span className="text-xs sm:text-sm text-gray-600">
                    Fecha de emisión: {formatDate(prescription.registrationDate)}
                  </span>
                </div>
                <Button
                  onClick={handlePrintPrescription}
                  disabled={isGeneratingPDF}
                  className="w-full sm:w-auto"
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
                  <p className="text-xs sm:text-sm font-medium">Firma del Médico</p>
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
