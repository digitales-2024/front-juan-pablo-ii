"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { PatientBasicInfo } from "../_components/PatientBasicInfo";
import { MedicalBackground } from "../_components/MedicalBackground";
import { MedicalHistory } from "../_components/MedicalHistory";
import { PrescriptionModal } from "../_components/PrescriptionModal";
import { PERSONAL_MEDICO, SUCURSAL } from "../constants";
import type { Paciente, HistorialItem, Servicio } from "../types";

export default function UpdateHistorySheet() {
  const { historyId } = useParams();
  console.log("ID de la historia:", historyId);

  const [paciente, _setPaciente] = useState<Paciente>({
    id: historyId as string,
    nombre: "Juan",
    apellido: "Pérez",
    dni: "12345678",
    telefono: "123-456-7890",
    correo: "juan@example.com",
    direccion: "Calle Principal 123",
    foto: "https://pub-c8a9c1f826c540b981f5cfb49c3a55ea.r2.dev/c39396cb-84bd-4f08-b56e-356107809ba9.png",
  });

  const [historialMedico, setHistorialMedico] = useState<HistorialItem[]>([
    { titulo: "Antecedentes", contenido: "No relevant history" },
    { titulo: "Alergias", contenido: "None known" },
    { titulo: "Enfermedades Crónicas", contenido: "Hypertension" },
    { titulo: "Cirugías Previas", contenido: "Appendectomy 2018" },
  ]);

  const [servicios, setServicios] = useState<Servicio[]>([
    {
      serviceId: ": Tratamiento Dermatologico",
      staffId: PERSONAL_MEDICO,
      branchId: SUCURSAL,
      prescription: true,
      prescriptionId: "RX001",
      prescriptionTitle: "Tratamiento para hipertensión",
      prescriptionDescription:
        "Medicación diaria para controlar la presión arterial",
      prescriptionItems: [
        { nombre: "Losartan", dosis: "50mg", frecuencia: "Una vez al día" },
        { nombre: "Amlodipino", dosis: "5mg", frecuencia: "Una vez al día" },
      ],
      description: "el pacciente presenta una erupcion en la piel...",
      medicalLeave: false,
      newImages: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxbgoMzx7izKzehJBf1248szuAVwH8-F-crA&s",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-unksKExUrmuNTnD4pSfPAfPVrHVKOf9stg&s",
      ],
    },
  ]);

  const [selectedPrescription, setSelectedPrescription] =
    useState<Servicio | null>(null);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PatientBasicInfo paciente={paciente} />

      <MedicalBackground
        historialMedico={historialMedico}
        setHistorialMedico={setHistorialMedico}
      />

      <MedicalHistory
        servicios={servicios}
        setServicios={setServicios}
        setSelectedPrescription={setSelectedPrescription}
        setIsPrescriptionModalOpen={setIsPrescriptionModalOpen}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />

      <PrescriptionModal
        isOpen={isPrescriptionModalOpen}
        setIsOpen={setIsPrescriptionModalOpen}
        prescription={selectedPrescription}
        paciente={paciente}
      />
    </div>
  );
}