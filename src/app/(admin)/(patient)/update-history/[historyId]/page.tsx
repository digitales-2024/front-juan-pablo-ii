"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { PatientBasicInfo } from "../_components/PatientBasicInfo";
import { MedicalBackground } from "../_components/MedicalBackground";
import { UpdateMedicalHistoryPatient } from "../_components/UpdateMedicalHistoryPatient";
import { PrescriptionModal } from "../_components/PrescriptionModal";
import { useUpdateHistory } from "../_hook/useUpdateHistory";
import LoadingCategories from "./loading";

export default function UpdateHistorySheet() {
  const { historyId } = useParams();
  const {
    useDataPatientHistoryUpdatePrescription,
    useBranchesData,
    useStaffData,
    useServicesData,
    useProductData,
  } = useUpdateHistory();

  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [selectedUpdateId, setSelectedUpdateId] = useState<string | undefined>();

  const handlePrescriptionView = (updateId: string) => {
    setSelectedUpdateId(updateId);
    setIsPrescriptionModalOpen(true);
  };

  // Primera consulta: Obtener historia médica
  const { data, isLoading: isLoadingHistory, refetch: refetchHistory } =
    useDataPatientHistoryUpdatePrescription(historyId as string);

  // 2. Función intermedia para refrescar datos
  const handleHistoryUpdate = async () => {
    await refetchHistory();
  };

  const { data: branchesData, isLoading: isLoadingBranch } = useBranchesData();

  const { data: staffData, isLoading: isLoadingStaff } = useStaffData();

  const { data: servicesData, isLoading: isLoadingServices } =
    useServicesData();

  const { data: productsData, isLoading: isLoadingProducts } = useProductData();

  if (
    isLoadingHistory ||
    isLoadingBranch ||
    isLoadingStaff ||
    isLoadingServices ||
    isLoadingProducts
  ) {
    return <LoadingCategories />;
  }

  // 3. Verificar si hay datos
  if (!data) {
    return <div>No se encontraron datos</div>;
  }

  // 4. Desestructurar los datos retornados
  const [medicalHistory, patient, updateHistories, prescriptions] = data;

  //fin
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center">Historia Médica</h1>

      {patient && <PatientBasicInfo paciente={patient} />}

      {medicalHistory && <MedicalBackground historialMedico={medicalHistory} />}

      {/* 3. Componente de actualización de historia médica */}
      <UpdateMedicalHistoryPatient
        // Datos de actualizaciones y recetas
        updateHistories={updateHistories ?? []}
        prescriptions={prescriptions ?? []}
        // Datos de catálogos
        services={servicesData ?? []}
        staff={staffData ?? []}
        branches={branchesData ?? []}
        products={productsData ?? []}
        // ID necesarios para crear nuevos registros
        patientId={patient?.id}
        medicalHistoryId={medicalHistory?.id}
        onPrescriptionView={handlePrescriptionView} 
        onHistoryUpdate={handleHistoryUpdate} // Nuevo prop
      />

      {/* 4. Modal de recetas */}
      <PrescriptionModal
        isOpen={isPrescriptionModalOpen}
        setIsOpen={setIsPrescriptionModalOpen}
        prescriptions={prescriptions ?? []}
        staff={staffData ?? []}
        branches={branchesData ?? []}
        products={productsData ?? []}
        services={servicesData ?? []}
        patient={patient}
        updateHistoryId={selectedUpdateId}
      />
    </div>
  );
}
