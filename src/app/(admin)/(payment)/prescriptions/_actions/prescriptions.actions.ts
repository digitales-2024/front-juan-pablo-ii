"use server";

import { http } from "@/utils/serverFetch";

import { PatientPrescriptions, PrescriptionWithPatient, toPrescriptionWithPatient } from "../_interfaces/prescription.interface";

export type ListPatientPrescriptionsResponse =
  | PatientPrescriptions[]
  | { error: string };
export type ListPrescriptionsWithPatientResponse =
  | PrescriptionWithPatient[]
  | { error: string };
export type PatientPrescriptionResponse = PatientPrescriptions | { error: string };

/**
 * Obtiene todos los productos del catálogo.
 *
 * @returns Un objeto con una propiedad `data` que contiene un array de objetos `Product`,
 *          o un objeto con una propiedad `error` que contiene un mensaje de error.
 */
export async function getPatientsPrescription(limit = 10, offset = 0) {
  try {
    const limitOffsetConfig = `?limit=${limit}&offset=${offset}`;
    const [prescriptionList, error] = await http.get<ListPatientPrescriptionsResponse>(
      `/receta/patients${limitOffsetConfig}`
    );
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener el stock por producto",
      };
    }
    return prescriptionList;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

export async function getPrescriptionsWithPatient(limit = 10, offset = 0) {
  try {
    const limitOffsetConfig = `?limit=${limit}&offset=${offset}`;
    const [prescriptionList, error] = await http.get<ListPrescriptionsWithPatientResponse>(
      `/receta/withPatient${limitOffsetConfig}`
    );
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener el stock por producto",
      };
    }
    return prescriptionList;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

export async function getPatientPrescriptionsByDni(dni: string): Promise<ListPrescriptionsWithPatientResponse> {
  try {
    const [patientPrescriptions, error] = await http.get<PatientPrescriptionResponse>(
      `/receta/patient/${dni}`
    );
    if (error) {
      return {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error al obtener el stock por producto",
      };
    }
    if ('error' in patientPrescriptions) {
      return { error: patientPrescriptions.error };
    }
    
    return toPrescriptionWithPatient(patientPrescriptions)
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

// /**
//  * Crea un nuevo producto en el catálogo.
//  *
//  * Crea un nuevo producto en el catálogo.
//  *
//  * @param data - Un objeto con la información del producto a crear.
//  * @returns Un objeto con una propiedad `data` que contiene el producto creado,
//  *          o un objeto con una propiedad `error` que contiene un mensaje de error.
//  */
// export async function createOutgoing(
//   data: CreateOutgoingDto
// ): Promise<DetailedOutgoingResponse> {
//     try {
//         const [responseData, error] = await http.post<DetailedOutgoingResponse>("/outgoing/create/outgoingStorage", data);

//         if (error) {
//             return { error: error.message };
//         }

//         return responseData;
//     } catch (error) {
//         if (error instanceof Error) return { error: error.message };
//         return { error: "Error desconocido" };
//     }
// }

// /**
//  * Actualiza un producto en el catálogo.
//  *
//  * @param id - El identificador único del producto a actualizar.
//  * @param data - Un objeto con la información del producto a actualizar.
//  * @returns Un objeto con una propiedad `data` que contiene el producto actualizado,
//  *          o un objeto con una propiedad `error` que contiene un mensaje de error.
//  */
// export async function updateOutgoing(
//   id: string,
//   data: UpdateOutgoingDto
// ): Promise<DetailedOutgoingResponse> {
//   try {
//     const [responseData, error] = await http.patch<DetailedOutgoingResponse>(`/outgoing/${id}`, data);

//     if (error) {
//       return { error: error.message };
//     }

//     return responseData;
//   } catch (error) {
//     if (error instanceof Error) return { error: error.message };
//     return { error: "Error desconocido" };
//   }
// }

// export async function updateOutgoingStorage(
//   id: string,
//   data: UpdateOutgoingStorageDto
// ): Promise<DetailedOutgoingResponse> {
//   try {
//     const isTransferenceQuery = data.isTransference ? "?isTransference=true" : "";
//     const url = `/outgoing/update/outgoingStorage/${id}${isTransferenceQuery}`
//     console.log('Update url', url)
//     console.log('data send to back', data)
//     const [responseData, error] = await http.patch<DetailedOutgoingResponse>(url, data);

//     if (error) {
//       return { error: error.message };
//     }

//     return responseData;
//   } catch (error) {
//     if (error instanceof Error) return { error: error.message };
//     return { error: "Error desconocido" };
//   }
// }

// /**
//  * Elimina uno o varios productos del catálogo.
//  *
//  * @param data - Un objeto con la información de los productos a eliminar.
//  * @returns Un objeto con una propiedad `data` que contiene la respuesta del servidor,
//  *          o un objeto con una propiedad `error` que contiene un mensaje de error.
//  */
// export async function deleteOutgoing(data: DeleteOutgoingDto): Promise<ListUpdatedDetailedOutgoingResponse> {
//   try {
//     const [response, error] = await http.delete<BaseApiResponse>("/outgoing/remove/all", data);

//     if (error) {
//       if (error.statusCode === 401) {
//         return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
//       }
//       return { error: error.message };
//     }

//     return response;
//   } catch (error) {
//     if (error instanceof Error) return { error: error.message };
//     return { error: "Error desconocido al eliminar los productos" };
//   }
// }

// /**
//  * Reactiva uno o varios productos en el catálogo.
//  *
//  * @param data - Un objeto con la información de los productos a reactivar.
//  * @returns Un objeto con una propiedad `data` que contiene la respuesta del servidor,
//  *          o un objeto con una propiedad `error` que contiene un mensaje de error.
//  */
// export async function reactivateOutgoing(data: DeleteOutgoingDto): Promise<ListUpdatedDetailedOutgoingResponse> {
//   try {
//     const [response, error] = await http.patch<BaseApiResponse>("/outgoing/reactivate/all", data);

//     if (error) {
//       if (error.statusCode === 401) {
//         return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
//       }
//       return { error: error.message };
//     }

//     return response;
//   } catch (error) {
//     if (error instanceof Error) return { error: error.message };
//     return { error: "Error desconocido al reactivar los productos" };
//   }
// }
