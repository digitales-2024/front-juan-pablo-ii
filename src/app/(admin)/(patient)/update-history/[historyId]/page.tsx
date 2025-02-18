"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { PatientBasicInfo } from "../_components/PatientBasicInfo";
import { MedicalBackground } from "../_components/MedicalBackground";
import { UpdateMedicalHistoryPatient } from "../_components/UpdateMedicalHistoryPatient";
//import { PrescriptionModal } from "../_components/PrescriptionModal";
import { PERSONAL_MEDICO, SUCURSAL } from "../_interfaces/constants";
import type { Servicio } from "../_interfaces/types";
import { useUpdateHistory } from "../_hook/useUpdateHistory";
import LoadingCategories from "./loading";

export default function UpdateHistorySheet() {
  const { historyId } = useParams();
  const {
    useMedicalHistoryById,
    usePatientById,
    useBranchesData,
    useStaffData,
    useServicesData,
  } = useUpdateHistory();

  // Primera consulta: Obtener historia médica
  const { data: medicalHistoryData, isLoading: isLoadingHistory } =
    useMedicalHistoryById(historyId as string);

  console.log("historia medica de paciente en el componente page ", medicalHistoryData);

  // Segunda consulta: Obtener paciente solo cuando tengamos medicalHistoryData
  const { data: patientData, isLoading: isLoadingPatient } = usePatientById(
    medicalHistoryData?.patientId ?? ""
  );

  const { data: branchesData, isLoading: isLoadingBranch } = useBranchesData();

  const { data: staffData, isLoading: isLoadingStaff } = useStaffData();

  const { data: sercivesData, isLoading: isLoadingServices } =
    useServicesData();

  // Mostrar loading mientras se obtienen los datos
  if (isLoadingHistory|| isLoadingBranch||isLoadingStaff|| isLoadingServices || isLoadingPatient) {
    return <LoadingCategories />;
  }

  //funciones que aun no se usaran  primero las anterirores
  /*  const [servicios, setServicios] = useState<Servicio[]>([
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
        {
          nombre: "Consulta Dermatológica",
          descripcion: "Revisión de la piel",
          precio: 100,
        },
        {
          nombre: "Análisis de Sangre",
          descripcion: "Examen completo",
          precio: 200,
        },
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
 */

  //fin
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center">Historia Médica</h1>

      {patientData && <PatientBasicInfo paciente={patientData} />}

      {medicalHistoryData && (
        <MedicalBackground historialMedico={medicalHistoryData} />
      )}

      {/*   <UpdateMedicalHistoryPatient
        servicios={servicios}
        setServicios={setServicios}
        setSelectedPrescription={setSelectedPrescription}
        setIsPrescriptionModalOpen={setIsPrescriptionModalOpen}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      /> */}

      {/*    <PrescriptionModal
        isOpen={isPrescriptionModalOpen}
        setIsOpen={setIsPrescriptionModalOpen}
        prescription={selectedPrescription}
        paciente={paciente}
      /> */}
    </div>
  );
}
