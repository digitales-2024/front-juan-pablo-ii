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
        logoImg.style.width = "120px"; // Logo más grande
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

      // Aplicar estilos mejorados para PDF - Más amigable
      const elementsToStyle = clonedContent.querySelectorAll("div, table, h4, p, th, td");
      elementsToStyle.forEach((el: HTMLElement) => {
        if (el.tagName === "H4") {
          el.style.color = "hsl(197, 99%, 45%)"; // Nuevo color
          el.style.fontSize = "15px";
          el.style.marginBottom = "10px"; // Más espacio
          el.style.borderBottom = "none"; // Sin línea
          el.style.paddingBottom = "5px";
          el.style.fontWeight = "600";
        } else if (el.classList.contains("bg-gray-50")) {
          el.style.background = "#f0f8ff"; // Azul más suave
          el.style.borderRadius = "6px";
          el.style.border = "none"; // Sin borde
          el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"; // Sombra sutil
          el.style.padding = "12px";
        } else if (el.tagName === "TABLE") {
          el.style.borderCollapse = "separate";
          el.style.borderSpacing = "0 5px"; // Espacio entre filas
          el.style.width = "100%";
          el.style.fontSize = "11px";
        } else if (el.tagName === "TH") {
          el.style.backgroundColor = "hsl(197, 85%, 94%)"; // Color más suave
          el.style.color = "hsl(197, 99%, 25%)"; // Color oscuro para contraste
          el.style.padding = "8px";
          el.style.fontSize = "12px";
          el.style.fontWeight = "500"; // Menos negrita
          el.style.border = "none"; // Sin bordes
        } else if (el.tagName === "TD") {
          el.style.padding = "6px 8px";
          el.style.borderBottom = "1px solid #edf5f9"; // Borde muy sutil
          el.style.fontSize = "11px";
        }
      });

      // Eliminar bordes agresivos
      const borderElements = clonedContent.querySelectorAll(".border-b, .border-t");
      borderElements.forEach((el: HTMLElement) => {
        el.classList.remove("border-b", "border-t");
        el.style.borderBottom = "none";
        el.style.borderTop = "none";
        el.style.paddingBottom = "15px"; // Espacio en lugar de líneas
        el.style.marginBottom = "15px";
      });

      // Agregar título centralizado para la receta - Estilo más suave
      const header = document.createElement("div");
      header.style.textAlign = "center";
      header.style.marginBottom = "15px";
      header.style.paddingBottom = "8px";
      header.style.borderBottom = "none"; // Sin línea
      
      const title = document.createElement("h2"); // Usar h2 para más impacto
      title.textContent = "NOTA MÉDICA";
      title.style.fontSize = "22px";
      title.style.fontWeight = "bold";
      title.style.color = "hsl(197, 99%, 45%)"; // Color específico
      title.style.margin = "0";
      title.style.fontFamily = "Arial, sans-serif";
      title.style.letterSpacing = "1px"; // Espaciado entre letras
      
      header.appendChild(title);
      clonedContent.insertBefore(header, clonedContent.firstChild);

      // Mejorar la sección del médico tratante
      const doctorInfo = clonedContent.querySelector('.text-right');
      if (doctorInfo) {
        const doctorTitle = doctorInfo.querySelector('h4');
        if (doctorTitle) {
          doctorTitle.textContent = "Dr(a)."; // Simplificar
          doctorTitle.style.fontSize = "12px";
          doctorTitle.style.color = "#777777";
          doctorTitle.style.fontWeight = "normal";
          doctorTitle.style.marginBottom = "2px";
        }
      }

      // Optimizar contenedor principal
      clonedContent.style.fontFamily = "Arial, sans-serif";
      clonedContent.style.padding = "15mm";
      clonedContent.style.fontSize = "11px";
      clonedContent.style.background = "linear-gradient(to bottom, white, #f0f8ff)";
      clonedContent.style.width = "180mm";
      clonedContent.style.boxSizing = "border-box";
      clonedContent.style.borderRadius = "0";

      // Añadir pequeños toques visuales
      const sectionTitles = clonedContent.querySelectorAll('h4');
      sectionTitles.forEach((title) => {
        // Icono visual sutil usando caracterres Unicode
        if (title.textContent?.includes("Datos del Paciente")) {
          title.innerHTML = "👤 Datos del Paciente";
        } else if (title.textContent?.includes("Diagnóstico")) {
          title.innerHTML = "🔍 Diagnóstico";
        } else if (title.textContent?.includes("Servicios Recetados")) {
          title.innerHTML = "⚕️ Servicios Recetados";
        } else if (title.textContent?.includes("Medicamentos")) {
          title.innerHTML = "💊 Medicamentos Recetados";
        }
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
        
        // Pequeño detalle en las esquinas en lugar de borde completo
        const cornerSize = 15; // Tamaño de las esquinas
        const pageWidth = pdfWidth - 10;
        const pageHeight = pdf.internal.pageSize.getHeight() - 10;
        
        // Esquina superior izquierda
        pdf.line(5, 5, 5 + cornerSize, 5);
        pdf.line(5, 5, 5, 5 + cornerSize);
        
        // Esquina superior derecha
        pdf.line(pageWidth, 5, pageWidth - cornerSize, 5);
        pdf.line(pageWidth, 5, pageWidth, 5 + cornerSize);
        
        // Esquina inferior izquierda
        pdf.line(5, pageHeight, 5 + cornerSize, pageHeight);
        pdf.line(5, pageHeight, 5, pageHeight - cornerSize);
        
        // Esquina inferior derecha
        pdf.line(pageWidth, pageHeight, pageWidth - cornerSize, pageHeight);
        pdf.line(pageWidth, pageHeight, pageWidth, pageHeight - cornerSize);
        
        // Añadir pie de página
        pdf.setFontSize(8);
        pdf.setTextColor(120, 120, 120); // Gris más claro
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
            pdf.internal.pageSize.getHeight() - 10,
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
