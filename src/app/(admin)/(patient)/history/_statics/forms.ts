import { FormStatics } from "@/types/statics/forms";
import { UpdateMedicalHistoryInput } from "../_interfaces/history.interface";


export const UPDATEFORMSTATICS: FormStatics<UpdateMedicalHistoryInput> = {
    patientId: {
        required: false,
        isNotEditable: true,
        label: "ID del Paciente",
        defaultValue: "",
        type: "text",
        placeholder: "ID del paciente",
        name: "patientId",
    },
    medicalHistory: {
        required: false,
        label: "Historia Médica",
        defaultValue: "",
        type: "textarea",
        placeholder: "Detalles de la historia médica",
        name: "medicalHistory",
    },
    titulo: {
        required: true,
        label: "Título",
        defaultValue: "",
        type: "text",
        placeholder: "Título de la historia médica",
        name: "titulo",
    },
    contenido: {
        required: true,
        label: "Contenido",
        defaultValue: "",
        type: "textarea",
        placeholder: "Detalles de la historia médica",
        name: "contenido",
    },
    description: {
        required: false,
        label: "Descripción",
        defaultValue: "",
        type: "text",
        placeholder: "Descripción adicional",
        name: "description",
    },
};