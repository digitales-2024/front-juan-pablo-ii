"use client";

//import { useState } from "react";
import { useParams } from "next/navigation";
import { PatientBasicInfo } from "../_components/PatientBasicInfo";
import { MedicalBackground } from "../_components/MedicalBackground";
//import { UpdateMedicalHistoryPatient } from "../_components/UpdateMedicalHistoryPatient";
//import { PrescriptionModal } from "../_components/PrescriptionModal";
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
  } = useUpdateHistory();


  // Primera consulta: Obtener historia médica
  const { data, isLoading: isLoadingHistory } = useDataPatientHistoryUpdatePrescription(historyId as string);
  console.log("🚀 ~ UpdateHistorySheet ~ data:", data)
  const { data: branchesData, isLoading: isLoadingBranch } = useBranchesData();
  console.log("🚀 ~ UpdateHistorySheet ~ branchesData:", branchesData)
  const { data: staffData, isLoading: isLoadingStaff } = useStaffData();
  console.log("🚀 ~ UpdateHistorySheet ~ staffData:", staffData)
  const { data: servicesData, isLoading: isLoadingServices } = useServicesData();
  console.log("🚀 ~ UpdateHistorySheet ~ servicesData:", servicesData)

  
  
  //fin

  /*   🚀 ~ medicalHistory: {
    id: '5d344610-1aa2-46fd-91c8-ef9f97ce89d7',
    patientId: 'f399be91-d00f-496d-b97e-7a0294ce1f1d',
    fullName: 'hola12',
    medicalHistory: {
      fumador: 'si dice que lo controla xd',
      alergias: 'alergico a ...',
      cardiacos: 'TA ENAMORADO',
      antecedentes: 'AWEGASWFASWFAWEF',
      neurologicos: 'MUCHO PIENSA EN ELLA',
      cirugiasPrevias: 'Appendectomy 2018',
      enfermedadesCronicas: 'Hypertension'
    },
    description: 'First patient consultation',
    isActive: true,
    createdAt: '2025-02-14 14:57:48',
    updatedAt: '2025-02-18 12:08:21',
    updates: [
      {
        id: '01c51058-4e4b-4e3b-af1c-b2933825d811',
        service: 'consulta general',
        staff: 'MIguel asdasda',
        branch: 'cede 1',
        images: [Array]
      },
      {
        id: '28057476-efdd-4f5d-9bcf-d7d3278ba116',
        service: 'consulta general',
        staff: 'alx flores valdez',
        branch: 'cede 1',
        images: [Array]=images
: 
Array(2)
0
: 
{id: 'ebf4006f-de65-4bc8-a3b5-ad7c7292abba', url: 'https://pub-c8a9c1f826c540b981f5cfb49c3a55ea.r2.dev/fddee54d-e8a6-4ead-a066-78ed1c12b819.png'}
1
: 
{id: 'd7c885c0-d43b-43f0-8dc5-9aebe7174c53', url: 'https://pub-c8a9c1f826c540b981f5cfb49c3a55ea.r2.dev/2b121f69-1dc7-4d41-b824-f3afd92e7849.png'}
l
      }
    ]
  } */

  // Segunda consulta: Obtener paciente solo cuando tengamos medicalHistoryData
  /* const { data: patientData, isLoading: isLoadingPatient } = usePatientById(
    medicalHistoryData?.patientId ?? ""
  ); */
   //fin

  //tercera consulta: obtener la actualziacion de historia agregada ala historia este registro es las veces que se agrego datos ala historia medica
/* lo que contiene  updateHistoryData es esto " {
  "id": "28057476-efdd-4f5d-9bcf-d7d3278ba116",
  "serviceId": "38be3cee-cd4d-477b-be95-15d20dff78d3",
  "staffId": "c924f118-1b7a-4b6d-bf75-f93433bcdc76",
  "branchId": "11525b00-0888-49c4-95e5-c284603b5b23",
  "medicalHistoryId": "5d344610-1aa2-46fd-91c8-ef9f97ce89d7",
  "prescription": false,
  "prescriptionId": "123e4567-e89b-12d3-a456-426614174000",
  "description": "Paciente presenta mejoría",
  "medicalLeave": false,
  "medicalLeaveStartDate": "2024-03-16",
  "medicalLeaveEndDate": "2024-03-19",
  "medicalLeaveDays": 3,
  "leaveDescription": "Reposo por 3 días",
  "isActive": true,
}" */
/*   const { data: updateHistoryData, isLoading: isLoadingUpdateHistory } = useUpdateHistoryById(
    medicalHistoryData?.updates.id ?? ""
  );
  console.log("🚀 ~ UpdateHistorySheet ~ updateHistoryData:", updateHistoryData) */
//fin

  //cuarta consulta: obtener receta medica si existiese en updateHistoryData si es haci tomar el prescriptionId pero antes para verificar si tiene o no una receta  lo verificaremos por el campo prescription que es boleano si es falso esta consulta no se ara 
/*   const { data: prescriptionData, isLoading: isLoadingPrescription } = useUpdateHistoryById(
    updateHistoryData?.prescriptionId?? ""
  );
  console.log("🚀 ~ UpdateHistorySheet ~ prescriptionData:", prescriptionData) */

  //fin
/*   const { data: branchesData, isLoading: isLoadingBranch } = useBranchesData();
  console.log("🚀 ~ UpdateHistorySheet ~ branchesData:", branchesData); */
/*   🚀 ~ UpdateHistorySheet ~ branchesData: 
(2) [{…}, {…}]
0
: 
{id: '11525b00-0888-49c4-95e5-c284603b5b23', name: 'cede 1', address: 'av uno', phone: null, isActive: true, …}
1
: 
{id: '64a9f330-4e01-4647-85dd-611f3e9ab4f4', name: 'sede 2', address: 'asdas', phone: '+51955555454', isActive: true, …}
l */
/*   const { data: staffData, isLoading: isLoadingStaff } = useStaffData();
  console.log("🚀 ~ UpdateHistorySheet ~ staffData:", staffData); */
/*   🚀 ~ UpdateHistorySheet ~ staffData: 
(3) [{…}, {…}, {…}]
0
: 
{id: 'c924f118-1b7a-4b6d-bf75-f93433bcdc76', staffTypeId: 'b8a6312c-8bba-4901-a927-a5d167f28b36', userId: null, name: 'alx', email: 'admin@admin.com', …}
1
: 
{id: 'b1d733db-f6df-4cb6-8c55-23370df59622', staffTypeId: 'b8a6312c-8bba-4901-a927-a5d167f28b36', userId: null, name: 'Angela', email: 'angela@gmail.com', …}
2
: 
birth
: 
"2025-02-06 19:00:00"
createdAt
: 
"2025-02-14 13:01:28"
dni
: 
"48453453"
email
: 
"admin@admin.com"
id
: 
"703eb74f-d7d4-4a1e-a3ad-0ade2e812016"
isActive
: 
true
lastName
: 
"asdasda"
name
: 
"MIguel"
phone
: 
"+456345345454"
staffType
: 
{name: 'recepcionista'}
staffTypeId
: 
"45bd10b6-a3e7-4ae4-a164-cd8d592f402a"
updatedAt
: 
"2025-02-14 13:01:28"
userId
: 
null
[[Prototype]]
: 
Object
l */
/*   const { data: sercivesData, isLoading: isLoadingServices } =
    useServicesData();
  console.log("🚀 ~ UpdateHistorySheet ~ sercivesData:", sercivesData); */
/*   🚀 ~ UpdateHistorySheet ~ sercivesData: 
[{…}]
0
: 
createdAt
: 
"2025-02-14 15:09:13"
description
: 
null
id
: 
"38be3cee-cd4d-477b-be95-15d20dff78d3"
isActive
: 
true
name
: 
"consulta general"
price
: 
100
serviceTypeId
: 
"0669b3fc-7f2d-4f94-8a03-fb6e5087212e"
updatedAt
: 
"2025-02-14 15:09:13"
[[Prototype]]
: 
Object
l */
  // Mostrar loading mientras se obtienen los datos
  if (
    isLoadingHistory ||
    isLoadingBranch ||
    isLoadingStaff ||
    isLoadingServices 
 /*    isLoadingPatient ||
    isLoadingPrescription ||
    isLoadingUpdateHistory */) {
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

      {patient && <PatientBasicInfo paciente={datapatient} />}

      {medicalHistory && (
        <MedicalBackground historialMedico={medicalHistory} />
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
      console.log("🚀 ~ UpdateHistorySheet ~ patient:", patient)
}
