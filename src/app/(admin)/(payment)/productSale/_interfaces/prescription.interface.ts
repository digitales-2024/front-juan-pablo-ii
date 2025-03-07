import { components } from "@/types/api";

export type PatientPrescriptionsPrototype = components["schemas"]["PatientPrescriptions"];
export type PrescriptionPrototype = components["schemas"]["Prescription"];
export type PrescriptionItemResponsePrototype = components["schemas"]["PrescriptionItemResponse"];
export type PrescriptionWithPatientPrototype = components["schemas"]["PrescriptionWithPatient"];
export type PrescriptionPatientPrototype = components["schemas"]["PrescriptionPatient"]
export type PrescriptionPatient = {
    id: string;
    name: string;
    lastName?: string;
    dni: string;
    birthDate: string;
    gender: string;
    address?: string;
    phone?: string;
    email?: string;
    isActive: boolean;
}

export type PrescriptionItemResponse = {
    id?: string;
    name?: string;
    quantity?: number;
    description?: string;
}

export type Prescription = {
    id: string;
    updateHistoryId: string;
    branchId: string;
    staffId: string;
    patientId: string;
    registrationDate: string;
    prescriptionMedicaments: PrescriptionItemResponse[];
    prescriptionServices: PrescriptionItemResponse[];
    description?: string;
    purchaseOrderId?: string;
    isActive: boolean;
}

export type PatientPrescriptions = {
    id: string;
    name: string;
    lastName?: string;
    dni: string;
    birthDate: string;
    gender: string;
    address?: string;
    phone?: string;
    email?: string;
    isActive: boolean;
    Prescription: Prescription[];
}

export type PrescriptionWithPatient = {
    id: string;
    updateHistoryId: string;
    branchId: string;
    staffId: string;
    patientId: string;
    registrationDate: string;
    prescriptionMedicaments: PrescriptionItemResponse[];
    prescriptionServices: PrescriptionItemResponse[];
    description?: string;
    purchaseOrderId?: string;
    isActive: boolean;
    patient: PrescriptionPatient;
};

const toPrescriptionWithPatient = (data: PatientPrescriptions): PrescriptionWithPatient[] => {
    if (!data.Prescription || data.Prescription.length === 0) {
        return [];
    }

    const patient: PrescriptionPatient = {
        id: data.id,
        name: data.name,
        lastName: data.lastName,
        dni: data.dni,
        birthDate: data.birthDate,
        gender: data.gender,
        address: data.address,
        phone: data.phone,
        email: data.email,
        isActive: data.isActive
    };

    return data.Prescription.map(prescription => ({
        ...prescription,
        patient
    }));
};

export { toPrescriptionWithPatient };
