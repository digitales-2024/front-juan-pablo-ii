"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { PatientBasicInfo } from "../_components/PatientBasicInfo";
import { MedicalBackground } from "../_components/MedicalBackground";
import { MedicalHistory } from "../_components/MedicalHistory";
import { PrescriptionModal } from "../_components/PrescriptionModal";
import { PERSONAL_MEDICO, SUCURSAL } from "../_interfaces/constants";
import type { Patient, Servicio } from "../_interfaces/types";
import { HistorialItem } from "@/app/(admin)/(proces)/medical-records/[id]/page";

export default function UpdateHistorySheet() {
  const { historyId } = useParams();
  console.log("ID de la historia:", historyId);

  const [paciente, _setPaciente] = useState<Patient>({
    id: historyId as string,
    name: "Juan",
    lastName: "Pérez",
    dni: "12345678",
    birthDate: "1990-01-01",
    gender: "Masculino",
    address: "Calle Principal 123",
    phone: "123-456-7890",
    email: "juan@example.com",
    emergencyContact: "María Pérez",
    emergencyPhone: "098-765-4321",
    healthInsurance: "Seguro Salud S.A.",
    maritalStatus: "Soltero",
    occupation: "Ingeniero",
    workplace: "Empresa XYZ",
    bloodType: "O+",
    primaryDoctor: "Dr. Smith",
    language: "Español",
    notes: "Paciente con antecedentes de hipertensión.",
    patientPhoto:
      "https://pub-c8a9c1f826c540b981f5cfb49c3a55ea.r2.dev/c39396cb-84bd-4f08-b56e-356107809ba9.png",
    isActive: true
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
      services: [
        { nombre: "Consulta Dermatológica", descripcion: "Revisión de la piel", precio: 100 },
        { nombre: "Análisis de Sangre", descripcion: "Examen completo", precio: 200 },
      ],
      description: "el pacciente presenta una erupcion en la piel...",
      medicalLeave: false,
      newImages: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxbgoMzx7izKzehJBf1248szuAVwH8-F-crA&s",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-unksKExUrmuNTnD4pSfPAfPVrHVKOf9stg&s",
      ],
      date: "2025-02-02",
    },
  ]);

  const [selectedPrescription, setSelectedPrescription] =
    useState<Servicio | null>(null);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center">Historia Médica</h1>
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