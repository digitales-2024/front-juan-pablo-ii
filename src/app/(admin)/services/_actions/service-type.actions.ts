"use server";

import { http } from "@/utils/serverFetch";
import { 
  ServiceType, 
  CreateServiceTypeDto, 
  UpdateServiceTypeDto, 
  DeleteServiceTypesDto 
} from "../_interfaces/service-type.interface";
import { BaseApiResponse } from "@/types/api/types";
import { createSafeAction } from '@/utils/createSafeAction';
import { z } from 'zod';

type CreateServiceTypeResponse = BaseApiResponse | { error: string };
type UpdateServiceTypeResponse = BaseApiResponse | { error: string };
type DeleteServiceTypeResponse = BaseApiResponse | { error: string };

// Schema para getServiceTypes
const GetServiceTypesSchema = z.object({});

const getServiceTypesHandler = async () => {
  console.log("🚀 Iniciando getServiceTypesHandler");
  try {
    console.log("📡 Haciendo petición HTTP a /service-types");
    const [serviceTypes, error] = await http.get<ServiceType[]>("/service-types");
    console.log("📦 Respuesta:", { serviceTypes, error });

    if (error) {
      console.error("❌ Error detectado:", error);
      return { error: typeof error === 'object' && error !== null && 'message' in error 
        ? String(error.message) 
        : 'Error al obtener los tipos de servicio' };
    }

    if (!Array.isArray(serviceTypes)) {
      console.error("❌ ServiceTypes no es un array:", serviceTypes);
      return { error: 'Respuesta inválida del servidor' };
    }

    console.log("✅ Datos obtenidos correctamente:", serviceTypes);
    return { data: serviceTypes };
  } catch (error) {
    console.error("💥 Error en getServiceTypesHandler:", error);
    return { error: "Error al obtener los tipos de servicio" };
  }
}

export const getServiceTypes = await createSafeAction(GetServiceTypesSchema, getServiceTypesHandler);

export async function createServiceType(
  data: CreateServiceTypeDto
): Promise<CreateServiceTypeResponse> {
  try {
    const [serviceType, error] = await http.post<BaseApiResponse>("/service-types", data);

    if (error) {
      if (error.statusCode === 401) {
        return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
      }
      return { error: error.message };
    }

    return serviceType;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al crear el tipo de servicio" };
  }
}

export async function updateServiceType(
  id: string,
  data: UpdateServiceTypeDto
): Promise<UpdateServiceTypeResponse> {
  try {
    const [serviceType, error] = await http.patch<BaseApiResponse>(`/service-types/${id}`, data);

    if (error) {
      return { error: error.message };
    }

    return serviceType;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido" };
  }
}

export async function deleteServiceTypes(data: DeleteServiceTypesDto): Promise<DeleteServiceTypeResponse> {
  try {
    const [response, error] = await http.delete<BaseApiResponse>("/service-types/remove/all", data);

    if (error) {
      if (error.statusCode === 401) {
        return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
      }
      return { error: error.message };
    }

    return response;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al eliminar los tipos de servicio" };
  }
}

export async function reactivateServiceTypes(data: DeleteServiceTypesDto): Promise<DeleteServiceTypeResponse> {
  try {
    const [response, error] = await http.patch<BaseApiResponse>("/service-types/reactivate/all", data);

    if (error) {
      if (error.statusCode === 401) {
        return { error: "No autorizado. Por favor, inicie sesión nuevamente." };
      }
      return { error: error.message };
    }

    return response;
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Error desconocido al reactivar los tipos de servicio" };
  }
} 