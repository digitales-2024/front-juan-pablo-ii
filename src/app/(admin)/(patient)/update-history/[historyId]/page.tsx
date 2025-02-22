"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { PatientBasicInfo } from "../_components/PatientBasicInfo";
import { MedicalBackground } from "../_components/MedicalBackground";
import { UpdateMedicalHistoryPatient } from "../_components/UpdateMedicalHistoryPatient";
import { PrescriptionModal } from "../_components/PrescriptionModal";
//import { PERSONAL_MEDICO, SUCURSAL } from "../_interfaces/constants";
//import type { Servicio } from "../_interfaces/types";
import { useUpdateHistory } from "../_hook/useUpdateHistory";
import LoadingCategories from "./loading";

export default function UpdateHistorySheet() {
  const { historyId } = useParams();
  const {
    useDataPatientHistoryUpdatePrescription,
    //useMedicalHistoryById,
    //usePatientById,
    //useUpdateHistoryById,
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
  const { data, isLoading: isLoadingHistory } =
    useDataPatientHistoryUpdatePrescription(historyId as string);
  console.log("🚀 ~ UpdateHistorySheet ~ data:", data);
  const { data: branchesData, isLoading: isLoadingBranch } = useBranchesData();
  console.log("🚀 ~ UpdateHistorySheet ~ branchesData:", branchesData);
  /*  branchesData: {
    id: string;
    name: string;
    address: string;
    phone?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}[] | undefined */
  const { data: staffData, isLoading: isLoadingStaff } = useStaffData();
  console.log("🚀 ~ UpdateHistorySheet ~ staffData:", staffData);
  /*   (property) StaffData: {
    id: string;
    staffTypeId: string;
    userId: string | null;
    name: string;
    email: string;
    phone: string;
    lastName: string;
    dni: string;
    birth: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    staffType: {
        name?: string;
    };
} */
  const { data: servicesData, isLoading: isLoadingServices } =
    useServicesData();
  console.log("🚀 ~ UpdateHistorySheet ~ servicesData:", servicesData);
  /*   servicesData: {
    id: string;
    name: string;
    description?: string;
    price: number;
    serviceTypeId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}[] | undefined */

  const { data: productsData, isLoading: isLoadingProducts } = useProductData();
  console.log("🚀 ~ UpdateHistorySheet ~ productsData:", productsData);
  //fin
  /* onst productsData: {
    id: string;
    categoriaId: string;
    tipoProductoId: string;
    name: string;
    precio: number;
    unidadMedida: string;
    proveedor: string;
    uso: string;
    usoProducto: string;
    description: string;
    ... 6 more ...;
    createdAt: string;
}[] |  */

  // Mostrar loading mientras se obtienen los datos
  // 2. Verificar estado de carga
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

  // 5. Logging de datos para debugging
  console.log("🏥 Historia Médica:", medicalHistory);
  console.log("👤 Datos del Paciente:", patient);
  console.log("📝 Historial de Actualizaciones:", updateHistories);
  //export type UpdateHistoryResponseImage = UpdateHistory & { images?: MeidicalHistoryImage[] };

  /* UpdateHistory: 
  id: string;
  patientId: string;
  serviceId: string;
  staffId: string;
  branchId: string;
  medicalHistoryId: string;
  prescription: boolean;
  prescriptionId?: string; 
  description?: string;
  medicalLeave: boolean; 
  medicalLeaveStartDate?: string;  
  medicalLeaveEndDate?: string; 
  medicalLeaveDays?: number; 
  leaveDescription?: string;  
  isActive: boolean; */

  console.log("💊 Recetas Médicas:", prescriptions);
  /* export type PrescriptionItem = {
    id: string;
    name: string;
    quantity: number;
    description: string;
  } */

  /* type PrescriptionResponse = {
    id: string;
    updateHistoryId: string;
    branchId: string;
    staffId: string;
    patientId: string;
    registrationDate: string;
    prescriptionMedicaments: PrescriptionItem[];
    prescriptionServices: PrescriptionItem[];
    description: string;
    purchaseOrderId: string;
    isActive: boolean;
}
 */
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
